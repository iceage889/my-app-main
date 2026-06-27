import { redirect } from "next/navigation";
import { getAdminUser } from "../../lib/supabase/auth-server";
import { isAllowedAdmin } from "../../lib/admin/auth";
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

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 border-b border-[var(--color-line)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-6">
          <span className="text-lg font-bold">Admin</span>
          <nav className="flex gap-4 text-sm">
            <NavLink href="/admin/bookings">Bookings</NavLink>
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
