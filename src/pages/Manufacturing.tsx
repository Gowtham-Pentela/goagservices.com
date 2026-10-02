import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { FlaskConical, Wrench, Gauge, HeadphonesIcon, Cpu, Check } from "lucide-react";
import { manufacturingStages, capabilities } from "../data/manufacturing";
import SEO from "../components/common/SEO";

const capabilityIcons = [FlaskConical, Wrench, Gauge, HeadphonesIcon];

const howItWorksSteps = [
  {
    step: "01",
    title: "Survey & Boundary Mapping",
    subtitle: "Centimeter RTK Boundary",
    pointers: [
      "Centimeter RTK boundary locking",
      "Auto obstacle & tree line mapping",
      "Handheld ground station sync"
    ]
  },
  {
    step: "02",
    title: "Autonomous Flight Path",
    subtitle: "Canopy-Aware Swath",
    pointers: [
      "Optimal parallel swath lanes",
      "Custom profiles for 7+ Indian crops",
      "Dynamic radar terrain tracking"
    ]
  },
  {
    step: "03",
    title: "Precision Atomized Spray",
    subtitle: "Calibrated Zero-Drift Mist",
    pointers: [
      "Micron-calibrated atomizing nozzles",
      "Precision targeted spraying & controlled drift",
      "Propeller downwash canopy penetration"
    ]
  },
  {
    step: "04",
    title: "Real-Time Telemetry Logs",
    subtitle: "Acreage & Discharge Logs",
    pointers: [
      "Live battery voltage & flow tracking",
      "Automated digital mission logs",
      "Instant spray proof & coverage cert"
    ]
  },
];

export default function Manufacturing() {
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  return (
    <div className="min-h-screen" style={{ background: "#070c08" }}>
      <SEO
        title="Manufacturing & Technology | GoAG Services Hyderabad"
        description="Learn how GoAG's precision agricultural drones operate and explore our drone manufacturing facility in Hyderabad, India with 80% Made in India content."
        keywords="drone manufacturing India, Hyderabad drone factory, agricultural drone engineering, how agricultural drones spray, precision farming workflow, Make in India drones"
        canonical="/manufacturing"
      />
      <div className="h-20" />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-6 lg:px-12 text-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 goag-grid opacity-30 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="text-label text-[#f59e0b] mb-4 flex items-center justify-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
            HOW IT WORKS & MANUFACTURING EXCELLENCE
          </div>
          <h1
            className="font-bold text-[#f3f4f6] mb-6 tracking-tight leading-[1.12]"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4.2rem)" }}
          >
            CUTTING-EDGE SOLUTIONS FOR EVERY TYPE OF CROP
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-2.5 my-6">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-white/90">
              • 80% Made in India
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-white/90">
              • 100% In-House Manufacturing
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-white/90">
              • Hyderabad Aerospace Facility
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link to="/products" className="btn-amber px-8 py-3.5 rounded-sm text-xs font-bold font-mono">
              EXPLORE OUR FLEET
            </Link>
            <Link to="/drone-360" className="btn-outline px-8 py-3.5 rounded-sm text-xs font-bold font-mono border-green-500/40 text-green-400 hover:bg-green-500/10">
              360° DRONE STUDIO
            </Link>
            <Link to="/contact" className="btn-outline px-8 py-3.5 rounded-sm text-xs font-semibold font-mono">
              REQUEST A DEMO
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS: 4-STEP WORKFLOW ────────────────────────────────────── */}
      <section className="py-20 px-6 lg:px-12 border-b border-white/10 bg-[#090f0b]">
        <div className="max-w-7xl mx-auto">
          <div className="text-label text-[#22c55e] mb-3 font-bold font-mono text-xs">OPERATION SIMPLICITY</div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#f3f4f6] mb-12">
            FROM FIELD BOUNDARY TO PRECISION HARVEST
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((s) => (
              <div
                key={s.step}
                className="p-6 border border-white/10 rounded-sm bg-[#0e1610] hover:border-[#f59e0b]/40 transition-colors shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="font-mono text-3xl font-bold text-[#fbbf24] mb-3">{s.step}</div>
                  <h3 className="text-lg font-bold text-[#f3f4f6] mb-1">{s.title}</h3>
                  <div className="text-xs text-[#22c55e] font-mono mb-4">{s.subtitle}</div>
                  <div className="space-y-2 font-mono text-xs text-white/80">
                    {s.pointers.map((pt) => (
                      <div key={pt} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#22c55e] flex-shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6-STAGE MANUFACTURING PROCESS ────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-24 max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="text-label text-[#f59e0b] mb-2 font-bold font-mono text-xs">INDIAN FABRICATION & ASSEMBLY</div>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#f3f4f6]">
            OUR HYDERABAD MANUFACTURING CYCLE
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {manufacturingStages.map((stage, i) => (
            <motion.div
              key={stage.id}
              id={`stage-${stage.id}`}
              className="relative overflow-hidden group cursor-default border border-white/10 rounded-sm bg-[#0e1610] hover:border-[#f59e0b]/50 transition-all duration-300 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09, duration: 0.6 }}
              onMouseEnter={() => setHoveredStage(i)}
              onMouseLeave={() => setHoveredStage(null)}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={stage.image}
                  alt={stage.title}
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1610] via-[#0e1610]/40 to-transparent" />
                <div className="absolute top-4 left-5 bg-[#070c08]/90 backdrop-blur-md px-3.5 py-1 rounded-sm border border-[#f59e0b]/40 shadow-lg">
                  <span className="font-mono font-bold text-[#fbbf24] text-xl">
                    {stage.id}
                  </span>
                </div>
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded border border-white/10 text-white/90">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#22c55e]" /> Stage {stage.id}</span>
                  <span className="text-[#fbbf24]">{stage.subtitle}</span>
                </div>
              </div>

              <div className="p-7 space-y-3">
                <div className="text-label text-[#22c55e] mb-1 font-mono font-bold tracking-wider">{stage.title}</div>
                <div className="text-[#f3f4f6] text-[17px] font-bold mb-2">{stage.caption}</div>
                <div className="space-y-1.5 pt-1 font-mono text-xs text-white/80">
                  {stage.pointers.map((pt) => (
                    <div key={pt} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#22c55e] flex-shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#22c55e] to-[#f59e0b]"
                  animate={{ width: hoveredStage === i ? "100%" : "0%" }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── ETHOS STRIP ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12 border-t border-white/10" style={{ background: "#090f0b" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <motion.h2
              className="font-bold text-[#f3f4f6] tracking-tight leading-[1.14]"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3.2rem)" }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              WE DON'T JUST ASSEMBLE DRONES.
              <br />
              <span style={{ color: "#22c55e" }}>WE ENGINEER UNCOMPROMISING RELIABILITY.</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((cap, i) => {
              const Icon = capabilityIcons[i] || Cpu;
              return (
                <div
                  key={cap.title}
                  className="p-8 border border-white/10 rounded-sm bg-[#0e1610] shadow-xl hover:border-[#22c55e]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-sm bg-[#22c55e]/10 border border-[#22c55e]/25 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-[#22c55e]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#f3f4f6] mb-3">{cap.title}</h3>
                    <div className="space-y-1.5 font-mono text-xs text-white/80">
                      {cap.pointers.map((p) => (
                        <div key={p} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#22c55e] flex-shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
