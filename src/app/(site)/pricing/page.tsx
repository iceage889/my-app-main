import type { Metadata } from "next";
import { IconInfoCircle } from "@tabler/icons-react";
import { zonePrices, extraServices } from "../../lib/pricing";
import BookButton from "../../components/booking/book-button";

export const metadata: Metadata = {
  title: "Pricing | MovingPace",
  description:
    "Transparent, zone-based hourly rates and extra services for moving across Almere, Amsterdam and surrounding areas. All prices exclude 21% BTW.",
};

export default function Pricing() {
  return (
    <section className="container mx-auto px-6 py-16 md:py-20">
      <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Simple, honest rates
        </h1>
        <p className="mt-4 text-[var(--color-ink-muted)]">
          All prices below exclude 21% BTW (VAT). BTW is added to your total at
          the end of the job.
        </p>
      </div>

      {/* Zone rates */}
      <div className="mx-auto mt-12 max-w-3xl" data-aos="fade-up">
        <h2 className="mb-4 text-xl font-bold">Hourly rates by zone</h2>

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
    </section>
  );
}
