"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IconSearch, IconX } from "@tabler/icons-react";
import Spinner from "../../../components/spinner";
import { useBookingsNav } from "./bookings-shell";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "new", label: "New" },
  { value: "accepted", label: "Accepted" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const PER_OPTIONS = [5, 10, 15, 20, 50];

const selectClass =
  "rounded-lg border border-[var(--color-line-strong)] bg-[var(--color-base)] px-2 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]";

export default function BookingsToolbar() {
  const { pending, navigate } = useBookingsNav();
  const params = useSearchParams();

  const urlQ = params.get("q") ?? "";
  const status = params.get("status") ?? "all";
  const per = params.get("per") ?? "10";

  const [q, setQ] = useState(urlQ);

  function push(next: { q?: string; status?: string; per?: string }) {
    const sp = new URLSearchParams();
    const nq = (next.q ?? q).trim();
    const ns = next.status ?? status;
    const np = next.per ?? per;
    if (nq) sp.set("q", nq);
    if (ns !== "all") sp.set("status", ns);
    if (np !== "10") sp.set("per", np);
    sp.set("page", "1");
    navigate(`/admin/bookings?${sp.toString()}`);
  }

  // Live search, debounced.
  useEffect(() => {
    if (q.trim() === urlQ.trim()) return;
    const t = setTimeout(() => push({ q }), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1 sm:max-w-xs">
        <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-subtle)]" />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email or phone…"
          className="w-full rounded-lg border border-[var(--color-line-strong)] bg-[var(--color-base)] py-2 pl-9 pr-8 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-subtle)] focus:border-[var(--color-accent)]"
        />
        {pending ? (
          <Spinner className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-accent)]" />
        ) : (
          q && (
            <button
              onClick={() => setQ("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-[var(--color-ink-subtle)] transition hover:text-[var(--color-ink)]"
            >
              <IconX className="h-4 w-4" />
            </button>
          )
        )}
      </div>

      {/* Status filter */}
      <select
        value={status}
        onChange={(e) => push({ status: e.target.value })}
        className={selectClass}
        aria-label="Filter by status"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {/* Per page */}
      <label className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)] sm:ml-auto">
        Per page
        <select
          value={per}
          onChange={(e) => push({ per: e.target.value })}
          className={selectClass}
        >
          {PER_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
