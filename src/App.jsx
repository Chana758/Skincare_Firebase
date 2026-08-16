// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/guards/ProtectedRoute";

// Public pages
import Orders from './pages/Orders';
import Home from "./pages/users/Home";
import Shop from "./pages/users/Shop";
import BestSellers from "./pages/users/BestSellers";
import Cart from "./pages/users/Cart";
import Checkout from "./pages/users/Checkout";
import About from "./pages/users/About";
import Blog from "./pages/users/Blog";
import Contact from "./pages/users/Contact";
import Favorites from "./pages/users/Favorites";
import NewArrivals from "./pages/users/NewArrivals";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Staff (POS)
import StaffLayout from "./components/layout/staff/StaffLayout";
import POSHome from "./pages/staff/POSHome";
import ShiftHistory from "./pages/staff/ShiftHistory";

// Admin
import AdminLayout from "./components/layout/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import CategoriesAdmin from "./pages/admin/CategoriesAdmin";
import BlogAdmin from "./pages/admin/BlogAdmin";
import OrdersAdmin from "./pages/admin/OrdersAdmin";
import DiscountsAdmin from "./pages/admin/DiscountsAdmin";
import StaffAdmin from "./pages/admin/StaffAdmin";
import ReportsAdmin from "./pages/admin/ReportsAdmin";
import MessagesAdmin from "./pages/admin/MessagesAdmin";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ---------- Public storefront ---------- */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/best_sellers" element={<BestSellers />} />
          <Route path="/new_arrivals" element={<NewArrivals />} />
          <Route path="/orders" element={<Orders />} />

          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        </Route>

        {/* ---------- Auth ---------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ---------- Staff console (POS & Shift History only) ---------- */}
        <Route
          path="/staff"
          element={<ProtectedRoute allowedRoles={["staff", "admin"]}><StaffLayout /></ProtectedRoute>}
        >
          <Route index element={<POSHome />} />
          <Route path="history" element={<ShiftHistory />} />
        </Route>

        {/* ---------- Admin console (Admin & Staff share Orders & Messages) ---------- */}
        <Route
          path="/admin"
          element={<ProtectedRoute allowedRoles={["admin", "staff"]}><AdminLayout /></ProtectedRoute>}
        >
          <Route index element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
          <Route path="products" element={<ProtectedRoute adminOnly><ProductsAdmin /></ProtectedRoute>} />
          <Route path="categories" element={<ProtectedRoute adminOnly><CategoriesAdmin /></ProtectedRoute>} />
          <Route path="blog" element={<ProtectedRoute adminOnly><BlogAdmin /></ProtectedRoute>} />
          <Route path="orders" element={<OrdersAdmin />} /> {/* Admin & Staff មើលឃើញដូចគ្នា */}
          <Route path="discounts" element={<ProtectedRoute adminOnly><DiscountsAdmin /></ProtectedRoute>} />
          <Route path="staff" element={<ProtectedRoute adminOnly><StaffAdmin /></ProtectedRoute>} />
          <Route path="reports" element={<ProtectedRoute adminOnly><ReportsAdmin /></ProtectedRoute>} />
          <Route path="messages" element={<MessagesAdmin />} /> {/* Admin & Staff មើលឃើញដូចគ្នា */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;