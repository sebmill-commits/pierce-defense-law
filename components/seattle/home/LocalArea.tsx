import Link from "next/link";
import { MapPin } from "lucide-react";
import { SEATTLE_SITE_CONFIG, SEATTLE_CITIES } from "@/lib/seattle-constants";

export default function SeattleLocalArea() {
  // LocalBusiness schema markup
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: SEATTLE_SITE_CONFIG.name,
    description:
      "Trial attorney specializing in DUI and traffic ticket defense in Seattle and King County, Washington",
    url: "https://defense.rivercrestlaw.com",
    telephone: SEATTLE_SITE_CONFIG.phone,
    email: SEATTLE_SITE_CONFIG.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SEATTLE_SITE_CONFIG.address.street,
      addressLocality: SEATTLE_SITE_CONFIG.address.city,
      addressRegion: SEATTLE_SITE_CONFIG.address.state,
      postalCode: SEATTLE_SITE_CONFIG.address.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 47.6062,
      longitude: -122.3321,
    },
    areaServed: SEATTLE_CITIES.map((city) => ({
      "@type": "City",
      name: city.name,
      containedInPlace: {
        "@type": "State",
        name: "Washington",
      },
    })),
    priceRange: "$149-$5000",
    openingHours: "Mo-Fr 08:00-18:00",
    sameAs: [
      SEATTLE_SITE_CONFIG.social.google,
      SEATTLE_SITE_CONFIG.social.facebook,
      SEATTLE_SITE_CONFIG.social.linkedin,
    ],
  };

  return (
    <section className="bg-white py-16 lg:py-24">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div>
            <h2
              className="mb-4 text-3xl font-bold text-[--primary] sm:text-4xl"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Seattle & King County Courts
            </h2>
            <p className="mb-6 text-lg text-[--text-secondary]">
              I handle cases in every King County court. Seattle Municipal, Bellevue,
              Kirkland, Redmond, and beyond. I also cover Snohomish County and
              Pierce County courts.
            </p>
            <p className="mb-8 text-[--text-secondary]">
              My practice is fully remote-friendly. The entire
              intake process is online. For traffic infractions, I handle all
              court appearances on your behalf.
            </p>

            {/* Cities Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {SEATTLE_CITIES.map((city) => (
                <div
                  key={city.name}
                  className="flex items-center gap-2 rounded-lg bg-[--bg-light] px-3 py-2 text-sm"
                >
                  <MapPin className="h-3 w-3 text-[--accent]" />
                  <span className="font-medium text-[--primary]">
                    {city.name}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link href="/contact" className="btn-secondary inline-flex">
                Get Directions
              </Link>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="relative overflow-hidden rounded-2xl bg-gray-200">
            <div className="aspect-square w-full lg:aspect-auto lg:h-full lg:min-h-[400px]">
              {/* Google Maps iframe would go here */}
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-8 text-center">
                <div>
                  <MapPin className="mx-auto mb-4 h-12 w-12 text-[--accent]" />
                  <p className="font-semibold text-[--primary]">
                    {SEATTLE_SITE_CONFIG.attorneyName}
                  </p>
                  <p className="mt-2 text-sm text-[--text-secondary]">
                    {SEATTLE_SITE_CONFIG.address.street}
                    <br />
                    {SEATTLE_SITE_CONFIG.address.city}, {SEATTLE_SITE_CONFIG.address.state}{" "}
                    {SEATTLE_SITE_CONFIG.address.zip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
