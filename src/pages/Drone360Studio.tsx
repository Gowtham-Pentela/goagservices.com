import { useState } from "react";
import { Link } from "react-router-dom";
import {
  RotateCcw,
  Sparkles,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Play
} from "lucide-react";
import SEO from "../components/common/SEO";
import Drone360Viewer from "../components/common/Drone360Viewer";
import { DRONES_360_CATALOG } from "../data/drones360";

export default function Drone360Studio() {
  const [selectedDroneId, setSelectedDroneId] = useState<string>("10x-sprayer");

  return (
    <>
      <SEO
        title="360° Interactive Drone Studio | GoAG Services Hyderabad"
        description="Inspect GoAG's indigenous agricultural & industrial drones in high-definition 360-degree interactive 3D. Rotate, zoom, and inspect specifications for Agrown-10X, Agrown-10X Super Compact, and Graydon heavy-lift platforms."
        canonical="/drone-360"
        keywords="360 drone view, agricultural drone 3D, GoAG Agrown 10X 360, drone interactive viewer, Hyderabad drone manufacturer"
      />

      <div className="bg-[#050806] text-[#f3f4f6] min-h-screen pb-24">
        <div className="h-20" />
        {/* Header Section */}
        <section className="px-6 lg:px-12 max-w-7xl mx-auto pt-6 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider text-[#22c55e] bg-green-500/10 border border-green-500/20 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>VIRTUAL PRODUCT INSPECTION LAB</span>
              </div>
              <h1
                className="font-extrabold text-white tracking-tight"
                style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", letterSpacing: "-0.03em", lineHeight: 1.05 }}
              >
                360° INTERACTIVE <span className="text-gradient-green">DRONE STUDIO</span>
              </h1>
              <p className="text-white/70 text-base sm:text-lg max-w-2xl mt-3 leading-relaxed">
                Examine every millimeter of our DGCA certified drone platforms from every angle.
                Drag to rotate 360°, inspect dual-arm nozzles, modular carbon-fiber frames, and high-velocity granular spreaders.
              </p>
            </div>

            {/* Quick CTAs */}
            <div className="flex items-center gap-3">
              <Link
                to="/simulator"
                className="btn-amber px-5 py-3 rounded-lg text-xs font-mono font-bold tracking-wider inline-flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                <span>3D FLIGHT SIMULATOR</span>
              </Link>
              <Link
                to="/build-your-drone"
                className="btn-outline px-5 py-3 rounded-lg text-xs font-mono font-bold tracking-wider inline-flex items-center gap-2"
              >
                <span>BUILD CUSTOM DRONE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 360 Interactive Viewer Canvas Container */}
        <section className="px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto mb-16">
          <Drone360Viewer
            key={selectedDroneId}
            initialDroneId={selectedDroneId}
            showModelPicker={true}
            showSpecsPanel={true}
            onDroneChange={(drone) => setSelectedDroneId(drone.id)}
          />
        </section>

        {/* Drone Lineup Grid */}
        <section className="px-6 lg:px-12 max-w-7xl mx-auto mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-xs font-mono text-[#22c55e] tracking-widest uppercase">LINEUP OVERVIEW</div>
              <h2 className="text-2xl font-bold text-white mt-1">Select a Drone Model to Inspect in 360°</h2>
            </div>
            <div className="text-xs font-mono text-white/50">
              {DRONES_360_CATALOG.length} MODELS AVAILABLE
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {DRONES_360_CATALOG.map((drone) => {
              const isSelected = drone.id === selectedDroneId;
              return (
                <div
                  key={drone.id}
                  onClick={() => {
                    setSelectedDroneId(drone.id);
                    window.scrollTo({ top: 180, behavior: "smooth" });
                  }}
                  className={`group relative rounded-xl border p-5 cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "bg-green-500/10 border-[#22c55e] shadow-xl shadow-green-500/10"
                      : "bg-[#0b120d] border-white/10 hover:border-white/20 hover:bg-[#0f1711]"
                  }`}
                >
                  {/* Category Pill */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-white/5 text-white/70 border border-white/10">
                      {drone.payloadType.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-[#22c55e]">
                      {drone.frameCount} ANGLES
                    </span>
                  </div>

                  {/* Thumbnail */}
                  <div className="relative aspect-video flex items-center justify-center p-3 mb-4 rounded-lg bg-black/40 overflow-hidden">
                    <img
                      src={drone.poster}
                      alt={drone.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] font-mono text-white/80 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      <RotateCcw className="w-3 h-3 text-[#22c55e]" />
                      360°
                    </div>
                  </div>

                  {/* Details */}
                  <h3 className="font-bold text-base text-white group-hover:text-[#22c55e] transition-colors">
                    {drone.name}
                  </h3>
                  <div className="text-xs text-white/50 mb-3">{drone.series}</div>

                  {/* Quick specs snippet */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-3 border-t border-white/5 text-white/60">
                    <div>
                      <span className="text-white/30 block">CAPACITY</span>
                      <span className="text-white/90 font-medium">{drone.specs.capacity || drone.specs.maxPayload}</span>
                    </div>
                    <div>
                      <span className="text-white/30 block">SWATH</span>
                      <span className="text-white/90 font-medium">{drone.specs.sprayWidth || drone.specs.spreadWidth || "Modular"}</span>
                    </div>
                  </div>

                  <button
                    className={`w-full mt-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? "bg-[#22c55e] text-black"
                        : "bg-white/5 text-white/70 group-hover:bg-[#22c55e] group-hover:text-black"
                    }`}
                  >
                    <span>{isSelected ? "CURRENTLY VIEWING" : "LOAD IN 360°"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Engineering Highlights */}
        <section className="px-6 lg:px-12 max-w-7xl mx-auto">
          <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-[#0c1610] to-[#070d09] border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#22c55e]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1">Aeronautical Grade Materials</h4>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Fabricated from Toray 3K twill carbon fiber and CNC 7075 aviation aluminum for ultimate rigidity and weather resistance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Cpu className="w-6 h-6 text-[#f59e0b]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1">Triple Redundant Avionics</h4>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Dual RTK GNSS centimeter positioning, millimeter-wave terrain radar, and fail-safe return-to-home autonomous flight logic.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-[#22c55e]" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1">Guaranteed Operational ROI</h4>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Designed for Indian farmers with ₹20/acre battery cost, ₹50/acre maintenance, and full 2-year manufacturer warranty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
