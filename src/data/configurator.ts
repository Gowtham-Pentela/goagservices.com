export type IndustryType = "agriculture" | "other";

export interface ConfigOption {
  id: string;
  label: string;
  subLabel?: string;
  description?: string;
  industry?: IndustryType;
  simAction?: string;
  specImpact: {
    payload?: string;
    flightTime?: string;
    range?: string;
    priceAdder?: number;
  };
}

export interface ConfigSection {
  id: string;
  label: string;
  options: ConfigOption[];
}

// ── Application/Payload Sub-options ──────────────────────────────────────────
export const agriculturePayloads: ConfigOption[] = [
  {
    id: "sprayer",
    label: "Sprayer",
    subLabel: "Crop Protection & Liquid Fertilizing",
    description: "High-pressure atomizing nozzles with 10L/16L tank for precision droplet swath spraying over maize and row crops.",
    industry: "agriculture",
    simAction: "spraying",
    specImpact: { payload: "16 L Liquid", flightTime: "26 Min", range: "2 km", priceAdder: 0 },
  },
  {
    id: "spreader",
    label: "Spreader",
    subLabel: "Granular Fertilizer & Seed Broadcasting",
    description: "High-speed centrifugal broadcast spinner for urea, DAP, solid seeds, and micro-nutrients across agricultural fields.",
    industry: "agriculture",
    simAction: "spreading",
    specImpact: { payload: "16 kg Granules", flightTime: "24 Min", range: "2 km", priceAdder: 25000 },
  },
];

export const otherPayloads: ConfigOption[] = [
  {
    id: "solar-cleaning",
    label: "Solar Cleaning",
    subLabel: "Photovoltaic Panel Washing System",
    description: "Pressurized dual spray wash bar and soft guidance kit designed to clean dust and bird droppings off large solar panel arrays.",
    industry: "other",
    simAction: "solar-cleaning",
    specImpact: { payload: "12 L Wash Fluid", flightTime: "28 Min", range: "3 km", priceAdder: 85000 },
  },
  {
    id: "high-rise-cleaning",
    label: "High Rise Building Cleaning",
    subLabel: "Skyscraper Glass & Facade Pressure Wash",
    description: "Tethered high-altitude cleaning nozzle system for urban skyscrapers and architectural glass facades with wind stabilization.",
    industry: "other",
    simAction: "high-rise-cleaning",
    specImpact: { payload: "High-Pressure Wand", flightTime: "35 Min", range: "2 km", priceAdder: 145000 },
  },
  {
    id: "flower-dropping",
    label: "Flower Dropping",
    subLabel: "Ceremonial & Festival Petal Dispersion",
    description: "Automated rotary carousel mechanism for showering marigold and rose flower petals over temples, events, and festive rallies.",
    industry: "other",
    simAction: "flower-dropping",
    specImpact: { payload: "8 kg Petals", flightTime: "30 Min", range: "2 km", priceAdder: 35000 },
  },
  {
    id: "hologram",
    label: "Hologram",
    subLabel: "Volumetric Aerial 3D Light Display",
    description: "High-lumen synchronized aerial laser and volumetric spinning 3D holographic projection pod for nocturnal light shows.",
    industry: "other",
    simAction: "hologram",
    specImpact: { payload: "3D Hologram Projector", flightTime: "22 Min", range: "2 km", priceAdder: 195000 },
  },
  {
    id: "screen",
    label: "Screen",
    subLabel: "Suspended Sky Digital LED Billboard",
    description: "Ultralight double-sided high-nit LED matrix panel displaying animated graphics, text, and emergency notifications in the sky.",
    industry: "other",
    simAction: "screen",
    specImpact: { payload: "LED Matrix Display", flightTime: "20 Min", range: "2 km", priceAdder: 165000 },
  },
  {
    id: "winch-mechanism",
    label: "Winch Mechanism",
    subLabel: "Remote Cargo Delivery & Cable Tether",
    description: "Motorized 20m high-tensile cable winch with auto-release cargo hook for precision logistics in remote, rough, or flood terrain.",
    industry: "other",
    simAction: "winch",
    specImpact: { payload: "15 kg Cargo Winch", flightTime: "28 Min", range: "5 km", priceAdder: 110000 },
  },
  {
    id: "thermal-fogger",
    label: "Thermal Fogger",
    subLabel: "Vector Control & Orchard Smoke Fumigation",
    description: "High-temperature pulse-jet thermal aerosol fogger dispersing dense smoke clouds for orchard pest eradication and municipal vector control.",
    industry: "other",
    simAction: "thermal-fogger",
    specImpact: { payload: "Thermal Fog Generator", flightTime: "24 Min", range: "3 km", priceAdder: 95000 },
  },
  {
    id: "seed-ball",
    label: "Seed Ball Dropping Kit",
    subLabel: "Aerial Reforestation & Afforestation",
    description: "Pneumatic multi-tube seed-ball dispenser firing nutrient-coated bio-seed balls into degraded soil and remote forest hillsides.",
    industry: "other",
    simAction: "seed-ball",
    specImpact: { payload: "500 Seed Balls", flightTime: "32 Min", range: "4 km", priceAdder: 65000 },
  },
];

