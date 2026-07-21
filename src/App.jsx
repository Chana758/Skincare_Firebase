// src/App.jsx
import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/guards/ProtectedRoute";

// Lazy-load ទំព័រនីមួយៗ - code-splitting ស្វ័យប្រវត្តិដើម្បីបង្កើន performance score
// (Home load ភ្លាមៗ ព្រោះជាទំព័រដំបូងគេដែល user ឃើញ - ទំព័រផ្សេងទៀត load តាមតម្រូវការ)
import Home from "./pages/user/Home";
const Shop = lazy(() => import("./pages/user/Shop"));
const About = lazy(() => import("./pages/user/About"));
const Cart = lazy(() => import("./pages/user/Cart"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-rose-300 border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<MainLayout />}>
                {/* / redirect ទៅ /home ដើម្បីត្រូវនឹង menuItems.link */}
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home />} />

                <Route path="/shop" element={<Shop />} />
                <Route path="/best_sellers" element={<Shop forcedFilter="bestseller" pageTitle="Best Sellers" />} />
                <Route path="/new_arrivals" element={<Shop forcedFilter="new" pageTitle="New Arrivals" />} />

                <Route path="/about" element={<About />} />
                <Route
                  path="/blog"
                  element={
                    <div className="px-6 md:px-20 py-20 min-h-[60vh] text-center text-gray-500">
                      Blog (coming soon)
                    </div>
                  }
                />

                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <div className="px-6 md:px-20 py-20 min-h-[60vh] text-center text-gray-500">
                        My Orders (coming soon)
                      </div>
                    </ProtectedRoute>
                  }
                />

                {/* 404 */}
                <Route
                  path="*"
                  element={
                    <div className="px-6 py-32 text-center min-h-[60vh]">
                      <h1 className="text-3xl font-serif mb-3">404</h1>
                      <p className="text-gray-500">រកមិនឃើញទំព័រនេះទេ</p>
                    </div>
                  }
                />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;