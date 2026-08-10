import Link from "next/link";
import PageHero from "../components/PageHero";
import ContentSection from "../components/ContentSection";
import FaqSection from "../components/FaqSection";
import ServiceCta from "../components/ServiceCta";
import { buildFaqSchema, buildServiceSchema } from "../../lib/seo";

const path = "/cruise-transfers-sydney";

export const metadata = {
  title: "Cruise Transfers Sydney | White Bay & Quay",
  description:
    "Sydney cruise terminal transfers to White Bay and Circular Quay from home, hotel or the airport. Maxi cabs for groups and luggage. Fixed fare quotes.",
  alternates: {
    canonical: path
  }
};

const faqs = [
  {
    question: "Do you go to both cruise terminals?",
    answer: "Yes — White Bay Cruise Terminal and Circular Quay's Overseas Passenger Terminal."
  },
  {
    question: "Can you pick up straight from the airport?",
    answer: "Yes, with pickup timed to your flight for connecting arrivals ahead of a cruise."
  },
  {
    question: "What if we have a lot of luggage?",
    answer: "Ask about a 7 or 11-seater maxi cab when booking a group — plenty of room for cruise-sized luggage."
  },
  {
    question: "Can you book a return pickup for when we get back?",
    answer: "Yes — flag the return date when you book, or call ahead of your arrival back into port."
  }
];

const serviceSchema = buildServiceSchema({
  name: "Cruise Terminal Transfers Sydney",
  description: metadata.description,
  serviceType: "Cruise Transfers",
  url: path
});
const faqSchema = buildFaqSchema(faqs);

export default function CruiseTransfersPage() {
  return (
    <main>
      <PageHero
        eyebrow="Cruise Transfers"
        title="Cruise Terminal Transfers, Sydney"
        intro="Door-to-terminal transfers to both of Sydney's cruise terminals, from home, your hotel, or straight off a connecting flight."
      />

      <ContentSection heading="Which terminal are you sailing from?">
        <p>
          Sydney has two main cruise terminals: White Bay Cruise Terminal in Rozelle, and the Overseas Passenger
          Terminal at Circular Quay. Tell us which one when you book and we&apos;ll plan the route and timing
          accordingly — traffic and drop-off points differ between the two.
        </p>
      </ContentSection>

      <ContentSection heading="Airport-to-ship connections" tone="mist">
        <p>
          Flying in for your cruise? We track your flight and time the pickup to your arrival, so there&apos;s no
          rush getting from the terminal to the ship.
        </p>
      </ContentSection>

      <ContentSection heading="Room for cruise luggage">
        <p>
          Cruise trips mean more bags than a weekend away. Our 7 and 11-seater{" "}
          <Link className="text-link" href="/maxi-cab-group-transfers-sydney">maxi cabs</Link> carry groups and
          their luggage in one trip instead of splitting across cars.
        </p>
      </ContentSection>

      <ContentSection heading="Fixed fare quotes" tone="mist">
        <p>Ask for a fixed fare when you book so there are no surprises at drop-off.</p>
      </ContentSection>

      <FaqSection faqs={faqs} />

      <ServiceCta />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}
