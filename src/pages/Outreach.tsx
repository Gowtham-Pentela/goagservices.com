import { useState } from "react";
import { motion } from "motion/react";
import { Navigation, ShieldCheck, Truck, Users, ChevronRight, Check } from "lucide-react";
import SEO from "../components/common/SEO";

// State data with Hyderabad HQ as central hub
const hyderabadHQ = { id: "HYD", name: "Hyderabad Headquarters", cx: 245, cy: 325, isHQ: true };

const supplyNodes = [
  { id: "MH", name: "Maharashtra (Pune & Nagpur Hubs)", dronesDeployed: 850, farmersReached: 12500, cx: 205, cy: 310, region: "West" },
  { id: "PB", name: "Punjab (Ludhiana Hub)", dronesDeployed: 620, farmersReached: 9800, cx: 195, cy: 125, region: "North" },
  { id: "AP", name: "Andhra Pradesh (Vijayawada Hub)", dronesDeployed: 540, farmersReached: 8200, cx: 265, cy: 360, region: "South" },
  { id: "TN", name: "Tamil Nadu (Coimbatore Hub)", dronesDeployed: 480, farmersReached: 7100, cx: 250, cy: 425, region: "South" },
  { id: "UP", name: "Uttar Pradesh (Lucknow Hub)", dronesDeployed: 720, farmersReached: 11000, cx: 270, cy: 195, region: "North" },
  { id: "MP", name: "Madhya Pradesh (Indore Hub)", dronesDeployed: 430, farmersReached: 6500, cx: 240, cy: 260, region: "Central" },
  { id: "RJ", name: "Rajasthan (Jaipur Hub)", dronesDeployed: 380, farmersReached: 5800, cx: 180, cy: 205, region: "West" },
  { id: "HR", name: "Haryana (Karnal Hub)", dronesDeployed: 410, farmersReached: 6200, cx: 210, cy: 155, region: "North" },
  { id: "GJ", name: "Gujarat (Ahmedabad Hub)", dronesDeployed: 370, farmersReached: 5600, cx: 160, cy: 265, region: "West" },
  { id: "KA", name: "Karnataka (Bengaluru Hub)", dronesDeployed: 520, farmersReached: 7800, cx: 230, cy: 390, region: "South" },
  { id: "WB", name: "West Bengal (Kolkata Hub)", dronesDeployed: 340, farmersReached: 5100, cx: 315, cy: 250, region: "East" },
  { id: "AS", name: "Assam (Guwahati Hub)", dronesDeployed: 290, farmersReached: 4200, cx: 360, cy: 190, region: "Northeast" },
];

