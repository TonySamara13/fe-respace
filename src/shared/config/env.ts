export const publicEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || undefined,
};

export function serverEnv() {
  return {
    backendUrl: process.env.BACKEND_URL ?? "http://localhost:8080",
    siteUrl: publicEnv.siteUrl,
  };
}
