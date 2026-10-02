import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Clock, Zap, Droplets, Shield, ChevronRight, RotateCcw, Check } from "lucide-react";
import { products, productCategories } from "../data/products";
import SEO from "../components/common/SEO";
import { assetUrl } from "../utils/assets";

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? products
        : products.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  const featured = products[featuredIndex] || products[0];

  const productListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "GoAG Services Drone Fleet",
    "itemListElement": products.map((p, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "Product",
        "name": p.name,
        "description": p.description,
        "image": p.image,
        "url": `/products/${p.slug}`,
        "brand": {
          "@type": "Brand",
          "name": "GoAG Services"
        },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "url": `/products/${p.slug}`
        }
      }
    }))
  };

  return (
    <div className="min-h-screen" style={{ background: "#070c08" }}>
      <SEO
        title="Our Drone Fleet — Agrown-10X, Super Compact & Graydon | GoAG Services"
        description="Explore GoAG's indigenous UAV platforms: the medium-class Agrown-10X workhorse, the portable Agrown-10X Super Compact, and the multi-payload Graydon platform."
        keywords="Agrown-10X drone, Agrown-10X Super Compact, Graydon multi-payload drone, agricultural drone fleet, spraying drones India, heavy payload drone Hyderabad"
        canonical="/products"
        schema={productListSchema}
      />
      <div className="h-20" />

      {/* ── HEADER SECTION ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-16 border-b border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 goag-grid opacity-25 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          <div className="text-label text-[#f59e0b] mb-4 flex items-center justify-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
            PIONEERING AERIAL INTELLIGENCE · 80% INDIAN CONTENT
          </div>
          <h1
            className="font-bold text-[#f3f4f6] mb-5 tracking-tight leading-[1.12]"
            style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)" }}
          >
            OUR FLEET OF BEST TECH
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-white/80">
              • 80% Indigenous Indian Content
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-white/80">
              • Monsoon & Heat Hardened
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-white/80">
              • 2-Year Manufacturer Warranty
            </span>
          </div>
        </motion.div>
      </section>

      {/* ── CATEGORY FILTER STRIP ───────────────────────────────────────────── */}
      <div className="px-6 lg:px-16 py-7 border-b border-white/10 bg-[#090f0b]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0">
            {productCategories.map((cat) => (
              <button
                key={cat}
                id={`cat-${cat.toLowerCase()}`}
                onClick={() => setActiveCategory(cat)}
                className="px-6 py-3 text-label rounded-sm transition-all duration-200 whitespace-nowrap font-bold"
                style={{
                  color: activeCategory === cat ? "#070c08" : "#9ca3af",
                  background: activeCategory === cat ? "#f59e0b" : "#0e1610",
                  border: activeCategory === cat ? "1px solid #fbbf24" : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="text-label text-[#22c55e] font-mono tracking-widest">
            SHOWING {filtered.length} FLEET PLATFORMS
          </div>
        </div>
      </div>

      {/* ── FEATURED HIGHLIGHT DRONE ────────────────────────────────────────── */}
      <section className="px-6 lg:px-16 py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={featured.id}
              className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden rounded-sm border border-white/15 shadow-2xl" style={{ background: "#050906" }}>
                <img
                  src={assetUrl(featured.image)}
                  alt={featured.name}
                  className="w-full aspect-[16/10] object-cover opacity-85 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070c08] via-transparent to-transparent" />
                {featured.badge && (
                  <div className="absolute top-5 left-5 bg-[#f59e0b] text-[#070c08] text-label px-4 py-2 rounded-sm font-bold shadow-lg">
                    {featured.badge}
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono bg-black/75 backdrop-blur-md px-3.5 py-2 rounded border border-white/10 text-white/90">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" /> Indian Field Proven</span>
                  <span className="text-[#fbbf24]">{featured.specs.coverage || featured.specs.flightTime}</span>
                </div>
              </div>

              {/* Specs & Info */}
              <div className="space-y-7">
                <div>
                  <div className="text-label text-[#22c55e] mb-2">{featured.category.toUpperCase()} PLATFORM</div>
                  <h2
                    className="font-bold text-[#f3f4f6] tracking-tight mb-4 leading-[1.14]"
                    style={{ fontSize: "clamp(2rem, 3.8vw, 3.4rem)" }}
                  >
                    {featured.name}
                  </h2>
                <div className="space-y-2 py-1">
                  <div className="flex items-center gap-2.5 text-sm font-mono text-white/90">
                    <Check className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                    <span>{featured.highlights[0] || (featured.specs.tankCapacity ? `Quick-swap ${featured.specs.tankCapacity} smart liquid tank` : `High-capacity ${featured.specs.payload} payload`)}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm font-mono text-white/90">
                    <Check className="w-4 h-4 text-[#fbbf24] flex-shrink-0" />
                    <span>{featured.highlights[1] || `${featured.specs.coverage || featured.specs.flightTime} endurance with intelligent power telemetry`}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm font-mono text-white/90">
                    <Check className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                    <span>{featured.highlights[2] || "Centimeter-grade RTK precision with terrain-follow obstacle radar"}</span>
                  </div>
                </div>
              </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { icon: Droplets, label: "PAYLOAD / CAPACITY", val: featured.specs.tankCapacity || featured.specs.payload },
                    { icon: Clock, label: "FLIGHT ENDURANCE", val: featured.specs.flightTime },
                    { icon: Zap, label: "CRUISE SPEED", val: featured.specs.maxSpeed },
                    { icon: Shield, label: "ENVIRONMENTAL", val: featured.specs.waterResistance || "IP54 Rated" },
                  ].map((spec, i) => (
                    <div key={i} className="p-4 rounded-sm border border-white/10 bg-[#0e1610]">
                      <spec.icon className="w-5 h-5 text-[#fbbf24] mb-2" />
                      <div className="text-[#f3f4f6] text-[15.5px] font-bold font-mono mb-1">{spec.val}</div>
                      <div className="text-label-sm text-[#9ca3af] leading-tight">{spec.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to={`/products/${featured.slug}`}
                    id={`view-${featured.slug}`}
                    className="btn-amber px-8 py-4 inline-flex items-center gap-2 rounded-sm text-[13px] font-bold shadow-lg shadow-[#f59e0b]/20"
                  >
                    VIEW FULL SPECIFICATIONS <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/drone-360"
                    className="btn-outline px-6 py-4 inline-flex items-center gap-2 rounded-sm text-[13px] font-semibold border-green-500/40 text-green-400 hover:bg-green-500/10"
                  >
                    <RotateCcw className="w-4 h-4 text-[#22c55e]" />
                    360° INTERACTIVE VIEW
                  </Link>
                  <Link
                    to="/build-your-drone"
                    className="btn-outline px-8 py-4 inline-flex items-center gap-2 rounded-sm text-[13px] font-semibold"
                  >
                    CUSTOMIZE THIS MODEL
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── FLEET GRID ──────────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-16 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-12">
            <div className="text-label text-[#22c55e] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
              FULL FLEET CATALOGUE
            </div>
            <div className="text-label-sm text-[#9ca3af]">CLICK PRODUCT CARD TO INSPECT</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                className="group cursor-pointer border border-white/10 rounded-sm overflow-hidden bg-[#0e1610] hover:border-[#f59e0b]/50 transition-all duration-300 shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                onClick={() => setFeaturedIndex(products.indexOf(product))}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#050906]">
                  <img
                    src={assetUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1610] via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 text-label text-[#fbbf24] bg-[#070c08]/90 border border-[#f59e0b]/40 px-3 py-1 font-semibold rounded-sm">
                    {product.category.toUpperCase()}
                  </div>
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-mono bg-black/75 backdrop-blur-sm px-2.5 py-1 rounded border border-white/10 text-white/80">
                    <span>{product.specs.coverage || product.specs.payload}</span>
                    <span className="text-[#fbbf24]">{product.specs.flightTime}</span>
                  </div>
                </div>

                <div className="p-7 space-y-4">
                  <div>
                    <h3 className="font-bold text-[#f3f4f6] text-[22px] mb-2 group-hover:text-[#fbbf24] transition-colors">
                      {product.name}
                    </h3>
                    <div className="space-y-1.5 my-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                        <Check className="w-3.5 h-3.5 text-[#22c55e] flex-shrink-0" />
                        <span>{product.highlights[0] || `Coverage: ${product.specs.coverage || product.specs.payload}`}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                        <Check className="w-3.5 h-3.5 text-[#fbbf24] flex-shrink-0" />
                        <span>{product.highlights[1] || `Endurance: ${product.specs.flightTime} (${product.specs.range} Range)`}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 font-mono text-[13.5px]">
                    <div>
                      <span className="text-[#9ca3af] block text-label-sm mb-0.5">PAYLOAD</span>
                      <span className="text-[#22c55e] font-bold">{product.specs.tankCapacity || product.specs.payload}</span>
                    </div>
                    <div>
                      <span className="text-[#9ca3af] block text-label-sm mb-0.5">ENDURANCE</span>
                      <span className="text-[#fbbf24] font-bold">{product.specs.flightTime}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Link
                      to={`/products/${product.slug}`}
                      className="btn-outline py-3 inline-flex items-center justify-center gap-1.5 rounded-sm text-[12px] font-semibold"
                    >
                      SPECS <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to="/drone-360"
                      className="btn-amber py-3 inline-flex items-center justify-center gap-1.5 rounded-sm text-[12px] font-bold"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      360° VIEW
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
