export interface ManufacturingStage {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  caption: string;
  pointers: string[];
}

export const manufacturingStages: ManufacturingStage[] = [
  {
    id: "01",
    title: "DESIGN",
    subtitle: "3D Modelling & Simulation",
    description: "Digital mission envelopes & aerodynamic constraints modeled in CAD before production.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80&fm=webp",
    caption: "3D Modelling & Simulation",
    pointers: [
      "Aerodynamic CAD envelopes & structural FEA",
      "Custom crop spray dispersion simulations",
      "Weight optimization for maximum endurance"
    ],
  },
  {
    id: "02",
    title: "MANUFACTURING",
    subtitle: "CNC Machining & Precision Parts",
    description: "In-house CNC machining & carbon lay-up ensuring tight aerospace tolerances.",
    image: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=800&q=80&fm=webp",
    caption: "CNC Machining & Precision Parts",
    pointers: [
      "Precision 5-axis CNC 7075 aluminum machining",
      "3K twill carbon fiber arm lay-up",
      "Weather-sealed motor mounts & enclosures"
    ],
  },
  {
    id: "03",
    title: "ASSEMBLY",
    subtitle: "Expert Assembly & Integration",
    description: "Hand-assembled in Hyderabad with strict aerospace work instructions.",
    image: "https://images.unsplash.com/photo-1581092921461-39ee14b5b2ef?w=800&q=80&fm=webp",
    caption: "Expert Assembly & Integration",
    pointers: [
      "Avionics & flight controller wiring calibration",
      "High-pressure dual pump liquid plumbing",
      "Vibration-damped battery quick-lock trays"
    ],
  },
  {
    id: "04",
    title: "QC",
    subtitle: "Quality Check in Every Step",
    description: "Documented dimensional, electrical, and telemetry validation at every step.",
    image: "https://images.unsplash.com/photo-1590959651373-a3db0f38a961?w=800&q=80&fm=webp",
    caption: "Quality Check in Every Step",
    pointers: [
      "100% circuit continuity & insulation checks",
      "Laser alignment of folding rotor arms",
      "Automated sensor & compass calibration"
    ],
  },
  {
    id: "05",
    title: "TESTING",
    subtitle: "Rigorous Performance Testing",
    description: "Real-world test flights validating stability, payload discharge, and failsafes.",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80&fm=webp",
    caption: "Rigorous Performance Testing",
    pointers: [
      "Full-payload hover & high-wind resistance",
      "Automated Return-to-Home fail-safe drills",
      "Micron atomization & swath verification"
    ],
  },
  {
    id: "06",
    title: "DELIVERY",
    subtitle: "Secure Packaging & Support",
    description: "Field-ready drones packaged with full documentation and pan-India SLA.",
    image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=800&q=80&fm=webp",
    caption: "Secure Packaging & Global Delivery",
    pointers: [
      "Shockproof heavy-duty flight case packaging",
      "DGCA pilot handbook & maintenance logs",
      "Direct Hyderabad factory-to-farm dispatch"
    ],
  },
];

export const capabilities = [
  {
    icon: "lab",
    title: "In-House R&D",
    description: "Innovation at our core",
    pointers: [
      "Proprietary aerodynamic airframes",
      "RTK guidance & custom flight logic"
    ],
  },
  {
    icon: "precision",
    title: "Precision Build",
    description: "Advanced Manufacturing",
    pointers: [
      "Aerospace CNC 7075 & 3K carbon",
      "IP67 chemical-resistant enclosures"
    ],
  },
  {
    icon: "test",
    title: "Tested for Extremes",
    description: "Reliable in every condition",
    pointers: [
      "48°C heat & heavy monsoon validated",
      "500,000+ field acres across India"
    ],
  },
  {
    icon: "support",
    title: "Support & Training",
    description: "Always with you",
    pointers: [
      "Pan-India 48-hr spare dispatch SLA",
      "Certified drone pilot operator courses"
    ],
  },
];
