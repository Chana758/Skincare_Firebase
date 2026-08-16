import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";

const friendlyError = (code) => {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email or password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    default:
      return "Something went wrong. Please try again.";
  }
};

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Admin/staff always go straight to their own console. Only customers
  // get sent back to whatever page they were trying to reach before login.
  const redirectAfterAuth = async (user) => {
    let role = "customer";
    try {
      const tokenResult = await user.getIdTokenResult();
      role = tokenResult.claims.role;
      if (!role) {
        const snap = await getDoc(doc(db, "users", user.uid));
        role = snap.exists() ? snap.data().role || "customer" : "customer";
      }
    } catch {
      role = "customer";
    }

    if (role === "admin") {
      navigate("/admin", { replace: true });
      return;
    }
    if (role === "staff") {
      navigate("/staff", { replace: true });
      return;
    }
    navigate(from || "/", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      await redirectAfterAuth(user);
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      const user = await loginWithGoogle();
      await redirectAfterAuth(user);
    } catch {
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16 bg-[#FDFBF9]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="text-2xl font-serif tracking-tighter mb-2">LUMIÈRE</div>
          <h1 className="text-xl font-serif text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">Log in to your account to continue</p>
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
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="text-right -mt-1">
            <Link to="/forgot-password" className="text-xs text-rose-400 font-medium hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-rose-400 hover:bg-rose-500 text-white text-sm font-semibold uppercase tracking-wider py-3.5 rounded-full transition disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Log In"}
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
          Don't have an account?{" "}
          <Link to="/register" className="text-rose-400 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;