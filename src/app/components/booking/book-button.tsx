"use client";

import { useBooking } from "./booking-context";

export default function BookButton({
  className = "",
  children = "Book a Move",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { openBooking } = useBooking();
  return (
    <button onClick={openBooking} className={className || "btn-accent"}>
      {children}
    </button>
  );
}
