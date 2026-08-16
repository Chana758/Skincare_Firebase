// src/components/pos/PaymentStatusListener.jsx
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { CheckCircle2, Loader2 } from "lucide-react";
import { db } from "../../firebase/config";

/**
 * Subscribes to orders/{orderId} in real time. When the verifyPaymentWebhook
 * Cloud Function marks the order "paid" (after the bank confirms), this
 * fires onPaid() automatically — no polling needed.
 */
const PaymentStatusListener = ({ orderId, onPaid }) => {
  const [status, setStatus] = useState("awaiting_payment");

  useEffect(() => {
    if (!orderId) return;
    const unsubscribe = onSnapshot(doc(db, "orders", orderId), (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      setStatus(data.status);
      if (data.status === "paid") onPaid?.();
    });
    return unsubscribe;
  }, [orderId, onPaid]);

  if (status === "paid") {
    return (
      <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
        <CheckCircle2 size={16} /> Payment received!
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-gray-500 text-sm">
      <Loader2 size={16} className="animate-spin" /> Waiting for payment...
    </div>
  );
};

export default PaymentStatusListener;