import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { contact } from "../../lib/seo";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/#home" aria-label="Taxi2Airport home">
        <Image className="brand-logo" src="/brand/logo.webp" alt="Taxi2Airport" width={1414} height={514} priority />
      </Link>
      <nav className="nav" aria-label="Primary navigation">
        <Link href="/#about">About</Link>
        <Link href="/#fleet">Fleet</Link>
        <Link href="/#contact">Contact</Link>
      </nav>
      <div className="header-actions">
        <a className="header-call" href={contact.phoneHref}><Phone size={17} /> {contact.phone}</a>
        <Link className="button primary nav-button" href="/#booking">Book Now</Link>
      </div>
    </header>
  );
}
