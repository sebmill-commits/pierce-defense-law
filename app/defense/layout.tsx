import type { Metadata } from "next";
import SeattleHeader from "@/components/seattle/layout/Header";
import SeattleFooter from "@/components/seattle/layout/Footer";
import SeattleMobileCallBar from "@/components/seattle/layout/MobileCallBar";

export const metadata: Metadata = {
  metadataBase: new URL("https://rivercrestlaw.com/defense"),
  title: {
    default: "Seattle DUI & Traffic Ticket Attorney | Rivercrest Law",
    template: "%s | Rivercrest Law Seattle",
  },
  description:
    "Got a traffic ticket or DUI in Seattle or King County? We'll fight for you. Upload your citation, get a free quote, and let our experienced defense attorneys handle your case.",
  keywords: [
    "DUI lawyer Seattle",
    "traffic ticket attorney King County",
    "speeding ticket lawyer Seattle",
    "DUI defense Bellevue",
    "traffic violation attorney Kirkland",
    "fight traffic ticket Washington",
  ],
  authors: [{ name: "Rivercrest Law" }],
  creator: "Rivercrest Law",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rivercrestlaw.com/defense",
    siteName: "Rivercrest Law - Seattle Defense",
    title: "Seattle DUI & Traffic Ticket Defense | Rivercrest Law",
    description:
      "Got a ticket? DUI charge? Upload your citation and get a free quote in minutes. Experienced defense attorneys serving Seattle and King County.",
    images: [
      {
        url: "/og-image-seattle.jpg",
        width: 1200,
        height: 630,
        alt: "Rivercrest Law - Seattle Defense",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Seattle DUI & Traffic Ticket Defense | Rivercrest Law",
    description:
      "Got a ticket? DUI charge? Upload your citation and get a free quote in minutes.",
    images: ["/og-image-seattle.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function SeattleDefenseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SeattleHeader />
      <main className="pb-20 lg:pb-0">{children}</main>
      <SeattleFooter />
      <SeattleMobileCallBar />
    </>
  );
}
