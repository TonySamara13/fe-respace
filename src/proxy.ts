import { NextResponse, type NextRequest } from "next/server";

import { routes, safeNextPath } from "@/shared/config/routes";
import { SESSION_COOKIE } from "@/shared/config/session";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname.startsWith("/cabinet") && !hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = routes.login;
    url.search = `?next=${encodeURIComponent(`${pathname}${search}`)}`;
    return NextResponse.redirect(url);
  }

  if (hasSession && (pathname === routes.login || pathname === routes.register)) {
    const next = safeNextPath(request.nextUrl.searchParams.get("next"));
    return NextResponse.redirect(new URL(next, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cabinet/:path*", "/auth/login", "/auth/register"],
};
