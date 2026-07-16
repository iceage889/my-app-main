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
  IconAlertTriangle,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import { serviceCities } from "../../lib/pricing";
import { createBooking } from "./actions";
import Spinner from "../spinner";

type Step = "date" | "time" | "form" | "success";

const OTHER = "Other";
const WHATSAPP_NUMBER = "31641546222";

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
  fromCity: string;
  fromOther: string;
  toCity: string;
  toOther: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  email: "",
  fromCity: "",
  fromOther: "",
  toCity: "",
  toOther: "",
};

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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Reset everything when the modal is reopened.
  useEffect(() => {
    if (open) {
      setStep("date");
      setDate(undefined);
      setTime("");
      setForm(EMPTY_FORM);
      setSubmitting(false);
      setSubmitError("");
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

  // Resolve the chosen city ("Other" uses the typed value).
  const fromResolved =
    form.fromCity === OTHER ? form.fromOther.trim() : form.fromCity;
  const toResolved = form.toCity === OTHER ? form.toOther.trim() : form.toCity;

  const fromOutOfRegion = form.fromCity === OTHER;
  const toOutOfRegion = form.toCity === OTHER;
  const outOfRegion = fromOutOfRegion || toOutOfRegion;

  const formValid =
    form.name.trim() &&
    form.phone.trim() &&
    form.email.trim() &&
    fromResolved &&
    toResolved;

  // Pre-filled WhatsApp message for out-of-region requests.
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi MovingPace, I'd like a move from ${fromResolved || "?"} to ${
      toResolved || "?"
    }${date ? ` on ${format(date, "d MMM yyyy")}` : ""}${
      time ? ` at ${time}` : ""
    }. One of these is outside your listed area — can you help?`
  )}`;

  const outOfRegionCities = [
    fromOutOfRegion && form.fromOther.trim(),
    toOutOfRegion && form.toOther.trim(),
  ].filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid || submitting) return;

    setSubmitting(true);
    setSubmitError("");

    const result = await createBooking({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      fromCity: fromResolved,
      toCity: toResolved,
      moveDate: date ? format(date, "yyyy-MM-dd") : "",
      moveTime: time,
      outOfRegion,
    });

    setSubmitting(false);

    if (result.ok) {
      setStep("success");
    } else {
      setSubmitError(result.error);
    }
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
        className="card relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-b-none rounded-t-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-6 py-4">
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
          <div className="flex gap-1.5 px-6 pt-4">
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
        <div className="flex-1 overflow-y-auto px-6 py-5">
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

              {/* From / To */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <CityField
                  label="Moving from"
                  selectValue={form.fromCity}
                  otherValue={form.fromOther}
                  onSelect={(v) => setForm({ ...form, fromCity: v })}
                  onOther={(v) => setForm({ ...form, fromOther: v })}
                />
                <CityField
                  label="Moving to"
                  selectValue={form.toCity}
                  otherValue={form.toOther}
                  onSelect={(v) => setForm({ ...form, toCity: v })}
                  onOther={(v) => setForm({ ...form, toOther: v })}
                />
              </div>

              {/* Out-of-region notice */}
              {outOfRegion && (
                <div className="rounded-xl border border-[var(--color-accent)] bg-[var(--color-accent-soft)] p-4">
                  <div className="flex items-start gap-2.5">
                    <IconAlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent)]" />
                    <p className="text-sm text-[var(--color-ink)]">
                      {outOfRegionCities.length > 0 ? (
                        <>
                          We don&apos;t currently list{" "}
                          <span className="font-semibold">
                            {outOfRegionCities.join(" and ")}
                          </span>{" "}
                          in our service area.
                        </>
                      ) : (
                        <>That location is outside our usual service area.</>
                      )}{" "}
                      Message us on WhatsApp and we&apos;ll see what we can do —
                      or send the request below anyway.
                    </p>
                  </div>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
                  >
                    <IconBrandWhatsapp className="h-5 w-5" />
                    Contact us on WhatsApp
                  </a>
                </div>
              )}

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
            </form>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent-soft)]">
                <IconCheck className="h-8 w-8 text-[var(--color-accent)]" />
              </div>
              <h3 className="text-xl font-bold">Thank you, {form.name}!</h3>
              <p className="mt-2 max-w-sm text-sm text-[var(--color-ink-muted)]">
                Your move is requested from{" "}
                <span className="text-[var(--color-ink)]">{fromResolved}</span> to{" "}
                <span className="text-[var(--color-ink)]">{toResolved}</span> on{" "}
                <span className="text-[var(--color-ink)]">
                  {date ? format(date, "d MMM yyyy") : ""} at {time}
                </span>
                . A confirmation email is on its way to{" "}
                <span className="text-[var(--color-ink)]">{form.email}</span>.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--color-line)] px-6 py-4">
          {step === "form" && (
            <>
              {submitError && (
                <p className="mb-3 text-center text-sm text-[var(--color-accent)]">
                  {submitError}
                </p>
              )}
              <button
                type="submit"
                form="booking-form"
                disabled={!formValid || submitting}
                className="btn-accent w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Spinner /> Sending…
                  </>
                ) : (
                  "Confirm booking"
                )}
              </button>
            </>
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

function CityField({
  label,
  selectValue,
  otherValue,
  onSelect,
  onOther,
}: {
  label: string;
  selectValue: string;
  otherValue: string;
  onSelect: (value: string) => void;
  onOther: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <select
        required
        value={selectValue}
        onChange={(e) => onSelect(e.target.value)}
        className={inputClass}
      >
        <option value="" disabled>
          Select a city
        </option>
        {serviceCities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
        <option value={OTHER}>Other (outside these areas)</option>
      </select>
      {selectValue === OTHER && (
        <input
          type="text"
          required
          value={otherValue}
          onChange={(e) => onOther(e.target.value)}
          className={`${inputClass} mt-2`}
          placeholder="Type the city name"
        />
      )}
    </Field>
  );
}
