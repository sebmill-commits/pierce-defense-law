import Link from "next/link";
import { MapPin } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

const cities = [
  { name: "Tacoma", court: "Tacoma Municipal Court" },
  { name: "Lakewood", court: "Lakewood Municipal Court" },
  { name: "Puyallup", court: "Puyallup Municipal Court" },
  { name: "Federal Way", court: "Federal Way Municipal Court" },
  { name: "University Place", court: "University Place Municipal Court" },
  { name: "Bonney Lake", court: "Bonney Lake Municipal Court" },
  { name: "Fife", court: "Fife Municipal Court" },
  { name: "Milton", court: "Milton Municipal Court" },
];

export default function LocalArea() {
  // LocalBusiness schema markup
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: SITE_CONFIG.name,
    description:
      "Trial attorney specializing in DUI and traffic ticket defense in Pierce County, Washington",
    url: "https://piercecountydefense.com",
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.state,
      postalCode: SITE_CONFIG.address.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 47.2529,
      longitude: -122.4443,
    },
    areaServed: cities.map((city) => ({
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
      SITE_CONFIG.social.google,
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.linkedin,
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
              Pierce County Courts
            </h2>
            <p className="mb-6 text-lg text-[--text-secondary]">
              I handle cases in every Pierce County court. Tacoma, Lakewood,
              Puyallup, Federal Way, and beyond. I also cover select King and
              Thurston County courts.
            </p>
            <p className="mb-8 text-[--text-secondary]">
              My office is in Tacoma, but you never need to visit. The entire
              intake process is online. For traffic infractions, I handle all
              court appearances on your behalf.
            </p>

            {/* Cities Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {cities.map((city) => (
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

          {/* Google Map */}
          <div className="relative overflow-hidden rounded-2xl bg-gray-200">
            <div className="aspect-square w-full lg:aspect-auto lg:h-full lg:min-h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2708.9387!2d-122.5153!3d47.2087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5491a1c4e4e4e4e4%3A0x0!2s9009%20S%2019th%20St%2C%20Tacoma%2C%20WA%2098466!5e0!3m2!1sen!2sus!4v1705000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "400px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Pierce Defense Law Office Location - 9009 S 19th St, Tacoma, WA"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
