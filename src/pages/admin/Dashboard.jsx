// src/pages/admin/Dashboard.jsx
import { useMemo, useState } from "react";
import { 
  DollarSign, ShoppingBag, Package, Clock, TrendingUp, 
  CheckCircle2, AlertCircle, ArrowUpRight, Search, Filter, RefreshCw
} from "lucide-react";
import { useOrders } from "../../hooks/useOrders";
import { useProducts } from "../../hooks/useProducts";

const FONT_SERIF = { fontFamily: "'Playfair Display', Georgia, serif" };

const StatCard = ({ icon: Icon, label, value, subtext, badgeText, tint }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-200/95 shadow-md hover:shadow-lg hover:border-gray-300 transition-all duration-300 flex flex-col justify-between group">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110 ${tint}`}>
        <Icon size={22} />
      </div>
      {badgeText && (
        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200 shadow-2xs">
          {badgeText}
        </span>
      )}
    </div>
    <div>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-500 mb-1">{label}</p>
      <div className="flex items-baseline justify-between">
        <p style={FONT_SERIF} className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
      </div>
      {subtext && <p className="text-xs text-gray-600 mt-1.5 font-semibold flex items-center gap-1">{subtext}</p>}
    </div>
  </div>
);

const statusColor = {
  pending: "bg-amber-100 text-amber-800 border border-amber-300 font-bold",
  processing: "bg-blue-100 text-blue-800 border border-blue-300 font-bold",
  shipped: "bg-purple-100 text-purple-800 border border-purple-300 font-bold",
  delivered: "bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold",
  cancelled: "bg-rose-100 text-rose-800 border border-rose-300 font-bold",
};

const Dashboard = () => {
  const { orders, loading: ordersLoading } = useOrders();
  const { products, loading: productsLoading } = useProducts();
  const [timeFilter, setTimeFilter] = useState("Daily");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.total || 0), 0);
    const pending = orders.filter((o) => o.status === "pending").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;
    const processing = orders.filter((o) => o.status === "processing").length;
    
    return {
      revenue,
      totalOrders: orders.length,
      pending,
      delivered,
      cancelled,
      processing,
      totalProducts: products.length,
    };
  }, [orders, products]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
      const matchesSearch = 
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (o.shipping?.name && o.shipping.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderStatusFilter, searchQuery]);

  const recentOrders = filteredOrders.slice(0, 8);

  // កែតម្រូវកន្លែង Loading ឱ្យមាន min-h ថេរ ដើម្បីការពារកុំឱ្យ Header ញ័រពេលទិន្នន័យកំពុងទាញយក
  if (ordersLoading || productsLoading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-7 h-7 text-gray-800 animate-spin" />
          <p className="text-gray-700 text-xs font-bold uppercase tracking-widest animate-pulse">Loading dashboard metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 space-y-8">
        
        {/* Page Header & Time Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-gray-100">
          <div className="relative pl-4 border-l-4 border-gray-900">
            <h1 style={FONT_SERIF} className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-xs md:text-sm text-gray-600 mt-1 font-semibold">
              Daily, monthly, and yearly delivery metrics with actionable data
            </p>
          </div>

          <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-sm self-start sm:self-auto">
            {["Daily", "Monthly", "Yearly"].map((tab) => (
              <button
                key={tab}
                onClick={() => setTimeFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  timeFilter === tab
                    ? "bg-gray-900 text-white shadow-md"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Top 4 Stat Grid Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard 
            icon={DollarSign} 
            label="Total Revenue" 
            value={`$${stats.revenue.toFixed(2)}`} 
            subtext="Net store earnings"
            badgeText="Earnings"
            tint="bg-emerald-600 text-white shadow-md shadow-emerald-200" 
          />
          <StatCard 
            icon={ShoppingBag} 
            label="Total Orders" 
            value={stats.totalOrders} 
            subtext="All time placed"
            badgeText="Total"
            tint="bg-blue-600 text-white shadow-md shadow-blue-200" 
          />
          <StatCard 
            icon={Clock} 
            label="Pending Orders" 
            value={stats.pending} 
            subtext="Requires fulfillment"
            badgeText="Action"
            tint="bg-amber-500 text-white shadow-md shadow-amber-200" 
          />
          <StatCard 
            icon={Package} 
            label="Products" 
            value={stats.totalProducts} 
            subtext="Active inventory"
            badgeText="Catalog"
            tint="bg-rose-600 text-white shadow-md shadow-rose-200" 
          />
        </div>

        {/* Secondary Status Breakdown Bar */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-gray-50/90 rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-gray-500">Delivered Orders</p>
                <p style={FONT_SERIF} className="text-xl font-bold text-gray-900 mt-0.5">{stats.delivered} Completed</p>
              </div>
            </div>
            <span className="text-[11px] font-extrabold text-purple-700 bg-purple-100 px-3 py-1 rounded-xl border border-purple-200">Success</span>
          </div>

          <div className="bg-gray-50/90 rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-gray-500">Processing Orders</p>
                <p style={FONT_SERIF} className="text-xl font-bold text-gray-900 mt-0.5">{stats.processing} Active</p>
              </div>
            </div>
            <span className="text-[11px] font-extrabold text-blue-700 bg-blue-100 px-3 py-1 rounded-xl border border-blue-200">Ongoing</span>
          </div>

          <div className="bg-gray-50/90 rounded-2xl p-5 border border-gray-200 shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-gray-500">Cancelled Orders</p>
                <p style={FONT_SERIF} className="text-xl font-bold text-gray-900 mt-0.5">{stats.cancelled} Cancelled</p>
              </div>
            </div>
            <span className="text-[11px] font-extrabold text-rose-700 bg-rose-100 px-3 py-1 rounded-xl border border-rose-200">Issues</span>
          </div>
        </div>

        {/* Quick Filters & Search Bar Section */}
        <div className="bg-gray-100 rounded-2xl p-4 md:p-5 border border-gray-200 shadow-inner flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-700 mr-2 flex items-center gap-1">
              <Filter size={12} /> Filter:
            </span>
            {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setOrderStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
                  orderStatusFilter === status
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search order ID or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-xs font-bold text-gray-900 pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* Recent Orders Table Section */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 style={FONT_SERIF} className="text-lg font-bold text-gray-900">Recent Store Orders</h2>
              <p className="text-xs text-gray-600 font-medium mt-0.5">Showing latest transactions and live status updates</p>
            </div>
            <span className="text-xs font-extrabold bg-gray-200 text-gray-800 px-3 py-1.5 rounded-xl border border-gray-300 shadow-2xs">
              {filteredOrders.length} records
            </span>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-20 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-300 flex items-center justify-center mx-auto text-gray-500 mb-3 shadow-sm">
                <ShoppingBag size={20} />
              </div>
              <p className="text-sm font-bold text-gray-800">No matching orders found</p>
              <p className="text-xs text-gray-500 mt-1">Try adjusting your filter or search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-600 border-b border-gray-200">
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Customer Name</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="py-4 px-4 font-mono text-xs font-bold text-gray-700">
                        #{o.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="py-4 px-4 text-gray-900 font-bold">
                        {o.shipping?.name || "—"}
                      </td>
                      <td className="py-4 px-4 font-extrabold text-gray-900 font-serif text-base">
                        ${(o.total || 0).toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold capitalize tracking-wide shadow-2xs ${statusColor[o.status] || "bg-gray-100 text-gray-800 border border-gray-300"}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-gray-700 group-hover:text-gray-900 transition-colors cursor-pointer bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200 group-hover:bg-gray-200">
                          Details <ArrowUpRight size={14} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;