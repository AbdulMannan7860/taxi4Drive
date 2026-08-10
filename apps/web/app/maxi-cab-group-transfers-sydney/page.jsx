import Link from "next/link";
import PageHero from "../components/PageHero";
import ContentSection from "../components/ContentSection";
import FaqSection from "../components/FaqSection";
import ServiceCta from "../components/ServiceCta";
import { buildFaqSchema, buildServiceSchema } from "../../lib/seo";

const path = "/maxi-cab-group-transfers-sydney";

export const metadata = {
  title: "Maxi Cab Sydney | 7 & 11 Seater Transfers",
  description:
    "Maxi cab Sydney for groups: 7-seaters and 11-seater HiAce vans for airport runs, weddings, race days and events. Fixed fare group quotes, 24/7.",
  alternates: {
    canonical: path
  }
};

const faqs = [
  {
    question: "How many bags fit in the 11-seater?",
    answer: "Up to 18, depending on size — mention your luggage count when booking so the right van is sent."
  },
  {
    question: "Can I book a maxi cab for a wedding or race day?",
    answer: "Yes — treat it the same as any group booking and let us know the occasion so timing is planned around it."
  },
  {
    question: "Is the fare per person or for the whole group?",
    answer: "Ask for a fixed fare for the whole vehicle when you book."
  },
  {
    question: "How far ahead should I book for an event?",
    answer: "As early as possible for weddings and race days — these are high-demand dates."
  }
];

const serviceSchema = buildServiceSchema({
  name: "Maxi Cab & Group Transfers Sydney",
  description: metadata.description,
  serviceType: "Maxi Cab",
  url: path
});
const faqSchema = buildFaqSchema(faqs);

export default function MaxiCabGroupTransfersPage() {
  return (
    <main>
      <PageHero
        eyebrow="Group Transfers"
        title="Maxi Cab Sydney — 7 & 11 Seater Group Transfers"
        intro="Keep the group together instead of splitting into multiple cars — airport runs, weddings, race days and events, one vehicle, one fare."
      />

      <ContentSection heading="7-seater vs 11-seater — which one?">
        <p>
          A 7-seater (Kia Carnival or Mercedes V-Class) carries up to 7 passengers and up to 8 bags — good for
          family groups and small events. The 11-seater Toyota HiAce Commuter carries up to 11 passengers and up
          to 18 bags, built for larger groups, sports teams and bigger luggage loads. See the full{" "}
          <Link className="text-link" href="/#fleet">fleet lineup</Link>.
        </p>
      </ContentSection>

      <ContentSection heading="Built for events, not just airport runs" tone="mist">
        <p>
          Weddings, birthdays, race days and{" "}
          <Link className="text-link" href="/corporate-airport-transfers-sydney">corporate group bookings</Link>{" "}
          all run on the same maxi fleet — one vehicle, one driver, one fixed fare for the group instead of
          coordinating several taxis.
        </p>
      </ContentSection>

      <ContentSection heading="Group fixed fares">
        <p>Ask for a fixed fare when booking a group so the cost is agreed upfront, not split awkwardly at the end of the trip.</p>
        <p>
          Heading to a cruise with the group? See our{" "}
          <Link className="text-link" href="/cruise-transfers-sydney">cruise terminal transfers</Link>.
        </p>
      </ContentSection>

      <FaqSection faqs={faqs} />

      <ServiceCta />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}
