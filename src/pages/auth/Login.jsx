// src/pages/auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError("អ៊ីមែល ឬ password មិនត្រឹមត្រូវ");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await loginWithGoogle();
      navigate(redirectTo, { replace: true });
    } catch {
      setError("Google login មិនជោគជ័យ សូមព្យាយាមម្តងទៀត");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16 bg-[#FDFBF9]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="text-2xl font-serif tracking-tighter mb-2">LUMIÈRE</div>
          <h1 className="text-xl font-serif text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">ចូលគណនីរបស់អ្នកដើម្បីបន្ត</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-500 text-xs rounded-lg px-4 py-3 mb-5">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              type={showPass ? "text" : "password"}
              name="password"
              required
              minLength={6}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-11 pr-11 py-3 rounded-full border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-rose-300"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-400 hover:bg-rose-500 text-white text-sm font-semibold uppercase tracking-wider py-3.5 rounded-full transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full border border-gray-200 text-sm font-medium py-3.5 rounded-full hover:bg-gray-50 transition"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-8">
          មិនទាន់មានគណនី?{" "}
          <Link to="/register" className="text-rose-400 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;