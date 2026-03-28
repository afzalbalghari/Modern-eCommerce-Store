import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AppContext";

const INPUT = "w-full px-4 py-3.5 border border-[#e2e5ea] rounded-xl text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0f4c81] focus:ring-2 focus:ring-[#0f4c81]/10 transition-all bg-white";

const BENEFITS = [
  "🚀 Free shipping on first order",
  "💰 Exclusive member discounts",
  "📦 Easy order tracking",
  "🔄 Hassle-free returns",
];

export default function Register() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"", agree:false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showP, setShowP] = useState(false);

  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const strength = (pw) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const pwStrength = strength(form.password);
  const strengthLabel = ["","Weak","Fair","Good","Strong"];
  const strengthColor = ["","bg-[#dc2626]","bg-amber-400","bg-[#16a34a]","bg-[#0f4c81]"];

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError("Passwords don't match.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (!form.agree) return setError("Please accept the Terms of Service.");
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r,1200));
    login({ name: form.name, email: form.email, role:"user" }, "demo-jwt-" + Date.now());
    navigate("/");
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-start justify-center px-4 py-8 bg-[#f7f8fa]">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Benefits panel */}
        <div className="hidden md:flex flex-col justify-center bg-[#0f4c81] rounded-2xl p-8 text-white min-h-[500px]">
          <Link to="/" className="flex items-center gap-2 mb-8 group">
            <div className="w-9 h-9 bg-[#ff6b2b] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span className="font-display text-xl font-bold">ShopNexus</span>
          </Link>
          <h2 className="font-display text-3xl font-bold mb-3">Join millions of happy shoppers</h2>
          <p className="text-white/70 mb-8">Create your free account today and unlock exclusive benefits.</p>
          <ul className="space-y-4">
            {BENEFITS.map(b => (
              <li key={b} className="flex items-center gap-3 text-sm text-white/90">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">✓</div>
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-10 bg-white/10 rounded-xl p-4 text-sm text-white/80">
            <p>"The best online shopping experience I've had. Fast delivery and amazing prices!" — <strong className="text-white">Ali Hassan, Karachi</strong></p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-[#e2e5ea] rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden animate-fadeIn">
          <div className="px-7 py-6 bg-[#0a3560] md:hidden text-center">
            <h1 className="text-xl font-bold text-white">Create Account</h1>
          </div>
          <div className="px-7 py-6">
            <h2 className="font-display text-xl font-bold text-[#0f172a] mb-1 hidden md:block">Create your account</h2>
            <p className="text-sm text-[#94a3b8] mb-5 hidden md:block">It's free and takes only 30 seconds</p>

            {error && (
              <div className="mb-4 px-4 py-3 bg-[#fee2e2] border border-[#fca5a5] rounded-xl text-sm text-[#dc2626] font-medium">⚠️ {error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block mb-1.5">Full Name</label>
                <input required placeholder="John Doe" value={form.name}
                  onChange={e => set("name",e.target.value)} className={INPUT} />
              </div>
              <div>
                <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block mb-1.5">Email Address</label>
                <input type="email" required placeholder="john@email.com" value={form.email}
                  onChange={e => set("email",e.target.value)} className={INPUT} />
              </div>
              <div>
                <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block mb-1.5">Password</label>
                <div className="relative">
                  <input type={showP?"text":"password"} required placeholder="Create a strong password"
                    value={form.password} onChange={e => set("password",e.target.value)} className={`${INPUT} pr-11`} />
                  <button type="button" onClick={() => setShowP(!showP)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] text-sm">
                    {showP?"🙈":"👁️"}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i<=pwStrength ? strengthColor[pwStrength] : "bg-[#e2e5ea]"}`} />
                      ))}
                    </div>
                    <p className="text-xs text-[#94a3b8]">Password strength: <span className={`font-semibold ${pwStrength<=1?"text-[#dc2626]":pwStrength===2?"text-amber-500":pwStrength===3?"text-[#16a34a]":"text-[#0f4c81]"}`}>{strengthLabel[pwStrength]}</span></p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-[#475569] uppercase tracking-wider block mb-1.5">Confirm Password</label>
                <input type="password" required placeholder="Repeat your password"
                  value={form.confirm} onChange={e => set("confirm",e.target.value)}
                  className={`${INPUT} ${form.confirm && form.password !== form.confirm ? "border-[#dc2626] focus:border-[#dc2626]" : ""}`} />
                {form.confirm && form.password !== form.confirm && (
                  <p className="text-xs text-[#dc2626] mt-1">Passwords don't match</p>
                )}
              </div>
              <div className="flex items-start gap-2.5">
                <input type="checkbox" id="agree" checked={form.agree} onChange={e => set("agree",e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-[#e2e5ea] accent-[#0f4c81]" />
                <label htmlFor="agree" className="text-sm text-[#475569] leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-[#0f4c81] font-semibold hover:underline">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-[#0f4c81] font-semibold hover:underline">Privacy Policy</a>
                </label>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-[#ff6b2b] hover:bg-[#e85a1a] text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 text-sm">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Creating account...
                  </span>
                ) : "Create Account →"}
              </button>
            </form>

            <p className="text-center text-sm text-[#475569] mt-5">
              Already have an account?{" "}
              <Link to="/login" className="text-[#0f4c81] font-bold hover:underline">Sign in →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}