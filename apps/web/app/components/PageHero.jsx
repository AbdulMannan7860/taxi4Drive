import { ChevronRight, Phone } from "lucide-react";
import Link from "next/link";
import { contact } from "../../lib/seo";

export default function PageHero({ eyebrow, title, intro }) {
  return (
    <section className="section bg-night text-white">
      <div className="section-intro wide-intro">
        <p className="eyebrow text-gold">{eyebrow}</p>
        <h1 className="text-white">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-steel">{intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="button primary" href="/#booking">Book online <ChevronRight size={18} /></Link>
          <a className="button call" href={contact.phoneHref}><Phone size={18} /> {contact.phone}</a>
        </div>
      </div>
    </section>
  );
}
