import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ChevronRight, ChevronDown, Zap, Sprout, Building2, HelpCircle, Check, CheckCircle2, RotateCcw } from "lucide-react";
import DroneViewer from "../components/three/DroneViewer";
import Drone360Viewer from "../components/common/Drone360Viewer";
import SEO from "../components/common/SEO";
import { assetUrl } from "../utils/assets";

const boundaryMetrics = [
  { value: "3+", label: "PLATFORMS", pointer: "Purpose-built agricultural & utility systems" },
  { value: "₹20", label: "BATTERY / ACRE*", pointer: "Ultra-low operating electricity cost" },
  { value: "₹50", label: "MAINTENANCE / ACRE*", pointer: "Designed for affordable field upkeep" },
  { value: "Up to 2 Yrs", label: "WARRANTY", pointer: "Verified manufacturer warranty" },
  { value: "80%", label: "MADE IN INDIA", pointer: "Indigenously engineered in Hyderabad" },
];

const cropList = [
  {
    name: "Tea",
    tagline: "Dense Canopy",
    icon: "🍃",
    pointers: [
      "Low-altitude under-canopy micro misting",
      "Zero field-hand fatigue or hazard",
      "Uniform foliar disease protection"
    ],
    highlight: "Precision foliar coverage"
  },
  {
    name: "Arecanut",
    tagline: "Tall Palms",
    icon: "🌴",
    pointers: [
      "Reaches 60ft tree crowns from above",
      "Eliminates tree-climbing falls & danger",
      "Direct crown borers & rot prevention"
    ],
    highlight: "100% climbing hazard free"
  },
  {
    name: "Sugarcane",
    tagline: "Dense Stalks",
    icon: "🎋",
    pointers: [
      "Penetrates 12ft high growth rows",
      "Deep canopy penetration to root zones",
      "Zero stalk breakage from ground rigs"
    ],
    highlight: "Deep row penetration"
  },
  {
    name: "Rice",
    tagline: "Paddies",
    icon: "🌾",
    pointers: [
      "Glides over flooded muddy paddies",
      "100% dry-foot aerial application",
      "Uniform swath without soil compaction"
    ],
    highlight: "Zero mud tramping"
  },
  {
    name: "Maize",
    tagline: "Tall Stands",
    icon: "🌽",
    pointers: [
      "RTK precision tassel-to-leaf coverage",
      "Fall armyworm targeted spraying",
      "Full coverage at peak crop height"
    ],
    highlight: "Tassel & leaf protection"
  },
  {
    name: "Banana",
    tagline: "Broad Leaf",
    icon: "🍌",
    pointers: [
      "Axil-targeted misting without leaf tear",
      "Controls Sigatoka leaf spot disease",
      "High canopy penetration efficiency"
    ],
    highlight: "Leaf-axil targeted"
  },
  {
    name: "Orchards",
    tagline: "Fruit Groves",
    icon: "🍎",
    pointers: [
      "Tree-by-tree variable flow adjustment",
      "360° fruit cluster coverage",
      "Targeted micro-droplet canopy deposition"
    ],
    highlight: "Tree-aware variable flow"
  },
];

const impactStats = [
  { value: "3+", label: "DRONE PLATFORMS", pointer: "Purpose-built agricultural & utility systems" },
  { value: "80%", label: "MADE IN INDIA", pointer: "Indigenously engineered in Hyderabad" },
  { value: "Up to 2 Yrs", label: "WARRANTY", pointer: "Manufacturer warranty on all platforms" },
  { value: "100%", label: "IN-HOUSE BUILD", pointer: "Complete chassis and electronics assembly" },
];

