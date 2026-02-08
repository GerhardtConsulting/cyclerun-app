import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LocaleSync from "@/components/LocaleSync";
import CookieConsent from "@/components/CookieConsent";
import { defaultMetadata, JsonLd, schemas, homepageFaqs } from "@/app/seo-config";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <JsonLd data={[
          schemas.webApplication(),
          schemas.faqPage(homepageFaqs),
          schemas.organization(),
        ]} />
      </head>
      <body className={inter.className}>
        <LocaleSync />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
