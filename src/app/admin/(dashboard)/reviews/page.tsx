import { createServiceClient } from "../../../lib/supabase/server";
import StarRating from "../../../components/star-rating";
import ReviewActions from "./review-actions";

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

function ReviewCard({ review }: { review: ReviewRow }) {
  return (
    <article className="card flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <StarRating rating={review.rating} />
        <span className="text-xs text-[var(--color-ink-subtle)]">
          {review.city}
        </span>
      </div>
      <p className="text-sm text-[var(--color-ink-muted)]">“{review.comment}”</p>
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

export default async function AdminReviews() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("reviews")
    .select("id, created_at, name, city, rating, comment, image_url, approved")
    .order("created_at", { ascending: false });

  const reviews = (data ?? []) as ReviewRow[];
  const pending = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4 flex items-baseline gap-3">
          <h1 className="text-2xl font-bold">Pending reviews</h1>
          <span className="text-sm text-[var(--color-ink-subtle)]">
            {pending.length}
          </span>
        </div>
        {pending.length === 0 ? (
          <p className="text-[var(--color-ink-muted)]">Nothing awaiting review.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-baseline gap-3">
          <h2 className="text-2xl font-bold">Approved</h2>
          <span className="text-sm text-[var(--color-ink-subtle)]">
            {approved.length}
          </span>
        </div>
        {approved.length === 0 ? (
          <p className="text-[var(--color-ink-muted)]">No approved reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {approved.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
