// src/components/common/Newsletter.jsx
import { useState, useCallback } from "react";
import { Mail, Sparkles } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!email.includes("@")) return;
      setStatus("loading");
      try {
        await addDoc(collection(db, "newsletter_subscribers"), {
          email,
          subscribedAt: serverTimestamp(),
        });
        setStatus("success");
        setEmail("");
      } catch {
        setStatus("error");
      }
    },
    [email]
  );

  return (
    <section className="relative px-6 md:px-20 py-24 bg-gradient-to-br from-gray-900 via-gray-900 to-rose-950 overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-400/10 rounded-full blur-3xl" />

      <div className="relative max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-400/10 border border-rose-400/30 mb-6">
          <Sparkles className="text-rose-300" size={22} />
        </div>

        <p className="text-xs uppercase tracking-[0.25em] text-rose-300 font-semibold mb-4">
          Newsletter
        </p>
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
          Join Our Glow Community
        </h2>
        <p className="text-gray-400 text-sm mb-10 max-w-md mx-auto leading-relaxed">
          ចុះឈ្មោះទទួល tips ថែរក្សាស្បែក និង promotion ថ្មីៗពីមុនគេ
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className="relative flex-1">
            <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-12 pr-5 py-3.5 rounded-full bg-white/5 backdrop-blur-sm text-white placeholder-gray-500 text-sm outline-none focus:ring-2 focus:ring-rose-400 border border-white/10 transition"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-rose-400 hover:bg-rose-500 text-white text-sm font-semibold uppercase tracking-wider px-8 py-3.5 rounded-full transition disabled:opacity-60 shadow-lg shadow-rose-500/20"
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>

        {status === "success" && (
          <p className="text-emerald-400 text-xs mt-5">អរគុណសម្រាប់ការចុះឈ្មោះ! 🎉</p>
        )}
        {status === "error" && (
          <p className="text-rose-400 text-xs mt-5">មានបញ្ហា សូមព្យាយាមម្តងទៀត។</p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;