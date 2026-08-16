
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await resetPassword(email);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(
        err.code === "auth/user-not-found"
          ? "No account found with this email."
          : "Could not send reset email. Please try again."
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16 bg-[#FDFBF9]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="text-2xl font-serif tracking-tighter mb-2">LUMIÈRE</div>
          <h1 className="text-xl font-serif text-gray-900">Reset Your Password</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {status === "sent" ? (
          <div className="text-center">
            <div className="bg-emerald-50 text-emerald-600 text-sm rounded-lg px-4 py-4 mb-6">
              Check <span className="font-semibold">{email}</span> for a link to reset your password.
            </div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-rose-400 font-semibold text-sm hover:underline"
            >
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-rose-50 text-rose-500 text-xs rounded-lg px-4 py-3 mb-5">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-rose-400 hover:bg-rose-500 text-white text-sm font-semibold uppercase tracking-wider py-3.5 rounded-full transition disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-8">
              Remembered it?{" "}
              <Link to="/login" className="text-rose-400 font-semibold hover:underline">
                Log In
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;