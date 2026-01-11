"use client";

import { Phone } from "lucide-react";
import { SEATTLE_SITE_CONFIG } from "@/lib/seattle-constants";

export default function SeattleMobileCallBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[--success] p-3 shadow-lg lg:hidden">
      <a
        href={`tel:${SEATTLE_SITE_CONFIG.phoneRaw}`}
        className="flex items-center justify-center gap-2 text-lg font-semibold text-white"
      >
        <Phone className="h-5 w-5" />
        Call Now: {SEATTLE_SITE_CONFIG.phone}
      </a>
    </div>
  );
}
