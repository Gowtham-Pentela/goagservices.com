import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "HOME", to: "/" },
  { label: "360° STUDIO", to: "/drone-360" },
  { label: "OUR PRODUCTS", to: "/products" },
  { label: "BUILD YOUR DRONE", to: "/build-your-drone" },
  { label: "HOW IT WORKS", to: "/how-it-works" },
  { label: "OUR CAMPAIGNS", to: "/outreach" },
  { label: "ABOUT US", to: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 h-20 flex items-center justify-between border-b"
        style={{
          backgroundColor: scrolled ? "rgba(7, 12, 8, 0.96)" : "rgba(7, 12, 8, 0.85)",
          backdropFilter: "blur(16px)",
          borderColor: scrolled ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.06)",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center group py-1" aria-label="GoAG Services Home">
          <img
            src="/logo.png"
            alt="GoAG Services Logo"
            className="h-16 lg:h-18 w-auto max-w-[200px] object-contain transition-transform group-hover:scale-105 filter drop-shadow-md"
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive =
              link.to === "/"
                ? pathname === "/"
                : pathname.startsWith(link.to);
            return (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="relative text-label transition-colors duration-200 py-1"
                  style={{
                    color: isActive ? "#fbbf24" : "#9ca3af",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.target as HTMLElement).style.color = "#f3f4f6";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.target as HTMLElement).style.color = "#9ca3af";
                  }}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-[#22c55e] to-[#f59e0b]"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            id="nav-contact-btn"
            className="hidden md:inline-flex btn-amber px-6 py-2.5 text-[13px] rounded-sm shadow-md font-bold"
          >
            CONTACT US
          </Link>
          <button
            id="nav-menu-btn"
            onClick={() => setMenuOpen(true)}
            className="lg:hidden text-[#9ca3af] hover:text-[#f3f4f6] transition-colors p-1.5"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col"
            style={{ background: "#070c08" }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between px-6 h-20 border-b border-white/10">
              <Link to="/" className="flex items-center gap-2.5">
                <span className="font-bold tracking-[0.14em] text-[17px] text-[#f3f4f6]">
                  GoAG <span className="text-[#22c55e]">SERVICES</span>
                </span>
              </Link>
              <button
                id="nav-close-btn"
                onClick={() => setMenuOpen(false)}
                className="text-[#9ca3af] hover:text-[#f3f4f6] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile links */}
            <nav className="flex-1 flex flex-col justify-center px-8 gap-3">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={link.to}
                    className="block py-3 text-[24px] font-medium tracking-tight"
                    style={{
                      color: pathname.startsWith(link.to) ? "#fbbf24" : "#f3f4f6",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="px-8 pb-10">
              <Link
                to="/contact"
                className="block w-full btn-amber text-center py-4 rounded-sm font-bold"
              >
                CONTACT US / REQUEST DEMO
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
