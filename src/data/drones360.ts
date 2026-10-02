export interface Drone360Spec {
  capacity?: string;
  maxPayload?: string;
  sprayWidth?: string;
  spreadWidth?: string;
  batteryCost?: string;
  maintenanceCost?: string;
  flightTime?: string;
  endurance?: string;
  rotorConfig?: string;
  flowRate?: string;
  flowControl?: string;
  pumpPressure?: string;
  coverage?: string;
  airframe?: string;
  windResistance?: string;
  ipRating?: string;
  flightController?: string;
  [key: string]: string | undefined;
}

export interface Drone360Data {
  id: string;
  folder: string;
  name: string;
  series: string;
  tagline: string;
  category: string;
  payloadType: "Sprayer" | "Spreader" | "Modular Base" | string;
  specs: Drone360Spec;
  frameCount: number;
  frames: string[];
  poster: string;
  turntable: string;
}

export const DRONES_360_CATALOG: Drone360Data[] = [
  {
    id: "10x-sprayer",
    folder: "10X SPREAYINR DRONE",
    name: "Agrown-10X Sprayer",
    series: "Hexacopter Workhorse",
    tagline: "Precision Dual-Arm Micro-Atomization Agricultural Sprayer",
    category: "Agriculture",
    payloadType: "Sprayer",
    specs: {
      capacity: "10 Litres",
      sprayWidth: "4 - 6 Metres",
      batteryCost: "₹20 / Acre*",
      maintenanceCost: "₹50 / Acre*",
      flightTime: "18 - 22 Mins",
      rotorConfig: "Hexacopter (6 Rotors)",
      ipRating: "IP67 Washable",
      flightController: "Triple-IMU Redundant GPS Autopilot",
    },
    frameCount: 36,
    frames: Array.from({ length: 36 }, (_, i) => `/drones-360/10x-sprayer/smooth_${String(i + 1).padStart(2, '0')}.webp`),
    poster: "/drones-360/10x-sprayer/smooth_01.webp",
    turntable: "/drones-360/10x-sprayer/turntable-360.webp",
  },
  {
    id: "10x-spreader",
    folder: "10X SPREADER DRONE",
    name: "Agrown-10X Spreader",
    series: "Granular Delivery",
    tagline: "High-Velocity Centrifugal Granule & Fertilizer Broadcaster",
    category: "Agriculture",
    payloadType: "Spreader",
    specs: {
      capacity: "10–12 Kg Granular Hopper",
      spreadWidth: "5 - 7 Metres",
      flowRate: "1 - 8 kg/min Adjustable",
      maintenanceCost: "₹50 / Acre*",
      flightTime: "16 - 20 Mins",
      rotorConfig: "Hexacopter (6 Rotors)",
      ipRating: "IP67 Granule Resistant",
      flightController: "Smart Weighing Dynamic Dispersal",
    },
    frameCount: 36,
    frames: Array.from({ length: 36 }, (_, i) => `/drones-360/10x-spreader/smooth_${String(i + 1).padStart(2, '0')}.webp`),
    poster: "/drones-360/10x-spreader/smooth_01.webp",
    turntable: "/drones-360/10x-spreader/turntable-360.webp",
  },
  {
    id: "5x-sprayer",
    folder: "5X SPREAYING DRONE",
    name: "Agrown-10X Super Compact Sprayer",
    series: "Agile Quadcopter",
    tagline: "Compact Rapid-Deployment Precision Spraying Drone",
    category: "Agriculture",
    payloadType: "Sprayer",
    specs: {
      capacity: "5 Litres",
      sprayWidth: "3 - 4.5 Metres",
      batteryCost: "₹15 / Acre*",
      maintenanceCost: "₹35 / Acre*",
      flightTime: "15 - 18 Mins",
      rotorConfig: "Quadcopter (4 Rotors)",
      ipRating: "IP65 Weatherproof",
      flightController: "Compact Obstacle-Avoidance Autopilot",
    },
    frameCount: 36,
    frames: Array.from({ length: 36 }, (_, i) => `/drones-360/5x-sprayer/smooth_${String(i + 1).padStart(2, '0')}.webp`),
    poster: "/drones-360/5x-sprayer/smooth_01.webp",
    turntable: "/drones-360/5x-sprayer/turntable-360.webp",
  },
  {
    id: "5x-spreader",
    folder: "5X SPREADER DRONE",
    name: "Agrown-10X Super Compact Spreader",
    series: "Agile Granular",
    tagline: "Lightweight High-Uniformity Fertilizer & Seed Broadcaster",
    category: "Agriculture",
    payloadType: "Spreader",
    specs: {
      capacity: "6 Kg Hopper",
      spreadWidth: "4 - 5.5 Metres",
      flowRate: "0.5 - 5 kg/min",
      maintenanceCost: "₹35 / Acre*",
      flightTime: "14 - 17 Mins",
      rotorConfig: "Quadcopter (4 Rotors)",
      ipRating: "IP65 Sealed",
      flightController: "Electronic Flow Control Gate",
    },
    frameCount: 36,
    frames: Array.from({ length: 36 }, (_, i) => `/drones-360/5x-spreader/smooth_${String(i + 1).padStart(2, '0')}.webp`),
    poster: "/drones-360/5x-spreader/smooth_01.webp",
    turntable: "/drones-360/5x-spreader/turntable-360.webp",
  },
  {
    id: "greaydon-base",
    folder: "GREAYDON ONLY DRONE IMAGES",
    name: "Graydon Industrial Airframe",
    series: "Modular Heavy-Lift",
    tagline: "Multi-Utility Aerospace Carbon-Fiber Industrial Airframe",
    category: "Industrial / Multi-Mission",
    payloadType: "Modular Base",
    specs: {
      maxPayload: "25 - 30 Kg",
      endurance: "Up to 35 Mins (Empty)",
      airframe: "3K Twill Carbon Fiber + Aviation Aluminum",
      windResistance: "Up to 12 m/s (Force 6)",
      ipRating: "IP65 Weatherproof",
      flightController: "Triple Redundant Industrial Autopilot",
      rotorConfig: "Heavy Hexacopter",
    },
    frameCount: 36,
    frames: Array.from({ length: 36 }, (_, i) => `/drones-360/greaydon-base/smooth_${String(i + 1).padStart(2, '0')}.webp`),
    poster: "/drones-360/greaydon-base/smooth_01.webp",
    turntable: "/drones-360/greaydon-base/turntable-360.webp",
  },
  {
    id: "greaydon-sprayer",
    folder: "GREAYDON SPREAYING DRONE",
    name: "Graydon Heavy Sprayer",
    series: "Enterprise High-Volume",
    tagline: "Commercial Heavy-Capacity Multi-Nozzle Agricultural Sprayer",
    category: "Agriculture / Industrial",
    payloadType: "Sprayer",
    specs: {
      capacity: "20 - 25 Litres",
      sprayWidth: "6 - 9 Metres",
      pumpPressure: "High-Pressure Quad Brushless Pumps",
      maintenanceCost: "₹50 / Acre*",
      rotorConfig: "Heavy Hexacopter",
      flightController: "Centimeter RTK Auto-Swath Navigation",
    },
    frameCount: 28,
    frames: Array.from({ length: 28 }, (_, i) => `/drones-360/greaydon-sprayer/smooth_${String(i + 1).padStart(2, '0')}.webp`),
    poster: "/drones-360/greaydon-sprayer/smooth_01.webp",
    turntable: "/drones-360/greaydon-sprayer/turntable-360.webp",
  },
  {
    id: "greaydon-spreader",
    folder: "GREAYDON SPEADER DRONE",
    name: "Graydon Heavy Spreader",
    series: "Enterprise Broadcaster",
    tagline: "Industrial-Scale Granular, Pellet & Seed Broadcaster",
    category: "Agriculture / Industrial",
    payloadType: "Spreader",
    specs: {
      capacity: "25 Kg Heavy-Duty Hopper",
      spreadWidth: "7 - 11 Metres",
      flowControl: "Smart Weighing & Dynamic Flow Adjustment",
      rotorConfig: "Heavy Hexacopter",
      flightController: "High-Precision Centrifugal Disc Metering",
    },
    frameCount: 28,
    frames: Array.from({ length: 28 }, (_, i) => `/drones-360/greaydon-spreader/smooth_${String(i + 1).padStart(2, '0')}.webp`),
    poster: "/drones-360/greaydon-spreader/smooth_01.webp",
    turntable: "/drones-360/greaydon-spreader/turntable-360.webp",
  },
];
