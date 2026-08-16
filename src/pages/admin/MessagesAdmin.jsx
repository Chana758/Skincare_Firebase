// src/pages/admin/MessagesAdmin.jsx
import { useMemo, useState } from "react";
import { Mail, MailOpen, CheckCircle2, Trash2, X, Search, RefreshCw, MessageSquare, Clock, Reply } from "lucide-react";
import { useMessages } from "../../hooks/useMessages";
import { markMessageRead, markMessageReplied, deleteMessage } from "../../services/messageService";
import ReplyModal from "../../components/common/ReplyModal";

const FONT_SERIF = { fontFamily: "'Playfair Display', Georgia, serif" };

const StatBox = ({ label, value, subtext, icon: Icon, tint }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-200/95 shadow-md flex items-center justify-between">
    <div>
      <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-500 mb-1">{label}</p>
      <p style={FONT_SERIF} className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
      {subtext && <p className="text-xs text-rose-500 font-bold mt-1">{subtext}</p>}
    </div>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${tint}`}>
      <Icon size={22} />
    </div>
  </div>
);

const statusColor = {
  new: "bg-blue-100 text-blue-800 border border-blue-200",
  read: "bg-amber-100 text-amber-800 border border-amber-200",
  replied: "bg-emerald-100 text-emerald-800 border border-emerald-200",
};

const formatDate = (ts) => {
  if (!ts) return "Just now";
  if (typeof ts.toDate === "function") {
    return ts.toDate().toLocaleString();
  }
  if (ts.seconds) {
    return new Date(ts.seconds * 1000).toLocaleString();
  }
  return "Just now";
};

const MessagesAdmin = () => {
  const { messages, loading } = useMessages();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewing, setViewing] = useState(null);
  const [replyingMessage, setReplyingMessage] = useState(null);

  const stats = useMemo(() => {
    const total = messages.length;
    const newCount = messages.filter((m) => (m.status || "new") === "new").length;
    const repliedCount = messages.filter((m) => m.status === "replied").length;
    return { total, newCount, repliedCount };
  }, [messages]);

  const filtered = useMemo(() => {
    let list = [...messages];
    if (statusFilter !== "all") {
      list = list.filter((m) => (m.status || "new") === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.name?.toLowerCase().includes(q) ||
          m.email?.toLowerCase().includes(q) ||
          m.subject?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [messages, search, statusFilter]);

  const openMessage = async (msg) => {
    setViewing(msg);
    if (!msg.status || msg.status === "new") {
      try {
        await markMessageRead(msg.id);
      } catch (err) {
        console.error("Failed to mark read:", err);
      }
    }
  };

  const handleMarkReplied = async (id) => {
    try {
      await markMessageReplied(id);
      setViewing(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message permanently?")) return;
    try {
      await deleteMessage(id);
      if (viewing?.id === id) setViewing(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete message.");
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={FONT_SERIF} className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Customer Messages
          </h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1 font-semibold">
            {messages.length} total {stats.newCount > 0 && `· ${stats.newCount} unread`} — from storefront contact form
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-5">
        <StatBox 
          label="Total Inquiries" 
          value={stats.total} 
          subtext="All-time messages" 
          icon={MessageSquare} 
          tint="bg-rose-100 text-rose-800 border border-rose-200" 
        />
        <StatBox 
          label="Unread Messages" 
          value={stats.newCount} 
          subtext="Requires attention" 
          icon={Clock} 
          tint="bg-blue-100 text-blue-800 border border-blue-200" 
        />
        <StatBox 
          label="Replied" 
          value={stats.repliedCount} 
          subtext="Successfully resolved" 
          icon={CheckCircle2} 
          tint="bg-emerald-100 text-emerald-800 border border-emerald-200" 
        />
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 md:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div>
            <h2 style={FONT_SERIF} className="text-lg font-bold text-gray-900">Inbox Catalog</h2>
            <p className="text-xs text-gray-600 font-medium mt-0.5">Overview of customer communications</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[260px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, subject..."
                className="w-full bg-gray-50 text-xs font-bold text-gray-900 pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {["all", "new", "read", "replied"].map((s) => {
            const count = s === "all" ? messages.length : messages.filter((m) => (m.status || "new") === s).length;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  statusFilter === s ? "bg-gray-900 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>

        {/* Table / Loading / Empty */}
        {loading ? (
          <div className="min-h-[30vh] flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 text-gray-800 animate-spin" />
              <p className="text-gray-700 text-xs font-bold uppercase tracking-widest animate-pulse">Loading messages...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-gray-500">
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-300 flex items-center justify-center mb-3 shadow-sm">
              <Mail size={20} />
            </div>
            <p className="text-sm font-bold text-gray-800">No messages found</p>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your search criteria or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-600 border-b border-gray-200">
                  <th className="py-3.5 px-5 w-8"></th>
                  <th className="py-3.5 px-5">From</th>
                  <th className="py-3.5 px-5">Subject</th>
                  <th className="py-3.5 px-5">Received</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filtered.map((m) => {
                  const status = m.status || "new";
                  return (
                    <tr
                      key={m.id}
                      onClick={() => openMessage(m)}
                      className={`hover:bg-gray-50/80 transition-colors cursor-pointer group ${
                        status === "new" ? "font-bold bg-blue-50/20" : ""
                      }`}
                    >
                      <td className="py-4 px-5">
                        {status === "new" ? (
                          <Mail size={16} className="text-rose-500" />
                        ) : (
                          <MailOpen size={16} className="text-gray-400" />
                        )}
                      </td>
                      <td className="py-4 px-5">
                        <p className="text-gray-900 font-bold">{m.name}</p>
                        <p className="text-xs text-gray-500 font-semibold">{m.email}</p>
                      </td>
                      <td className="py-4 px-5 text-gray-700 font-semibold max-w-[240px] truncate">{m.subject}</td>
                      <td className="py-4 px-5 text-gray-600 font-semibold text-xs">{formatDate(m.createdAt)}</td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${statusColor[status]}`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setReplyingMessage(m)}
                            className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 transition-all shadow-sm cursor-pointer"
                            aria-label="Reply"
                            title="Reply to message"
                          >
                            <Reply size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(m.id)} 
                            className="p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-sm cursor-pointer"
                            aria-label="Delete"
                            title="Delete message"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Viewing Modal */}
      {viewing && (
        <div className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center px-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-7 md:p-8 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
              <div>
                <h2 style={FONT_SERIF} className="text-xl font-bold text-gray-900">{viewing.subject}</h2>
                <p className="text-xs text-gray-500 mt-1 font-semibold">{formatDate(viewing.createdAt)}</p>
              </div>
              <button 
                onClick={() => setViewing(null)} 
                aria-label="Close" 
                className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-gray-50/80 rounded-2xl p-4 mb-5 border border-gray-200/80 text-sm space-y-0.5">
              <p className="text-gray-900 font-bold">{viewing.name}</p>
              <a href={"mailto:" + viewing.email} className="text-rose-600 hover:underline text-xs font-semibold">
                {viewing.email}
              </a>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-6 font-medium bg-gray-50/40 p-4 rounded-2xl border border-gray-100">
              {viewing.message}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const targetMsg = viewing;
                  setViewing(null);
                  setReplyingMessage(targetMsg);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition shadow-md cursor-pointer"
              >
                <Reply size={15} />
                <span>Send Reply</span>
              </button>
              {viewing.status !== "replied" && (
                <button
                  onClick={() => handleMarkReplied(viewing.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition shadow-md cursor-pointer"
                >
                  <CheckCircle2 size={15} />
                  <span>Mark Replied</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyingMessage && (
        <ReplyModal
          message={replyingMessage}
          onClose={() => setReplyingMessage(null)}
          onSuccess={(id) => handleMarkReplied(id)}
        />
      )}
    </div>
  );
};

export default MessagesAdmin;