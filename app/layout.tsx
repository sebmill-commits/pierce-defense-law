import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://piercecountydefense.com"),
  title: {
    default: "Pierce Defense Law | DUI & Traffic Ticket Attorney in Tacoma",
    template: "%s | Pierce Defense Law",
  },
  description:
    "Got a traffic ticket or DUI in Pierce County? We'll fight for you. Upload your citation, get a free quote, and let our experienced defense attorneys handle your case.",
  keywords: [
    "DUI lawyer Tacoma",
    "traffic ticket attorney Pierce County",
    "speeding ticket lawyer",
    "DUI defense Federal Way",
    "traffic violation attorney Lakewood",
    "fight traffic ticket Washington",
  ],
  authors: [{ name: "Pierce Defense Law" }],
  creator: "Pierce Defense Law",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://piercecountydefense.com",
    siteName: "Pierce Defense Law",
    title: "Pierce Defense Law | DUI & Traffic Ticket Defense",
    description:
      "Got a ticket? DUI charge? Upload your citation and get a free quote in minutes. Experienced defense attorneys serving Pierce County.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pierce Defense Law - Fighting For Your Future",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pierce Defense Law | DUI & Traffic Ticket Defense",
    description:
      "Got a ticket? DUI charge? Upload your citation and get a free quote in minutes.",
    images: ["/og-image.jpg"],
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${dmSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
