"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format } from "date-fns";
import {
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
import { createBooking } from "../../components/booking/actions";
import AddressAutocomplete, {
  type AddressValue,
} from "../../components/address-autocomplete";
import Spinner from "../../components/spinner";

type Step = "service" | "date" | "time" | "form" | "success";
type ServiceType = "moving" | "airport";

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

/** "Almere ↔ Schiphol" → { from: "Almere", to: "Schiphol" } */
function parseRoute(route: string) {
  const parts = route.replace(" (luggage)", "").split(/\s*[↔→]\s*/);
  return { from: parts[0] || route, to: parts[1] || route };
}

function inRegion(value: AddressValue | null) {
  if (!value?.city) return false;
  const city = value.city.toLowerCase();
  return serviceCities.some((c) => c.toLowerCase() === city);
}

export default function BookingWizard() {
  const [step, setStep] = useState<Step>("service");
  const [service, setService] = useState<ServiceType>("moving");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");
  const [from, setFrom] = useState<AddressValue | null>(null);
  const [to, setTo] = useState<AddressValue | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [route, setRoute] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isMoving = service === "moving";

  const fromResolved = isMoving
    ? from
      ? (from.city ?? from.label)
      : ""
    : route
      ? parseRoute(route).from
      : "";
  const toResolved = isMoving
    ? to
      ? (to.city ?? to.label)
      : ""
    : route
      ? parseRoute(route).to
      : "";

  const fromOutOfRegion = isMoving && from !== null && !inRegion(from);
  const toOutOfRegion = isMoving && to !== null && !inRegion(to);
  const outOfRegion = fromOutOfRegion || toOutOfRegion;

  const selectedRoute = airportRoutes.find((r) => r.route === route);

  const formValid =
    name.trim() &&
    phone.trim() &&
    email.trim() &&
    (isMoving ? from !== null && to !== null : Boolean(route));

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi MovingPace, I'd like a move from ${fromResolved || "?"} to ${
      toResolved || "?"
    }${date ? ` on ${format(date, "d MMM yyyy")}` : ""}${
      time ? ` at ${time}` : ""
    }. One of these is outside your listed area — can you help?`
  )}`;

  const outOfRegionCities = [
    fromOutOfRegion && (from?.city ?? from?.label),
    toOutOfRegion && (to?.city ?? to?.label),
  ].filter(Boolean) as string[];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid || submitting) return;

    setSubmitting(true);
    setSubmitError("");

    const result = await createBooking({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      fromCity: fromResolved,
      toCity: toResolved,
      fromAddress: isMoving ? (from?.label ?? "") : undefined,
      toAddress: isMoving ? (to?.label ?? "") : undefined,
      moveDate: date ? format(date, "yyyy-MM-dd") : "",
      moveTime: time,
      outOfRegion,
      serviceType: service,
      route: isMoving ? undefined : route,
      routeRate: isMoving ? undefined : selectedRoute?.rate,
    });

    setSubmitting(false);

    if (result.ok) {
      setStep("success");
      window.scrollTo({ top: 0 });
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
    <div>
      {/* Header */}
      <div className="mb-2 flex items-center gap-3">
        {step !== "service" && step !== "success" && (
          <button
            onClick={() => setStep(backTarget[step] ?? "service")}
            className="rounded-lg p-1.5 text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
            aria-label="Go back"
          >
            <IconArrowLeft className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-2xl font-bold sm:text-3xl">
          {step === "service" && "What do you need?"}
          {step === "date" && "Pick a date"}
          {step === "time" && "Pick a time"}
          {step === "form" && "Your details"}
          {step === "success" && "Booking received"}
        </h1>
      </div>

      {/* Progress */}
      {step !== "success" && (
        <>
          <p className="mb-3 text-sm text-[var(--color-ink-subtle)]">
            Step {stepIndex + 1} of 4
          </p>
          <div className="mb-8 flex gap-1.5">
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
        </>
      )}

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
            <span className="text-lg font-semibold">Airport &amp; transfer</span>
            <span className="text-sm text-[var(--color-ink-muted)]">
              Flat-rate luggage transport — courtesy ride included free of
              charge.
            </span>
          </button>
        </div>
      )}

      {step === "date" && (
        <div className="card flex flex-col items-center p-4 sm:p-6">
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
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                onClick={() => {
                  setTime(slot);
                  setStep("form");
                }}
                className={`rounded-xl border px-2 py-3.5 text-base font-medium transition ${
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
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-[var(--color-surface-2)] px-4 py-3 text-sm">
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
              <AddressAutocomplete
                label="Moving from"
                value={from}
                onChange={setFrom}
              />
              <AddressAutocomplete
                label="Moving to"
                value={to}
                onChange={setTo}
              />

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
            </>
          ) : (
            <>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[var(--color-ink-muted)]">
                  Route
                </span>
                <select
                  required
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
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
              </label>
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

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--color-ink-muted)]">
              Full name
            </span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="John Doe"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--color-ink-muted)]">
              Phone
            </span>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="+31 6 1234 5678"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--color-ink-muted)]">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
            />
          </label>

          {submitError && (
            <p className="text-center text-sm text-[var(--color-accent)]">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={!formValid || submitting}
            className="btn-accent w-full py-3.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Spinner /> Sending…
              </>
            ) : (
              "Confirm booking"
            )}
          </button>
          <p className="text-center text-xs text-[var(--color-ink-subtle)]">
            Payment on arrival — cash or bank transfer (Tikkie/iDEAL).
          </p>
        </form>
      )}

      {step === "success" && (
        <div className="card flex flex-col items-center px-6 py-10 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent-soft)]">
            <IconCheck className="h-8 w-8 text-[var(--color-accent)]" />
          </div>
          <h2 className="text-xl font-bold">Thank you, {name}!</h2>
          <p className="mt-2 max-w-sm text-sm text-[var(--color-ink-muted)]">
            {isMoving ? (
              <>
                Your move is requested from{" "}
                <span className="text-[var(--color-ink)]">
                  {from?.label ?? fromResolved}
                </span>{" "}
                to{" "}
                <span className="text-[var(--color-ink)]">
                  {to?.label ?? toResolved}
                </span>
              </>
            ) : (
              <>
                Your transfer{" "}
                <span className="text-[var(--color-ink)]">{route}</span>{" "}
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
            <span className="text-[var(--color-ink)]">{email}</span>.
          </p>
          <p className="mt-4 text-xs text-[var(--color-ink-subtle)]">
            Payment on arrival — cash or bank transfer (Tikkie/iDEAL).
          </p>
          <Link href="/" className="btn-accent mt-8 w-full sm:w-auto">
            Back to home
          </Link>
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[var(--color-line-strong)] bg-[var(--color-page)] px-4 py-3 text-base text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-ink-subtle)] focus:border-[var(--color-accent)]";
