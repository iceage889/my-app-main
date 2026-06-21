"use client";

import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format } from "date-fns";
import {
  IconX,
  IconArrowLeft,
  IconCheck,
  IconCalendar,
  IconClock,
} from "@tabler/icons-react";
import { serviceCities } from "../../lib/pricing";

type Step = "date" | "time" | "form" | "success";

// Mocked availability — replaced with backend data later.
const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

type FormState = {
  name: string;
  phone: string;
  email: string;
  location: string;
};

const EMPTY_FORM: FormState = { name: "", phone: "", email: "", location: "" };

export default function BookingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("date");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  // Reset everything when the modal is reopened.
  useEffect(() => {
    if (open) {
      setStep("date");
      setDate(undefined);
      setTime("");
      setForm(EMPTY_FORM);
    }
  }, [open]);

  // Lock background scroll while open.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  if (!open) return null;

  const formValid =
    form.name.trim() &&
    form.phone.trim() &&
    form.email.trim() &&
    form.location;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) return;
    // UI-only: success email is wired up in the backend phase.
    setStep("success");
  };

  const stepIndex = { date: 0, time: 1, form: 2, success: 3 }[step];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Book a move"
    >
      <div
        className="card relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-b-none rounded-t-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-5 py-4">
          <div className="flex items-center gap-2">
            {step !== "date" && step !== "success" && (
              <button
                onClick={() => setStep(step === "time" ? "date" : "time")}
                className="rounded-lg p-1 text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
                aria-label="Go back"
              >
                <IconArrowLeft className="h-5 w-5" />
              </button>
            )}
            <h2 className="text-lg font-bold">
              {step === "date" && "Pick a date"}
              {step === "time" && "Pick a time"}
              {step === "form" && "Your details"}
              {step === "success" && "Booking received"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
            aria-label="Close"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        {step !== "success" && (
          <div className="flex gap-1.5 px-5 pt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full transition-colors"
                style={{
                  backgroundColor:
                    i <= stepIndex
                      ? "var(--color-accent)"
                      : "var(--color-line-strong)",
                }}
              />
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {step === "date" && (
            <div className="flex flex-col items-center">
              <DayPicker
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  if (d) setStep("time");
                }}
                disabled={{ before: new Date() }}
                className="rdp-root"
              />
            </div>
          )}

          {step === "time" && (
            <div>
              <p className="mb-4 flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
                <IconCalendar className="h-4 w-4 text-[var(--color-accent)]" />
                {date ? format(date, "EEEE, d MMMM yyyy") : ""}
              </p>
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => {
                      setTime(slot);
                      setStep("form");
                    }}
                    className={`rounded-xl border px-2 py-2.5 text-sm font-medium transition ${
                      time === slot
                        ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-ink)]"
                        : "border-[var(--color-line-strong)] text-[var(--color-ink-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-ink)]"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "form" && (
            <form id="booking-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 rounded-xl bg-[var(--color-surface-2)] px-4 py-3 text-sm">
                <span className="flex items-center gap-1.5">
                  <IconCalendar className="h-4 w-4 text-[var(--color-accent)]" />
                  {date ? format(date, "d MMM yyyy") : ""}
                </span>
                <span className="flex items-center gap-1.5">
                  <IconClock className="h-4 w-4 text-[var(--color-accent)]" />
                  {time}
                </span>
              </div>

              <Field label="Full name">
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  placeholder="John Doe"
                />
              </Field>

              <Field label="Phone">
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
                  placeholder="+31 6 1234 5678"
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </Field>

              <Field label="Location">
                <select
                  required
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select your city
                  </option>
                  {serviceCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </Field>
            </form>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent-soft)]">
                <IconCheck className="h-8 w-8 text-[var(--color-accent)]" />
              </div>
              <h3 className="text-xl font-bold">Thank you, {form.name}!</h3>
              <p className="mt-2 max-w-xs text-sm text-[var(--color-ink-muted)]">
                Your move is requested for{" "}
                <span className="text-[var(--color-ink)]">
                  {date ? format(date, "d MMM yyyy") : ""} at {time}
                </span>{" "}
                in {form.location}. A confirmation email is on its way to{" "}
                <span className="text-[var(--color-ink)]">{form.email}</span>.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--color-line)] px-5 py-4">
          {step === "form" && (
            <button
              type="submit"
              form="booking-form"
              disabled={!formValid}
              className="btn-accent w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              Confirm booking
            </button>
          )}
          {step === "success" && (
            <button onClick={onClose} className="btn-accent w-full">
              Done
            </button>
          )}
          {(step === "date" || step === "time") && (
            <p className="text-center text-xs text-[var(--color-ink-subtle)]">
              Step {stepIndex + 1} of 3
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[var(--color-line-strong)] bg-[var(--color-base)] px-4 py-2.5 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-ink-subtle)] focus:border-[var(--color-accent)]";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--color-ink-muted)]">
        {label}
      </span>
      {children}
    </label>
  );
}
