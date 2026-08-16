// src/components/guards/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Usage:
 *  <ProtectedRoute><Cart /></ProtectedRoute>                        // any logged-in user
 *  <ProtectedRoute allowedRoles={["admin"]}><AdminLayout /></ProtectedRoute>
 *  <ProtectedRoute allowedRoles={["staff", "admin"]}><POSHome /></ProtectedRoute>
 */
const ProtectedRoute = ({ children, allowedRoles, adminOnly = false }) => {
  const { currentUser, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-gray-400">
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const requiredRoles = adminOnly ? ["admin"] : allowedRoles;

  if (requiredRoles && !requiredRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;