"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServiceClient } from "../lib/supabase/server";
import { createAuthServerClient, getAdminUser } from "../lib/supabase/auth-server";
import { isAllowedAdmin } from "../lib/admin/auth";
import { createAndSendInvite } from "../lib/reviews/invite";

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Defense in depth — never trust the middleware alone for mutations. */
async function requireAdmin() {
  const user = await getAdminUser();
  if (!user || !isAllowedAdmin(user.email)) {
    throw new Error("Unauthorized");
  }
}

const BOOKING_STATUSES = ["new", "completed", "cancelled"];

export async function updateBookingStatus(
  id: string,
  status: string
): Promise<ActionResult> {
  await requireAdmin();
  if (!BOOKING_STATUSES.includes(status)) {
    return { ok: false, error: "Invalid status." };
  }

  const supabase = createServiceClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, review_token, reviewed_at")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Status update failed:", error);
    return { ok: false, error: "Could not update the booking." };
  }

  // Completing a move (for the first time) fires the review invite.
  if (
    status === "completed" &&
    booking &&
    !booking.review_token &&
    !booking.reviewed_at
  ) {
    await createAndSendInvite(id);
  }

  revalidatePath("/admin/bookings");
  return { ok: true };
}

export async function sendInvite(id: string): Promise<ActionResult> {
  await requireAdmin();
  const result = await createAndSendInvite(id);
  revalidatePath("/admin/bookings");
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

async function setReviewApproved(
  id: string,
  approved: boolean
): Promise<ActionResult> {
  await requireAdmin();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("reviews")
    .update({ approved })
    .eq("id", id);

  if (error) {
    console.error("Review update failed:", error);
    return { ok: false, error: "Could not update the review." };
  }

  revalidateReviewSurfaces();
  return { ok: true };
}

export async function approveReview(id: string) {
  return setReviewApproved(id, true);
}

export async function unapproveReview(id: string) {
  return setReviewApproved(id, false);
}

export async function deleteReview(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = createServiceClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);

  if (error) {
    console.error("Review delete failed:", error);
    return { ok: false, error: "Could not delete the review." };
  }

  revalidateReviewSurfaces();
  return { ok: true };
}

export async function signOut() {
  const supabase = await createAuthServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/** Refresh both the admin view and the public pages that show reviews. */
function revalidateReviewSurfaces() {
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
}
