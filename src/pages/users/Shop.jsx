// src/pages/user/Shop.jsx
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { products, shopCategories } from "../../data/products";
import ProductCard from "../../components/common/ProductCard";

// forcedFilter: "bestseller" | "new" | undefined — ប្រើពេល route ជា /best_sellers ឬ /new_arrivals
// pageTitle: title ដែលបង្ហាញលើកំពូលទំព័រ (override default)
const Shop = ({ forcedFilter, pageTitle }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const [sort, setSort] = useState("featured");

  // useMemo - filter/sort តែម្តងគត់ ពេល dependencies ប្តូរ (មិនមែនរាល់ render)
  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory) list = list.filter((p) => p.category === activeCategory);
    if (forcedFilter === "bestseller") list = list.filter((p) => p.bestseller);
    if (forcedFilter === "new") list = list.filter((p) => p.isNew);

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [activeCategory, forcedFilter, sort]);

  const setCategory = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat) next.set("category", cat);
    else next.delete("category");
    setSearchParams(next);
  };

  const heading =
    pageTitle ||
    (forcedFilter === "bestseller" ? "Best Sellers" : forcedFilter === "new" ? "New Arrivals" : "Shop All");

  return (
    <main className="px-6 md:px-20 py-14 min-h-[70vh]">
      <div className="text-center max-w-xl mx-auto mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-rose-400 font-semibold mb-3">
          {forcedFilter ? "Curated For You" : "Shop All"}
        </p>
        <h1 className="text-3xl md:text-4xl font-serif text-gray-900">
          {activeCategory
            ? shopCategories.find((c) => c.id === activeCategory)?.name
            : heading}
        </h1>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("")}
            className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
              !activeCategory ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {shopCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                activeCategory === cat.id ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <SlidersHorizontal size={14} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-transparent outline-none text-sm font-medium cursor-pointer"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-400 py-20">មិនមានផលិតផលទេសម្រាប់ filter នេះ។</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Shop;