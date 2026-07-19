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
  IconTruck,
  IconPlane,
} from "@tabler/icons-react";
import { serviceCities, airportRoutes } from "../../lib/pricing";
import { createBooking } from "./actions";
import Spinner from "../spinner";

type Step = "service" | "date" | "time" | "form" | "success";
type ServiceType = "moving" | "airport";

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
  route: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  email: "",
  fromCity: "",
  fromOther: "",
  toCity: "",
  toOther: "",
  route: "",
};

/** "Almere ↔ Schiphol" → { from: "Almere", to: "Schiphol" } */
function parseRoute(route: string) {
  const parts = route.replace(" (luggage)", "").split(/\s*[↔→]\s*/);
  return { from: parts[0] || route, to: parts[1] || route };
}

export default function BookingModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("service");
  const [service, setService] = useState<ServiceType>("moving");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Reset everything when the modal is reopened.
  useEffect(() => {
    if (open) {
      setStep("service");
      setService("moving");
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

  const isMoving = service === "moving";

  // Resolve the chosen cities ("Other" uses the typed value).
  const fromResolved = isMoving
    ? form.fromCity === OTHER
      ? form.fromOther.trim()
      : form.fromCity
    : form.route
      ? parseRoute(form.route).from
      : "";
  const toResolved = isMoving
    ? form.toCity === OTHER
      ? form.toOther.trim()
      : form.toCity
    : form.route
      ? parseRoute(form.route).to
      : "";

  const fromOutOfRegion = isMoving && form.fromCity === OTHER;
  const toOutOfRegion = isMoving && form.toCity === OTHER;
  const outOfRegion = fromOutOfRegion || toOutOfRegion;

  const selectedRoute = airportRoutes.find((r) => r.route === form.route);

  const formValid =
    form.name.trim() &&
    form.phone.trim() &&
    form.email.trim() &&
    (isMoving ? fromResolved && toResolved : Boolean(form.route));

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
      serviceType: service,
      route: isMoving ? undefined : form.route,
      routeRate: isMoving ? undefined : selectedRoute?.rate,
    });

    setSubmitting(false);

    if (result.ok) {
      setStep("success");
    } else {
      setSubmitError(result.error);
    }
  };

  const stepIndex = { service: 0, date: 1, time: 2, form: 3, success: 4 }[step];

  const backTarget: Partial<Record<Step, Step>> = {
    date: "service",
    time: "date",
    form: "time",
  };

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
            {step !== "service" && step !== "success" && (
              <button
                onClick={() => setStep(backTarget[step] ?? "service")}
                className="rounded-lg p-1 text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
                aria-label="Go back"
              >
                <IconArrowLeft className="h-5 w-5" />
              </button>
            )}
            <h2 className="text-lg font-bold">
              {step === "service" && "What do you need?"}
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
            {[0, 1, 2, 3].map((i) => (
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
          {step === "service" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                onClick={() => {
                  setService("moving");
                  setStep("date");
                }}
                className="card flex flex-col items-start gap-3 border-[var(--color-line-strong)] p-6 text-left transition hover:border-[var(--color-accent)]"
              >
                <IconTruck className="h-8 w-8 text-[var(--color-accent)]" />
                <span className="text-lg font-semibold">Moving service</span>
                <span className="text-sm text-[var(--color-ink-muted)]">
                  Home or furniture move, charged by the hour based on your
                  destination zone.
                </span>
              </button>
              <button
                onClick={() => {
                  setService("airport");
                  setStep("date");
                }}
                className="card flex flex-col items-start gap-3 border-[var(--color-line-strong)] p-6 text-left transition hover:border-[var(--color-accent)]"
              >
                <IconPlane className="h-8 w-8 text-[var(--color-accent)]" />
                <span className="text-lg font-semibold">
                  Airport &amp; transfer
                </span>
                <span className="text-sm text-[var(--color-ink-muted)]">
                  Flat-rate luggage transport — courtesy ride included free of
                  charge.
                </span>
              </button>
            </div>
          )}

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
                  {isMoving ? (
                    <IconTruck className="h-4 w-4 text-[var(--color-accent)]" />
                  ) : (
                    <IconPlane className="h-4 w-4 text-[var(--color-accent)]" />
                  )}
                  {isMoving ? "Moving" : "Airport & transfer"}
                </span>
                <span className="flex items-center gap-1.5">
                  <IconCalendar className="h-4 w-4 text-[var(--color-accent)]" />
                  {date ? format(date, "d MMM yyyy") : ""}
                </span>
                <span className="flex items-center gap-1.5">
                  <IconClock className="h-4 w-4 text-[var(--color-accent)]" />
                  {time}
                </span>
              </div>

              {isMoving ? (
                <>
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
                          Message us on WhatsApp and we&apos;ll see what we can
                          do — or send the request below anyway.
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
                </>
              ) : (
                <>
                  {/* Airport route */}
                  <Field label="Route">
                    <select
                      required
                      value={form.route}
                      onChange={(e) =>
                        setForm({ ...form, route: e.target.value })
                      }
                      className={inputClass}
                    >
                      <option value="" disabled>
                        Select your route
                      </option>
                      {airportRoutes.map((r) => (
                        <option key={r.route} value={r.route}>
                          {r.route} — {r.rate}
                        </option>
                      ))}
                    </select>
                  </Field>
                  {selectedRoute && (
                    <p className="rounded-xl bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-ink-muted)]">
                      Flat rate:{" "}
                      <span className="font-semibold text-[var(--color-accent)]">
                        {selectedRoute.rate}
                      </span>{" "}
                      (ex BTW) — luggage transport, courtesy ride included.
                    </p>
                  )}
                </>
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
                {isMoving ? (
                  <>
                    Your move is requested from{" "}
                    <span className="text-[var(--color-ink)]">
                      {fromResolved}
                    </span>{" "}
                    to{" "}
                    <span className="text-[var(--color-ink)]">{toResolved}</span>
                  </>
                ) : (
                  <>
                    Your transfer{" "}
                    <span className="text-[var(--color-ink)]">{form.route}</span>{" "}
                    {selectedRoute && (
                      <>
                        (
                        <span className="text-[var(--color-ink)]">
                          {selectedRoute.rate}
                        </span>
                        ){" "}
                      </>
                    )}
                    is requested
                  </>
                )}{" "}
                on{" "}
                <span className="text-[var(--color-ink)]">
                  {date ? format(date, "d MMM yyyy") : ""} at {time}
                </span>
                . A confirmation email is on its way to{" "}
                <span className="text-[var(--color-ink)]">{form.email}</span>.
              </p>
              <p className="mt-4 text-xs text-[var(--color-ink-subtle)]">
                Payment on arrival — cash or bank transfer (Tikkie/iDEAL).
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
              <p className="mt-2 text-center text-xs text-[var(--color-ink-subtle)]">
                Payment on arrival — cash or bank transfer (Tikkie/iDEAL).
              </p>
            </>
          )}
          {step === "success" && (
            <button onClick={onClose} className="btn-accent w-full">
              Done
            </button>
          )}
          {(step === "service" || step === "date" || step === "time") && (
            <p className="text-center text-xs text-[var(--color-ink-subtle)]">
              Step {stepIndex + 1} of 4
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
