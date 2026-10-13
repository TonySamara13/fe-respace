export const routes = {
  home: "/",
  login: "/auth/login",
  register: "/auth/register",
  verifyEmail: "/auth/verify-email",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
  orders: "/cabinet/orders",
  newOrder: "/cabinet/orders/new",
  order: (id: string) => `/cabinet/orders/${id}`,
  tokens: "/cabinet/tokens",
  offer: "/legal/offer",
  privacy: "/legal/privacy",
  requisites: "/legal/requisites",
  devUi: "/dev/ui",
} as const;

export function safeNextPath(value: string | null | undefined, fallback: string = routes.orders): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  return value;
}
