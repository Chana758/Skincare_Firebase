// src/pages/admin/DiscountsAdmin.jsx
import { useEffect, useState, useMemo } from "react";
import { Plus, Trash2, Tag, Power, RefreshCw, Percent, CheckCircle2 } from "lucide-react";
import { subscribeDiscounts, upsertDiscount, deleteDiscount } from "../../services/discountService";

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

const DiscountsAdmin = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: "", rate: "10", expiresAt: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeDiscounts((data) => {
      setDiscounts(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const stats = useMemo(() => {
    const total = discounts.length;
    const activeCount = discounts.filter((d) => d.active).length;
    const avgRate = total > 0 ? Math.round(discounts.reduce((acc, d) => acc + (d.rate || 0), 0) * 100 / total) : 0;
    return { total, activeCount, avgRate };
  }, [discounts]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await upsertDiscount({
        code: form.code,
        rate: Number(form.rate) / 100,
        active: true,
        expiresAt: form.expiresAt ? new Date(form.expiresAt) : null,
      });
      setForm({ code: "", rate: "10", expiresAt: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to create discount.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (d) => {
    try {
      await upsertDiscount({ code: d.code, rate: d.rate, active: !d.active, expiresAt: d.expiresAt || null });
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (code) => {
    if (!window.confirm(`Delete discount code "${code}"?`)) return;
    try {
      await deleteDiscount(code);
    } catch (err) {
      console.error(err);
      alert("Failed to delete discount.");
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={FONT_SERIF} className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Discounts & Promos
          </h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1 font-semibold">
            Manage promo codes for storefront and POS
          </p>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid sm:grid-cols-3 gap-5">
        <StatBox 
          label="Total Promos" 
          value={stats.total} 
          subtext="Created codes" 
          icon={Tag} 
          tint="bg-rose-100 text-rose-800 border border-rose-200" 
        />
        <StatBox 
          label="Active Coupons" 
          value={stats.activeCount} 
          subtext="Available for use" 
          icon={CheckCircle2} 
          tint="bg-emerald-100 text-emerald-800 border border-emerald-200" 
        />
        <StatBox 
          label="Avg. Discount Rate" 
          value={`${stats.avgRate}%`} 
          subtext="Average markdown" 
          icon={Percent} 
          tint="bg-blue-100 text-blue-800 border border-blue-200" 
        />
      </div>

      {/* Create Form Section */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 space-y-6">
        <div>
          <h2 style={FONT_SERIF} className="text-lg font-bold text-gray-900">Create New Promo Code</h2>
          <p className="text-xs text-gray-600 font-medium mt-0.5">Fill in code details to issue a new discount</p>
        </div>

        <form onSubmit={handleCreate} className="grid sm:grid-cols-4 gap-4 items-end pt-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-600 mb-1.5">Code</label>
            <input
              type="text" required value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
              placeholder="e.g. GLOW20"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-900 bg-gray-50/50 uppercase font-bold transition"
            />
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-600 mb-1.5">Discount %</label>
            <input
              type="number" min="1" max="100" required value={form.rate}
              onChange={(e) => setForm((f) => ({ ...f, rate: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-900 bg-gray-50/50 font-bold transition"
            />
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-600 mb-1.5">Expires (optional)</label>
            <input
              type="date" value={form.expiresAt}
              onChange={(e) => setForm((f) => ({ ...f, expiresAt: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-gray-900 bg-gray-50/50 font-bold transition cursor-pointer"
            />
          </div>
          <button
            type="submit" disabled={saving}
            className="sm:col-span-4 flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md disabled:opacity-60 cursor-pointer mt-2"
          >
            <Plus size={16} /> {saving ? "Creating..." : "Create Discount Code"}
          </button>
        </form>
      </div>

      {/* Listing Section */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h2 style={FONT_SERIF} className="text-lg font-bold text-gray-900">Active & Past Coupons</h2>
            <p className="text-xs text-gray-600 font-medium mt-0.5">Overview of all discount configurations</p>
          </div>
        </div>

        {loading ? (
          <div className="min-h-[30vh] flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 text-gray-800 animate-spin" />
              <p className="text-gray-700 text-xs font-bold uppercase tracking-widest animate-pulse">Loading discounts...</p>
            </div>
          </div>
        ) : discounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-gray-500">
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-300 flex items-center justify-center mb-3 shadow-sm">
              <Tag size={20} />
            </div>
            <p className="text-sm font-bold text-gray-800">No discount codes yet</p>
            <p className="text-xs text-gray-500 mt-1">Get started by creating your first promo code above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-600 border-b border-gray-200">
                  <th className="py-3.5 px-5">Code</th>
                  <th className="py-3.5 px-5">Discount</th>
                  <th className="py-3.5 px-5">Expires</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {discounts.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="py-4 px-5 font-mono font-bold text-gray-900">{d.code}</td>
                    <td className="py-4 px-5 text-gray-700 font-extrabold">{(d.rate * 100).toFixed(0)}%</td>
                    <td className="py-4 px-5 text-gray-600 font-semibold text-xs">
                      {d.expiresAt?.toDate 
                        ? d.expiresAt.toDate().toLocaleDateString() 
                        : d.expiresAt 
                        ? new Date(d.expiresAt).toLocaleDateString() 
                        : "No expiry"}
                    </td>
                    <td className="py-4 px-5">
                      <button
                        onClick={() => toggleActive(d)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider transition cursor-pointer border ${
                          d.active ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        <Power size={11} /> {d.active ? "Active" : "Disabled"}
                      </button>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button 
                        onClick={() => handleDelete(d.code)} 
                        className="p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-2xl cursor-pointer"
                        aria-label="Delete"
                        title="Delete code"
                      >
                        <Trash2 size={14} />
                      </button>
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

export default DiscountsAdmin;