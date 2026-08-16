// src/components/common/MessageDropdown.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Mail, MailOpen, ArrowRight } from "lucide-react";
import { useMessages } from "../../hooks/useMessages";
import { markMessageRead } from "../../services/messageService";

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

const MessageDropdown = () => {
  const { messages, loading } = useMessages();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const unreadMessages = messages.filter((m) => (m.status || "new") === "new");
  const unreadCount = unreadMessages.length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = async (msg) => {
    if ((msg.status || "new") === "new") {
      try {
        await markMessageRead(msg.id);
      } catch (err) {
        console.error("Failed to mark message read:", err);
      }
    }
    setOpen(false);
    navigate("/admin/messages");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative w-10 h-10 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-center text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 hover:border-blue-200 transition-all duration-200 shadow-xs group cursor-pointer"
        aria-label="Customer Messages"
        title="Customer Messages"
      >
        <MessageSquare size={18} className="transition-transform duration-200 group-hover:scale-110" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[10px] font-extrabold flex items-center justify-center rounded-full border-2 border-white shadow-xs animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Box */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-gray-200 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-gray-900">Customer Messages</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded-full border border-blue-200">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>

          <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-100">
            {loading ? (
              <div className="p-6 text-center text-xs text-gray-400">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-500">
                  <MessageSquare size={18} />
                </div>
                <p className="text-xs font-medium text-gray-500">No messages found</p>
              </div>
            ) : (
              messages.slice(0, 5).map((m) => {
                const isUnread = (m.status || "new") === "new";
                return (
                  <div
                    key={m.id}
                    onClick={() => handleItemClick(m)}
                    className={`group relative flex items-start gap-3 p-3.5 transition-colors cursor-pointer hover:bg-blue-50/40 ${
                      isUnread ? "bg-blue-50/20 font-semibold" : "bg-white"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200/70 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                      {isUnread ? <Mail size={16} className="text-blue-600" /> : <MailOpen size={16} className="text-gray-400" />}
                    </div>

                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className="text-xs font-bold text-gray-900 truncate">{m.name}</p>
                        <span className="text-[10px] font-medium text-gray-400 shrink-0">
                          {formatTimeAgo(m.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-gray-800 truncate">{m.subject}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{m.message}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-2.5 bg-gray-50 border-t border-gray-100 text-center">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/admin/messages");
              }}
              className="w-full text-xs font-bold text-gray-700 hover:text-blue-600 flex items-center justify-center gap-1.5 py-1 transition-colors cursor-pointer"
            >
              View All Messages <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageDropdown;