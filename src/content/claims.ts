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
    status: "placeholder",
    note: "Removed by owner. Re-add only with certificate number and covered models.",
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

  // Timeline claims (awaiting owner verification)
  "timeline-2018-year": { id: "timeline-2018-year", text: "2018", value: "2018", status: "needs-proof" },
  "timeline-2018-title": { id: "timeline-2018-title", text: "The Idea", status: "needs-proof" },
  "timeline-2018-desc": { id: "timeline-2018-desc", text: "Founded by engineers with a vision to build India's most capable agricultural drone from the ground up.", status: "needs-proof" },

  "timeline-2019-year": { id: "timeline-2019-year", text: "2019", value: "2019", status: "needs-proof" },
  "timeline-2019-title": { id: "timeline-2019-title", text: "First Prototype", status: "needs-proof" },
  "timeline-2019-desc": { id: "timeline-2019-desc", text: "First functional prototype completed after 14 months of R&D. First successful autonomous field spray mission.", status: "needs-proof" },

  "timeline-2020-year": { id: "timeline-2020-year", text: "2020", value: "2020", status: "needs-proof" },
  "timeline-2020-title": { id: "timeline-2020-title", text: "First Production", status: "needs-proof" },
  "timeline-2020-desc": { id: "timeline-2020-desc", text: "Manufacturing facility established. First production batch of GoAG drones delivered to farming cooperatives.", status: "needs-proof" },

  "timeline-2021-year": { id: "timeline-2021-year", text: "2021", value: "2021", status: "needs-proof" },
  "timeline-2021-title": { id: "timeline-2021-title", text: "R&D & Facility Expansion", status: "needs-proof" },
  "timeline-2021-desc": { id: "timeline-2021-desc", text: "Established dedicated assembly facility and indigenous testing capabilities.", status: "needs-proof" },

  "timeline-2022-year": { id: "timeline-2022-year", text: "2022", value: "2022", status: "needs-proof" },
  "timeline-2022-title": { id: "timeline-2022-title", text: "Scaled Nationwide", status: "needs-proof" },
  "timeline-2022-desc": { id: "timeline-2022-desc", text: "Expanded to 20+ states. Dealer network of 150+ partners. 5,000+ successful field missions completed.", status: "needs-proof" },

  "timeline-2024-year": { id: "timeline-2024-year", text: "2024", value: "2024", status: "needs-proof" },
  "timeline-2024-title": { id: "timeline-2024-title", text: "Global Vision", status: "needs-proof" },
  "timeline-2024-desc": { id: "timeline-2024-desc", text: "International expansion. Advanced product line with surveillance, mapping, and logistics platforms.", status: "needs-proof" },

  "company-value-transparent-data-desc": {
    id: "company-value-transparent-data-desc",
    text: "Every specification on this site is verified flight-test data. We don't publish what we can't prove.",
    status: "needs-proof",
  },

  // Outreach & State Data claims (awaiting owner verification)
  "outreach-stat-states": { id: "outreach-stat-states", text: "20+ States", value: "20+", status: "needs-proof" },
  "outreach-stat-dealers": { id: "outreach-stat-dealers", text: "150+ Dealers", value: "150+", status: "needs-proof" },
  "outreach-stat-drones": { id: "outreach-stat-drones", text: "5,000+ Drones Deployed", value: "5,000+", status: "needs-proof" },
  "outreach-stat-training-centers": { id: "outreach-stat-training-centers", text: "200+ Training Centers", value: "200+", status: "needs-proof" },
  "outreach-drones-tile": { id: "outreach-drones-tile", text: "5,000+ DRONES DEPLOYED FROM HYD", value: "5,000+", status: "needs-proof" },
  "outreach-state-data": { id: "outreach-state-data", text: "Regional Hub State Metrics", status: "needs-proof" },
  "outreach-certified-pilots": { id: "outreach-certified-pilots", text: "certified pilots", status: "needs-proof" },

  // Configurator claims (awaiting owner verification)
  "configurator-base-price": { id: "configurator-base-price", text: "₹4,85,000", value: "485000", status: "needs-proof" },
  "configurator-price-adders": { id: "configurator-price-adders", text: "Configurator Option Pricing", status: "needs-proof" },
  "configurator-spec-impacts": { id: "configurator-spec-impacts", text: "Payload, Flight Time & Range Specs", status: "needs-proof" },

  // Manufacturing & About claims (awaiting owner verification)
  "manufacturing-global-delivery": { id: "manufacturing-global-delivery", text: "Global Delivery", status: "needs-proof" },
  "about-certified-pilots": { id: "about-certified-pilots", text: "Certified Flight Test Pilots", status: "needs-proof" },
};

export interface ResolvedClaim extends Claim {
  isVisible: boolean;
  displayText: string;
  displayValue?: string;
  badge?: string;
}

export function isDevMode(): boolean {
  if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("dev")) {
    return true;
  }
  return Boolean(import.meta.env?.DEV);
}

export function getClaim(id: string): ResolvedClaim | null {
  const claim = claims[id];
  if (!claim) return null;

  const isDev = isDevMode();

  if (claim.status === "verified") {
    return {
      ...claim,
      isVisible: true,
      displayText: claim.text,
      displayValue: claim.value,
    };
  }

  // In development (or ?dev=1), show needs-proof and placeholder with tag
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

export function isClaimVerified(id: string): boolean {
  return claims[id]?.status === "verified";
}

export function isClaimVisible(id: string): boolean {
  return Boolean(getClaim(id)?.isVisible);
}

