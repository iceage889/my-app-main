import type { Metadata } from "next";
import BookingWizard from "./booking-wizard";

export const metadata: Metadata = {
  title: "Book a Move",
  description:
    "Book your move or airport transfer online — pick a date, time and route in under a minute. Serving Almere, Amsterdam and surrounding areas.",
};

export default function BookPage() {
  return (
    <section className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 md:py-14">
      <BookingWizard />
    </section>
  );
}
