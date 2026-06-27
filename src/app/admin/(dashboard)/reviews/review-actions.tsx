"use client";

import { useState, useTransition } from "react";
import {
  approveReview,
  unapproveReview,
  deleteReview,
} from "../../actions";
import Spinner from "../../../components/spinner";

export default function ReviewActions({
  id,
  approved,
}: {
  id: string;
  approved: boolean;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(
    label: string,
    fn: () => Promise<{ ok: boolean; error?: string }>
  ) {
    setError("");
    setBusy(label);
    startTransition(async () => {
      const result = await fn();
      setBusy(null);
      if (!result.ok) setError(result.error || "Action failed.");
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {approved ? (
        <button
          onClick={() => run("unapprove", () => unapproveReview(id))}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-line-strong)] px-3 py-1.5 text-sm text-[var(--color-ink)] transition hover:border-[var(--color-accent)] disabled:opacity-50"
        >
          {busy === "unapprove" && <Spinner />}
          Unapprove
        </button>
      ) : (
        <button
          onClick={() => run("approve", () => approveReview(id))}
          disabled={pending}
          className="btn-accent px-3 py-1.5 text-sm disabled:opacity-50"
        >
          {busy === "approve" && <Spinner />}
          Approve
        </button>
      )}
      <button
        onClick={() => {
          if (confirm("Delete this review permanently?"))
            run("delete", () => deleteReview(id));
        }}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-line-strong)] px-3 py-1.5 text-sm text-[var(--color-ink-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-50"
      >
        {busy === "delete" && <Spinner />}
        Delete
      </button>
      {error && (
        <span className="text-xs text-[var(--color-accent)]">{error}</span>
      )}
    </div>
  );
}
