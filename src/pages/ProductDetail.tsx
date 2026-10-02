import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ChevronRight, Check, RotateCcw } from "lucide-react";
import DroneViewer from "../components/three/DroneViewer";
import { products } from "../data/products";
import SEO from "../components/common/SEO";

const tabs = ["OVERVIEW", "SPECIFICATIONS", "ENGINEERING", "PERFORMANCE", "PAYLOADS", "SAFETY", "FIELD RESULTS", "SUPPORT"];

const productDetailHotspots = [
  { label: "Antenna", detail: "High-Gain", screenX: "65%", screenY: "14%" },
  { label: "Motor", detail: "KV 110PV", screenX: "80%", screenY: "30%" },
  { label: "Nozzle", detail: "Anti-Drip Nozzle", screenX: "72%", screenY: "74%" },
  { label: "Tank", detail: "10L–16L", screenX: "28%", screenY: "62%" },
  { label: "Battery", detail: "14S 16800mAh", screenX: "62%", screenY: "56%" },
];

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug) || products[0];
  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    mobile: "",
    profession: "",
    email: "",
  });

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${product.name} — Agricultural Drone`,
    "description": product.description,
    "image": product.image,
    "brand": {
      "@type": "Brand",
      "name": "GoAG Services"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "GoAG Services Private Limited"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": `https://goagdrones.com/products/${product.slug}`
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#070c08" }}>
      <SEO
        title={`${product.name} | ${product.tagline} — GoAG Services`}
        description={`${product.name}: ${product.description} Built in India with 2-year warranty, ₹20 battery cost per acre, and DGCA compliant engineering.`}
        keywords={`${product.name}, ${product.tagline}, agricultural drone, crop sprayer drone, ${product.category} drone India, GoAG Hyderabad`}
        canonical={`/products/${product.slug}`}
        schema={productSchema}
      />
      <div className="h-20" />

      {/* Breadcrumb */}
      <div className="px-6 lg:px-12 py-5 border-b border-white/10 bg-[#090f0b]">
        <Link to="/products" className="flex items-center gap-2 text-label text-[#9ca3af] hover:text-[#fbbf24] transition-colors">
          <ArrowLeft className="w-4 h-4" /> PRODUCTS / <span className="text-[#f3f4f6] font-semibold">{product.name}</span>
        </Link>
      </div>

      {/* ── HERO SECTION ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[420px_1fr_60px] min-h-[640px] py-10 gap-8">
        {/* Left: product info */}
        <div className="py-6 lg:pr-8 lg:border-r border-white/10 flex flex-col justify-between">
          <div>
            <div className="text-label text-[#f59e0b] mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              {product.category.toUpperCase()} DRONE SYSTEM
            </div>
            <h1
              className="font-bold text-[#f3f4f6] mb-4 tracking-tight leading-[1.14]"
              style={{ fontSize: "clamp(2.2rem, 3.8vw, 3.4rem)" }}
            >
              {product.name}
            </h1>
            <div className="space-y-2 mb-8 font-mono text-xs text-white/85">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                <span>{product.highlights[0] || (product.specs.tankCapacity ? `Quick-swap ${product.specs.tankCapacity} tank` : `High-capacity ${product.specs.payload} payload`)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#fbbf24] flex-shrink-0" />
                <span>{product.highlights[1] || `${product.specs.coverage || product.specs.flightTime} coverage`}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                <span>{product.highlights[2] || "80% Indian content with 2-year warranty"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-10">
              {quoteSubmitted ? (
                <div className="border border-[#22c55e]/50 bg-[#22c55e]/15 px-6 py-4 text-[#22c55e] text-label text-center rounded-sm font-bold shadow-lg">
                  ✓ QUOTE REQUEST RECEIVED — WE WILL CALL YOU
                </div>
              ) : (
                <button
                  id="request-quote-btn"
                  onClick={() => setShowQuoteModal(true)}
                  className="btn-amber px-6 py-4 rounded-sm font-bold tracking-wider text-[13px] shadow-lg shadow-[#f59e0b]/20"
                >
                  REQUEST A QUOTE
                </button>
              )}
              <Link to="/drone-360" className="btn-outline px-6 py-3.5 rounded-sm text-center text-[13px] font-bold text-green-400 border-green-500/40 hover:bg-green-500/10 flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#22c55e]" /> 360° INTERACTIVE VIEW
              </Link>
              <Link to="/contact" id="book-demo-btn" className="btn-outline px-6 py-3 rounded-sm text-center text-[13px] font-semibold text-white/70">
                BOOK A LIVE DEMO
              </Link>
            </div>
          </div>

          {/* Key stats */}
          <div className="pt-6 border-t border-white/10 space-y-4">
            {[
              { label: "Flight Time", val: product.specs.flightTime },
              { label: "Payload", val: product.specs.payload },
              { label: "Max Speed", val: product.specs.maxSpeed },
              { label: "Range", val: product.specs.range },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-label text-[#9ca3af]">{s.label}</span>
                <span className="text-[16px] font-bold text-[#f3f4f6] font-mono">{s.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center: 3D viewer */}
        <div className="relative p-2">
          <DroneViewer
            hotspots={productDetailHotspots}
            enableExplodedView
            height="100%"
            className="w-full min-h-[520px] rounded-sm"
          />
        </div>

        {/* Right: viewer icon controls */}
        <div className="hidden lg:flex flex-col items-center py-8 gap-4 border-l border-white/10">
          {["⟳", "⊕", "⊖", "⊞", "⊟", "◎"].map((icon, i) => (
            <button
              key={i}
              className="w-10 h-10 rounded-sm flex items-center justify-center text-[#9ca3af] hover:text-[#fbbf24] hover:bg-[#f59e0b]/10 transition-colors text-lg border border-white/10 hover:border-[#f59e0b]/40"
              aria-label={`Viewer control ${i + 1}`}
            >
              {icon}
            </button>
          ))}
        </div>
      </section>

      {/* ── TABS ─────────────────────────────────────────────────────────────── */}
      <div className="border-y border-white/10 overflow-x-auto bg-[#090f0b]">
        <div className="flex min-w-max px-6 lg:px-12 max-w-7xl mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              id={`tab-${tab.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setActiveTab(tab)}
              className="px-6 py-4 text-label-sm whitespace-nowrap transition-colors relative font-mono text-[11.5px] tracking-wider"
              style={{
                color: activeTab === tab ? "#fbbf24" : "#9ca3af",
                borderBottom: activeTab === tab ? "2px solid #f59e0b" : "2px solid transparent",
                fontWeight: activeTab === tab ? 700 : 500,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "OVERVIEW" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Key Specifications */}
                <div className="border border-white/10 p-8 rounded-sm bg-[#0e1610] shadow-xl">
                  <h2 className="text-label text-[#22c55e] mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                    KEY SPECIFICATIONS
                  </h2>
                  <table className="w-full">
                    <tbody className="divide-y divide-white/10">
                      {[
                        ["Tank Capacity", product.specs.tankCapacity || "—"],
                        ["Flight Time", product.specs.flightTime],
                        ["Payload Capacity", product.specs.payload],
                        ["Max Speed", product.specs.maxSpeed],
                        ["Coverage Area", product.specs.coverage || "—"],
                        ["Battery", product.specs.battery],
                        ["Operating Temperature", product.specs.operatingTemp],
                        ["Water Resistance", product.specs.waterResistance || "IP54"],
                      ].map(([label, value]) => (
                        <tr key={label}>
                          <td className="py-4 pr-4 text-[16px] text-[#9ca3af]">{label}</td>
                          <td className="py-4 text-[16.5px] text-[#f3f4f6] font-semibold font-mono">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* See Inside */}
                <div className="border border-white/10 p-8 rounded-sm bg-[#0e1610] shadow-xl">
                  <h2 className="text-label text-[#22c55e] mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                    EXPLODED VIEW & COMPONENTS
                  </h2>
                  <DroneViewer
                    hotspots={productDetailHotspots}
                    enableExplodedView
                    height="360px"
                    autoRotate
                    className="border border-white/10 rounded-sm overflow-hidden"
                  />
                </div>
              </div>
            )}

            {activeTab === "SPECIFICATIONS" && (
              <div>
                <h2 className="text-label text-[#22c55e] mb-8">FULL TECHNICAL SPECIFICATIONS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="p-6 border border-white/10 rounded-sm bg-[#0e1610] shadow-lg">
                      <div className="text-label text-[#f59e0b] mb-2 font-mono font-bold">
                        {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                      </div>
                      <div className="text-[#f3f4f6] text-[18px] font-semibold">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === "ENGINEERING" || activeTab === "PERFORMANCE" || activeTab === "PAYLOADS" || activeTab === "SAFETY" || activeTab === "FIELD RESULTS" || activeTab === "SUPPORT") && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="border border-white/10 p-10 rounded-sm bg-[#0e1610] shadow-xl">
                  <h2 className="text-label text-[#22c55e] mb-4">{activeTab} ARCHITECTURE</h2>
                  <p className="text-[#9ca3af] text-[17.5px] leading-relaxed mb-8">
                    Comprehensive {activeTab.toLowerCase()} documentation for the {product.name} is compiled directly from our Hyderabad flight testing facility and ISO 9001 assembly lines.
                  </p>
                  <div className="space-y-4 mb-10">
                    {product.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] mt-2 flex-shrink-0" />
                        <span className="text-[#f3f4f6] text-[16.5px] leading-relaxed">{h}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/contact" className="btn-amber px-7 py-3.5 rounded-sm inline-flex items-center gap-2 text-[13px] font-bold">
                    REQUEST TECHNICAL DATASHEET <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="border border-white/10 p-10 rounded-sm bg-[#0e1610] flex flex-col justify-between shadow-xl">
                  <div>
                    <h2 className="text-label text-[#f59e0b] mb-4">DEPLOYMENT & INTEGRATION</h2>
                    <p className="text-[#9ca3af] text-[17.5px] leading-relaxed mb-8">
                      Our field engineering team provides end-to-end mission integration, pilot training, and telemetry setup for all {product.name} deployments across India.
                    </p>
                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                      <div>
                        <div className="text-label text-[#9ca3af] mb-1">FIELD SUPPORT</div>
                        <div className="text-[#f3f4f6] text-[16.5px] font-bold">24/7 On-Site Available</div>
                      </div>
                      <div>
                        <div className="text-label text-[#9ca3af] mb-1">DGCA COMPLIANCE</div>
                        <div className="text-[#22c55e] text-[16.5px] font-bold">Type Certified</div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowQuoteModal(true)}
                    className="btn-outline px-7 py-4 rounded-sm text-xs mt-10 text-center font-bold"
                  >
                    CONSULT WITH FLIGHT ENGINEER
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── CUSTOM QUOTE MODAL FOR PRODUCT DETAIL ───────────────────────────── */}
      <AnimatePresence>
        {showQuoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg border border-[#f59e0b]/50 bg-[#0e1610] p-8 lg:p-10 rounded-sm shadow-2xl relative"
            >
              <button
                onClick={() => setShowQuoteModal(false)}
                className="absolute top-5 right-5 text-[#9ca3af] hover:text-[#f3f4f6] text-xl font-bold"
              >
                ✕
              </button>

              <div className="text-label text-[#f59e0b] mb-1 font-bold">REQUEST CUSTOM QUOTE</div>
              <h2 className="text-2xl font-bold text-[#f3f4f6] mb-3">{product.name}</h2>
              <p className="text-[#9ca3af] text-[13.5px] mb-8 leading-relaxed">
                Please provide your contact details and intended drone use case. Our Hyderabad engineering team will prepare an exact technical quote for you.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (quoteForm.name && quoteForm.mobile && quoteForm.profession) {
                    setQuoteSubmitted(true);
                    setShowQuoteModal(false);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-label-sm text-[#9ca3af] block mb-1.5 font-bold">FULL NAME *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Rajesh Kumar"
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-3 text-xs text-[#f3f4f6] bg-[#070c08] border border-white/15 outline-none focus:border-[#f59e0b] rounded-sm"
                  />
                </div>

                <div>
                  <label className="text-label-sm text-[#9ca3af] block mb-1.5 font-bold">MOBILE NUMBER *</label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={quoteForm.mobile}
                    onChange={(e) => setQuoteForm((f) => ({ ...f, mobile: e.target.value }))}
                    className="w-full px-4 py-3 text-xs text-[#f3f4f6] bg-[#070c08] border border-white/15 outline-none focus:border-[#f59e0b] rounded-sm"
                  />
                </div>

                <div>
                  <label className="text-label-sm text-[#9ca3af] block mb-1.5 font-bold">PROFESSION / USE CASE *</label>
                  <select
                    required
                    value={quoteForm.profession}
                    onChange={(e) => setQuoteForm((f) => ({ ...f, profession: e.target.value }))}
                    className="w-full px-4 py-3 text-xs text-[#f3f4f6] bg-[#070c08] border border-white/15 outline-none focus:border-[#f59e0b] rounded-sm"
                  >
                    <option value="">Select your industry / profession...</option>
                    <option value="Agriculture & Farming">Agriculture & Farming</option>
                    <option value="Defense & Security">Defense & Security</option>
                    <option value="Surveillance & Reconnaissance">Surveillance & Reconnaissance</option>
                    <option value="Mapping & Surveying">Mapping & Surveying</option>
                    <option value="Industrial Inspection">Industrial Inspection</option>
                    <option value="Logistics & Cargo">Logistics & Cargo</option>
                    <option value="Research & Education">Research & Education</option>
                    <option value="Other">Other Profession</option>
                  </select>
                </div>

                <div>
                  <label className="text-label-sm text-[#9ca3af] block mb-1.5 font-bold">EMAIL ADDRESS (OPTIONAL)</label>
                  <input
                    type="email"
                    placeholder="rajesh@company.com"
                    value={quoteForm.email}
                    onChange={(e) => setQuoteForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-3 text-xs text-[#f3f4f6] bg-[#070c08] border border-white/15 outline-none focus:border-[#f59e0b] rounded-sm"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowQuoteModal(false)}
                    className="btn-outline px-5 py-3 text-xs rounded-sm"
                  >
                    CANCEL
                  </button>
                  <button type="submit" className="btn-amber px-7 py-3 text-xs rounded-sm font-bold">
                    SUBMIT QUOTE REQUEST
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
