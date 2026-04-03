import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuth, useToast } from "../context/AppContext";

const INPUT = "w-full px-4 py-3.5 border border-[#e2e5ea] rounded-xl text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0f4c81] focus:ring-2 focus:ring-[#0f4c81]/10 transition-all bg-white";

export default function Login() {
  const { login }    = useAuth();
  const { addToast } = useToast();
  const navigate     = useNavigate();
  const location     = useLocation();
  const from         = location.state?.from || "/";

  const [form, setForm]   = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authAPI.login({ email: form.email, password: form.password });
      const { token, user } = res.data;
      login(user, token);
      addToast(`Welcome back, ${user.name}! 👋`, "success");
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-12 bg-[#f7f8fa]">
      <div className="w-full max-w-md">
        <div className="bg-white border border-[#e2e5ea] rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-[#0f4c81] px-8 py-6 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#ff6b2b] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="font-display text-xl font-bold text-white">ShopNexus</span>
            </Link>
            <h1 className="text-xl font-bold text-white">Sign in to your account</h1>
            <p className="text-white/70 text-sm mt-1">Welcome back — let's get shopping</p>
          </div>

          <div className="px-8 py-6">
            {error && (
              <div className="mb-4 px-4 py-3 bg-[#fee2e2] border border-[#fca5a5] rounded-xl text-sm text-[#dc2626] font-medium">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block mb-1.5">Email Address</label>
                <input type="email" required placeholder="admin@shopnexus.com"
                  value={form.email} onChange={e => set("email", e.target.value)} className={INPUT} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-[#475569] uppercase tracking-wider">Password</label>
                  <button type="button" className="text-xs text-[#0f4c81] hover:underline font-medium">Forgot?</button>
                </div>
                <div className="relative">
                  <input type={showPw ? "text" : "password"} required placeholder="••••••••"
                    value={form.password} onChange={e => set("password", e.target.value)}
                    className={`${INPUT} pr-11`} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] text-sm">
                    {showPw ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 bg-[#ff6b2b] hover:bg-[#e85a1a] text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 text-sm mt-2">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in...
                  </span>
                ) : "Sign In →"}
              </button>
            </form>

            {/* Demo hint */}
            <div className="mt-4 bg-[#eff6ff] border border-[#bfdbfe] rounded-xl px-4 py-3 text-xs text-[#0f4c81] text-center">
              💡 Demo Admin: <strong>admin@shopnexus.com</strong> / <strong>admin123</strong>
            </div>

            <p className="text-center text-sm text-[#475569] mt-5">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#0f4c81] font-bold hover:underline">Create one free →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}