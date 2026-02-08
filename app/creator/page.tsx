import type { Metadata } from "next";
import CreatorContent from "@/components/CreatorContent";
import { JsonLd, makeAlternates } from "@/app/seo-config";

export const metadata: Metadata = {
  title: "Become a Creator — Earn Money with Your Cycling Videos",
  description:
    "Share your POV cycling routes with 10,000+ riders. Earn passive income, grow your audience, and join the fastest-growing indoor cycling community. Free to join — apply in 2 minutes.",
  keywords:
    "cycling creator, POV cycling video, indoor cycling routes, cycling content creator, cycling video monetization, GoPro cycling, cycling influencer, route video creator, cycling community, fitness creator platform",
  alternates: makeAlternates("/creator"),
  openGraph: {
    title: "Become a CycleRun Creator — Your Routes, Your Revenue",
    description:
      "Film your rides, upload POV routes, and earn from every play. Join the community-powered indoor cycling revolution.",
    type: "website",
    url: "https://cyclerun.app/creator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Become a CycleRun Creator — Your Routes, Your Revenue",
    description:
      "Film your rides, upload POV routes, and earn from every play.",
  },
};

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Record Perfect POV Cycling Videos for CycleRun",
  description:
    "Step-by-step guide to recording immersive first-person cycling videos that indoor riders love.",
  totalTime: "PT30M",
  supply: [
    { "@type": "HowToSupply", name: "Action camera (GoPro, DJI, Insta360)" },
    { "@type": "HowToSupply", name: "Chest or handlebar mount" },
    { "@type": "HowToSupply", name: "Bicycle" },
  ],
  tool: [
    { "@type": "HowToTool", name: "GPS-enabled camera or phone for GPX data" },
    { "@type": "HowToTool", name: "Video editing software (optional)" },
  ],
  step: [
    {
      "@type": "HowToStep",
      name: "Choose Your Route",
      text: "Select a scenic route with varied terrain. Coastal roads, mountain passes, and forest trails perform best. Routes between 20–60 minutes are ideal.",
    },
    {
      "@type": "HowToStep",
      name: "Set Up Your Camera",
      text: "Mount your action camera on your chest or handlebars. Use 1080p or 4K at 30fps. Enable electronic image stabilization (EIS). Keep the horizon level.",
    },
    {
      "@type": "HowToStep",
      name: "Record GPS/GPX Data",
      text: "Enable GPS on your camera or use a cycling computer (Garmin, Wahoo) to record a .gpx file. This data enables elevation-based resistance simulation.",
    },
    {
      "@type": "HowToStep",
      name: "Ride and Record",
      text: "Maintain a steady pace. Avoid sudden head movements. Signal turns smoothly. Ride defensively — your video will be watched by thousands.",
    },
    {
      "@type": "HowToStep",
      name: "Edit and Upload",
      text: "Trim start/end, stabilize if needed. Export as MP4 (H.264, 1080p). Upload to CycleRun with your GPX file, route description, and thumbnail.",
    },
  ],
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much can I earn as a CycleRun creator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Earnings depend on route popularity. Creators earn a revenue share from premium route purchases. Popular routes with scenic locations can generate significant passive income as the community grows.",
      },
    },
    {
      "@type": "Question",
      name: "What equipment do I need?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An action camera (GoPro Hero, DJI Osmo Action, Insta360) with a chest or handlebar mount. A GPS-enabled device for GPX data is recommended but optional. Any bicycle works.",
      },
    },
    {
      "@type": "Question",
      name: "What is a GPX file and why does it matter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "GPX (GPS Exchange Format) is an XML-based file that records your route coordinates, elevation, and timestamps. When paired with your video, CycleRun can simulate realistic inclines and resistance changes, creating a much more immersive experience for riders.",
      },
    },
    {
      "@type": "Question",
      name: "How long should my route videos be?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "20–60 minutes is the sweet spot. Short routes (15–20 min) work great for quick sessions. Longer routes (45–60 min) are popular for endurance training. You can also create series of connected routes.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to edit my videos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Minimal editing is fine. Trim the start and end, apply stabilization if your camera doesn't have built-in EIS. Raw, authentic rides often perform better than over-produced content.",
      },
    },
    {
      "@type": "Question",
      name: "How does the approval process work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Apply with your name and email. We review applications within 48 hours. Once approved, you get access to the Creator Dashboard where you can upload routes, track views, and manage earnings.",
      },
    },
  ],
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "CycleRun.app", item: "https://cyclerun.app" },
    { "@type": "ListItem", position: 2, name: "Become a Creator", item: "https://cyclerun.app/creator" },
  ],
};

const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Become a CycleRun Creator",
  description: "Join the CycleRun creator program. Film POV cycling routes, earn revenue, and reach thousands of indoor riders.",
  url: "https://cyclerun.app/creator",
  isPartOf: { "@type": "WebSite", name: "CycleRun.app", url: "https://cyclerun.app" },
  breadcrumb: jsonLdBreadcrumb,
};

export default function CreatorPage() {
  return (
    <>
      <JsonLd data={[jsonLdWebPage, jsonLdHowTo, jsonLdFaq, jsonLdBreadcrumb]} />
      <CreatorContent />
    </>
  );
}
