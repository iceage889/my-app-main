import { format } from "date-fns";
import { createServiceClient } from "../../../lib/supabase/server";
import StatusControl from "./status-control";

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
};

function reviewState(b: BookingRow) {
  if (b.reviewed_at) return "Reviewed";
  if (b.review_token) return "Invited";
  return "—";
}

export default async function AdminBookings() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("bookings")
    .select(
      "id, name, phone, email, from_city, to_city, move_date, move_time, out_of_region, status, reviewed_at, review_token, service_type, route, route_rate, status_message"
    )
    .order("move_date", { ascending: false });

  const bookings = (data ?? []) as BookingRow[];

  return (
    <div>
      <div className="mb-6 flex items-baseline gap-3">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <span className="text-sm text-[var(--color-ink-subtle)]">
          {bookings.length} total
        </span>
      </div>

      {bookings.length === 0 ? (
        <p className="text-[var(--color-ink-muted)]">No bookings yet.</p>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-line)] text-[var(--color-ink-subtle)]">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Route</th>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Status</th>
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
                    {b.status_message && (
                      <p className="mt-1 max-w-[220px] text-xs text-[var(--color-ink-subtle)]">
                        “{b.status_message}”
                      </p>
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
    </div>
  );
}