const featuredDrones = [
  {
    name: "Agrown-10X",
    slug: "agrown-10x",
    category: "Precision Agriculture",
    badge: "MEDIUM CLASS",
    image: "/drones-360/10x-sprayer/smooth_01.webp",
    pointers: [
      "10 Litres Quick-Release Tank",
      "10 kg Granular Hopper Capability",
      "Aerospace Folding Carbon Arms",
      "RTK Centimeter Guidance"
    ],
  },
  {
    name: "Agrown-10X Super Compact",
    slug: "agrown-10x-super-compact",
    category: "Compact Agriculture",
    badge: "SMALL CLASS",
    image: "/drones-360/5x-sprayer/smooth_01.webp",
    pointers: [
      "5 Litres Compact Sprayer",
      "Single-Operator Rapid Deployment",
      "Farm-Tough Metal DNA Chassis",
      "Quick-Swap Intelligent Battery"
    ],
  },
  {
    name: "Graydon",
    slug: "graydon",
    category: "Multi-Payload Utility",
    badge: "MULTI-PAYLOAD",
    image: "/drones-360/greaydon-base/smooth_01.webp",
    pointers: [
      "25–30 kg Industrial Payload Muscle",
      "India's First 360° Obstacle-Sensing",
      "Universal Quick-Mount Payload Rail",
      "Up to 2 Years Warranty"
    ],
  },
];

const liveExperienceFeatures = [
  { id: "spray", label: "SPRAY SYSTEM" },
  { id: "frame", label: "ROAD-READY FRAME" },
  { id: "battery", label: "SMART BATTERY" },
  { id: "radar", label: "OBSTACLE RADAR" },
  { id: "motors", label: "HIGH-TORQUE MOTORS" },
];

const componentDetails: Record<string, { title: string; spec: string; pointers: string[] }> = {
  "Spray System": {
    title: "Atomized Precision Spray Nozzles",
    spec: "10L to 30L Payload Tanks",
    pointers: [
      "130–250 micron atomized droplets",
      "Zero-drip anti-leak shutoff valves",
      "Calibrated atomized droplet deposition"
    ],
  },
  "Road-Ready Frame": {
    title: "Aerospace Folding Airframe",
    spec: "3K Carbon & Aviation Alloy",
    pointers: [
      "Folds into compact footprint in 30 seconds",
      "Easy transport on bikes, tractors, or pickups",
      "Monsoon rain & summer heat hardened"
    ],
  },
  "Smart Battery": {
    title: "Fast-Charging Smart Battery Pack",
    spec: "₹20 Running Cost / Acre",
    pointers: [
      "High-density smart cells with thermal control",
      "15–20 minute rapid turnaround",
      "Long-cycle durability across 1000+ charges"
    ],
  },
  "Obstacle Radar": {
    title: "Active Terrain & Obstacle Radar",
    spec: "Millimeter-Wave RTK Positioning",
    pointers: [
      "Real-time terrain following over slopes",
      "Detects power lines, trees, and obstacles",
      "Autonomous return-to-home fail-safe"
    ],
  },
  "High-Torque Motors": {
    title: "Weather-Sealed Brushless Motors",
    spec: "IP67 Ingress Protection",
    pointers: [
      "Heavy-lift brushless propulsion units",
      "Dust-proof, water-washable, chemical-sealed",
      "Optimized downwash pushes mist into canopy"
    ],
  },
};

const homeFaqs = [
  {
    q: "What is the operating cost per acre with GoAG drones?",
    pointers: [
      "Battery Charging: ₹20 / acre average (typical values, vary with crop & conditions)",
      "Routine Maintenance: ₹50 / acre scheduled upkeep",
      "Droplet Control: Micro-atomization for targeted canopy deposition"
    ],
  },
  {
    q: "What product platforms does GoAG manufacture?",
    pointers: [
      "Agrown-10X: Purpose-built 10L spraying and 10kg spreading medium platform",
      "Agrown-10X Super Compact: Ultra-portable small class agricultural drone",
      "Graydon: Heavy-lift multi-payload utility platform with 360° obstacle sensing"
    ],
  },
  {
    q: "Are GoAG drones eligible for government subsidies and FPO schemes?",
    pointers: [
      "Subsidies: Eligible under SMAM, Sub-Mission on Agri Mechanization",
      "FPO Benefits: Dedicated allotments, custom co-branding, pilot training",
      "Make in India: 80% Made in India engineered in Hyderabad"
    ],
  },
  {
    q: "Which crops are compatible with GoAG precision spraying?",
    pointers: [
      "Field Crops: Rice/Paddy, Wheat, Sugarcane, Maize, Cotton",
      "Plantations: Tea bushes, Tall Arecanut palms, Banana groves",
      "Orchards: Mango, Pomegranate, Citrus, Apple groves"
    ],
  },
  {
    q: "What warranty and spare parts support is provided?",
    pointers: [
      "Warranty: Up to 2 years manufacturer warranty",
      "Hyderabad Hub: Direct manufacturer supply with local spare inventory",
      "DGCA certified operations and field deployment engineering"
    ],
  },
];

