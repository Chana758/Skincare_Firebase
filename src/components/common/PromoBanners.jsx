
import { Link } from "react-router-dom";
import p1 from "../../assets/Uploads/Probenner/p-10.png";
import p2 from "../../assets/images/p11.png";
const PromoBanners = () => {
  return (
    <section className="px-6 md:px-20 py-16 bg-[#FDFBF9]">
      <div className="grid md:grid-cols-2 gap-6">

        {/* Special Offer */}
        <div className="relative bg-[#F9D9DA] rounded-3xl overflow-hidden h-[280px] flex items-center px-8 md:px-12 shadow-sm">
          <div className="relative z-10 max-w-[220px]">
            <p className="text-xs uppercase tracking-[0.2em] text-rose-500 font-bold mb-3">
              Special Offer
            </p>
            <h3 className="text-2xl md:text-3xl font-serif text-gray-900 leading-snug mb-6">
              Up To 30% Off<br />On Skincare
            </h3>
            <Link
              to="/shop?category=serum"
              className="inline-block bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider px-7 py-3 rounded-full transition shadow-md"
            >
              Shop Now
            </Link>
          </div>
          <div className="absolute inset-y-0 right-0 w-[45%] h-full">
            <img
              src={p1}
              alt="Skincare special offer"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* New Arrivals */}
        <div className="relative bg-[#F3E4D7] rounded-3xl overflow-hidden h-[280px] flex items-center px-8 md:px-12 shadow-sm">
          <div className="relative z-10 max-w-[220px]">
            <p className="text-xs uppercase tracking-[0.2em] text-rose-500 font-bold mb-3">
              New Arrivals
            </p>
            <h3 className="text-2xl md:text-3xl font-serif text-gray-900 leading-snug mb-6">
              Fresh &amp; Trendy<br />Collection
            </h3>
            <Link
              to="/new_arrivals"
              className="inline-block bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider px-7 py-3 rounded-full transition shadow-md"
            >
              Discover Now
            </Link>
          </div>
          <div className="absolute inset-y-0 right-0 w-[45%] h-full">
            <img
              src={p2}
              alt="New arrivals collection"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default PromoBanners;