export const allPayloadOptions: Record<IndustryType, ConfigOption[]> = {
  agriculture: agriculturePayloads,
  other: otherPayloads,
};

export const configuratorSections: ConfigSection[] = [
  {
    id: "industry",
    label: "INDUSTRY SELECTION",
    options: [
      { id: "agriculture", label: "Agriculture", subLabel: "Maize, Paddy & Farm Operations", specImpact: { payload: "16 L", flightTime: "26 Min", range: "2 km", priceAdder: 0 } },
      { id: "other", label: "Other", subLabel: "Specialized Industrial & Aerial Applications", specImpact: { payload: "Specialized Kit", flightTime: "28 Min", range: "3 km", priceAdder: 40000 } },
    ],
  },
  {
    id: "payload",
    label: "MISSION APPLICATION & PAYLOAD",
    options: [...agriculturePayloads, ...otherPayloads],
  },
  {
    id: "battery",
    label: "BATTERY CAPACITY",
    options: [
      { id: "bat-12s", label: "14S 12000mAh", subLabel: "Standard Flight Pack", specImpact: { flightTime: "20 Min", priceAdder: 0 } },
      { id: "bat-16s", label: "14S 16800mAh", subLabel: "High-Endurance LiPo", specImpact: { flightTime: "28 Min", priceAdder: 18000 } },
      { id: "bat-22s", label: "14S 22000mAh", subLabel: "Maximum Heavy-Lift Pack", specImpact: { flightTime: "38 Min", priceAdder: 32000 } },
    ],
  },
  {
    id: "camera",
    label: "OPTICAL SENSORS & TELEMETRY",
    options: [
      { id: "fpv", label: "HD FPV Pilot Camera", subLabel: "Low-latency flight feed", specImpact: { priceAdder: 0 } },
      { id: "4k-rgb", label: "4K RGB Stabilized Gimbal", subLabel: "Inspection & aerial recording", specImpact: { priceAdder: 45000 } },
      { id: "360-ir", label: "Dual Thermal + EO Optics", subLabel: "Day/night thermal monitoring", specImpact: { priceAdder: 85000 } },
    ],
  },
  {
    id: "range",
    label: "CONTROL & TELEMETRY LINK",
    options: [
      { id: "range-2", label: "2 KM Link", subLabel: "Line-of-Sight Standard", specImpact: { range: "2 km", priceAdder: 0 } },
      { id: "range-5", label: "5 KM Link", subLabel: "Extended Range Transceiver", specImpact: { range: "5 km", priceAdder: 28000 } },
      { id: "range-10", label: "10 KM Long-Range Link", subLabel: "Dual-redundant frequency hopping", specImpact: { range: "10 km", priceAdder: 65000 } },
    ],
  },
  {
    id: "color",
    label: "AIRFRAME FINISH",
    options: [
      { id: "black", label: "Stealth Obsidian Carbon", specImpact: { priceAdder: 0 } },
      { id: "matte-grey", label: "Industrial Matte Grey", specImpact: { priceAdder: 2000 } },
      { id: "olive", label: "Bio Olive Green", specImpact: { priceAdder: 2000 } },
      { id: "white", label: "Arctic White", specImpact: { priceAdder: 2000 } },
    ],
  },
];

export const basePrice = 485000; // INR

