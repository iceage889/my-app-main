"use client";

import React, { createContext, useContext, useState } from "react";
import BookingModal from "./booking-modal";

type BookingContextType = {
  open: boolean;
  openBooking: () => void;
  closeBooking: () => void;
};

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openBooking = () => setOpen(true);
  const closeBooking = () => setOpen(false);

  return (
    <BookingContext.Provider value={{ open, openBooking, closeBooking }}>
      {children}
      <BookingModal open={open} onClose={closeBooking} />
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return ctx;
}
