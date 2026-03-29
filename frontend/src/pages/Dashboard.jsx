import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useCart } from "../context/AppContext";
import { PRODUCTS } from "../data/mockData";

const MOCK_ORDERS = [
  { id:"ORD-28471", date:"Mar 18, 2025", status:"Delivered",   total:299.99, items:1, product: PRODUCTS[0] },
  { id:"ORD-28106", date:"Mar 10, 2025", status:"Shipped",     total:89.99,  items:2, product: PRODUCTS[4] },
  { id:"ORD-27834", date:"Feb 28, 2025", status:"Processing",  total:449.98, items:3, product: PRODUCTS[6] },
  { id:"ORD-27201", date:"Feb 15, 2025", status:"Delivered",   total:129.99, items:1, product: PRODUCTS[3] },
];

const STATUS_COLORS = {
  Delivered:  "bg-[#dcfce7] text-[#16a34a]",
  Shipped:    "bg-[#dbeafe] text-[#1d4ed8]",
  Processing: "bg-[#fff7ed] text-[#ea580c]",
  Cancelled:  "bg-[#fee2e2] text-[#dc2626]",
};

const TABS = ["Overview","Orders","Wishlist","Profile","Settings"];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { cart, totalItems } = useCart();
  const navigate = useNavigate();
  const [tab, setTab] = useState("Overview");

  const handleLogout = () => { logout(); navigate("/login"); };

  if (!user) return (
    <div className="text-center py-20">
      <p className="text-[#475569] mb-4">Please log in to view your dashboard.</p>
      <Link to="/login" className="text-[#0f4c81] font-bold hover:underline">Sign In →</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f4c81] to-[#1a6db5] rounded-2xl p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#ff6b2b] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-white">Welcome back, {user.name?.split(" ")[0]}! 👋</h1>
            <p className="text-white/70 text-sm">{user.email} • Member since 2025</p>
          </div>
        </div>
        <button onClick={handleLogout} className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-sm font-semibold rounded-xl transition-colors">
          Sign Out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          ["📦", "Total Orders", MOCK_ORDERS.length, "View all →", "text-[#0f4c81]"],
          ["🚚", "Active Orders", "1", "Track →", "text-amber-500"],
          ["❤️", "Wishlist", "8", "View →", "text-[#dc2626]"],
          ["🛒", "In Cart", totalItems, "Go to cart →", "text-[#16a34a]"],
        ].map(([icon, label, val, link, color]) => (
          <div key={label} className="bg-white border border-[#e2e5ea] rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{icon}</span>
              <span className={`text-xs font-semibold ${color}`}>{link}</span>
            </div>
            <p className="text-2xl font-bold text-[#0f172a]">{val}</p>
            <p className="text-xs text-[#94a3b8] font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-[#e2e5ea] rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab===t ? "bg-[#0f4c81] text-white shadow-sm" : "text-[#475569] hover:bg-[#f7f8fa]"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {tab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-bold text-[#0f172a] text-lg">Recent Orders</h2>
            {MOCK_ORDERS.slice(0,3).map(o => (
              <div key={o.id} className="bg-white border border-[#e2e5ea] rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                <img src={o.product.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover bg-[#f7f8fa] border border-[#f1f5f9] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-sm text-[#0f172a]">{o.id}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                  </div>
                  <p className="text-xs text-[#94a3b8]">{o.date} • {o.items} item{o.items!==1?"s":""}</p>
                  <p className="text-sm font-bold text-[#0f4c81] mt-0.5">${o.total.toFixed(2)}</p>
                </div>
                <button className="text-xs text-[#0f4c81] font-semibold hover:underline flex-shrink-0">Details</button>
              </div>
            ))}
            <button onClick={() => setTab("Orders")} className="text-sm text-[#0f4c81] font-semibold hover:underline">View all orders →</button>
          </div>
          <div className="space-y-4">
            <h2 className="font-bold text-[#0f172a] text-lg">Quick Actions</h2>
            {[
              ["🛍️","Browse Products","Discover new arrivals","/products"],
              ["🛒","View Cart",`${totalItems} item${totalItems!==1?"s":""} waiting`,"/cart"],
              ["📦","Track Order","Check delivery status","#"],
              ["🔄","Return Item","Easy return process","#"],
            ].map(([ic,t,s,link]) => (
              <Link key={t} to={link} className="flex items-center gap-3 bg-white border border-[#e2e5ea] rounded-xl p-3.5 hover:border-[#0f4c81]/40 hover:shadow-md transition-all group">
                <span className="text-xl w-9 h-9 bg-[#f0f4ff] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#0f4c81] group-hover:text-white transition-all">{ic}</span>
                <div>
                  <p className="text-sm font-semibold text-[#0f172a]">{t}</p>
                  <p className="text-xs text-[#94a3b8]">{s}</p>
                </div>
                <svg className="w-4 h-4 text-[#94a3b8] ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Orders */}
      {tab === "Orders" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#0f172a] text-lg">All Orders ({MOCK_ORDERS.length})</h2>
            <select className="text-sm border border-[#e2e5ea] rounded-xl px-3 py-2 text-[#475569] focus:outline-none focus:border-[#0f4c81] bg-white">
              <option>All Orders</option><option>Delivered</option><option>Shipped</option><option>Processing</option>
            </select>
          </div>
          <div className="space-y-3">
            {MOCK_ORDERS.map(o => (
              <div key={o.id} className="bg-white border border-[#e2e5ea] rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <img src={o.product.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover bg-[#f7f8fa] flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#0f172a]">{o.id}</span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                      </div>
                      <p className="text-sm text-[#94a3b8]">Placed on {o.date}</p>
                      <p className="text-sm text-[#475569] mt-0.5">{o.items} item{o.items!==1?"s":""}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#0f172a]">${o.total.toFixed(2)}</p>
                    <div className="flex gap-2 mt-2">
                      <button className="px-3 py-1.5 text-xs font-semibold bg-[#f0f4ff] text-[#0f4c81] rounded-lg hover:bg-[#0f4c81] hover:text-white transition-colors">Track Order</button>
                      {o.status === "Delivered" && <button className="px-3 py-1.5 text-xs font-semibold border border-[#e2e5ea] text-[#475569] rounded-lg hover:border-[#0f4c81] transition-colors">Reorder</button>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Profile */}
      {tab === "Profile" && (
        <div className="max-w-lg">
          <h2 className="font-bold text-[#0f172a] text-lg mb-4">Profile Information</h2>
          <div className="bg-white border border-[#e2e5ea] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-[#f1f5f9]">
              <div className="w-16 h-16 bg-[#0f4c81] rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-[#0f172a]">{user.name}</p>
                <p className="text-sm text-[#94a3b8]">{user.email}</p>
                <span className="text-xs bg-[#dcfce7] text-[#16a34a] px-2 py-0.5 rounded-full font-semibold">Verified</span>
              </div>
            </div>
            {[["Full Name",user.name],["Email",user.email],["Phone","Not added"],["Location","Pakistan"]].map(([l,v]) => (
              <div key={l} className="flex justify-between items-center py-2 border-b border-[#f9fafb]">
                <span className="text-sm text-[#94a3b8] font-medium">{l}</span>
                <span className="text-sm text-[#0f172a] font-semibold">{v}</span>
              </div>
            ))}
            <button className="w-full py-3 bg-[#0f4c81] hover:bg-[#0a3560] text-white font-bold rounded-xl transition-colors text-sm">
              Edit Profile
            </button>
          </div>
        </div>
      )}

      {/* Tab: Wishlist */}
      {tab === "Wishlist" && (
        <div>
          <h2 className="font-bold text-[#0f172a] text-lg mb-4">My Wishlist (8 items)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PRODUCTS.slice(0,8).map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="bg-white border border-[#e2e5ea] rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
                <div className="aspect-square overflow-hidden bg-[#f7f8fa]">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-[#0f172a] line-clamp-2 mb-1">{p.name}</p>
                  <p className="text-sm font-bold text-[#0f4c81]">${p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Settings */}
      {tab === "Settings" && (
        <div className="max-w-lg space-y-4">
          <h2 className="font-bold text-[#0f172a] text-lg">Account Settings</h2>
          {[
            ["🔔 Notifications","Manage email and push notifications"],
            ["🔒 Password","Change your password"],
            ["📍 Addresses","Manage saved addresses"],
            ["💳 Payment Methods","Manage saved cards"],
            ["🗑️ Delete Account","Permanently delete your account"],
          ].map(([title, sub]) => (
            <div key={title} className={`flex items-center justify-between bg-white border rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow ${title.includes("Delete") ? "border-[#fca5a5]" : "border-[#e2e5ea] hover:border-[#0f4c81]/30"}`}>
              <div>
                <p className={`font-semibold text-sm ${title.includes("Delete") ? "text-[#dc2626]" : "text-[#0f172a]"}`}>{title}</p>
                <p className="text-xs text-[#94a3b8]">{sub}</p>
              </div>
              <svg className="w-4 h-4 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}