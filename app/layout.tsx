import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { brandName } from "@/lib/brand";
import { draftPreview, siteUrl } from "@/lib/env";

const serif = Newsreader({ subsets: ["latin"], variable: "--font-serif", display: "swap", weight: ["400", "500"], style: ["normal", "italic"] });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: `${brandName()} — ${site.company.descriptor}`, template: `%s | ${brandName()}` },
  description: site.company.shortDescription,
  openGraph: { type: "website", siteName: brandName(), locale: "en_GB" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, email: false, address: false },
  // Draft previews (dev/staging) must never be indexed.
  robots: draftPreview ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = { themeColor: "#14213d", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
