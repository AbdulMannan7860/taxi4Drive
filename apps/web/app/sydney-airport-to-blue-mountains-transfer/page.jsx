import Link from "next/link";
import PageHero from "../components/PageHero";
import ContentSection from "../components/ContentSection";
import FaqSection from "../components/FaqSection";
import ServiceCta from "../components/ServiceCta";
import { buildFaqSchema, buildServiceSchema } from "../../lib/seo";

const path = "/sydney-airport-to-blue-mountains-transfer";

export const metadata = {
  title: "Sydney Airport to Blue Mountains Transfer",
  description:
    "Private transfers from Sydney Airport to the Blue Mountains — Katoomba, Leura, Wentworth Falls and surrounds. Fixed fare quotes, book one way or return.",
  alternates: {
    canonical: path
  }
};

const faqs = [
  {
    question: "How far in advance should I book?",
    answer: "As early as you can for long-distance transfers — this locks in the vehicle and fare."
  },
  {
    question: "Do you go to Katoomba and Leura specifically?",
    answer: "Yes, and surrounding Blue Mountains towns — give us the exact address when booking."
  },
  {
    question: "Is it a fixed fare or metered?",
    answer: "Ask for a fixed fare quote at booking time."
  },
  {
    question: "Can I book a return pickup from the Blue Mountains back to the airport?",
    answer: "Yes — choose Return Trip when booking, or call to arrange the return leg."
  }
];

const serviceSchema = buildServiceSchema({
  name: "Sydney Airport to Blue Mountains Transfers",
  description: metadata.description,
  serviceType: "Regional Transfers",
  url: path
});
const faqSchema = buildFaqSchema(faqs);

export default function BlueMountainsTransferPage() {
  return (
    <main>
      <PageHero
        eyebrow="Regional Transfers"
        title="Sydney Airport to Blue Mountains Transfers"
        intro="A direct, door-to-door transfer from Sydney Airport to the Blue Mountains — no train changes, no waiting around with luggage."
      />

      <ContentSection heading="How long is the drive?">
        <p>Around 1.5 to 2 hours depending on traffic and your exact drop-off point — roughly 100km from the airport.</p>
      </ContentSection>

      <ContentSection heading="Where we cover" tone="mist">
        <p>Katoomba, Leura, Wentworth Falls and the surrounding Blue Mountains area. Let us know your exact address when booking.</p>
      </ContentSection>

      <ContentSection heading="Fixed fare, booked ahead">
        <p>Ask for a fixed fare quote when you book — for a longer trip like this, advance booking is recommended rather than booking on the day.</p>
        <p>
          Travelling for business and need a return airport run later? See our{" "}
          <Link className="text-link" href="/corporate-airport-transfers-sydney">corporate transfers</Link> page.
        </p>
      </ContentSection>

      <ContentSection heading="Booking a return trip" tone="mist">
        <p>Heading back to the airport later? Select Return Trip when booking, or call ahead to lock in the return pickup.</p>
      </ContentSection>

      <FaqSection faqs={faqs} />

      <ServiceCta
        heading="Ready to Book Your Blue Mountains Transfer?"
        text="Fixed fare quotes on request — book one way or return."
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}
