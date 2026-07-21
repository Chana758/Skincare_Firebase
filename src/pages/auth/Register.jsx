
import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | success

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Handle form submission (Static)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Simple client-side validation
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Set status to success for static demonstration
    setStatus("success");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16 bg-[#FDFBF9]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="text-2xl font-serif tracking-tighter mb-2">LUMIÈRE</div>
          <h1 className="text-xl font-serif text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">Join our glow community</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-500 text-xs rounded-lg px-4 py-3 mb-5">{error}</div>
        )}
        
        {status === "success" && (
          <div className="bg-emerald-50 text-emerald-600 text-xs rounded-lg px-4 py-3 mb-5 text-center">
            Account created successfully! (Static Mode)
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              required
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              required
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="confirm"
              required
              placeholder="Confirm password"
              value={form.confirm}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-rose-400 hover:bg-rose-500 text-white text-sm font-semibold uppercase tracking-wider py-3.5 rounded-full transition"
          >
            Create Account
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          onClick={() => alert("Google registration clicked!")}
          className="w-full border border-gray-200 text-sm font-medium py-3.5 rounded-full hover:bg-gray-50 transition"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-rose-400 font-semibold hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;