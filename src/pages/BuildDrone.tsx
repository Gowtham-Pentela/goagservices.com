import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Check, Play, ArrowRight, X } from "lucide-react";
import { configuratorSections, basePrice, allPayloadOptions, IndustryType } from "../data/configurator";
import SEO from "../components/common/SEO";
import { assetUrl } from "../utils/assets";

export default function BuildDrone() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState<Record<string, string>>({
    industry: "agriculture",
    payload: "sprayer",
    battery: "bat-16s",
    camera: "fpv",
    range: "range-2",
    color: "black",
  });

  const [openSection, setOpenSection] = useState<string | null>("industry");
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Quote Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    profession: "Farmer / Agriculture Specialist",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const activeIndustry = (selections.industry || "agriculture") as IndustryType;

  // Dynamically compute options based on selected industry
  const displayedSections = useMemo(() => {
    return configuratorSections.map((sec) => {
      if (sec.id === "payload") {
        return {
          ...sec,
          options: allPayloadOptions[activeIndustry] || allPayloadOptions.agriculture,
        };
      }
      return sec;
    });
  }, [activeIndustry]);

  const activeConfig = useMemo(() => {
    let totalPrice = basePrice;
    let payload = "16 L";
    let flightTime = "26 Min";
    let range = "2 km";

    displayedSections.forEach((sec) => {
      const selectedId = selections[sec.id];
      const opt = sec.options.find((o) => o.id === selectedId);
      if (opt) {
        totalPrice += opt.specImpact.priceAdder || 0;
        if (opt.specImpact.payload) payload = opt.specImpact.payload;
        if (opt.specImpact.flightTime) flightTime = opt.specImpact.flightTime;
        if (opt.specImpact.range) range = opt.specImpact.range;
      }
    });

    return { totalPrice, payload, flightTime, range };
  }, [selections, displayedSections]);

  const selectedPayloadOpt = useMemo(() => {
    const list = allPayloadOptions[activeIndustry] || allPayloadOptions.agriculture;
    return list.find((o) => o.id === selections.payload) || list[0];
  }, [activeIndustry, selections.payload]);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const handleSelectOption = (sectionId: string, optId: string) => {
    if (sectionId === "industry") {
      const newIndustry = optId as IndustryType;
      const defaultPayload = newIndustry === "agriculture" ? "sprayer" : "solar-cleaning";
      setSelections((prev) => ({
        ...prev,
        industry: newIndustry,
        payload: defaultPayload,
      }));
    } else {
      setSelections((prev) => ({ ...prev, [sectionId]: optId }));
    }
  };

  const handleReset = () => {
    setSelections({
      industry: "agriculture",
      payload: "sprayer",
      battery: "bat-16s",
      camera: "fpv",
      range: "range-2",
      color: "black",
    });
    setQuoteSubmitted(false);
    setShowQuoteModal(false);
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.phone.trim() || formData.phone.length < 10) errors.phone = "Valid 10-digit mobile number required";
    if (!formData.email.trim() || !formData.email.includes("@")) errors.email = "Valid email required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setQuoteSubmitted(true);
    setShowQuoteModal(false);
  };

  const handleFlySimulator = () => {
    // Navigate to simulator with configured industry & payload parameters
    navigate(`/simulator?industry=${selections.industry}&payload=${selections.payload}`);
  };

  return (
    <div className="min-h-screen" style={{ background: "#070c08" }}>
      <SEO
        title="Build Your Custom Drone — Agriculture & Multipurpose Configurator | GoAG"
        description="Configure your custom GoAG drone for agriculture or industrial applications. Choose sprayer, spreader, solar cleaning, building wash, winch, or screen mechanisms with instant 3D simulation."
        keywords="build your drone, custom agricultural drone, custom drone builder India, agricultural sprayer drone configurator, solar cleaning drone, high rise building cleaning drone"
        canonical="/build-your-drone"
      />
      <div className="h-20" />

      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-16 text-center border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 goag-grid opacity-25 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <div className="text-label text-[#f59e0b] mb-4 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
            AEROSPACE HARDWARE CONFIGURATOR
          </div>
          <h1
            className="font-bold text-[#f3f4f6] mb-5 tracking-tight leading-[1.12]"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)" }}
          >
            BUILD YOUR CUSTOM MISSION DRONE
          </h1>
          <p className="text-[#9ca3af] text-[18px] max-w-2xl mx-auto leading-relaxed">
            Select specialized airframe platforms, propulsion setups, sensor pods, and payload capacities. Engineered in India for demanding industrial and field operations.
          </p>
        </motion.div>
      </section>

      {/* ── CONFIGURATOR MAIN SECTION ───────────────────────────────────────── */}
      <section className="px-6 lg:px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_540px] gap-14 max-w-7xl mx-auto items-start">

          {/* Left: Config options & detailed spec builder */}
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="text-label text-[#22c55e] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                1. CONFIGURE SPECIFICATIONS
              </div>
              <div className="text-label-sm text-[#9ca3af]">6 CUSTOMIZATION STAGES</div>
            </div>

            <div className="space-y-4">
              {displayedSections.map((section, si) => {
                const selectedOpt = section.options.find((o) => o.id === selections[section.id]);
                const isOpen = openSection === section.id;

                return (
                  <div
                    key={section.id}
                    className="border border-white/10 rounded-sm overflow-hidden transition-all duration-300 shadow-md"
                    style={{ background: isOpen ? "#121b14" : "#0e1610" }}
                  >
                    <button
                      id={`config-${section.id}`}
                      onClick={() => setOpenSection(isOpen ? null : section.id)}
                      className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full border border-[#f59e0b]/40 flex items-center justify-center font-mono text-[11px] text-[#fbbf24] bg-[#f59e0b]/10 font-bold">
                          {String(si + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <div className="text-label-sm text-[#9ca3af] mb-0.5">
                            {section.label}
                          </div>
                          <div className="text-[15px] font-bold text-[#f3f4f6]">
                            {selectedOpt?.label || "Select..."}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {selectedOpt?.specImpact.priceAdder ? (
                          <span className="font-mono text-[12px] text-[#fbbf24] font-semibold">
                            +{formatPrice(selectedOpt.specImpact.priceAdder)}
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] text-[#22c55e] font-semibold">INCLUDED</span>
                        )}
                        <ChevronDown
                          className="w-4 h-4 text-[#9ca3af] transition-transform duration-300"
                          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                        />
                      </div>
                    </button>

                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-white/10 bg-[#070c08] p-5 grid grid-cols-1 sm:grid-cols-2 gap-4"
                      >
                        {section.options.map((opt) => {
                          const isSelected = selections[section.id] === opt.id;
                          return (
                            <button
                              key={opt.id}
                              id={`opt-${opt.id}`}
                              onClick={() => handleSelectOption(section.id, opt.id)}
                              className="p-5 text-left border rounded-sm transition-all flex flex-col justify-between"
                              style={{
                                background: isSelected ? "rgba(245,158,11,0.12)" : "#0e1610",
                                borderColor: isSelected ? "#f59e0b" : "rgba(255,255,255,0.08)",
                              }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[14px] font-bold text-[#f3f4f6]">{opt.label}</span>
                                {isSelected && (
                                  <div className="w-5 h-5 rounded-full bg-[#f59e0b] flex items-center justify-center">
                                    <Check className="w-3 h-3 text-[#070c08] stroke-[3]" />
                                  </div>
                                )}
                              </div>
                              {opt.subLabel && (
                                <div className="text-[11.5px] text-[#fbbf24] font-medium mb-1.5">{opt.subLabel}</div>
                              )}
                              <div className="text-[12px] text-[#9ca3af] leading-relaxed mb-3">
                                {opt.description || "High performance component engineered for demanding field operations."}
                              </div>
                              <div className="font-mono text-[11px] text-[#fbbf24] pt-2 border-t border-white/10 flex justify-between font-semibold">
                                <span>{opt.specImpact.payload || opt.specImpact.flightTime || opt.specImpact.range || "Standard Spec"}</span>
                                <span>{opt.specImpact.priceAdder ? `+${formatPrice(opt.specImpact.priceAdder)}` : "Base"}</span>
                              </div>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Drone Live Preview + Summary Panel */}
          <div className="space-y-7 lg:sticky lg:top-28">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="text-label text-[#22c55e] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                2. LIVE CONFIGURATION PREVIEW
              </div>
              <div className="text-label-sm text-[#9ca3af]">REAL-TIME TELEMETRY</div>
            </div>

            {/* Drone Render / Media Container */}
            <div
              className="relative rounded-sm overflow-hidden border border-white/15 shadow-2xl"
              style={{ background: "#050906" }}
            >
              {selections.payload === "screen" ? (
                <div className="relative w-full aspect-[16/10] bg-[#050906] flex items-center justify-center p-3 overflow-hidden">
                  <div className="relative h-[90%] aspect-[9/16] bg-[#030704] border-2 border-[#22c55e]/70 shadow-[0_0_35px_rgba(34,197,94,0.45)] rounded-sm overflow-hidden flex flex-col items-center justify-center p-4">
                    {/* Subtle LED screen grid & glow */}
                    <div className="absolute inset-0 goag-grid opacity-30 pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.22)_0%,rgba(245,158,11,0.08)_55%,transparent_80%)]" />

                    {/* GoAG Logo Displayed on the Screen */}
                    <div className="relative z-10 flex flex-col items-center justify-center w-full px-2">
                      <img
                        src={assetUrl("/logo.png")}
                        alt="GoAG Services Logo Displayed on Screen"
                        className="w-auto h-36 max-h-[65%] object-contain filter drop-shadow-[0_0_24px_rgba(34,197,94,0.85)] animate-pulse"
                      />
                    </div>

                    {/* Screen HUD Indicators */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-20">
                      <span className="text-[9px] font-mono bg-black/90 text-[#22c55e] px-2 py-0.5 border border-[#22c55e]/50 rounded font-bold whitespace-nowrap flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
                        AERIAL LED DISPLAY
                      </span>
                      <span className="text-[8px] font-mono text-[#fbbf24] bg-black/85 px-1.5 py-0.5 rounded border border-[#fbbf24]/40 font-bold">
                        9:16 HD
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-center pointer-events-none z-20">
                      <span className="text-[9px] font-mono text-[#d1d5db] bg-black/85 px-2.5 py-0.5 rounded border border-white/10 font-semibold tracking-wider">
                        GoAG SERVICES BROADCAST
                      </span>
                    </div>
                  </div>
                </div>
              ) : selections.payload === "hologram" ? (
                <div className="relative w-full aspect-[16/10] bg-[#030712] flex flex-col items-center justify-center p-4 overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.22)_0%,rgba(6,182,212,0.12)_45%,transparent_75%)]" />
                  {/* Spherical Hologram Visual */}
                  <div className="relative w-44 h-44 rounded-full border-2 border-[#22c55e]/60 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.45)] bg-[#22c55e]/[0.04]">
                    <div className="absolute inset-0 rounded-full border border-dashed border-[#06b6d4]/70 animate-spin [animation-duration:12s]" />
                    <div className="absolute inset-2 rounded-full border border-dotted border-[#f59e0b]/50 animate-spin [animation-duration:8s] [animation-direction:reverse]" />
                    <img
                      src={assetUrl("/logo.png")}
                      alt="GoAG Services 3D Spherical Hologram Logo"
                      className="h-28 w-auto object-contain filter drop-shadow-[0_0_24px_rgba(34,197,94,0.8)] animate-pulse relative z-10"
                    />
                  </div>
                  <div className="relative z-10 text-[11px] font-mono text-[#4ade80] mt-3 tracking-widest font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
                    SPHERICAL 3D HOLOGRAPHIC PROJECTION
                  </div>
                </div>
              ) : (
                <img
                  src={
                    selections.industry === "agriculture"
                      ? selections.payload === "sprayer"
                        ? assetUrl("/Spraying.webp") // Authentic GoAG maize spraying drone
                        : "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1000&q=80&fm=webp" // Agriculture spreader over field
                      : selections.payload === "solar-cleaning"
                      ? assetUrl("/solar-cleaning.jpeg") // Authentic GoAG solar cleaning drone
                      : selections.payload === "high-rise-cleaning"
                      ? assetUrl("/high-building-cleaning.jpeg") // Authentic GoAG building cleaning drone
                      : selections.payload === "flower-dropping"
                      ? "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=1000&q=80&fm=webp" // Colorful marigold flowers
                      : selections.payload === "winch-mechanism"
                      ? "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1000&q=80&fm=webp" // Cargo delivery winch & tether
                      : selections.payload === "thermal-fogger"
                      ? "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1000&q=80&fm=webp" // Orchard plantation
                      : "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1000&q=80&fm=webp" // Forest hill reforestation
                  }
                  alt="GoAG custom build drone render"
                  className="w-full aspect-[16/10] object-cover opacity-85 hover:opacity-100 transition-opacity"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070c08] via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-ping" />
                <span className="text-label text-[#22c55e] bg-[#070c08]/95 px-3 py-1.5 border border-[#22c55e]/40 backdrop-blur-md rounded-sm font-bold">
                  {selections.industry === "agriculture" ? "AGRI-DRONE RIG" : "SPECIALIZED RIG"}
                </span>
              </div>
              <div className="absolute top-4 right-4 text-label text-[#fbbf24] font-mono bg-[#070c08]/95 px-3 py-1.5 border border-[#f59e0b]/40 font-bold rounded-sm pointer-events-none">
                {selectedPayloadOpt?.label.toUpperCase() || "STANDARD"}
              </div>

              {/* Active Application overlay bar */}
              <div className="absolute bottom-3 left-4 right-4 bg-[#070c08]/90 backdrop-blur-md border border-white/10 p-3 rounded-sm flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                  <span className="text-[13px] font-bold text-[#f3f4f6]">{selectedPayloadOpt?.label}</span>
                </div>
                <span className="text-[11px] font-mono text-[#22c55e]">
                  {selections.industry === "agriculture"
                    ? "🌱 Authentic Maize Field"
                    : selections.payload === "winch-mechanism"
                    ? "📦 Motorized Winch (Cargo Only — No Spraying)"
                    : "⚙️ Industrial Environment"}
                </span>
              </div>
            </div>

            {/* Configured Drone Key Metrics Panel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0e1610] border border-white/12 p-5 rounded-sm shadow-xl">
              <div>
                <div className="text-label text-[#9ca3af] mb-1">PAYLOAD</div>
                <div className="text-[16px] font-bold text-[#f3f4f6] font-mono">{activeConfig.payload}</div>
              </div>
              <div>
                <div className="text-label text-[#9ca3af] mb-1">ENDURANCE</div>
                <div className="text-[16px] font-bold text-[#f3f4f6] font-mono">{activeConfig.flightTime}</div>
              </div>
              <div>
                <div className="text-label text-[#9ca3af] mb-1">RANGE</div>
                <div className="text-[16px] font-bold text-[#f3f4f6] font-mono">{activeConfig.range}</div>
              </div>
              <div>
                <div className="text-label text-[#fbbf24] mb-1 font-bold">EST. PRICE</div>
                <div className="text-[16.5px] font-bold text-[#fbbf24] font-mono">{formatPrice(activeConfig.totalPrice)}</div>
              </div>
            </div>

            {/* Action Buttons: Fly Simulator + Get Quote */}
            <div className="space-y-4">
              {/* FLY THIS CUSTOM BUILD BUTTON */}
              <button
                id="fly-simulator-btn"
                onClick={handleFlySimulator}
                className="w-full btn-outline py-4 rounded-sm text-[13px] flex items-center justify-center gap-3 border-[#22c55e]/50 bg-[#22c55e]/10 hover:bg-[#22c55e]/20 transition-all text-[#f3f4f6] font-bold"
              >
                <Play className="w-4 h-4 text-[#22c55e] fill-[#22c55e]" />
                FLY THIS CUSTOM BUILD (SIMULATOR)
              </button>

              {/* GET MY CUSTOM QUOTE BUTTON */}
              {quoteSubmitted ? (
                <div className="border border-[#22c55e]/50 bg-[#22c55e]/15 p-6 rounded-sm text-center shadow-xl">
                  <div className="w-10 h-10 rounded-full bg-[#22c55e]/20 border border-[#22c55e] flex items-center justify-center mx-auto mb-3">
                    <Check className="w-5 h-5 text-[#22c55e]" />
                  </div>
                  <div className="text-[#22c55e] text-label mb-1 font-bold">✓ QUOTE REQUEST SUBMITTED</div>
                  <p className="text-[#f3f4f6] text-[16px] font-bold mb-1">
                    Thank you, {formData.name || "Customer"}!
                  </p>
                  <p className="text-[#9ca3af] text-[14.5px]">
                    A GoAG engineer will review your {formData.profession || "custom"} requirements and contact you at <strong className="text-[#fbbf24]">{formData.phone}</strong> within 24 hours.
                  </p>
                </div>
              ) : (
                <button
                  id="get-quote-btn"
                  onClick={() => setShowQuoteModal(true)}
                  className="w-full btn-amber py-4.5 rounded-sm text-[13.5px] flex items-center justify-center gap-2 font-bold shadow-lg shadow-[#f59e0b]/20"
                >
                  GET MY CUSTOM QUOTE <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                id="reset-config-btn"
                onClick={handleReset}
                className="w-full py-2 text-[11px] text-[#9ca3af] hover:text-[#f3f4f6] transition-colors text-center font-mono"
              >
                RESET CONFIGURATION TO DEFAULT
              </button>
            </div>

            {/* Build Summary Breakdown */}
            <div className="border border-white/10 p-7 rounded-sm shadow-xl" style={{ background: "#0e1610" }}>
              <div className="text-label-sm text-[#f59e0b] mb-5 flex items-center justify-between font-bold">
                <span>SYSTEM COMPONENT SPECIFICATION</span>
                <span>ESTIMATED TOTAL</span>
              </div>
              <div className="space-y-3.5 divide-y divide-white/10">
                {displayedSections.map((sec) => {
                  const opt = sec.options.find((o) => o.id === selections[sec.id]);
                  return (
                    <div key={sec.id} className="pt-3 flex items-center justify-between text-[13.5px]">
                      <span className="text-[#9ca3af]">{sec.label}</span>
                      <span className="text-[#f3f4f6] font-semibold">{opt?.label || "—"}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 pt-5 border-t border-white/15 flex items-center justify-between font-mono">
                <span className="text-[#f3f4f6] font-bold text-[14px]">TOTAL ESTIMATED PRICE</span>
                <span className="text-[#fbbf24] font-bold text-[18px]">{formatPrice(activeConfig.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CUSTOM QUOTE MODAL ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showQuoteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQuoteModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-lg border border-[#f59e0b]/50 rounded-sm p-8 lg:p-10 shadow-2xl"
              style={{ background: "#0e1610" }}
            >
              <button
                onClick={() => setShowQuoteModal(false)}
                className="absolute top-5 right-5 text-[#9ca3af] hover:text-[#f3f4f6] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-label text-[#f59e0b] mb-2 font-bold">CUSTOM QUOTE REQUEST</div>
              <h2 className="text-[24px] font-bold text-[#f3f4f6] mb-3">
                ENTER YOUR CONTACT & MISSION DETAILS
              </h2>
              <p className="text-[14px] text-[#9ca3af] mb-8 leading-relaxed">
                Our lead drone engineers will review your configuration ({formatPrice(activeConfig.totalPrice)}) and contact you directly.
              </p>

              <form onSubmit={handleQuoteSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="quote-name" className="text-label-sm text-[#9ca3af] block mb-1.5 font-bold">
                    FULL NAME *
                  </label>
                  <input
                    id="quote-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 text-[13px] text-[#f3f4f6] border outline-none transition-colors rounded-sm"
                    style={{
                      background: "#070c08",
                      borderColor: formErrors.name ? "#ef4444" : "rgba(255,255,255,0.12)",
                    }}
                  />
                  {formErrors.name && <div className="text-[11.5px] text-[#ef4444] mt-1">{formErrors.name}</div>}
                </div>

                {/* Mobile Number */}
                <div>
                  <label htmlFor="quote-phone" className="text-label-sm text-[#9ca3af] block mb-1.5 font-bold">
                    MOBILE NUMBER *
                  </label>
                  <input
                    id="quote-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 text-[13px] text-[#f3f4f6] border outline-none transition-colors rounded-sm"
                    style={{
                      background: "#070c08",
                      borderColor: formErrors.phone ? "#ef4444" : "rgba(255,255,255,0.12)",
                    }}
                  />
                  {formErrors.phone && <div className="text-[11.5px] text-[#ef4444] mt-1">{formErrors.phone}</div>}
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="quote-email" className="text-label-sm text-[#9ca3af] block mb-1.5 font-bold">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    id="quote-email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 text-[13px] text-[#f3f4f6] border outline-none transition-colors rounded-sm"
                    style={{
                      background: "#070c08",
                      borderColor: formErrors.email ? "#ef4444" : "rgba(255,255,255,0.12)",
                    }}
                  />
                  {formErrors.email && <div className="text-[11.5px] text-[#ef4444] mt-1">{formErrors.email}</div>}
                </div>

                {/* Profession / Industry Application */}
                <div>
                  <label htmlFor="quote-profession" className="text-label-sm text-[#9ca3af] block mb-1.5 font-bold">
                    PROFESSION / INDUSTRY APPLICATION *
                  </label>
                  <select
                    id="quote-profession"
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    className="w-full px-4 py-3 text-[13px] text-[#f3f4f6] border border-white/15 outline-none transition-colors rounded-sm"
                    style={{ background: "#070c08" }}
                  >
                    <option value="Farmer / Agriculture Specialist">Farmer / Agriculture Specialist</option>
                    <option value="Defense & Security Officer">Defense & Security Officer</option>
                    <option value="Industrial Inspection & Survey">Industrial Inspection & Survey</option>
                    <option value="Drone Service Provider / Commercial Pilot">Drone Service Provider / Commercial Pilot</option>
                    <option value="Government & Forestry Department">Government & Forestry Department</option>
                    <option value="Academic / R&D Researcher">Academic / R&D Researcher</option>
                  </select>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="quote-submit-btn"
                  className="w-full btn-amber py-4.5 rounded-sm text-[12px] mt-3 flex items-center justify-center gap-2 font-bold shadow-lg shadow-[#f59e0b]/20"
                >
                  SUBMIT SPECIFICATION & REQUEST QUOTE <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
