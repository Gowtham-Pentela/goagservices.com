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
    id: "agrown-x",
    slug: "agrown-x",
    name: "Agrown-x",
    category: "Agriculture",
    tagline: "Robust 10-Litre Workhorse",
    description:
      "World-class, road-ready aerospace frame that folds down for easy transport yet stays rock-solid in flight. 10 L payload delivers uniform spray patterns across diverse crops in Indian conditions, covering up to 4 acres per battery with precision nozzles and smart power management.",
    image: "/drones-360/10x-sprayer/smooth_01.webp",
    specs: {
      tankCapacity: "10 Liters",
      flightTime: "28 Min",
      maxSpeed: "10 m/s",
      payload: "10 kg",
      range: "3 km",
      waterResistance: "IP67 Monsoon-Tested",
      coverage: "1 Acre in 7 Mins (~8.5 Acres / Hr)",
      battery: "12S / 14S Smart LiPo",
      operatingTemp: "-10°C to 50°C",
    },
    highlights: [
      "World-Class Road-Ready Folding Frame",
      "Robust 10-Litre Workhorse Tank",
      "Four-Acre Coverage Per Battery",
      "RTK Centimeter Accuracy Guidance",
      "Heat-Hardened & Monsoon-Tested DNA",
    ],
    badge: "MOST POPULAR",
  },
  {
    id: "agrown-x-pro",
    slug: "agrown-x-pro",
    name: "Agrown-x Pro",
    category: "Agriculture",
    tagline: "High-Performance Hexacopter Platform",
    description:
      "Precision Made-in-India spraying hexacopter that finishes up to 10 acres on a single battery pack. Built with farm-tough metal DNA to shrug off dust, bumps, and vibration, keeping operators flying and earning season after season.",
    image: "/drones-360/10x-spreader/smooth_01.webp",
    specs: {
      tankCapacity: "16–20 Liters",
      flightTime: "32 Min",
      maxSpeed: "12 m/s",
      payload: "16–20 kg",
      range: "5 km",
      waterResistance: "IP67 Farm-Tough",
      coverage: "10-Acre Sprint on 1 Charge",
      battery: "High-Capacity Dual Smart Battery",
      operatingTemp: "-10°C to 55°C",
    },
    highlights: [
      "Heavy-Duty Hexacopter Architecture",
      "Farm-Tough Metal DNA Chassis",
      "Ten-Acre Sprint on a Single Charge",
      "Dual-Frequency RTK Centimeter Precision",
      "360° Spherical Obstacle Avoidance Radar",
    ],
    badge: "HEXACOPTER FLAGSHIP",
  },
  {
    id: "agrown-swift20",
    slug: "agrown-swift20",
    name: "Agrown-Swift 20",
    category: "Multipurpose",
    tagline: "20–30 L Payload Muscle & Transformer Kit",
    description:
      "Engineered for heavy spray volumes across plantations and broad-acre farms without constant refills. Features swappable electronics with zero downtime between air and ground modes, plus a snap-on ground-rover kit that keeps your investment earning even in non-spraying seasons.",
    image: "/drones-360/5x-sprayer/smooth_01.webp",
    specs: {
      tankCapacity: "20–30 Liters",
      flightTime: "26 Min",
      maxSpeed: "10 m/s",
      payload: "20–30 kg",
      range: "5 km",
      waterResistance: "IP67 Heavy-Duty",
      coverage: "Up to 15–20 Acres / Hour",
      battery: "Swappable High-Density Modular Packs",
      operatingTemp: "-10°C to 50°C",
    },
    highlights: [
      "20–30 L Heavy Payload Muscle",
      "Swappable Electronics, Zero Downtime",
      "Drone-to-Rover Transformer Kit",
      "High-Flow Atomized Spray System",
      "2-Year Comprehensive Product Warranty",
    ],
    badge: "HEAVY PAYLOAD MUSCLE",
  },
  {
    id: "ecoguardian-series",
    slug: "ecoguardian-series",
    name: "EcoGuardian Series",
    category: "Mapping",
    tagline: "AI Environmental & Field Health Analytics",
    description:
      "State-of-the-art intelligent drone powered by AI and multispectral optics to deliver fast, accurate, real-time field data. From crop stress and canopy NDVI indexing to soil health and terrain contours, helping you see more, decide faster, and work smarter.",
    image: "/drones-360/greaydon-base/smooth_01.webp",
    specs: {
      flightTime: "42 Min",
      maxSpeed: "14 m/s",
      payload: "6 kg Sensor Turret",
      range: "6 km HD Telemetry",
      waterResistance: "IP65 Weatherproof",
      coverage: "250+ Acres / Sortie",
      battery: "Ultra Long-Endurance Smart Battery",
      operatingTemp: "-15°C to 50°C",
    },
    highlights: [
      "Multispectral & Thermal Crop Health Indexing",
      "Real-Time Edge AI Stress & Pest Detection",
      "2 cm GSD Photogrammetric Precision",
      "Direct Prescription Map Export to Sprayers",
      "Autonomous 3D Mission Waypoint Execution",
    ],
    badge: "AI ANALYTICS",
  },
];

export const productCategories = [
  "All",
  "Agriculture",
  "Multipurpose",
  "Mapping",
];

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);
