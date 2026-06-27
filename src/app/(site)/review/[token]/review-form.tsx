"use client";

import { useState } from "react";
import { IconStar, IconStarFilled, IconCheck } from "@tabler/icons-react";
import { submitReview } from "../actions";
import Spinner from "../../../components/spinner";

const inputClass =
  "w-full rounded-xl border border-[var(--color-line-strong)] bg-[var(--color-base)] px-4 py-2.5 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-ink-subtle)] focus:border-[var(--color-accent)]";

export default function ReviewForm({
  token,
  name,
  defaultCity,
}: {
  token: string;
  name: string;
  defaultCity: string;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent-soft)]">
          <IconCheck className="h-8 w-8 text-[var(--color-accent)]" />
        </div>
        <h1 className="text-2xl font-bold">Thank you, {name}!</h1>
        <p className="mt-3 text-[var(--color-ink-muted)]">
          Your review has been submitted
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating < 1) {
      setError("Please select a star rating.");
      return;
    }
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("token", token);
    formData.set("rating", String(rating));

    const result = await submitReview(formData);
    setSubmitting(false);

    if (result.ok) setDone(true);
    else setError(result.error);
  }

  return (
    <div className="card p-6 sm:p-8">
      <h1 className="text-2xl font-bold sm:text-3xl">
        Hi {name}, how did we do?
      </h1>
      <p className="mt-2 text-[var(--color-ink-muted)]">
        We&apos;d love to hear about your move with MovingPace.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Rating */}
        <div>
          <span className="mb-2 block text-sm font-medium text-[var(--color-ink-muted)]">
            Your rating
          </span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                className="transition-transform hover:scale-110"
              >
                {(hover || rating) >= n ? (
                  <IconStarFilled className="h-9 w-9 text-[var(--color-star)]" />
                ) : (
                  <IconStar className="h-9 w-9 text-[var(--color-line-strong)]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--color-ink-muted)]">
            Your review
          </span>
          <textarea
            name="comment"
            required
            rows={4}
            className={inputClass}
            placeholder="Tell us how your move went…"
          />
        </label>

        {/* City */}
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--color-ink-muted)]">
            City{" "}
            <span className="text-[var(--color-ink-subtle)]">(optional)</span>
          </span>
          <input
            name="city"
            defaultValue={defaultCity}
            className={inputClass}
          />
        </label>

        {/* Photo */}
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--color-ink-muted)]">
            Photo{" "}
            <span className="text-[var(--color-ink-subtle)]">(optional)</span>
          </span>
          <input
            type="file"
            name="photo"
            accept="image/png,image/jpeg,image/webp"
            className="block w-full text-sm text-[var(--color-ink-muted)] file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--color-surface-2)] file:px-4 file:py-2 file:font-medium file:text-[var(--color-ink)] hover:file:bg-[var(--color-elevated)]"
          />
        </label>

        {error && <p className="text-sm text-[var(--color-accent)]">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="btn-accent w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Spinner /> Submitting…
            </>
          ) : (
            "Submit review"
          )}
        </button>
      </form>
    </div>
  );
}
