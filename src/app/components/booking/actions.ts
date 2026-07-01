"use server";

import { Resend } from "resend";
import { createServiceClient } from "../../lib/supabase/server";

export type BookingPayload = {
  name: string;
  phone: string;
  email: string;
  fromCity: string;
  toCity: string;
  moveDate: string; // yyyy-MM-dd
  moveTime: string;
  outOfRegion: boolean;
};

export type BookingResult = { ok: true } | { ok: false; error: string };

export async function createBooking(
  payload: BookingPayload
): Promise<BookingResult> {
  // 1. Persist to Supabase
  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from("bookings").insert({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      from_city: payload.fromCity,
      to_city: payload.toCity,
      move_date: payload.moveDate,
      move_time: payload.moveTime,
      out_of_region: payload.outOfRegion,
    });

    if (error) {
      console.error("Booking insert failed:", error);
      return {
        ok: false,
        error: "We couldn't save your booking. Please try again.",
      };
    }
  } catch (e) {
    if (e instanceof Error && e.message === "SUPABASE_NOT_CONFIGURED") {
      return {
        ok: false,
        error: "Booking is not set up yet. Please contact us on WhatsApp.",
      };
    }
    console.error("Booking error:", e);
    return { ok: false, error: "Something went wrong. Please try again." };
  }

  // 2. Send emails — never fail the booking if email has a hiccup.
  try {
    await sendBookingEmails(payload);
  } catch (e) {
    console.error("Booking email failed:", e);
  }

  return { ok: true };
}

async function sendBookingEmails(payload: BookingPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL;
  const admin = process.env.BOOKING_ADMIN_EMAIL;

  // Skip silently if email isn't configured yet (scaffold phase).
  if (!apiKey || apiKey.startsWith("your-") || !from || !admin) return;

  const resend = new Resend(apiKey);
  const summary = `${payload.fromCity} → ${payload.toCity} on ${payload.moveDate} at ${payload.moveTime}`;

  // Customer confirmation
  await resend.emails.send({
    from,
    to: payload.email,
    subject: "Your MovingPace booking request",
    html: customerEmailHtml(payload, summary),
  });

  // Admin notification
  await resend.emails.send({
    from,
    to: admin,
    replyTo: payload.email,
    subject: `New booking — ${summary}`,
    html: adminEmailHtml(payload, summary),
  });
}

function customerEmailHtml(payload: BookingPayload, summary: string) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
      <h2 style="color:#e11d2a;">Thanks, ${escapeHtml(payload.name)}!</h2>
      <p>We've received your move request and will be in touch shortly to confirm.</p>
      <p><strong>Details:</strong><br/>${escapeHtml(summary)}</p>
      ${
        payload.outOfRegion
          ? `<p style="color:#b3101c;">Note: one of your locations is outside our usual service area — we'll confirm whether we can help.</p>`
          : ""
      }
      <p style="margin-top:24px;">— MovingPace</p>
    </div>
  `;
}

function adminEmailHtml(payload: BookingPayload, summary: string) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
      <h2>New booking request</h2>
      <p><strong>${escapeHtml(summary)}</strong></p>
      <ul>
        <li>Name: ${escapeHtml(payload.name)}</li>
        <li>Phone: ${escapeHtml(payload.phone)}</li>
        <li>Email: ${escapeHtml(payload.email)}</li>
        <li>From: ${escapeHtml(payload.fromCity)}</li>
        <li>To: ${escapeHtml(payload.toCity)}</li>
        <li>Date: ${escapeHtml(payload.moveDate)} at ${escapeHtml(payload.moveTime)}</li>
        <li>Out of region: ${payload.outOfRegion ? "Yes" : "No"}</li>
      </ul>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
