"use client";

import { useRouter } from "next/navigation";

const OPTIONS = [5, 10, 15, 20, 50];

export default function PerPageSelect({
  tab,
  per,
}: {
  tab: string;
  per: number;
}) {
  const router = useRouter();

  return (
    <label className="flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
      Per page
      <select
        value={per}
        onChange={(e) =>
          router.push(`/admin/reviews?tab=${tab}&page=1&per=${e.target.value}`)
        }
        className="rounded-lg border border-[var(--color-line-strong)] bg-[var(--color-page)] px-2 py-1.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)]"
      >
        {OPTIONS.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </label>
  );
}
