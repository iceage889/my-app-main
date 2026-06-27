"use server";

import { createServiceClient } from "../lib/supabase/server";
import { createAndSendInvite } from "../lib/reviews/invite";

/** Used by the admin panel (slice 3) and the dev test route. */
export async function sendReviewInvite(bookingId: string) {
  return createAndSendInvite(bookingId);
}

export type SubmitResult = { ok: true } | { ok: false; error: string };

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function submitReview(formData: FormData): Promise<SubmitResult> {
  const token = String(formData.get("token") || "");
  const rating = Number(formData.get("rating") || 0);
  const comment = String(formData.get("comment") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const photo = formData.get("photo");

  if (!token) return { ok: false, error: "Invalid review link." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return { ok: false, error: "Please select a star rating." };
  if (!comment) return { ok: false, error: "Please write a short review." };

  try {
    const supabase = createServiceClient();

    const { data: booking, error } = await supabase
      .from("bookings")
      .select("id, name, to_city, review_token_expires_at, reviewed_at")
      .eq("review_token", token)
      .single();

    if (error || !booking)
      return { ok: false, error: "This review link is invalid." };
    if (booking.reviewed_at)
      return { ok: false, error: "This review link has already been used." };
    if (
      !booking.review_token_expires_at ||
      new Date(booking.review_token_expires_at) < new Date()
    )
      return { ok: false, error: "This review link has expired." };

    // Optional photo upload.
    let imageUrl: string | null = null;
    if (photo instanceof File && photo.size > 0) {
      if (!ALLOWED_IMAGE_TYPES.includes(photo.type))
        return { ok: false, error: "Photo must be a JPG, PNG or WEBP." };
      if (photo.size > MAX_IMAGE_BYTES)
        return { ok: false, error: "Photo must be under 5MB." };

      const ext = photo.type.split("/")[1] || "jpg";
      const path = `${booking.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("review-photos")
        .upload(path, photo, { contentType: photo.type });

      if (uploadError) {
        console.error("Review photo upload failed:", uploadError);
      } else {
        imageUrl = supabase.storage.from("review-photos").getPublicUrl(path)
          .data.publicUrl;
      }
    }

    const { error: insertError } = await supabase.from("reviews").insert({
      booking_id: booking.id,
      name: booking.name,
      city: city || booking.to_city,
      rating,
      comment,
      image_url: imageUrl,
      approved: false,
    });

    if (insertError) {
      console.error("Review insert failed:", insertError);
      return { ok: false, error: "Could not save your review. Please try again." };
    }

    // Mark the token used.
    await supabase
      .from("bookings")
      .update({ reviewed_at: new Date().toISOString() })
      .eq("id", booking.id);

    return { ok: true };
  } catch (e) {
    if (e instanceof Error && e.message === "SUPABASE_NOT_CONFIGURED")
      return { ok: false, error: "Reviews are not set up yet." };
    console.error("Submit review error:", e);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
