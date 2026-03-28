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

     
    </div>
  );
}