"use client";

import { useState, useTransition } from "react";
import { updateBookingStatus } from "../../actions";

const STATUSES = [
  { value: "new", label: "New" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function StatusControl({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [current, setCurrent] = useState(status);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    const prev = current;
    setCurrent(next);
    setError("");
    startTransition(async () => {
      const result = await updateBookingStatus(id, next);
      if (!result.ok) {
        setCurrent(prev);
        setError(result.error);
      }
    });
  }

  return (
    <div>
      <select
        value={current}
        onChange={onChange}
        disabled={pending}
        className="rounded-lg border border-[var(--color-line-strong)] bg-[var(--color-base)] px-2 py-1.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-accent)] disabled:opacity-50"
      >
        {STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs text-[var(--color-accent)]">{error}</p>
      )}
    </div>
  );
}
