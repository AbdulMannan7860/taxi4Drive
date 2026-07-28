import "./globals.css";
import { Montserrat, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const siteUrl = "https://taxi2airport.com.au";
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-body" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Taxi2Airport | Sydney Airport Transfers & Maxi Cab Booking",
    template: "%s | Taxi2Airport"
  },
  description:
    "Book reliable Sydney airport transfers with Taxi2Airport: maxi cabs, wheelchair accessible taxis, cruise transfers and corporate rides, 24/7.",
  keywords: [
    "Taxi2Airport",
    "Sydney airport transfers",
    "maxi cab Sydney",
    "airport taxi Sydney",
    "wheelchair accessible taxi Sydney",
    "baby seat taxi Sydney",
    "cruise transfer Sydney",
    "fixed fare taxi Sydney"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Taxi2Airport | Sydney Airport Transfers, Made Easy",
    description:
      "Reliable, professional and on-time Sydney airport transfers, maxi cab, wheelchair taxi, baby seat taxi, cruise transfer and group transport booking.",
    url: siteUrl,
    siteName: "Taxi2Airport",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=80",
        width: 1600,
        height: 900,
        alt: "Sydney skyline"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Taxi2Airport | Sydney Airport Transfers, Made Easy",
    description:
      "Reliable Sydney airport transfers and private transfers with fast online booking and direct phone contact."
  }
};

export default function RootLayout({ children }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: "Taxi2Airport",
    url: siteUrl,
    areaServed: [
      "Sydney",
      "Sydney Airport",
      "Sydney CBD",
      "Eastern Suburbs",
      "Inner West",
      "North Shore",
      "Western Sydney"
    ],
    telephone: "1300 22 77 00",
    email: "book@taxi2airport.com.au",
    serviceType: [
      "Airport Transfers",
      "Maxi Cab",
      "Wheelchair Accessible Taxi",
      "Cruise Transfers",
      "Corporate Transfers",
      "Baby Seat Taxi",
      "Group Transfers"
    ]
  };

  return (
    <html lang="en">
      <body className={`${poppins.variable} ${montserrat.variable}`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
