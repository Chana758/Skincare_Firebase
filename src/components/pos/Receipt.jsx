// src/components/pos/Receipt.jsx
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { CheckCircle2, Printer, X } from "lucide-react";
import { db } from "../../firebase/config";

const FONT_SERIF = { fontFamily: "'Playfair Display', Georgia, serif" };

const Receipt = ({ orderId, onDone }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "orders", orderId));
        if (snap.exists()) setOrder(snap.data());
      } catch (err) {
        console.error("Error fetching receipt:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md mx-auto">
      
      {/* Printable Area Wrapper */}
      <div className="print-section">
        
        {/* Header Icon & Title (Hidden on print if preferred, or kept minimal) */}
        <div className="flex flex-col items-center text-center mb-6 no-print">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3 shadow-sm">
            <CheckCircle2 size={28} />
          </div>
          <h2 style={FONT_SERIF} className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Sale Complete
          </h2>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Order ID: <span className="text-gray-900 font-bold">#{orderId?.slice(0, 8).toUpperCase()}</span>
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
            Loading receipt...
          </div>
        ) : order ? (
          <div className="border border-gray-200/90 rounded-2xl p-5 md:p-6 bg-gray-50/60 shadow-xs font-mono text-xs text-gray-700 space-y-3 mb-6">
            
            {/* Store Branding */}
            <div className="text-center pb-3 border-b border-gray-200">
              <p style={FONT_SERIF} className="text-base font-extrabold text-gray-900 tracking-wider">
                LUMIÈRE BEAUTY
              </p>
              <p className="text-[10px] text-gray-500 font-sans mt-0.5">Phnom Penh, Cambodia</p>
            </div>

            {/* Order Date & Cashier info if any */}
            <div className="text-[11px] text-gray-500 space-y-0.5 pb-2 border-b border-dashed border-gray-200">
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-semibold text-gray-800">
                  {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : new Date().toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment:</span>
                <span className="font-semibold text-gray-800 uppercase">
                  {order.paymentMethod || order.payment || "Cash"}
                </span>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2 py-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Items Purchased</p>
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-2">
                  <span className="font-sans font-medium text-gray-900">
                    {item.name || item.title} <span className="text-gray-500">x{item.qty || item.quantity}</span>
                  </span>
                  <span className="font-bold text-gray-900 shrink-0">
                    ${((item.price || 0) * (item.qty || item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-300 pt-3 space-y-1.5 font-sans">
              <div className="flex justify-between text-gray-600 text-xs">
                <span>Subtotal</span>
                <span className="font-semibold">${(order.subtotal || order.total || 0).toFixed(2)}</span>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex justify-between text-rose-600 text-xs font-semibold">
                  <span>Discount {order.discountCode ? `(${order.discountCode})` : ""}</span>
                  <span>-${order.discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between font-extrabold text-sm text-gray-900 border-t border-gray-200 pt-2 mt-1">
                <span>Total Amount</span>
                <span className="text-emerald-600">${(order.total || order.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>

            {/* Footer Message */}
            <div className="text-center pt-4 border-t border-gray-200 mt-4">
              <p style={FONT_SERIF} className="text-xs font-bold text-gray-800">Thank you for shopping with us!</p>
              <p className="text-[10px] text-gray-400 font-sans mt-0.5">Please keep this receipt for your records.</p>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-rose-500 font-bold">
            Order details not found.
          </div>
        )}
      </div>

      {/* Action Buttons (Hidden when printing) */}
      <div className="flex gap-3 no-print">
        <button
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-800 text-xs font-extrabold uppercase tracking-wider py-3.5 rounded-2xl hover:bg-gray-50 transition shadow-xs"
        >
          <Printer size={16} /> Print Receipt
        </button>
        <button
          onClick={onDone}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-extrabold uppercase tracking-wider py-3.5 rounded-2xl transition shadow-md shadow-gray-200"
        >
          <X size={16} /> New Sale
        </button>
      </div>

      {/* CSS for hiding elements during print */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-section, .print-section * {
            visibility: visible;
          }
          .print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 10px;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
};

export default Receipt;