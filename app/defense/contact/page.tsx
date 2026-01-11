import { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import { SEATTLE_SITE_CONFIG } from "@/lib/seattle-constants";

export const metadata: Metadata = {
  title: "Contact | Rivercrest Law Seattle | Criminal Defense",
  description:
    "Contact Sebastian Miller for traffic ticket and DUI defense in Seattle and King County. Available 24/7 for emergencies.",
  openGraph: {
    title: "Contact Rivercrest Law Seattle",
    description:
      "Reach out for a free consultation. Available 24/7 for DUI emergencies.",
  },
};

export default function SeattleContactPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 px-4 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1
            className="mb-6 text-3xl font-bold lg:text-5xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Get in Touch
          </h1>
          <p className="mx-auto max-w-xl text-lg text-slate-300 lg:text-xl">
            Questions about your case? Ready to get started? I respond quickly.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Contact Methods */}
            <div className="space-y-6">
              <h2
                className="text-2xl font-bold text-slate-900"
                style={{ fontFamily: "var(--font-dm-serif)" }}
              >
                Contact Information
              </h2>

              {/* Phone */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                  <Phone className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">Call Me</h3>
                <a
                  href={`tel:${SEATTLE_SITE_CONFIG.phoneRaw}`}
                  className="text-xl font-bold text-emerald-600 hover:underline"
                >
                  {SEATTLE_SITE_CONFIG.phone}
                </a>
                <p className="mt-2 text-sm text-slate-500">
                  Best for urgent matters and DUI emergencies
                </p>
              </div>

              {/* Email */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">Email</h3>
                <a
                  href={`mailto:${SEATTLE_SITE_CONFIG.email}`}
                  className="text-lg font-medium text-blue-600 hover:underline"
                >
                  {SEATTLE_SITE_CONFIG.email}
                </a>
                <p className="mt-2 text-sm text-slate-500">
                  I respond to emails within 24 hours
                </p>
              </div>

              {/* Location */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                  <MapPin className="h-6 w-6 text-slate-600" />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">Office</h3>
                <address className="text-slate-600 not-italic">
                  {SEATTLE_SITE_CONFIG.address.street}
                  <br />
                  {SEATTLE_SITE_CONFIG.address.city}, {SEATTLE_SITE_CONFIG.address.state}{" "}
                  {SEATTLE_SITE_CONFIG.address.zip}
                </address>
                <p className="mt-2 text-sm text-slate-500">
                  By appointment only
                </p>
              </div>
            </div>

            {/* Hours & Quick Actions */}
            <div className="space-y-6">
              {/* Hours */}
              <div className="rounded-xl bg-slate-100 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Clock className="h-6 w-6 text-slate-600" />
                  <h3 className="text-lg font-semibold text-slate-900">Hours</h3>
                </div>
                <div className="space-y-3 text-slate-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-medium">{SEATTLE_SITE_CONFIG.hours.weekday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday - Sunday</span>
                    <span className="font-medium">{SEATTLE_SITE_CONFIG.hours.weekend}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-3">
                    <span className="text-red-600">DUI Emergencies</span>
                    <span className="font-medium text-red-600">
                      {SEATTLE_SITE_CONFIG.hours.dui}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Quick Actions
                </h3>
                <Link
                  href="/defense/fight-my-ticket"
                  className="btn-primary flex w-full items-center justify-center gap-2 text-lg"
                >
                  <MessageSquare className="h-5 w-5" />
                  Submit Your Ticket Online
                </Link>
                <a
                  href={`tel:${SEATTLE_SITE_CONFIG.phoneRaw}`}
                  className="btn-call flex w-full items-center justify-center gap-2 text-lg"
                >
                  <Phone className="h-5 w-5" />
                  Call Now
                </a>
              </div>

              {/* Note */}
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
                <h3 className="mb-2 font-semibold text-amber-800">
                  DUI Arrest?
                </h3>
                <p className="text-sm text-amber-700">
                  Time is critical. You have only 7 days to request a DOL
                  hearing. Call me immediately, day or night.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="px-4 pb-12 lg:pb-16">
        <div className="mx-auto max-w-4xl">
          <div className="flex h-64 items-center justify-center rounded-xl bg-slate-200 lg:h-80">
            <div className="text-center text-slate-500">
              <MapPin className="mx-auto mb-2 h-8 w-8" />
              <p className="text-sm">Map coming soon</p>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-slate-500">
            Serving Seattle, King County, Snohomish County, and Pierce County
          </p>
        </div>
      </section>

      {/* LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LegalService",
            name: SEATTLE_SITE_CONFIG.name,
            image: "https://rivercrestlaw.com/images/sebastian-miller.jpg",
            telephone: SEATTLE_SITE_CONFIG.phone,
            email: SEATTLE_SITE_CONFIG.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: SEATTLE_SITE_CONFIG.address.street,
              addressLocality: SEATTLE_SITE_CONFIG.address.city,
              addressRegion: SEATTLE_SITE_CONFIG.address.state,
              postalCode: SEATTLE_SITE_CONFIG.address.zip,
              addressCountry: "US",
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "08:00",
                closes: "18:00",
              },
            ],
            priceRange: "$149 - $500",
            areaServed: [
              { "@type": "City", name: "Seattle" },
              { "@type": "City", name: "Bellevue" },
              { "@type": "City", name: "Kirkland" },
              { "@type": "AdministrativeArea", name: "King County" },
            ],
          }),
        }}
      />
    </main>
  );
}
