import Link from "next/link";
import PageHero from "../components/PageHero";
import ContentSection from "../components/ContentSection";
import FaqSection from "../components/FaqSection";
import ServiceCta from "../components/ServiceCta";
import { buildFaqSchema, buildServiceSchema, contact } from "../../lib/seo";

const path = "/corporate-airport-transfers-sydney";

export const metadata = {
  title: "Corporate Airport Transfers Sydney",
  description:
    "Corporate and executive airport transfers in Sydney with clean vehicles, flight tracking and professional drivers. Ask about recurring staff transfers.",
  alternates: {
    canonical: path
  }
};

const faqs = [
  {
    question: "Can you track our team's flight for pickups?",
    answer: "Yes, flight tracking is used for airport pickups by default."
  },
  {
    question: "Do you offer invoicing for businesses?",
    answer: "Call to discuss corporate billing arrangements."
  },
  {
    question: "Can we set up regular weekly transfers?",
    answer: "Yes — get in touch to set up a recurring schedule for your team."
  },
  {
    question: "What vehicles are used for executive transfers?",
    answer: "Our Lexus ES 300 premium sedan is the usual pick for executive single or double bookings; maxi vehicles are available for staff groups."
  }
];

const serviceSchema = buildServiceSchema({
  name: "Corporate Airport Transfers Sydney",
  description: metadata.description,
  serviceType: "Corporate Transfers",
  url: path
});
const faqSchema = buildFaqSchema(faqs);

export default function CorporateAirportTransfersPage() {
  return (
    <main>
      <PageHero
        eyebrow="Corporate Transfers"
        title="Corporate Airport Transfers, Sydney"
        intro="Clean vehicles, professional drivers and on-time pickups for business travel — Sydney Airport runs, client transport and staff transfers."
      />

      <ContentSection heading="Built around your flight, not a fixed clock">
        <p>We track flight arrivals for business travellers, so a delayed flight doesn&apos;t mean a missed pickup.</p>
        <p>
          For executive single or double bookings, our Lexus ES 300 premium sedan is the usual pick — see the
          full <Link className="text-link" href="/#fleet">fleet</Link>.
        </p>
      </ContentSection>

      <ContentSection heading="Recurring and scheduled transfers" tone="mist">
        <p>
          Regular staff transfers or a repeating pickup schedule? Call to talk through what you need — we can
          arrange recurring bookings around your team&apos;s schedule. For larger teams, see our{" "}
          <Link className="text-link" href="/maxi-cab-group-transfers-sydney">group transfer</Link> options.
        </p>
      </ContentSection>

      <ContentSection heading="A single point of contact">
        <p>
          For corporate arrangements, invoicing questions, or setting up a regular booking pattern, reach us
          directly on <a className="text-link" href={contact.phoneHref}>{contact.phone}</a> rather than the
          online form.
        </p>
      </ContentSection>

      <FaqSection faqs={faqs} />

      <ServiceCta />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}
