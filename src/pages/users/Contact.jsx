// src/pages/user/Contact.jsx
import { useState } from "react";
import { 
  Mail, Phone, MapPin, Clock, Send, Sparkles, 
  ShieldCheck, CreditCard, RefreshCw, Headphones 
} from "lucide-react";
import { createContactMessage } from "../../services/messageService";

const GildedDivider = () => (
  <div className="flex items-center justify-center gap-3 my-5" aria-hidden="true">
    <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#C9A227]" />
    <span className="w-2 h-2 rotate-45 bg-[#C9A227]" />
    <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#C9A227]" />
  </div>
);

const contactDetails = [
  { icon: MapPin, label: "Visit Our Boutique", value: "128 Riverside Blvd, Phnom Penh, Cambodia" },
  { icon: Phone, label: "Direct Line", value: "+855 12 345 678" },
  { icon: Mail, label: "Electronic Mail", value: "hello@lumiere.beauty" },
  { icon: Clock, label: "Working Hours", value: "Mon – Sat, 9:00 AM – 6:00 PM" },
];

const perks = [
  { icon: ShieldCheck, title: "100% Authentic", desc: "Certified premium skincare formulas" },
  { icon: CreditCard, title: "Secure Checkout", desc: "Encrypted & protected payments" },
  { icon: RefreshCw, title: "Easy Returns", desc: "30-day unconditional guarantee" },
  { icon: Headphones, title: "Concierge Support", desc: "Dedicated 24/7 expert assistance" },
];

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await createContactMessage(form);
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF9] text-gray-900 relative selection:bg-rose-100 selection:text-rose-900">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-rose-100/60 via-amber-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="px-6 md:px-20 max-w-4xl mx-auto text-center pt-20 pb-12">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-rose-700 text-xs font-extrabold uppercase tracking-[0.25em] mb-6 shadow-md border border-rose-200">
          <Sparkles size={14} className="text-[#C9A227]" /> We'd Love to Hear From You
        </div>
        <h1 className="text-4xl md:text-6xl font-serif text-gray-900 mb-3 font-bold tracking-tight">
          Get In Touch With Lumière
        </h1>
        <GildedDivider />
        <p className="text-gray-700 leading-relaxed max-w-xl mx-auto text-sm md:text-base font-medium">
          Have inquiries about our luxury formulations, order tracking, or bespoke partnerships? 
          Our advisory team responds personally within one business day.
        </p>
      </section>

      {/* Main Content Grid: Info & Form */}
      <section className="px-6 md:px-20 max-w-7xl mx-auto pb-24 grid lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Unified Boutique Info Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-3xl border-2 border-rose-200 shadow-xl shadow-rose-900/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-50 rounded-bl-full pointer-events-none border-b border-l border-amber-100" />
            
            <div className="relative z-10 mb-8">
              <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#C9A227] block mb-2">
                Concierge Desk
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Contact Information</h2>
              <p className="text-xs text-gray-700 font-semibold mt-2 leading-relaxed">
                Connect directly with our client care specialists for personalized consultation.
              </p>
            </div>

            <div className="space-y-6 relative z-10">
              {contactDetails.map((item) => (
                <div key={item.label} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-[#FBF5E6] border-2 border-[#C9A227]/40 flex items-center justify-center shrink-0 group-hover:bg-[#C9A227] group-hover:border-[#C9A227] transition-all duration-300 shadow-sm">
                    <item.icon size={20} className="text-[#C9A227] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-gray-900 mb-1">
                      {item.label}
                    </h4>
                    <p className="text-sm text-gray-800 font-bold leading-relaxed">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Hours Note */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-800 flex items-center justify-between">
            <div>
              <h4 className="font-serif font-bold text-sm text-white mb-1">Need immediate assistance?</h4>
              <p className="text-xs text-gray-300 font-medium">Call our hotline directly during business hours.</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] shrink-0 shadow-inner">
              <Phone size={20} />
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-rose-200 p-8 md:p-12 shadow-2xl shadow-rose-900/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-36 h-36 bg-rose-50 rounded-br-full pointer-events-none border-r border-b border-rose-100" />

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-2 font-bold">Send a Message</h2>
            <p className="text-sm text-gray-700 font-semibold mb-8">
              Fill out the form below and our concierge team will get back to you shortly.
            </p>

            {status === "sent" ? (
              <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-900 text-sm rounded-2xl px-8 py-12 text-center space-y-4 shadow-sm">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold border border-emerald-300">✓</div>
                <h3 className="font-serif font-bold text-xl text-emerald-900">Message Sent Successfully</h3>
                <p className="text-xs text-emerald-800 font-semibold max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. We have received your message and will reply within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="inline-block mt-3 text-xs text-emerald-900 bg-emerald-200 hover:bg-emerald-300 px-6 py-3 rounded-full font-extrabold transition cursor-pointer shadow-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-900 mb-2">
                      Full Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Victoria Sterling"
                      className="w-full px-4.5 py-4 rounded-2xl border-2 border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] bg-white text-gray-900 font-semibold transition shadow-sm placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-900 mb-2">
                      Email Address <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="victoria@example.com"
                      className="w-full px-4.5 py-4 rounded-2xl border-2 border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] bg-white text-gray-900 font-semibold transition shadow-sm placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-900 mb-2">
                    Subject <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Product inquiry, order status, partnership..."
                    className="w-full px-4.5 py-4 rounded-2xl border-2 border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] bg-white text-gray-900 font-semibold transition shadow-sm placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-900 mb-2">
                    Message <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Write your message in detail here..."
                    className="w-full px-4.5 py-4 rounded-2xl border-2 border-gray-300 text-sm outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] bg-white text-gray-900 font-semibold transition shadow-sm resize-none placeholder:text-gray-400"
                  />
                </div>

                {status === "error" && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-700 text-xs font-bold text-center">
                    Something went wrong sending your message. Please try again.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full inline-flex items-center justify-center gap-3 bg-gray-900 hover:bg-[#C9A227] text-white text-xs font-extrabold uppercase tracking-widest px-8 py-4.5 rounded-2xl transition-all duration-300 shadow-xl disabled:opacity-60 cursor-pointer group"
                >
                  <Send size={15} className="group-hover:translate-x-1 transition-transform" />
                  {status === "sending" ? "Sending Message..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="px-6 md:px-20 max-w-7xl mx-auto pb-20">
        <div className="text-center mb-8">
          <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#C9A227] block mb-2">
            Location & Directions
          </span>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
            Visit Our Flagship Boutique
          </h3>
          <p className="text-xs md:text-sm text-gray-700 font-semibold mt-2">
            128 Riverside Blvd, Phnom Penh, Cambodia
          </p>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-rose-200 h-80 md:h-[450px] relative bg-white">
          <iframe
            title="Lumière location"
            src="https://maps.google.com/maps?q=Phnom%20Penh&t=&z=14&ie=UTF8&hl=en&iwloc=&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </section>

      {/* Perks Cards Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-20 pb-24">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {perks.map((p) => (
            <div
              key={p.title}
              className="bg-white p-6 rounded-3xl border-2 border-rose-100 shadow-lg hover:border-[#C9A227] hover:shadow-xl transition-all duration-300 text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#C9A227] group-hover:border-[#C9A227] transition-all duration-300">
                <p.icon size={20} className="text-rose-500 group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-serif text-gray-900 font-extrabold mb-1 text-base">{p.title}</h4>
              <p className="text-xs text-gray-700 font-semibold">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Contact;