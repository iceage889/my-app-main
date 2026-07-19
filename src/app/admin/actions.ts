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

const BOOKING_STATUSES = ["new", "accepted", "completed", "cancelled"];

export async function updateBookingStatus(
  id: string,
  status: string,
  message?: string
): Promise<ActionResult> {
  await requireAdmin();
  if (!BOOKING_STATUSES.includes(status)) {
    return { ok: false, error: "Invalid status." };
  }

  const supabase = createServiceClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select(
      "id, name, email, from_city, to_city, move_date, move_time, service_type, route, route_rate, review_token, reviewed_at"
    )
    .eq("id", id)
    .single();

  const trimmed = message?.trim() || null;

  const { error } = await supabase
    .from("bookings")
    .update({ status, status_message: trimmed })
    .eq("id", id);

  if (error) {
    console.error("Status update failed:", error);
    return { ok: false, error: "Could not update the booking." };
  }

  // Notify the customer on accepted/cancelled — never fail the update on email.
  if (booking && (status === "accepted" || status === "cancelled")) {
    try {
      await sendStatusEmail(booking, status, trimmed);
    } catch (e) {
      console.error("Status email failed:", e);
    }
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

type BookingForEmail = {
  name: string;
  email: string;
  from_city: string;
  to_city: string;
  move_date: string;
  move_time: string;
  service_type: string;
  route: string | null;
  route_rate: string | null;
};

async function sendStatusEmail(
  booking: BookingForEmail,
  status: "accepted" | "cancelled",
  message: string | null
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL;
  if (!apiKey || apiKey.startsWith("your-") || !from) return;

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const what =
    booking.service_type === "airport"
      ? `${booking.route ?? `${booking.from_city} → ${booking.to_city}`}${
          booking.route_rate ? ` (${booking.route_rate})` : ""
        }`
      : `${booking.from_city} → ${booking.to_city}`;
  const summary = `${what} on ${booking.move_date} at ${booking.move_time}`;

  const accepted = status === "accepted";

  await resend.emails.send({
    from,
    to: booking.email,
    subject: accepted
      ? "Your MovingPace booking is confirmed"
      : "Your MovingPace booking has been cancelled",
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
        <h2 style="color:#e11d2a;">${
          accepted ? "Booking confirmed" : "Booking cancelled"
        }</h2>
        <p>Hi ${escapeHtml(booking.name)},</p>
        <p>${
          accepted
            ? "Good news — your booking is confirmed. We'll see you as planned:"
            : "Unfortunately your booking has been cancelled:"
        }</p>
        <p><strong>${escapeHtml(summary)}</strong></p>
        ${
          message
            ? `<p><strong>${
                accepted ? "Message from us" : "Reason"
              }:</strong> ${escapeHtml(message)}</p>`
            : ""
        }
        ${
          accepted
            ? `<p>Payment is on arrival, before the job begins — cash or bank transfer (Tikkie/iDEAL). Prices exclude 21% BTW.</p>`
            : `<p>If you have any questions, just reply to this email or reach us on WhatsApp.</p>`
        }
        <p style="margin-top:24px;">— MovingPace</p>
      </div>
    `,
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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
