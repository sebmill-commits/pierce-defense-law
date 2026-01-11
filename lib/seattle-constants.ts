// Rivercrest Law - Seattle Defense
// Sebastian Miller, Trial Attorney

export const SEATTLE_SITE_CONFIG = {
  name: "Rivercrest Law",
  siteName: "Seattle Defense",
  tagline: "Straight talk. Fast action. Trial-tested defense.",
  phone: "(206) 414-1964",
  phoneRaw: "+12064141964",
  email: "defense@rivercrestlaw.com",
  address: {
    street: "1928 43rd Ave E #9",
    city: "Seattle",
    state: "WA",
    zip: "98112",
  },
  mailingAddress: {
    street: "600 1st Ave Ste 330 PMB 200876",
    city: "Seattle",
    state: "WA",
    zip: "98104-2246",
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
    google: "https://g.page/rivercrest-law",
    facebook: "https://facebook.com/rivercrestlaw",
    linkedin: "https://linkedin.com/in/sebastianmiller",
  },
  baseUrl: "https://rivercrestlaw.com/defense",
};

// Seattle/King County focus
export const SEATTLE_BRAND = {
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

// Seattle/King County Court pricing database
export const SEATTLE_COURT_PRICING: Record<
  string,
  { base: number; complexity: "low" | "medium" | "high" }
> = {
  // King County Courts - Primary focus
  "Seattle Municipal Court": { base: 219, complexity: "high" },
  "King County District Court": { base: 199, complexity: "medium" },
  "Bellevue Municipal Court": { base: 209, complexity: "high" },
  "Kirkland Municipal Court": { base: 199, complexity: "medium" },
  "Redmond Municipal Court": { base: 199, complexity: "medium" },
  "Renton Municipal Court": { base: 189, complexity: "medium" },
  "Kent Municipal Court": { base: 189, complexity: "medium" },
  "Auburn Municipal Court": { base: 189, complexity: "medium" },
  "Federal Way Municipal Court": { base: 199, complexity: "medium" },
  "Burien Municipal Court": { base: 189, complexity: "medium" },
  "SeaTac Municipal Court": { base: 189, complexity: "medium" },
  "Tukwila Municipal Court": { base: 189, complexity: "medium" },
  "Issaquah Municipal Court": { base: 189, complexity: "medium" },
  "Shoreline Municipal Court": { base: 189, complexity: "medium" },
  "Bothell Municipal Court": { base: 189, complexity: "medium" },
  "Woodinville Municipal Court": { base: 179, complexity: "low" },
  "Sammamish Municipal Court": { base: 179, complexity: "low" },
  "Mercer Island Municipal Court": { base: 179, complexity: "low" },

  // Snohomish County (overflow)
  "Snohomish County District Court": { base: 199, complexity: "medium" },
  "Everett Municipal Court": { base: 199, complexity: "medium" },
  "Lynnwood Municipal Court": { base: 189, complexity: "medium" },

  // Pierce County (overflow)
  "Pierce County District Court": { base: 199, complexity: "medium" },
  "Tacoma Municipal Court": { base: 189, complexity: "medium" },

  // Default
  default: { base: 199, complexity: "medium" },
};

// Cities served - Seattle/King County focus
export const SEATTLE_CITIES = [
  { name: "Seattle", court: "Seattle Municipal Court" },
  { name: "Bellevue", court: "Bellevue Municipal Court" },
  { name: "Kirkland", court: "Kirkland Municipal Court" },
  { name: "Redmond", court: "Redmond Municipal Court" },
  { name: "Renton", court: "Renton Municipal Court" },
  { name: "Kent", court: "Kent Municipal Court" },
  { name: "Auburn", court: "Auburn Municipal Court" },
  { name: "Federal Way", court: "Federal Way Municipal Court" },
];

// Calculate price based on court and violation (Seattle version)
export function calculateSeattlePrice(
  courtName: string,
  violationType?: string
): {
  basePrice: number;
  violationModifier: number;
  totalPrice: number;
  complexity: "low" | "medium" | "high";
} {
  // Import violation modifiers from main constants
  const VIOLATION_MODIFIERS: Record<string, number> = {
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

  const court = SEATTLE_COURT_PRICING[courtName] || SEATTLE_COURT_PRICING["default"];
  const violationMod =
    VIOLATION_MODIFIERS[violationType || ""] || VIOLATION_MODIFIERS["default"];

  return {
    basePrice: court.base,
    violationModifier: violationMod,
    totalPrice: court.base + violationMod,
    complexity: court.complexity,
  };
}

// Services offered (Seattle)
export const SEATTLE_SERVICES = [
  {
    id: "dui",
    title: "DUI Defense",
    description:
      "DUI charges move fast. I challenge the stop, the tests, and the evidence. Early action matters.",
    icon: "Shield",
    href: "/defense/dui-defense",
    priceRange: "Free Consultation",
  },
  {
    id: "speeding",
    title: "Speeding Tickets",
    description:
      "Points add up. Insurance goes up. I fight to keep tickets off your record.",
    icon: "Gauge",
    href: "/defense/traffic-tickets",
    priceRange: "$149 - $269",
  },
  {
    id: "infractions",
    title: "Traffic Infractions",
    description:
      "Red light cameras. Stop signs. HOV violations. Even small tickets deserve a real defense.",
    icon: "FileWarning",
    href: "/defense/traffic-tickets",
    priceRange: "$149 - $219",
  },
  {
    id: "reckless",
    title: "Reckless Driving",
    description:
      "Criminal charges require aggressive defense. I work to reduce or dismiss.",
    icon: "AlertTriangle",
    href: "/defense/traffic-tickets",
    priceRange: "Free Consultation",
  },
];

// Footer navigation - Seattle version
export const SEATTLE_FOOTER_CITIES = [
  "Seattle",
  "Bellevue",
  "Kirkland",
  "Redmond",
  "Renton",
  "Kent",
];
