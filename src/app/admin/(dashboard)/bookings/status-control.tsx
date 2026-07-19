"use client";

import { useState, useTransition } from "react";
import { updateBookingStatus } from "../../actions";
import Spinner from "../../../components/spinner";

const STATUSES = [
  { value: "new", label: "New" },
  { value: "accepted", label: "Accepted" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

/** Statuses that let the admin attach an optional customer-facing message. */
const NEEDS_MESSAGE = ["accepted", "cancelled"];

export default function StatusControl({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [current, setCurrent] = useState(status);
  const [draft, setDraft] = useState<string | null>(null); // status awaiting message
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function apply(next: string, note?: string) {
    const prev = current;
    setCurrent(next);
    setError("");
    startTransition(async () => {
      const result = await updateBookingStatus(id, next, note);
      if (!result.ok) {
        setCurrent(prev);
        setError(result.error);
      } else {
        setDraft(null);
        setMessage("");
      }
    });
  }

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setError("");
    if (NEEDS_MESSAGE.includes(next)) {
      // Compose the optional message first; apply on Update.
      setDraft(next);
      setMessage("");
    } else {
      setDraft(null);
      apply(next);
    }
  }

  return (
    <div className="min-w-[170px]">
      <div className="flex items-center gap-2">
        <select
          value={draft ?? current}
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
        {pending && <Spinner className="text-[var(--color-accent)]" />}
      </div>

      {draft && (
        <div className="mt-2 space-y-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            placeholder={
              draft === "cancelled"
                ? "Reason for cancelling (optional, emailed to customer)"
                : "Message to customer (optional)"
            }
            className="w-full rounded-lg border border-[var(--color-line-strong)] bg-[var(--color-base)] px-2 py-1.5 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-subtle)] focus:border-[var(--color-accent)]"
          />
          <div className="flex gap-2">
            <button
              onClick={() => apply(draft, message)}
              disabled={pending}
              className="btn-accent px-3 py-1.5 text-xs disabled:opacity-50"
            >
              {pending ? "Updating…" : "Update"}
            </button>
            <button
              onClick={() => {
                setDraft(null);
                setMessage("");
              }}
              disabled={pending}
              className="rounded-lg border border-[var(--color-line-strong)] px-3 py-1.5 text-xs text-[var(--color-ink-muted)] transition hover:border-[var(--color-accent)] disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs text-[var(--color-accent)]">{error}</p>
      )}
    </div>
  );
}
