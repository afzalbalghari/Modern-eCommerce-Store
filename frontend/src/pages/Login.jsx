import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AppContext";

const INPUT = "w-full px-4 py-3.5 border border-[#e2e5ea] rounded-xl text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0f4c81] focus:ring-2 focus:ring-[#0f4c81]/10 transition-all bg-white";

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]   = useState({ email:"", password:"", remember:false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow]   = useState(false);

  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r,1000));
    // Demo: accept any valid-looking credentials
    if (!form.email.includes("@") || form.password.length < 6) {
      setError("Invalid email or password. Try: test@email.com / password123");
      setLoading(false);
      return;
    }
    login({ name: form.email.split("@")[0], email: form.email, role: "user" }, "demo-jwt-token-" + Date.now());
    navigate("/");
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-12 bg-[#f7f8fa]">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white border border-[#e2e5ea] rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-[#0f4c81] px-8 py-6 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
              <div className="w-8 h-8 bg-[#ff6b2b] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span className="font-display text-xl font-bold text-white">ShopNexus</span>
            </Link>
            <h1 className="text-xl font-bold text-white">Sign in to your account</h1>
            <p className="text-white/70 text-sm mt-1">Access your orders, wishlist, and more</p>
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
                <input type="email" required placeholder="Enter your email" value={form.email}
                  onChange={e => set("email",e.target.value)} className={INPUT} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-[#475569] uppercase tracking-wider">Password</label>
                  <a href="#" className="text-xs text-[#0f4c81] hover:underline font-medium">Forgot password?</a>
                </div>
                <div className="relative">
                  <input type={show ? "text" : "password"} required placeholder="Enter your password"
                    value={form.password} onChange={e => set("password",e.target.value)} className={`${INPUT} pr-11`} />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] transition-colors">
                    {show ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" checked={form.remember} onChange={e => set("remember",e.target.checked)}
                  className="w-4 h-4 rounded border-[#e2e5ea] text-[#0f4c81] accent-[#0f4c81]" />
                <label htmlFor="remember" className="text-sm text-[#475569]">Remember me for 30 days</label>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-[#ff6b2b] hover:bg-[#e85a1a] text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 text-sm mt-2">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Signing in...
                  </span>
                ) : "Sign In →"}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#e2e5ea]" />
              <span className="text-xs text-[#94a3b8] font-medium">or continue with</span>
              <div className="flex-1 h-px bg-[#e2e5ea]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[["G", "Google", "#ea4335"],["f", "Facebook", "#1877f2"]].map(([icon,name,color]) => (
                <button key={name} className="flex items-center justify-center gap-2 py-2.5 border border-[#e2e5ea] rounded-xl text-sm font-semibold text-[#475569] hover:border-[#0f4c81]/40 hover:bg-[#f7f8fa] transition-all">
                  <span style={{ color }} className="font-bold">{icon}</span>{name}
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-[#475569] mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#0f4c81] font-bold hover:underline">Create one free →</Link>
            </p>
          </div>
        </div>

        {/* Demo hint */}
        <div className="mt-4 bg-[#eff6ff] border border-[#bfdbfe] rounded-xl px-4 py-3 text-xs text-[#0f4c81] text-center">
          💡 Demo: use any email + 6+ char password to log in
        </div>
      </div>
    </div>
  );
}