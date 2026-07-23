import { Resend } from "resend";
import { createServiceClient } from "../supabase/server";

export type InviteResult =
  | { ok: true; token: string }
  | { ok: false; error: string };

/**
 * Creates a single-use, 7-day review token for a booking and emails the
 * customer a thank-you + review link. Shared by the admin action (slice 3)
 * and the dev test route. Plain function (no "use server") so it can be reused.
 */
export async function createAndSendInvite(
  bookingId: string
): Promise<InviteResult> {
  try {
    const supabase = createServiceClient();

    const { data: booking, error } = await supabase
      .from("bookings")
      .select("id, name, email")
      .eq("id", bookingId)
      .single();

    if (error || !booking) {
      return { ok: false, error: "Booking not found." };
    }

    const token = crypto.randomUUID();
    const expires = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();

    const { error: updateError } = await supabase
      .from("bookings")
      .update({
        review_token: token,
        review_token_expires_at: expires,
        reviewed_at: null,
      })
      .eq("id", bookingId);

    if (updateError) {
      console.error("Invite token update failed:", updateError);
      return { ok: false, error: "Could not create the review invite." };
    }

    await sendInviteEmail(booking.name, booking.email, token);
    return { ok: true, token };
  } catch (e) {
    if (e instanceof Error && e.message === "SUPABASE_NOT_CONFIGURED") {
      return { ok: false, error: "Supabase is not configured." };
    }
    console.error("Invite error:", e);
    return { ok: false, error: "Something went wrong creating the invite." };
  }
}

async function sendInviteEmail(name: string, email: string, token: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL;
  if (!apiKey || apiKey.startsWith("your-") || !from) return;

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const link = `${base}/review/${token}`;
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from,
    to: email,
    subject: "Thanks for moving with MovingPace — how did we do?",
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
        <h2 style="color:#14213d;">Thank you, ${escapeHtml(name)}!</h2>
        <p>We hope your move went smoothly. We'd really appreciate it if you took a moment to share how it went.</p>
        <p style="margin:24px 0;">
          <a href="${link}" style="background:#f5a800;color:#0a1128;text-decoration:none;padding:12px 20px;border-radius:8px;display:inline-block;font-weight:bold;">Leave a review</a>
        </p>
        <p style="font-size:13px;color:#666;">This link is valid for 7 days. If the button doesn't work, paste this into your browser:<br/>${link}</p>
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
