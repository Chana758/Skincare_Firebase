// src/components/layout/Navbar.jsx
import { useState } from "react";
import { Search, User, ShoppingBag, Menu, X, LogOut, Package, Heart } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

// Import the data correctly
import { menuItems } from "../../data/products";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate("/home");
  };

  // ពិនិត្យថាតើ link នេះ active ដែរឬទេ (ផ្អែកលើ pathname បច្ចុប្បន្ន)
  const isActive = (link) => location.pathname === link;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between px-6 md:px-16 py-5 md:py-6">
        <Link to="/home" className="text-2xl md:text-3xl font-serif tracking-tighter">
          LUMIÈRE
        </Link>

        {/* Desktop menu */}
        <div className="hidden lg:flex gap-8 text-[13px] font-medium tracking-widest text-gray-700 uppercase">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className={`relative py-2 transition hover:text-rose-400 ${
                isActive(item.link) ? "text-rose-400" : ""
              }`}
            >
              {item.name}
              {/* Active underline indicator */}
              <span
                className={`absolute left-0 -bottom-0.5 h-[2px] bg-rose-400 transition-all duration-300 ${
                  isActive(item.link) ? "w-full" : "w-0"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-5 text-gray-700">
          <Search size={20} className="cursor-pointer hover:text-rose-400 transition hidden sm:block" />

          {/* Wishlist */}
          <Link to="/wishlist" aria-label="Wishlist" className="hidden sm:block">
            <Heart size={20} className="cursor-pointer hover:text-rose-400 transition" />
          </Link>

          {/* User menu */}
          <div className="relative">
            <button onClick={() => setUserMenuOpen((v) => !v)} aria-label="Account">
              <User size={20} className="cursor-pointer hover:text-rose-400 transition" />
            </button>
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-3 bg-white shadow-lg rounded-xl py-2 w-48 border border-gray-50 z-20 text-sm">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 text-xs text-gray-400 truncate">
                        {currentUser.displayName || currentUser.email}
                      </div>
                      <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-rose-50/60 hover:text-rose-400">
                        <Package size={14} /> My Orders
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-rose-50/60 hover:text-rose-400">
                        <LogOut size={14} /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-rose-50/60 hover:text-rose-400">Login</Link>
                      <Link to="/register" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-rose-50/60 hover:text-rose-400">Register</Link>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <Link to="/cart" className="relative" aria-label="Cart">
            <ShoppingBag size={20} className="cursor-pointer hover:text-rose-400 transition" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-400 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <button className="lg:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 px-6 py-4 flex flex-col gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              onClick={() => setMobileOpen(false)}
              className={`py-3 text-sm font-medium uppercase tracking-wider border-b border-gray-50 last:border-0 transition hover:text-rose-400 ${
                isActive(item.link) ? "text-rose-400" : "text-gray-700"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* Wishlist link ក្នុង mobile menu ផងដែរ */}
          <Link
            to="/wishlist"
            onClick={() => setMobileOpen(false)}
            className="py-3 text-sm font-medium uppercase tracking-wider text-gray-700 hover:text-rose-400 flex items-center gap-2"
          >
            <Heart size={16} /> Wishlist
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;