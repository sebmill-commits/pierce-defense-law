import { DollarSign, Sword, Scale, Clock, UserCheck, FileCheck } from "lucide-react";
import { BRAND } from "@/lib/constants";

const pillarsWithIcons = [
  {
    ...BRAND.pillars[0],
    icon: DollarSign,
    details: "Flat-fee options for most traffic matters. Straightforward pricing for DUIs. No hourly billing confusion.",
  },
  {
    ...BRAND.pillars[1],
    icon: Sword,
    details: "I look for weaknesses: bad stops, faulty equipment, procedural errors. Every case gets scrutinized.",
  },
  {
    ...BRAND.pillars[2],
    icon: Scale,
    details: "Real courtroom experience matters. I've tried cases to juries and know how to prepare for trial.",
  },
];

const additionalReasons = [
  {
    icon: Clock,
    title: "Fast Action",
    description: "Deadlines move fast. I respond quickly and keep your case moving.",
  },
  {
    icon: UserCheck,
    title: "Personal Attention",
    description: "I take a limited number of cases. You won't be a file on a pile.",
  },
  {
    icon: FileCheck,
    title: "I Handle Everything",
    description: "Court appearances, paperwork, negotiations. You don't have to take time off work.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <h2
            className="mb-4 text-3xl font-bold text-[--primary] sm:text-4xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Why Hire Me
          </h2>
          <p className="text-lg text-[--text-secondary]">
            I believe people deserve strong defense without confusion or games.
            Here&apos;s what I bring to your case.
          </p>
        </div>

        {/* Three Pillars - Featured */}
        <div className="mb-16 grid gap-8 lg:grid-cols-3">
          {pillarsWithIcons.map((pillar) => (
            <div
              key={pillar.title}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[--primary] to-[--primary-dark] p-8 text-white"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10">
                <pillar.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{pillar.title}</h3>
              <p className="text-gray-300">{pillar.details}</p>
            </div>
          ))}
        </div>

        {/* Additional Reasons */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {additionalReasons.map((reason) => (
            <div key={reason.title} className="flex gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[--success]/10 text-[--success]">
                <reason.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-2 font-bold text-[--primary]">
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
    </section>
  );
}
