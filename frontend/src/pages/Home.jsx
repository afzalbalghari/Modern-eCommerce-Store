import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PRODUCTS, CATEGORIES } from "../data/mockData";
import ProductCard from "../components/ProductCard";

const BANNERS = [
  { bg: "from-[#0f4c81] to-[#1a6db5]", tag: "🔥 Limited Time", title: "Mega Electronics\nSale", sub: "Up to 40% off on top brands", btn: "Shop Electronics", cat: "electronics", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" },
  { bg: "from-[#7c3aed] to-[#a855f7]", tag: "✨ New Arrivals", title: "Fashion\nForward", sub: "Trending styles for every season", btn: "Shop Fashion", cat: "fashion", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" },
  { bg: "from-[#0f766e] to-[#14b8a6]", tag: "🏠 Home Deals", title: "Transform\nYour Home", sub: "Premium home & living products", btn: "Shop Home", cat: "home", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
];

const PROMOS = [
  { icon: "⚡", label: "Flash Sale", sub: "Ends in 2h 30m", color: "bg-[#fff7ed] border-[#fed7aa]" },
  { icon: "📦", label: "Free Delivery", sub: "Orders over $50",   color: "bg-[#f0fdf4] border-[#bbf7d0]" },
  { icon: "🔄", label: "Easy Returns", sub: "30-day policy",       color: "bg-[#eff6ff] border-[#bfdbfe]" },
  { icon: "🎁", label: "Gift Cards",   sub: "For any occasion",    color: "bg-[#fdf4ff] border-[#e9d5ff]" },
];

export default function Home() {
  const [banner, setBanner] = useState(0);
  const navigate = useNavigate();
  const featured  = PRODUCTS.filter(p => p.badge === "HOT").slice(0,4);
  const newArr    = PRODUCTS.filter(p => p.badge === "NEW").slice(0,4);
  const popular   = PRODUCTS.sort((a,b) => b.reviews - a.reviews).slice(0,8);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">

      {/* Hero + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main banner */}
        <div className={`lg:col-span-3 rounded-2xl bg-gradient-to-br ${BANNERS[banner].bg} overflow-hidden relative min-h-[300px] flex items-center`}>
          <div className="relative z-10 p-8 md:p-12 flex-1">
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">{BANNERS[banner].tag}</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight whitespace-pre-line mb-3">
              {BANNERS[banner].title}
            </h1>
            <p className="text-white/80 text-base mb-6 max-w-sm">{BANNERS[banner].sub}</p>
            <button onClick={() => navigate(`/products?cat=${BANNERS[banner].cat}`)}
              className="bg-white text-[#0f4c81] font-bold px-6 py-3 rounded-xl hover:bg-[#f7f8fa] transition-colors shadow-lg text-sm">
              {BANNERS[banner].btn} →
            </button>
          </div>
          <div className="absolute right-6 bottom-0 top-0 flex items-end opacity-80 pointer-events-none">
            <img src={BANNERS[banner].img} alt="" className="h-56 w-56 object-cover rounded-2xl opacity-40 md:opacity-60" />
          </div>
          {/* Dots */}
          <div className="absolute bottom-4 left-8 flex gap-2">
            {BANNERS.map((_,i) => (
              <button key={i} onClick={() => setBanner(i)}
                className={`h-1.5 rounded-full transition-all ${i === banner ? "w-6 bg-white" : "w-1.5 bg-white/40"}`} />
            ))}
          </div>
        </div>

        {/* Side promos */}
        <div className="flex flex-row lg:flex-col gap-3">
          {PROMOS.map(p => (
            <div key={p.label} className={`flex-1 flex flex-col items-center justify-center text-center p-4 rounded-xl border ${p.color} cursor-pointer hover:shadow-md transition-shadow`}>
              <span className="text-2xl mb-1">{p.icon}</span>
              <p className="text-sm font-bold text-[#0f172a]">{p.label}</p>
              <p className="text-xs text-[#475569]">{p.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0f172a] font-display">Shop by Category</h2>
          <Link to="/products" className="text-sm text-[#0f4c81] font-semibold hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {CATEGORIES.map((c,i) => (
            <Link key={c.id} to={`/products?cat=${c.id}`}
              className={`flex flex-col items-center gap-2 p-3 bg-white border border-[#e2e5ea] rounded-xl hover:border-[#0f4c81]/40 hover:shadow-md transition-all text-center group animate-fadeInUp stagger-${Math.min(i+1,6)}`}>
              <span className="text-2xl group-hover:scale-110 transition-transform">{c.icon}</span>
              <span className="text-[11px] font-semibold text-[#0f172a] leading-tight">{c.label}</span>
              <span className="text-[9px] text-[#94a3b8]">{c.count} items</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Today's Deals */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#0f172a] font-display">🔥 Today's Hot Deals</h2>
            <span className="bg-[#dc2626] text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse-soft">LIVE</span>
          </div>
          <Link to="/products?deal=1" className="text-sm text-[#0f4c81] font-semibold hover:underline">See all deals →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((p,i) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Banner strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-[#ff6b2b] to-[#f59e0b] rounded-2xl p-7 flex items-center justify-between overflow-hidden relative">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">Special Offer</p>
            <h3 className="font-display text-2xl font-bold text-white mb-3">Get 20% Off<br/>Your First Order</h3>
            <Link to="/register" className="bg-white text-[#ff6b2b] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#fff7ed] transition-colors inline-block">
              Sign Up Now
            </Link>
          </div>
          <span className="text-7xl opacity-30 absolute right-5">🎁</span>
        </div>
        <div className="bg-gradient-to-r from-[#0a3560] to-[#1a6db5] rounded-2xl p-7 flex items-center justify-between overflow-hidden relative">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">Download App</p>
            <h3 className="font-display text-2xl font-bold text-white mb-3">Shop Faster<br/>on Mobile</h3>
            <div className="flex gap-2">
              <button className="bg-white/20 hover:bg-white/30 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors">App Store</button>
              <button className="bg-white/20 hover:bg-white/30 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors">Google Play</button>
            </div>
          </div>
          <span className="text-7xl opacity-30 absolute right-5">📱</span>
        </div>
      </div>

      {/* New Arrivals */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0f172a] font-display">✨ New Arrivals</h2>
          <Link to="/products?badge=new" className="text-sm text-[#0f4c81] font-semibold hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {newArr.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

     
    </div>
  );
}