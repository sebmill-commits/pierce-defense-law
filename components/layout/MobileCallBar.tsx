"use client";

import { Phone, Camera } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "@/lib/constants";

export default function MobileCallBar() {
  const pathname = usePathname();

  // Hide on the intake flow page to avoid distraction
  if (pathname === "/fight-my-ticket") {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-3 shadow-lg lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-center gap-3">
        {/* Call Button */}
        <a
          href={`tel:${SITE_CONFIG.phoneRaw}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[--accent] px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          style={{ minHeight: "48px" }}
        >
          <Phone className="h-5 w-5" />
          <span>Call Now</span>
        </a>

        {/* Upload CTA */}
        <Link
          href="/fight-my-ticket"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[--success] px-4 py-3 font-semibold text-white transition-colors hover:bg-emerald-600"
          style={{ minHeight: "48px" }}
        >
          <Camera className="h-5 w-5" />
          <span>Upload Ticket</span>
        </Link>
      </div>
    </div>
  );
}
