import { ApiError } from "@/shared/api/errors";
import { routes } from "@/shared/config/routes";

export function tokensPathFromInsufficient(error: ApiError, orderId: string): string {
  const raw = error.extra.purchaseUrl;
  let pathname: string = routes.tokens;
  if (typeof raw === "string" && raw.length > 0) {
    try {
      const url = new URL(raw, "http://localhost");
      if (url.pathname.startsWith("/") && !url.pathname.startsWith("//")) pathname = url.pathname;
    } catch {
      pathname = routes.tokens;
    }
  }
  return `${pathname}?${new URLSearchParams({ orderId }).toString()}`;
}
