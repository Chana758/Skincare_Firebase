// src/components/pos/DiscountModal.jsx
import { useState } from "react";
import { X, Tag, Loader2 } from "lucide-react";
import { usePOSCart } from "../../context/POSCartContext";

const DiscountModal = ({ onClose }) => {
  const { applyDiscount } = usePOSCart();
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async (e) => {
    e.preventDefault();
    const val = code.trim();
    if (!val) return;

    setChecking(true);
    setError("");

    try {
      const cleanVal = val.replace("$", "").trim();
      const amount = parseFloat(cleanVal);

      if (isNaN(amount) || amount <= 0) {
        setError("Invalid discount value.");
        setChecking(false);
        return;
      }

      // Flat dollar-amount discount (e.g. "$10 OFF"), not a percentage.
      // POSCartContext.applyDiscount(code, value, type) expects type
      // "fixed" here so it treats `amount` as a dollar amount rather than
      // a 0-1 rate — otherwise a $10 discount gets misread as a 1000% rate.
      applyDiscount(`$${amount} OFF`, amount, "fixed");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-[75] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-serif text-gray-900 flex items-center gap-2">
            <Tag size={18} className="text-rose-400" /> Apply Discount
          </h2>
          <button onClick={onClose} aria-label="Close" className="cursor-pointer">
            <X size={20} className="text-gray-400 hover:text-gray-700" />
          </button>
        </div>

        <form onSubmit={handleApply} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter amount e.g. 20"
            autoFocus
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-rose-300"
          />
          {error && <p className="text-rose-500 text-xs font-medium">{error}</p>}
          <button
            type="submit"
            disabled={checking || !code.trim()}
            className="w-full bg-rose-400 hover:bg-rose-500 text-white text-sm font-semibold uppercase tracking-wider py-3 rounded-full transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {checking && <Loader2 size={14} className="animate-spin" />}
            {checking ? "Checking..." : "Apply Discount"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DiscountModal;