"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import BookButton from "./booking/book-button";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export default function NavBar() {
  const [navOpen, setNavOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[var(--color-page)]/80 backdrop-blur-md">
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/images/logo-mark.svg"
            alt="MovingPace logo"
            className="w-11"
          />
          <span className="text-lg font-bold tracking-tight">
            Moving<span className="text-[var(--color-accent)]">Pace</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={
                isActive(link.href)
                  ? "text-sm font-semibold text-[var(--color-accent)]"
                  : "text-sm font-medium text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <BookButton className="btn-accent px-5 py-2.5 text-sm" />
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setNavOpen(!navOpen)}
          className="text-[var(--color-ink)] md:hidden"
          aria-label="Toggle menu"
          aria-expanded={navOpen}
        >
          {navOpen ? (
            <IconX className="h-6 w-6" />
          ) : (
            <IconMenu2 className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {navOpen && (
        <div className="border-t border-[var(--color-line)] bg-[var(--color-surface)] md:hidden">
          <div className="container mx-auto flex flex-col gap-1 px-6 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setNavOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={
                  isActive(link.href)
                    ? "rounded-lg bg-[var(--color-surface-2)] px-3 py-2.5 font-semibold text-[var(--color-accent)]"
                    : "rounded-lg px-3 py-2.5 font-medium text-[var(--color-ink-muted)] transition hover:bg-[var(--color-surface-2)] hover:text-[var(--color-accent)]"
                }
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2" onClick={() => setNavOpen(false)}>
              <BookButton className="btn-accent w-full" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
