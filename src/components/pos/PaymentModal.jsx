// src/components/pos/DiscountModal.jsx
import { useState } from "react";
import { X, Tag, Loader2 } from "lucide-react";
import { validateDiscountCode } from "../../services/discountService";
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
      const numAmount = parseFloat(cleanVal);

      // 1. បើ Admin វាយជាចំនួនទឹកប្រាក់សុទ្ធសាធ (ឧទាហរណ៍: 10 ឬ 10$) គិតជា Fixed Amount បញ្ចុះតាមចំនួនទឹកប្រាក់ផ្ទាល់
      if (!isNaN(numAmount) && !isNaN(val.replace("$", ""))) {
        // ផ្ញើឈ្មោះ និងតម្លៃទឹកប្រាក់បញ្ចុះផ្ទាល់ ($) ទៅកាន់ Context
        applyDiscount(`$${numAmount} OFF`, numAmount, "fixed");
        onClose();
        return;
      }

      // 2. បើវាយជាអក្សរកូដ គឺឆែកក្នុង Firebase Database តាមប្រក្រតី
      const discount = await validateDiscountCode(val.toUpperCase());
      if (!discount) {
        setError("Invalid or expired discount code.");
        setChecking(false);
        return;
      }

      // ផ្ញើទិន្នន័យកូដពី Database ទៅ Context (ដោយមិនបាច់គុណរឿង 100 បន្ថែមទៀតទេ)
      applyDiscount(discount.code, discount.rate, "percentage");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Could not verify code. Try again.");
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
            placeholder="Enter code or amount e.g. 10"
            autoFocus
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-rose-300 uppercase font-bold"
          />
          {error && <p className="text-rose-500 text-xs font-medium">{error}</p>}
          <button
            type="submit"
            disabled={checking || !code.trim()}
            className="w-full bg-rose-400 hover:bg-rose-500 text-white text-sm font-semibold uppercase tracking-wider py-3 rounded-full transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {checking && <Loader2 size={14} className="animate-spin" />}
            {checking ? "Checking..." : "Apply Code"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DiscountModal;