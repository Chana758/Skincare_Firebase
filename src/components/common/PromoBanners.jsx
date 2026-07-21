// src/components/common/PromoBanners.jsx
import { Link } from "react-router-dom";

const PromoBanners = () => {
  return (
    <section className="px-6 md:px-20 py-16 bg-[#FDFBF9]">
      <div className="grid md:grid-cols-2 gap-6">

        {/* Special Offer */}
        <div className="relative bg-[#F9D9DA] rounded-2xl overflow-hidden h-[280px] flex items-center px-8 md:px-10">
          <div className="relative z-10 max-w-[240px]">
            <p className="text-xs uppercase tracking-[0.2em] text-rose-500 font-bold mb-3">
              Special Offer
            </p>
            <h3 className="text-2xl md:text-3xl font-serif text-gray-900 leading-snug mb-6">
              Up To 30% Off<br />On Skincare Products
            </h3>
            <Link
              to="/shop?category=serum"
              className="inline-block bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider px-7 py-3 rounded-full transition"
            >
              Shop Now
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80"
            alt="Skincare special offer"
            className="absolute right-0 bottom-0 h-[95%] object-contain object-bottom"
          />
        </div>

        {/* New Arrivals */}
        <div className="relative bg-[#F3E4D7] rounded-2xl overflow-hidden h-[280px] flex items-center px-8 md:px-10">
          <div className="relative z-10 max-w-[240px]">
            <p className="text-xs uppercase tracking-[0.2em] text-rose-500 font-bold mb-3">
              New Arrivals
            </p>
            <h3 className="text-2xl md:text-3xl font-serif text-gray-900 leading-snug mb-6">
              Fresh &amp; Trendy<br />Skincare Collection
            </h3>
            <Link
              to="/new_arrivals"
              className="inline-block bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider px-7 py-3 rounded-full transition"
            >
              Discover Now
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80"
            alt="New arrivals collection"
            className="absolute right-0 bottom-0 h-[95%] object-contain object-bottom"
          />
        </div>

      </div>
    </section>
  );
};

export default PromoBanners;