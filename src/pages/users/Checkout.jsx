// src/pages/users/Checkout.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  CreditCard, Smartphone, Truck, CheckCircle2, Loader2, 
  MapPin, User, Phone, ArrowLeft, ArrowRight, ShieldCheck, 
  Lock, RefreshCw, Award, Sparkles, QrCode, AlertCircle
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { createOrder, generateKHQR } from "../../services/paymentService";
import { createOrderNotification } from "../../services/notificationService";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const steps = [
  { label: "Shipping", icon: Truck },
  { label: "Payment", icon: CreditCard },
  { label: "Review", icon: ShieldCheck }
];

const Checkout = () => {
  const { currentUser } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [shipping, setShipping] = useState({
    name: currentUser?.displayName || "",
    phone: "",
    address: "",
    city: "Phnom Penh",
  });
  const [paymentMethod, setPaymentMethod] = useState("khqr");

  const [qrString, setQrString] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState("");
  const [pendingOrderId, setPendingOrderId] = useState(null);

  const shippingFee = totalPrice >= 50 || totalPrice === 0 ? 0 : 4.99;
  const grandTotal = totalPrice + shippingFee;

  const canGoNext = () => {
    if (step === 0) return shipping.name.trim() && shipping.phone.trim() && shipping.address.trim();
    return true;
  };

  const buildItems = () =>
    items.map((i) => ({ id: i.id, name: i.name, price: i.price, image: i.image, qty: i.qty }));

  const generateRealQR = async () => {
    if (!currentUser) {
      alert("Please log in to place an order.");
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }
    setQrLoading(true);
    setQrError("");
    try {
      let activeOrderId = pendingOrderId;

      if (!activeOrderId) {
        const { orderId: newOrderId } = await createOrder({
          items: buildItems(),
          paymentMethod: "khqr",
          source: "online",
          userId: currentUser.uid,
          shipping,
        });
        activeOrderId = newOrderId;
        setPendingOrderId(newOrderId);
      }

      const { qrString: qr } = await generateKHQR(activeOrderId, grandTotal);
      setQrString(qr);
    } catch (err) {
      console.error(err);
      setQrError(err.message || "Failed to generate payment QR. Please try again.");
    } finally {
      setQrLoading(false);
    }
  };

  const goToPaymentStep = () => {
    setStep(1);
    if (paymentMethod === "khqr" && !qrString) {
      generateRealQR();
    }
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === "khqr" && pendingOrderId) {
      setOrderId(pendingOrderId);
      try {
        await createOrderNotification({ orderId: pendingOrderId, total: grandTotal, method: "khqr", source: "online" });
      } catch (err) {
        console.error("Notification failed (non-blocking):", err);
      }
      clearCart();
      return;
    }

    if (!currentUser) {
      alert("Please log in to place an order.");
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }

    setPlacing(true);
    try {
      const { orderId: newOrderId } = await createOrder({
        items: buildItems(),
        paymentMethod,
        source: "online",
        userId: currentUser.uid,
        shipping,
      });
      setOrderId(newOrderId);
      try {
        await createOrderNotification({ orderId: newOrderId, total: grandTotal, method: paymentMethod, source: "online" });
      } catch (err) {
        console.error("Notification failed (non-blocking):", err);
      }
      clearCart();
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong placing your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  // SUCCESS STATE
  if (orderId) {
    return (
      <main className="min-h-[80vh] bg-[#FAF7F5] py-16 px-4 md:px-12 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] border border-rose-100 p-8 md:p-12 text-center shadow-2xl shadow-rose-950/5 relative overflow-hidden space-y-6">
            <div className="w-20 h-20 bg-emerald-50 rounded-full border border-emerald-200/80 flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
              <CheckCircle2 size={42} className="stroke-[1.75]" />
            </div>
            
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
                Order Confirmed
              </span>
              <h1 className="font-serif text-3xl md:text-4xl text-gray-900 tracking-tight">Order Placed!</h1>
              <p className="text-gray-500 text-xs md:text-sm">
                Thank you! Your order <span className="font-bold text-gray-800">#{orderId.slice(0, 8).toUpperCase()}</span> has been received.
              </p>
            </div>

            {paymentMethod !== "cod" && (
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-amber-800 flex items-center gap-2.5 text-left">
                <AlertCircle size={18} className="text-amber-500 shrink-0" />
                <span>Awaiting payment confirmation — our team will verify your transfer shortly.</span>
              </div>
            )}

            <p className="text-gray-400 text-xs">We'll email you updates regarding shipping & delivery status.</p>

            <button
              onClick={() => navigate("/shop")}
              className="w-full bg-gray-900 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-[0.2em] py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-rose-500/20 cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    );
  }

  // EMPTY CART STATE
  if (items.length === 0) {
    return (
      <main className="min-h-[80vh] bg-[#FAF7F5] py-16 px-4 md:px-12 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] border border-rose-100 p-10 shadow-xl shadow-rose-950/5 space-y-6">
            <h2 className="font-serif text-2xl text-gray-900">Your cart is empty</h2>
            <p className="text-gray-500 text-xs md:text-sm">Add luxury items to your cart before proceeding to checkout.</p>
            <button
              onClick={() => navigate("/shop")}
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-full transition duration-300 shadow-md cursor-pointer"
            >
              Go to Shop <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 md:px-12 py-10 md:py-14 min-h-[85vh] bg-[#FAF7F5]">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Master Wrapped Container */}
        <div className="bg-white/90 backdrop-blur-md rounded-[2.5rem] border border-rose-100/90 shadow-2xl shadow-rose-950/5 p-6 md:p-10 space-y-8">
          
          {/* Header & Back Link */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-rose-100/70 pb-6 gap-4">
            <div>
              <Link to="/cart" className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 transition mb-1">
                <ArrowLeft size={13} /> Return to Cart
              </Link>
              <h1 className="text-3xl md:text-4xl font-serif font-normal text-gray-900 tracking-tight">Checkout</h1>
            </div>

            {/* Stepper Bar */}
            <div className="flex items-center gap-3 bg-[#FAF7F5] border border-rose-100/80 px-4 py-2.5 rounded-full shadow-2xs self-start md:self-auto">
              {steps.map((s, i) => {
                const Icon = s.icon;
                const isActive = i === step;
                const isDone = i < step;
                return (
                  <div key={s.label} className="flex items-center gap-2">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      isActive 
                        ? "bg-rose-500 text-white shadow-xs" 
                        : isDone 
                        ? "bg-rose-100 text-rose-700" 
                        : "text-gray-400"
                    }`}>
                      <Icon size={13} />
                      <span className="uppercase tracking-wider text-[11px]">{s.label}</span>
                    </div>
                    {i < steps.length - 1 && <div className="w-4 h-px bg-rose-200/70" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Column: Form & Steps */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              
              {/* Step 0: Shipping Details */}
              {step === 0 && (
                <div className="bg-[#FAF7F5]/60 rounded-3xl p-6 md:p-8 border border-rose-100/80 shadow-2xs space-y-6">
                  <div className="flex items-center gap-3 border-b border-rose-100/80 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-500">
                      <Truck size={20} />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl font-medium text-gray-900">Shipping Details</h2>
                      <p className="text-xs text-gray-500">Where should we deliver your luxury skincare order?</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="relative">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={shipping.name}
                        onChange={(e) => setShipping((s) => ({ ...s, name: e.target.value }))}
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-rose-200/70 text-xs md:text-sm bg-white outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all font-medium text-gray-800"
                      />
                    </div>

                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="Phone Number (e.g. 012 345 678)"
                        value={shipping.phone}
                        onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))}
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-rose-200/70 text-xs md:text-sm bg-white outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all font-medium text-gray-800"
                      />
                    </div>

                    <div className="relative">
                      <MapPin size={16} className="absolute left-4 top-4 text-gray-400" />
                      <textarea
                        placeholder="Street Address, House No., Sangkat, Khan"
                        rows={3}
                        value={shipping.address}
                        onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-rose-200/70 text-xs md:text-sm bg-white outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all font-medium text-gray-800 resize-none"
                      />
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        placeholder="City / Province"
                        value={shipping.city}
                        onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                        className="w-full px-4 py-3.5 rounded-2xl border border-rose-200/70 text-xs md:text-sm bg-white outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all font-medium text-gray-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Payment Method */}
              {step === 1 && (
                <div className="bg-[#FAF7F5]/60 rounded-3xl p-6 md:p-8 border border-rose-100/80 shadow-2xs space-y-6">
                  <div className="flex items-center gap-3 border-b border-rose-100/80 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-500">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl font-medium text-gray-900">Payment Method</h2>
                      <p className="text-xs text-gray-500">Select how you would like to pay for your order</p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {[
                      { id: "khqr", label: "KHQR / Bank App", icon: Smartphone, desc: "Scan & pay instantly with ABA, Wing, ACLEDA..." },
                      { id: "card", label: "Credit / Debit Card", icon: CreditCard, desc: "Visa, Mastercard, UnionPay" },
                      { id: "cod", label: "Cash on Delivery", icon: Truck, desc: "Pay with cash upon delivery" },
                    ].map((m) => {
                      const Icon = m.icon;
                      const isSelected = paymentMethod === m.id;
                      return (
                        <label
                          key={m.id}
                          className={`flex items-center gap-4 p-4 md:p-5 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? "border-rose-400 bg-white shadow-md ring-2 ring-rose-100"
                              : "border-rose-100 bg-white/70 hover:bg-white hover:border-rose-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={isSelected}
                            onChange={() => {
                              setPaymentMethod(m.id);
                              if (m.id === "khqr" && !qrString) generateRealQR();
                            }}
                            className="accent-rose-500 w-4 h-4"
                          />
                          <div className={`p-2.5 rounded-xl border ${isSelected ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-gray-50 border-gray-100 text-gray-500"}`}>
                            <Icon size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs md:text-sm font-bold text-gray-900">{m.label}</p>
                            <p className="text-[11px] text-gray-500">{m.desc}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {/* KHQR Card Display */}
                  {paymentMethod === "khqr" && (
                    <div className="bg-white rounded-3xl p-6 border border-rose-200/80 shadow-md space-y-4">
                      {qrLoading ? (
                        <div className="flex flex-col items-center justify-center py-10 space-y-3">
                          <Loader2 size={32} className="animate-spin text-rose-500" />
                          <p className="text-xs font-semibold text-gray-500">Generating secure KHQR payment code...</p>
                        </div>
                      ) : qrError ? (
                        <div className="text-center py-6 space-y-3">
                          <p className="text-rose-500 text-xs font-semibold">{qrError}</p>
                          <button 
                            onClick={generateRealQR} 
                            className="text-xs font-bold text-gray-900 hover:text-rose-600 underline underline-offset-4 cursor-pointer"
                          >
                            Try Again
                          </button>
                        </div>
                      ) : qrString ? (
                        <div className="flex flex-col items-center text-center space-y-4">
                          
                          {/* Bakong KHQR Header Style */}
                          <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white w-full max-w-xs rounded-2xl py-2 px-4 flex items-center justify-between shadow-xs">
                            <span className="font-extrabold tracking-widest text-sm uppercase">KHQR</span>
                            <QrCode size={18} />
                          </div>

                          <div className="p-3 bg-white rounded-2xl border-2 border-dashed border-rose-200 shadow-inner inline-block">
                            <QRCodeCanvas value={qrString} size={180} />
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs text-gray-500 font-medium">Scan with any Mobile Banking App</p>
                            <p className="text-xl font-serif font-bold text-gray-900">${grandTotal.toFixed(2)} USD</p>
                          </div>

                          <p className="text-[11px] text-gray-400 max-w-xs leading-relaxed">
                            After scanning and completing transfer, click <strong className="text-gray-700">Continue → Place Order</strong> below.
                          </p>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Order Review */}
              {step === 2 && (
                <div className="bg-[#FAF7F5]/60 rounded-3xl p-6 md:p-8 border border-rose-100/80 shadow-2xs space-y-6">
                  <div className="flex items-center gap-3 border-b border-rose-100/80 pb-4">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-500">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl font-medium text-gray-900">Review Your Order</h2>
                      <p className="text-xs text-gray-500">Double check your item list and delivery details before finalizing</p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-rose-100/80 text-xs">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-rose-100 shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-gray-400">Qty: {item.qty} × ${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <span className="font-serif font-bold text-gray-900 text-sm">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Details Summary */}
                  <div className="bg-white rounded-2xl p-5 border border-rose-100/80 text-xs space-y-2 text-gray-600">
                    <p><strong className="text-gray-900 font-semibold">Deliver to:</strong> {shipping.name}, {shipping.address}, {shipping.city}</p>
                    <p><strong className="text-gray-900 font-semibold">Phone:</strong> {shipping.phone}</p>
                    <p><strong className="text-gray-900 font-semibold">Payment Option:</strong> {paymentMethod.toUpperCase()}</p>
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 disabled:opacity-0 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back
                </button>

                {step === 0 ? (
                  <button
                    onClick={() => canGoNext() && goToPaymentStep()}
                    disabled={!canGoNext()}
                    className="bg-gray-900 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-[0.18em] px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-rose-500/20 disabled:opacity-40 flex items-center gap-2 cursor-pointer"
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                ) : step === 1 ? (
                  <button
                    onClick={() => setStep(2)}
                    disabled={paymentMethod === "khqr" && (qrLoading || !qrString)}
                    className="bg-gray-900 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-[0.18em] px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-rose-500/20 disabled:opacity-40 flex items-center gap-2 cursor-pointer"
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-[0.18em] px-9 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-rose-500/20 disabled:opacity-60 flex items-center gap-2 cursor-pointer"
                  >
                    {placing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={15} />}
                    {placing ? "Placing Order..." : "Place Order"}
                  </button>
                )}
              </div>

            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-gradient-to-b from-white to-[#FAF7F5]/60 rounded-3xl p-7 border border-rose-200/80 shadow-lg shadow-rose-950/5 sticky top-24 space-y-6">
                <h2 className="text-xl font-serif font-normal text-gray-900 border-b border-rose-100 pb-4">Order Summary</h2>

                {/* Items preview list */}
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <span className="text-gray-600 truncate max-w-[180px]">{item.name} × {item.qty}</span>
                      <span className="font-semibold text-gray-900">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 text-xs border-t border-rose-100 pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-gray-900">
                      {shippingFee === 0 ? <span className="text-emerald-600 font-bold uppercase text-[11px]">Free</span> : `$${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-rose-100 pt-5 flex justify-between items-baseline">
                  <span className="text-base font-serif font-semibold text-gray-900">Total</span>
                  <span className="text-2xl md:text-3xl font-serif font-bold text-rose-600">${grandTotal.toFixed(2)}</span>
                </div>

                {/* Trust Badges */}
                <div className="pt-3 border-t border-rose-100/80 space-y-3">
                  <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-gray-400">
                    <Lock size={13} className="text-rose-400" />
                    <span>Encrypted 256-Bit SSL Checkout</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-600 font-semibold">
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

export default Checkout;