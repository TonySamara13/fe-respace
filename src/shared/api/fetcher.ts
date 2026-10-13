import { SESSION_COOKIE } from "@/shared/config/session";
import { serverEnv } from "@/shared/config/env";

import { toApiError } from "./errors";

type FetcherOptions = RequestInit & {
  schema?: unknown;
};

function resolveUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const apiPath = path.startsWith("/api/v1") ? path : `/api/v1${path.startsWith("/") ? path : `/${path}`}`;
  if (typeof window === "undefined") {
    return `${serverEnv().backendUrl}${apiPath}`;
  }
  return `/api/backend${apiPath.slice("/api/v1".length)}`;
}

async function serverAuthorization(): Promise<string | undefined> {
  if (typeof window !== "undefined") return undefined;
  const { cookies } = await import("next/headers");
  return (await cookies()).get(SESSION_COOKIE)?.value;
}

export async function fetcher<T>(url: string, options?: FetcherOptions): Promise<T> {
  const { headers, cache, ...init } = options ?? {};
  delete (init as { schema?: unknown }).schema;
  const token = await serverAuthorization();
  const hasRevalidate = Boolean((init as { next?: { revalidate?: number } }).next);
  const response = await fetch(resolveUrl(url), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: cache ?? (typeof window === "undefined" && !hasRevalidate ? "no-store" : undefined),
  });

  const text = await response.text();
  let body: unknown;
  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = undefined;
    }
  }

  if (!response.ok) {
    if (
      response.status === 401 &&
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/auth")
    ) {
      const next = `${window.location.pathname}${window.location.search}`;
      // 401 приходит из общего fetcher, вне React-дерева: роутер здесь недоступен.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(`/auth/login?next=${encodeURIComponent(next)}`);
    }
    throw toApiError(response.status, body);
  }

  return {
    data: body,
    status: response.status,
    headers: response.headers,
  } as T;
}
