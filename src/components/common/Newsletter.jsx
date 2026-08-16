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
    <section className="relative px-6 md:px-20 pt-24 pb-16 bg-gradient-to-b from-[#18121A] via-[#151218] to-[#151218] overflow-hidden">
      {/* Decorative blurred background lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-rose-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-500/20 border border-rose-400/40 mb-6 shadow-inner">
          <Sparkles className="text-rose-300" size={22} />
        </div>

        <p className="text-xs uppercase tracking-[0.25em] text-rose-300 font-bold mb-3">
          Newsletter
        </p>
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
          Join Our Glow Community
        </h2>
        <p className="text-gray-300 text-sm mb-10 max-w-md mx-auto leading-relaxed">
          Subscribe to get skincare tips, special offers, and latest updates before anyone else.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <div className="relative flex-1">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-11 pr-5 py-3.5 rounded-full bg-white/10 backdrop-blur-md text-white placeholder-gray-400 text-sm outline-none focus:ring-2 focus:ring-rose-400 border border-white/20 transition shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-rose-400 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-full transition disabled:opacity-60 shadow-lg shadow-rose-500/30 cursor-pointer whitespace-nowrap"
          >
            {status === "loading" ? "..." : "Subscribe"}
          </button>
        </form>

        {status === "success" && (
          <p className="text-emerald-400 text-xs font-medium mt-4">Thank you for subscribing! 🎉</p>
        )}
        {status === "error" && (
          <p className="text-rose-400 text-xs font-medium mt-4">Something went wrong. Please try again.</p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;