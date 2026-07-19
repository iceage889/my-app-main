import Link from "next/link";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { createServiceClient } from "../../../lib/supabase/server";
import StarRating from "../../../components/star-rating";
import ReviewActions from "./review-actions";
import PerPageSelect from "./per-page-select";

type ReviewRow = {
  id: string;
  created_at: string;
  name: string;
  city: string | null;
  rating: number;
  comment: string;
  image_url: string | null;
  approved: boolean;
};

const PER_OPTIONS = [5, 10, 15, 20, 50];

function ReviewCard({ review }: { review: ReviewRow }) {
  return (
    <article className="card flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <StarRating rating={review.rating} />
        <span className="text-xs text-[var(--color-ink-subtle)]">
          {review.city}
        </span>
      </div>
      <p className="flex-1 text-sm text-[var(--color-ink-muted)]">
        “{review.comment}”
      </p>
      <div className="flex items-center gap-3">
        {review.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.image_url}
            alt={review.name}
            className="h-9 w-9 rounded-full object-cover"
          />
        )}
        <span className="font-semibold">{review.name}</span>
      </div>
      <ReviewActions id={review.id} approved={review.approved} />
    </article>
  );
}

export default async function AdminReviews({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string; per?: string }>;
}) {
  const params = await searchParams;
  const tab = params.tab === "approved" ? "approved" : "pending";
  const perRaw = Number(params.per);
  const per = PER_OPTIONS.includes(perRaw) ? perRaw : 10;
  const pageRaw = Number(params.page);
  const requestedPage =
    Number.isInteger(pageRaw) && pageRaw >= 1 ? pageRaw : 1;

  const supabase = createServiceClient();

  // Tab counts
  const [{ count: pendingCount }, { count: approvedCount }] =
    await Promise.all([
      supabase
        .from("reviews")
        .select("id", { count: "exact", head: true })
        .eq("approved", false),
      supabase
        .from("reviews")
        .select("id", { count: "exact", head: true })
        .eq("approved", true),
    ]);

  const total = (tab === "approved" ? approvedCount : pendingCount) ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / per));
  const page = Math.min(requestedPage, totalPages);

  const { data } = await supabase
    .from("reviews")
    .select("id, created_at, name, city, rating, comment, image_url, approved")
    .eq("approved", tab === "approved")
    .order("created_at", { ascending: false })
    .range((page - 1) * per, page * per - 1);

  const reviews = (data ?? []) as ReviewRow[];

  const tabs = [
    { key: "pending", label: `Pending (${pendingCount ?? 0})` },
    { key: "approved", label: `Approved (${approvedCount ?? 0})` },
  ];

  const pageHref = (p: number) => `/admin/reviews?tab=${tab}&page=${p}&per=${per}`;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Reviews</h1>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-[var(--color-line)]">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/admin/reviews?tab=${t.key}&page=1&per=${per}`}
            className={
              tab === t.key
                ? "-mb-px border-b-2 border-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-[var(--color-accent)]"
                : "px-4 py-2.5 text-sm font-medium text-[var(--color-ink-muted)] transition hover:text-[var(--color-ink)]"
            }
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* List */}
      {reviews.length === 0 ? (
        <p className="py-10 text-center text-[var(--color-ink-muted)]">
          {tab === "pending"
            ? "Nothing awaiting review."
            : "No approved reviews yet."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <PerPageSelect tab={tab} per={per} />

        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--color-ink-muted)]">
            Page {page} of {totalPages} · {total} total
          </span>
          <div className="flex gap-1.5">
            {page > 1 ? (
              <Link
                href={pageHref(page - 1)}
                aria-label="Previous page"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-line-strong)] text-[var(--color-ink)] transition hover:border-[var(--color-accent)]"
              >
                <IconChevronLeft className="h-4 w-4" />
              </Link>
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-line)] text-[var(--color-ink-subtle)] opacity-50">
                <IconChevronLeft className="h-4 w-4" />
              </span>
            )}
            {page < totalPages ? (
              <Link
                href={pageHref(page + 1)}
                aria-label="Next page"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-line-strong)] text-[var(--color-ink)] transition hover:border-[var(--color-accent)]"
              >
                <IconChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-line)] text-[var(--color-ink-subtle)] opacity-50">
                <IconChevronRight className="h-4 w-4" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
