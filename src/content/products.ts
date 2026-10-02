export interface ProductPayloadVariant {
  id: string;
  name: string;
  type: "Sprayer" | "Spreader" | "Multi-Mission Base" | "Modular Turret";
  tankOrHopperCapacity?: string;
  flowRate?: string;
  sprayOrSpreadWidth?: string;
  images360Folder: string;
}

export interface CanonicalProduct {
  id: string;
  slug: string;
  name: string;
  classBadge: string;
  subBadge?: string;
  tagline: string;
  description: string;
  category: "Agriculture" | "Multi-Payload" | "Industrial";
  primaryImage: string;
  images360Folder: string;
  payloadVariants: ProductPayloadVariant[];
  specs: {
    tankCapacity?: string;
    payloadCapacity: string;
    flightTime: string;
    maxSpeed: string;
    range: string;
    chassis: string;
    waterResistance: string;
    navigation: string;
    batteryCostAcre?: string;
    maintenanceCostAcre?: string;
    warranty: string;
  };
  highlights: string[];
  keyFeatures: Array<{
    title: string;
    description: string;
  }>;
}

export const canonicalProducts: CanonicalProduct[] = [
  {
    id: "agrown-10x",
    slug: "agrown-10x",
    name: "Agrown-10X",
    classBadge: "MEDIUM CLASS",
    subBadge: "WORKHORSE",
    tagline: "Purpose-Built Agricultural Spraying & Spreading Workhorse",
    description:
      "Engineered in India for rugged daily field operations. High-strength aerospace frame with quick-fold arms, delivering uniform droplet atomization and granular distribution with field-proven reliability.",
    category: "Agriculture",
    primaryImage: "/drones-360/10x-sprayer/smooth_01.webp",
    images360Folder: "10x-sprayer",
    payloadVariants: [
      {
        id: "sprayer",
        name: "10L Precision Sprayer",
        type: "Sprayer",
        tankOrHopperCapacity: "10 Litres",
        flowRate: "1.5 - 3.5 L/min",
        sprayOrSpreadWidth: "4 - 6 Metres",
        images360Folder: "10x-sprayer",
      },
      {
        id: "spreader",
        name: "10kg Granular Broadcaster",
        type: "Spreader",
        tankOrHopperCapacity: "10–12 kg Hopper",
        flowRate: "1 - 8 kg/min",
        sprayOrSpreadWidth: "5 - 7 Metres",
        images360Folder: "10x-spreader",
      },
    ],
    specs: {
      tankCapacity: "10 Litres",
      payloadCapacity: "10 kg",
      flightTime: "18 - 22 Mins",
      maxSpeed: "10 m/s",
      range: "3 km",
      chassis: "Rugged In-House Carbon/Aviation Alloy Chassis",
      waterResistance: "IP67 Washable",
      navigation: "Dual-Frequency RTK Centimeter Navigation",
      batteryCostAcre: "₹20 / Acre*",
      maintenanceCostAcre: "₹50 / Acre*",
      warranty: "Up to 2 Years Warranty",
    },
    highlights: [
      "10 L Spray Tank / 10 kg Spreader Capacity",
      "Rugged In-House Indian Chassis Architecture",
      "Centimeter-Level RTK Guidance & Terrain Following",
      "Quick-Fold Road-Ready Aerospace Frame",
      "Up to 2 Years Warranty",
    ],
    keyFeatures: [
      {
        title: "In-House Rugged Airframe",
        description: "Built for harsh Indian field conditions, farm-tough metal DNA resistant to dust, bumps, and vibration.",
      },
      {
        title: "Dual Mission Flexibility",
        description: "Swap between liquid spray tank and granular broadcast hopper in under 5 minutes.",
      },
      {
        title: "Field Economics",
        description: "Low operating footprint with ₹20/acre battery cost and ₹50/acre maintenance under typical conditions.",
      },
    ],
  },
  {
    id: "agrown-10x-super-compact",
    slug: "agrown-10x-super-compact",
    name: "Agrown-10X Super Compact",
    classBadge: "SMALL CLASS",
    subBadge: "SUPER COMPACT",
    tagline: "Ultra-Portable Rapid Deployment Agricultural Drone",
    description:
      "Compact footprint, rapid field assembly, and effortless transport by a single operator on a two-wheeler. Engineered for smaller plots, terrace farming, and rapid spot-spraying missions.",
    category: "Agriculture",
    primaryImage: "/drones-360/5x-sprayer/smooth_01.webp",
    images360Folder: "5x-sprayer",
    payloadVariants: [
      {
        id: "sprayer",
        name: "5L Compact Sprayer",
        type: "Sprayer",
        tankOrHopperCapacity: "5 Litres",
        flowRate: "0.8 - 2.0 L/min",
        sprayOrSpreadWidth: "3 - 4.5 Metres",
        images360Folder: "5x-sprayer",
      },
      {
        id: "spreader",
        name: "6kg Compact Spreader",
        type: "Spreader",
        tankOrHopperCapacity: "6 kg Hopper",
        flowRate: "0.5 - 5 kg/min",
        sprayOrSpreadWidth: "4 - 5.5 Metres",
        images360Folder: "5x-spreader",
      },
    ],
    specs: {
      tankCapacity: "5 Litres",
      payloadCapacity: "5–6 kg",
      flightTime: "15 - 18 Mins",
      maxSpeed: "10 m/s",
      range: "2.5 km",
      chassis: "Ultra-Light Carbon Composite Frame",
      waterResistance: "IP65 Weatherproof",
      navigation: "High-Precision GPS / RTK Ready",
      batteryCostAcre: "₹15 / Acre*",
      maintenanceCostAcre: "₹35 / Acre*",
      warranty: "Up to 2 Years Warranty",
    },
    highlights: [
      "Portable Easy Single-Operator Deployment",
      "Rugged Field-Ready Construction",
      "Compact Small Class Footprint",
      "Foldable Arms with Motor Locks",
      "Up to 2 Years Warranty",
    ],
    keyFeatures: [
      {
        title: "Single-Person Transport",
        description: "Folds down to backpack footprint; ideal for hilly terrain, fragmented landholdings, and quick sorties.",
      },
      {
        title: "Quick-Lock Battery Rails",
        description: "Swap intelligent batteries in 30 seconds with zero downtime between sorties.",
      },
      {
        title: "Monsoon & Dust Sealed",
        description: "IP65 weatherproof rating ensures protection during sudden field downpours and dusty environments.",
      },
    ],
  },
  {
    id: "graydon",
    slug: "graydon",
    name: "Graydon",
    classBadge: "MULTI-PAYLOAD",
    subBadge: "UTILITY PLATFORM",
    tagline: "Heavy-Lift Multi-Payload Utility Drone Platform",
    description:
      "Enterprise industrial UAV airframe engineered for multi-mission adaptability. Supports high-volume agricultural spraying, lidar and photogrammetry surveying, thermal surveillance, and custom industrial payloads.",
    category: "Multi-Payload",
    primaryImage: "/drones-360/greaydon-base/smooth_01.webp",
    images360Folder: "greaydon-base",
    payloadVariants: [
      {
        id: "modular-base",
        name: "Multi-Utility Airframe",
        type: "Multi-Mission Base",
        tankOrHopperCapacity: "Up to 30 kg Payload",
        images360Folder: "greaydon-base",
      },
      {
        id: "enterprise-sprayer",
        name: "Enterprise High-Volume Sprayer",
        type: "Sprayer",
        tankOrHopperCapacity: "20 - 25 Litres",
        sprayOrSpreadWidth: "6 - 9 Metres",
        images360Folder: "greaydon-sprayer",
      },
      {
        id: "enterprise-spreader",
        name: "Enterprise Granular Spreader",
        type: "Spreader",
        tankOrHopperCapacity: "25 kg Hopper",
        sprayOrSpreadWidth: "7 - 11 Metres",
        images360Folder: "greaydon-spreader",
      },
    ],
    specs: {
      payloadCapacity: "25 - 30 kg",
      flightTime: "Up to 35 Mins (Empty)",
      maxSpeed: "14 m/s",
      range: "6 km HD Telemetry",
      chassis: "3K Twill Carbon Fiber + Aviation Aluminum",
      waterResistance: "IP65 Industrial Weatherproof",
      navigation: "Dual-Antenna RTK Centimeter Guidance",
      warranty: "Up to 2 Years Warranty",
    },
    highlights: [
      "Multi-Payload Mission Flexibility",
      "360° Spherical Obstacle Sensing",
      "RTK Centimeter Precision Navigation",
      "Triple-Redundant Industrial Autopilot",
      "Up to 2 Years Warranty",
    ],
    keyFeatures: [
      {
        title: "Universal Payload Rails",
        description: "Mount LiDAR scanners, gimbal zoom cameras, or heavy liquid/granular tanks on a standardized rail.",
      },
      {
        title: "360° Obstacle Avoidance",
        description: "Integrated omnidirectional sensing radar detects wires, branches, and towers in real time.",
      },
      {
        title: "Aviation-Grade Durability",
        description: "High-modulus carbon fiber tubes and CNC-machined aerospace alloy joints withstand Force 6 winds.",
      },
    ],
  },
];

