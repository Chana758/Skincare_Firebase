// src/pages/staff/ShiftHistory.jsx
import { useMemo, useState } from "react";
import { Calendar, Receipt as ReceiptIcon, DollarSign, ShoppingBag, RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../hooks/useOrders";

const FONT_SERIF = { fontFamily: "'Playfair Display', Georgia, serif" };

const statusColor = {
  paid: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  awaiting_payment: "bg-amber-50 text-amber-700 border border-amber-200",
  cancelled: "bg-rose-50 text-rose-700 border border-rose-200",
  pending: "bg-blue-50 text-blue-700 border border-blue-200",
};

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

const ShiftHistory = () => {
  const { currentUser } = useAuth();
  const { orders, loading } = useOrders();
  const [dateFilter, setDateFilter] = useState("");

  const mySales = useMemo(() => {
    let list = orders.filter((o) => o.source === "pos" && o.staffId === currentUser?.uid);
    if (dateFilter) {
      list = list.filter((o) => {
        const d = o.createdAt?.toDate?.();
        return d && d.toISOString().slice(0, 10) === dateFilter;
      });
    }
    return list;
  }, [orders, currentUser, dateFilter]);

  const totalSold = mySales
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={FONT_SERIF} className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            My Shift History
          </h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1 font-semibold">
            Sales records and transactions you've processed on this account
          </p>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid sm:grid-cols-2 gap-5">
        <StatBox 
          label="Total Sold" 
          value={`$${totalSold.toFixed(2)}`} 
          subtext="Shift revenue earnings" 
          icon={DollarSign} 
          tint="bg-emerald-100 text-emerald-800 border border-emerald-200" 
        />
        <StatBox 
          label="Transactions" 
          value={mySales.length} 
          subtext="Total orders handled" 
          icon={ShoppingBag} 
          tint="bg-blue-100 text-blue-800 border border-blue-200" 
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">Filter by Date</p>
            <p className="text-[11px] text-gray-500 font-semibold">Select a specific shift day</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-gray-50 text-xs font-bold text-gray-900 px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors shadow-2xs"
          />
          {dateFilter && (
            <button 
              onClick={() => setDateFilter("")} 
              className="text-xs text-rose-500 font-bold hover:underline px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table Section */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 space-y-6">
        <div>
          <h2 style={FONT_SERIF} className="text-lg font-bold text-gray-900">Transaction History</h2>
          <p className="text-xs text-gray-600 font-medium mt-0.5">Detailed log of shift transactions</p>
        </div>

        {loading ? (
          <div className="min-h-[25vh] flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 text-gray-800 animate-spin" />
          </div>
        ) : mySales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 mb-3 shadow-2xs">
              <ReceiptIcon size={28} />
            </div>
            <p className="text-xs font-bold text-gray-600">No sales recorded yet.</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Processed orders during your shift will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-600 border-b border-gray-200">
                  <th className="py-3.5 px-5">Order ID</th>
                  <th className="py-3.5 px-5">Time</th>
                  <th className="py-3.5 px-5">Items</th>
                  <th className="py-3.5 px-5">Total</th>
                  <th className="py-3.5 px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {mySales.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-5 font-mono text-xs font-bold text-gray-700">#{o.id.slice(0, 8)}</td>
                    <td className="py-4 px-5 text-gray-600 font-semibold text-xs">
                      {o.createdAt?.toDate?.().toLocaleString() || "—"}
                    </td>
                    <td className="py-4 px-5 text-gray-600 font-semibold text-xs">{o.items?.length || 0} items</td>
                    <td className="py-4 px-5 font-extrabold text-gray-900">${(o.total || 0).toFixed(2)}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold capitalize shadow-2xs ${statusColor[o.status] || "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                        {o.status}
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
  );
};

export default ShiftHistory;