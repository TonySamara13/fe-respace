import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import type { ReactNode } from "react";

import { readSessionUser } from "@/shared/api/sessionCookie";
import { AppHeader } from "@/shared/ui/AppHeader";
import { QueryProvider } from "@/shared/ui/QueryProvider";
import { SiteFooter } from "@/shared/ui/SiteFooter";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Целла",
    template: "%s — Целла",
  },
  description:
    "Загрузите снимки своей комнаты и скажите, что изменить: свет, мебель, пол или стены. Планировка останется вашей.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await readSessionUser();

  return (
    <html lang="ru" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="flex min-h-full flex-col">
        <QueryProvider>
          <AppHeader user={user} />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </QueryProvider>
      </body>
    </html>
  );
}