export default function Home() {
  const [activeCrop, setActiveCrop] = useState(0);
  const [activeFeature, setActiveFeature] = useState("Spray System");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div ref={containerRef} className="bg-[#070c08] text-[#f3f4f6] min-h-screen">
      <SEO
        title="GoAG Services | Precision UAV & Drone Manufacturer Hyderabad"
        description="Indian UAV manufacturer of agricultural spraying drones, multi-payload utility drones, and custom unmanned systems. 80% Made in India with up to 2 years warranty."
        canonical="/"
      />

      {/* ── HERO SECTION ─────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-16"
        aria-label="GoAG Hero"
      >
        <motion.div className="absolute inset-0 pointer-events-none" style={{ y: heroY }}>
          <img
            src="https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1920&q=75&fm=webp"
            alt="GoAG Precision Agriculture Drone in flight"
            className="w-full h-full object-cover"
            style={{ opacity: 0.35 }}
          />
          <div className="absolute inset-0 bg-[#070c08]/85" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070c08] via-transparent to-[#070c08]" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 px-6 lg:px-16 max-w-7xl mx-auto w-full py-6"
          style={{ opacity: heroOpacity }}
        >
          {/* Top Tag */}
          <div className="mb-5">
            <span className="text-label text-[#fbbf24] bg-[#0e1610]/95 px-3.5 py-1.5 border border-[#f59e0b]/40 backdrop-blur-md rounded-full inline-flex items-center gap-2 shadow-lg text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
              BUILT IN INDIA · 80% INDIGENOUS CONTENT · HYDERABAD HQ
            </span>
          </div>

          {/* Main Headline */}
          <motion.h1
            className="font-extrabold text-[#f3f4f6] tracking-tight leading-[1.08] mb-6"
            style={{
              fontSize: "clamp(2.4rem, 5.2vw, 4.8rem)",
              letterSpacing: "-0.035em",
            }}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            TURN EVERY ACRE INTO PROFIT
            <br />
            <span className="text-gradient-green">WITH PRECISION DRONE SPRAYING.</span>
          </motion.h1>

          {/* Highlight Pointer Pills */}
          <div className="flex flex-wrap items-center gap-2.5 mb-8">
            {[
              "80% Made in India",
              "India's First 360° Obstacle-Sensing",
              "₹20 / Acre Running Cost*",
              "Up to 2 Years Warranty",
              "DGCA certified"
            ].map((pt) => (
              <span
                key={pt}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-white/5 border border-white/10 text-white/90 backdrop-blur-md"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" />
                {pt}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/products"
              id="hero-explore-btn"
              className="btn-amber px-8 py-3.5 inline-flex items-center gap-2 rounded-lg text-xs font-mono font-bold tracking-wider shadow-lg shadow-[#f59e0b]/20"
            >
              <span>EXPLORE FLEET</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/drone-360"
              className="btn-outline px-6 py-3.5 inline-flex items-center gap-2 rounded-lg text-xs font-mono font-bold tracking-wider border-green-500/40 text-green-400 hover:bg-green-500/10"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>360° DRONE STUDIO</span>
            </Link>
            <Link
              to="/build-your-drone"
              id="hero-config-btn"
              className="btn-outline px-6 py-3.5 inline-flex items-center gap-2 rounded-lg text-xs font-mono font-semibold tracking-wider"
            >
              <span>CUSTOM BUILDER</span>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── METRICS STRIP (POINTER STYLE) ───────────────────────────────────── */}
      <section
        className="relative py-14 border-y border-white/10 bg-[#090f0b]"
        aria-label="Agri drone boundary metrics"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div className="text-label text-[#22c55e] font-mono font-bold flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
              KEY OPERATIONAL BENCHMARKS
            </div>
            <div className="text-xs font-mono text-white/40 hidden sm:block">
              HYDERABAD AEROSPACE R&D
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {boundaryMetrics.map((m) => (
              <div
                key={m.label}
                className="p-5 bg-[#0e1610] border border-white/10 rounded-xl hover:border-[#22c55e]/50 transition-colors shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="text-[#fbbf24] font-bold text-3xl font-mono mb-1">
                    {m.value}
                  </div>
                  <div className="text-[11px] font-mono text-white/80 font-bold uppercase tracking-wider mb-2">
                    {m.label}
                  </div>
                </div>
                <div className="text-[11px] font-mono text-[#9ca3af] pt-2 border-t border-white/5 flex items-start gap-1">
                  <span className="text-[#22c55e]">•</span>
                  <span>{m.pointer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUITED FOR EVERY CROP (POINTER & VISUAL) ─────────────────────────── */}
      <section className="py-20 px-6 lg:px-16 bg-[#070c08] border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-label text-[#f59e0b] mb-2 flex items-center gap-2 font-mono text-xs">
                <Sprout className="w-3.5 h-3.5 text-[#22c55e]" />
                CUSTOM SPRAY PROFILES
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                SUITED FOR EVERY INDIAN CROP
              </h2>
            </div>
            <div className="text-xs font-mono text-white/50">
              SELECT CROP TO VIEW HIGHLIGHTS
            </div>
          </div>

          {/* Crop Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-8">
            {cropList.map((crop, index) => (
              <button
                key={crop.name}
                onClick={() => setActiveCrop(index)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  activeCrop === index
                    ? "bg-green-500/15 border-[#22c55e] text-[#fbbf24] shadow-lg shadow-green-500/10"
                    : "bg-[#0e1610] border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="text-2xl mb-1">{crop.icon}</div>
                <div className="font-bold text-xs font-mono">{crop.name}</div>
              </button>
            ))}
          </div>

          {/* Active Crop Pointer Banner */}
          <div className="p-6 lg:p-8 border border-white/15 rounded-2xl bg-[#0e1610] shadow-2xl grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] text-xs font-mono font-bold rounded-full">
                  {cropList[activeCrop].name} Profile
                </span>
                <span className="text-xs font-mono text-[#fbbf24]">
                  ★ {cropList[activeCrop].highlight}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                Precision Spray Strategy
              </h3>

              {/* Bullet Pointers */}
              <div className="space-y-2.5 mb-4">
                {cropList[activeCrop].pointers.map((pt) => (
                  <div key={pt} className="flex items-center gap-2 text-sm text-white/80 font-mono">
                    <Check className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 bg-[#070c08] border border-white/10 rounded-xl space-y-3 font-mono">
              <div className="text-[10px] text-[#9ca3af] uppercase">COMPATIBLE PLATFORMS</div>
              <div className="text-base font-bold text-white">Agrown-x & Agrown-x Pro</div>
              <div className="text-xs text-white/60 space-y-1 pt-2 border-t border-white/5">
                <div>• RTK centimeter swath guidance</div>
                <div>• Downward wash prop airflow</div>
                <div>• Micron atomized misting</div>
              </div>
              <Link
                to="/products/agrown-x"
                className="btn-amber w-full py-2.5 block text-center rounded-lg text-xs font-bold font-mono mt-3"
              >
                VIEW PLATFORM SPECS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BUILT IN INDIA: VISUAL & POINTER HIGHLIGHTS ──────────────────────── */}
      <section className="py-20 px-6 lg:px-16 border-b border-white/10 bg-[#090f0b]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-label text-[#22c55e] mb-2 font-mono font-bold text-xs">MANUFACTURING PHILOSOPHY</div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-6">
              BUILT IN INDIA. <span className="text-gradient-green">BUILT FOR INDIA.</span>
            </h2>

            {/* Pointers List */}
            <div className="space-y-3.5 mb-8">
              {[
                { title: "80% Indigenous Indian Content", desc: "Engineered, fabricated, and calibrated in Hyderabad R&D facility." },
                { title: "Monsoon & Summer Heat Hardened", desc: "IP67 weather-sealed against chemical mist, dust, and heavy rains." },
                { title: "₹20 Running Cost / Acre", desc: "High-density smart battery cells deliver ultra-low operating overhead." },
                { title: "2-Year Manufacturer Warranty", desc: "Pan-India spare parts dispatched immediately with zero import delays." }
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-white">{item.title}</div>
                    <div className="text-xs text-white/50 font-mono mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link to="/how-it-works" className="btn-amber px-6 py-3 rounded-lg text-xs font-mono font-bold">
                VIEW MANUFACTURING PLANT
              </Link>
              <Link to="/contact" className="btn-outline px-6 py-3 rounded-lg text-xs font-mono font-semibold">
                REQUEST TECHNICAL AUDIT
              </Link>
            </div>
          </div>

          {/* Picture Speaking For Itself */}
          <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-2xl group">
            <img
              src={assetUrl("/high-building-cleaning.jpeg")}
              alt="GoAG aerospace drone hardware testing"
              className="w-full h-[440px] object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/75 backdrop-blur-md rounded-xl border border-white/15">
              <div className="text-xs font-mono text-[#22c55e] font-bold mb-1">HYDERABAD AEROSPACE FACILITY</div>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-white/80">
                <span className="px-2 py-0.5 rounded bg-white/10">• CNC 7075 Aluminum</span>
                <span className="px-2 py-0.5 rounded bg-white/10">• 3K Twill Carbon</span>
                <span className="px-2 py-0.5 rounded bg-white/10">• Dual RTK GPS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3D TELEMETRY SUBSYSTEM EXPLORER ───────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden bg-[#070c08]" aria-label="Subsystem telemetry">
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16">
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="text-label text-[#22c55e] mb-2 flex items-center gap-2 font-mono text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                HARDWARE BREAKDOWN
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                INNOVATION IN FLIGHT & SUBSYSTEMS
              </h2>
            </div>
            <Link
              to="/products/agrown-x"
              className="btn-amber px-6 py-2.5 inline-flex items-center gap-2 rounded-lg text-xs font-mono font-bold"
            >
              <span>AGROWN-X SPECS</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-6 items-start">
            {/* Left: Selector */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-[#f59e0b] mb-3 tracking-widest uppercase">SELECT MODULE</div>
              {liveExperienceFeatures.map((feat) => {
                const labelMap: Record<string, string> = {
                  "SPRAY SYSTEM": "Spray System",
                  "ROAD-READY FRAME": "Road-Ready Frame",
                  "SMART BATTERY": "Smart Battery",
                  "OBSTACLE RADAR": "Obstacle Radar",
                  "HIGH-TORQUE MOTORS": "High-Torque Motors",
                };
                const matchedKey = labelMap[feat.label] || "Spray System";
                const isSelected = activeFeature === matchedKey;
                return (
                  <button
                    key={feat.id}
                    onClick={() => setActiveFeature(matchedKey)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left font-mono text-xs transition-all ${
                      isSelected
                        ? "border-[#f59e0b] bg-amber-500/10 text-[#fbbf24] font-bold"
                        : "border-white/10 bg-[#0e1610] text-white/60 hover:text-white"
                    }`}
                  >
                    <span>{feat.label}</span>
                    <div className="w-2 h-2 rounded-full" style={{ background: isSelected ? "#f59e0b" : "#22c55e" }} />
                  </button>
                );
              })}
            </div>

            {/* Middle: 3D Canvas */}
            <div className="relative border border-white/15 rounded-xl overflow-hidden bg-[#050906] h-[460px] shadow-2xl">
              <DroneViewer key={activeFeature} autoRotate />
            </div>

            {/* Right: Compact Pointers Panel */}
            <div className="p-6 border border-white/15 rounded-xl bg-[#0e1610] shadow-xl space-y-4 font-mono">
              <div className="text-[10px] text-[#22c55e] font-bold uppercase tracking-wider">SUBSYSTEM HIGHLIGHTS</div>
              <h3 className="text-lg font-bold text-white">{componentDetails[activeFeature]?.title}</h3>
              <div className="text-xs text-[#fbbf24] font-bold px-2.5 py-1 bg-white/5 rounded border border-white/5 inline-block">
                SPEC: {componentDetails[activeFeature]?.spec}
              </div>

              {/* 3 Bullet Pointers */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                {componentDetails[activeFeature]?.pointers.map((pt) => (
                  <div key={pt} className="flex items-start gap-2 text-xs text-white/70">
                    <span className="text-[#22c55e]">•</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/5 space-y-1.5 text-[11px] text-white/40">
                <div className="flex justify-between">
                  <span>FACILITY:</span>
                  <span className="text-white/80">HYDERABAD HQ</span>
                </div>
                <div className="flex justify-between">
                  <span>STANDARD:</span>
                  <span className="text-[#22c55e]">DGCA / ISO 9001</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR FEATURED DRONES (VISUAL-FIRST & POINTERS) ───────────────────── */}
      <section className="py-20 px-6 lg:px-16 border-t border-white/10 bg-[#090f0b]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-label text-[#f59e0b] mb-2 font-mono font-bold text-xs">FLAGSHIP MODELS</div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                OUR FEATURED DRONES
              </h2>
            </div>
            <Link
              to="/products"
              className="text-xs font-mono text-[#fbbf24] hover:text-[#f59e0b] inline-flex items-center gap-1 font-bold"
            >
              VIEW ALL FLEET MODELS →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDrones.map((drone) => (
              <div
                key={drone.slug}
                className="group p-5 border border-white/10 bg-[#0e1610] rounded-xl hover:border-[#22c55e]/50 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono text-[#22c55e] px-2 py-0.5 bg-[#22c55e]/10 border border-[#22c55e]/25 rounded">
                      {drone.category}
                    </span>
                    <span className="text-[10px] font-mono text-[#fbbf24] font-bold">
                      {drone.badge}
                    </span>
                  </div>

                  {/* Visual Picture */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-black/40 mb-4 border border-white/5">
                    <img
                      src={assetUrl(drone.image)}
                      alt={drone.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 text-white font-bold text-lg font-mono">
                      {drone.name}
                    </div>
                  </div>

                  {/* Pointer Highlights */}
                  <div className="space-y-1.5 mb-6 font-mono text-xs text-white/80">
                    {drone.pointers.map((p) => (
                      <div key={p} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#22c55e] flex-shrink-0" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compact Actions */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5">
                  <Link
                    to={`/products/${drone.slug}`}
                    className="btn-outline py-2.5 text-center text-xs font-mono font-bold rounded-lg"
                  >
                    SPECS
                  </Link>
                  <Link
                    to="/drone-360"
                    className="btn-amber py-2.5 inline-flex items-center justify-center gap-1.5 text-xs font-mono font-bold rounded-lg"
                  >
                    <RotateCcw className="w-3 h-3" />
                    360° VIEW
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 360° INTERACTIVE DRONE STUDIO ───────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-16 border-t border-white/10 bg-[#060a07] relative overflow-hidden" aria-label="360 Drone Studio">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-white/10 pb-6">
            <div>
              <div className="text-label text-[#22c55e] mb-2 flex items-center gap-2 font-bold font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                360° REAL PRODUCT VIEW
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                INSPECT OUR DRONES IN FULL 360°
              </h2>
            </div>
            <Link
              to="/drone-360"
              className="btn-amber px-5 py-2.5 rounded-lg inline-flex items-center gap-2 text-xs font-mono font-bold"
            >
              <span>FULLSCREEN STUDIO</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Drone360Viewer
            initialDroneId="10x-sprayer"
            showModelPicker={true}
            showSpecsPanel={true}
          />
        </div>
      </section>

      {/* ── OUR PROVEN IMPACT (POINTER METRICS) ──────────────────────────────── */}
      <section className="py-16 border-t border-white/10 bg-[#070c08]">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {impactStats.map((stat) => (
              <div key={stat.label} className="p-5 border border-white/10 bg-[#0e1610] rounded-xl shadow-md">
                <div className="text-3xl lg:text-4xl font-bold text-[#fbbf24] font-mono mb-1">
                  {stat.value}
                </div>
                <div className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-2">
                  {stat.label}
                </div>
                <div className="text-[11px] font-mono text-[#9ca3af] flex items-center gap-1">
                  <span className="text-[#22c55e]">•</span>
                  <span>{stat.pointer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXCLUSIVE CAMPAIGNS (POINTER CARDS) ──────────────────────────────── */}
      <section className="py-20 px-6 lg:px-16 border-t border-white/10 bg-[#090f0b]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FPO Campaign */}
          <div className="p-6 lg:p-8 border border-[#f59e0b]/40 bg-[#0e1610] rounded-xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="text-label text-[#f59e0b] mb-3 font-bold font-mono text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
                FPO ALLOTMENTS & DISCOUNTS
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Special Program for Farmer Organizations (FPO)
              </h3>
              <div className="space-y-2.5 mb-6 font-mono text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                  <span>Priority allotment on Agrown-x & Agrown-x Pro</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                  <span>Free pilot operator certification & training support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                  <span>Direct subsidized spare parts supply & SLA support</span>
                </div>
              </div>
            </div>
            <Link
              to="/contact"
              className="btn-amber py-3 px-6 text-center text-xs font-mono font-bold rounded-lg inline-block"
            >
              CLAIM FPO PRICING
            </Link>
          </div>

          {/* Partner With Us */}
          <div className="p-6 lg:p-8 border border-white/15 bg-[#0e1610] rounded-xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="text-label text-[#22c55e] mb-3 font-bold font-mono text-xs flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-[#22c55e]" />
                PAN-INDIA DEALER NETWORK
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Partner as a Certified Distributor
              </h3>
              <div className="space-y-2.5 mb-6 font-mono text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#fbbf24] flex-shrink-0" />
                  <span>High distributor & dealership profit margins</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#fbbf24] flex-shrink-0" />
                  <span>Full technical backing from Hyderabad aerospace engineers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#fbbf24] flex-shrink-0" />
                  <span>Co-branded field demonstration and marketing collateral</span>
                </div>
              </div>
            </div>
            <Link
              to="/contact"
              className="btn-outline py-3 px-6 text-center text-xs font-mono font-bold rounded-lg inline-block"
            >
              BECOME A PARTNER
            </Link>
          </div>
        </div>
      </section>

      {/* ── FREQUENTLY ASKED QUESTIONS (POINTER STYLE) ───────────────────────── */}
      <section className="py-20 px-6 lg:px-16 border-t border-white/10 bg-[#070c08]" aria-label="Frequently Asked Questions">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-label text-[#22c55e] mb-2 font-mono font-bold text-xs flex items-center justify-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-[#22c55e]" />
              FAQ QUICK GUIDE
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              KEY QUESTIONS & FACTS
            </h2>
          </div>

          <div className="space-y-3">
            {homeFaqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="border rounded-xl transition-all duration-200 overflow-hidden"
                  style={{
                    borderColor: isOpen ? "#f59e0b" : "rgba(255, 255, 255, 0.1)",
                    background: isOpen ? "rgba(14, 22, 16, 0.95)" : "#0e1610",
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className="w-4 h-4 text-[#fbbf24] flex-shrink-0 transition-transform duration-200"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-white/5 pt-3 space-y-1.5 font-mono text-xs text-white/80">
                      {faq.pointers.map((p) => (
                        <div key={p} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#22c55e] flex-shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center p-4 border border-white/10 bg-[#0e1610] rounded-xl font-mono text-xs text-white/60">
            Have questions about your specific crop or state subsidy?{" "}
            <Link to="/contact" className="text-[#fbbf24] font-bold hover:underline">
              Speak with our engineers →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
