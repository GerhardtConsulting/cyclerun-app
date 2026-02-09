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
        {/* Google Consent Mode v2 defaults + GA4 config — MUST be before gtag.js */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
          gtag('js', new Date());
          gtag('config', 'G-WL522VY008', { cookie_flags: 'SameSite=Lax;Secure' });
        `}} />
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WL522VY008" />
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
