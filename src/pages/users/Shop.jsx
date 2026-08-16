// src/pages/users/Shop.jsx
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Search, X, LayoutGrid, List, Sparkles } from "lucide-react";
import ProductCard from "../../components/common/ProductCard";
import { useProducts } from "../../hooks/useProducts";
import { shopCategories } from "../../data/products";

const PRICE_RANGES = [
  { id: "all", label: "All Prices", min: 0, max: Infinity },
  { id: "under25", label: "Under $25", min: 0, max: 25 },
  { id: "25-50", label: "$25 – $50", min: 25, max: 50 },
  { id: "50-100", label: "$50 – $100", min: 50, max: 100 },
  { id: "over100", label: "$100+", min: 100, max: Infinity },
];

const Shop = ({ forcedFilter, pageTitle }) => {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [view, setView] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];

    if (activeCategory) list = list.filter((p) => p.category === activeCategory);
    if (forcedFilter === "bestseller") list = list.filter((p) => p.bestseller);
    if (forcedFilter === "new") list = list.filter((p) => p.isNew);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name?.toLowerCase().includes(q));
    }

    const range = PRICE_RANGES.find((r) => r.id === priceRange);
    if (range && range.id !== "all") {
      list = list.filter((p) => p.price >= range.min && p.price < range.max);
    }

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "newest") list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

    return list;
  }, [products, activeCategory, forcedFilter, sort, search, priceRange]);

  const setCategory = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat) next.set("category", cat);
    else next.delete("category");
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setCategory("");
    setSearch("");
    setPriceRange("all");
    setSort("featured");
  };

  const hasActiveFilters = activeCategory || search || priceRange !== "all";

  const heading =
    pageTitle ||
    (forcedFilter === "bestseller" ? "Best Sellers" : forcedFilter === "new" ? "New Arrivals" : "Shop All");

  return (
    <main className="min-h-screen bg-white pt-10 pb-20">
      {/* Header Section */}
      <div className="text-center mb-10 px-6">
        <p className="text-xs uppercase tracking-[0.25em] text-rose-400 font-semibold mb-2">
          {forcedFilter ? "Curated For You" : "Discover Our Collection"}
        </p>
        <h1 className="text-3xl md:text-4xl font-serif tracking-wider text-gray-900 uppercase">
          {activeCategory ? shopCategories.find((c) => c.id === activeCategory)?.name : heading}
        </h1>
        
        {/* Luxury Divider */}
        <div className="flex items-center justify-center gap-3 mt-3">
          <div className="h-[2px] w-10 bg-rose-300" />
          <span className="text-rose-500 text-xs">
            <Sparkles size={14} />
          </span>
          <div className="h-[2px] w-10 bg-rose-300" />
        </div>
        <p className="text-[11px] text-gray-400 mt-2 tracking-widest uppercase">{filtered.length} products available</p>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Search & Actions Bar */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8 border-b border-rose-100 pb-6">
          {/* Categories Tab */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <button
              onClick={() => setCategory("")}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wider uppercase transition-all duration-300 ${
                !activeCategory
                  ? "bg-rose-500 text-white shadow-sm shadow-rose-200"
                  : "bg-rose-50/60 text-gray-700 hover:bg-rose-100"
              }`}
            >
              All
            </button>
            {shopCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wider uppercase transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-rose-500 text-white shadow-sm shadow-rose-200"
                    : "bg-rose-50/60 text-gray-700 hover:bg-rose-100"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search, Filter Toggle, Sort & View Mode */}
          <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
            <div className="relative flex-1 sm:flex-initial sm:w-52">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-8 py-2 rounded-full border border-rose-200 text-xs focus:outline-none focus:border-rose-400 bg-rose-50/20"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-1.5 text-[11px] font-medium tracking-wider uppercase border rounded-full px-4 py-2 transition ${
                showFilters ? "bg-gray-900 text-white border-gray-900" : "border-rose-200 text-gray-700 bg-rose-50/20 hover:bg-rose-50"
              }`}
            >
              <SlidersHorizontal size={12} /> Filters
            </button>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-rose-50/25 border border-rose-200 rounded-full px-3.5 py-2 outline-none text-[11px] font-medium tracking-wider uppercase cursor-pointer text-gray-700"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest</option>
            </select>

            <div className="hidden sm:flex items-center gap-1 border border-rose-200 rounded-full p-0.5 bg-rose-50/20">
              <button
                onClick={() => setView("grid")}
                className={`p-1.5 rounded-full transition ${view === "grid" ? "bg-rose-500 text-white" : "text-gray-500 hover:text-rose-500"}`}
              >
                <LayoutGrid size={13} />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-1.5 rounded-full transition ${view === "list" ? "bg-rose-500 text-white" : "text-gray-500 hover:text-rose-500"}`}
              >
                <List size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Price Filter Panel */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-2.5 mb-8 p-5 bg-rose-50/30 rounded-2xl border border-rose-100 animate-fadeIn">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-600 mr-2">
              Price Range:
            </span>
            {PRICE_RANGES.map((r) => (
              <button
                key={r.id}
                onClick={() => setPriceRange(r.id)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wider uppercase transition ${
                  priceRange === r.id ? "bg-rose-500 text-white shadow-sm" : "bg-white text-gray-600 border border-rose-100 hover:bg-rose-50"
                }`}
              >
                {r.label}
              </button>
            ))}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="ml-auto text-[11px] font-semibold uppercase tracking-widest text-rose-500 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Product Display Container */}
        {loading ? (
          <div className="flex justify-center items-center py-28">
            <div className="w-10 h-10 border-4 border-rose-300 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-rose-50/20 rounded-2xl border border-dashed border-rose-200">
            <Sparkles className="mx-auto text-rose-300 mb-3" size={32} />
            <h3 className="text-lg font-serif text-gray-800 mb-1">No Products Found</h3>
            <p className="text-xs text-gray-500 mb-6 tracking-wide">
              There are no products matching your selected filter criteria.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 bg-gray-900 text-white text-xs tracking-widest uppercase rounded-full hover:bg-rose-500 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-4xl mx-auto">
            {filtered.map((product) => (
              <div key={product.id} className="flex gap-6 items-center bg-white rounded-2xl p-4 border border-rose-100 hover:shadow-md transition">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 rounded-xl object-cover bg-rose-50 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-serif text-gray-900 truncate mb-1">{product.name}</h3>
                  <p className="text-xs text-rose-400 mb-2">{product.rating}★ ({product.reviews || 0} reviews)</p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900">${product.price}</span>
                    {product.oldPrice && (
                      <span className="text-xs text-gray-400 line-through">${product.oldPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Shop;