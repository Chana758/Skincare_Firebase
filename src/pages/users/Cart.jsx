// src/pages/users/Cart.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight, 
  ShieldCheck, Sparkles, Truck, Check, X, RefreshCw, Award, Lock, ArrowLeft
} from "lucide-react";
import { useCart } from "../../context/CartContext";

const VALID_PROMOS = { 
  GLOW10: 0.10, 
  WELCOME15: 0.15 
};

const Cart = () => {
  const { items, updateQty, removeFromCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (VALID_PROMOS[code]) {
      setAppliedPromo({ code, rate: VALID_PROMOS[code] });
      setPromoError("");
    } else {
      setAppliedPromo(null);
      setPromoError("Invalid promo code. Try GLOW10 or WELCOME15.");
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput("");
    setPromoError("");
  };

  const cleanName = (name) => (name ? name.replace(/^"|"$/g, "") : "");

  const discount = appliedPromo ? totalPrice * appliedPromo.rate : 0;
  const subtotalAfterDiscount = totalPrice - discount;
  const FREE_SHIPPING_THRESHOLD = 50;
  const shipping = subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD || subtotalAfterDiscount === 0 ? 0 : 4.99;
  const grandTotal = subtotalAfterDiscount + shipping;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalAfterDiscount);
  const progressPercent = Math.min(100, (subtotalAfterDiscount / FREE_SHIPPING_THRESHOLD) * 100);

  if (items.length === 0) {
    return (
      <main className="min-h-[80vh] bg-[#FAF7F5] py-16 px-4 md:px-12 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] border border-rose-100 p-10 md:p-14 text-center shadow-xl shadow-rose-950/5 relative overflow-hidden">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-50 to-rose-100/60 rounded-3xl flex items-center justify-center mx-auto mb-6 text-rose-500 border border-rose-200/60 shadow-inner">
              <ShoppingBag size={34} className="stroke-[1.5]" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-normal text-gray-900 mb-3 tracking-tight">Your cart is empty</h1>
            <p className="text-gray-500 text-xs md:text-sm mb-8 max-w-sm mx-auto leading-relaxed">
              Your luxury skincare ritual awaits. Discover our bestsellers to start your journey to glowing skin.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-3 bg-gray-900 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-[0.2em] px-9 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-rose-500/20 group"
            >
              Explore Collection 
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 md:px-12 py-10 md:py-14 min-h-[85vh] bg-[#FAF7F5]">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Master Box / Main Wrapped Container */}
        <div className="bg-white/90 backdrop-blur-md rounded-[1.5rem] border border-rose-100/90 shadow-2xl shadow-rose-950/5 p-6 md:p-10 space-y-8">
          
          {/* Top Header inside Container */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-rose-100/70 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link to="/shop" className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 transition">
                  <ArrowLeft size={13} /> Continue Shopping
                </Link>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-normal text-gray-900 tracking-tight">Shopping Cart</h1>
            </div>
            
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-500 bg-rose-50 border border-rose-200/60 px-4 py-2 rounded-full shadow-2xs">
                {totalItems} {totalItems === 1 ? 'Item' : 'Items'} Selected
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Column: Items & Promo Code */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              
              {/* Free Shipping Progress Box */}
              <div className="bg-gradient-to-r from-rose-50/70 via-white to-rose-50/70 rounded-3xl p-5 border border-rose-100/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
                  <span className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs">
                      <Truck size={15} />
                    </div>
                    {amountToFreeShipping === 0 ? (
                      <span className="text-emerald-700 font-bold">Congratulations! You unlocked FREE shipping!</span>
                    ) : (
                      <span>Add <strong className="text-gray-900 font-bold">${amountToFreeShipping.toFixed(2)}</strong> more for <strong className="text-rose-600">Free Shipping</strong></span>
                    )}
                  </span>
                  <span className="text-xs font-bold text-gray-500 bg-white px-2.5 py-1 rounded-full border border-rose-100">{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden border border-gray-200/50 p-0.5">
                  <div 
                    className="bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 h-full rounded-full transition-all duration-500 shadow-xs"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Table / Grid */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FAF7F5]/60 hover:bg-white rounded-3xl p-4 md:p-5 border border-rose-100/70 hover:border-rose-200/90 shadow-2xs hover:shadow-md transition-all duration-300"
                  >
                    {/* Item Image + Details */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-20 h-20 md:w-22 md:h-22 rounded-2xl overflow-hidden bg-white border border-rose-100/80 shrink-0 shadow-2xs">
                        <img 
                          src={item.image || item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-100/80 inline-block mb-1">
                          {item.category || 'Skincare'}
                        </span>
                        <h3 className="font-serif font-semibold text-gray-900 text-base md:text-lg truncate tracking-tight">
                          {cleanName(item.name)}
                        </h3>
                        <p className="text-xs font-bold text-gray-700 mt-1 sm:hidden">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>

                    {/* Quantity & Pricing Controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-7 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-rose-100/60">
                      
                      {/* Price per unit (Desktop) */}
                      <div className="hidden md:block text-right w-16">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold block">Price</span>
                        <span className="text-sm font-semibold text-gray-700">${item.price.toFixed(2)}</span>
                      </div>

                      {/* Quantity Counter */}
                      <div className="flex items-center gap-2 bg-white border border-rose-200/80 rounded-full px-3 py-1.5 shadow-2xs">
                        <button 
                          onClick={() => updateQty(item.id, item.qty - 1)} 
                          aria-label="Decrease quantity"
                          className="w-6 h-6 rounded-full bg-[#FAF7F5] border border-gray-200/60 flex items-center justify-center text-gray-600 hover:text-rose-600 hover:border-rose-300 transition cursor-pointer"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-xs font-bold w-6 text-center text-gray-900">{item.qty}</span>
                        <button 
                          onClick={() => updateQty(item.id, item.qty + 1)} 
                          aria-label="Increase quantity"
                          className="w-6 h-6 rounded-full bg-[#FAF7F5] border border-gray-200/60 flex items-center justify-center text-gray-600 hover:text-rose-600 hover:border-rose-300 transition cursor-pointer"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      {/* Total Item Price */}
                      <div className="text-right w-20">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold block md:hidden">Subtotal</span>
                        <span className="text-base font-serif font-bold text-gray-900">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-rose-600 hover:bg-rose-50 p-2.5 rounded-full transition-all cursor-pointer"
                        aria-label="Remove item"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Box */}
              <div className="bg-[#FAF7F5]/70 rounded-3xl p-6 border border-rose-100/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-gray-800 flex items-center gap-2">
                    <Sparkles size={15} className="text-rose-500" /> Have a Promo Code?
                  </p>
                  <span className="text-[11px] text-gray-500 font-medium">Use code: <strong className="text-rose-500 font-bold">GLOW10</strong></span>
                </div>

                {!appliedPromo ? (
                  <form onSubmit={handleApplyPromo} className="flex gap-2.5">
                    <div className="relative flex-1">
                      <Tag size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Enter coupon code"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-rose-200/70 text-xs md:text-sm bg-white outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all uppercase placeholder:normal-case font-semibold"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-gray-900 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider px-8 rounded-2xl transition duration-300 shadow-xs cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-emerald-800 text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <Check size={16} className="text-emerald-600 shrink-0" />
                      <span>Promo <strong className="font-bold uppercase tracking-wide">{appliedPromo.code}</strong> Applied ({appliedPromo.rate * 100}% OFF)</span>
                    </div>
                    <button 
                      onClick={handleRemovePromo}
                      className="text-emerald-700 hover:text-rose-600 p-1 transition cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}

                {promoError && (
                  <p className="text-rose-500 text-xs font-medium pl-1">{promoError}</p>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-gradient-to-b from-white to-[#FAF7F5]/60 rounded-3xl p-7 border border-rose-200/80 shadow-lg shadow-rose-950/5 sticky top-24 space-y-6">
                <h2 className="text-xl font-serif font-normal text-gray-900 border-b border-rose-100 pb-4">Order Summary</h2>
                
                <div className="space-y-4 text-xs md:text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  {appliedPromo && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount ({appliedPromo.code})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-gray-900">
                      {shipping === 0 ? <span className="text-emerald-600 font-bold uppercase text-xs">Free</span> : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-rose-100 pt-5 flex justify-between items-baseline">
                  <span className="text-base font-serif font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl md:text-3xl font-serif font-bold text-rose-600">${grandTotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-gray-900 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-[0.18em] py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-rose-500/20 flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  Proceed to Checkout 
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Trust Badges */}
                <div className="pt-3 border-t border-rose-100/80 space-y-3">
                  <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-gray-400">
                    <Lock size={13} className="text-rose-400" />
                    <span>Encrypted 256-Bit SSL Checkout</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-600 font-semibold pt-1">
                    <div className="flex items-center justify-center gap-1.5 bg-white py-2.5 px-2 rounded-xl border border-rose-100 shadow-2xs">
                      <RefreshCw size={12} className="text-rose-500" /> 30-Day Returns
                    </div>
                    <div className="flex items-center justify-center gap-1.5 bg-white py-2.5 px-2 rounded-xl border border-rose-100 shadow-2xs">
                      <Award size={12} className="text-rose-500" /> 100% Authentic
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;