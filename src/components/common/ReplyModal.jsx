// src/components/common/ReplyModal.jsx
import { useState } from "react";
import { X, Send, Mail } from "lucide-react";
import { replyToCustomerMessage } from "../../services/messageService";

const ReplyModal = ({ message, onClose, onSuccess }) => {
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  if (!message) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      if (typeof replyToCustomerMessage === "function") {
        await replyToCustomerMessage(message, replyText);
      }
      if (onSuccess) onSuccess(message.id);
      onClose();
    } catch (err) {
      console.error("Failed to send reply details:", err);
      // 💡 បង្ហាញ Error ពិតប្រាកដពី EmailJS ឬ Firebase ឱ្យអ្នកឃើញផ្ទាល់លើ Screen
      setError(err?.text || err?.message || "Failed to send reply. Please check your EmailJS config.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Mail size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Reply to Customer</h3>
              <p className="text-xs text-gray-500">To: {message.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-200/60 mb-4 text-xs">
          <p className="font-bold text-gray-800 mb-1">Subject: {message.subject}</p>
          <p className="text-gray-600 line-clamp-3 italic">"{message.message}"</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Your Reply Message
            </label>
            <textarea
              required
              rows={5}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your response to the customer..."
              className="w-full p-3.5 rounded-2xl border-2 border-gray-200 text-xs text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
            />
          </div>

          {/* 💡 កន្លែងបង្ហាញ Error ពិតប្រាកដ */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <Send size={14} />
              {sending ? "Sending..." : "Send Reply"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReplyModal;