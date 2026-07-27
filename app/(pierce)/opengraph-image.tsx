import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/constants";

// Social preview card. Generated rather than shipped as a static asset so the
// phone number and tagline stay in sync with lib/constants.ts.
export const alt =
  "Pierce Defense Law - DUI and traffic ticket defense in Pierce County";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            PIERCE
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 600,
              color: "#94a3b8",
              letterSpacing: "0.28em",
              marginTop: 12,
            }}
          >
            DEFENSE LAW
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 52,
              fontWeight: 600,
              color: "white",
              lineHeight: 1.25,
              maxWidth: 900,
            }}
          >
            {SITE_CONFIG.tagline}
          </div>
          <div
            style={{
              width: 96,
              height: 6,
              background: "#10b981",
              marginTop: 32,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 30, color: "#cbd5e1" }}>
            {`${SITE_CONFIG.attorneyName}, ${SITE_CONFIG.attorneyTitle} · ${SITE_CONFIG.address.city}, ${SITE_CONFIG.address.state}`}
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, color: "#10b981" }}>
            {SITE_CONFIG.phone}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
