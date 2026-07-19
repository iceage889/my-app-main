import type { Metadata } from "next";
import {
  IconInfoCircle,
  IconRoute,
  IconCreditCard,
} from "@tabler/icons-react";
import {
  zonePrices,
  extraServices,
  airportRoutes,
  distanceRate,
} from "../../lib/pricing";
import BookButton from "../../components/booking/book-button";

export const metadata: Metadata = {
  title: "Pricing & Rates",
  description:
    "Transparent, zone-based hourly rates, distance surcharge, extra services and flat-rate airport transfers across Almere, Amsterdam and surrounding areas. All prices exclude 21% BTW.",
};

export default function Pricing() {
  return (
    <section className="container mx-auto px-6 py-16 md:py-20">
      <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Simple, honest rates
        </h1>
        <p className="mt-4 text-[var(--color-ink-muted)]">
          All prices exclude 21% BTW (VAT), added to your final total. No
          hidden fees, no surprises.
        </p>
      </div>

      {/* How pricing works */}
      <div className="mx-auto mt-12 max-w-3xl" data-aos="fade-up">
        <div className="card p-6">
          <div className="flex items-start gap-3">
            <IconRoute className="mt-1 h-6 w-6 shrink-0 text-[var(--color-accent)]" />
            <div>
              <h2 className="text-xl font-bold">How pricing works</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                <span className="font-semibold text-[var(--color-ink)]">
                  Hourly rate = destination zone.
                </span>{" "}
                The rate is based on where the work is done — where we unload
                at your new home.{" "}
                <span className="font-semibold text-[var(--color-ink)]">
                  Distance charge = actual kilometers driven
                </span>{" "}
                at {distanceRate.rate.replace(" (one way)", "")}, one way from
                pickup to destination.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                Example — moving from Almere to Amersfoort: hourly rate{" "}
                <span className="font-semibold text-[var(--color-accent)]">
                  €120/hr
                </span>{" "}
                (Amersfoort zone) + distance ~50 km ×  €0.35 ={" "}
                <span className="font-semibold text-[var(--color-accent)]">
                  €17.50
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Zone rates */}
      <div className="mx-auto mt-12 max-w-3xl" data-aos="fade-up">
        <h2 className="mb-4 text-xl font-bold">
          Zone rates — moving service
        </h2>

        {/* Table (sm and up) */}
        <div className="card hidden overflow-hidden sm:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--color-line)] text-sm text-[var(--color-ink-subtle)]">
                <th className="px-6 py-4 font-medium">Zone</th>
                <th className="px-6 py-4 font-medium">City</th>
                <th className="px-6 py-4 text-right font-medium">
                  Rate (Ex BTW)
                </th>
              </tr>
            </thead>
            <tbody>
              {zonePrices.map((row, i) => (
                <tr
                  key={row.city}
                  className={
                    i !== zonePrices.length - 1
                      ? "border-b border-[var(--color-line)]"
                      : ""
                  }
                >
                  <td className="px-6 py-4 text-[var(--color-ink-muted)]">
                    {row.zone}
                  </td>
                  <td className="px-6 py-4 font-medium">{row.city}</td>
                  <td className="px-6 py-4 text-right font-semibold text-[var(--color-accent)]">
                    {row.rate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards (mobile) */}
        <div className="grid grid-cols-1 gap-3 sm:hidden">
          {zonePrices.map((row) => (
            <div
              key={row.city}
              className="card flex items-center justify-between p-4"
            >
              <div>
                <p className="font-medium">{row.city}</p>
                <p className="text-sm text-[var(--color-ink-subtle)]">
                  {row.zone}
                </p>
              </div>
              <span className="font-semibold text-[var(--color-accent)]">
                {row.rate}
              </span>
            </div>
          ))}
        </div>

        {/* Distance surcharge */}
        <div className="card mt-3 flex flex-col justify-between gap-1 p-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-medium">Distance surcharge</p>
            <p className="text-sm text-[var(--color-ink-subtle)]">
              {distanceRate.coverage}
            </p>
          </div>
          <span className="font-semibold text-[var(--color-accent)]">
            {distanceRate.rate}
          </span>
        </div>
      </div>

      {/* Extra services */}
      <div className="mx-auto mt-12 max-w-3xl" data-aos="fade-up">
        <h2 className="mb-4 text-xl font-bold">Extra services (Ex BTW)</h2>

        <div className="card hidden overflow-hidden sm:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--color-line)] text-sm text-[var(--color-ink-subtle)]">
                <th className="px-6 py-4 font-medium">Service</th>
                <th className="px-6 py-4 text-right font-medium">Rate</th>
              </tr>
            </thead>
            <tbody>
              {extraServices.map((row, i) => (
                <tr
                  key={row.service}
                  className={
                    i !== extraServices.length - 1
                      ? "border-b border-[var(--color-line)]"
                      : ""
                  }
                >
                  <td className="px-6 py-4 font-medium">{row.service}</td>
                  <td className="px-6 py-4 text-right font-semibold text-[var(--color-accent)]">
                    {row.rate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:hidden">
          {extraServices.map((row) => (
            <div key={row.service} className="card p-4">
              <p className="font-medium">{row.service}</p>
              <p className="mt-1 font-semibold text-[var(--color-accent)]">
                {row.rate}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Airport & transfer service */}
      <div className="mx-auto mt-12 max-w-3xl" data-aos="fade-up">
        <h2 className="mb-1 text-xl font-bold">
          Airport &amp; transfer service
        </h2>
        <p className="mb-4 text-sm text-[var(--color-ink-muted)]">
          Luggage transport at a flat rate — courtesy ride included free of
          charge.
        </p>

        <div className="card hidden overflow-hidden sm:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--color-line)] text-sm text-[var(--color-ink-subtle)]">
                <th className="px-6 py-4 font-medium">Route</th>
                <th className="px-6 py-4 text-right font-medium">Rate</th>
              </tr>
            </thead>
            <tbody>
              {airportRoutes.map((row, i) => (
                <tr
                  key={row.route}
                  className={
                    i !== airportRoutes.length - 1
                      ? "border-b border-[var(--color-line)]"
                      : ""
                  }
                >
                  <td className="px-6 py-4 font-medium">{row.route}</td>
                  <td className="px-6 py-4 text-right font-semibold text-[var(--color-accent)]">
                    {row.rate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:hidden">
          {airportRoutes.map((row) => (
            <div
              key={row.route}
              className="card flex items-center justify-between p-4"
            >
              <p className="font-medium">{row.route}</p>
              <span className="ml-3 shrink-0 font-semibold text-[var(--color-accent)]">
                {row.rate}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment policy */}
      <div className="mx-auto mt-12 max-w-3xl" data-aos="fade-up">
        <div className="card flex items-start gap-3 p-6">
          <IconCreditCard className="mt-1 h-6 w-6 shrink-0 text-[var(--color-accent)]" />
          <div>
            <h2 className="text-xl font-bold">Payment</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              Payment is required upon arrival, before the job begins. We
              accept cash and bank transfer (Tikkie/iDEAL).
            </p>
          </div>
        </div>
      </div>

      {/* BTW note */}
      <div className="mx-auto mt-10 max-w-3xl">
        <div className="flex items-start gap-3 rounded-2xl border border-[var(--color-line-strong)] bg-[var(--color-accent-soft)] p-5">
          <IconInfoCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent)]" />
          <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
            <span className="font-semibold text-[var(--color-ink)]">Note:</span>{" "}
            All prices exclude 21% BTW. BTW is calculated on your total bill at
            the end of the job. Example: 2 hrs in Amsterdam = €240 ex BTW + €50.40
            BTW = <span className="font-semibold text-[var(--color-ink)]">€290.40 total</span>.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto mt-12 max-w-3xl text-center">
        <BookButton>Book your move</BookButton>
      </div>

      {/* Disclaimer */}
      <div className="mx-auto mt-12 max-w-3xl border-t border-[var(--color-line)] pt-6">
        <p className="text-xs leading-relaxed text-[var(--color-ink-subtle)]">
          Hourly rates are based on destination zone. Distance surcharge of
          €0.35/km applies one way from pickup to destination. Airport and
          transfer prices are for luggage transport only — courtesy ride
          included free of charge. All prices exclude 21% BTW calculated on
          the total bill. Parking in paid zones is at actual cost payable by
          the customer.
        </p>
      </div>
    </section>
  );
}
