// src/pages/admin/CategoriesAdmin.jsx
import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, LayoutGrid, GripVertical, RefreshCw, Search, Folder, Image as ImageIcon, Upload, Tag } from "lucide-react";
import { useCategories } from "../../hooks/useCategories";
import { upsertCategory, deleteCategory } from "../../services/categoryService";

const FONT_SERIF = { fontFamily: "'Playfair Display', Georgia, serif" };
const emptyForm = { id: "", name: "", image: "", order: "0" };

const StatBox = ({ label, value, subtext, icon: Icon, tint, badgeText, badgeColor }) => (
  <div className="bg-white rounded-3xl p-6 border border-gray-200/95 shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${tint}`}>
        <Icon size={22} />
      </div>
      {badgeText && (
        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${badgeColor}`}>
          {badgeText}
        </span>
      )}
    </div>
    <div>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-400 mb-1">{label}</p>
      <p style={FONT_SERIF} className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
      {subtext && <p className="text-xs text-gray-500 font-semibold mt-1">{subtext}</p>}
    </div>
  </div>
);

const CategoriesAdmin = () => {
  const { categories, loading } = useCategories();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Handle and compress image file before converting to base64
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with 0.6 quality to ensure it's very small for Firestore (< 30KB)
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
        setForm((f) => ({ ...f, image: compressedBase64 }));
      };
    };
    reader.readAsDataURL(file);
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setForm({ id: cat.id, name: cat.name, image: cat.image, order: String(cat.order ?? 0) });
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id.trim() || !form.name.trim() || !form.image.trim()) return;
    setSaving(true);
    try {
      await upsertCategory(form);
      alert(editingId ? "Category updated successfully!" : "Category added successfully!");
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert("Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? Products already tagged with it will keep the old category value.`)) return;
    try {
      await deleteCategory(id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete category.");
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const stats = useMemo(() => {
    const total = categories.length;
    const withMedia = categories.filter(c => c.image && c.image.trim() !== "").length;
    return { total, withMedia };
  }, [categories]);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Main Banner Header */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-200 shrink-0">
            <LayoutGrid size={26} />
          </div>
          <div>
            <h1 style={FONT_SERIF} className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Category Management
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1 font-semibold">
              Manage and organize your store menu categories
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (showForm) cancelEdit();
            else setShowForm(true);
          }}
          className={`flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-2xl transition-all shadow-sm cursor-pointer self-start sm:self-auto ${
            showForm 
              ? "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100" 
              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
          }`}
        >
          <Plus size={16} /> {showForm ? "Close Form" : "Add New Category"}
        </button>
      </div>

      {/* Stats Overview Grid with Custom Icons & Colors */}
      <div className="grid sm:grid-cols-3 gap-5">
        <StatBox 
          label="Total Categories" 
          value={stats.total} 
          subtext="All active categories" 
          icon={LayoutGrid} 
          tint="bg-emerald-500 text-white shadow-emerald-200" 
          badgeText="Catalog" 
          badgeColor="bg-emerald-50 text-emerald-700 border-emerald-200"
        />
        <StatBox 
          label="With Media" 
          value={stats.withMedia} 
          subtext="Contains thumbnail" 
          icon={ImageIcon} 
          tint="bg-blue-600 text-white shadow-blue-200" 
          badgeText="Media" 
          badgeColor="bg-blue-50 text-blue-700 border-blue-200"
        />
        <StatBox 
          label="Filtered" 
          value={filteredCategories.length} 
          subtext="Search results match" 
          icon={Folder} 
          tint="bg-amber-500 text-white shadow-amber-200" 
          badgeText="Results" 
          badgeColor="bg-amber-50 text-amber-700 border-amber-200"
        />
      </div>

      {/* Expandable Form Section */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 space-y-6 shadow-sm transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h2 style={FONT_SERIF} className="text-lg font-bold text-gray-900">
              {editingId ? `Editing Category: "${editingId}"` : "Add New Category"}
            </h2>
            <button 
              type="button" 
              onClick={cancelEdit}
              className="text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Inputs */}
            <div className="md:col-span-2 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-500 mb-1.5">
                    <Tag size={13} className="text-rose-500" /> Slug (id)
                  </label>
                  <input
                    type="text" name="id" required value={form.id} onChange={handleChange}
                    disabled={Boolean(editingId)}
                    placeholder="e.g. serum"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50/50 outline-none focus:border-emerald-600 focus:bg-white transition-all disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-500 mb-1.5">
                    <Folder size={13} className="text-emerald-500" /> Display Name
                  </label>
                  <input
                    type="text" name="name" required value={form.name} onChange={handleChange}
                    placeholder="e.g. Serum"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50/50 outline-none focus:border-emerald-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-500 mb-1.5">
                  <GripVertical size={13} className="text-amber-500" /> Display Order
                </label>
                <input
                  type="number" name="order" value={form.order} onChange={handleChange}
                  className="w-full sm:w-1/2 px-4 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50/50 outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Right Side: File Upload & Preview */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-500 mb-1.5">
                <Upload size={13} className="text-blue-500" /> Category Image
              </label>
              
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-4 bg-gray-50/50 hover:bg-gray-50 transition relative group text-center">
                {form.image ? (
                  <div className="relative w-full h-28 rounded-xl overflow-hidden shadow-xs">
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs font-bold cursor-pointer">
                      Change Image
                      <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-28 cursor-pointer">
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-xs flex items-center justify-center text-blue-600 mb-2 border border-gray-100">
                      <Upload size={18} />
                    </div>
                    <span className="text-xs font-bold text-gray-700">Click to upload image</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">PNG, JPG (Auto-compressed)</span>
                    <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={cancelEdit}
              className="px-6 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit" 
              disabled={saving}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-7 py-3 rounded-2xl transition-all shadow-sm disabled:opacity-60 cursor-pointer"
            >
              <Plus size={16} /> {saving ? "Saving..." : editingId ? "Save Changes" : "Add Category"}
            </button>
          </div>
        </form>
      )}

      {/* Search & Listing Section */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h2 style={FONT_SERIF} className="text-lg font-bold text-gray-900">All Categories List</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Manage existing categories and configurations</p>
          </div>
          
          <div className="relative min-w-[260px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50/50 text-xs font-bold text-gray-900 pl-9 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="min-h-[30vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin" />
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest animate-pulse">Loading categories...</p>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-gray-400">
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-3 shadow-2xs">
              <LayoutGrid size={20} className="text-gray-400" />
            </div>
            <p className="text-sm font-bold text-gray-700">No categories found</p>
            <p className="text-xs text-gray-400 mt-1">Try a different search query or add a new category.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-2xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/70 text-left text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-500 border-b border-gray-200">
                  <th className="py-3.5 px-5">Order</th>
                  <th className="py-3.5 px-5">Image</th>
                  <th className="py-3.5 px-5">Slug</th>
                  <th className="py-3.5 px-5">Name</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredCategories.map((cat, idx) => (
                  <tr key={cat.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="py-4 px-5 text-gray-500 font-bold">
                      <span className="inline-flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-xl border border-gray-200 text-xs">
                        <GripVertical size={13} className="text-gray-400" /> #{idx + 1} ({cat.order ?? 0})
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <img src={cat.image} alt={cat.name} className="w-11 h-11 rounded-2xl object-cover bg-gray-100 border border-gray-200 shadow-2xs" />
                    </td>
                    <td className="py-4 px-5 font-mono text-xs font-bold text-gray-500">{cat.id}</td>
                    <td className="py-4 px-5 font-bold text-gray-900">{cat.name}</td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => startEdit(cat)} 
                          className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-2xs cursor-pointer" 
                          aria-label="Edit"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id, cat.name)} 
                          className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-2xs cursor-pointer" 
                          aria-label="Delete"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoriesAdmin;