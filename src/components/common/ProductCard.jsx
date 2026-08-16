// src/components/common/ProductCard.jsx
import { memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";

const ProductCard = ({ product }) => {
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  const liked = currentUser ? isFavorite(product.id) : false;

  // Any action that touches a per-account feature sends a guest straight to
  // Login, remembering where they were so they land back here afterward.
  const requireLogin = () => {
    navigate("/login", { state: { from: location } });
  };

  const handleAdd = () => {
    if (!currentUser) return requireLogin();
    addToCart(product, 1);
  };

  const handleToggleFavorite = () => {
    if (!currentUser) return requireLogin();
    toggleFavorite(product);
  };

  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F7EFEC]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && <span className="bg-white/90 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">New</span>}
          {product.oldPrice && <span className="bg-rose-400 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">Sale</span>}
        </div>
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 bg-white/90 rounded-full p-2 hover:bg-white transition"
          aria-label={currentUser ? "Toggle favorite" : "Log in to save favorites"}
        >
          <Heart size={16} className={liked ? "fill-rose-400 text-rose-400" : "text-gray-600"} />
        </button>
        <button
          onClick={handleAdd}
          className="absolute bottom-3 left-3 right-3 bg-gray-900/90 text-white text-xs font-semibold uppercase tracking-widest py-3 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <ShoppingBag size={14} /> {currentUser ? "Add to Cart" : "Log In to Buy"}
        </button>
      </div>
      <div className="pt-4">
        <div className="flex items-center gap-1 text-amber-400 mb-1">
          <Star size={12} className="fill-amber-400" />
          <span className="text-xs text-gray-500">{product.rating} ({product.reviews})</span>
        </div>
        <h3 className="text-sm font-medium text-gray-900 leading-snug">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-gray-900">${product.price}</span>
          {product.oldPrice && <span className="text-xs text-gray-400 line-through">${product.oldPrice}</span>}
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);