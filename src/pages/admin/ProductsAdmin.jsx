// src/pages/admin/ProductsAdmin.jsx
import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Search, Star, RefreshCw, Package, Tag, Layers, Boxes } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useProducts } from "../../hooks/useProducts";
import ProductFormModal from "./ProductFormModal";

const FONT_SERIF = { fontFamily: "'Playfair Display', Georgia, serif" };

const StatBox = ({ label, value, subtext, icon: Icon, tint }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-200/95 shadow-md flex items-center justify-between">
    <div>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-500 mb-1">{label}</p>
      <p style={FONT_SERIF} className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
      {subtext && <p className="text-xs text-rose-500 font-bold mt-1">{subtext}</p>}
    </div>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${tint}`}>
      <Icon size={22} />
    </div>
  </div>
);

const ProductsAdmin = () => {
  const { products, loading } = useProducts();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter((p) => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
  }, [products, search]);

  const stats = useMemo(() => {
    const total = products.length;
    const bestsellers = products.filter(p => p.bestseller).length;
    const outOfStock = products.filter(p => (p.stock ?? 0) <= 0).length;
    return { total, bestsellers, outOfStock };
  }, [products]);

  const openAdd = () => { setEditingProduct(null); setModalOpen(true); };
  const openEdit = (p) => { setEditingProduct(p); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={FONT_SERIF} className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Product Management
          </h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1 font-semibold">
            Manage your store inventory, pricing, and product details
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid sm:grid-cols-3 gap-5">
        <StatBox 
          label="Total Products" 
          value={stats.total} 
          subtext="Active inventory" 
          icon={Package} 
          tint="bg-rose-100 text-rose-800 border border-rose-200" 
        />
        <StatBox 
          label="Best Sellers" 
          value={stats.bestsellers} 
          subtext="Top performing" 
          icon={Tag} 
          tint="bg-amber-100 text-amber-800 border border-amber-200" 
        />
        <StatBox 
          label="Out of Stock" 
          value={stats.outOfStock} 
          subtext="Needs restock" 
          icon={Boxes} 
          tint="bg-red-100 text-red-800 border border-red-200" 
        />
      </div>

      {/* Listing Section with Search */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h2 style={FONT_SERIF} className="text-lg font-bold text-gray-900">Inventory Catalog</h2>
            <p className="text-xs text-gray-600 font-medium mt-0.5">Search and manage all store items</p>
          </div>
          
          <div className="relative min-w-[260px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 text-xs font-bold text-gray-900 pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors shadow-2xs"
            />
          </div>
        </div>

        {loading ? (
          <div className="min-h-[30vh] flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 text-gray-800 animate-spin" />
              <p className="text-gray-700 text-xs font-bold uppercase tracking-widest animate-pulse">Loading products...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-gray-500">
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-300 flex items-center justify-center mb-3 shadow-sm">
              <Package size={20} />
            </div>
            <p className="text-sm font-bold text-gray-800">No products found</p>
            <p className="text-xs text-gray-500 mt-1">Try a different search query or add a new product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-600 border-b border-gray-200">
                  <th className="py-3.5 px-5">Product</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Price</th>
                  <th className="py-3.5 px-5">Stock</th>
                  <th className="py-3.5 px-5">Rating</th>
                  <th className="py-3.5 px-5">Tags</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filtered.map((p) => {
                  const stock = p.stock ?? 0;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-11 h-11 rounded-xl object-cover bg-gray-100 border border-gray-200 shadow-2xs" />
                          <span className="font-bold text-gray-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-gray-600 font-semibold capitalize">{p.category}</td>
                      <td className="py-4 px-5">
                        <span className="font-extrabold text-gray-900">${p.price}</span>
                        {p.oldPrice && <span className="text-gray-400 line-through ml-2 text-xs font-semibold">${p.oldPrice}</span>}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg border ${
                            stock <= 0
                              ? "bg-red-50 text-red-700 border-red-200"
                              : stock <= 5
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          {stock <= 0 ? "Out of stock" : `${stock} left`}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1 text-gray-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-xs">
                          <Star size={12} className="fill-amber-400 text-amber-400" /> {p.rating}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex gap-1.5">
                          {p.isNew && <span className="text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md border border-blue-200">New</span>}
                          {p.bestseller && <span className="text-[10px] font-extrabold uppercase bg-rose-100 text-rose-800 px-2.5 py-1 rounded-md border border-rose-200">Best</span>}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openEdit(p)} 
                            className="p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-900 hover:text-white transition-all shadow-2xl cursor-pointer" 
                            aria-label="Edit"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(p.id, p.name)} 
                            className="p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-2xl cursor-pointer" 
                            aria-label="Delete"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {modalOpen && <ProductFormModal product={editingProduct} onClose={closeModal} />}
    </div>
  );
};

export default ProductsAdmin;