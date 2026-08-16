// src/components/common/NotificationBell.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, ShoppingBag, CheckCheck, Trash2, ArrowRight 
} from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import { 
  markNotificationRead, 
  markAllNotificationsRead, 
  deleteNotification 
} from "../../services/notificationService";

// Helper សម្រាប់គណនានិងបង្ហាញ រយៈពេល Time Ago ឲ្យបានច្បាស់លាស់
const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "just now";

  let date;
  if (typeof timestamp.toDate === "function") {
    date = timestamp.toDate();
  } else if (timestamp.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    date = new Date(timestamp);
  }

  if (isNaN(date.getTime())) return "just now";

  const diffSecs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSecs < 10) return "just now";
  if (diffSecs < 60) return `${diffSecs}s ago`;
  const mins = Math.floor(diffSecs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const NotificationBell = () => {
  const { notifications, unreadCount, loading } = useNotifications();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // បិទ Dropdown នៅពេលចុចខាងក្រៅ Box (Click Outside)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = async (n) => {
    if (!n.read) {
      try {
        await markNotificationRead(n.id);
      } catch (err) {
        console.error("Failed to mark read:", err);
      }
    }
    setOpen(false);
    navigate("/admin/orders");
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative w-10 h-10 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-center text-gray-700 hover:text-rose-600 hover:bg-rose-50/50 hover:border-rose-200 transition-all duration-200 shadow-sm group cursor-pointer"
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell size={18} className="transition-transform duration-200 group-hover:scale-110" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center rounded-full border-2 border-white shadow-xs animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-rose-100 shadow-xl shadow-rose-950/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-rose-100/70">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-gray-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-600 rounded-full border border-rose-200/60">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <CheckCheck size={13} /> Mark all read
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
            {loading ? (
              <div className="p-6 text-center text-xs text-gray-400">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-400">
                  <Bell size={18} />
                </div>
                <p className="text-xs font-medium text-gray-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => {
                const isUnread = !n.read;
                const orderNum = n.orderId ? `#${n.orderId.slice(0, 8).toUpperCase()}` : "Order";
                const orderTotal = Number(n.total || 0).toFixed(2);
                const isPos = n.source === "pos";

                return (
                  <div
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    className={`group relative flex items-start gap-3 p-3.5 transition-colors cursor-pointer hover:bg-rose-50/40 ${
                      isUnread ? "bg-rose-50/20" : "bg-white"
                    }`}
                  >
                    {/* Order Icon */}
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                      <ShoppingBag size={16} />
                    </div>

                    {/* Order Information */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {n.message || `New ${isPos ? "POS" : "Online"} Order`}
                        </p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-medium text-gray-400">
                            {formatTimeAgo(n.createdAt)}
                          </span>
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-gray-600">
                        Order <span className="font-semibold text-gray-900">{orderNum}</span> •{" "}
                        <span className="font-bold text-rose-600">${orderTotal}</span>
                      </p>

                      <div className="flex items-center gap-2 mt-1.5">
                        {n.method && (
                          <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 border border-gray-200/60">
                            {n.method}
                          </span>
                        )}
                        {n.source && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            {n.source}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete Action Button */}
                    <button
                      onClick={(e) => handleDelete(e, n.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-rose-500 p-1 transition-opacity cursor-pointer shrink-0"
                      title="Delete notification"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-2.5 bg-gray-50/80 border-t border-gray-100 text-center">
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/admin/orders");
                }}
                className="w-full text-xs font-bold text-gray-700 hover:text-rose-600 flex items-center justify-center gap-1.5 py-1 transition-colors cursor-pointer"
              >
                View All Orders <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;