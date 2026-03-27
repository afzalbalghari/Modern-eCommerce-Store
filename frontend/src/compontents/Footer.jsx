import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/mockData";

const LINKS = {
  "Customer Service": [["Help Center","#"],["Track Order","#"],["Returns & Refunds","#"],["Shipping Info","#"],["Contact Us","#"]],
  "About ShopNexus":  [["About Us","#"],["Careers","#"],["Press","#"],["Blog","#"],["Affiliates","#"]],
  "Legal":            [["Privacy Policy","#"],["Terms of Service","#"],["Cookie Policy","#"],["Accessibility","#"]],
};

export default function Footer() {
  return (
    <footer className="bg-[#0a3560] text-white mt-16">
      {/* Trust bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            ["🚚", "Free Shipping", "On orders over $50"],
            ["🔄", "Easy Returns", "30-day return policy"],
            ["🔒", "Secure Payment", "256-bit SSL encryption"],
            ["🎧", "24/7 Support", "Chat, email & phone"],
          ].map(([icon, title, sub]) => (
            <div key={title} className="flex items-center gap-3">
              <span className="text-2xl flex-shrink-0">{icon}</span>
              <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-white/60 text-xs">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 bg-[#ff6b2b] rounded-xl flex items-center justify-center group-hover:bg-[#e85a1a] transition-colors">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-display text-2xl font-bold">ShopNexus</span>
          </Link>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-5">
            Your trusted online marketplace. Millions of products, unbeatable prices, and fast delivery worldwide.
          </p>
          <div className="flex gap-2">
            {["App Store", "Google Play"].map(s => (
              <button key={s} className="px-3 py-2 border border-white/20 rounded-lg text-xs text-white/70 hover:border-white/50 hover:text-white transition-all">{s}</button>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            {["𝕏","in","f","▶"].map(s => (
              <button key={s} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white/70 hover:text-white transition-all flex items-center justify-center">
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(LINKS).map(([section, items]) => (
          <div key={section}>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">{section}</h4>
            <ul className="space-y-2.5">
              {items.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="text-sm text-white/70 hover:text-white transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} ShopNexus Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {["Visa","MC","Amex","PayPal","Apple Pay"].map(p => (
              <span key={p} className="border border-white/20 px-2 py-0.5 rounded text-[10px] font-medium">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}