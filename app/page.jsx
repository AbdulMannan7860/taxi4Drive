"use client";

import {
  Baby,
  BriefcaseBusiness,
  CarFront,
  ChevronRight,
  Clock3,
  Download,
  Lock,
  Mail,
  MapPin,
  Plane,
  Search,
  ShieldCheck,
  Star,
  Users,
  Accessibility
} from "lucide-react";
import { useMemo, useState } from "react";
import LocationField from "./components/LocationField";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const serviceTypes = [
  "Sydney Airport Transfers",
  "Maxi Cab Sydney",
  "Wheelchair Accessible Taxi",
  "Premium Corporate Transfers",
  "Baby Seat Taxi",
  "Cruise & Hotel Transfers"
];

const vehicles = [
  {
    name: "OnDemand Luxury Vehicles",
    type: "OnDemand",
    model: "Premium sedan / SUV",
    seats: "1-4 passengers",
    luggage: "3 large bags",
    description:
      "Premium Taxi2Airport.com.au business transfers with reliable drivers, clean vehicles, simple booking management and professional airport pickups.",
    icon: CarFront
  },
  {
    name: "Classic",
    type: "Instant booking",
    model: "Comfort taxi",
    seats: "1-4 passengers",
    luggage: "2 large bags",
    description:
      "Private airport pickup and drop-off for Sydney Domestic Terminal, International Terminal, CBD hotels, suburbs and regional NSW.",
    icon: Plane
  },
  {
    name: "Maxi",
    type: "Instant booking",
    model: "7, 10 and 11 seater",
    seats: "5-11 passengers",
    luggage: "Group luggage",
    description:
      "Book 7, 10 and 11 seater maxi cab style transfers for groups, luggage, events, weddings, cruise terminals and airport runs.",
    icon: Users
  }
];

const features = [
  {
    title: "Airport pickup & drop-off",
    text: "Scheduled Sydney Airport domestic and international terminal transfers with flight tracking and clear pickup instructions.",
    icon: Plane
  },
  {
    title: "Fixed fare taxi quotes",
    text: "Transparent estimates for airport taxis, maxi cabs, tolls, parking allowance, baby seats, luggage and meet-and-greet options.",
    icon: ShieldCheck
  },
  {
    title: "Maxi cab group travel",
    text: "Spacious maxi taxi and van options for families, events, business groups, luggage-heavy airport rides and cruise transfers.",
    icon: Users
  },
  {
    title: "Accessible & family options",
    text: "Wheelchair accessible taxi requests, baby seat bookings, professional drivers and clean vehicles for private transfers.",
    icon: Accessibility
  }
];

const seoServices = [
  ["Sydney Airport Transfers", "Private airport pickup and drop-off for Sydney Domestic Terminal, International Terminal, CBD hotels, suburbs and regional NSW.", Plane],
  ["Maxi Cab Sydney", "Book 7, 10 and 11 seater maxi cab style transfers for groups, luggage, events, weddings, cruise terminals and airport runs.", Users],
  ["Wheelchair Accessible Taxi", "Accessible taxi requests for wheelchair passengers, medical appointments, airport travel and point-to-point Sydney transfers.", Accessibility],
  ["Premium Corporate Transfers", "Premium Taxi2Airport.com.au business transfers with reliable drivers, clean vehicles, simple booking management and professional airport pickups.", BriefcaseBusiness],
  ["Baby Seat Taxi", "Family airport transfers with child seat options, extra luggage planning and pre-booked pickups for stress-free travel.", Baby],
  ["Cruise & Hotel Transfers", "Transfers between Sydney Airport, Circular Quay, White Bay Cruise Terminal, hotels, homes and major Sydney suburbs.", MapPin]
];

const suburbs = [
  "Sydney CBD",
  "Parramatta",
  "Bankstown",
  "Liverpool",
  "Blacktown",
  "Penrith",
  "Bondi",
  "Chatswood",
  "Manly",
  "Olympic Park",
  "Wollongong",
  "Newcastle"
];

const initialBooking = {
  tripType: "one-way",
  serviceType: serviceTypes[0],
  pickup: "",
  dropoff: "",
  date: "",
  time: "",
  passengers: 2,
  luggage: 1,
  vehicle: vehicles[1].name,
  meetGreet: false,
  childSeat: false,
  flightTracking: true,
  customerName: "",
  email: "",
  phone: "",
  flightNumber: "",
  website: ""
};

