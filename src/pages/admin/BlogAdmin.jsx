import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, Newspaper, X, RefreshCw, BookmarkCheck, Upload, Layers, Search, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { useBlogPosts } from "../../hooks/useBlogPosts";
import { createBlogPost, updateBlogPost, deleteBlogPost, BLOG_CATEGORIES } from "../../services/blogService";

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

const emptyForm = {
  title: "", 
  excerpt: "", 
  image: "", 
  category: BLOG_CATEGORIES[1], 
  readTime: "4 min read", 
  featured: false,
  author: "",
  date: new Date().toISOString().split('T')[0],
};

const BlogAdmin = () => {
  const { posts, loading } = useBlogPosts();
  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Top Alert/Toast State
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  // Custom Delete Modal State
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null, title: "" });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setForm(emptyForm);
    setImagePreview("");
    setEditingId(null);
  };

  const stats = useMemo(() => {
    const total = posts.length;
    const featuredCount = posts.filter(p => p.featured).length;
    const categoriesCount = new Set(posts.map(p => p.category)).size;
    return { total, featuredCount, categoriesCount };
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(
      (p) =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.author?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [posts, searchTerm]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 800 * 1024) {
        triggerToast("Image size is too large! Select an image under 800KB.", "error");
        return;
      }
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

  const openAdd = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      date: new Date().toISOString().split('T')[0],
    });
    setImagePreview("");
    setShowForm(true);
  };

  const openEdit = (post) => {
    setEditingId(post.id);
    setForm({
      title: post.title || "", 
      excerpt: post.excerpt || "", 
      image: post.image || "",
      category: post.category || BLOG_CATEGORIES[1], 
      readTime: post.readTime || "4 min read",
      featured: Boolean(post.featured),
      author: post.author || "",
      date: post.date || new Date().toISOString().split('T')[0],
    });
    setImagePreview(post.image || "");
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      triggerToast("Please upload a cover image first.", "warning");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateBlogPost(editingId, form);
        triggerToast("Blog post updated successfully!", "success");
      } else {
        await createBlogPost(form);
        triggerToast("Blog post published successfully!", "success");
      }
      handleCloseForm();
    } catch (err) {
      console.error("Error saving blog post:", err);
      triggerToast("Failed to save post. Image might be too large.", "error");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await deleteBlogPost(deleteConfirm.id);
      triggerToast("Post deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting blog post:", err);
      triggerToast("Failed to delete post.", "error");
    } finally {
      setDeleteConfirm({ show: false, id: null, title: "" });
    }
  };

  return (
    <div className="space-y-6 pb-16 relative">
      {/* Alert Banner - Displayed on top right */}
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
            <button onClick={() => setToast({ ...toast, show: false })} className="ml-2 opacity-70 hover:opacity-100 cursor-pointer">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={FONT_SERIF} className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Blog & Articles
          </h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1 font-semibold">
            Manage articles shown on the storefront's Blog page
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-md shadow-rose-200 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} /> New Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-5">
        <StatBox label="Total Articles" value={stats.total} subtext="Published stories" icon={Newspaper} tint="bg-rose-100 text-rose-800 border border-rose-200" />
        <StatBox label="Featured Posts" value={stats.featuredCount} subtext="Pinned to top" icon={BookmarkCheck} tint="bg-amber-100 text-amber-800 border border-amber-200" />
        <StatBox label="Categories" value={stats.categoriesCount} subtext="Topics covered" icon={Layers} tint="bg-blue-100 text-blue-800 border border-blue-200" />
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h2 style={FONT_SERIF} className="text-lg font-bold text-gray-900">Articles Catalog</h2>
            <p className="text-xs text-gray-600 font-medium mt-0.5">Overview of all written content</p>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl text-sm w-full sm:w-64">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search title, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-xs text-gray-800 outline-none w-full"
            />
          </div>
        </div>

        {loading ? (
          <div className="min-h-[30vh] flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 text-rose-400 animate-spin" />
              <p className="text-gray-700 text-xs font-bold uppercase tracking-widest animate-pulse">Loading posts...</p>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-gray-500">
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-300 flex items-center justify-center mb-3 shadow-sm">
              <Newspaper size={20} className="text-rose-400" />
            </div>
            <p className="text-sm font-bold text-gray-800">No blog posts found</p>
            <p className="text-xs text-gray-500 mt-1">
              {searchTerm ? "Try searching with a different keyword." : "Get started by publishing your first article."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-600 border-b border-gray-200">
                  <th className="py-3.5 px-5">Post</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Author</th>
                  <th className="py-3.5 px-5">Featured</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/85 transition-colors group">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img src={post.image} alt={post.title} className="w-11 h-11 rounded-xl object-cover bg-gray-100 border border-gray-200 shadow-2xs shrink-0" />
                        <span className="font-bold text-gray-900 line-clamp-1">{post.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-gray-600 font-semibold">{post.category}</td>
                    <td className="py-4 px-5 text-gray-600 font-medium">{post.author || "-"}</td>
                    <td className="py-4 px-5">
                      {post.featured ? (
                        <span className="inline-flex items-center text-[10px] font-extrabold uppercase bg-rose-100 text-rose-800 px-2.5 py-1 rounded-md border border-rose-200">
                          Featured
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">-</span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(post)} className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all cursor-pointer" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteConfirm({ show: true, id: post.id, title: post.title })} className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all cursor-pointer" title="Delete">
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[80] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-gray-100 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Delete Post?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to delete <span className="font-bold text-gray-800">"{deleteConfirm.title}"</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm({ show: false, id: null, title: "" })}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md shadow-rose-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <h2 style={FONT_SERIF} className="text-xl font-bold text-gray-900 tracking-wide">{editingId ? "Edit Post" : "New Post"}</h2>
              <button onClick={handleCloseForm} className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Title</label>
                <input type="text" name="title" required value={form.title} onChange={handleChange} placeholder="Enter article title..." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition bg-gray-50/30" />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Excerpt</label>
                <textarea name="excerpt" required rows={3} value={form.excerpt} onChange={handleChange} placeholder="Write a brief summary..." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition bg-gray-50/30 resize-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Cover Image (Max 800KB)</label>
                {imagePreview ? (
                  <div className="relative w-full h-44 rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                      <label className="px-4 py-2 bg-white/90 hover:bg-white text-gray-800 text-xs font-semibold rounded-xl cursor-pointer transition">
                        Change Image
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                      <button type="button" onClick={handleRemoveImage} className="p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition cursor-pointer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="w-full flex flex-col items-center justify-center py-6 px-4 border-2 border-dashed border-gray-200 hover:border-rose-400 rounded-2xl cursor-pointer bg-rose-50/20 transition group">
                    <div className="w-12 h-12 rounded-full bg-rose-50 group-hover:bg-rose-100 text-rose-400 flex items-center justify-center mb-2 transition">
                      <Upload size={20} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 mb-0.5">Click to upload cover image</span>
                    <span className="text-[11px] text-gray-400">PNG, JPG, WEBP (Under 800KB)</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition bg-white cursor-pointer">
                    {BLOG_CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Read Time</label>
                  <input type="text" name="readTime" value={form.readTime} onChange={handleChange} placeholder="4 min read" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition bg-gray-50/30" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Author</label>
                  <input type="text" name="author" value={form.author} onChange={handleChange} placeholder="e.g. Sophea K." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition bg-gray-50/30" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Date</label>
                  <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 transition bg-gray-50/30" />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 text-sm font-medium text-gray-700 cursor-pointer select-none">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="accent-rose-500 w-4 h-4 rounded cursor-pointer" />
                  Show as featured post at top of Blog page
                </label>
              </div>

              <button type="submit" disabled={saving} className="w-full bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-widest py-3.5 rounded-full transition shadow-lg shadow-rose-200 disabled:opacity-60 mt-4 cursor-pointer">
                {saving ? "Saving..." : editingId ? "Save Changes" : "Publish Post"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogAdmin;