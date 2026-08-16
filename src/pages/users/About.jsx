// src/pages/user/About.jsx
import { Leaf, Rabbit, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const values = [
  {
    icon: Leaf,
    title: "Natural Ingredients",
    desc: "Pure components sourced directly from nature, entirely free of harsh chemicals.",
  },
  {
    icon: Rabbit,
    title: "Cruelty-Free",
    desc: "Never tested on animals — kind and ethical to your skin and the planet.",
  },
  {
    icon: ShieldCheck,
    title: "Expert Validated",
    desc: "Dermatologist-tested and clinically proven formulas for maximum safety.",
  },
];

const stats = [
  { number: "50K+", label: "Happy Customers" },
  { number: "120+", label: "Products Crafted" },
  { number: "15", label: "Countries Shipped" },
  { number: "4.8★", label: "Average Rating" },
];

const About = () => {
  return (
    <main className="min-h-screen bg-[#FDFBF9] overflow-hidden">
      {/* Hero Section */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto text-center pt-16 pb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 text-rose-500 text-xs font-semibold uppercase tracking-[0.2em] mb-4">
          <Sparkles size={13} /> Our Story
        </div>
        <h1 className="text-4xl md:text-6xl font-serif text-gray-900 mb-6 leading-[1.15]">
          The Beauty of
          <span className="block italic font-normal text-rose-400 mt-1">Simplicity</span>
        </h1>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          Skincare and beauty essentials crafted to bring out your natural radiance —
          without complexity, without compromise.
        </p>
      </section>

      {/* Hero Image */}
      <section className="px-6 md:px-12 max-w-6xl mx-auto mb-16">
        <div className="relative w-full h-80 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://i.pinimg.com/736x/84/2c/4e/842c4e2103dba378f418f497c65ef611.jpg"
            alt="Skincare routine"
            loading="lazy"
            className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 mb-20">
        <div className="bg-gray-900 rounded-3xl py-12 px-8 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white divide-y md:divide-y-0 md:divide-x divide-gray-800">
          {stats.map((s, idx) => (
            <div key={s.label} className={idx !== 0 ? "pt-6 md:pt-0" : ""}>
              <div className="text-3xl md:text-4xl font-serif text-rose-300 mb-1">{s.number}</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Founder Story */}
      <section className="px-6 md:px-12 py-12 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center mb-20">
        <div className="relative rounded-3xl overflow-hidden shadow-xl order-2 md:order-1 group">
          <img
            src="https://i.pinimg.com/736x/b7/5a/b3/b75ab3cd4e0a5594c92f7a860a1e83b4.jpg"
            alt="Founder mixing natural ingredients"
            loading="lazy"
            className="w-full h-[450px] object-cover group-hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-rose-950/10" />
        </div>
        <div className="order-1 md:order-2">
          <p className="text-xs uppercase tracking-[0.2em] text-rose-400 font-semibold mb-3">
            How We Started
          </p>
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-6 leading-tight">
            Founded on One Simple Belief
          </h2>
          <p className="text-gray-500 leading-relaxed mb-4 text-sm md:text-base">
            Lumière was founded on the belief that great skincare doesn't need to be
            complicated. We select natural, cruelty-free ingredients, validated by
            skincare experts, to help your skin glow and maintain its natural health.
          </p>
          <p className="text-gray-500 leading-relaxed text-sm md:text-base">
            What began as a small formulation studio has grown into a brand trusted
            by thousands — but our commitment to simplicity and transparency has
            never changed.
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 bg-white border-y border-rose-100/65 mb-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-rose-400 font-semibold mb-3">
              What We Stand For
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((item) => (
              <div
                key={item.title}
                className="p-8 bg-[#FDFBF9] border border-rose-100/80 rounded-3xl text-center hover:border-rose-300 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300">
                  <item.icon className="text-rose-400" size={24} />
                </div>
                <h3 className="font-serif text-xl text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission statement */}
      <section className="px-6 md:px-12 py-12 text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl md:text-4xl font-serif text-gray-900 mb-6">Our Unwavering Promise</h2>
        <p className="text-gray-500 text-base md:text-lg leading-relaxed">
          Every product is crafted with precision, focusing on quality, transparency,
          and real, lasting results for every unique skin type.
        </p>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 pb-24">
        <div className="rounded-3xl bg-gradient-to-r from-[#FFECE7] to-[#ffdcd4] px-8 md:px-20 py-16 text-center shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
              Ready to Start Your Glow?
            </h2>
            <p className="text-gray-600 mb-8 text-sm md:text-base">
              Discover the curated collection our customers can't stop talking about.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-rose-500 text-white text-xs font-semibold uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-lg"
            >
              Shop Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;