import "./globals.css";
import { Montserrat, Poppins } from "next/font/google";

const siteUrl = "https://www.taxi2airport.com.au";
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-body" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Taxi2Airport.com.au | Sydney Airport Transfers, Maxi Taxi & Fixed Fare Booking",
    template: "%s | Taxi2Airport.com.au"
  },
  description:
    "Book Taxi2Airport.com.au for Sydney airport transfers, maxi taxis, wheelchair accessible transfers, cruise transfers, baby seat bookings, and fixed fare private rides.",
  keywords: [
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
    title: "Taxi2Airport.com.au | Sydney Airport Transfers",
    description:
      "Fixed fare airport transfers, maxi taxis, wheelchair accessible transfers, cruise transfers, baby seat bookings, and premium rides across Sydney.",
    url: siteUrl,
    siteName: "Taxi2Airport.com.au",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=80",
        width: 1600,
        height: 900,
        alt: "Sydney harbour and city skyline"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Taxi2Airport.com.au | Sydney Airport Transfers",
    description:
      "Sydney airport taxi, maxi cab and private transfers with fixed fare booking."
  }
};

export default function RootLayout({ children }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: "Taxi2Airport.com.au",
    url: siteUrl,
    areaServed: [
      "Sydney",
      "Sydney Airport",
      "Parramatta",
      "Bankstown",
      "Liverpool",
      "Blacktown",
      "Bondi",
      "Penrith"
    ],
    telephone: "1300 22 77 00",
    email: "book@taxi2airport.com.au",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sydney",
      addressRegion: "NSW",
      addressCountry: "AU"
    },
    serviceType: [
      "Airport Transfers",
      "Maxi Cab",
      "Wheelchair Accessible Taxi",
      "Cruise Transfers",
      "Corporate Transfers"
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
      </body>
    </html>
  );
}
