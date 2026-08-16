// src/components/layout/Navbar.jsx
import { Search, User, ShoppingBag, Heart, Package, LogOut, X, Menu, ShieldCheck, ScanBarcode, ArrowRight, ChevronRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { menuItems } from '../../data/products';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // States សម្រាប់គ្រប់គ្រង Search Modal និងទិន្នន័យស្វែងរក
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);

  const { currentUser, isAdmin, isStaff, logout } = useAuth();
  const { totalItems } = useCart();
  const { favorites } = useFavorites();
  const favoritesCount = currentUser ? favorites.length : 0;

  // ទាញយកទំនិញពី Firestore ទុកសម្រាប់ធ្វើការ Search ភ្លាមៗ (Live Search)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(items);
      } catch (error) {
        console.error("Error fetching products for search:", error);
      }
    };
    fetchProducts();
  }, []);

  // ច្រោះទំនិញតាមពាក្យដែលបានវាយក្នុងប្រអប់ Search
  const filteredProducts = searchQuery.trim() === "" 
    ? [] 
    : products.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category?.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate("/");
  };

  const isActive = (link) => location.pathname === link;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 overflow-visible">
        <div className="flex items-center justify-between px-6 md:px-16 py-5 md:py-6">
          <Link to='/' className='text-2xl md:text-3xl font-serif tracking-tighter'>LUMIÈRE</Link>

          {/* Nav links */}
          <div className="hidden lg:flex gap-8 text-[13px] font-medium tracking-widest text-gray-700 uppercase">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                className={`relative py-2 transition hover:text-rose-400 ${isActive(item.link) ? "text-rose-400" : ""}`}
              >
                {item.name}
                <span className={`absolute left-0 -bottom-0.5 h-[2px] bg-rose-400 transition-all duration-300 ${isActive(item.link) ? "w-full" : "w-0"}`} />
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-5 text-gray-700">
            {/* ប៊ូតុងចុចបើក Search Modal */}
            <button onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search size={20} className="cursor-pointer hover:text-rose-400 transition hidden sm:block" />
            </button>

            <Link to="/favorites" aria-label="Favorites" className="relative hidden sm:block">
              <Heart size={20} className="cursor-pointer hover:text-rose-400 transition" />
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-400 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            <div className='relative'>
              <button onClick={() => setUserMenuOpen((v) => !v)} aria-label="Account">
                <User size={20} className="cursor-pointer hover:text-rose-400" />
              </button>
              {userMenuOpen && (
                <>
                  <div
                    className='fixed inset-0 z-[55]'
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div
                    className='absolute right-0 top-full mt-3 bg-white shadow-lg rounded-xl py-2 w-52 border border-gray-200 z-[60] text-sm'
                    onClick={(e) => e.stopPropagation()}
                  >
                    {currentUser ? (
                      <>
                        <div className='px-4 py-2 text-xs text-gray-400 truncate'>
                          {currentUser.displayName || currentUser.email}
                        </div>

                        {isAdmin && (
                          <Link
                            to='/admin'
                            onClick={() => setUserMenuOpen(false)}
                            className='flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-rose-50/60 hover:text-rose-400'
                          >
                            <ShieldCheck size={14} /> Admin Dashboard
                          </Link>
                        )}

                        {isStaff && (
                          <Link
                            to='/staff'
                            onClick={() => setUserMenuOpen(false)}
                            className='flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-rose-50/60 hover:text-rose-400'
                          >
                            <ScanBarcode size={14} /> Staff Dashboard
                          </Link>
                        )}

                        {!isAdmin && !isStaff && (
                          <Link
                            to='/orders'
                            onClick={() => setUserMenuOpen(false)}
                            className='flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-rose-50/60 hover:text-rose-400'
                          >
                            <Package size={14} /> My Orders
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-rose-50/60 hover:text-rose-400"
                        >
                          <LogOut size={14} /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-gray-700 hover:bg-rose-50/60 hover:text-rose-400"
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-gray-700 hover:bg-rose-50/60 hover:text-rose-400"
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Cart Icon & Fixed Badge */}
            <Link to='/cart' className='relative inline-flex items-center' aria-label='Cart'>
              <ShoppingBag size={20} className="cursor-pointer hover:text-rose-400 transition" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-400 text-white text-[10px] font-bold px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-sm">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            <button className='lg:hidden z-50' onClick={() => setMobileOpen((v) => !v)} aria-label='Menu'>
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* --- LUXURY MOBILE SIDEBAR (Drawer from Left to Right) --- */}
        {/* Backdrop overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 backdrop-blur-xs z-[70] transition-opacity duration-300 lg:hidden ${
            mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Sliding Sidebar Panel */}
        <div 
          className={`fixed top-0 left-0 bottom-0 w-[80%] max-w-[320px] bg-white z-[80] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-rose-100 bg-rose-50/30">
            <span className="text-xl font-serif tracking-tighter text-gray-900">LUMIÈRE</span>
            <button 
              onClick={() => setMobileOpen(false)}
              className="w-9 h-9 rounded-full bg-white border border-rose-100 flex items-center justify-center text-gray-700 hover:text-rose-400 hover:border-rose-300 transition shadow-2xs"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Sidebar Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
            {/* Search Box Trigger inside Sidebar */}
            <button 
              onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
              className="flex items-center justify-between w-full px-4 py-3 bg-rose-50/50 border border-rose-100/80 rounded-xl text-xs font-semibold tracking-wider uppercase text-gray-700 hover:border-rose-300 transition"
            >
              <span className="flex items-center gap-2.5">
                <Search size={16} className="text-rose-400" /> Search products...
              </span>
              <span className="text-[10px] text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-100">Ctrl+K</span>
            </button>

            {/* Navigation Links */}
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-1">Menu</p>
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                    isActive(item.link) 
                      ? "bg-rose-50 text-rose-500 border border-rose-100" 
                      : "text-gray-700 hover:bg-gray-50 hover:text-rose-400"
                  }`}
                >
                  {item.name}
                  <ChevronRight size={14} className={isActive(item.link) ? "text-rose-400" : "text-gray-300"} />
                </Link>
              ))}
              
              <Link
                to="/favorites"
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  isActive("/favorites") 
                    ? "bg-rose-50 text-rose-500 border border-rose-100" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-rose-400"
                }`}
              >
                <span className="flex items-center gap-2">Favorites</span>
                {favoritesCount > 0 ? (
                  <span className="bg-rose-400 text-white text-[10px] px-2 py-0.5 rounded-full">{favoritesCount}</span>
                ) : (
                  <ChevronRight size={14} className="text-gray-300" />
                )}
              </Link>
            </div>

            {/* Account & Dashboard Section */}
            <div className="flex flex-col gap-1 pt-4 border-t border-gray-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-1">Account & Dashboard</p>
              
              {currentUser ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-rose-50 hover:text-rose-400 transition"
                    >
                      <ShieldCheck size={16} className="text-rose-400" /> Admin Dashboard
                    </Link>
                  )}

                  {isStaff && (
                    <Link
                      to="/staff"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-rose-50 hover:text-rose-400 transition"
                    >
                      <ScanBarcode size={16} className="text-rose-400" /> Staff Dashboard
                    </Link>
                  )}

                  {!isAdmin && !isStaff && (
                    <Link
                      to="/orders"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-rose-50 hover:text-rose-400 transition"
                    >
                      <Package size={16} className="text-rose-400" /> My Orders
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-600 hover:bg-rose-50 transition text-left mt-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-500 text-white shadow-sm hover:bg-rose-600 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center py-3 rounded-xl text-xs font-bold uppercase tracking-wider border border-rose-200 text-gray-700 hover:bg-rose-50 transition"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- SEARCH MODAL OVERLAY --- */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/60 backdrop-blur-sm animate-fadeIn">
          {/* Header របស់ Search Modal */}
          <div className="bg-white px-6 md:px-20 py-6 shadow-md">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 border-b-2 border-gray-900 pb-2">
                <Search size={22} className="text-gray-400" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skincare products, categories..."
                  className="w-full text-lg md:text-xl bg-transparent outline-none text-gray-900 placeholder:text-gray-400 font-serif"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-xs font-bold text-gray-400 hover:text-gray-700 uppercase">
                    Clear
                  </button>
                )}
              </div>
              <button 
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-rose-100 hover:text-rose-500 flex items-center justify-center transition"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* លទ្ធផលនៃការស្វែងរក (Live Search Results) */}
          <div className="flex-1 overflow-y-auto px-6 md:px-20 py-8 bg-[#FDFBF9]">
            <div className="max-w-4xl mx-auto">
              {searchQuery.trim() === "" ? (
                <div className="text-center py-20 text-gray-400 font-medium">
                  <p className="text-sm uppercase tracking-widest mb-2 font-bold text-gray-400">Popular Suggestions</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {["Serum", "Cleanser", "Cream", "Sunscreen", "Mask"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-4 py-2 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:border-rose-400 hover:text-rose-500 transition shadow-sm"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
                    Found {filteredProducts.length} results for "{searchQuery}"
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-rose-100 shadow-md hover:border-rose-400 hover:shadow-lg transition group"
                      >
                        <img 
                          src={product.image || product.imageUrl || "https://placehold.co/100"} 
                          alt={product.name} 
                          className="w-16 h-16 object-cover rounded-xl border border-gray-100"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-gray-900 font-bold text-sm truncate group-hover:text-rose-500 transition">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">${product.price}</p>
                        </div>
                        <ArrowRight size={16} className="text-gray-400 group-hover:text-rose-500 group-hover:translate-x-1 transition" />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-gray-500">
                  <p className="font-serif text-lg text-gray-800 font-bold mb-1">No products found</p>
                  <p className="text-xs text-gray-500">Try checking your spelling or searching for a different keyword.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;