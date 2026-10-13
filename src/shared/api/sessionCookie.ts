import { NextResponse } from "next/server";

import { serverEnv } from "@/shared/config/env";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  USER_COOKIE,
  type SessionUser,
} from "@/shared/config/session";

type AuthPayload = {
  accessToken: string;
  email: string;
  emailVerified: boolean;
};

function cookieBase() {
  return {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export function writeSession(response: NextResponse, auth: AuthPayload) {
  response.cookies.set(SESSION_COOKIE, auth.accessToken, {
    ...cookieBase(),
    httpOnly: true,
  });
  const user: SessionUser = { email: auth.email, emailVerified: auth.emailVerified };
  response.cookies.set(USER_COOKIE, encodeURIComponent(JSON.stringify(user)), {
    ...cookieBase(),
    httpOnly: false,
  });
}

export function clearSession(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  response.cookies.set(USER_COOKIE, "", { path: "/", maxAge: 0 });
}

export async function readSessionToken(): Promise<string | undefined> {
  const { cookies } = await import("next/headers");
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function readSessionUser(): Promise<SessionUser | null> {
  const { cookies } = await import("next/headers");
  const raw = (await cookies()).get(USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    const value = JSON.parse(decodeURIComponent(raw)) as SessionUser;
    if (typeof value.email !== "string" || typeof value.emailVerified !== "boolean") return null;
    return value;
  } catch {
    return null;
  }
}

export function backendUrl(path: string): string {
  return `${serverEnv().backendUrl}/api/v1${path}`;
}
