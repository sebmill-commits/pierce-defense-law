import Link from "next/link";
import { Camera, MessageSquare, Scale, CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Camera,
    title: "Upload Your Ticket",
    description:
      "Snap a photo of your citation. Takes 30 seconds. I'll review it and give you a quote right away.",
  },
  {
    number: "02",
    icon: MessageSquare,
    title: "I Review & Respond",
    description:
      "Within hours, you'll know your options. No pressure. Just straight talk about your case.",
  },
  {
    number: "03",
    icon: Scale,
    title: "I Handle Court",
    description:
      "For most traffic tickets, you never set foot in court. I appear on your behalf and fight for the best outcome.",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Get Results",
    description:
      "Most cases are dismissed, reduced, or deferred. I keep you updated every step of the way.",
  },
];

export default function SeattleHowItWorks() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center lg:mb-16">
          <h2
            className="mb-4 text-3xl font-bold text-[--primary] sm:text-4xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[--text-secondary]">
            Fighting your ticket shouldn&apos;t be complicated. Here&apos;s how
            simple it is.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {/* Connector Line (hidden on mobile, first item) */}
              {index > 0 && (
                <div className="absolute left-0 top-10 hidden h-0.5 w-full -translate-x-1/2 bg-gray-200 lg:block" />
              )}

              {/* Step Content */}
              <div className="relative">
                {/* Icon Circle */}
                <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[--bg-light]">
                  <step.icon className="h-8 w-8 text-[--primary]" />
                  <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[--success] text-xs font-bold text-white">
                    {step.number}
                  </span>
                </div>

                {/* Text */}
                <h3 className="mb-2 text-lg font-semibold text-[--primary]">
                  {step.title}
                </h3>
                <p className="text-sm text-[--text-secondary]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/fight-my-ticket" className="btn-primary text-lg">
            Start Now - Takes 3 Minutes
          </Link>
        </div>
      </div>
    </section>
  );
}
