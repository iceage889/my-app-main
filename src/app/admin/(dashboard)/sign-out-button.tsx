"use client";

import { useFormStatus } from "react-dom";
import Spinner from "../../components/spinner";

export default function SignOutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-line-strong)] px-3 py-1.5 text-[var(--color-ink)] transition hover:border-[var(--color-accent)] disabled:opacity-50"
    >
      {pending && <Spinner />}
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
