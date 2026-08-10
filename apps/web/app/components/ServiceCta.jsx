import { ChevronRight, Phone } from "lucide-react";
import Link from "next/link";
import { contact } from "../../lib/seo";

export default function ServiceCta({
  heading = "Ready to Book Your Ride?",
  text = "Book in advance or ride on demand — we're available 24/7."
}) {
  return (
    <section className="section cta-banner" aria-label="Ready to book">
      <div>
        <h2>{heading}</h2>
        <p>{text}</p>
      </div>
      <div className="cta-banner-actions">
        <Link className="button primary" href="/#booking">Book Now <ChevronRight size={18} /></Link>
        <a className="cta-banner-phone" href={contact.phoneHref}><Phone size={16} className="mr-1 inline -mt-0.5" />{contact.phone}</a>
      </div>
    </section>
  );
}
