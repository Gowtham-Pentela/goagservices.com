import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, MessageCircle, Mail, MapPin, Check, Building2, Clock } from "lucide-react";
import SEO from "../components/common/SEO";
import { contactInfo } from "../content/contact";

const contactMethods = [
  {
    icon: Phone,
    label: "CALL US",
    value: contactInfo.phones[0].display,
    href: contactInfo.phones[0].href,
    id: "contact-phone",
  },
  {
    icon: MessageCircle,
    label: "WHATSAPP",
    value: contactInfo.phones[0].display,
    href: `https://wa.me/${contactInfo.phones[0].numeric}`,
    id: "contact-whatsapp",
  },
  {
    icon: Mail,
    label: "EMAIL US",
    value: contactInfo.email,
    href: contactInfo.emailHref,
    id: "contact-email",
  },
  {
    icon: MapPin,
    label: "VISIT HEADQUARTERS",
    value: "Kukatpally Heights, Hyderabad",
    href: "#map",
    id: "contact-visit",
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "Product Purchase",
    requirement: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Valid email address required";
    if (!form.requirement.trim()) errs.requirement = "Please describe your field or drone requirements";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((er) => { const n = { ...er }; delete n[field]; return n; });
  };

  return (
    <div className="min-h-screen" style={{ background: "#070c08" }}>
      <SEO
        title="Contact Us & Request Live Demo | GoAG Services Hyderabad"
        description="Get in touch with GoAG Services in Hyderabad. Book a live field demonstration, inquire about FPO drone discounts, or apply for regional dealership."
        keywords="contact GoAG Services, request agricultural drone demo, agricultural drone dealer Hyderabad, FPO drone subsidy inquiry, Kukatpally drone factory"
        canonical="/contact"
      />
      <div className="h-20" />

      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12 border-b border-white/10 bg-[#090f0b]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-label text-[#f59e0b] mb-4 flex items-center gap-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
            GO-AG SERVICES PRIVATE LIMITED · HYDERABAD HEADQUARTERS
          </div>
          <h1
            className="font-bold text-[#f3f4f6] mb-4 tracking-tight leading-[1.12]"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)" }}
          >
            LET’S TAKE OFF, TOGETHER.
          </h1>
          <p className="text-[#9ca3af] text-[18px] max-w-3xl leading-relaxed">
            Whether you want to request a field demonstration, secure sprayer drones for your FPO, or become an authorized distributor, our team is ready to assist you.
          </p>
        </motion.div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left: contact info + office details */}
          <div className="space-y-10">
            {/* Contact methods */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {contactMethods.map((method, i) => (
                <motion.a
                  key={method.id}
                  id={method.id}
                  href={method.href}
                  className="flex items-center gap-4 px-6 py-5 border border-white/10 hover:border-[#f59e0b]/50 rounded-sm transition-all duration-200 group bg-[#0e1610] shadow-md"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className="w-12 h-12 border border-white/10 group-hover:border-[#f59e0b]/50 flex items-center justify-center flex-shrink-0 transition-colors bg-[#f59e0b]/10 rounded-sm">
                    <method.icon className="w-5 h-5 text-[#fbbf24]" />
                  </div>
                  <div>
                    <div className="text-label text-[#9ca3af] mb-1 font-mono font-bold">{method.label}</div>
                    <div className="text-[15px] text-[#f3f4f6] font-semibold break-all">{method.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Official Facility Address */}
            <div id="map" className="border border-white/10 rounded-sm bg-[#0e1610] shadow-2xl overflow-hidden">
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-2 text-label text-[#22c55e] font-bold">
                  <Building2 className="w-4 h-4" /> OFFICIAL REGISTERED OFFICE & WORKS
                </div>
                <h3 className="text-2xl font-bold text-[#f3f4f6]">
                  GoAG Services Private Limited
                </h3>
                <div className="text-[#d1d5db] text-[16px] leading-relaxed">
                  {contactInfo.address.fullFormatted}
                </div>
                <div className="pt-4 border-t border-white/10 space-y-2 text-[14.5px] text-[#9ca3af]">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#fbbf24]" /> Phone: <strong>{contactInfo.phones[0].display}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#22c55e]" /> Email: <strong>{contactInfo.email}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#9ca3af]" /> Hours: {contactInfo.hours}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#070c08] border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-[#9ca3af] font-mono">SUPPLY & SERVICE NETWORK</span>
                <span className="text-xs text-[#22c55e] font-mono font-bold">ALL 28 INDIAN STATES</span>
              </div>
            </div>
          </div>

          {/* Right: Contact & Demo Request form */}
          <div className="border border-white/10 p-8 lg:p-10 rounded-sm bg-[#0e1610] shadow-2xl">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  className="h-full flex flex-col items-center justify-center text-center py-16 px-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-20 h-20 border border-[#22c55e]/50 bg-[#22c55e]/15 flex items-center justify-center rounded-full mb-6 shadow-xl">
                    <Check className="w-10 h-10 text-[#22c55e]" />
                  </div>
                  <div className="text-label text-[#fbbf24] mb-3 font-bold">REQUEST TRANSMITTED</div>
                  <h2
                    className="font-bold text-[#f3f4f6] mb-4 text-2xl lg:text-3xl"
                  >
                    THANK YOU FOR REACHING OUT!
                  </h2>
                  <p className="text-[#9ca3af] text-[16px] leading-relaxed mb-8 max-w-md">
                    Our technical and agricultural specialists in Hyderabad will review your inquiry and reach back within 24 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", phone: "", interest: "Product Purchase", requirement: "" });
                    }}
                    className="btn-outline px-7 py-3.5 rounded-sm text-xs"
                  >
                    SUBMIT ANOTHER REQUEST
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  id="contact-form"
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div>
                    <div className="text-label text-[#22c55e] mb-2 font-bold">PARTNER WITH US / REQUEST DEMO</div>
                    <h2 className="text-2xl font-bold text-[#f3f4f6]">SEND US A MESSAGE</h2>
                  </div>

                  <div>
                    <label htmlFor="form-name" className="text-label text-[#9ca3af] block mb-2 font-mono font-bold">
                      Full Name *
                    </label>
                    <input
                      id="form-name"
                      type="text"
                      placeholder="e.g. Ramesh Patel"
                      value={form.name}
                      onChange={handleChange("name")}
                      className="w-full px-4 py-3.5 text-[15.5px] text-[#f3f4f6] border outline-none placeholder:text-[#6b7280] transition-colors rounded-sm"
                      style={{
                        background: "#070c08",
                        borderColor: errors.name ? "#ef4444" : "rgba(255,255,255,0.12)",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#f59e0b")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = errors.name ? "#ef4444" : "rgba(255,255,255,0.12)")}
                    />
                    {errors.name && <div className="text-[13px] text-[#ef4444] mt-1 font-medium">{errors.name}</div>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="form-phone" className="text-label text-[#9ca3af] block mb-2 font-mono font-bold">
                        Phone Number *
                      </label>
                      <input
                        id="form-phone"
                        type="tel"
                        placeholder="+91 98855 89001"
                        value={form.phone}
                        onChange={handleChange("phone")}
                        className="w-full px-4 py-3.5 text-[15.5px] text-[#f3f4f6] border outline-none placeholder:text-[#6b7280] transition-colors rounded-sm"
                        style={{
                          background: "#070c08",
                          borderColor: errors.phone ? "#ef4444" : "rgba(255,255,255,0.12)",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#f59e0b")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = errors.phone ? "#ef4444" : "rgba(255,255,255,0.12)")}
                      />
                      {errors.phone && <div className="text-[13px] text-[#ef4444] mt-1 font-medium">{errors.phone}</div>}
                    </div>

                    <div>
                      <label htmlFor="form-email" className="text-label text-[#9ca3af] block mb-2 font-mono font-bold">
                        Email Address *
                      </label>
                      <input
                        id="form-email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange("email")}
                        className="w-full px-4 py-3.5 text-[15.5px] text-[#f3f4f6] border outline-none placeholder:text-[#6b7280] transition-colors rounded-sm"
                        style={{
                          background: "#070c08",
                          borderColor: errors.email ? "#ef4444" : "rgba(255,255,255,0.12)",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#f59e0b")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = errors.email ? "#ef4444" : "rgba(255,255,255,0.12)")}
                      />
                      {errors.email && <div className="text-[13px] text-[#ef4444] mt-1 font-medium">{errors.email}</div>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="form-interest" className="text-label text-[#9ca3af] block mb-2 font-mono font-bold">
                      Primary Interest
                    </label>
                    <select
                      id="form-interest"
                      value={form.interest}
                      onChange={handleChange("interest")}
                      className="w-full px-4 py-3.5 text-[15.5px] text-[#f3f4f6] border border-white/15 outline-none transition-colors rounded-sm bg-[#070c08]"
                    >
                      <option value="Product Purchase">Drone Purchase (Agrown-10X / Super Compact / Graydon)</option>
                      <option value="FPO Special Discount">FPO Special Discount Scheme</option>
                      <option value="Dealership / Distributor">Dealership & Distribution Inquiry</option>
                      <option value="Demo Request">Request On-Field Live Demonstration</option>
                      <option value="Custom Agricultural Build">Custom Multipurpose Drone Build</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="form-requirement" className="text-label text-[#9ca3af] block mb-2 font-mono font-bold">
                      Your Crop, Acreage or Requirement *
                    </label>
                    <textarea
                      id="form-requirement"
                      placeholder="Mention your crops (e.g., paddy, sugarcane, tea, orchards), acreage, or specific payload requirements..."
                      value={form.requirement}
                      onChange={handleChange("requirement")}
                      rows={4}
                      className="w-full px-4 py-3.5 text-[15.5px] text-[#f3f4f6] border outline-none placeholder:text-[#6b7280] resize-none transition-colors rounded-sm"
                      style={{
                        background: "#070c08",
                        borderColor: errors.requirement ? "#ef4444" : "rgba(255,255,255,0.12)",
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#f59e0b")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = errors.requirement ? "#ef4444" : "rgba(255,255,255,0.12)")}
                    />
                    {errors.requirement && (
                      <div className="text-[13px] text-[#ef4444] mt-1 font-medium">{errors.requirement}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    id="contact-submit-btn"
                    className="w-full btn-amber py-4.5 rounded-sm text-[13.5px] font-bold tracking-wider shadow-lg shadow-[#f59e0b]/20"
                  >
                    REQUEST DEMO / TRANSMIT MESSAGE
                  </button>

                  <p className="text-label-sm text-[#9ca3af] text-center pt-2 font-mono">
                    Direct connection to GoAG Hyderabad HQ · Guaranteed response within 24 business hours
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
