import type { Metadata } from "next";
import { createServiceClient } from "../../../lib/supabase/server";
import ReviewForm from "./review-form";

export const metadata: Metadata = {
  title: "Leave a Review",
  robots: { index: false, follow: false },
};

type PageState = "form" | "invalid" | "expired" | "used";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  let state: PageState = "invalid";
  let name = "";
  let city = "";

  try {
    const supabase = createServiceClient();
    const { data: booking } = await supabase
      .from("bookings")
      .select("name, to_city, review_token_expires_at, reviewed_at")
      .eq("review_token", token)
      .single();

    if (booking) {
      name = booking.name;
      city = booking.to_city ?? "";
      if (booking.reviewed_at) {
        state = "used";
      } else if (
        !booking.review_token_expires_at ||
        new Date(booking.review_token_expires_at) < new Date()
      ) {
        state = "expired";
      } else {
        state = "form";
      }
    }
  } catch {
    state = "invalid";
  }

  return (
    <section className="container mx-auto max-w-xl px-6 py-16 md:py-24">
      {state === "form" ? (
        <ReviewForm token={token} name={name} defaultCity={city} />
      ) : (
        <div className="card p-8 text-center">
          <h1 className="text-2xl font-bold">
            {state === "used" && "Review already submitted"}
            {state === "expired" && "This review link has expired"}
            {state === "invalid" && "Invalid review link"}
          </h1>
          <p className="mt-3 text-[var(--color-ink-muted)]">
            {state === "used" &&
              "Thanks — we've already received your review."}
            {state === "expired" &&
              "Review links are valid for 7 days. Message us on WhatsApp if you'd still like to leave a review."}
            {state === "invalid" &&
              "This link doesn't look right. Please check the link in your email."}
          </p>
        </div>
      )}
    </section>
  );
}
