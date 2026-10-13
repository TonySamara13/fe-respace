import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import type { ReactNode } from "react";

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
    default: "Interior Studio",
    template: "%s — Interior Studio",
  },
  description: "Новый интерьер по вашим фото. Одна комната — 30 токенов, 3 photoreal варианта.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="flex min-h-full flex-col">
        <QueryProvider>
          <AppHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </QueryProvider>
      </body>
    </html>
  );
}
