
import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
import ProductCard from "../../components/common/Productcard";

const Favorites = () => {
  const { currentUser } = useAuth();
  const { favorites } = useFavorites();

  return (
    <main className="min-h-[75vh] bg-[#FAF7F5] py-12 px-6 md:px-16">
      <div className="max-w-[1300px] mx-auto">

        {/* Page Header */}
        <div className="mb-10 border-b border-rose-100/60 pb-6 flex items-baseline justify-between">
          <h1 className="text-3xl md:text-4xl font-serif font-normal text-gray-900 tracking-tight">
            Favorites
          </h1>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 bg-white px-3.5 py-1.5 rounded-full border border-rose-100 shadow-2xs">
            {favorites.length} {favorites.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        {!currentUser ? (
          /* Not logged in */
          <div className="bg-white rounded-3xl border border-rose-100/80 p-12 md:p-20 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-5 text-rose-400 border border-rose-100">
              <Heart size={28} className="stroke-[1.5]" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-gray-900 mb-3">
              Log in to view your favorites
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mb-8 max-w-md mx-auto leading-relaxed">
              Your wishlist is saved to your account. Log in to see the products you've saved.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-rose-500 text-white text-xs font-semibold uppercase tracking-widest px-10 py-4 rounded-full transition duration-300 shadow-sm group"
            >
              Log In <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : favorites.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-rose-100/80 p-12 md:p-20 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-5 text-rose-400 border border-rose-100">
              <Heart size={28} className="stroke-[1.5]" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-gray-900 mb-3">
              No favorites yet
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mb-8 max-w-md mx-auto leading-relaxed">
              You haven't saved any luxury products to your wishlist yet. Explore our collection and find your signature skincare.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-rose-500 text-white text-xs font-semibold uppercase tracking-widest px-10 py-4 rounded-full transition duration-300 shadow-sm group"
            >
              Explore Collection <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
};

export default Favorites;