import "./globals.css";
import { Montserrat, Poppins } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import MobileStickyActions from "./components/MobileStickyActions";

const clarityProjectId = "y3r3ibaecv";
const googleAdsId = "AW-18399898208";

const siteUrl = "https://www.taxi2airport.com.au";
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-body" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display" });

export const viewport = {
  themeColor: "#0B1D33"
};

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
        url: `${siteUrl}/og-image.jpg`,
        width: 1600,
        height: 1067,
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
    telephone: "1300 822 382",
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
        <SiteHeader />
        {children}
        <MobileStickyActions />
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <Analytics />
        <SpeedInsights />
        <Script
          id="google-ads-tag"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
        />
        <Script id="google-ads-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAdsId}');`}
        </Script>
        <Script id="clarity-tag" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityProjectId}");`}
        </Script>
      </body>
    </html>
  );
}
