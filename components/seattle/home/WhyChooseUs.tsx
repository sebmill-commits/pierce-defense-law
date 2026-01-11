import Image from "next/image";
import { CheckCircle2, Star } from "lucide-react";
import { SEATTLE_SITE_CONFIG } from "@/lib/seattle-constants";

const reasons = [
  {
    title: "Flat Fee Pricing",
    description:
      "You know exactly what you'll pay upfront. No hourly billing. No surprise invoices.",
  },
  {
    title: "I Handle Everything",
    description:
      "For most traffic cases, you never step into a courtroom. I appear on your behalf.",
  },
  {
    title: "Real Trial Experience",
    description:
      "Not just paperwork. I've tried cases in front of juries. Prosecutors know I'm ready to fight.",
  },
  {
    title: "Personal Attention",
    description:
      "I take limited cases. When you call, you reach me - not a receptionist or paralegal.",
  },
];

export default function SeattleWhyChooseUs() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image Column */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src="/images/Courthouse Steps Shot.jpg"
                alt="Sebastian Miller outside King County Courthouse"
                width={600}
                height={450}
                className="h-auto w-full object-cover"
              />
            </div>
            {/* Google Reviews Badge */}
            <div className="absolute -bottom-6 -right-6 rounded-xl bg-white p-4 shadow-xl lg:-right-8">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-current"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="mt-1 text-lg font-bold text-[--primary]">
                {SEATTLE_SITE_CONFIG.googleReviewRating}
              </p>
              <p className="text-xs text-[--text-secondary]">
                {SEATTLE_SITE_CONFIG.googleReviewCount} Google Reviews
              </p>
            </div>
          </div>

          {/* Content Column */}
          <div>
            <h2
              className="mb-4 text-3xl font-bold text-[--primary] sm:text-4xl"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Why Work With Me?
            </h2>
            <p className="mb-8 text-lg text-[--text-secondary]">
              There are plenty of lawyers in Seattle. Here&apos;s what sets my
              practice apart.
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
