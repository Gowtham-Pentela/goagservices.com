export type ClaimStatus = "verified" | "needs-proof" | "placeholder";

export interface Claim {
  id: string;
  text: string;
  value?: string;
  status: ClaimStatus;
  note?: string;
}

export const claims: Record<string, Claim> = {
  // Verified claims
  "indias-first-360-sensing": {
    id: "indias-first-360-sensing",
    text: "India's First 360° Obstacle-Sensing Smart Drone",
    value: "India's First 360° Obstacle-Sensing",
    status: "verified",
    note: "Owner verified claim.",
  },
  "indias-first": {
    id: "indias-first",
    text: "India's First",
    value: "India's First",
    status: "verified",
  },
  "warranty-up-to-2-years": {
    id: "warranty-up-to-2-years",
    text: "Up to 2 Years Warranty",
    value: "Up to 2 Years",
    status: "verified",
    note: "All models. (Do not write 'full' or 'comprehensive').",
  },
  "dgca-certified": {
    id: "dgca-certified",
    text: "DGCA certified",
    value: "DGCA certified",
    status: "verified",
    note: "Company is DGCA certified. Certificate number pending (P1). Plain phrase only.",
  },
  "80-percent-made-in-india": {
    id: "80-percent-made-in-india",
    text: "80% Made in India",
    value: "80% Made in India",
    status: "verified",
    note: "Do not add the word 'Certified'.",
  },
  "battery-cost-per-acre": {
    id: "battery-cost-per-acre",
    text: "₹20 / Acre",
    value: "₹20 / Acre",
    status: "verified",
    note: "Typical values, vary with crop and conditions.",
  },
  "maintenance-cost-per-acre": {
    id: "maintenance-cost-per-acre",
    text: "₹50 / Acre",
    value: "₹50 / Acre",
    status: "verified",
    note: "Typical values, vary with crop and conditions.",
  },
  "response-time-24h": {
    id: "response-time-24h",
    text: "Our team will get back to you within 24 hours.",
    value: "Within 24 hours",
    status: "verified",
    note: "Owner verified response promise.",
  },
  "in-house-manufacturing": {
    id: "in-house-manufacturing",
    text: "100% In-House Manufacturing",
    value: "100%",
    status: "verified",
  },
  "product-platforms-count": {
    id: "product-platforms-count",
    text: "3 Product Platforms",
    value: "3",
    status: "verified",
  },
  "business-hours": {
    id: "business-hours",
    text: "Mon to Sat, 09:00 to 18:30 IST",
    value: "Mon to Sat, 09:00 to 18:30 IST",
    status: "verified",
  },

  // Needs-proof specifications (awaiting owner confirmation in SPECS_REVIEW.md)
  "agrown-10x-flight-time": {
    id: "agrown-10x-flight-time",
    text: "18 - 22 Mins",
    value: "18 - 22 Mins",
    status: "needs-proof",
  },
  "agrown-10x-spray-width": {
    id: "agrown-10x-spray-width",
    text: "4 - 6 Metres",
    value: "4 - 6 Metres",
    status: "needs-proof",
  },
  "agrown-10x-ip-rating": {
    id: "agrown-10x-ip-rating",
    text: "IP67 Washable",
    value: "IP67 Washable",
    status: "needs-proof",
  },
  "agrown-10x-super-compact-flight-time": {
    id: "agrown-10x-super-compact-flight-time",
    text: "15 - 18 Mins",
    value: "15 - 18 Mins",
    status: "needs-proof",
  },
  "agrown-10x-super-compact-spray-width": {
    id: "agrown-10x-super-compact-spray-width",
    text: "3 - 4.5 Metres",
    value: "3 - 4.5 Metres",
    status: "needs-proof",
  },
  "agrown-10x-super-compact-ip-rating": {
    id: "agrown-10x-super-compact-ip-rating",
    text: "IP65 Weatherproof",
    value: "IP65 Weatherproof",
    status: "needs-proof",
  },
  "graydon-endurance": {
    id: "graydon-endurance",
    text: "Up to 35 Mins (Empty)",
    value: "Up to 35 Mins (Empty)",
    status: "needs-proof",
  },
  "graydon-payload": {
    id: "graydon-payload",
    text: "25 - 30 Kg",
    value: "25 - 30 Kg",
    status: "needs-proof",
  },
  "graydon-wind-resistance": {
    id: "graydon-wind-resistance",
    text: "Up to 12 m/s",
    value: "Up to 12 m/s",
    status: "needs-proof",
  },
};

export interface ResolvedClaim extends Claim {
  isVisible: boolean;
  displayText: string;
  displayValue?: string;
  badge?: string;
}

export function getClaim(id: string): ResolvedClaim | null {
  const claim = claims[id];
  if (!claim) return null;

  const isDev = Boolean(import.meta.env?.DEV);

  if (claim.status === "verified") {
    return {
      ...claim,
      isVisible: true,
      displayText: claim.text,
      displayValue: claim.value,
    };
  }

  // In development, show needs-proof and placeholder with tag
  if (isDev) {
    const tag = claim.status === "needs-proof" ? "[NEEDS PROOF]" : "[PLACEHOLDER]";
    return {
      ...claim,
      isVisible: true,
      displayText: `${claim.text} ${tag}`,
      displayValue: claim.value ? `${claim.value} ${tag}` : undefined,
      badge: claim.status === "needs-proof" ? "NEEDS PROOF" : "PLACEHOLDER",
    };
  }

  // In production, unverified claims are hidden
  return null;
}

export function getClaimText(id: string, fallback: string = ""): string {
  const claim = getClaim(id);
  return claim ? claim.displayText : fallback;
}

export function getClaimValue(id: string, fallback: string = ""): string {
  const claim = getClaim(id);
  return claim && claim.displayValue ? claim.displayValue : fallback;
}
