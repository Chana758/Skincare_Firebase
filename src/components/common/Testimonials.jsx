// src/components/common/Testimonials.jsx
import { Star, Quote } from "lucide-react";
import { testimonials } from "../../data/products";

const Testimonials = () => {
  return (
    <section className="px-6 md:px-20 py-20 bg-[#FFECE7]">
      <div className="text-center max-w-xl mx-auto mb-12">
        <p className="text-xs uppercase tracking-[0.2em] text-rose-400 font-semibold mb-3">
          Testimonials
        </p>
        <h2 className="text-4xl font-serif text-gray-900">Loved By Our Customers</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-2xl p-7 flex flex-col shadow-sm">
            <Quote className="text-rose-300 mb-4" size={28} />
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < t.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}
                />
              ))}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-6">{t.text}</p>
            <div className="flex items-center gap-3">
              <img
                src={t.avatar}
                alt={t.name}
                loading="lazy"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-sm font-semibold text-gray-900">{t.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;