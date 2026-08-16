// src/components/layout/admin/AdminSidebar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, LayoutGrid, Newspaper,
  ShoppingCart, Percent, MessageSquare, BarChart3, Users, ScanBarcode,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const FONT_SERIF = { fontFamily: "'Playfair Display', Georgia, serif" };

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin", end: true, roles: ["admin"] },
      { name: "Point of Sale", icon: <ScanBarcode size={18} />, path: "/staff", roles: ["admin", "staff"], external: true },
    ],
  },
  {
    label: "Catalog",
    items: [
      { name: "Products", icon: <Package size={18} />, path: "/admin/products", roles: ["admin"] },
      { name: "Categories", icon: <LayoutGrid size={18} />, path: "/admin/categories", roles: ["admin"] },
      { name: "Blog", icon: <Newspaper size={18} />, path: "/admin/blog", roles: ["admin"] },
    ],
  },
  {
    label: "Sales",
    items: [
      { name: "Orders", icon: <ShoppingCart size={18} />, path: "/admin/orders", roles: ["admin", "staff"] }, // Admin & Staff មើលឃើញដូចគ្នា
      { name: "Discounts", icon: <Percent size={18} />, path: "/admin/discounts", roles: ["admin"] },
    ],
  },
  {
    label: "Engagement",
    items: [
      { name: "Messages", icon: <MessageSquare size={18} />, path: "/admin/messages", roles: ["admin", "staff"] }, // Admin & Staff មើលឃើញដូចគ្នា
    ],
  },
  {
    label: "People & Reports",
    items: [
      { name: "Staff", icon: <Users size={18} />, path: "/admin/staff", roles: ["admin"] },
      { name: "Reports", icon: <BarChart3 size={18} />, path: "/admin/reports", roles: ["admin"] },
    ],
  },
];

const AdminSidebar = ({ collapsed, mobileOpen, onCloseMobile }) => {
  const location = useLocation();
  const { role } = useAuth();
  const userRole = role || "admin";

  const isActive = (item) =>
    item.end ? location.pathname === item.path : location.pathname.startsWith(item.path);

  return (
    <aside
      className={`fixed lg:sticky top-0 h-screen bg-gradient-to-b from-[#181A20] via-[#12141A] to-[#0D0E12] text-gray-300 flex flex-col z-50
        border-r border-white/[0.08] transition-all duration-300 shadow-2xl
        ${collapsed ? "w-20" : "w-72"} ${mobileOpen ? "left-0" : "-left-72 lg:left-0"}`}
    >
      <div className={`flex items-center border-b border-white/[0.08] gap-3.5 ${collapsed ? "py-6 px-0 justify-center" : "p-6"}`}>
        <div className="flex-shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C9A227]/25 to-[#C9A227]/5 border border-[#C9A227]/40 flex items-center justify-center shadow-inner">
            <span className="text-[#F3D984] font-serif text-xl tracking-wider">L</span>
          </div>
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 style={FONT_SERIF} className="text-white font-bold text-lg tracking-wide leading-tight truncate">
              LUMIÈRE
            </h1>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C9A227] mt-0.5">Console</p>
          </div>
        )}
      </div>

      <nav className={`flex-1 overflow-y-auto py-5 space-y-6 ${collapsed ? "px-3" : "px-4"}`}>
        {NAV_SECTIONS.map((section) => {
          const visibleItems = section.items.filter((item) => item.roles.includes(userRole));
          if (visibleItems.length === 0) return null;
          return (
            <div key={section.label}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
                  {section.label}
                </p>
              )}
              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      title={collapsed ? item.name : undefined}
                      onClick={onCloseMobile}
                      className={`relative flex items-center gap-3.5 py-3 rounded-2xl transition-all duration-200 group
                        ${collapsed ? "px-0 justify-center" : "px-3.5"}
                        ${
                          active
                            ? "bg-gradient-to-r from-[#C9A227]/20 via-[#C9A227]/10 to-transparent text-white border border-[#C9A227]/30 shadow-md"
                            : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
                        }`}
                    >
                      {active && !collapsed && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#C9A227] shadow-[0_0_12px_rgba(201,162,39,0.7)]" />
                      )}
                      <span className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${active ? "text-[#F3D984]" : "text-gray-500 group-hover:text-gray-300"}`}>
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className={`text-[13.5px] tracking-wide ${active ? "font-semibold text-white" : "font-medium"}`}>
                          {item.name}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;