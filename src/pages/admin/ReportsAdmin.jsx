// src/pages/admin/ReportsAdmin.jsx
import { useState, useEffect, useMemo } from "react";
import { DollarSign, ShoppingBag, Package, TrendingUp, RefreshCw, CreditCard, Award } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { fetchRecentReports } from "../../services/reportService";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const FONT_SERIF = { fontFamily: "'Playfair Display', Georgia, serif" };

const StatBox = ({ label, value, subtext, icon: Icon, tint, isLongText }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-200/95 shadow-md flex flex-col justify-between h-full">
    <div className="flex items-center justify-between mb-3">
      <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-500">{label}</p>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${tint}`}>
        <Icon size={20} />
      </div>
    </div>
    <div>
      <p 
        style={isLongText ? {} : FONT_SERIF} 
        className={`${isLongText ? "text-base font-bold text-gray-900 leading-snug line-clamp-2" : "text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight"}`}
      >
        {value}
      </p>
      {subtext && <p className="text-xs text-rose-500 font-bold mt-1.5">{subtext}</p>}
    </div>
  </div>
);

const ReportsAdmin = () => {
  const [reports, setReports] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("This Week");

  useEffect(() => {
    const loadReportData = async () => {
      try {
        const reportsData = await fetchRecentReports(30);
        setReports(reportsData);

        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersData);
      } catch (err) {
        console.error("Error fetching report data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, []);

  const parseOrderDate = (createdAt) => {
    if (!createdAt) return new Date();
    if (typeof createdAt.toDate === "function") {
      return createdAt.toDate();
    }
    return new Date(createdAt);
  };

  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter(o => {
      const orderDate = parseOrderDate(o.createdAt || o.date);
      if (timeFilter === "Today") {
        return orderDate.toDateString() === now.toDateString();
      } else if (timeFilter === "This Week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return orderDate >= weekAgo;
      } else if (timeFilter === "This Month") {
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [orders, timeFilter]);

  const stats = useMemo(() => {
    let revenue = 0;
    let totalOrdersCount = filteredOrders.length;
    let itemsSold = 0;
    let paymentBreakdown = { aba: 0, cash: 0, card: 0 };
    let productTally = {};
    let chartMap = {};

    filteredOrders.forEach(o => {
      if (o.status === "cancelled") return;
      const amount = o.total || o.totalAmount || o.amount || 0;
      revenue += amount;

      const method = (o.paymentMethod || o.payment || "cash").toLowerCase();
      if (method.includes("aba") || method.includes("qr") || method.includes("khqr")) {
        paymentBreakdown.aba += amount;
      } else if (method.includes("cash") || method.includes("cod")) {
        paymentBreakdown.cash += amount;
      } else {
        paymentBreakdown.card += amount;
      }

      const orderDateObj = parseOrderDate(o.createdAt || o.date);
      const dateKey = orderDateObj.toISOString().split("T")[0];
      chartMap[dateKey] = (chartMap[dateKey] || 0) + amount;

      const itemsList = o.items || o.cartItems || [];
      itemsList.forEach(item => {
        const qty = item.qty || item.quantity || 1;
        const name = item.name || item.title || "Product";
        itemsSold += qty;
        productTally[name] = (productTally[name] || 0) + qty;
      });
    });

    let topProduct = "No sales yet";
    let maxQty = 0;
    Object.entries(productTally).forEach(([name, qty]) => {
      if (qty > maxQty) {
        maxQty = qty;
        topProduct = `${name} (${qty} units)`;
      }
    });

    let chartData = Object.keys(chartMap).sort().map(date => ({
      date,
      revenue: chartMap[date]
    }));

    if (chartData.length === 1) {
      chartData = [
        { date: "Start", revenue: 0 },
        { date: chartData[0].date, revenue: chartData[0].revenue }
      ];
    }

    return {
      revenue,
      orderCount: totalOrdersCount,
      itemsSold,
      paymentBreakdown,
      topProduct,
      chartData
    };
  }, [filteredOrders]);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner Header & Filter Tabs */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={FONT_SERIF} className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Sales Reports & Analytics
          </h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1 font-semibold">
            Daily rollups, payment gateway insights, and performance metrics
          </p>
        </div>

        <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-sm self-start sm:self-auto">
          {["Today", "This Week", "This Month", "All"].map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
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

      {/* Stats Overview Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
        <StatBox 
          label="Total Revenue" 
          value={`$${stats.revenue.toFixed(2)}`} 
          subtext={`Filtered by ${timeFilter}`} 
          icon={DollarSign} 
          tint="bg-emerald-600 text-white shadow-md shadow-emerald-200" 
        />
        <StatBox 
          label="Total Orders" 
          value={stats.orderCount} 
          subtext="Transactions count" 
          icon={ShoppingBag} 
          tint="bg-blue-600 text-white shadow-md shadow-blue-200" 
        />
        <StatBox 
          label="Items Sold" 
          value={stats.itemsSold} 
          subtext="Total units" 
          icon={Package} 
          tint="bg-rose-600 text-white shadow-md shadow-rose-200" 
        />
        <StatBox 
          label="Best Selling Product" 
          value={stats.topProduct} 
          subtext="Top demand item" 
          icon={Award} 
          tint="bg-purple-600 text-white shadow-md shadow-purple-200"
          isLongText={true} 
        />
      </div>

      {/* Revenue Performance Area Chart */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h2 style={FONT_SERIF} className="text-lg font-bold text-gray-900">Revenue Performance Trend</h2>
            <p className="text-xs text-gray-600 font-medium mt-0.5">Visual breakdown over time based on selected filter</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <TrendingUp size={18} />
          </div>
        </div>

        {loading ? (
          <div className="min-h-[30vh] flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 text-gray-800 animate-spin" />
          </div>
        ) : stats.chartData.length === 0 ? (
          <div className="py-20 text-center text-xs text-gray-500 font-bold">No report data available for {timeFilter}.</div>
        ) : (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#111827", border: "none", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                  formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Payment Methods Breakdown Section */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div>
            <h2 style={FONT_SERIF} className="text-lg font-bold text-gray-900">Payment Method Breakdown</h2>
            <p className="text-xs text-gray-600 font-medium mt-0.5">Revenue distribution by payment channel</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700">
            <CreditCard size={18} />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500">ABA PayWay / KHQR</p>
            <p style={FONT_SERIF} className="text-2xl font-extrabold text-gray-900 mt-2">${stats.paymentBreakdown.aba.toFixed(2)}</p>
          </div>
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500">Cash on Delivery (COD)</p>
            <p style={FONT_SERIF} className="text-2xl font-extrabold text-gray-900 mt-2">${stats.paymentBreakdown.cash.toFixed(2)}</p>
          </div>
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500">Credit / Debit Card</p>
            <p style={FONT_SERIF} className="text-2xl font-extrabold text-gray-900 mt-2">${stats.paymentBreakdown.card.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Report History Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 space-y-6">
        <div>
          <h2 style={FONT_SERIF} className="text-lg font-bold text-gray-900">Report History</h2>
          <p className="text-xs text-gray-600 font-medium mt-0.5">Archived summary records grouped by order dates</p>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs font-bold uppercase tracking-widest text-gray-400">Loading history...</div>
        ) : stats.chartData.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500 font-medium">No history found for this period.</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-600 border-b border-gray-200">
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Orders</th>
                  <th className="py-3.5 px-5">Items Sold</th>
                  <th className="py-3.5 px-5 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {stats.chartData.map((row, index) => {
                  if (row.date === "Start") return null;
                  
                  const dayOrders = filteredOrders.filter(o => {
                    const dObj = parseOrderDate(o.createdAt || o.date);
                    return dObj.toISOString().split("T")[0] === row.date;
                  });

                  let dayItemsCount = 0;
                  dayOrders.forEach(o => {
                    const items = o.items || o.cartItems || [];
                    items.forEach(i => { dayItemsCount += (i.qty || i.quantity || 1); });
                  });

                  return (
                    <tr key={index} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-5 font-bold text-gray-900">{row.date}</td>
                      <td className="py-4 px-5 text-gray-700 font-semibold">{dayOrders.length}</td>
                      <td className="py-4 px-5 text-gray-700 font-semibold">{dayItemsCount}</td>
                      <td className="py-4 px-5 text-right font-extrabold text-gray-900">${row.revenue.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 space-y-6">
        <div>
          <h2 style={FONT_SERIF} className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <p className="text-xs text-gray-600 font-medium mt-0.5">List of individual transactions including customer details</p>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs font-bold uppercase tracking-widest text-gray-400">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500 font-medium">No orders found for this period.</div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-600 border-b border-gray-200">
                  <th className="py-3.5 px-5">Customer Name</th>
                  <th className="py-3.5 px-5">Date</th>
                  <th className="py-3.5 px-5">Payment Method</th>
                  <th className="py-3.5 px-5 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-5 font-bold text-gray-900">
                      {order.customerName || order.name || order.shipping?.fullName || "Guest Customer"}
                    </td>
                    <td className="py-4 px-5 text-gray-700 font-semibold">
                      {parseOrderDate(order.createdAt || order.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-5 text-gray-700 font-semibold uppercase text-xs">
                      {order.paymentMethod || order.payment || "Cash"}
                    </td>
                    <td className="py-4 px-5 text-right font-extrabold text-gray-900">
                      ${(order.total || order.totalAmount || order.amount || 0).toFixed(2)}
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

export default ReportsAdmin;