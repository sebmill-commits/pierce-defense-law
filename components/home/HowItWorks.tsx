import { Camera, FileCheck, Scale } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload Your Ticket",
    description:
      "Snap a photo or upload an image. I extract the details automatically.",
    icon: Camera,
    color: "bg-blue-500",
  },
  {
    number: "02",
    title: "Get Your Quote",
    description:
      "See your flat-fee price instantly. No hidden fees. No hourly billing.",
    icon: FileCheck,
    color: "bg-emerald-500",
  },
  {
    number: "03",
    title: "I Handle Everything",
    description:
      "Sign your retainer and I take it from there. Court, paperwork, negotiations.",
    icon: Scale,
    color: "bg-purple-500",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <h2
            className="mb-4 text-3xl font-bold text-[--primary] sm:text-4xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            How It Works
          </h2>
          <p className="text-lg text-[--text-secondary]">
            Three steps. Under three minutes. No office visit required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector Line (hidden on mobile, visible on md+) */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-16 hidden h-0.5 w-full -translate-x-1/2 bg-gray-200 md:block" />
              )}

              <div className="relative flex flex-col items-center text-center">
                {/* Icon Circle */}
                <div
                  className={`${step.color} mb-6 flex h-16 w-16 items-center justify-center rounded-full text-white shadow-lg`}
                >
                  <step.icon className="h-8 w-8" />
                </div>

                {/* Step Number */}
                <span className="mb-2 text-sm font-semibold text-[--accent]">
                  Step {step.number}
                </span>

                {/* Title */}
                <h3 className="mb-3 text-xl font-bold text-[--primary]">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-[--text-secondary]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Time Estimate */}
        <div className="mt-12 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-[--bg-light] px-6 py-3 text-sm font-medium text-[--primary]">
            <span className="flex h-2 w-2 rounded-full bg-[--success]" />
            Most clients finish in under 3 minutes
          </p>
        </div>
      </div>
    </section>
  );
}
