import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productAPI } from "../services/api";
import ProductCard from "../components/ProductCard";
import { SkeletonCard } from "../components/Loader";

const CATEGORIES = [
  { id: "electronics", label: "Electronics", icon: "💻" },
  { id: "fashion",     label: "Fashion",     icon: "👗" },
  { id: "home",        label: "Home & Living",icon: "🏠" },
  { id: "sports",      label: "Sports",      icon: "⚽" },
  { id: "books",       label: "Books",       icon: "📚" },
  { id: "beauty",      label: "Beauty",      icon: "💄" },
  { id: "toys",        label: "Toys",        icon: "🧸" },
  { id: "kitchen",     label: "Kitchen",     icon: "🍳" },
];

const BANNERS = [
  { bg: "from-[#0f4c81] to-[#1a6db5]", tag: "🔥 Limited Time", title: "Mega Electronics\nSale", sub: "Up to 40% off on top brands", btn: "Shop Electronics", cat: "electronics" },
  { bg: "from-[#7c3aed] to-[#a855f7]", tag: "✨ New Arrivals",  title: "Fashion\nForward",       sub: "Trending styles for every season", btn: "Shop Fashion", cat: "fashion" },
  { bg: "from-[#0f766e] to-[#14b8a6]", tag: "🏠 Home Deals",   title: "Transform\nYour Home",    sub: "Premium home & living products",  btn: "Shop Home",    cat: "home" },
];

const PROMOS = [
  { icon: "⚡", label: "Flash Sale",    sub: "Ends in 2h 30m", color: "bg-[#fff7ed] border-[#fed7aa]" },
  { icon: "📦", label: "Free Delivery", sub: "Orders over $50", color: "bg-[#f0fdf4] border-[#bbf7d0]" },
  { icon: "🔄", label: "Easy Returns",  sub: "30-day policy",   color: "bg-[#eff6ff] border-[#bfdbfe]" },
  { icon: "🎁", label: "Gift Cards",    sub: "Any occasion",    color: "bg-[#fdf4ff] border-[#e9d5ff]" },
];

export default function Home() {
  const [banner, setBanner]   = useState(0);
  const [featured, setFeatured] = useState([]);
  const [newArr, setNewArr]   = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [featRes, newRes, popRes] = await Promise.all([
          productAPI.getAll({ badge: "HOT",  limit: 4 }),
          productAPI.getAll({ badge: "NEW",  limit: 4 }),
          productAPI.getAll({ sort: "-sold", limit: 8 }),
        ]);
        setFeatured(featRes.data.data || []);
        setNewArr(newRes.data.data   || []);
        setPopular(popRes.data.data  || []);
      } catch (err) {
        console.error("Failed to load homepage products:", err.message);
      } finally {
        setLoading(false);
      }
    };
    load();

    // Auto-rotate banner
    const t = setInterval(() => setBanner(b => (b + 1) % BANNERS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const Section = ({ title, products, link, linkLabel = "View all →" }) => (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#0f172a] font-display">{title}</h2>
        <Link to={link} className="text-sm text-[#0f4c81] font-semibold hover:underline">{linkLabel}</Link>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_,i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-[#94a3b8] text-sm bg-white rounded-xl border border-[#e2e5ea]">
          No products yet — run <code className="bg-[#f1f5f9] px-1 rounded">npm run seed</code> to populate the database.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </section>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">

      {/* Hero + Promos */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className={`lg:col-span-3 rounded-2xl bg-gradient-to-br ${BANNERS[banner].bg} overflow-hidden relative min-h-[280px] md:min-h-[320px] flex items-center transition-all duration-700`}>
          <div className="relative z-10 p-8 md:p-12">
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              {BANNERS[banner].tag}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight whitespace-pre-line mb-3">
              {BANNERS[banner].title}
            </h1>
            <p className="text-white/80 text-base mb-6 max-w-sm">{BANNERS[banner].sub}</p>
            <button
              onClick={() => navigate(`/products?category=${BANNERS[banner].cat}`)}
              className="bg-white text-[#0f4c81] font-bold px-6 py-3 rounded-xl hover:bg-[#f7f8fa] transition-colors shadow-lg text-sm"
            >
              {BANNERS[banner].btn} →
            </button>
          </div>
          <div className="absolute bottom-4 left-8 flex gap-2">
            {BANNERS.map((_,i) => (
              <button key={i} onClick={() => setBanner(i)}
                className={`h-1.5 rounded-full transition-all ${i === banner ? "w-6 bg-white" : "w-1.5 bg-white/40"}`} />
            ))}
          </div>
        </div>
        <div className="flex flex-row lg:flex-col gap-3">
          {PROMOS.map(p => (
            <div key={p.label}
              className={`flex-1 flex flex-col items-center justify-center text-center p-3 rounded-xl border ${p.color} cursor-pointer hover:shadow-md transition-shadow`}>
              <span className="text-2xl mb-1">{p.icon}</span>
              <p className="text-sm font-bold text-[#0f172a]">{p.label}</p>
              <p className="text-xs text-[#475569]">{p.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0f172a] font-display">Shop by Category</h2>
          <Link to="/products" className="text-sm text-[#0f4c81] font-semibold hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {CATEGORIES.map((c, i) => (
            <Link key={c.id} to={`/products?category=${c.id}`}
              className={`flex flex-col items-center gap-2 p-3 bg-white border border-[#e2e5ea] rounded-xl hover:border-[#0f4c81]/40 hover:shadow-md transition-all text-center group animate-fadeInUp stagger-${Math.min(i+1,6)}`}>
              <span className="text-2xl group-hover:scale-110 transition-transform">{c.icon}</span>
              <span className="text-[11px] font-semibold text-[#0f172a] leading-tight">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Hot Deals */}
      <Section
        title="🔥 Today's Hot Deals"
        products={featured}
        link="/products?badge=HOT"
        linkLabel="See all deals →"
      />

      {/* Promo banners */}
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
            <p className="text-white/80 text-sm font-medium mb-1">Fast Shipping</p>
            <h3 className="font-display text-2xl font-bold text-white mb-3">Free Delivery<br/>on Orders $50+</h3>
            <Link to="/products" className="bg-white text-[#0f4c81] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#f0f4ff] transition-colors inline-block">
              Shop Now
            </Link>
          </div>
          <span className="text-7xl opacity-30 absolute right-5">🚚</span>
        </div>
      </div>

      {/* New Arrivals */}
      <Section title="✨ New Arrivals" products={newArr} link="/products?badge=NEW" />

      {/* Most Popular */}
      <Section title="⭐ Most Popular" products={popular} link="/products?sort=-sold" />

      {/* Newsletter */}
      <section className="bg-[#f0f4ff] border border-[#bfdbfe] rounded-2xl p-8 md:p-12 text-center">
        <p className="text-xs font-bold text-[#0f4c81] uppercase tracking-widest mb-2">Newsletter</p>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0f172a] mb-2">Get Exclusive Deals in Your Inbox</h2>
        <p className="text-[#475569] text-sm mb-6">Join 50,000+ shoppers and never miss a sale again.</p>
        <div className="flex gap-0 max-w-md mx-auto">
          <input type="email" placeholder="Enter your email address"
            className="flex-1 px-4 py-3 border border-[#bfdbfe] border-r-0 rounded-l-xl text-sm focus:outline-none focus:border-[#0f4c81] bg-white" />
          <button className="bg-[#0f4c81] hover:bg-[#0a3560] text-white px-6 py-3 rounded-r-xl text-sm font-bold transition-colors">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
}