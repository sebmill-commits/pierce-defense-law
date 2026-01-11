import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Scale,
  GraduationCap,
  Award,
  Users,
  ArrowRight,
} from "lucide-react";
import { SEATTLE_SITE_CONFIG, SEATTLE_BRAND } from "@/lib/seattle-constants";

export const metadata: Metadata = {
  title: "About Sebastian Miller | Seattle Defense Attorney | Rivercrest Law",
  description:
    "Meet Sebastian Miller, trial attorney serving Seattle and King County. Aggressive defense with personal attention. Learn about my approach and experience.",
  openGraph: {
    title: "About Sebastian Miller | Rivercrest Law Seattle",
    description:
      "Trial attorney focused on traffic and DUI defense in Seattle and King County.",
  },
};

export default function SeattleAboutPage() {
  const credentials = [
    {
      icon: GraduationCap,
      title: "Education",
      items: [
        "University of Washington School of Law",
        "Class of 2015",
      ],
    },
    {
      icon: Scale,
      title: "Bar Admissions",
      items: [
        "Washington State Bar Association",
        `WSBA #${SEATTLE_SITE_CONFIG.wsbaNumber}`,
      ],
    },
    {
      icon: Award,
      title: "Practice Areas",
      items: [
        "DUI Defense",
        "Traffic Infractions",
        "Criminal Defense",
        "Reckless Driving",
      ],
    },
    {
      icon: Users,
      title: "Courts Served",
      items: [
        "Seattle Municipal Court",
        "King County District Court",
        "20+ Municipal Courts",
      ],
    },
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
            About {SEATTLE_SITE_CONFIG.attorneyName}
          </h1>
          <p className="text-lg text-slate-300 lg:text-xl">
            {SEATTLE_SITE_CONFIG.attorneyTitle} &bull; {SEATTLE_SITE_CONFIG.name}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Contact Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <a
                  href={`tel:${SEATTLE_SITE_CONFIG.phoneRaw}`}
                  className="btn-call flex w-full items-center justify-center gap-2"
                >
                  <Phone className="h-5 w-5" />
                  {SEATTLE_SITE_CONFIG.phone}
                </a>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-2">
              {/* Intro */}
              <div className="prose prose-slate max-w-none">
                <h2
                  className="text-2xl font-bold text-slate-900"
                  style={{ fontFamily: "var(--font-dm-serif)" }}
                >
                  Trial-Tested Defense
                </h2>
                <p className="text-lg text-slate-600">
                  I&apos;m {SEATTLE_SITE_CONFIG.attorneyName}, and I run a focused
                  defense practice serving Seattle and King County. I don&apos;t take every
                  case that comes through the door. I take a limited number so
                  each client gets real attention.
                </p>
                <p className="text-slate-600">
                  Most traffic ticket lawyers never see the inside of a
                  courtroom. They negotiate deals and move on. That&apos;s fine
                  for some cases, but when negotiation doesn&apos;t work, you
                  need someone who&apos;s ready to fight.
                </p>
                <p className="text-slate-600">
                  I&apos;ve tried cases. I know what it takes to challenge
                  evidence, cross-examine officers, and argue to a judge or
                  jury. That experience shapes how I approach every case, even
                  the ones that settle.
                </p>
              </div>

              {/* Action Photo */}
              <div className="mt-12 overflow-hidden rounded-xl">
                <Image
                  src="/images/Courthouse Steps Shot.jpg"
                  alt="Sebastian Miller at the courthouse"
                  width={800}
                  height={533}
                  className="h-auto w-full object-cover"
                />
              </div>

              {/* Philosophy */}
              <div className="mt-12">
                <h2
                  className="mb-6 text-2xl font-bold text-slate-900"
                  style={{ fontFamily: "var(--font-dm-serif)" }}
                >
                  My Approach
                </h2>
                <div className="space-y-6">
                  {SEATTLE_BRAND.pillars.map((pillar, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-200 bg-white p-6"
                    >
                      <h3 className="mb-2 text-lg font-semibold text-slate-900">
                        {pillar.title}
                      </h3>
                      <p className="text-slate-600">{pillar.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Credentials */}
              <div className="mt-12">
                <h2
                  className="mb-6 text-2xl font-bold text-slate-900"
                  style={{ fontFamily: "var(--font-dm-serif)" }}
                >
                  Background
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {credentials.map((cred, index) => (
                    <div key={index} className="rounded-xl bg-slate-100 p-6">
                      <div className="mb-3 flex items-center gap-3">
                        <cred.icon className="h-5 w-5 text-slate-600" />
                        <h3 className="font-semibold text-slate-900">
                          {cred.title}
                        </h3>
                      </div>
                      <ul className="space-y-1 text-sm text-slate-600">
                        {cred.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why I Do This */}
              <div className="mt-12">
                <h2
                  className="mb-6 text-2xl font-bold text-slate-900"
                  style={{ fontFamily: "var(--font-dm-serif)" }}
                >
                  Why Traffic & DUI Defense?
                </h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600">
                    Traffic tickets and DUIs might seem minor compared to other
                    criminal charges, but they&apos;re not minor to the people
                    facing them. A speeding ticket can raise your insurance for
                    years. A DUI can cost your job, your license, and your
                    freedom.
                  </p>
                  <p className="text-slate-600">
                    I chose this practice area because I can make a real
                    difference. Every case I take is one where I can help
                    someone avoid consequences that could follow them for years.
                  </p>
                </div>
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
              Ready to Talk?
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-slate-300">
              Whether you have a traffic ticket or are facing DUI charges,
              I&apos;m here to help. Free consultations for DUI cases.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/defense/fight-my-ticket"
                className="btn-primary inline-flex items-center gap-2 text-lg"
              >
                Fight My Ticket
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href={`tel:${SEATTLE_SITE_CONFIG.phoneRaw}`}
                className="btn-call inline-flex items-center gap-2 text-lg"
              >
                <Phone className="h-5 w-5" />
                {SEATTLE_SITE_CONFIG.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Person Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Attorney",
            name: SEATTLE_SITE_CONFIG.attorneyName,
            jobTitle: SEATTLE_SITE_CONFIG.attorneyTitle,
            image: "https://rivercrestlaw.com/images/sebastian-miller.jpg",
            telephone: SEATTLE_SITE_CONFIG.phone,
            email: SEATTLE_SITE_CONFIG.email,
            worksFor: {
              "@type": "LegalService",
              name: SEATTLE_SITE_CONFIG.name,
            },
            address: {
              "@type": "PostalAddress",
              streetAddress: SEATTLE_SITE_CONFIG.address.street,
              addressLocality: SEATTLE_SITE_CONFIG.address.city,
              addressRegion: SEATTLE_SITE_CONFIG.address.state,
              postalCode: SEATTLE_SITE_CONFIG.address.zip,
              addressCountry: "US",
            },
            areaServed: "Seattle and King County, Washington",
          }),
        }}
      />
    </main>
  );
}
