import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const reasons = [
  {
    title: "I Know How the State Thinks",
    description:
      "I've worked as both a public defender and for the State of Washington. I use that experience to spot weaknesses in the prosecution's case that others miss.",
  },
  {
    title: "Proven Trial Record",
    description:
      "I have acquittals on several jury trials. Prosecutors know I'm not afraid to take cases to trial when that's what it takes to win.",
  },
  {
    title: "I Handle Everything",
    description:
      "For most traffic cases, you never step into a courtroom. I appear on your behalf and handle all the paperwork.",
  },
  {
    title: "Flat Fee Pricing",
    description:
      "You know exactly what you'll pay upfront. No hourly billing. No surprise invoices.",
  },
  {
    title: "Personal Attention",
    description:
      "I take limited cases so each client gets real attention. When you call, you reach me directly.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image Column */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/images/Courthouse Steps Shot.jpg"
                alt="Sebastian Miller outside Pierce County Courthouse"
                width={600}
                height={450}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          {/* Content Column */}
          <div>
            <h2
              className="mb-4 text-3xl font-bold text-[--primary] sm:text-4xl"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Don&apos;t Fight the State Alone
            </h2>
            <p className="mb-8 text-lg text-[--text-secondary]">
              The system is stacked against you&mdash;prosecutor&apos;s offices,
              law enforcement, and the full weight of the State. Get someone in
              your corner who understands both sides and has proven they can win.
            </p>

            {/* Reasons List */}
            <div className="space-y-6">
              {reasons.map((reason, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[--success]/10">
                    <CheckCircle2 className="h-4 w-4 text-[--success]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[--primary]">
                      {reason.title}
                    </h3>
                    <p className="text-sm text-[--text-secondary]">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
