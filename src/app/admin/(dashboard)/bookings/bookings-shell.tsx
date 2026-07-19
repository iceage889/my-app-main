"use client";

import { createContext, useContext, useTransition } from "react";
import { useRouter } from "next/navigation";

type BookingsNav = {
  pending: boolean;
  navigate: (url: string) => void;
};

const Ctx = createContext<BookingsNav | null>(null);

/** Shares the in-flight navigation state between the toolbar and the table. */
export function BookingsProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const navigate = (url: string) =>
    startTransition(() => router.replace(url));

  return <Ctx.Provider value={{ pending, navigate }}>{children}</Ctx.Provider>;
}

export function useBookingsNav() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useBookingsNav must be used within BookingsProvider");
  }
  return ctx;
}

/** Renders the server table normally; swaps to a skeleton while a search/filter is loading. */
export function BookingsContent({
  children,
  rows = 6,
}: {
  children: React.ReactNode;
  rows?: number;
}) {
  const { pending } = useBookingsNav();
  if (!pending) return <>{children}</>;

  return (
    <div
      className="card overflow-hidden"
      aria-busy="true"
      aria-label="Loading bookings"
    >
      <div className="border-b border-[var(--color-line)] px-4 py-3.5">
        <div className="h-3.5 w-1/3 animate-pulse rounded bg-[var(--color-surface-2)]" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-6 border-b border-[var(--color-line)] px-4 py-4 last:border-0"
        >
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-2/5 animate-pulse rounded bg-[var(--color-surface-2)]" />
            <div className="h-3 w-3/5 animate-pulse rounded bg-[var(--color-surface-2)]" />
          </div>
          <div className="hidden h-3.5 w-24 animate-pulse rounded bg-[var(--color-surface-2)] sm:block" />
          <div className="h-8 w-28 shrink-0 animate-pulse rounded-lg bg-[var(--color-surface-2)]" />
          <div className="hidden h-3.5 w-14 animate-pulse rounded bg-[var(--color-surface-2)] md:block" />
        </div>
      ))}
    </div>
  );
}
