import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Lazy-loaded routes for code splitting and instant initial page load
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Manufacturing = lazy(() => import("./pages/Manufacturing"));
const BuildDrone = lazy(() => import("./pages/BuildDrone"));
const Simulator = lazy(() => import("./pages/Simulator"));
const Outreach = lazy(() => import("./pages/Outreach"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Drone360Studio = lazy(() => import("./pages/Drone360Studio"));

// Fallback loader while route chunks stream in
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#f59e0b]/20 border-t-[#f59e0b] rounded-full animate-spin" />
        <span className="font-mono text-[11px] text-[#9ca3af] tracking-widest">INITIALIZING SUBSYSTEMS...</span>
      </div>
    </div>
  );
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

// Page transition wrapper
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Hide footer on simulator page
function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isSimulator = pathname === "/simulator";
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!isSimulator && <Footer />}
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <Layout>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
          <Route path="/products/:slug" element={<PageTransition><ProductDetail /></PageTransition>} />
          <Route path="/drone-360" element={<PageTransition><Drone360Studio /></PageTransition>} />
          <Route path="/manufacturing" element={<PageTransition><Manufacturing /></PageTransition>} />
          <Route path="/how-it-works" element={<PageTransition><Manufacturing /></PageTransition>} />
          <Route path="/build-your-drone" element={<PageTransition><BuildDrone /></PageTransition>} />
          <Route path="/simulator" element={<PageTransition><Simulator /></PageTransition>} />
          <Route path="/outreach" element={<PageTransition><Outreach /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          {/* 404 catch */}
          <Route path="*" element={
            <PageTransition>
              <div className="flex items-center justify-center min-h-[80vh] text-center px-6">
                <div>
                  <div className="font-mono text-[#f59e0b] text-[10px] tracking-widest mb-4">ERROR 404</div>
                  <h1 className="font-bold text-[#f3f4f6] mb-4" style={{ fontSize: "clamp(3rem, 8vw, 7rem)", letterSpacing: "-0.04em", lineHeight: 0.9 }}>
                    OFF COURSE.
                  </h1>
                  <p className="text-[#9ca3af] text-[14px] mb-8">This page has flown out of range.</p>
                  <a href="/" className="btn-amber px-6 py-3 rounded-sm inline-block">RETURN TO BASE</a>
                </div>
              </div>
            </PageTransition>
          } />
        </Routes>
      </AnimatePresence>
      </Suspense>
    </Layout>
  );
}
