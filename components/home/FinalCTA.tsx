import Link from "next/link";
import { Camera, Phone, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export default function FinalCTA() {
  return (
    <section className="bg-gradient-to-r from-[--primary-dark] to-[--primary] py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
        <h2
          className="mb-4 text-3xl font-bold text-white sm:text-4xl"
          style={{ fontFamily: "var(--font-dm-serif)" }}
        >
          Ready to Fight Your Ticket?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
          Don&apos;t let a ticket cost you thousands in insurance increases. Get
          started now.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/fight-my-ticket"
            className="btn-primary w-full text-lg sm:w-auto"
          >
            <Camera className="h-5 w-5" />
            Upload Your Ticket
            <ArrowRight className="h-4 w-4" />
          </Link>
          <span className="text-gray-400">or</span>
          <a
            href={`tel:${SITE_CONFIG.phoneRaw}`}
            className="flex items-center gap-2 text-lg font-semibold text-white hover:text-[--success]"
          >
            <Phone className="h-5 w-5" />
            {SITE_CONFIG.phone}
          </a>
        </div>

        <p className="mt-8 text-sm text-gray-400">
          Flat fees for most traffic matters. $149-249. Free consultation for
          DUI.
        </p>
      </div>
    </section>
  );
}