function estimateFare(booking) {
  const vehicleBoost = booking.vehicle.includes("Maxi") ? 38 : booking.vehicle.includes("Luxury") ? 54 : 24;
  const passengerBoost = Math.max(0, Number(booking.passengers || 0) - 1) * 5;
  const luggageBoost = Number(booking.luggage || 0) * 3;
  const addonBoost = (booking.meetGreet ? 18 : 0) + (booking.childSeat ? 12 : 0);
  const returnBoost = booking.tripType === "return" ? 1.8 : 1;
  return Math.round((62 + vehicleBoost + passengerBoost + luggageBoost + addonBoost) * returnBoost);
}

export default function HomePage() {
  const [booking, setBooking] = useState(initialBooking);
  const [bookingState, setBookingState] = useState({ status: "idle", message: "" });
  const [crmPassword, setCrmPassword] = useState("");
  const [crmState, setCrmState] = useState({ token: "", bookings: [], status: "locked", message: "" });
  const [crmSearch, setCrmSearch] = useState("");

  const fare = useMemo(() => estimateFare(booking), [booking]);
  const filteredBookings = crmState.bookings.filter((item) =>
    `${item.reference} ${item.customerName} ${item.pickup} ${item.dropoff} ${item.vehicle} ${item.status}`
      .toLowerCase()
      .includes(crmSearch.toLowerCase())
  );

  const stats = useMemo(() => {
    const revenue = crmState.bookings.reduce((total, item) => total + Number(item.estimatedFare || 0), 0);
    return [
      ["Bookings", crmState.bookings.length],
      ["Pending", crmState.bookings.filter((item) => item.status === "pending").length],
      ["Confirmed", crmState.bookings.filter((item) => item.status === "confirmed").length],
      ["Estimated fares", `$${revenue}`]
    ];
  }, [crmState.bookings]);

  function updateBooking(field, value) {
    setBooking((current) => ({ ...current, [field]: value }));
  }

  async function submitBooking(event) {
    event.preventDefault();
    if (booking.website) return;
    setBookingState({ status: "loading", message: "Submitting your booking..." });

    try {
      const response = await fetch(`${apiUrl}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...booking, estimatedFare: fare })
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking could not be created.");
      }

      setBookingState({
        status: "success",
        message: `Booking received. Reference ${result.booking.reference}.`
      });
      setBooking({ ...initialBooking, date: booking.date, time: booking.time });
    } catch (error) {
      setBookingState({ status: "error", message: error.message });
    }
  }

  async function unlockCrm(event) {
    event.preventDefault();
    setCrmState((current) => ({ ...current, status: "loading", message: "" }));

    try {
      const authResponse = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin", password: crmPassword })
      });
      const auth = await authResponse.json();
      if (!authResponse.ok) throw new Error(auth.message || "Invalid CRM password.");

      const bookingResponse = await fetch(`${apiUrl}/bookings`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      const bookingResult = await bookingResponse.json();
      if (!bookingResponse.ok) throw new Error(bookingResult.message || "Could not load bookings.");

      setCrmState({ token: auth.token, bookings: bookingResult.bookings, status: "unlocked", message: "" });
    } catch (error) {
      setCrmState({ token: "", bookings: [], status: "locked", message: error.message });
    }
  }

  async function updateStatus(id, status) {
    const previous = crmState.bookings;
    setCrmState((current) => ({
      ...current,
      bookings: current.bookings.map((item) => (item._id === id ? { ...item, status } : item))
    }));

    try {
      const response = await fetch(`${apiUrl}/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${crmState.token}`
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error("Status update failed.");
    } catch (error) {
      setCrmState((current) => ({ ...current, bookings: previous, message: error.message }));
    }
  }

  function exportCsv() {
    const rows = [
      ["Ref", "Customer", "Email", "Phone", "Pickup", "Dropoff", "Date", "Time", "Vehicle", "Fare", "Status"],
      ...filteredBookings.map((item) => [
        item.reference,
        item.customerName,
        item.email,
        item.phone,
        item.pickup,
        item.dropoff,
        item.date,
        item.time,
        item.vehicle,
        item.estimatedFare,
        item.status
      ])
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "taxi2airport-bookings.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Taxi2Airport home">
          <span className="brand-mark">T2A</span>
          <span>
            <strong>Taxi2Airport</strong>
            <small>.com.au</small>
          </span>
        </a>
        <nav className="nav" aria-label="Primary navigation">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#fleet">Fleet</a>
          <a href="#routes">Routes</a>
          <a href="#booking">Book</a>
          <a href="#crm">CRM</a>
        </nav>
        <div className="header-actions">
          <a className="header-call" href="tel:1300227700">1300 22 77 00</a>
          <a className="button primary nav-button" href="#booking">Book Now</a>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow">Sydney airport taxi, maxi cab & private transfers</p>
            <h1>Sydney Airport Transfers <span>Made Easy.</span></h1>
            <p className="hero-text">
              Book fixed fare airport transfers, maxi taxis, wheelchair accessible transfers, cruise transfers, baby seat bookings, and premium rides across Sydney with 24/7 availability.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#booking">Get instant quote <ChevronRight size={18} /></a>
              <a className="button ghost" href="tel:1300227700">Call 1300 22 77 00</a>
            </div>
            <div className="trust-strip" aria-label="Service highlights">
              {[
                ["24/7 Service", "Always available", Clock3],
                ["Fixed Prices", "No hidden fees", ShieldCheck],
                ["Flight Tracking", "We follow your flight", Plane]
              ].map(([title, text, Icon]) => (
                <span key={title}><Icon size={20} /><strong>{title}</strong><small>{text}</small></span>
              ))}
            </div>
          </div>

          <aside className="quote-card" id="booking" aria-label="Booking and fare estimator">
            <div className="tabs" role="tablist" aria-label="Trip type">
              {["one-way", "return"].map((tripType) => (
                <button
                  className={`tab ${booking.tripType === tripType ? "active" : ""}`}
                  type="button"
                  key={tripType}
                  onClick={() => updateBooking("tripType", tripType)}
                >
                  {tripType === "one-way" ? "One way" : "Return"}
                </button>
              ))}
            </div>

            <form className="booking-form" onSubmit={submitBooking}>
              <label>Service
                <select value={booking.serviceType} onChange={(event) => updateBooking("serviceType", event.target.value)} required>
                  {serviceTypes.map((service) => <option key={service}>{service}</option>)}
                </select>
              </label>
              <LocationField
                label="Pickup location"
                value={booking.pickup}
                placeholder="Search pickup on map"
                showCurrentLocation
                required
                onChange={(location) => updateBooking("pickup", location.address)}
              />
              <LocationField
                label="Drop-off location"
                value={booking.dropoff}
                placeholder="Search drop-off on map"
                required
                onChange={(location) => updateBooking("dropoff", location.address)}
              />
              <div className="form-grid">
                <label>Date
                  <input value={booking.date} onChange={(event) => updateBooking("date", event.target.value)} type="date" required />
                </label>
                <label>Time
                  <input value={booking.time} onChange={(event) => updateBooking("time", event.target.value)} type="time" required />
                </label>
              </div>
              <div className="form-grid">
                <label>Passengers
                  <input value={booking.passengers} onChange={(event) => updateBooking("passengers", event.target.value)} type="number" min="1" max="45" required />
                </label>
                <label>Luggage
                  <input value={booking.luggage} onChange={(event) => updateBooking("luggage", event.target.value)} type="number" min="0" max="60" required />
                </label>
              </div>
              <label>Vehicle
                <select value={booking.vehicle} onChange={(event) => updateBooking("vehicle", event.target.value)} required>
                  {vehicles.map((vehicle) => <option key={vehicle.name}>{vehicle.name}</option>)}
                </select>
              </label>
              <div className="addons" aria-label="Optional extras">
                <label><input checked={booking.meetGreet} onChange={(event) => updateBooking("meetGreet", event.target.checked)} type="checkbox" /> Meet & greet</label>
                <label><input checked={booking.childSeat} onChange={(event) => updateBooking("childSeat", event.target.checked)} type="checkbox" /> Child seat</label>
                <label><input checked={booking.flightTracking} onChange={(event) => updateBooking("flightTracking", event.target.checked)} type="checkbox" /> Flight tracking</label>
              </div>
              <label>Customer name
                <input value={booking.customerName} onChange={(event) => updateBooking("customerName", event.target.value)} type="text" placeholder="Full name" required />
              </label>
              <div className="form-grid">
                <label>Email
                  <input value={booking.email} onChange={(event) => updateBooking("email", event.target.value)} type="email" placeholder="name@example.com" required />
                </label>
                <label>Phone
                  <input value={booking.phone} onChange={(event) => updateBooking("phone", event.target.value)} type="tel" placeholder="0400 000 000" required />
                </label>
              </div>
              <label>Flight no.
                <input value={booking.flightNumber} onChange={(event) => updateBooking("flightNumber", event.target.value)} type="text" placeholder="QF001" />
              </label>
              <label className="bot-field" aria-hidden="true">Company website
                <input value={booking.website} onChange={(event) => updateBooking("website", event.target.value)} type="text" tabIndex="-1" autoComplete="off" />
              </label>
              <output className="fare-output" aria-live="polite">${fare} estimated fare</output>
              <button className="button primary wide" type="submit" disabled={bookingState.status === "loading"}>
                {bookingState.status === "loading" ? "Sending..." : "Get instant quote"}
              </button>
              {bookingState.message && <p className={`form-message ${bookingState.status}`}>{bookingState.message}</p>}
              <a className="quote-phone" href="tel:1300227700">or call 1300 22 77 00</a>
            </form>
          </aside>
        </section>

        <section className="logos-band" aria-label="Reputation">
          {[
            ["Taxi2Airport.com.au", "Fixed Fare Quotes", "No hidden fees"],
            ["Airport specialists", "Flight Monitoring", "Pickup timing adjusted"],
            ["Sydney wide", "Private Transfers", "Door to airport service"],
            ["", "Professional Drivers", "Fully licensed & experienced"],
            ["", "Clean & Safe Vehicles", "Regularly cleaned & maintained"],
            ["", "On-Time Guarantee", "Your time, our priority"]
          ].map(([small, strong, span]) => (
            <div key={strong}>{small && <small>{small}</small>}<strong>{strong}</strong><span>{span}</span></div>
          ))}
        </section>

        <section className="section services" id="services">
          <div className="section-heading centered">
            <div className="section-intro">
              <p className="eyebrow">Why choose Taxi2Airport.com.au?</p>
              <h2>Your journey.<br />Our priority.</h2>
              <p>We go the extra mile to make your Sydney airport taxi, maxi cab, cruise transfer or accessible ride smooth and stress-free.</p>
              <a className="button primary" href="#booking">Learn More</a>
            </div>
          </div>
          <div className="feature-grid">
            {features.map(({ title, text, icon: Icon }) => (
              <article key={title}><span className="icon"><Icon size={24} /></span><h3>{title}</h3><p>{text}</p></article>
            ))}
          </div>
        </section>

        <section className="section seo-services" aria-label="Sydney taxi services">
          <div className="section-intro wide-intro">
            <p className="eyebrow">High-demand services</p>
            <h2>Sydney taxi services built for search and conversion.</h2>
          </div>
          <div className="seo-grid">
            {seoServices.map(([title, text, Icon]) => (
              <article key={title}>
                <Icon size={26} />
                <h3>{title}</h3>
                <p>{text}</p>
                <a className="text-link" href="#booking">Service details</a>
              </article>
            ))}
          </div>
        </section>

        <section className="section fleet" id="fleet">
          <div className="section-heading">
            <div className="section-intro">
              <p className="eyebrow">Our fleet</p>
              <h2>Travel in comfort</h2>
              <p>Choose a well-maintained vehicle to suit your passenger and luggage needs.</p>
              <a className="button primary" href="#booking">View Fleet</a>
            </div>
          </div>
          <div className="fleet-grid">
            {vehicles.map(({ name, type, model, seats, luggage, description, icon: Icon }) => (
              <article className="fleet-card" key={name}>
                <div className="vehicle-art"><Icon size={92} strokeWidth={1.4} /></div>
                <span className="vehicle-model">{type}</span>
                <h3>{name}</h3>
                <p>{description}</p>
                <div className="fleet-meta"><span>{model}</span><span>{seats}</span><span>{luggage}</span></div>
              </article>
            ))}
          </div>
        </section>

        <section className="route-panel" id="routes">
          <div>
            <p className="eyebrow">Popular routes</p>
            <h2>Serving Sydney and beyond.</h2>
            <ul>
              <li>Sydney Airport (SYD) transfers</li>
              <li>CBD, hotels, and suburbs</li>
              <li>Domestic and international terminals</li>
              <li>Cruise terminal transfers</li>
              <li>Parramatta, Bankstown, Liverpool, Blacktown, Bondi and Penrith</li>
              <li>Blue Mountains, Wollongong, Newcastle and regional NSW</li>
            </ul>
          </div>
          <div className="route-card">
            <div className="route-cta">
              <h3>Booking is quick and easy!</h3>
              <p>Get an instant quote now and travel stress-free.</p>
              <a className="button primary" href="#booking">Book your ride</a>
            </div>
          </div>
        </section>

        <section className="local-areas" aria-label="Sydney service areas">
          <p className="eyebrow">Service areas</p>
          <h2>Airport transfers across Sydney suburbs.</h2>
          <div className="area-tags">{suburbs.map((suburb) => <span key={suburb}>{suburb}</span>)}</div>
        </section>

        <section className="section reviews" aria-label="Customer reviews">
          <div className="section-heading">
            <div className="section-intro">
              <p className="eyebrow">What our customers say</p>
              <h2>Real reviews.<br />Real experiences.</h2>
              <a className="text-link" href="#crm">View booking CRM</a>
            </div>
          </div>
          <div className="review-grid">
            {[
              ["Sarah M.", "Excellent service. Driver was on time, very friendly and helped with luggage."],
              ["James T.", "Booked a return transfer and everything was seamless. Highly recommend."],
              ["Priya K.", "Great communication, clean car and a safe driver after arriving in Sydney."]
            ].map(([name, text]) => (
              <article key={name}>
                <strong>{name}</strong>
                <small>May 2025</small>
                <span>{Array.from({ length: 5 }).map((_, index) => <Star key={index} size={17} fill="currentColor" />)}</span>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section crm" id="crm">
          {crmState.status !== "unlocked" && (
            <div className="crm-lock">
              <div>
                <p className="eyebrow">Private CRM</p>
                <h2>Password protected booking dashboard.</h2>
                <p>Enter the admin password to view bookings, customer details, fares, and booking status controls.</p>
              </div>
              <form className="crm-login" onSubmit={unlockCrm}>
                <label>CRM password
                  <input value={crmPassword} onChange={(event) => setCrmPassword(event.target.value)} type="password" autoComplete="current-password" required />
                </label>
                <button className="button primary wide" type="submit"><Lock size={18} /> Unlock CRM</button>
                {crmState.message && <p className="crm-error" role="alert">{crmState.message}</p>}
              </form>
            </div>
          )}

          {crmState.status === "unlocked" && (
            <div className="crm-panel">
              <div className="crm-head">
                <div>
                  <p className="eyebrow">Booking CRM</p>
                  <h2>Manage transfers from one dashboard.</h2>
                </div>
                <div className="crm-actions">
                  <label className="search-field"><Search size={18} /><input value={crmSearch} onChange={(event) => setCrmSearch(event.target.value)} type="search" placeholder="Search bookings" /></label>
                  <button className="button secondary" onClick={exportCsv} type="button"><Download size={18} /> Export CSV</button>
                  <button className="button secondary" onClick={() => setCrmState({ token: "", bookings: [], status: "locked", message: "" })} type="button">Lock CRM</button>
                </div>
              </div>
              <div className="stats-grid">{stats.map(([label, value]) => <article className="stat" key={label}><span>{label}</span><strong>{value}</strong></article>)}</div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Ref</th><th>Customer</th><th>Journey</th><th>Date</th><th>Vehicle</th><th>Fare</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((item) => (
                      <tr key={item._id}>
                        <td>{item.reference}</td>
                        <td>{item.customerName}<small>{item.phone} · {item.email}</small></td>
                        <td>{item.pickup}<small>{item.dropoff}</small></td>
                        <td>{item.date}<small>{item.time}</small></td>
                        <td>{item.vehicle}</td>
                        <td>${item.estimatedFare}</td>
                        <td>
                          <select className="status-select" value={item.status} onChange={(event) => updateStatus(item._id, event.target.value)}>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {!filteredBookings.length && <tr><td colSpan="7">No bookings found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        <section className="final-cta">
          <div>
            <h2>Ready to book your ride?</h2>
            <p>Book in advance or ride on demand. We are available 24/7.</p>
          </div>
          <div>
            <a className="button dark" href="#booking">Book Now</a>
            <a href="tel:1300227700">or call 1300 22 77 00</a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <a className="brand footer-brand" href="#home" aria-label="Taxi2Airport home">
            <span className="brand-mark">T2A</span>
            <span><strong>Taxi2Airport</strong><small>.com.au</small></span>
          </a>
          <p>Your journey. Our priority.</p>
        </div>
        <nav className="footer-links" aria-label="Service pages">
          {seoServices.map(([title]) => <a key={title} href="#services">{title}</a>)}
        </nav>
        <address>
          Sydney, NSW, Australia<br />
          <a href="mailto:book@taxi2airport.com.au"><Mail size={15} /> book@taxi2airport.com.au</a><br />
          <a href="tel:1300227700">1300 22 77 00</a>
        </address>
      </footer>
    </>
  );
}
