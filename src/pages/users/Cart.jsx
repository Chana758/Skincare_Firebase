// src/pages/user/Cart.jsx
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";

const Cart = () => {
  const { items, updateQty, removeFromCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center">
        <ShoppingBag size={48} className="text-gray-300 mb-4" />
        <h1 className="text-2xl font-serif text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 text-sm mb-8">មិនទាន់មានផលិតផលនៅក្នុង cart របស់អ្នកទេ</p>
        <Link
          to="/shop"
          className="bg-rose-400 hover:bg-rose-500 text-white text-sm font-semibold uppercase tracking-wider px-8 py-3 rounded-full transition"
        >
          Start Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="px-6 md:px-20 py-14 min-h-[70vh] grid lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-5">
        <h1 className="text-2xl font-serif text-gray-900 mb-6">Shopping Cart</h1>
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 items-center border-b border-gray-100 pb-5">
            <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-[#F7EFEC]" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3 border border-gray-200 rounded-full px-3 py-1.5">
              <button onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease">
                <Minus size={14} />
              </button>
              <span className="text-sm w-4 text-center">{item.qty}</span>
              <button onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase">
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-gray-400 hover:text-rose-400 transition"
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-[#FDFBF9] rounded-2xl p-7 h-fit">
        <h2 className="text-lg font-serif text-gray-900 mb-5">Order Summary</h2>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Subtotal</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>Shipping</span>
          <span>{totalPrice >= 50 ? "Free" : "$4.99"}</span>
        </div>
        <div className="flex justify-between text-base font-semibold text-gray-900 border-t border-gray-200 pt-4 mb-6">
          <span>Total</span>
          <span>${(totalPrice + (totalPrice >= 50 || totalPrice === 0 ? 0 : 4.99)).toFixed(2)}</span>
        </div>
        <button className="w-full bg-rose-400 hover:bg-rose-500 text-white text-sm font-semibold uppercase tracking-wider py-3.5 rounded-full transition">
          Checkout
        </button>
      </div>
    </main>
  );
};

export default Cart;