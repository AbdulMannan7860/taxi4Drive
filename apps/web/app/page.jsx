"use client";

import {
  Accessibility,
  Baby,
  BriefcaseBusiness,
  CalendarClock,
  CarFront,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plane,
  Ship,
  ShieldCheck,
  Sparkles,
  Star,
  Users
} from "lucide-react";
import { useMemo, useState } from "react";
import LocationField from "./components/LocationField";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const contact = {
  phone: "1300 22 77 00",
  phoneHref: "tel:1300227700",
  sms: "+61 488 836 062",
  smsHref: "sms:+61488836062",
  email: "book@taxi2airport.com.au",
  emailHref: "mailto:book@taxi2airport.com.au",
  whatsappHref: "https://wa.me/61488836062",
  address: "Sydney, NSW, Australia"
};

const serviceTypes = [
  "General Transfers",
  "Airport Transport",
  "Cruise Transport",
  "Racecourse Transport",
  "Event Transport",
  "Birthday Transport",
  "Corporate Transport",
  "Wedding Transport",
  "Parcel Delivery Service"
];

const vehicles = [
  { name: "Sedan", detail: "Everyday point-to-point travel", passengers: "1-4", luggage: "1-4", icon: CarFront },
  { name: "Premium Sedan", detail: "Quiet executive airport transfers", passengers: "1-4", luggage: "1-3", icon: Sparkles },
  { name: "SUV", detail: "Extra room for bags and families", passengers: "1-4", luggage: "1-6", icon: CarFront },
  { name: "Maxi 7 Seater", detail: "Groups, events and airport runs", passengers: "1-7", luggage: "1-8", icon: Users },
  { name: "Maxi 7 Premium", detail: "Premium group transfers", passengers: "1-7", luggage: "1-8", icon: Users },
  { name: "Maxi 11 Seater", detail: "Large groups with serious luggage", passengers: "1-11", luggage: "1-18", icon: Users },
  { name: "Wheelchair Taxi", detail: "Accessible taxi with secure boarding", passengers: "1-8", luggage: "1-16", wheelchair: "Up to 2", icon: Accessibility }
];

const highlights = [
  ["24/7 availability", "Book an airport, event or city ride any time.", Clock3],
  ["Fixed fare requests", "Clear quotes for suburbs, terminals and group trips across Sydney.", CheckCircle2],
  ["Accessible travel", "Wheelchair taxis, baby seats and patient drivers.", Accessibility]
];

const whyChooseUs = [
  ["Reliable", "Every time", ShieldCheck],
  ["Airport Specialists", "Sydney Airport experts", Plane],
  ["Professional Drivers", "Fully licensed & experienced", Users],
  ["On Time", "Always", Clock3]
];

const servingRoutes = [
  "Sydney Airport (SYD) Transfers",
  "Domestic & International Terminals",
  "CBD, Hotels & Suburbs",
  "Cruise Terminals",
  "Blue Mountains & Regional NSW"
];

// Placeholder testimonials -- structural placeholders mirroring the client's own
// Figma mockup sample reviews, not real customer quotes. Swap for real Google
// reviews before launch.
const testimonials = [
  { initials: "S.M.", quote: "Driver was on time, very friendly and helped with our luggage. Would book again.", role: "Airport Transfer Customer" },
  { initials: "J.T.", quote: "Booked a return transfer and everything was seamless from pickup to drop-off.", role: "Return Transfer Customer" },
  { initials: "P.K.", quote: "Clean car, safe driver and great communication. Best airport transfer in Sydney.", role: "Airport Transfer Customer" }
];

const imageSet = [
  {
    src: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&h=1600&q=90",
    alt: "Professional taxi service vehicle ready for a city pickup",
    label: "Sydney wide"
  },
  {
    src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=82",
    alt: "Airport terminal with aircraft outside",
    label: "Airport transfers"
  },
  {
    src: "https://images.pexels.com/photos/2399254/pexels-photo-2399254.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "Taxi travelling through a city street",
    label: "Fast city rides"
  },
  {
    src: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=900&q=82",
    alt: "Traveller with luggage waiting for transport",
    label: "Luggage ready"
  }
];

const services = [
  ["Airport transfers", "Domestic and international airport pickups and drop-offs across Sydney with simple timing and flight details.", Plane],
  ["Group transfers", "Spacious maxi taxis for families, friends, events, weddings, birthdays and race days.", Users],
  ["Cruise transfers", "Door-to-terminal rides for Sydney's cruise terminals, hotels, homes and event connections.", Ship],
  ["Baby seat taxi", "Infant, toddler and booster seat options can be requested while booking.", Baby],
  ["Corporate transfers", "Clean vehicles and professional drivers for business trips and client movement.", BriefcaseBusiness],
  ["Wheelchair taxi", "Accessible vehicles for mobility needs, appointments, airport travel and daily transport.", Accessibility]
];

