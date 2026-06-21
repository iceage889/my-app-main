import Link from "next/link";
import {
  IconPhone,
  IconMail,
  IconMapPin,
  IconBrandWhatsapp,
} from "@tabler/icons-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-surface)]">
      <div className="container mx-auto grid grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <img src="/images/Logo.png" alt="MovingPace logo" className="w-9" />
            <span className="text-lg font-bold">MovingPace</span>
          </div>
          <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
            Moving your property with pace. Reliable, fast and affordable
            relocation across the region.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-ink)]">
            Quick Links
          </h3>
          <ul className="space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-ink)]">
            Get in Touch
          </h3>
          <div className="space-y-3 text-sm">
            <p className="text-[var(--color-ink)]">
              Albert Hugo
              <span className="block text-xs text-[var(--color-ink-subtle)]">
                Logistics Expert
              </span>
            </p>
            <a
              href="tel:+31681059122"
              className="flex items-center gap-2.5 text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
            >
              <IconPhone className="h-4 w-4 text-[var(--color-accent)]" />
              +31 6 8105 9122
            </a>
            <a
              href="mailto:Movingpace48@gmail.com"
              className="flex items-center gap-2.5 break-all text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
            >
              <IconMail className="h-4 w-4 text-[var(--color-accent)]" />
              Movingpace48@gmail.com
            </a>
          </div>
        </div>

        {/* Service area */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--color-ink)]">
            Service Area
          </h3>
          <p className="flex items-start gap-2.5 text-sm text-[var(--color-ink-muted)]">
            <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
            Almere, Lelystad, Amsterdam, Hilversum, Amersfoort and surrounding
            areas.
          </p>
        </div>
      </div>

      <div className="border-t border-[var(--color-line)]">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-[var(--color-ink-subtle)] sm:flex-row">
          <p>
            © {new Date().getFullYear()} MovingPace. All rights reserved.
          </p>
          <p>Prices exclude 21% BTW (VAT).</p>
        </div>
      </div>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/31681059122"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-black/40 transition hover:scale-105"
      >
        <IconBrandWhatsapp className="h-7 w-7 text-white" />
      </a>
    </footer>
  );
}
