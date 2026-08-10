import Image from "next/image";
import Link from "next/link";
import { contact } from "../../lib/seo";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <Link className="brand footer-brand" href="/#home" aria-label="Taxi2Airport home">
        <Image className="brand-logo" src="/brand/logo-white.png" alt="Taxi2Airport" width={1414} height={514} />
      </Link>
      <p>Maxi cab, airport, cruise, group and accessible taxi bookings across Sydney and surrounding areas.</p>
      <a href={contact.phoneHref}>{contact.phone}</a>
    </footer>
  );
}
