"use client";

import { useState, useTransition } from "react";
import {
  approveReview,
  unapproveReview,
  deleteReview,
} from "../../actions";

export default function ReviewActions({
  id,
  approved,
}: {
  id: string;
  approved: boolean;
}) {
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError("");
    startTransition(async () => {
      const result = await fn();
      if (!result.ok) setError(result.error || "Action failed.");
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {approved ? (
        <button
          onClick={() => run(() => unapproveReview(id))}
          disabled={pending}
          className="rounded-lg border border-[var(--color-line-strong)] px-3 py-1.5 text-sm text-[var(--color-ink)] transition hover:border-[var(--color-accent)] disabled:opacity-50"
        >
          Unapprove
        </button>
      ) : (
        <button
          onClick={() => run(() => approveReview(id))}
          disabled={pending}
          className="btn-accent px-3 py-1.5 text-sm disabled:opacity-50"
        >
          Approve
        </button>
      )}
      <button
        onClick={() => {
          if (confirm("Delete this review permanently?"))
            run(() => deleteReview(id));
        }}
        disabled={pending}
        className="rounded-lg border border-[var(--color-line-strong)] px-3 py-1.5 text-sm text-[var(--color-ink-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-50"
      >
        Delete
      </button>
      {error && <span className="text-xs text-[var(--color-accent)]">{error}</span>}
    </div>
  );
}
