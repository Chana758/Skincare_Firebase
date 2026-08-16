
import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import ProductCard from "./ProductCard";

const BestSellers = () => {
  const scrollRef = useRef(null);
  const { products, loading } = useProducts();
  const bestsellers = useMemo(() => products.filter((p) => p.bestseller), [products]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstChild?.offsetWidth || 280;
    el.scrollBy({ left: direction === "left" ? -cardWidth - 24 : cardWidth + 24, behavior: "smooth" });
  };

  return (
    <section className="px-6 md:px-20 py-20 bg-white relative">
      {/* Centered Luxury Header */}
      <div className="text-center mb-16">
        <h2 className="text-2xl md:text-3xl font-serif tracking-[0em] text-gray-900 uppercase">
          Best Sellers
        </h2>
        
        {/* Luxury Divider Style */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-[2px] w-16 bg-rose-400" />
          <span className="text-rose-600 text-xs">
            <Sparkles size={20} />
          </span>
          <div className="h-[2px] w-16 bg-rose-400" />
        </div>
      </div>

      <div className="relative max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 z-10 bg-white border border-rose-100 shadow-md rounded-full p-3 hover:bg-rose-50 text-gray-700 transition hidden sm:flex items-center justify-center"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Products Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {loading ? (
            <div className="w-full flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-rose-300 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : bestsellers.length === 0 ? (
            <div className="w-full text-center py-8 text-gray-400 text-sm italic">
              No best seller products available at the moment.
            </div>
          ) : (
            bestsellers.map((product) => (
              <div
                key={product.id}
                className="snap-start shrink-0 w-[70%] sm:w-[45%] md:w-[30%] lg:w-[22%]"
              >
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 z-10 bg-white border border-rose-100 shadow-md rounded-full p-3 hover:bg-rose-50 text-gray-700 transition hidden sm:flex items-center justify-center"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};

export default BestSellers;