import Link from "next/link";
import PageHero from "../components/PageHero";
import ContentSection from "../components/ContentSection";
import FaqSection from "../components/FaqSection";
import ServiceCta from "../components/ServiceCta";
import { buildFaqSchema, buildServiceSchema } from "../../lib/seo";

const path = "/baby-seat-taxi-sydney";

export const metadata = {
  title: "Baby Seat Taxi Sydney | 24/7",
  description:
    "Taxi with a baby seat in Sydney: capsule, forward-facing and booster options on request. Airport and everyday transfers, available 24/7.",
  alternates: {
    canonical: path
  }
};

const faqs = [
  {
    question: "Is the baby seat free or an extra charge?",
    answer: "Ask when booking — mention your child's age so the right seat and any cost is confirmed upfront."
  },
  {
    question: "Can I request a baby seat for an airport transfer?",
    answer: "Yes, the same as any other trip — flag it at booking."
  },
  {
    question: "What ages do you cover?",
    answer: "From infant capsules through to booster seats for older children."
  },
  {
    question: "Can you fit more than one child seat?",
    answer: "Let us know how many seats you need — we'll confirm the right vehicle for it."
  }
];

const serviceSchema = buildServiceSchema({
  name: "Baby Seat Taxi Sydney",
  description: metadata.description,
  serviceType: "Baby Seat Taxi",
  url: path
});
const faqSchema = buildFaqSchema(faqs);

export default function BabySeatTaxiPage() {
  return (
    <main>
      <PageHero
        eyebrow="Family Travel"
        title="Baby Seat Taxi, Sydney"
        intro="Travelling with a baby or toddler doesn't mean travelling without a taxi. Request a baby seat and we'll bring the right child restraint."
      />

      <ContentSection heading="Which seat does my child need?">
        <p>
          Tell us your child&apos;s approximate age and weight when booking, and we&apos;ll bring the matching
          restraint — infant capsule, forward-facing toddler seat, or booster for older kids.
        </p>
      </ContentSection>

      <ContentSection heading="Safety first" tone="mist">
        <p>Restraints meet Australian child safety standards and are fitted by the driver before you&apos;re picked up.</p>
      </ContentSection>

      <ContentSection heading="How to request one">
        <p>
          Add the baby seat request when you book online, or mention it when you call — do this ahead of time
          rather than on the day, so the right seat is in the car when it arrives.
        </p>
        <p>
          Also need step-free access? See our{" "}
          <Link className="text-link" href="/wheelchair-accessible-taxi-sydney">wheelchair accessible taxi</Link> page.
        </p>
      </ContentSection>

      <FaqSection faqs={faqs} />

      <ServiceCta />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}
