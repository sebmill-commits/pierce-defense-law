import { Metadata } from "next";
import Link from "next/link";
import {
  Phone,
  Gauge,
  Camera,
  Car,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import { SITE_CONFIG, COURT_PRICING } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Traffic Ticket Lawyer Tacoma | Pierce County Traffic Defense",
  description:
    "Fight your traffic ticket in Pierce County. Flat fee defense starting at $149. I handle court so you don't miss work.",
  openGraph: {
    title: "Traffic Ticket Defense | Pierce Defense Law",
    description:
      "Keep points off your record. Flat fee traffic ticket defense in Pierce County.",
  },
};

export default function TrafficTicketsPage() {
  const ticketTypes = [
    {
      icon: Gauge,
      title: "Speeding Tickets",
      description:
        "1-10 over, 11-15 over, 16-20 over, school zones, construction zones. Each has different consequences.",
      price: "$149 - $249",
    },
    {
      icon: Camera,
      title: "Camera Tickets",
      description:
        "Red light cameras and school zone cameras. These have specific defenses that often work.",
      price: "$149 - $179",
    },
    {
      icon: Car,
      title: "Moving Violations",
      description:
        "HOV violations, illegal turns, failure to yield, following too closely, improper lane changes.",
      price: "$149 - $199",
    },
    {
      icon: AlertTriangle,
      title: "Negligent Driving",
      description:
        "A criminal offense that requires more aggressive defense. Can often be reduced.",
      price: "Free Consultation",
    },
  ];

  const whyFight = [
    {
      title: "Points on Your License",
      description:
        "Points accumulate and can lead to license suspension. Six or more points in 12 months triggers review.",
    },
    {
      title: "Insurance Increases",
      description:
        "A single ticket can raise your rates 15-25% for three to five years. That adds up.",
    },
    {
      title: "Employment Issues",
      description:
        "CDL holders and professional drivers can lose their jobs. Even regular drivers may face issues.",
    },
    {
      title: "Permanent Record",
      description:
        "Tickets stay on your record for years. Future tickets are treated more harshly.",
    },
  ];

  // Sample courts for pricing display
  const sampleCourts = [
    "Tacoma Municipal Court",
    "Pierce County District Court",
    "Lakewood Municipal Court",
    "Puyallup Municipal Court",
    "Federal Way Municipal Court",
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 px-4 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-4xl">
          <h1
            className="mb-6 text-3xl font-bold lg:text-5xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Traffic Ticket Defense
          </h1>
          <p className="mb-8 text-lg text-slate-300 lg:text-xl">
            Even a simple traffic ticket puts you against the system&mdash;prosecutors,
            courts, and procedures designed to process convictions quickly. I&apos;ve
            worked on both sides of that system and know how to fight back. Flat
            fees. No surprises. I handle court so you don&apos;t miss work.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/fight-my-ticket"
              className="btn-primary inline-flex items-center justify-center gap-2 text-lg"
            >
              Fight My Ticket
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href={`tel:${SITE_CONFIG.phoneRaw}`}
              className="btn-secondary inline-flex items-center justify-center gap-2 text-lg"
            >
              <Phone className="h-5 w-5" />
              {SITE_CONFIG.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Ticket Types */}
      <section className="px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-6 text-2xl font-bold text-slate-900 lg:text-3xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Types of Tickets I Handle
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {ticketTypes.map((type, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                  <type.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {type.title}
                </h3>
                <p className="mb-4 text-sm text-slate-600">{type.description}</p>
                <div className="text-sm font-semibold text-emerald-600">
                  {type.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Me Section */}
      <section className="bg-white px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-6 text-2xl font-bold text-slate-900 lg:text-3xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Someone Who Knows the System
          </h2>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 lg:p-8">
            <p className="mb-4 text-slate-600">
              I started my career as a public defender, handling everything from
              traffic cases to serious criminal matters. I tried cases
              regularly&mdash;including winning four jury trials in a row. I
              learned that preparation and willingness to fight changes how
              prosecutors approach your case.
            </p>
            <p className="mb-4 text-slate-600">
              I also worked for the State of Washington, which gave me insight
              into how government cases are built and where they have weaknesses.
            </p>
            <p className="text-slate-600">
              Now I use that experience to defend people against traffic charges.
              Most attorneys just process paperwork. I actually know what it
              takes to win when the system is stacked against you.
            </p>
          </div>
        </div>
      </section>

      {/* Why Fight */}
      <section className="bg-slate-100 px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-6 text-2xl font-bold text-slate-900 lg:text-3xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Why Fight Your Ticket?
          </h2>
          <p className="mb-8 text-slate-600">
            The system makes it easy to just pay and move on. That&apos;s by
            design&mdash;it&apos;s how courts process thousands of tickets
            efficiently. But paying is pleading guilty, and that creates
            consequences beyond the fine itself.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {whyFight.map((reason, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-slate-900">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-slate-600">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Court Pricing */}
      <section className="px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-6 text-2xl font-bold text-slate-900 lg:text-3xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Flat Fee Pricing
          </h2>
          <p className="mb-8 text-slate-600">
            Simple, transparent pricing. No hourly rates. No surprises. Your fee
            depends on the court and violation type.
          </p>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">
                    Court
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                    Starting At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sampleCourts.map((court) => (
                  <tr key={court}>
                    <td className="px-4 py-3 text-sm text-slate-700">{court}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-emerald-600">
                      ${COURT_PRICING[court]?.base || 199}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-sm text-slate-500">
            Final price depends on violation type.{" "}
            <Link
              href="/fight-my-ticket"
              className="font-medium text-emerald-600 hover:underline"
            >
              Get an instant quote
            </Link>
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-100 px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-6 text-2xl font-bold text-slate-900 lg:text-3xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            How It Works
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                1
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-slate-900">
                  Send Me Your Ticket
                </h3>
                <p className="text-slate-600">
                  Take a photo of your citation. I&apos;ll review it and give
                  you an instant quote.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                2
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-slate-900">
                  I Handle Everything
                </h3>
                <p className="text-slate-600">
                  I file paperwork, negotiate with prosecutors, and appear in
                  court on your behalf.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                3
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-slate-900">
                  Get the Result
                </h3>
                <p className="text-slate-600">
                  Most cases are dismissed, reduced, or deferred. I keep you
                  updated throughout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-slate-900 p-8 text-center text-white lg:p-12">
            <h2
              className="mb-4 text-2xl font-bold lg:text-3xl"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Don&apos;t Let the System Win
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-slate-300">
              The process is designed for quick guilty pleas, not fairness. Get
              someone in your corner who knows how to push back. I&apos;ve won
              against steep odds before&mdash;let me fight for you.
            </p>
            <Link
              href="/fight-my-ticket"
              className="btn-primary inline-flex items-center gap-2 text-lg"
            >
              Start Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
