import Link from "next/link";
import {
  Shield,
  Gauge,
  FileWarning,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { SEATTLE_SERVICES } from "@/lib/seattle-constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Gauge,
  FileWarning,
  AlertTriangle,
};

export default function SeattleServices() {
  return (
    <section className="bg-[--bg-light] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center lg:mb-16">
          <h2
            className="mb-4 text-3xl font-bold text-[--primary] sm:text-4xl"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Defense When You Need It
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-[--text-secondary]">
            Whether it&apos;s a speeding ticket or a DUI, I fight to protect
            your record, your license, and your future.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SEATTLE_SERVICES.map((service) => {
            const Icon = iconMap[service.icon] || Shield;
            return (
              <Link
                key={service.id}
                href={service.href}
                className="group rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[--bg-light] group-hover:bg-[--success]/10">
                  <Icon className="h-6 w-6 text-[--primary] group-hover:text-[--success]" />
                </div>

                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold text-[--primary]">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mb-4 text-sm text-[--text-secondary]">
                  {service.description}
                </p>

                {/* Price & Arrow */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[--success]">
                    {service.priceRange}
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-[--success]" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