const initialBooking = {
  tripType: "One Way",
  serviceType: serviceTypes[1],
  pickup: "",
  dropoff: "",
  date: "",
  time: "",
  passengers: 2,
  luggage: 1,
  vehicle: "Maxi 7 Seater",
  customerName: "",
  email: "",
  phone: "",
  website: ""
};

function estimateFare(booking) {
  const vehicleBoost = booking.vehicle.includes("11") ? 62 : booking.vehicle.includes("Maxi") ? 42 : booking.vehicle.includes("Premium") ? 34 : 22;
  const passengerBoost = Math.max(0, Number(booking.passengers || 0) - 1) * 4;
  const luggageBoost = Number(booking.luggage || 0) * 3;
  const returnBoost = booking.tripType === "Return Trip" ? 1.8 : 1;
  return Math.round((58 + vehicleBoost + passengerBoost + luggageBoost) * returnBoost);
}

export default function HomePage() {
  const [booking, setBooking] = useState(initialBooking);
  const [bookingState, setBookingState] = useState({ status: "idle", message: "" });
  const fare = useMemo(() => estimateFare(booking), [booking]);

  function updateBooking(field, value) {
    setBooking((current) => ({ ...current, [field]: value }));
  }

  async function submitBooking(event) {
    event.preventDefault();
    if (booking.website) return;
    setBookingState({ status: "loading", message: "Sending your request..." });

    try {
      const response = await fetch(`${apiUrl}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...booking,
          estimatedFare: fare,
          meetGreet: false,
          flightTracking: booking.serviceType === "Airport Transport"
        })
      });
      const result = await response.json();
      if (!response.ok || result.success === false) {
        throw new Error(result.error?.message || result.message || "Booking could not be created.");
      }

      const savedBooking = result.data?.booking || result.booking;
      setBookingState({ status: "success", message: `Request received. Reference ${savedBooking.reference}.` });
      setBooking({ ...initialBooking, date: booking.date, time: booking.time });
    } catch (error) {
      setBookingState({ status: "error", message: error.message });
    }
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Taxi2Airport home">
          <img className="brand-logo" src="/brand/logo.webp" alt="Taxi2Airport" />
        </a>
        <nav className="nav" aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#fleet">Fleet</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="header-actions">
          <a className="header-call" href={contact.phoneHref}><Phone size={17} /> {contact.phone}</a>
          <a className="button primary nav-button" href="#booking">Book Now</a>
        </div>
      </header>

      <main id="home">
        <section className="hero" style={{ backgroundImage: `url(${imageSet[0].src})` }}>
          <div className="hero-copy">
            <p className="eyebrow">Sydney Airport Transfer Specialists</p>
            <h1>Sydney Airport Transfers, <span className="text-gold">Made Easy.</span></h1>
            <p className="hero-text">
              Reliable, professional and on-time transfers, 24/7. Clean sedans, SUVs, maxi cabs and wheelchair-accessible taxis across Sydney and surrounding areas.
            </p>
            <div className="hero-actions" aria-label="Fast contact actions">
              <a className="button primary" href="#booking">Book online <ChevronRight size={18} /></a>
              <a className="button call" href={contact.phoneHref}><Phone size={18} /> {contact.phone}</a>
              <a className="button ghost" href={contact.whatsappHref}><MessageCircle size={18} /> WhatsApp</a>
            </div>
            <div className="trust-strip" aria-label="Service highlights">
              {highlights.map(([title, text, Icon]) => (
                <span key={title}><Icon size={21} /><strong>{title}</strong><small>{text}</small></span>
              ))}
            </div>
            <div className="hero-image-strip" aria-label="Sydney transfer snapshots">
              {imageSet.slice(0, 3).map((image) => (
                <figure key={image.label}>
                  <img src={image.src} alt={image.alt} />
                  <figcaption>{image.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>

          <aside className="quote-card" id="booking" aria-label="Booking request form">
            <div className="booking-card-head">
              <span>Book Taxi2Airport</span>
              <a href={contact.phoneHref}><Phone size={16} /> Call now</a>
            </div>
            <form className="booking-form" onSubmit={submitBooking}>
              <div className="tabs" role="tablist" aria-label="Trip type">
                {["One Way", "Return Trip"].map((tripType) => (
                  <button
                    className={`tab ${booking.tripType === tripType ? "active" : ""}`}
                    type="button"
                    key={tripType}
                    onClick={() => updateBooking("tripType", tripType)}
                  >
                    {tripType}
                  </button>
                ))}
              </div>
              <label>Service
                <select value={booking.serviceType} onChange={(event) => updateBooking("serviceType", event.target.value)} required>
                  {serviceTypes.map((service) => <option key={service}>{service}</option>)}
                </select>
              </label>
              <div className="form-grid">
                <LocationField label="Pickup address" value={booking.pickup} placeholder="Search pickup" showCurrentLocation required onChange={(location) => updateBooking("pickup", location.address)} />
                <LocationField label="Drop-off address" value={booking.dropoff} placeholder="Search drop-off" required onChange={(location) => updateBooking("dropoff", location.address)} />
              </div>
              <div className="form-grid tight">
                <label>Date
                  <input value={booking.date} onChange={(event) => updateBooking("date", event.target.value)} type="date" required />
                </label>
                <label>Time
                  <input value={booking.time} onChange={(event) => updateBooking("time", event.target.value)} type="time" required />
                </label>
              </div>
              <div className="form-grid tight">
                <label>Passengers
                  <input value={booking.passengers} onChange={(event) => updateBooking("passengers", event.target.value)} type="number" min="1" max="55" required />
                </label>
                <label>Bags
                  <input value={booking.luggage} onChange={(event) => updateBooking("luggage", event.target.value)} type="number" min="0" max="22" required />
                </label>
              </div>
              <label>Vehicle
                <select value={booking.vehicle} onChange={(event) => updateBooking("vehicle", event.target.value)} required>
                  {vehicles.map((vehicle) => <option key={vehicle.name}>{vehicle.name}</option>)}
                </select>
              </label>
              <div className="form-grid">
                <label>Name
                  <input value={booking.customerName} onChange={(event) => updateBooking("customerName", event.target.value)} type="text" placeholder="Full name" required />
                </label>
                <label>Mobile
                  <input value={booking.phone} onChange={(event) => updateBooking("phone", event.target.value)} type="tel" placeholder="+61..." required />
                </label>
              </div>
              <label>Email
                <input value={booking.email} onChange={(event) => updateBooking("email", event.target.value)} type="email" placeholder="you@example.com" required />
              </label>
              <label className="bot-field" aria-hidden="true">Company website
                <input value={booking.website} onChange={(event) => updateBooking("website", event.target.value)} type="text" tabIndex="-1" autoComplete="off" />
              </label>
              <button className="button primary wide" type="submit" disabled={bookingState.status === "loading"}>
                {bookingState.status === "loading" ? "Sending..." : "Submit request"}
              </button>
              {bookingState.message && <p className={`form-message ${bookingState.status}`}>{bookingState.message}</p>}
            </form>
          </aside>
        </section>

        <section className="section badges" aria-label="Why choose Taxi2Airport">
          {whyChooseUs.map(([title, text, Icon]) => (
            <div className="badge" key={title}>
              <Icon size={26} />
              <strong>{title}</strong>
              <small>{text}</small>
            </div>
          ))}
        </section>

        <section className="quick-contact" aria-label="Immediate contact options">
          <a href={contact.phoneHref}><Phone size={19} /><span>Call</span><strong>{contact.phone}</strong></a>
          <a href={contact.smsHref}><MessageCircle size={19} /><span>SMS</span><strong>{contact.sms}</strong></a>
          <a href={contact.emailHref}><Mail size={19} /><span>Email</span><strong>{contact.email}</strong></a>
        </section>

        <section className="section about" id="about">
          <div className="section-intro">
            <p className="eyebrow">About Taxi2Airport</p>
            <h2>Reliable Sydney airport transfers, without the runaround.</h2>
          </div>
          <div className="about-copy">
            <p>
              Taxi2Airport helps people move across Sydney and surrounding areas with comfortable taxis, roomy group vehicles and accessible transport. The service is designed for travellers, families, business passengers and anyone who wants a clean vehicle, a clear booking path and a driver who arrives prepared.
            </p>
            <p>
              The team covers Sydney Airport, the CBD, suburbs and regional NSW trips with fixed fare requests, cruise terminal connections, baby seat taxis, wheelchair access and special-event transfers. The aim is simple: make every ride safe, easy to arrange and calm from pickup to drop-off.
            </p>
          </div>
        </section>

        <section className="section services" id="services">
          <div className="section-intro wide-intro">
            <p className="eyebrow">Services</p>
            <h2>One booking form for the rides people ask for most.</h2>
          </div>
          <div className="feature-grid">
            {services.map(([title, text, Icon]) => (
              <article key={title}><Icon size={25} /><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </section>

        <section className="section fleet" id="fleet">
          <div className="fleet-lead">
            <div className="section-intro wide-intro">
              <p className="eyebrow">Fleet</p>
              <h2>Choose by passengers, bags and accessibility needs.</h2>
            </div>
            <figure>
              <img src={imageSet[3].src} alt={imageSet[3].alt} />
              <figcaption>Room for people, plans and bags.</figcaption>
            </figure>
          </div>
          <div className="fleet-grid">
            {vehicles.map(({ name, detail, passengers, luggage, wheelchair, icon: Icon }) => (
              <article className="fleet-card" key={name}>
                <div className="fleet-card-photo">
                  <Icon size={40} />
                  <span>Photo coming soon</span>
                </div>
                <h3>{name}</h3>
                <p>{detail}</p>
                <dl>
                  <div><dt>Passengers</dt><dd>{passengers}</dd></div>
                  <div><dt>Luggage</dt><dd>{luggage}</dd></div>
                  {wheelchair && <div><dt>Wheelchairs</dt><dd>{wheelchair}</dd></div>}
                </dl>
                <a className="text-link" href="#booking">Book this vehicle</a>
              </article>
            ))}
          </div>
        </section>

        <section className="section serving" aria-label="Serving Sydney and beyond">
          <div>
            <p className="eyebrow">Popular Routes</p>
            <h2>Serving Sydney and Beyond</h2>
            <p className="mt-4 max-w-md text-muted">From Sydney Airport to your home, hotel or business, we&apos;ve got you covered.</p>
            <ul className="serving-list">
              {servingRoutes.map((route) => (
                <li key={route}><CheckCircle2 size={18} /> {route}</li>
              ))}
            </ul>
          </div>
          <figure className="serving-photo">
            <img src={imageSet[0].src} alt="Sydney taxi transfer" />
            <div className="serving-cta">
              <h3>Booking is quick and easy!</h3>
              <p>Get an instant quote now and travel stress-free.</p>
              <a className="button primary" href="#booking">Book Your Ride <ChevronRight size={18} /></a>
            </div>
          </figure>
        </section>

        <section className="section testimonials" aria-label="Customer testimonials">
          <div className="section-intro wide-intro">
            <p className="eyebrow">What Our Customers Say</p>
            <h2>Real Reviews. Real Experiences.</h2>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <article className="testimonial-card" key={item.initials}>
                <div className="testimonial-stars" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={16} fill="currentColor" />)}
                </div>
                <p>&ldquo;{item.quote}&rdquo;</p>
                <div className="testimonial-author">
                  <span className="testimonial-avatar">{item.initials}</span>
                  <span><strong>{item.role}</strong><small>Verified booking</small></span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section cta-banner" aria-label="Ready to book">
          <div>
            <h2>Ready to Book Your Ride?</h2>
            <p>Book in advance or ride on demand — we&apos;re available 24/7.</p>
          </div>
          <div className="cta-banner-actions">
            <a className="button primary" href="#booking">Book Now <ChevronRight size={18} /></a>
            <a className="cta-banner-phone" href={contact.phoneHref}><Phone size={16} className="mr-1 inline -mt-0.5" />{contact.phone}</a>
          </div>
        </section>

        <section className="section contact" id="contact">
          <div className="contact-panel">
            <div>
              <p className="eyebrow">Contact</p>
              <h2>Need help right now? Call first.</h2>
              <p>For urgent pickups, wheelchair access, baby seats or a larger group, the fastest path is a direct call. Online bookings are open for planned trips.</p>
              <div className="contact-actions">
                <a className="button primary" href={contact.phoneHref}><Phone size={18} /> {contact.phone}</a>
                <a className="button secondary" href={contact.whatsappHref}><MessageCircle size={18} /> WhatsApp</a>
              </div>
            </div>
            <address className="contact-card">
              <a href={contact.emailHref}><Mail size={18} /> {contact.email}</a>
              <a href={contact.phoneHref}><Phone size={18} /> {contact.phone}</a>
              <a href={contact.smsHref}><MessageCircle size={18} /> SMS {contact.sms}</a>
              <span><MapPin size={18} /> {contact.address}</span>
              <span><CalendarClock size={18} /> Available 24/7</span>
            </address>
          </div>
        </section>
      </main>

      <div className="mobile-sticky-actions" aria-label="Sticky booking actions">
        <a href={contact.phoneHref}><Phone size={18} /> Call</a>
        <a href="#booking">Book</a>
        <a href={contact.whatsappHref}><MessageCircle size={18} /> WhatsApp</a>
      </div>

      <footer className="footer">
        <a className="brand footer-brand" href="#home" aria-label="Taxi2Airport home">
          <img className="brand-logo" src="/brand/logo-white.png" alt="Taxi2Airport" />
        </a>
        <p>Maxi cab, airport, cruise, group and accessible taxi bookings across Sydney and surrounding areas.</p>
        <a href={contact.phoneHref}>{contact.phone}</a>
      </footer>
    </>
  );
}
