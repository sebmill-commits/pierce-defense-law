import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

const footerNavigation = {
  services: [
    { name: "DUI Defense", href: "/dui-defense" },
    { name: "Speeding Tickets", href: "/traffic-tickets" },
    { name: "Red Light Camera", href: "/traffic-tickets" },
    { name: "All Traffic Violations", href: "/traffic-tickets" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Results", href: "/results" },
    { name: "FAQ", href: "/faq" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
  cities: [
    "Tacoma",
    "Lakewood",
    "Puyallup",
    "Federal Way",
    "University Place",
    "Bonney Lake",
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[--primary-dark] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Contact */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                PIERCE
              </span>
              <span className="block text-xs font-semibold tracking-[0.2em] text-gray-400">
                DEFENSE LAW
              </span>
            </div>
            <p className="mb-6 text-sm text-gray-400">
              {SITE_CONFIG.attorneyName}, {SITE_CONFIG.attorneyTitle}. DUI and
              traffic defense in Pierce County. Straight talk. Fast action.
            </p>
            <div className="space-y-3">
              <a
                href={`tel:${SITE_CONFIG.phoneRaw}`}
                className="flex items-center gap-3 text-sm text-gray-300 hover:text-white"
              >
                <Phone className="h-4 w-4 text-[--success]" />
                {SITE_CONFIG.phone}
              </a>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center gap-3 text-sm text-gray-300 hover:text-white"
              >
                <Mail className="h-4 w-4 text-[--success]" />
                {SITE_CONFIG.email}
              </a>
              <div className="flex items-start gap-3 text-sm text-gray-300">
                <MapPin className="mt-0.5 h-4 w-4 text-[--success]" />
                <span>
                  {SITE_CONFIG.address.street}
                  <br />
                  {SITE_CONFIG.address.city}, {SITE_CONFIG.address.state}{" "}
                  {SITE_CONFIG.address.zip}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Clock className="h-4 w-4 text-[--success]" />
                <span>
                  Mon-Fri: {SITE_CONFIG.hours.weekday}
                  <br />
                  <span className="text-[--warning]">
                    DUI: {SITE_CONFIG.hours.dui}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Practice Areas
            </h3>
            <ul className="space-y-3">
              {footerNavigation.services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas Served */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Areas Served
            </h3>
            <ul className="grid grid-cols-2 gap-2">
              {footerNavigation.cities.map((city) => (
                <li key={city} className="text-sm text-gray-400">
                  {city}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-gray-500">
              Serving all of Pierce County and surrounding areas
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <div className="text-xs text-gray-500">
              <p>
                &copy; {new Date().getFullYear()} Pierce Defense Law. All rights
                reserved.
              </p>
              <p className="mt-1">
                {SITE_CONFIG.attorneyName}, WSBA #{SITE_CONFIG.wsbaNumber}
              </p>
            </div>
            <div className="flex gap-4">
              {footerNavigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-xs text-gray-500 hover:text-gray-300"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="mt-6 rounded-lg bg-gray-900/50 p-4">
            <p className="text-xs text-gray-500">
              <strong className="text-gray-400">Attorney Advertising:</strong>{" "}
              This website is for informational purposes only and does not
              constitute legal advice. Contacting Pierce Defense Law does not
              create an attorney-client relationship. Past results do not
              guarantee future outcomes. Every case is different and must be
              evaluated on its own merits.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
