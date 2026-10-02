import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, Target, Check, CheckCircle2 } from "lucide-react";
import { timelineMilestones, companyValues } from "../data/timeline";
import SEO from "../components/common/SEO";
import UnderReviewPanel from "../components/common/UnderReviewPanel";
import { getClaimText, isDevMode } from "../content/claims";

export default function About() {
  const isDev = isDevMode();
  const pilotsLabel = getClaimText("about-certified-pilots", "Flight Test Pilots");

  return (
    <div className="min-h-screen" style={{ background: "#070c08" }}>
      <SEO
        title="About Us — Aeronautical Engineers Transforming Agriculture | GoAG Services"
        description="Founded by aeronautical engineers, GoAG Services designs and manufactures indigenous agricultural drones in Hyderabad, India. Discover our story, mission, and vision."
        keywords="about GoAG Services, agricultural drone company India, aeronautical engineers Hyderabad, Indian drone founders, smart agriculture vision"
        canonical="/about"
      />
      <div className="h-20" />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[80vh] overflow-hidden flex items-end py-16">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1581092921461-39ee14b5b2ef?w=1920&q=75&fm=webp"
            alt="GoAG aeronautical engineers developing drones"
            className="w-full h-full object-cover"
            style={{ opacity: 0.4 }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070c08]/80 via-[#070c08]/50 to-[#070c08]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070c08]/90 via-[#070c08]/50 to-transparent" />
        </div>

        <div className="relative z-10 px-6 lg:px-16 pb-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-label text-[#f59e0b] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              ABOUT GO-AG SERVICES
            </div>
            <h1
              className="font-bold text-[#f3f4f6] mb-6 tracking-tight leading-[1.12]"
              style={{ fontSize: "clamp(2.4rem, 4.8vw, 4.2rem)" }}
            >
              REVOLUTIONIZING INDIAN AGRICULTURE WITH INTELLIGENT DRONES.
            </h1>
            <div className="space-y-2.5 mt-6">
              <div className="flex items-center gap-2.5 text-base font-mono text-white/90">
                <Check className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                <span>Founded by passionate aeronautical engineers in Hyderabad</span>
              </div>
              <div className="flex items-center gap-2.5 text-base font-mono text-white/90">
                <Check className="w-4 h-4 text-[#fbbf24] flex-shrink-0" />
                <span>Indigenously engineered & assembled with 80% Indian content</span>
              </div>
              <div className="flex items-center gap-2.5 text-base font-mono text-white/90">
                <Check className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                <span>Monsoon & heat field-proven across 20+ Indian agricultural states</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-8 border border-white/15 rounded-sm bg-[#0e1610]/95 backdrop-blur-md hidden lg:block shadow-2xl"
          >
            <div className="text-label text-[#22c55e] mb-2 font-bold font-mono">HYDERABAD AEROSPACE HQ</div>
            <div className="text-[#f3f4f6] text-2xl font-bold mb-4">Built in India, Built for India</div>
            <div className="space-y-2 mb-6 font-mono text-xs text-white/80">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                <span>Tailored for rice, maize, sugarcane, tea, and fruit orchards</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
                <span>High flight endurance & multi-purpose quick-swap payloads</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                <span>Affordable ₹20/acre battery operational overhead</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
                <span>Pan-India 48-hour technician and spare dispatch SLA</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-5 border-t border-white/10 text-center">
              <div>
                <div className="text-2xl font-bold text-[#fbbf24] font-mono">80%</div>
                <div className="text-label-sm text-[#9ca3af] font-mono mt-1">INDIAN CONTENT</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#22c55e] font-mono">₹20</div>
                <div className="text-label-sm text-[#9ca3af] font-mono mt-1">BATTERY / ACRE</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#fbbf24] font-mono">2 YRS</div>
                <div className="text-label-sm text-[#9ca3af] font-mono mt-1">WARRANTY</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── VISION & MISSION SECTION ─────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-16 border-t border-white/10 bg-[#090f0b]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="p-8 lg:p-12 border border-white/15 rounded-sm bg-[#0e1610] shadow-xl relative overflow-hidden">
              <div className="w-12 h-12 rounded-sm bg-[#22c55e]/15 border border-[#22c55e]/30 flex items-center justify-center mb-6">
                <Compass className="w-6 h-6 text-[#22c55e]" />
              </div>
              <div className="text-label text-[#22c55e] mb-3 font-bold tracking-widest">OUR VISION</div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#f3f4f6] mb-5 leading-snug">
                Smart, Dignified, & Sustainable Agriculture for All India
              </h2>
              <div className="space-y-3 font-mono text-sm text-white/80">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" />
                  <span>Dignified & sustainable technology empowering rural farming communities</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" />
                  <span>Bridge traditional field knowledge with high-accuracy aerospace robotics</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" />
                  <span>National food security, chemical minimization, and shared grower prosperity</span>
                </div>
              </div>
            </div>

            {/* Mission */}
            <div className="p-8 lg:p-12 border border-white/15 rounded-sm bg-[#0e1610] shadow-xl relative overflow-hidden">
              <div className="w-12 h-12 rounded-sm bg-[#f59e0b]/15 border border-[#f59e0b]/30 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-[#fbbf24]" />
              </div>
              <div className="text-label text-[#f59e0b] mb-3 font-bold tracking-widest">OUR MISSION</div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#f3f4f6] mb-5 leading-snug">
                Igniting a Grassroots Revolution in Farming Technologies
              </h2>
              <div className="space-y-3 font-mono text-sm text-white/80">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                  <span>Indigenous unmanned aerial systems engineered at the grassroots level</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                  <span>Micro-atomized droplet control & zero manual pesticide toxicity exposure</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                  <span>Accessible, farmer-friendly flight automation backed by up to 2 years warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-16 border-t border-white/10" style={{ background: "#070c08" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-label text-[#22c55e] mb-14 tracking-widest font-bold">OUR EVOLUTION TIMELINE</div>

          {!isDev ? (
            <UnderReviewPanel message="Content under owner review for verified flight-test data." />
          ) : (
            <>
              {/* Desktop: horizontal */}
              <div className="hidden lg:block relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10" />
                <div className="grid grid-cols-6 gap-6">
                  {timelineMilestones.map((milestone, i) => (
                    <motion.div
                      key={milestone.year}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="p-5 border border-white/10 rounded-sm bg-[#0e1610] hover:border-[#f59e0b]/40 transition-colors shadow-lg"
                    >
                      <div className="relative mb-5">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#f59e0b] relative z-10 shadow-[0_0_12px_#f59e0b]" />
                      </div>
                      <div className="font-mono font-bold text-[#fbbf24] text-[16px] mb-1">
                        {getClaimText(`timeline-${milestone.year}-year`, milestone.year)}
                      </div>
                      <div className="text-[#f3f4f6] text-[16px] font-bold mb-2 leading-snug">
                        {getClaimText(`timeline-${milestone.year}-title`, milestone.title)}
                      </div>
                      <p className="text-[#9ca3af] text-[14px] leading-relaxed">
                        {getClaimText(`timeline-${milestone.year}-desc`, milestone.description)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mobile: vertical */}
              <div className="lg:hidden space-y-0">
                {timelineMilestones.map((milestone, i) => (
                  <motion.div
                    key={milestone.year}
                    className="flex gap-5"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#f59e0b] flex-shrink-0 mt-1 shadow-[0_0_8px_#f59e0b]" />
                      {i < timelineMilestones.length - 1 && (
                        <div className="w-0.5 flex-1 bg-[#22c55e]/30 my-1" style={{ minHeight: "45px" }} />
                      )}
                    </div>
                    <div className="pb-8">
                      <div className="font-mono font-bold text-[#fbbf24] text-[16px] mb-0.5">
                        {getClaimText(`timeline-${milestone.year}-year`, milestone.year)}
                      </div>
                      <div className="text-[#f3f4f6] text-[16px] font-bold mb-1">
                        {getClaimText(`timeline-${milestone.year}-title`, milestone.title)}
                      </div>
                      <p className="text-[#9ca3af] text-[15px] leading-relaxed">
                        {getClaimText(`timeline-${milestone.year}-desc`, milestone.description)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── ENGINEERING EXCELLENCE ───────────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-[#090f0b]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center">
          <div className="relative overflow-hidden min-h-[460px] group">
            <img
              src="https://images.unsplash.com/photo-1590959651373-a3db0f38a961?w=900&q=75&fm=webp"
              alt="GoAG aeronautical engineering team"
              className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#090f0b]" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/85 backdrop-blur-md rounded border border-white/15">
              <div className="text-xs font-mono text-[#22c55e] font-bold mb-1">HYDERABAD AEROSPACE R&D LAB</div>
              <div className="flex flex-wrap gap-2 text-[11px] font-mono text-white/80">
                <span className="px-2 py-0.5 rounded bg-white/10">• Avionics Lab</span>
                <span className="px-2 py-0.5 rounded bg-white/10">• Wind Tunnel Testing</span>
                <span className="px-2 py-0.5 rounded bg-white/10">• {pilotsLabel}</span>
              </div>
            </div>
          </div>
          <div className="px-8 lg:px-14 py-20 flex flex-col justify-center">
            <div className="text-label text-[#22c55e] mb-4 font-bold font-mono">AERONAUTICAL PASSION</div>
            <h2
              className="font-bold text-[#f3f4f6] mb-6 tracking-tight leading-[1.14]"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
            >
              AERONAUTICAL ENGINEERS.
              <br />
              <span className="text-[#fbbf24]">ROOTED IN INDIAN SOIL.</span>
            </h2>

            <div className="space-y-3 mb-8">
              {[
                { title: "Hyderabad Engineering Team", desc: "Mechanical, avionics, embedded firmware developers, and flight test crew." },
                { title: "Monsoon & High-Heat Stress Testing", desc: "Engineered to withstand 48°C Indian summers and heavy monsoon downpours." },
                { title: "Ultra-Low Maintenance Architecture", desc: "Modular arms, quick-swap nozzles, and standard battery interfaces reduce upkeep." },
                { title: "Farmer-Centric Bottom Line", desc: "₹20/acre battery operational cost and 2-year manufacturer direct warranty." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-white">{item.title}</div>
                    <div className="text-xs text-white/60 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/contact" className="btn-amber px-8 py-4 inline-flex items-center gap-2 rounded-sm w-fit font-bold text-[13px] tracking-wider shadow-lg">
              CONTACT OUR TEAM <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-16 border-t border-white/10" style={{ background: "#070c08" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-label text-[#f59e0b] mb-12 tracking-widest font-bold">CORE COMPANY VALUES</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((val, i) => {
              const isTransparentData = val.title === "Transparent Data";
              const desc = isTransparentData
                ? getClaimText("company-value-transparent-data-desc", val.description)
                : val.description;
              return (
                <motion.div
                  key={val.title}
                  className="p-8 border border-white/10 rounded-sm bg-[#0e1610] shadow-xl hover:border-[#22c55e]/40 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className="w-10 h-1 bg-[#f59e0b] mb-6 rounded-full" />
                  <h3 className="text-[#f3f4f6] font-bold text-[19px] mb-3 leading-tight">{val.title}</h3>
                  <p className="text-[#9ca3af] text-[15.5px] leading-relaxed">{desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

