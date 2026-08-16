import { useState, useEffect } from "react";
import { X, Upload, Trash2, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useCategories } from "../../hooks/useCategories";

const emptyForm = {
  name: "", price: "", oldPrice: "", category: "", barcode: "",
  image: "", rating: "4.5", reviews: "0", stock: "20", isNew: false, bestseller: false,
};

const ProductFormModal = ({ product, onClose }) => {
  const { categories } = useCategories();
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(product);

  // Top Alert / Toast State
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        price: product.price ?? "",
        oldPrice: product.oldPrice ?? "",
        category: product.category || categories[0]?.id || "",
        barcode: product.barcode || "",
        image: product.image || "",
        rating: product.rating ?? "4.5",
        reviews: product.reviews ?? "0",
        stock: product.stock ?? "0",
        isNew: Boolean(product.isNew),
        bestseller: Boolean(product.bestseller),
      });
      setImagePreview(product.image || "");
    } else if (categories.length > 0) {
      setForm((f) => ({ ...f, category: categories[0].id }));
    }
  }, [product, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setForm((f) => ({ ...f, image: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setForm((f) => ({ ...f, image: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      triggerToast("Please upload a product image first.", "warning");
      return;
    }
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        price: Number(form.price) || 0,
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        category: form.category,
        barcode: form.barcode.trim() || null,
        image: form.image,
        rating: Number(form.rating) || 0,
        reviews: Number(form.reviews) || 0,
        stock: Math.max(0, Number(form.stock) || 0),
        isNew: form.isNew,
        bestseller: form.bestseller,
      };

      if (isEdit) {
        await updateDoc(doc(db, "products", product.id), {
          ...payload,
          updatedAt: serverTimestamp(),
        });
        triggerToast("Product updated successfully!", "success");
      } else {
        await addDoc(collection(db, "products"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        triggerToast("New product added successfully!", "success");
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      triggerToast("Failed to save product: " + (err?.message || "Unknown error"), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[70] flex items-center justify-center p-4">
      {/* Top Banner Alert */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-[100] transition-all transform duration-300">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold ${
            toast.type === "success" ? "bg-emerald-900 text-white border-emerald-700" :
            toast.type === "error" ? "bg-rose-900 text-white border-rose-700" :
            "bg-amber-900 text-white border-amber-700"
          }`}>
            {toast.type === "success" && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
            {toast.type === "error" && <AlertTriangle size={18} className="text-rose-400 shrink-0" />}
            {toast.type === "warning" && <Info size={18} className="text-amber-400 shrink-0" />}
            <span>{toast.message}</span>
            <button type="button" onClick={() => setToast({ ...toast, show: false })} className="ml-2 opacity-70 hover:opacity-100 cursor-pointer">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <h2 className="text-xl font-serif text-gray-900 tracking-wide">{isEdit ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Product Name</label>
            <input
              type="text" name="name" required value={form.name} onChange={handleChange}
              placeholder="e.g. Radiant Glow Sunscreen SPF 50+"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition bg-gray-50/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Price ($)</label>
              <input
                type="number" step="0.01" name="price" required value={form.price} onChange={handleChange}
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition bg-gray-50/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Old Price ($)</label>
              <input
                type="number" step="0.01" name="oldPrice" value={form.oldPrice} onChange={handleChange}
                placeholder="Optional"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition bg-gray-50/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Stock Qty</label>
              <input
                type="number" min="0" step="1" name="stock" required value={form.stock} onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition bg-gray-50/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Category</label>
              <select
                name="category" value={form.category} onChange={handleChange} required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition bg-white"
              >
                {categories.length === 0 ? (
                  <option value="">No categories available</option>
                ) : (
                  categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Barcode <span className="text-gray-400 normal-case font-normal">(for POS scan)</span>
              </label>
              <input
                type="text" name="barcode" value={form.barcode} onChange={handleChange}
                placeholder="e.g. 8801234567890"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition bg-gray-50/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Product Image</label>
            {imagePreview ? (
              <div className="relative w-full h-44 rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center group">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                  <label className="px-4 py-2 bg-white/90 hover:bg-white text-gray-800 text-xs font-semibold rounded-xl cursor-pointer shadow-sm transition">
                    Change Image
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  <button type="button" onClick={handleRemoveImage} className="p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-sm transition cursor-pointer" title="Remove image">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <label className="w-full flex flex-col items-center justify-center py-6 px-4 border-2 border-dashed border-gray-200 hover:border-rose-400 rounded-2xl cursor-pointer bg-rose-50/20 hover:bg-rose-50/40 transition group">
                <div className="w-12 h-12 rounded-full bg-rose-50 group-hover:bg-rose-100 text-rose-400 flex items-center justify-center mb-2 transition">
                  <Upload size={20} />
                </div>
                <span className="text-xs font-bold text-gray-700 mb-0.5">Click to upload product image</span>
                <span className="text-[11px] text-gray-400">PNG, JPG, WEBP</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Rating</label>
              <input
                type="number" step="0.1" min="0" max="5" name="rating" value={form.rating} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition bg-gray-50/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"># Reviews</label>
              <input
                type="number" min="0" name="reviews" value={form.reviews} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition bg-gray-50/30"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2.5 text-sm font-medium text-gray-700 cursor-pointer select-none">
              <input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} className="accent-rose-500 w-4 h-4 rounded cursor-pointer" />
              New Arrival
            </label>
            <label className="flex items-center gap-2.5 text-sm font-medium text-gray-700 cursor-pointer select-none">
              <input type="checkbox" name="bestseller" checked={form.bestseller} onChange={handleChange} className="accent-rose-500 w-4 h-4 rounded cursor-pointer" />
              Best Seller
            </label>
          </div>

          <button
            type="submit" disabled={saving}
            className="w-full bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-full transition shadow-lg shadow-rose-200 disabled:opacity-60 mt-4 cursor-pointer"
          >
            {saving ? "Saving Product..." : isEdit ? "Save Changes" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;