function SatelliteIndiaMap({ selectedNode, onSelectNode }: { selectedNode: string; onSelectNode: (id: string) => void }) {
  return (
    <div className="relative w-full rounded-sm overflow-hidden border border-white/10 shadow-2xl" style={{ background: "#050906" }}>
      {/* High resolution dark satellite map texture background */}
      <div className="relative w-full aspect-[4/3] lg:aspect-[16/10] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80&fm=webp"
          alt="Satellite map view of India supply network"
          className="w-full h-full object-cover opacity-45 mix-blend-luminosity filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050906] via-[#050906]/50 to-transparent" />
        <div className="absolute inset-0 goag-grid opacity-30 pointer-events-none" />

        {/* SVG Supply Line Overlay */}
        <svg viewBox="0 0 420 520" className="absolute inset-0 w-full h-full">
          {/* Supply beams radiating from Hyderabad HQ to all nodes */}
          {supplyNodes.map((node) => {
            const isSelected = selectedNode === node.id;
            return (
              <g key={`line-${node.id}`}>
                {/* Supply Line Path */}
                <line
                  x1={hyderabadHQ.cx}
                  y1={hyderabadHQ.cy}
                  x2={node.cx}
                  y2={node.cy}
                  stroke={isSelected ? "#fbbf24" : "rgba(34, 197, 94, 0.4)"}
                  strokeWidth={isSelected ? "2.5" : "1"}
                  strokeDasharray={isSelected ? "none" : "4,4"}
                />
                {/* Animated supply particle */}
                <circle r={isSelected ? "3.5" : "2"} fill={isSelected ? "#fbbf24" : "#22c55e"}>
                  <animateMotion
                    path={`M ${hyderabadHQ.cx} ${hyderabadHQ.cy} L ${node.cx} ${node.cy}`}
                    dur={`${2 + (Math.abs(node.cx - hyderabadHQ.cx) % 3)}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* Regional Hub Markers */}
          {supplyNodes.map((node) => {
            const isSelected = selectedNode === node.id;
            return (
              <g
                key={node.id}
                onClick={() => onSelectNode(node.id)}
                className="cursor-pointer group"
              >
                {/* Outer pulse */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={isSelected ? 15 : 8}
                  fill="rgba(245, 158, 11, 0.2)"
                  stroke={isSelected ? "#fbbf24" : "#22c55e"}
                  strokeWidth={isSelected ? "2" : "1"}
                >
                  <animate attributeName="r" values="6;13;6" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.7;0.2;0.7" dur="3s" repeatCount="indefinite" />
                </circle>

                {/* Node Center Dot */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={isSelected ? 6 : 4}
                  fill={isSelected ? "#fbbf24" : "#22c55e"}
                />

                {/* Node Text Label */}
                <text
                  x={node.cx}
                  y={node.cy + 17}
                  textAnchor="middle"
                  fill={isSelected ? "#f3f4f6" : "#9ca3af"}
                  fontSize="9.5"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight={isSelected ? "bold" : "normal"}
                  className="pointer-events-none"
                >
                  {node.name.split(" ")[0]}
                </text>
              </g>
            );
          })}

          {/* HYDERABAD HEADQUARTERS CENTRAL BEACON */}
          <g onClick={() => onSelectNode("HYD")} className="cursor-pointer">
            {/* Radar Scan Beam */}
            <circle
              cx={hyderabadHQ.cx}
              cy={hyderabadHQ.cy}
              r={34}
              fill="rgba(245, 158, 11, 0.1)"
              stroke="#f59e0b"
              strokeWidth="2"
            >
              <animate attributeName="r" values="10;38;10" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* Core HQ Pin */}
            <circle cx={hyderabadHQ.cx} cy={hyderabadHQ.cy} r={8} fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx={hyderabadHQ.cx} cy={hyderabadHQ.cy} r={3} fill="#070c08" />

            {/* Flag Label */}
            <g transform={`translate(${hyderabadHQ.cx - 60}, ${hyderabadHQ.cy - 38})`}>
              <rect width="120" height="22" rx="3" fill="#070c08" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="60" y="15" textAnchor="middle" fill="#fbbf24" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                ★ HYDERABAD HQ
              </text>
            </g>
          </g>
        </svg>

        {/* Map Legend Overlay */}
        <div className="absolute top-4 left-4 p-4 bg-[#070c08]/90 border border-white/10 backdrop-blur-md rounded-sm">
          <div className="text-label-sm text-[#f59e0b] mb-1 font-bold">NATIONAL SUPPLY NETWORK</div>
          <div className="text-[12px] text-[#f3f4f6] font-bold">HYDERABAD COMMAND HQ</div>
          <div className="text-[10.5px] text-[#9ca3af] mt-0.5 font-mono">LAT 17.3850° N · LON 78.4867° E</div>
        </div>

        {/* Real-time Status Badge */}
        <div className="absolute bottom-4 left-4 p-3.5 bg-[#070c08]/90 border border-white/10 backdrop-blur-md rounded-sm flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-ping" />
          <span className="text-label-sm text-[#f3f4f6] font-semibold">ACTIVE NATIONWIDE LOGISTICS DISPATCH</span>
        </div>
      </div>
    </div>
  );
}

export default function Outreach() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("MH");
  const selectedNode = supplyNodes.find((s) => s.id === selectedNodeId) || supplyNodes[0];

  return (
    <div className="min-h-screen" style={{ background: "#070c08" }}>
      <SEO
        title="Our Campaigns, FPO Allotments & National Supply Network | GoAG Services"
        description="Discover GoAG's nationwide drone supply network radiating from Hyderabad to 20+ states. Learn about our exclusive FPO discount schemes, technical whitepapers, and dealer programs."
        keywords="FPO drone discount, agricultural drone campaigns India, drone supply network, Hyderabad drone hub, agricultural drone dealers India, drone spraying case studies"
        canonical="/outreach"
      />
      <div className="h-20" />

      {/* ── HERO BANNER ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-16 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 goag-grid opacity-25 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-5xl"
        >
          <div className="text-label text-[#f59e0b] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
            INDIAN AEROSPACE SUPPLY NETWORK
          </div>
          <h1
            className="font-bold text-[#f3f4f6] mb-5 tracking-tight leading-[1.12]"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
          >
            ENGINEERED IN HYDERABAD.
            <br />
            <span style={{ color: "#22c55e" }}>SUPPLIED ALL OVER INDIA.</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2.5 mt-5">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-white/90">
              • Aerospace Park, Hyderabad Central HQ
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-white/90">
              • 48-Hour Pan-India Spare Dispatch
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-white/90">
              • 150+ Authorized Service Centers
            </span>
          </div>
        </motion.div>
      </section>

      {/* ── NATIONAL IMPACT METRICS STRIP ───────────────────────────────────── */}
      <section className="border-b border-white/10 bg-[#090f0b] py-14 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Navigation, val: "20+ States", label: "ACTIVE SUPPLY COVERAGE" },
            { icon: Truck, val: "5,000+", label: "DRONES DEPLOYED FROM HYD" },
            { icon: Users, val: "150+", label: "AUTHORIZED REGIONAL DEALERS" },
            { icon: ShieldCheck, val: "200+", label: "SKILLING & TRAINING CENTERS" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-7 border border-white/10 rounded-sm bg-[#0e1610] flex items-center gap-5 shadow-lg"
            >
              <div className="w-14 h-14 rounded-full border border-[#f59e0b]/40 bg-[#f59e0b]/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-6 h-6 text-[#fbbf24]" />
              </div>
              <div>
                <div className="text-[24px] font-bold text-[#f3f4f6] font-mono leading-none mb-2">{item.val}</div>
                <div className="text-label text-[#9ca3af] leading-tight">{item.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SATELLITE MAP & HUB SELECTION ───────────────────────────────────── */}
      <section className="px-6 lg:px-16 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-14 items-start">

          {/* Left: Satellite Map */}
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="text-label text-[#22c55e] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                HYDERABAD TO NATIONWIDE DISPATCH ROUTE
              </div>
              <div className="text-label-sm text-[#9ca3af]">CLICK HUB MARKER TO INSPECT</div>
            </div>
            <SatelliteIndiaMap selectedNode={selectedNodeId} onSelectNode={setSelectedNodeId} />
          </div>

          {/* Right: Selected Node Breakdown & Dealer Network */}
          <div className="space-y-7">
            {/* Headquarters Highlight Box */}
            <div className="p-8 border border-[#22c55e]/50 rounded-sm shadow-xl" style={{ background: "#0e1610" }}>
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-9 h-9 rounded-full bg-[#22c55e] flex items-center justify-center text-[#070c08] font-bold text-[14px]">
                  ★
                </div>
                <div>
                  <div className="text-label text-[#22c55e] font-bold">CENTRAL MANUFACTURING HQ</div>
                  <div className="text-[19px] font-bold text-[#f3f4f6]">GoAG HYDERABAD PLANT</div>
                </div>
              </div>
              <div className="space-y-1.5 mb-5 font-mono text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#22c55e] flex-shrink-0" />
                  <span>Located at Aerospace Park, Hyderabad R&D facility</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#fbbf24] flex-shrink-0" />
                  <span>Full CNC machining, carbon curing, and flight testing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#22c55e] flex-shrink-0" />
                  <span>Zero-delay direct supply chain with 80% Indian parts</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 font-mono text-[13px]">
                <div>
                  <span className="text-[#9ca3af] block text-label-sm mb-1">DAILY DISPATCH</span>
                  <span className="text-[#f3f4f6] font-bold">25+ UNITS/DAY</span>
                </div>
                <div>
                  <span className="text-[#9ca3af] block text-label-sm mb-1">SUPPLY RADIUS</span>
                  <span className="text-[#fbbf24] font-bold">PAN-INDIA</span>
                </div>
              </div>
            </div>

            {/* Selected State Regional Hub Card */}
            <div className="p-8 border border-white/10 rounded-sm bg-[#0e1610] shadow-xl">
              <div className="text-label text-[#f59e0b] mb-2 font-bold">REGIONAL DISTRIBUTION HUB</div>
              <div className="text-[24px] font-bold text-[#f3f4f6] mb-5">{selectedNode.name}</div>

              {/* State Dropdown Selector */}
              <div className="mb-6">
                <label htmlFor="state-select" className="text-label text-[#9ca3af] block mb-2 font-bold">
                  SWITCH REGIONAL HUB
                </label>
                <select
                  id="state-select"
                  value={selectedNodeId}
                  onChange={(e) => setSelectedNodeId(e.target.value)}
                  className="w-full px-4 py-3.5 text-[15px] text-[#f3f4f6] border border-white/15 outline-none rounded-sm"
                  style={{ background: "#070c08" }}
                >
                  {supplyNodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.name} — ({node.region} Region)
                    </option>
                  ))}
                </select>
              </div>

              {/* Hub Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-5 bg-[#070c08] border border-white/10 rounded-sm">
                  <div className="text-[26px] font-bold text-[#f3f4f6] font-mono">{selectedNode.dronesDeployed}+</div>
                  <div className="text-label-sm text-[#9ca3af] mt-1">UNITS SUPPLIED FROM HYD</div>
                </div>
                <div className="p-5 bg-[#070c08] border border-white/10 rounded-sm">
                  <div className="text-[26px] font-bold text-[#fbbf24] font-mono">{selectedNode.farmersReached.toLocaleString()}+</div>
                  <div className="text-label-sm text-[#9ca3af] mt-1">ACRES COVERED</div>
                </div>
              </div>

              {/* Hub Description */}
              <p className="text-[16px] text-[#9ca3af] leading-relaxed">
                Directly connected to Hyderabad HQ via express logistics. Equipped with spare parts inventory, certified pilots, and field maintenance engineers.
              </p>
            </div>

            {/* Become a Dealer Callout */}
            <div className="p-8 border border-white/10 rounded-sm bg-[#0e1610] shadow-xl">
              <div className="text-label text-[#22c55e] mb-2 font-bold">JOIN OUR DISTRIBUTION NETWORK</div>
              <h3 className="text-[20px] font-bold text-[#f3f4f6] mb-2">
                BECOME AN AUTHORIZED GoAG DEALER
              </h3>
              <p className="text-[16px] text-[#9ca3af] mb-6 leading-relaxed">
                Partner with GoAG to bring Hyderabad-engineered precision agricultural and tactical drones to your district.
              </p>
              <a
                href="/contact"
                id="become-dealer-btn"
                className="btn-amber py-4 px-6 rounded-sm text-[13.5px] font-bold flex items-center justify-center gap-2 w-full text-center shadow-lg shadow-[#f59e0b]/20"
              >
                APPLY FOR DEALERSHIP <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXCLUSIVE CAMPAIGNS & FPO SPOTLIGHT ───────────────────────────────── */}
      <section className="py-20 px-6 lg:px-16 border-t border-white/10 bg-[#090f0b]">
        <div className="max-w-7xl mx-auto">
          <div className="p-8 lg:p-12 border border-[#f59e0b]/40 bg-[#0e1610] rounded-sm shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-3xl">
              <div className="text-label text-[#f59e0b] mb-3 font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] animate-pulse" />
                OUR EXCLUSIVE CAMPAIGNS
              </div>
              <h2 className="text-3xl font-bold text-[#f3f4f6] mb-4">
                Special Discount for FPOs (Farmer Producer Organizations)
              </h2>
              <p className="text-[#d1d5db] text-[17px] leading-relaxed mb-4">
                Secure early-bird allotments of our sprayer drones, plus joint-branding displays that pull growers straight to your counter. Subsidized per-acre maintenance rates and localized pilot skilling.
              </p>
              <div className="text-xs font-mono text-[#22c55e]">
                ✓ Early-bird allotment priority · Full operator training · 2-Year warranty on airframe
              </div>
            </div>
            <a href="/contact" className="btn-amber px-8 py-4 text-xs font-bold rounded-sm whitespace-nowrap shadow-lg">
              CLAIM FPO ALLOTMENT
            </a>
          </div>
        </div>
      </section>

      {/* ── RESOURCES & INSIGHTS ────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-16 border-t border-white/10 bg-[#070c08]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-label text-[#22c55e] mb-3 font-bold">SPECIAL INSIGHTS FROM ABOVE</div>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#f3f4f6] mb-4">
              RESOURCES & KNOWLEDGE BASE
            </h2>
            <p className="text-[#9ca3af] text-[16.5px]">
              Explore technical whitepapers, field trials, and case studies written by our aerospace and agritech teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Behind the Blades: What Makes a GOAG Drone Tick?",
                date: "Jul 25, 2025",
                tag: "ENGINEERING",
                desc: "An inside look at our in-house frame milling, brushless powertrain testing, and weather-sealed avionics.",
              },
              {
                title: "The Power of Precision: Mapping with Agrown-x Pro",
                date: "Jul 25, 2025",
                tag: "FIELD OPERATIONS",
                desc: "How 10-acre hexacopter endurance combined with RTK positioning delivers centimeter-grade droplet swaths.",
              },
              {
                title: "Why Smart Drones Are Changing Farming Forever",
                date: "Jul 25, 2025",
                tag: "AGRITECH TRENDS",
                desc: "Reducing chemical expenditure by 30% while shielding human operators from hazardous pesticide exposure.",
              },
            ].map((art) => (
              <div
                key={art.title}
                className="p-8 border border-white/10 bg-[#0e1610] rounded-sm hover:border-[#fbbf24]/50 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-4">
                    <span className="text-[#22c55e]">{art.tag}</span>
                    <span className="text-[#9ca3af]">{art.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#f3f4f6] mb-3 leading-snug">{art.title}</h3>
                  <p className="text-[14.5px] text-[#9ca3af] leading-relaxed mb-6">{art.desc}</p>
                </div>
                <a href="/contact" className="text-label text-[#fbbf24] hover:underline flex items-center gap-1 font-bold">
                  READ CASE STUDY <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
