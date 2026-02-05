import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CycleRun — Kostenloses Indoor Training mit Kamera | Spinning & Laufband Simulator",
  description: "CycleRun ist die kostenlose Zwift-Alternative für dein Heimtraining. Nutze deine Webcam statt teurer Sensoren — für Spinning, Ergometer, Laufband und alte Heimtrainer. Keine Hardware, kein Abo.",
  keywords: "indoor cycling, spinning simulator, laufband simulator, zwift alternative kostenlos, ergometer app, heimtrainer webcam, indoor training, rouvy alternative, cycling app free, home trainer software",
  authors: [{ name: "CycleRun.app" }],
  robots: "index, follow",
  metadataBase: new URL("https://cyclerun.app"),
  alternates: {
    canonical: "/",
    languages: {
      de: "/",
      en: "/en/",
    },
  },
  openGraph: {
    title: "CycleRun — Kostenloses Indoor Training mit Kamera",
    description: "Die kostenlose Zwift-Alternative: Nutze deine Webcam statt teurer Sensoren für Spinning, Ergometer & Laufband.",
    type: "website",
    url: "https://cyclerun.app/",
    locale: "de_DE",
    siteName: "CycleRun",
  },
  twitter: {
    card: "summary_large_image",
    title: "CycleRun — Kostenloses Indoor Training mit Kamera",
    description: "Die kostenlose Zwift-Alternative: Nutze deine Webcam statt teurer Sensoren.",
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
  description: "Kostenlose kamerabasierte Indoor-Training-Plattform für Cycling und Running. Nutze deine Webcam statt teurer Sensoren.",
  applicationCategory: "SportsApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  featureList: [
    "Webcam-basierte Bewegungserkennung",
    "Spinning-Bike Kompatibilität",
    "Ergometer Kompatibilität",
    "Laufband Kompatibilität",
    "Echtzeit-Video-Synchronisation",
    "Keine zusätzliche Hardware nötig",
  ],
  softwareVersion: "1.0-beta",
  inLanguage: ["de", "en"],
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Ist CycleRun wirklich kostenlos?", acceptedAnswer: { "@type": "Answer", text: "Ja, CycleRun ist ein Community-Projekt und vollständig kostenlos. Es gibt keine versteckten Kosten, kein Abo und keine Premium-Version. Du brauchst nur eine Webcam und einen Browser." } },
    { "@type": "Question", name: "Welche Geräte sind mit CycleRun kompatibel?", acceptedAnswer: { "@type": "Answer", text: "CycleRun funktioniert mit jedem Heimtrainer, bei dem sich Pedale oder Beine sichtbar bewegen: Spinning-Bikes, Ergometer, alte Heimtrainer, Laufbänder und Indoor Bikes. Du brauchst keinen Smart Trainer und keine Bluetooth-Sensoren." } },
    { "@type": "Question", name: "Wie funktioniert CycleRun ohne Sensoren?", acceptedAnswer: { "@type": "Answer", text: "CycleRun nutzt deine Webcam und KI-gestützte Bewegungserkennung, um deine Trittfrequenz (RPM) zu messen. Du platzierst Erkennungszonen über deinen Knien oder Pedalen, und die Software erkennt automatisch deine Bewegung." } },
    { "@type": "Question", name: "Was ist der Unterschied zwischen CycleRun und Zwift?", acceptedAnswer: { "@type": "Answer", text: "Zwift erfordert einen Smart Trainer (ab €300) und ein monatliches Abo (€17,99/Monat). CycleRun ist kostenlos und nutzt nur deine vorhandene Webcam." } },
    { "@type": "Question", name: "Funktioniert CycleRun auch mit einem Laufband?", acceptedAnswer: { "@type": "Answer", text: "Der Running-Modus ist aktuell in Entwicklung. Die Kamera-Erkennung wird auch Laufbewegungen unterstützen." } },
    { "@type": "Question", name: "Werden meine Webcam-Bilder gespeichert oder übertragen?", acceptedAnswer: { "@type": "Answer", text: "Nein, absolut nicht. Die gesamte Bildverarbeitung findet lokal in deinem Browser statt." } },
    { "@type": "Question", name: "Kann ich mein altes Ergometer oder Heimtrainer verwenden?", acceptedAnswer: { "@type": "Answer", text: "Ja! Egal ob dein Ergometer 5 oder 25 Jahre alt ist — solange sich deine Beine bewegen, kann CycleRun die Bewegung erkennen." } },
  ],
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CycleRun",
  url: "https://cyclerun.app",
  description: "Community-Projekt für kostenloses kamerabasiertes Indoor-Training",
  foundingDate: "2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <link rel="manifest" href="/manifest.json" />
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
