import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CycleRun — Free Indoor Training with Your Webcam | Cycling & Running Simulator",
  description: "CycleRun is the free Zwift alternative for your home workout. Use your webcam instead of expensive sensors — for spinning bikes, ergometers, treadmills and old home trainers. No hardware, no subscription.",
  keywords: "indoor cycling, spinning simulator, treadmill simulator, zwift alternative free, ergometer app, home trainer webcam, indoor training, rouvy alternative, cycling app free, home trainer software",
  authors: [{ name: "CycleRun.app" }],
  // TODO: Change back to "index, follow" after Search Console + Analytics setup
  robots: "noindex, nofollow",
  metadataBase: new URL("https://cyclerun.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CycleRun — Free Indoor Training with Your Webcam",
    description: "The free Zwift alternative: Use your webcam instead of expensive sensors for spinning, ergometer & treadmill.",
    type: "website",
    url: "https://cyclerun.app/",
    locale: "en_US",
    siteName: "CycleRun",
  },
  twitter: {
    card: "summary_large_image",
    title: "CycleRun — Free Indoor Training with Your Webcam",
    description: "The free Zwift alternative: Use your webcam instead of expensive sensors.",
  },
  other: {
    "theme-color": "#0A0A0B",
  },
};

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CycleRun",
  url: "https://cyclerun.app",
  description: "Free camera-based indoor training platform for cycling and running. Use your webcam instead of expensive sensors.",
  applicationCategory: "SportsApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  featureList: [
    "Webcam-based motion detection",
    "Spinning bike compatible",
    "Ergometer compatible",
    "Treadmill compatible",
    "Real-time video synchronization",
    "No additional hardware needed",
  ],
  softwareVersion: "1.0-beta",
  inLanguage: ["de", "en"],
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Is CycleRun really free?", acceptedAnswer: { "@type": "Answer", text: "Yes, CycleRun is a community project and completely free. No hidden costs, no subscription, no premium version. You just need a webcam and a browser." } },
    { "@type": "Question", name: "Which devices are compatible with CycleRun?", acceptedAnswer: { "@type": "Answer", text: "CycleRun works with any home trainer where pedals or legs move visibly: spinning bikes, ergometers, old home trainers, treadmills and indoor bikes. No smart trainer or Bluetooth sensors needed." } },
    { "@type": "Question", name: "How does CycleRun work without sensors?", acceptedAnswer: { "@type": "Answer", text: "CycleRun uses your webcam and AI-powered motion detection to measure your cadence (RPM). You place detection zones over your knees or pedals, and the software automatically detects your movement." } },
    { "@type": "Question", name: "What is the difference between CycleRun and Zwift?", acceptedAnswer: { "@type": "Answer", text: "Zwift requires a smart trainer (from €300) and a monthly subscription (€17.99/month). CycleRun is free and only uses your existing webcam." } },
    { "@type": "Question", name: "Does CycleRun work with a treadmill?", acceptedAnswer: { "@type": "Answer", text: "Running mode is currently in development. Camera detection will also support running movements." } },
    { "@type": "Question", name: "Are my webcam images stored or transmitted?", acceptedAnswer: { "@type": "Answer", text: "No, absolutely not. All image processing happens locally in your browser." } },
    { "@type": "Question", name: "Can I use my old ergometer or home trainer?", acceptedAnswer: { "@type": "Answer", text: "Yes! Whether your ergometer is 5 or 25 years old — as long as your legs move, CycleRun can detect the motion." } },
  ],
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CycleRun",
  url: "https://cyclerun.app",
  description: "Community project for free camera-based indoor training",
  foundingDate: "2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
