// src/components/common/Categories.jsx
import { Link } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";
import { Sparkles } from "lucide-react";

const Categories = () => {
  const { categories, loading } = useCategories();

  if (!loading && categories.length === 0) return null;

  return (
    <section id="categories" className="px-4 md:px-16 py-12 bg-white">
      {/* Section Header with Luxury Icon Divider */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-serif tracking-[0em] text-gray-900 uppercase">
          Shop By Category
        </h2>
        
        {/* Luxury Divider Style */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-[2px] w-20 bg-rose-600" />
          <span className="text-rose-400 text-xs">
            <Sparkles size={20} />
          </span>
          <div className="h-[2px] w-20 bg-rose-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-rose-300 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 sm:grid-cols-2 md:flex md:flex-wrap justify-center items-center gap-4 md:gap-12">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group flex flex-col items-center text-center cursor-pointer p-5 md:p-0 bg-white md:bg-transparent rounded-2xl md:rounded-none border border-rose-100/80 md:border-none shadow-sm md:shadow-none hover:shadow-md transition-all duration-500 w-full md:w-[180px]"
            >
              {/* Circular Image Container with Soft Luxury Ring */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-46 md:h-46 rounded-full overflow-hidden bg-rose-50/50 p-1.5 border border-rose-100 shadow-sm group-hover:border-rose-400 group-hover:shadow-md transition-all duration-500 mb-3 md:mb-4">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Category Name */}
              <span className="text-[11px] md:text-sm font-bold uppercase tracking-[0.15em] text-gray-900 mb-1 group-hover:text-rose-500 transition-colors">
                {cat.name}
              </span>

              {/* Shop Now Action */}
              <span className="text-[10px] md:text-[11px] text-rose-400 font-medium tracking-wider group-hover:translate-x-1 transition-transform">
                Shop Now &rarr;
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default Categories;