// Slug aliases for backwards compatibility and redirect support
export const PRODUCT_SLUG_ALIASES: Record<string, string> = {
  // Aliases for Agrown-10X
  "agrown-x": "agrown-10x",
  "agrone-10x": "agrown-10x",
  "agri-x10": "agrown-10x",
  "10x-sprayer": "agrown-10x",
  "10x-spreader": "agrown-10x",

  // Aliases for Agrown-10X Super Compact
  "agrown-x-pro": "agrown-10x-super-compact",
  "agrown-5x": "agrown-10x-super-compact",
  "5x": "agrown-10x-super-compact",
  "5x-sprayer": "agrown-10x-super-compact",
  "5x-spreader": "agrown-10x-super-compact",
  "agrown-swift20": "agrown-10x-super-compact",
  "agrone-10xi": "agrown-10x-super-compact",

  // Aliases for Graydon
  "graydon-x": "graydon",
  "greaydon-base": "graydon",
  "greaydon-sprayer": "graydon",
  "greaydon-spreader": "graydon",
  "greaydon": "graydon",
  "ecoguardian-series": "graydon",
};

export function resolveProductSlug(slug: string): string {
  const normalized = slug.toLowerCase();
  return PRODUCT_SLUG_ALIASES[normalized] || normalized;
}

export function getCanonicalProductBySlug(slug: string): CanonicalProduct | undefined {
  const canonicalSlug = resolveProductSlug(slug);
  return canonicalProducts.find((p) => p.slug === canonicalSlug);
}
