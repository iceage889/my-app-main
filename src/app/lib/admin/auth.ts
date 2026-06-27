/** Edge-safe helpers for the admin email allowlist (no Node-only APIs). */

export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdmin(email?: string | null): boolean {
  if (!email) return false;
  const list = getAdminEmails();
  return list.length > 0 && list.includes(email.toLowerCase());
}
