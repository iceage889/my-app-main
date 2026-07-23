"use server";

import { Resend } from "resend";
import { createServiceClient } from "../../lib/supabase/server";
import { hourlyRateFor, DISTANCE_RATE_PER_KM } from "../../lib/pricing";

export type BookingPayload = {
  name: string;
  phone: string;
  email: string;
  fromCity: string;
  toCity: string;
  moveDate: string; // yyyy-MM-dd
  moveTime: string;
  outOfRegion: boolean;
  serviceType: "moving" | "airport";
  route?: string;
  routeRate?: string;
  fromAddress?: string;
  toAddress?: string;
  distanceKm?: number;
};

export type EstimateInput = {
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  toCity: string;
};

export type EstimateResult =
  | { ok: true; km: number; kmCharge: number; hourlyRate: number }
  | { ok: false };

/**
 * Driving distance via the public OSRM demo server (free, no key, best-effort).
 * Fails soft: any error or timeout simply means no estimate is shown.
 */
export async function getRouteEstimate(
  input: EstimateInput
): Promise<EstimateResult> {
  const hourlyRate = hourlyRateFor(input.toCity);
  if (!hourlyRate) return { ok: false };

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${input.fromLng},${input.fromLat};${input.toLng},${input.toLat}?overview=false`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    });
    if (!res.ok) return { ok: false };
    const json = await res.json();
    const meters = json?.routes?.[0]?.distance;
    if (typeof meters !== "number" || meters <= 0) return { ok: false };

    const km = Math.round(meters / 100) / 10; // one decimal
    const kmCharge = Math.round(km * DISTANCE_RATE_PER_KM * 100) / 100;
    return { ok: true, km, kmCharge, hourlyRate };
  } catch {
    return { ok: false };
  }
}

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
      service_type: payload.serviceType,
      route: payload.route ?? null,
      route_rate: payload.routeRate ?? null,
      from_address: payload.fromAddress || null,
      to_address: payload.toAddress || null,
      distance_km: payload.distanceKm ?? null,
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

function isAirport(payload: BookingPayload) {
  return payload.serviceType === "airport";
}

function summaryFor(payload: BookingPayload) {
  const when = `on ${payload.moveDate} at ${payload.moveTime}`;
  if (isAirport(payload)) {
    return `${payload.route ?? `${payload.fromCity} → ${payload.toCity}`}${
      payload.routeRate ? ` (${payload.routeRate})` : ""
    } ${when}`;
  }
  return `${payload.fromCity} → ${payload.toCity} ${when}`;
}

async function sendBookingEmails(payload: BookingPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL;
  const admin = process.env.BOOKING_ADMIN_EMAIL;

  // Skip silently if email isn't configured yet (scaffold phase).
  if (!apiKey || apiKey.startsWith("your-") || !from || !admin) return;

  const resend = new Resend(apiKey);
  const summary = summaryFor(payload);
  const label = isAirport(payload) ? "Airport & transfer" : "Moving";

  // Customer confirmation
  await resend.emails.send({
    from,
    to: payload.email,
    subject: "Your MovingPace booking request",
    html: customerEmailHtml(payload, summary, label),
  });

  // Admin notification
  await resend.emails.send({
    from,
    to: admin,
    replyTo: payload.email,
    subject: `New ${label.toLowerCase()} booking — ${summary}`,
    html: adminEmailHtml(payload, summary, label),
  });
}

function customerEmailHtml(
  payload: BookingPayload,
  summary: string,
  label: string
) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
      <h2 style="color:#14213d;">Thanks, ${escapeHtml(payload.name)}!</h2>
      <p>We've received your ${escapeHtml(label.toLowerCase())} request and will be in touch shortly to confirm.</p>
      <p><strong>Details:</strong><br/>${escapeHtml(summary)}</p>
      ${
        payload.outOfRegion
          ? `<p style="color:#b45309;">Note: one of your locations is outside our usual service area — we'll confirm whether we can help.</p>`
          : ""
      }
      <p>Payment is on arrival, before the job begins — cash or bank transfer (Tikkie/iDEAL). Prices exclude 21% BTW.</p>
      <p style="margin-top:24px;">— MovingPace</p>
    </div>
  `;
}

function adminEmailHtml(
  payload: BookingPayload,
  summary: string,
  label: string
) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
      <h2>New ${escapeHtml(label.toLowerCase())} booking request</h2>
      <p><strong>${escapeHtml(summary)}</strong></p>
      <ul>
        <li>Service: ${escapeHtml(label)}</li>
        <li>Name: ${escapeHtml(payload.name)}</li>
        <li>Phone: ${escapeHtml(payload.phone)}</li>
        <li>Email: ${escapeHtml(payload.email)}</li>
        ${
          isAirport(payload)
            ? `<li>Route: ${escapeHtml(payload.route ?? "")} ${escapeHtml(payload.routeRate ?? "")}</li>`
            : `<li>From: ${escapeHtml(payload.fromAddress || payload.fromCity)}</li>
        <li>To: ${escapeHtml(payload.toAddress || payload.toCity)}</li>`
        }
        <li>Date: ${escapeHtml(payload.moveDate)} at ${escapeHtml(payload.moveTime)}</li>
        ${
          payload.distanceKm
            ? `<li>Distance: ~${payload.distanceKm} km (≈ €${(
                payload.distanceKm * DISTANCE_RATE_PER_KM
              ).toFixed(2)} km charge)</li>`
            : ""
        }
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
