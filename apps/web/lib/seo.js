export const siteUrl = "https://www.taxi2airport.com.au";

export const contact = {
  phone: "1300 822 382",
  phoneHref: "tel:1300822382",
  whatsappHref: "https://wa.me/61466997091"
};

export const areaServed = [
  "Sydney",
  "Sydney Airport",
  "Sydney CBD",
  "Eastern Suburbs",
  "Inner West",
  "North Shore",
  "Western Sydney"
];

export function buildServiceSchema({ name, description, serviceType, url }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    url: `${siteUrl}${url}`,
    areaServed,
    provider: {
      "@type": "TaxiService",
      name: "Taxi2Airport",
      url: siteUrl,
      telephone: contact.phone
    }
  };
}

export function buildFaqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer
      }
    }))
  };
}
