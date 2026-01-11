"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import { SEATTLE_SITE_CONFIG } from "@/lib/seattle-constants";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Fight My Ticket", href: "/fight-my-ticket" },
  { name: "DUI Defense", href: "/dui-defense" },
  { name: "Traffic Tickets", href: "/traffic-tickets" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function SeattleHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex flex-col">
            <span
              className="text-xl font-bold tracking-tight text-slate-800 sm:text-2xl"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              RIVERCREST
            </span>
            <span className="text-[10px] font-semibold tracking-[0.2em] text-slate-500 sm:text-xs">
              SEATTLE DEFENSE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-[--text-secondary] transition-colors hover:text-[--primary]"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:items-center lg:gap-4">
          <a
            href={`tel:${SEATTLE_SITE_CONFIG.phoneRaw}`}
            className="flex items-center gap-2 text-sm font-semibold text-[--primary]"
          >
            <Phone className="h-4 w-4" />
            {SEATTLE_SITE_CONFIG.phone}
          </a>
          <Link href="/fight-my-ticket" className="btn-primary text-sm">
            Get Free Quote
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-4 lg:hidden">
          <a
            href={`tel:${SEATTLE_SITE_CONFIG.phoneRaw}`}
            className="btn-call text-sm"
            aria-label="Call us"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Call Now</span>
          </a>
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[--primary]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 border-t border-gray-100 bg-white px-4 pb-4 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-3 py-3 text-base font-medium text-[--text-secondary] hover:bg-gray-50 hover:text-[--primary]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/fight-my-ticket"
              className="btn-primary mt-4 w-full text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Upload Citation - Get Free Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
