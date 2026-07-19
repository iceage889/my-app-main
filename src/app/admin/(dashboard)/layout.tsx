import { redirect } from "next/navigation";
import { getAdminUser } from "../../lib/supabase/auth-server";
import { isAllowedAdmin } from "../../lib/admin/auth";
import { createServiceClient } from "../../lib/supabase/server";
import { signOut } from "../actions";
import NavLink from "./nav-link";
import SignOutButton from "./sign-out-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();
  if (!user || !isAllowedAdmin(user.email)) {
    redirect("/admin/login");
  }

  // New (unhandled) bookings count for the nav badge.
  let newCount = 0;
  try {
    const supabase = createServiceClient();
    const { count } = await supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("status", "new");
    newCount = count ?? 0;
  } catch {
    /* badge is non-critical */
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 border-b border-[var(--color-line)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold">Admin</span>
          <nav className="flex gap-4 text-sm">
            <NavLink href="/admin/bookings">
              <span className="inline-flex items-center gap-1.5">
                Bookings
                {newCount > 0 && (
                  <span className="rounded-full bg-[var(--color-accent)] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                    {newCount}
                  </span>
                )}
              </span>
            </NavLink>
            <NavLink href="/admin/reviews">Reviews</NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-[var(--color-ink-subtle)]">{user.email}</span>
          <form action={signOut}>
            <SignOutButton />
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
