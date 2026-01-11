// Pierce Defense Law - Site Constants
// Sebastian Miller, Trial Attorney

export const SITE_CONFIG = {
  name: "Pierce Defense Law",
  tagline: "Straight talk. Fast action. Trial-tested defense.",
  phone: "(253) 238-7444",
  phoneRaw: "+12532387444",
  email: "sebastian@piercecountydefense.com",
  address: {
    street: "9009 S 19th St, BLDG F",
    city: "Tacoma",
    state: "WA",
    zip: "98466",
  },
  wsbaNumber: "XXXXX", // TODO: Replace with actual WSBA number
  attorneyName: "Sebastian Miller",
  attorneyTitle: "Trial Attorney",
  caseCount: "500+",
  googleReviewRating: 4.9,
  googleReviewCount: 47,
  hours: {
    weekday: "8:00 AM - 6:00 PM",
    weekend: "By Appointment",
    dui: "24/7 Emergency Line",
  },
  social: {
    google: "https://g.page/pierce-defense-law",
    facebook: "https://facebook.com/piercedefenselaw",
    linkedin: "https://linkedin.com/in/sebastianmiller",
  },
};

// Brand voice: clear, calm, confident, direct
// Three pillars: Affordable, Aggressive, Trial-tested
export const BRAND = {
  pillars: [
    {
      title: "Affordable Defense",
      description: "Simple pricing. No confusion. Flat fees for most traffic matters.",
    },
    {
      title: "Aggressive Approach",
      description: "I challenge stops, evidence, and procedures. Every detail matters.",
    },
    {
      title: "Ready for Court",
      description: "Real courtroom experience. Jury trials. Prepared to fight if needed.",
    },
  ],
  taglines: [
    "Straight talk. Fast action. Trial-tested defense when it matters.",
    "I take a limited number of cases so clients get real attention.",
    "Affordable. Aggressive. Trial-ready.",
  ],
};

// Court pricing database - derived from Rivercrest Court Database
export const COURT_PRICING: Record<
  string,
  { base: number; complexity: "low" | "medium" | "high" }
> = {
  // Pierce County Courts
  "Pierce County District Court": { base: 199, complexity: "medium" },
  "Tacoma Municipal Court": { base: 179, complexity: "medium" },
  "Lakewood Municipal Court": { base: 189, complexity: "medium" },
  "Puyallup Municipal Court": { base: 189, complexity: "medium" },
  "Federal Way Municipal Court": { base: 199, complexity: "medium" },
  "University Place Municipal Court": { base: 179, complexity: "low" },
  "Bonney Lake Municipal Court": { base: 179, complexity: "low" },
  "Fife Municipal Court": { base: 179, complexity: "low" },
  "Milton Municipal Court": { base: 179, complexity: "low" },
  "Orting Municipal Court": { base: 179, complexity: "low" },
  "Sumner Municipal Court": { base: 179, complexity: "low" },
  "Steilacoom Municipal Court": { base: 179, complexity: "low" },

  // King County (overflow cases)
  "King County District Court": { base: 199, complexity: "medium" },
  "Seattle Municipal Court": { base: 219, complexity: "high" },
  "Auburn Municipal Court": { base: 189, complexity: "medium" },
  "Kent Municipal Court": { base: 189, complexity: "medium" },
  "Renton Municipal Court": { base: 189, complexity: "medium" },

  // Thurston County
  "Thurston County District Court": { base: 199, complexity: "medium" },
  "Olympia Municipal Court": { base: 189, complexity: "medium" },
  "Lacey Municipal Court": { base: 179, complexity: "low" },

  // Default
  default: { base: 199, complexity: "medium" },
};

// Violation type modifiers
export const VIOLATION_MODIFIERS: Record<string, number> = {
  "Speeding 1-10 over": 0,
  "Speeding 11-15 over": 0,
  "Speeding 16-20 over": 25,
  "Speeding 21+ over": 50,
  "Speeding in school zone": 50,
  "Speeding in construction zone": 50,
  "HOV violation": 0,
  "Red light camera": -25,
  "Cell phone violation": 0,
  "Seatbelt violation": 0,
  "Insurance violation": 50,
  "Negligent driving": 100,
  "CDL violation": 150,
  default: 0,
};

// Calculate price based on court and violation
export function calculatePrice(
  courtName: string,
  violationType?: string
): {
  basePrice: number;
  violationModifier: number;
  totalPrice: number;
  complexity: "low" | "medium" | "high";
} {
  const court = COURT_PRICING[courtName] || COURT_PRICING["default"];
  const violationMod =
    VIOLATION_MODIFIERS[violationType || ""] || VIOLATION_MODIFIERS["default"];

  return {
    basePrice: court.base,
    violationModifier: violationMod,
    totalPrice: court.base + violationMod,
    complexity: court.complexity,
  };
}

// Services offered
export const SERVICES = [
  {
    id: "dui",
    title: "DUI Defense",
    description:
      "DUI charges move fast. I challenge the stop, the tests, and the evidence. Early action matters.",
    icon: "Shield",
    href: "/dui-defense",
    priceRange: "Free Consultation",
  },
  {
    id: "speeding",
    title: "Speeding Tickets",
    description:
      "Points add up. Insurance goes up. I fight to keep tickets off your record.",
    icon: "Gauge",
    href: "/traffic-tickets",
    priceRange: "$149 - $249",
  },
  {
    id: "infractions",
    title: "Traffic Infractions",
    description:
      "Red light cameras. Stop signs. HOV violations. Even small tickets deserve a real defense.",
    icon: "FileWarning",
    href: "/traffic-tickets",
    priceRange: "$149 - $199",
  },
  {
    id: "reckless",
    title: "Reckless Driving",
    description:
      "Criminal charges require aggressive defense. I work to reduce or dismiss.",
    icon: "AlertTriangle",
    href: "/traffic-tickets",
    priceRange: "Free Consultation",
  },
];
