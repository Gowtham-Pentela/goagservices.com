import { PRODUCT_SLUG_ALIASES, resolveProductSlug } from "../content/products";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  image: string;
  specs: {
    tankCapacity?: string;
    flightTime: string;
    maxSpeed: string;
    payload: string;
    range: string;
    waterResistance?: string;
    coverage?: string;
    battery: string;
    operatingTemp: string;
  };
  highlights: string[];
  badge?: string;
}

export const products: Product[] = [
  {
    id: "agrown-10x",
    slug: "agrown-10x",
    name: "Agrown-10X",
    category: "Agriculture",
    tagline: "Purpose-Built 10L Sprayer / 10kg Spreader Workhorse",
    description:
      "World-class, road-ready aerospace frame that folds down for easy transport yet stays rock-solid in flight. 10 L payload delivers uniform spray patterns across diverse crops in Indian conditions with precision nozzles and smart power management.",
    image: "/drones-360/10x-sprayer/smooth_01.webp",
    specs: {
      tankCapacity: "10 Liters",
      flightTime: "18–22 Min",
      maxSpeed: "10 m/s",
      payload: "10 kg",
      range: "3 km",
      waterResistance: "IP67 Washable",
      battery: "12S / 14S Smart LiPo",
      operatingTemp: "-10°C to 50°C",
    },
    highlights: [
      "World-Class Road-Ready Folding Frame",
      "Robust 10-Litre Workhorse Tank",
      "Centimeter-Level RTK Guidance",
      "Dual-Mission Sprayer & Spreader Capability",
      "Up to 2 Years Warranty",
    ],
    badge: "MEDIUM CLASS",
  },
  {
    id: "agrown-10x-super-compact",
    slug: "agrown-10x-super-compact",
    name: "Agrown-10X Super Compact",
    category: "Agriculture",
    tagline: "Ultra-Portable Compact Agricultural Drone",
    description:
      "Precision Made-in-India compact agricultural drone designed for single-operator transport and rapid field deployment. Built with farm-tough metal DNA to shrug off dust, bumps, and vibration, keeping operators flying season after season.",
    image: "/drones-360/5x-sprayer/smooth_01.webp",
    specs: {
      tankCapacity: "5 Liters",
      flightTime: "15–18 Min",
      maxSpeed: "10 m/s",
      payload: "5–6 kg",
      range: "2.5 km",
      waterResistance: "IP65 Weatherproof",
      battery: "Modular Quick-Swap Smart Battery",
      operatingTemp: "-10°C to 50°C",
    },
    highlights: [
      "Ultra-Portable Single-Operator Deployment",
      "Farm-Tough Metal DNA Chassis",
      "Quick-Lock Modular Battery Rails",
      "Compact Road-Ready Footprint",
      "Up to 2 Years Warranty",
    ],
    badge: "SMALL CLASS",
  },
  {
    id: "graydon",
    slug: "graydon",
    name: "Graydon",
    category: "Multi-Payload",
    tagline: "Heavy-Lift Multi-Payload Utility Drone Platform",
    description:
      "Enterprise industrial UAV airframe engineered for multi-mission adaptability. Features swappable electronics and rails for surveying, lidar, surveillance, and heavy industrial spraying payloads.",
    image: "/drones-360/greaydon-base/smooth_01.webp",
    specs: {
      flightTime: "Up to 35 Min (Empty)",
      maxSpeed: "14 m/s",
      payload: "25–30 kg",
      range: "6 km HD Telemetry",
      waterResistance: "IP65 Weatherproof",
      battery: "High-Capacity Dual Smart Battery",
      operatingTemp: "-15°C to 50°C",
    },
    highlights: [
      "25–30 kg Multi-Payload Muscle",
      "India's First 360° Obstacle-Sensing Smart Drone",
      "Universal Payload Quick-Mount Rail",
      "Dual-Frequency RTK Centimeter Precision",
      "Up to 2 Years Warranty",
    ],
    badge: "MULTI-PAYLOAD",
  },
];

export const productCategories = [
  "All",
  "Agriculture",
  "Multi-Payload",
];

export const getProductBySlug = (slug: string): Product | undefined => {
  const canonicalSlug = resolveProductSlug(slug);
  return products.find((p) => p.slug === canonicalSlug);
};

export { PRODUCT_SLUG_ALIASES, resolveProductSlug };
