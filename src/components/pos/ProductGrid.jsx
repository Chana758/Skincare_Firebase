// src/components/pos/ProductGrid.jsx
import { useMemo, useState, useEffect } from "react";
import { Search, PackageX } from "lucide-react";
import { useProducts } from "../../hooks/useProducts";
import { shopCategories } from "../../data/products";
import { usePOSCart } from "../../context/POSCartContext";

const FONT_SERIF = { fontFamily: "'Playfair Display', Georgia, serif" };

const ProductGrid = () => {
  const { products, loading } = useProducts();
  const { addItem } = usePOSCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    console.log("Fetched Products:", products);
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category) {
      list = list.filter((p) => p.category?.toLowerCase() === category.toLowerCase());
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase() === q);
    }
    return list;
  }, [products, search, category]);

  return (
    <div className="bg-white rounded-3xl border border-gray-200/95 shadow-md p-6 h-full flex flex-col">
      
      {/* Search Input Bar */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search or scan product by name/SKU..."
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 text-xs md:text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition bg-gray-50/50 font-medium"
          autoFocus
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-nowrap gap-2 mb-5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide shrink-0">
        <button
          onClick={() => setCategory("")}
          className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-xs ${
            !category ? "bg-gray-900 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All Products
        </button>
        {shopCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-xs ${
              category === c.id ? "bg-gray-900 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Products Grid Content */}
      <div className="flex-1 overflow-y-auto pr-1">
        {loading ? (
          <div className="h-48 flex items-center justify-center text-xs font-bold uppercase tracking-widest text-gray-400">
            Loading products...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-3">
              <PackageX size={24} className="text-gray-400" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-600">No products match</p>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">Total products in store: {products.length}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => {
              const outOfStock = (p.stock ?? 0) <= 0;
              const productPrice = Number(p.price || 0);

              return (
                <button
                  key={p.id}
                  onClick={() => !outOfStock && addItem(p, 1)}
                  disabled={outOfStock}
                  className={`group text-left rounded-2xl border border-gray-200/90 overflow-hidden transition bg-white flex flex-col justify-between ${
                    outOfStock ? "opacity-40 cursor-not-allowed" : "hover:border-gray-900 hover:shadow-md"
                  }`}
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden relative">
                    <img 
                      src={p.image || "/placeholder.png"} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                    />
                    {outOfStock && (
                      <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[11px] font-extrabold uppercase tracking-widest backdrop-blur-[2px]">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 flex flex-col justify-between flex-1">
                    <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug">{p.name}</p>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                      <span className="text-sm font-extrabold text-emerald-600">${productPrice.toFixed(2)}</span>
                      <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg">
                        {p.stock ?? 0} left
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

export default ProductGrid;