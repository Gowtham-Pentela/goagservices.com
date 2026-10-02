import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Linkedin, Facebook, Mail, Phone, MapPin, Check } from "lucide-react";

const footerLinks = {
  "OUR PRODUCTS": [
    { label: "Agrown-x (10L Workhorse)", to: "/products/agrown-x" },
    { label: "Agrown-x Pro (Hexacopter)", to: "/products/agrown-x-pro" },
    { label: "Agrown-Swift 20 (Transformer)", to: "/products/agrown-swift20" },
    { label: "EcoGuardian (AI Analytics)", to: "/products/ecoguardian-series" },
    { label: "All Products", to: "/products" },
  ],
  COMPANY: [
    { label: "About Us", to: "/about" },
    { label: "How It Works", to: "/manufacturing" },
    { label: "Build Your Drone", to: "/build-your-drone" },
    { label: "Our Campaigns & FPOs", to: "/outreach" },
    { label: "Flight Simulator", to: "/simulator" },
    { label: "Contact Us", to: "/contact" },
  ],
  "CROP USE CASES": [
    { label: "Rice & Paddy Spraying", to: "/products" },
    { label: "Sugarcane Canopy Mist", to: "/products" },
    { label: "Arecanut Palm Care", to: "/products" },
    { label: "Tea Garden Protection", to: "/products" },
    { label: "Maize & Orchard Swaths", to: "/products" },
  ],
};

const socialLinks = [
  { Icon: Linkedin, href: "https://www.linkedin.com/company/wixstudio", label: "LinkedIn", id: "footer-linkedin" },
  { Icon: Facebook, href: "https://www.facebook.com/WixStudio/", label: "Facebook", id: "footer-facebook" },
  { Icon: Instagram, href: "https://www.instagram.com/wixstudio/", label: "Instagram", id: "footer-instagram" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer style={{ background: "#050906", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="px-6 lg:px-12 pt-20 pb-12 max-w-7xl mx-auto">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-5">
              <img
                src="/logo.png"
                alt="GoAG Services Logo"
                className="h-16 lg:h-20 w-auto object-contain filter drop-shadow-lg"
              />
            </Link>
            <p className="text-[#9ca3af] text-[15px] leading-relaxed mb-6 max-w-md">
              <strong>Built in India and Built for India.</strong>
              <br />
              Transform every phase of crop care with precision spraying drones, 80% Indian content, 100L single discharge capability, and ₹20/acre battery operating cost.
            </p>
            <div className="flex items-center gap-3 mb-8">
              {socialLinks.map(({ Icon, href, label, id }) => (
                <a
                  key={id}
                  id={id}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-10 h-10 border border-white/10 flex items-center justify-center text-[#9ca3af] hover:text-[#fbbf24] hover:border-[#f59e0b]/50 transition-all duration-200 rounded-sm bg-white/[0.02]"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Official contact */}
            <div className="space-y-3 max-w-md">
              <a
                href="mailto:go.agriculturalservices@gmail.com"
                className="flex items-center gap-2.5 text-[#9ca3af] text-[14px] hover:text-[#22c55e] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                <span>go.agriculturalservices@gmail.com</span>
              </a>
              <a
                href="tel:+919885589001"
                className="flex items-center gap-2.5 text-[#9ca3af] text-[14px] hover:text-[#22c55e] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#fbbf24] flex-shrink-0" />
                <span>+91 98855 89001</span>
              </a>
              <div className="flex items-start gap-2.5 text-[#9ca3af] text-[14px]">
                <MapPin className="w-4 h-4 text-[#22c55e] mt-1 flex-shrink-0" />
                <span>Plot No: 72/P, 3rd Floor Rajiv Gandhi Nagar, Kukatpally, P & B Heights, Industrial Development Area, Hyderabad, 500072 India</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {(Object.entries(footerLinks) as [string, { label: string; to: string }[]][]).map(
            ([section, links]) => (
              <div key={section}>
                <div className="text-label text-[#22c55e] mb-6 tracking-widest font-bold">{section}</div>
                <ul className="space-y-3.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-[#9ca3af] text-[14.5px] hover:text-[#fbbf24] transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>

        {/* Newsletter row */}
        <div className="border-t border-white/10 pt-10 mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="text-label text-[#f59e0b] mb-2 tracking-widest font-bold">
                GOAG FIELD INSIGHTS & UPDATES
              </div>
              <p className="text-[#9ca3af] text-[15px]">
                Get the latest news on precision agriculture, seasonal spray techniques, and FPO allotments.
              </p>
            </div>
            {subscribed ? (
              <div className="text-[#22c55e] text-label font-semibold border border-[#22c55e]/30 px-5 py-2.5 bg-[#22c55e]/10 rounded-sm flex items-center gap-2">
                <Check className="w-4 h-4" /> SUBSCRIBED TO GOAG FIELD INTELLIGENCE.
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex items-stretch gap-0 w-full md:w-auto md:min-w-[380px]"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-4 py-3 text-[14.5px] text-[#f3f4f6] bg-white/[0.04] border border-white/15 outline-none placeholder:text-[#6b7280] focus:border-[#22c55e] transition-colors rounded-l-sm"
                />
                <button
                  type="submit"
                  className="btn-amber px-6 py-3 text-[13px] font-bold whitespace-nowrap rounded-r-sm"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Legal bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-label-sm text-[#6b7280]">
            © 2026 GO-AG SERVICES PRIVATE LIMITED. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-label-sm text-[#9ca3af]">
              BUILT IN INDIA AND BUILT FOR INDIA
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
