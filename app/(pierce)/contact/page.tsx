import { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact | Pierce Defense Law | Tacoma Criminal Defense",
  description:
    "Contact Sebastian Miller for traffic ticket and DUI defense in Pierce County. Available 24/7 for emergencies.",
  openGraph: {
    title: "Contact Pierce Defense Law",
    description:
      "Reach out for a free consultation. Available 24/7 for DUI emergencies.",
  },
};

export default function ContactPage() {
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
                  href={`tel:${SITE_CONFIG.phoneRaw}`}
                  className="text-xl font-bold text-emerald-600 hover:underline"
                >
                  {SITE_CONFIG.phone}
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
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-lg font-medium text-blue-600 hover:underline"
                >
                  {SITE_CONFIG.email}
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
                  {SITE_CONFIG.address.street}
                  <br />
                  {SITE_CONFIG.address.city}, {SITE_CONFIG.address.state}{" "}
                  {SITE_CONFIG.address.zip}
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
                    <span className="font-medium">{SITE_CONFIG.hours.weekday}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday - Sunday</span>
                    <span className="font-medium">{SITE_CONFIG.hours.weekend}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-3">
                    <span className="text-red-600">DUI Emergencies</span>
                    <span className="font-medium text-red-600">
                      {SITE_CONFIG.hours.dui}
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
                  href="/fight-my-ticket"
                  className="btn-primary flex w-full items-center justify-center gap-2 text-lg"
                >
                  <MessageSquare className="h-5 w-5" />
                  Submit Your Ticket Online
                </Link>
                <a
                  href={`tel:${SITE_CONFIG.phoneRaw}`}
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

      {/* Google Map */}
      <section className="px-4 pb-12 lg:pb-16">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2708.9387!2d-122.5153!3d47.2087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5491a1c4e4e4e4e4%3A0x0!2s9009%20S%2019th%20St%2C%20Tacoma%2C%20WA%2098466!5e0!3m2!1sen!2sus!4v1705000000000!5m2!1sen!2sus"
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Pierce Defense Law Office Location - 9009 S 19th St, Tacoma, WA"
              className="h-64 w-full lg:h-80"
            />
          </div>
          <p className="mt-4 text-center text-sm text-slate-500">
            Serving Pierce County, South King County, and Thurston County
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
            name: SITE_CONFIG.name,
            image: "https://piercecountydefense.com/images/sebastian-miller.jpg",
            telephone: SITE_CONFIG.phone,
            email: SITE_CONFIG.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: SITE_CONFIG.address.street,
              addressLocality: SITE_CONFIG.address.city,
              addressRegion: SITE_CONFIG.address.state,
              postalCode: SITE_CONFIG.address.zip,
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
              { "@type": "City", name: "Tacoma" },
              { "@type": "City", name: "Lakewood" },
              { "@type": "City", name: "Puyallup" },
              { "@type": "AdministrativeArea", name: "Pierce County" },
            ],
          }),
        }}
      />
    </main>
  );
}
