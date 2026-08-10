import { MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { contact } from "../../lib/seo";

export default function MobileStickyActions() {
  return (
    <div className="mobile-sticky-actions" aria-label="Sticky booking actions">
      <a href={contact.phoneHref}><Phone size={18} /> Call</a>
      <Link href="/#booking">Book</Link>
      <a href={contact.whatsappHref}><MessageCircle size={18} /> WhatsApp</a>
    </div>
  );
}
