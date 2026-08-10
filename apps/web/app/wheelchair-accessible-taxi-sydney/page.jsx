import Link from "next/link";
import PageHero from "../components/PageHero";
import ContentSection from "../components/ContentSection";
import FaqSection from "../components/FaqSection";
import ServiceCta from "../components/ServiceCta";
import { buildFaqSchema, buildServiceSchema } from "../../lib/seo";

const path = "/wheelchair-accessible-taxi-sydney";

export const metadata = {
  title: "Wheelchair Accessible Taxi Sydney | 24/7",
  description:
    "Wheelchair accessible taxis in Sydney with ramp-equipped vehicles for manual and electric wheelchairs. Airport and all-suburb transfers, 24/7. Book ahead.",
  alternates: {
    canonical: path
  }
};

const faqs = [
  {
    question: "Do I need to book in advance?",
    answer: "Yes — advance booking is strongly recommended so we can guarantee a wheelchair accessible vehicle for your pickup time."
  },
  {
    question: "Can you pick up from Sydney Airport?",
    answer: "Yes, both the domestic and international terminals, with pickup timing built around your flight."
  },
  {
    question: "Do you take electric wheelchairs?",
    answer: "Yes — tell us the wheelchair type and approximate size when booking so the right vehicle is sent."
  },
  {
    question: "Is there an extra charge for a wheelchair taxi?",
    answer: "Ask for a fixed fare quote for your specific trip when you book."
  }
];

const serviceSchema = buildServiceSchema({
  name: "Wheelchair Accessible Taxi Sydney",
  description: metadata.description,
  serviceType: "Wheelchair Accessible Taxi",
  url: path
});
const faqSchema = buildFaqSchema(faqs);

export default function WheelchairAccessibleTaxiPage() {
  return (
    <main>
      <PageHero
        eyebrow="Accessible Travel"
        title="Wheelchair Accessible Taxi, Sydney Wide"
        intro="Ramp-equipped vehicles for manual and electric wheelchairs, across Sydney and Sydney Airport. No lifting, no transferring — just a safe, secure ride."
      />

      <ContentSection heading="Which wheelchairs fit?">
        <p>
          Our accessible vehicles take both manual and electric wheelchairs. Vehicles are fitted with a rear ramp
          and secure wheelchair restraints, so there&apos;s no lifting or manual transfer required to travel safely.
        </p>
        <p>Let us know the wheelchair type and approximate dimensions when you book, so the right vehicle is sent.</p>
      </ContentSection>

      <ContentSection heading="Sydney Airport and every suburb" tone="mist">
        <p>
          We cover pickups and drop-offs at both the domestic and international terminals at Sydney Airport, plus
          home, hotel and appointment transfers across Sydney&apos;s suburbs. See our{" "}
          <Link className="text-link" href="/#fleet">full fleet</Link> for vehicle details.
        </p>
      </ContentSection>

      <ContentSection heading="NDIS travel">
        <p>
          The NDIS can help fund transport costs for eligible participants — check your plan for what&apos;s covered.
          We can provide a receipt for your booking to support a claim; speak with your plan manager about how to
          apply it.
        </p>
      </ContentSection>

      <ContentSection heading="Booking a wheelchair taxi" tone="mist">
        <p>
          Advance booking is recommended, especially for airport pickups, so a wheelchair accessible vehicle is
          guaranteed to be available at your pickup time. Call, use the booking form, or message us on WhatsApp.
        </p>
        <p>
          Travelling with a child too? See our{" "}
          <Link className="text-link" href="/baby-seat-taxi-sydney">baby seat taxi</Link> page.
        </p>
      </ContentSection>

      <FaqSection faqs={faqs} />

      <ServiceCta />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}
