import Link from "next/link";
import { Camera, Phone } from "lucide-react";
import { SEATTLE_SITE_CONFIG } from "@/lib/seattle-constants";

export default function SeattleFinalCTA() {
  return (
    <section className="bg-slate-900 py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
        <h2
          className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          Ready to Fight Your Ticket?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-400">
          Takes 3 minutes. Snap a photo of your ticket, get a quote, and let me
          handle the rest. No obligation. Just straight answers.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/defense/fight-my-ticket"
            className="btn-primary w-full text-lg sm:w-auto"
          >
            <Camera className="h-5 w-5" />
            Upload Your Ticket
          </Link>
          <a
            href={`tel:${SEATTLE_SITE_CONFIG.phoneRaw}`}
            className="btn-secondary w-full text-lg sm:w-auto"
          >
            <Phone className="h-5 w-5" />
            {SEATTLE_SITE_CONFIG.phone}
          </a>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Available 24/7 for DUI emergencies. Seattle &amp; King County.
        </p>
      </div>
    </section>
  );
}
