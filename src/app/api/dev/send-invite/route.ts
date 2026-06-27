import { NextRequest, NextResponse } from "next/server";
import { createAndSendInvite } from "../../../lib/reviews/invite";

/**
 * TEMPORARY dev-only helper to test the review-invite flow before the admin
 * panel exists. Visit: /api/dev/send-invite?bookingId=<uuid>
 * Remove this route once the admin panel (slice 3) can trigger invites.
 */
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const bookingId = req.nextUrl.searchParams.get("bookingId");
  if (!bookingId) {
    return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
  }

  const result = await createAndSendInvite(bookingId);
  return NextResponse.json(result);
}
