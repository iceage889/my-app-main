import Link from "next/link";
import { format } from "date-fns";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { createServiceClient } from "../../../lib/supabase/server";
import StatusControl from "./status-control";
import BookingsToolbar from "./bookings-toolbar";
import { BookingsProvider, BookingsContent } from "./bookings-shell";

type BookingRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
  from_city: string;
  to_city: string;
  move_date: string;
  move_time: string;
  out_of_region: boolean;
  status: string;
  reviewed_at: string | null;
  review_token: string | null;
  service_type: string;
  route: string | null;
  route_rate: string | null;
  status_message: string | null;
  from_address: string | null;
  to_address: string | null;
};

const STATUS_VALUES = ["new", "accepted", "completed", "cancelled"];
const PER_OPTIONS = [5, 10, 15, 20, 50];

function reviewState(b: BookingRow) {
  if (b.reviewed_at) return "Reviewed";
  if (b.review_token) return "Invited";
  return "—";
}

/** Escape user input so it can't break the PostgREST or() filter string. */
function toSearchTerm(q: string) {
  return q.replace(/[,()%\\]/g, " ").trim();
}

export default async function AdminBookings({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
    per?: string;
  }>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const status = STATUS_VALUES.includes(params.status ?? "")
    ? (params.status as string)
    : "all";
  const perRaw = Number(params.per);
  const per = PER_OPTIONS.includes(perRaw) ? perRaw : 10;
  const pageRaw = Number(params.page);
  const requestedPage = Number.isInteger(pageRaw) && pageRaw >= 1 ? pageRaw : 1;

  const supabase = createServiceClient();
  const term = toSearchTerm(q);
  const orFilter = term
    ? `name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`
    : "";

  // Filtered count first, so the page number can be clamped safely.
  let countQuery = supabase
    .from("bookings")
    .select("id", { count: "exact", head: true });
  if (status !== "all") countQuery = countQuery.eq("status", status);
  if (orFilter) countQuery = countQuery.or(orFilter);
  const { count } = await countQuery;

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / per));
  const page = Math.min(requestedPage, totalPages);

  let dataQuery = supabase
    .from("bookings")
    .select(
      "id, name, phone, email, from_city, to_city, move_date, move_time, out_of_region, status, reviewed_at, review_token, service_type, route, route_rate, status_message, from_address, to_address"
    );
  if (status !== "all") dataQuery = dataQuery.eq("status", status);
  if (orFilter) dataQuery = dataQuery.or(orFilter);
  const { data } = await dataQuery
    .order("move_date", { ascending: false })
    .range((page - 1) * per, page * per - 1);

  const bookings = (data ?? []) as BookingRow[];

  const pageHref = (p: number) => {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (status !== "all") sp.set("status", status);
    if (per !== 10) sp.set("per", String(per));
    sp.set("page", String(p));
    return `/admin/bookings?${sp.toString()}`;
  };

  return (
    <div>
      <div className="mb-6 flex items-baseline gap-3">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <span className="text-sm text-[var(--color-ink-subtle)]">
          {total} {q || status !== "all" ? "matching" : "total"}
        </span>
      </div>

      <BookingsProvider>
        <BookingsToolbar />

        <BookingsContent rows={Math.min(per, 8)}>
      {bookings.length === 0 ? (
        <p className="py-10 text-center text-[var(--color-ink-muted)]">
          {q || status !== "all"
            ? "No bookings match your search."
            : "No bookings yet."}
        </p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-line)] text-[var(--color-ink-subtle)]">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Route</th>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Note</th>
                <th className="px-4 py-3 font-medium">Review</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-b border-[var(--color-line)] last:border-0 align-top"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-[var(--color-ink)]">
                      {b.name}
                    </div>
                    <div className="text-xs text-[var(--color-ink-muted)]">
                      {b.phone}
                    </div>
                    <div className="text-xs text-[var(--color-ink-muted)]">
                      {b.email}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[var(--color-ink)]">
                      {b.from_city} → {b.to_city}
                    </span>
                    {b.service_type === "airport" && (
                      <span className="mt-1 block w-fit rounded-md bg-[var(--color-accent-soft)] px-1.5 py-0.5 text-xs font-medium text-[var(--color-accent)]">
                        Airport{b.route_rate ? ` · ${b.route_rate}` : ""}
                      </span>
                    )}
                    {b.out_of_region && (
                      <span className="mt-1 block text-xs font-medium text-[var(--color-accent)]">
                        Out of region
                      </span>
                    )}
                    {(b.from_address || b.to_address) && (
                      <span className="mt-1 block max-w-[240px] text-xs text-[var(--color-ink-subtle)]">
                        {b.from_address ?? b.from_city} →{" "}
                        {b.to_address ?? b.to_city}
                      </span>
                    )}
                    {b.service_type === "moving" && (
                      <a
                        href={`https://www.google.com/maps/dir/${encodeURIComponent(
                          b.from_address ?? b.from_city
                        )}/${encodeURIComponent(b.to_address ?? b.to_city)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block text-xs font-medium text-[var(--color-accent)] hover:underline"
                      >
                        Directions ↗
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[var(--color-ink-muted)]">
                    {b.move_date
                      ? format(new Date(b.move_date), "d MMM yyyy")
                      : "—"}
                    <br />
                    {b.move_time}
                  </td>
                  <td className="px-4 py-3">
                    <StatusControl id={b.id} status={b.status} />
                  </td>
                  <td className="px-4 py-3">
                    {b.status_message ? (
                      <p className="max-w-[200px] text-xs text-[var(--color-ink-muted)]">
                        “{b.status_message}”
                      </p>
                    ) : (
                      <span className="text-[var(--color-ink-subtle)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-ink-muted)]">
                    {reviewState(b)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-end gap-3">
        <span className="text-sm text-[var(--color-ink-muted)]">
          Page {page} of {totalPages}
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
        </BookingsContent>
      </BookingsProvider>
    </div>
  );
}
