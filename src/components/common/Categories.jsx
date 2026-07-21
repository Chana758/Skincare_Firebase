// src/components/common/Categories.jsx
import { Link } from "react-router-dom";
import { shopCategories } from "../../data/products";

const Categories = () => {
  return (
    <section id="categories" className="px-6 md:px-20 py-16 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-serif tracking-wide text-gray-900 uppercase">
          Shop By Category
        </h2>
        <div className="w-10 h-0.5 bg-rose-300 mx-auto mt-3" />
      </div>

      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        {shopCategories.map((cat) => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.id}`}
            className="group flex flex-col items-center"
          >
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden bg-[#F7EFEC] mb-4 ring-1 ring-transparent group-hover:ring-rose-300 transition">
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-1">
              {cat.name}
            </span>
            <span className="text-xs text-rose-400 font-medium group-hover:underline">
              Shop Now →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;