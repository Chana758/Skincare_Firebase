// src/pages/Orders.jsx
import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck, XCircle, ShoppingBag, Ban, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { cancelOrder } from '../services/orderService';

const GildedDivider = () => (
  <div className="flex items-center justify-center gap-3 my-5" aria-hidden="true">
    <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#C9A227]" />
    <span className="w-2 h-2 rotate-45 bg-[#C9A227]" />
    <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#C9A227]" />
  </div>
);

const Orders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // ទាញយកប្រវត្តិការបញ្ជាទិញរបស់ User បច្ចុប្បន្នពី Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const userOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // តម្រៀបតាមការបញ្ជាទិញថ្មីជាងគេ
        userOrders.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  // Handler សម្រាប់បោះបង់ការបញ្ជាទិញ
  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      setActionLoading(orderId);
      await cancelOrder(orderId, "Cancelled by customer");
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert("Could not cancel order. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  // Function សម្រាប់កំណត់ពណ៌តាមស្ថានភាព Order
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border-2 border-emerald-300 shadow-xs">
            <CheckCircle2 size={14} className="text-emerald-700" /> Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-900 border-2 border-blue-300 shadow-xs">
            <Truck size={14} className="text-blue-700" /> Shipped
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-900 border-2 border-rose-300 shadow-xs">
            <XCircle size={14} className="text-rose-700" /> Cancelled
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-900 border-2 border-indigo-300 shadow-xs">
            <CheckCircle2 size={14} className="text-indigo-700" /> Paid
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border-2 border-amber-300 shadow-xs">
            <Clock size={14} className="text-amber-700" /> Processing
          </span>
        );
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF9] text-gray-900 relative selection:bg-rose-100 selection:text-rose-900 pb-24">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-rose-100/60 via-amber-100/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Page Header */}
      <section className="px-6 md:px-20 max-w-5xl mx-auto text-center pt-16 pb-10">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-rose-700 text-xs font-extrabold uppercase tracking-[0.25em] mb-4 shadow-md border border-rose-200">
          <Sparkles size={14} className="text-[#C9A227]" /> Purchase History
        </div>
        <h1 className="text-3xl md:text-5xl font-serif text-gray-900 mb-2 font-bold tracking-tight">
          My Orders
        </h1>
        <GildedDivider />
        <p className="text-gray-700 text-xs md:text-sm font-semibold max-w-lg mx-auto">
          Track and review your luxury skincare purchases and delivery status in real time.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {loading ? (
          <div className="flex justify-center items-center py-28">
            <div className="w-10 h-10 border-3 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !currentUser ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-rose-200 p-10 shadow-2xl shadow-rose-900/10">
            <Package size={56} className="mx-auto text-rose-500 mb-4 stroke-[1.5]" />
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
            <p className="text-gray-700 font-semibold text-xs md:text-sm mb-8 max-w-md mx-auto">
              You need to be logged in to view your order history and track your shipments.
            </p>
            <Link 
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white text-xs font-extrabold uppercase tracking-widest rounded-2xl hover:bg-[#C9A227] transition shadow-xl"
            >
              Sign In Now
            </Link>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-rose-200 p-10 shadow-2xl shadow-rose-900/10">
            <ShoppingBag size={56} className="mx-auto text-gray-400 mb-4 stroke-[1.5]" />
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-700 font-semibold text-xs md:text-sm mb-8 max-w-md mx-auto">
              Explore our exclusive skincare collection and experience natural radiance.
            </p>
            <Link 
              to="/shop"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white text-xs font-extrabold uppercase tracking-widest rounded-2xl hover:bg-[#C9A227] transition shadow-xl"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStatus = order.status || 'processing';
              const canCancel = ['processing', 'pending', 'awaiting_payment'].includes(currentStatus.toLowerCase());

              return (
                <div 
                  key={order.id}
                  className="bg-white border-2 border-rose-200 rounded-3xl p-6 md:p-8 shadow-xl shadow-rose-900/10 hover:shadow-2xl transition-all duration-300"
                >
                  {/* Order Meta Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-gray-100">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Order ID:</span>
                        <span className="text-sm font-mono font-extrabold text-gray-900">#{order.id.slice(-8).toUpperCase()}</span>
                      </div>
                      <p className="text-xs text-gray-600 font-semibold mt-1">
                        {order.createdAt?.seconds 
                          ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : 'Recent order'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(currentStatus)}
                      {canCancel && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          disabled={actionLoading === order.id}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-rose-50 text-rose-700 border-2 border-rose-200 hover:bg-rose-100 transition cursor-pointer disabled:opacity-50 shadow-xs"
                        >
                          <Ban size={14} /> {actionLoading === order.id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="py-5 divide-y-2 divide-gray-100">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-4 min-w-0">
                          <img 
                            src={item.image || item.imageUrl || "https://placehold.co/100"} 
                            alt={item.name} 
                            className="w-14 h-14 object-cover rounded-2xl border-2 border-rose-100 shrink-0 shadow-sm"
                          />
                          <div className="min-w-0">
                            <h4 className="font-serif text-sm md:text-base font-bold text-gray-900 truncate">{item.name}</h4>
                            <p className="text-xs text-gray-700 font-semibold mt-1">Qty: {item.quantity || item.qty || 1} {item.selectedSize ? `• ${item.selectedSize}` : ''}</p>
                          </div>
                        </div>
                        <span className="text-sm md:text-base font-extrabold text-gray-900 shrink-0">
                          ${(Number(item.price || 0) * Number(item.quantity || item.qty || 1)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer / Total */}
                  <div className="pt-5 mt-3 border-t-2 border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wider text-gray-500">Total Amount</p>
                      <p className="text-xl md:text-2xl font-serif font-extrabold text-gray-900 mt-0.5">
                        ${Number(order.totalAmount || order.total || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wide bg-gray-100 px-4 py-2 rounded-xl border-2 border-gray-200">
                        Payment: {order.paymentMethod || 'Cash on Delivery'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;