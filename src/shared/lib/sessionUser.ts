import { USER_COOKIE, type SessionUser } from "@/shared/config/session";

export function readSessionUser(): SessionUser | null {
  if (typeof document === "undefined") return null;
  const row = document.cookie.split("; ").find((part) => part.startsWith(`${USER_COOKIE}=`));
  if (!row) return null;
  try {
    const value = JSON.parse(decodeURIComponent(row.slice(USER_COOKIE.length + 1))) as SessionUser;
    if (typeof value.email !== "string" || typeof value.emailVerified !== "boolean") return null;
    return value;
  } catch {
    return null;
  }
}
