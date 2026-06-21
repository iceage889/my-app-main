import { IconStar, IconStarFilled } from "@tabler/icons-react";

export default function StarRating({
  rating,
  size = 16,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) =>
        i < rating ? (
          <IconStarFilled
            key={i}
            style={{ width: size, height: size }}
            className="text-[var(--color-star)]"
          />
        ) : (
          <IconStar
            key={i}
            style={{ width: size, height: size }}
            className="text-[var(--color-line-strong)]"
          />
        )
      )}
    </div>
  );
}
