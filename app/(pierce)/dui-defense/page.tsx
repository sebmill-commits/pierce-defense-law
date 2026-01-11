import { Metadata } from "next";
import Link from "next/link";
import {
  Phone,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
  Scale,
  FileSearch,
  Car,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "DUI Defense Attorney Tacoma | Pierce County DUI Lawyer",
  description:
    "Facing a DUI in Pierce County? I challenge the stop, the tests, and the evidence. Available 24/7 for emergencies. Free consultation.",
  openGraph: {
    title: "DUI Defense Attorney | Pierce Defense Law",
    description:
      "Experienced DUI defense in Pierce County. I challenge every aspect of your case.",
  },
};

export default function DUIDefensePage() {
  const consequences = [
    "License suspension up to 90 days (first offense)",
    "Fines from $990 to $5,000+",
    "Mandatory ignition interlock device",
    "SR-22 insurance requirement",
    "Possible jail time",
    "Criminal record that follows you",
  ];

  const defenseStrategies = [
    {
      icon: Car,
      title: "Challenge the Stop",
      description:
        "Police need reasonable suspicion to pull you over. I examine whether the stop was lawful.",
    },
    {
      icon: FileSearch,
      title: "Question Field Tests",
      description:
        "Field sobriety tests are subjective. Weather, medical conditions, and nerves affect results.",
    },
    {
      icon: Scale,
      title: "Challenge Breath Tests",
      description:
        "Breathalyzers require proper calibration and procedure. Errors happen more than you think.",
    },
    {
      icon: Shield,
      title: "Protect Your Rights",
      description:
        "If police violated your rights during the arrest, evidence may be suppressed.",
    },
  ];

  const timeline = [
    {
      time: "Within 7 Days",
      title: "Request DOL Hearing",
      description:
        "You have only 7 days to request a Department of Licensing hearing to fight license suspension.",
    },
    {
      time: "First 30 Days",
      title: "Build Your Defense",
      description:
        "I gather evidence, review police reports, and identify weaknesses in the prosecution's case.",
    },
    {
      time: "Arraignment",
      title: "Enter Plea",
      description:
        "I appear with you and enter a not guilty plea, buying time to prepare your defense.",
    },
    {
      time: "Pre-Trial",
      title: "Negotiate or Fight",
      description:
        "Many cases are reduced or dismissed. If not, I'm prepared for trial.",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 px-4 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-2 text-sm text-red-300">
            <AlertTriangle className="h-4 w-4" />
            Time-sensitive: Act within 7 days
          </div>
          <h1
            className="mb-6 text-3xl font-bold lg:text-5xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            DUI Defense in Pierce County
          </h1>
          <p className="mb-8 text-lg text-slate-300 lg:text-xl">
            A DUI arrest brings the full weight of the State against
            you&mdash;prosecutors, law enforcement, and a system designed to
            convict. I&apos;ve worked on both sides of that system, and I use
            that experience to fight back. Every detail matters when your
            license and freedom are on the line.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/dui-defense/consultation"
              className="btn-primary inline-flex items-center justify-center gap-2 text-lg"
            >
              Free Consultation
            </Link>
            <a
              href={`tel:${SITE_CONFIG.phoneRaw}`}
              className="btn-call inline-flex items-center justify-center gap-2 text-lg"
            >
              <Phone className="h-5 w-5" />
              {SITE_CONFIG.phone}
            </a>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <Clock className="h-4 w-4" />
            Available 24/7 for emergencies
          </p>
        </div>
      </section>

      {/* Consequences Section */}
      <section className="bg-red-50 px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-6 text-2xl font-bold text-slate-900 lg:text-3xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            What You&apos;re Facing
          </h2>
          <p className="mb-8 text-slate-600">
            Washington DUI penalties are harsh. Understanding what&apos;s at
            stake helps you understand why acting fast matters.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {consequences.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-3 rounded-lg bg-white p-4"
              >
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                <span className="text-slate-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why Me Section */}
      <section className="px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-6 text-2xl font-bold text-slate-900 lg:text-3xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Experience on Both Sides
          </h2>
          <div className="rounded-xl border border-slate-200 bg-white p-6 lg:p-8">
            <p className="mb-4 text-slate-600">
              I started my career as a public defender, trying DUI cases
              regularly. I developed a reputation for taking cases to trial when
              necessary&mdash;including winning four jury trials in a row.
            </p>
            <p className="mb-4 text-slate-600">
              Later, I worked for the State of Washington prosecuting civil
              cases. I learned how the government builds cases, what evidence
              they prioritize, and where their strategies have holes.
            </p>
            <p className="text-slate-600">
              Now I use that dual perspective to defend people facing DUI
              charges. I understand the resource imbalance you&apos;re up
              against&mdash;and I know how to level the playing field.
            </p>
          </div>
        </div>
      </section>

      {/* Defense Strategies */}
      <section className="bg-slate-50 px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-6 text-2xl font-bold text-slate-900 lg:text-3xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            How I Fight DUI Charges
          </h2>
          <p className="mb-8 text-slate-600">
            As a former public defender, I tried DUI cases regularly and learned
            where the State&apos;s cases fall apart. Every DUI has potential
            weaknesses&mdash;I know where to look because I&apos;ve seen how
            prosecutors build these cases from the inside.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {defenseStrategies.map((strategy, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                  <strategy.icon className="h-6 w-6 text-slate-700" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {strategy.title}
                </h3>
                <p className="text-sm text-slate-600">{strategy.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-slate-100 px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-6 text-2xl font-bold text-slate-900 lg:text-3xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            The DUI Process
          </h2>
          <p className="mb-8 text-slate-600">
            Here&apos;s what to expect and when action is needed.
          </p>
          <div className="space-y-6">
            {timeline.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="mt-2 h-full w-0.5 bg-slate-300" />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="mb-1 text-sm font-semibold text-emerald-600">
                    {step.time}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Consultation CTA */}
      <section className="px-4 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-slate-900 p-8 text-center text-white lg:p-12">
            <h2
              className="mb-4 text-2xl font-bold lg:text-3xl"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Don&apos;t Face the State Alone
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-slate-300">
              The prosecution has resources, experience, and the system on their
              side. You need someone who understands how they operate and has
              proven they can win against steep odds. I&apos;ve won four jury
              trials in a row&mdash;let me fight for you.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/dui-defense/consultation"
                className="btn-primary inline-flex items-center gap-2 text-lg"
              >
                Request Free Consultation
              </Link>
              <a
                href={`tel:${SITE_CONFIG.phoneRaw}`}
                className="btn-call inline-flex items-center gap-2 text-lg"
              >
                <Phone className="h-5 w-5" />
                {SITE_CONFIG.phone}
              </a>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Available 24/7 for emergencies
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Schema Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How long do I have to request a DOL hearing after a DUI arrest?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "You have only 7 days from your arrest to request a Department of Licensing hearing to contest your license suspension. Missing this deadline means automatic suspension.",
                },
              },
              {
                "@type": "Question",
                name: "Can a DUI charge be reduced or dismissed?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Many DUI cases are reduced to lesser charges like reckless driving, or dismissed entirely due to procedural errors, improper stops, or faulty testing equipment.",
                },
              },
              {
                "@type": "Question",
                name: "What is the cost of a DUI defense attorney in Pierce County?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "DUI defense fees vary based on complexity. I offer free consultations to discuss your case and provide a clear fee structure upfront with no surprises.",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
