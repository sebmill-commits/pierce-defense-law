import Link from "next/link";
import {
  Shield,
  Gauge,
  FileWarning,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { SERVICES } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Gauge,
  FileWarning,
  AlertTriangle,
};

export default function Services() {
  return (
    <section className="bg-[--bg-light] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <h2
            className="mb-4 text-3xl font-bold text-[--primary] sm:text-4xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            What I Handle
          </h2>
          <p className="text-lg text-[--text-secondary]">
            DUI charges. Speeding tickets. Traffic infractions. I take them all
            seriously.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => {
            const IconComponent = iconMap[service.icon];
            return (
              <Link
                key={service.id}
                href={service.href}
                className="group card flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[--primary] text-white">
                  {IconComponent && <IconComponent className="h-6 w-6" />}
                </div>

                {/* Title */}
                <h3 className="mb-2 text-lg font-bold text-[--primary]">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mb-4 flex-1 text-sm text-[--text-secondary]">
                  {service.description}
                </p>

                {/* Price Range */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-sm font-semibold text-[--success]">
                    {service.priceRange}
                  </span>
                  <ArrowRight className="h-4 w-4 text-[--accent] transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="mb-4 text-[--text-secondary]">
            Not sure what you&apos;re facing? Upload your ticket and I&apos;ll
            tell you.
          </p>
          <Link href="/fight-my-ticket" className="btn-primary inline-flex">
            Upload Your Ticket
          </Link>
        </div>
      </div>
    </section>
  );
}
