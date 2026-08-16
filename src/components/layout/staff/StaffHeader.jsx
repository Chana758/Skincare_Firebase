// src/components/layout/staff/StaffHeader.jsx
import { Menu, LogOut, User, LayoutDashboard, AlignLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import NotificationBell from "../../common/NotificationBell";
import MessageDropdown from "../../common/MessageDropdown";

const StaffHeader = ({ collapsed, onToggleCollapse, onOpenMobile }) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between px-6 lg:px-8 py-3.5 bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden w-10 h-10 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-all duration-200 shadow-sm"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex w-10 h-10 rounded-xl bg-gray-50 border border-gray-200/80 items-center justify-center text-gray-700 hover:text-rose-600 hover:bg-rose-50/50 hover:border-rose-200 transition-all duration-200 shadow-sm group"
          aria-label="Toggle sidebar"
          title="Toggle Sidebar"
        >
          {collapsed ? (
            <ChevronRight size={20} className="transition-transform duration-300 group-hover:scale-110" />
          ) : (
            <AlignLeft size={20} className="transition-transform duration-300 group-hover:scale-110" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-2.5">
        {isAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-rose-600 bg-gray-50 hover:bg-rose-50/50 px-3.5 py-2.5 rounded-xl border border-gray-200/80 hover:border-rose-200 transition-all duration-200 shadow-sm"
            title="Switch to Admin Console"
          >
            <LayoutDashboard size={15} className="text-gray-600" />
            <span>Admin Console</span>
          </button>
        )}

        <NotificationBell />
        <MessageDropdown />

        <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200/80 shadow-sm ml-1">
          <div className="w-6 h-6 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <User size={13} />
          </div>
          <span className="text-xs text-gray-800 font-semibold tracking-wide truncate max-w-[150px]">
            {currentUser?.displayName || currentUser?.email}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200/80 md:text-white md:bg-rose-500 md:hover:bg-rose-600 md:border-transparent px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm group"
        >
          <LogOut size={15} className="text-gray-600 md:text-white" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default StaffHeader;