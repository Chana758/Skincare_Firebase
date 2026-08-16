
import { useState } from "react";
import { X, Banknote, QrCode, Loader2, CheckCircle2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { createOrder, generateKHQR, markOrderPaid } from "../../services/paymentService";
import { createOrderNotification } from "../../services/notificationService";
import { usePOSCart } from "../../context/POSCartContext";
import Receipt from "./Receipt";

const PaymentQRModal = ({ onClose }) => {
  const { items, discount, total, clearSale } = usePOSCart();
  const [method, setMethod] = useState("khqr");
  const [stage, setStage] = useState("select"); // select | generating | awaiting | paid | error | cash_done
  const [qr, setQr] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState("");

  const notify = async (finalOrderId, finalMethod) => {
    try {
      await createOrderNotification({ orderId: finalOrderId, total, method: finalMethod, source: "pos" });
    } catch (err) {
      console.error("Notification failed (non-blocking):", err);
    }
  };

  const buildItems = () =>
    items.map((i) => ({ id: i.id, name: i.name, price: i.price, image: i.image, qty: i.qty }));

  const startKHQR = async () => {
    setStage("generating");
    setError("");
    try {
      const { orderId: newOrderId } = await createOrder({
        items: buildItems(),
        paymentMethod: "khqr",
        discountCode: discount?.code || null,
        discountRate: discount?.rate || 0,
        source: "pos",
      });
      if (!newOrderId) throw new Error("Order could not be created.");
      setOrderId(newOrderId);

      const { qrString } = await generateKHQR(newOrderId, total);
      if (!qrString) throw new Error("Could not generate a payment QR code.");
      setQr(qrString);
      setStage("awaiting");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate QR code.");
      setStage("error");
    }
  };

  const completeCashSale = async () => {
    setStage("generating");
    setError("");
    try {
      const { orderId: newOrderId } = await createOrder({
        items: buildItems(),
        paymentMethod: "cash",
        discountCode: discount?.code || null,
        discountRate: discount?.rate || 0,
        source: "pos",
      });
      if (!newOrderId) throw new Error("Order could not be created.");
      setOrderId(newOrderId);
      await notify(newOrderId, "cash");
      setStage("cash_done");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to complete sale.");
      setStage("error");
    }
  };

  // No bank webhook on Spark plan — staff taps this once they see the payment land
  const confirmKHQRPaid = async () => {
    if (!orderId) return;
    setStage("generating");
    setError("");
    try {
      await markOrderPaid(orderId);
      await notify(orderId, "khqr");
      setStage("paid");
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not confirm payment.");
      setStage("error");
    }
  };

  const handleDone = () => {
    clearSale();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[85] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        {(stage === "paid" || stage === "cash_done") ? (
          <Receipt orderId={orderId} onDone={handleDone} />
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-serif text-gray-900">Take Payment</h2>
              <button onClick={onClose} aria-label="Close">
                <X size={20} className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            <p className="text-3xl font-serif text-gray-900 text-center mb-6">${total.toFixed(2)}</p>

            {stage === "select" && (
              <div className="space-y-3">
                <button
                  onClick={() => setMethod("khqr")}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition ${
                    method === "khqr" ? "border-rose-400 bg-rose-50/50" : "border-gray-200"
                  }`}
                >
                  <QrCode size={20} className="text-gray-600" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">KHQR</p>
                    <p className="text-xs text-gray-500">Customer scans to pay</p>
                  </div>
                </button>
                <button
                  onClick={() => setMethod("cash")}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition ${
                    method === "cash" ? "border-rose-400 bg-rose-50/50" : "border-gray-200"
                  }`}
                >
                  <Banknote size={20} className="text-gray-600" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">Cash</p>
                    <p className="text-xs text-gray-500">Paid in person</p>
                  </div>
                </button>

                <button
                  onClick={() => (method === "khqr" ? startKHQR() : completeCashSale())}
                  className="w-full bg-rose-400 hover:bg-rose-500 text-white text-sm font-semibold uppercase tracking-wider py-3.5 rounded-full transition mt-2"
                >
                  Continue
                </button>
              </div>
            )}

            {stage === "generating" && (
              <div className="flex flex-col items-center py-10">
                <Loader2 size={28} className="animate-spin text-rose-400 mb-3" />
                <p className="text-sm text-gray-500">Processing...</p>
              </div>
            )}

            {stage === "awaiting" && qr && (
              <div className="flex flex-col items-center">
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 mb-4">
                  <QRCodeSVG value={qr} size={200} />
                </div>
                <p className="text-xs text-gray-400 mb-5 text-center">
                  Ask the customer to scan with their banking app.
                </p>
                <button
                  onClick={confirmKHQRPaid}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold uppercase tracking-wider py-3.5 rounded-full transition"
                >
                  <CheckCircle2 size={16} /> I've Received Payment
                </button>
              </div>
            )}

            {stage === "error" && (
              <div className="text-center py-6">
                <p className="text-rose-500 text-sm mb-4">{error}</p>
                <button
                  onClick={() => setStage("select")}
                  className="text-sm font-semibold text-gray-700 hover:text-rose-400"
                >
                  ← Try Again
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentQRModal;