// src/components/pos/POSCart.jsx
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingCart, Tag, CreditCard, X, Sparkles } from "lucide-react";
import { usePOSCart } from "../../context/POSCartContext";
import DiscountModal from "./DiscountModal";
import PaymentQRModal from "./PaymentQRModal";

const FONT_SERIF = { fontFamily: "'Playfair Display', Georgia, serif" };

const POSCart = () => {
  const { items, updateQty, removeItem, subtotal, discount, discountAmount, discountLabel, total, clearDiscount, clearSale } =
    usePOSCart();
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/80 p-6 h-full flex flex-col justify-between relative overflow-hidden">
      
      {/* Decorative gradient blur background */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-50 rounded-full blur-3xl pointer-events-none" />

      {/* Header Cart */}
      <div className="relative z-10">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 text-rose-500 flex items-center justify-center border border-rose-100 shadow-inner">
              <ShoppingCart size={20} />
            </div>
            <div>
              <h2 style={FONT_SERIF} className="text-lg font-extrabold text-gray-900 tracking-tight">
                Current Sale
              </h2>
              <p className="text-[11px] text-gray-400 font-medium">Active customer cart</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-gray-50 text-gray-600 border border-gray-200/60 shadow-2xs">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
            {items.length > 0 && (
              <button 
                onClick={clearSale} 
                className="text-xs text-rose-500 font-bold hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Cart Items List Area */}
        <div className="overflow-y-auto space-y-3 max-h-[300px] pr-1 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
              <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-rose-300 mb-3 shadow-sm">
                <ShoppingCart size={24} />
              </div>
              <p className="text-xs font-bold text-gray-700">Tap a product to add it to the sale</p>
              <p className="text-[11px] text-gray-400 mt-1">Scanned items will appear here instantly</p>
            </div>
          ) : (
            items.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3 shadow-2xs transition-all hover:shadow-md hover:border-rose-100 group"
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-12 h-12 rounded-xl object-cover bg-rose-50 border border-gray-100 shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs font-semibold text-rose-500 mt-0.5">${item.price.toFixed(2)}</p>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 border border-gray-200/80 rounded-xl px-2 py-1 bg-gray-50/50">
                  <button 
                    onClick={() => updateQty(item.id, item.qty - 1)} 
                    aria-label="Decrease" 
                    className="text-gray-400 hover:text-gray-900 transition-colors p-0.5 cursor-pointer"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-xs font-extrabold w-5 text-center text-gray-800">{item.qty}</span>
                  <button 
                    onClick={() => updateQty(item.id, item.qty + 1)} 
                    aria-label="Increase" 
                    className="text-gray-400 hover:text-gray-900 transition-colors p-0.5 cursor-pointer"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => removeItem(item.id)} 
                  className="text-gray-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-all cursor-pointer" 
                  aria-label="Remove"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Checkout Section */}
      <div className="border-t border-gray-100 pt-4 space-y-3.5 mt-4 relative z-10">
        
        {/* Discount Button */}
        <button
          onClick={() => setShowDiscountModal(true)}
          className="w-full flex items-center justify-between text-xs font-bold px-4 py-3 rounded-2xl border border-dashed border-gray-200 hover:border-rose-300 bg-gradient-to-r from-gray-50/50 to-rose-50/30 transition-all text-gray-700 cursor-pointer group"
        >
          <span className="flex items-center gap-2.5">
            <Tag size={15} className="text-rose-500 group-hover:scale-110 transition-transform" /> 
            {discount ? `Applied: ${discount.code}` : "Apply discount code"}
          </span>
          {discount ? (
            <span
              onClick={(e) => { e.stopPropagation(); clearDiscount(); }}
              className="text-gray-400 hover:text-rose-600 p-1 rounded-full hover:bg-white transition-colors"
            >
              <X size={14} />
            </span>
          ) : (
            <span className="text-rose-500 font-semibold text-[11px]">Add +</span>
          )}
        </button>

        {/* Breakdown Prices */}
        <div className="space-y-2 px-1 text-xs">
          <div className="flex justify-between text-gray-500 font-medium">
            <span>Subtotal</span>
            <span className="font-bold text-gray-800">${subtotal.toFixed(2)}</span>
          </div>

          {discount && (
            <div className="flex justify-between text-emerald-600 font-semibold bg-emerald-50/60 px-2.5 py-1.5 rounded-xl border border-emerald-100/50">
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} /> Discount ({discountLabel})
              </span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-gray-900 pt-2 border-t border-gray-100">
            <span style={FONT_SERIF} className="text-base font-bold">Total Amount</span>
            <span style={FONT_SERIF} className="text-2xl font-black text-rose-600 tracking-tight">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Charge Button */}
        <button
          onClick={() => setShowPaymentModal(true)}
          disabled={items.length === 0}
          className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-gray-900/10 hover:shadow-rose-600/25 uppercase tracking-widest text-xs flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <CreditCard size={17} className="text-rose-300" /> Charge ${total.toFixed(2)}
        </button>
      </div>

      {showDiscountModal && <DiscountModal onClose={() => setShowDiscountModal(false)} />}
      {showPaymentModal && <PaymentQRModal onClose={() => setShowPaymentModal(false)} />}
    </div>
  );
};

export default POSCart;