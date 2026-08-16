// src/pages/admin/OrdersAdmin.jsx
import { useState, useMemo } from "react";
import { Search, Eye, X, ShoppingCart, Clock, CheckCircle2, Truck, XCircle, RefreshCw } from "lucide-react";
import { useOrders } from "../../hooks/useOrders";
import { updateOrderStatus, ORDER_STATUSES } from "../../services/orderService";

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

const statusColor = {
  pending: "bg-amber-100 text-amber-800 border border-amber-200",
  processing: "bg-blue-100 text-blue-800 border border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border border-purple-200",
  delivered: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  cancelled: "bg-rose-100 text-rose-800 border border-rose-200",
};

const OrdersAdmin = () => {
  const { orders, loading } = useOrders();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewingOrder, setViewingOrder] = useState(null);

  const stats = useMemo(() => {
    const total = orders.length;
    const pendingCount = orders.filter((o) => o.status === "pending").length;
    const deliveredCount = orders.filter((o) => o.status === "delivered").length;
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((acc, o) => acc + (o.total || 0), 0);
    return { total, pendingCount, deliveredCount, totalRevenue };
  }, [orders]);

  const filtered = useMemo(() => {
    let list = [...orders];
    if (statusFilter !== "all") list = list.filter((o) => o.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) => o.id.toLowerCase().includes(q) || o.shipping?.name?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, search, statusFilter]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={FONT_SERIF} className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Customer Orders
          </h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1 font-semibold">
            Track, fulfill, and manage store purchases and shipping status
          </p>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatBox 
          label="Total Orders" 
          value={stats.total} 
          subtext="All-time orders" 
          icon={ShoppingCart} 
          tint="bg-rose-100 text-rose-800 border border-rose-200" 
        />
        <StatBox 
          label="Pending Fulfillment" 
          value={stats.pendingCount} 
          subtext="Requires action" 
          icon={Clock} 
          tint="bg-amber-100 text-amber-800 border border-amber-200" 
        />
        <StatBox 
          label="Delivered" 
          value={stats.deliveredCount} 
          subtext="Successfully completed" 
          icon={CheckCircle2} 
          tint="bg-emerald-100 text-emerald-800 border border-emerald-200" 
        />
        <StatBox 
          label="Total Revenue" 
          value={`$${stats.totalRevenue.toFixed(2)}`} 
          subtext="Net sales volume" 
          icon={Truck} 
          tint="bg-blue-100 text-blue-800 border border-blue-200" 
        />
      </div>

      {/* Listing Section with Filters */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h2 style={FONT_SERIF} className="text-lg font-bold text-gray-900">Orders Catalog</h2>
            <p className="text-xs text-gray-600 font-medium mt-0.5">Overview of customer transactions</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search order ID or customer..."
                className="w-full bg-gray-50 text-xs font-bold text-gray-900 pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors shadow-2xs"
              />
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              statusFilter === "all" ? "bg-gray-900 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All ({orders.length})
          </button>
          {ORDER_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider capitalize transition-all cursor-pointer ${
                statusFilter === s ? "bg-gray-900 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s} ({orders.filter(o => o.status === s).length})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="min-h-[30vh] flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 text-gray-800 animate-spin" />
              <p className="text-gray-700 text-xs font-bold uppercase tracking-widest animate-pulse">Loading orders...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-gray-500">
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-300 flex items-center justify-center mb-3 shadow-sm">
              <ShoppingCart size={20} />
            </div>
            <p className="text-sm font-bold text-gray-800">No orders found</p>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your search criteria or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-600 border-b border-gray-200">
                  <th className="py-3.5 px-5">Order ID</th>
                  <th className="py-3.5 px-5">Customer</th>
                  <th className="py-3.5 px-5">Items</th>
                  <th className="py-3.5 px-5">Total</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="py-4 px-5 font-mono text-xs font-bold text-gray-500">#{o.id.slice(0, 8)}</td>
                    <td className="py-4 px-5 font-bold text-gray-900">{o.shipping?.name || "—"}</td>
                    <td className="py-4 px-5 text-gray-600 font-semibold">{o.items?.length || 0} items</td>
                    <td className="py-4 px-5 font-extrabold text-gray-900">${(o.total || 0).toFixed(2)}</td>
                    <td className="py-4 px-5">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className={`text-[10px] font-extrabold uppercase tracking-wider rounded-md px-2.5 py-1.5 outline-none border cursor-pointer transition ${statusColor[o.status] || "bg-gray-100 text-gray-800 border-gray-200"}`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button 
                        onClick={() => setViewingOrder(o)} 
                        className="p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-900 hover:text-white transition-all shadow-2xl cursor-pointer"
                        aria-label="View order"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {viewingOrder && (
        <div className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center px-4 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-7 md:p-8 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <h2 style={FONT_SERIF} className="text-xl font-bold text-gray-900">Order #{viewingOrder.id.slice(0, 8)}</h2>
              <button onClick={() => setViewingOrder(null)} aria-label="Close" className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 text-sm">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-500 mb-2.5">Purchased Items</p>
                <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-200/80 space-y-2">
                  {viewingOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-gray-800 font-semibold text-xs py-1">
                      <span>{item.name} <span className="text-gray-400 font-normal">× {item.qty}</span></span>
                      <span className="font-bold">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-500 mb-2">Shipping Information</p>
                <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-200/80 space-y-1 text-xs font-semibold text-gray-700">
                  <p className="text-gray-900 font-bold text-sm">{viewingOrder.shipping?.name}</p>
                  <p className="text-gray-600">{viewingOrder.shipping?.address}, {viewingOrder.shipping?.city}</p>
                  <p className="text-gray-500">{viewingOrder.shipping?.phone}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex items-center justify-between font-extrabold text-base text-gray-900">
                <span>Total Amount</span>
                <span className="text-rose-600">${(viewingOrder.total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;