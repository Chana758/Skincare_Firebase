// src/components/common/BestSellers.jsx
import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { products } from "../../data/products";
import ProductCard from "./ProductCard";

const BestSellers = () => {
  const scrollRef = useRef(null);
  const bestsellers = useMemo(() => products.filter((p) => p.bestseller), []);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstChild?.offsetWidth || 280;
    el.scrollBy({ left: direction === "left" ? -cardWidth - 24 : cardWidth + 24, behavior: "smooth" });
  };

  return (
    <section className="px-6 md:px-20 py-20 bg-[#FDFBF9] relative">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-rose-400 font-semibold mb-3">
            Customer Favorites
          </p>
          <h2 className="text-4xl font-serif text-gray-900">Best Sellers</h2>
        </div>
        <Link
          to="/best_sellers"
          className="hidden md:block text-sm font-semibold uppercase tracking-wider hover:text-rose-400 transition"
        >
          View All →
        </Link>
      </div>

      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-md rounded-full p-2.5 hover:bg-rose-50 transition hidden sm:flex items-center justify-center"
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {bestsellers.map((product) => (
            <div
              key={product.id}
              className="snap-start shrink-0 w-[45%] sm:w-[32%] md:w-[23%] lg:w-[19%]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-md rounded-full p-2.5 hover:bg-rose-50 transition hidden sm:flex items-center justify-center"
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>
      </div>
    </section>
  );
};

export default BestSellers;