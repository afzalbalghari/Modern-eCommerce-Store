import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart, useAuth } from "../context/AppContext";
import SearchBar from "./SearchBar";
import { CATEGORIES } from "../data/mockData";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); setUserMenu(false); };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top bar */}
      <div className="bg-[#0f4c81] text-white">
        <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-white/80">
            <span>🚚 Free delivery on orders over $50</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-1.5 hover:text-white/80 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-[#ff6b2b] flex items-center justify-center text-xs font-bold">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span>{user.name?.split(" ")[0]}</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-8 w-44 bg-white text-[#0f172a] rounded-xl shadow-2xl border border-[#e2e5ea] overflow-hidden animate-slideDown z-50">
                    <Link to="/dashboard" onClick={() => setUserMenu(false)} className="block px-4 py-3 text-sm hover:bg-[#f7f8fa] border-b border-[#f1f5f9] font-medium">📊 Dashboard</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm hover:bg-[#f7f8fa] text-[#dc2626]">Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="hover:text-white/80 transition-colors">Sign In</Link>
                <Link to="/register" className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md transition-colors font-medium">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-white border-b border-[#e2e5ea]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="w-9 h-9 bg-[#0f4c81] rounded-xl flex items-center justify-center group-hover:bg-[#0a3560] transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <span className="font-display text-xl font-bold text-[#0f4c81] leading-none block">ShopNexus</span>
                <span className="text-[9px] text-[#94a3b8] tracking-widest uppercase">Premium Store</span>
              </div>
            </Link>

            {/* Search */}
            <SearchBar className="flex-1 hidden md:block" />

            {/* Right actions */}
            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
              {/* Wishlist */}
              <button className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-[#475569] hover:text-[#0f4c81] hover:bg-[#f7f8fa] rounded-lg transition-all text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <span className="hidden lg:block font-medium">Wishlist</span>
              </button>

              {/* Cart */}
              <Link to="/cart" className="relative flex items-center gap-1.5 px-3 py-2 text-[#475569] hover:text-[#0f4c81] hover:bg-[#f7f8fa] rounded-lg transition-all">
                <div className="relative">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#ff6b2b] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </div>
                <span className="hidden lg:block text-sm font-medium">Cart</span>
              </Link>

              {/* Mobile menu */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-[#475569] hover:text-[#0f4c81]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden pb-3">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Category nav */}
      <div className="bg-[#0a3560] text-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-0 overflow-x-auto no-scrollbar">
            <NavLink to="/products" end
              className={({ isActive }) => `flex-shrink-0 px-4 py-2.5 text-xs font-semibold hover:bg-white/10 transition-colors border-b-2 ${isActive ? "border-[#ff6b2b] text-white" : "border-transparent text-white/80"}`}>
              All Products
            </NavLink>
            {CATEGORIES.slice(0,7).map(c => (
              <NavLink key={c.id} to={`/products?cat=${c.id}`}
                className={({ isActive }) => `flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold hover:bg-white/10 transition-colors border-b-2 whitespace-nowrap ${isActive ? "border-[#ff6b2b] text-white" : "border-transparent text-white/80"}`}>
                <span>{c.icon}</span>{c.label}
              </NavLink>
            ))}
            <NavLink to="/products?deal=1"
              className="flex-shrink-0 px-4 py-2.5 text-xs font-bold text-[#ff6b2b] hover:bg-white/10 transition-colors border-b-2 border-transparent whitespace-nowrap">
              🔥 Today's Deals
            </NavLink>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-[#e2e5ea] animate-slideDown">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {[["Home","/"],["Products","/products"],["Cart","/cart"]].map(([l,t]) => (
              <NavLink key={t} to={t} end={t==="/"} onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `block px-3 py-2.5 rounded-lg text-sm font-medium ${isActive ? "bg-[#e8f0fe] text-[#0f4c81]" : "text-[#475569]"}`}>
                {l}
              </NavLink>
            ))}
            <div className="border-t border-[#f1f5f9] pt-2">
              <p className="text-xs text-[#94a3b8] px-3 py-1 font-semibold uppercase tracking-wider">Categories</p>
              {CATEGORIES.slice(0,5).map(c => (
                <NavLink key={c.id} to={`/products?cat=${c.id}`} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#475569] hover:bg-[#f7f8fa]">
                  <span>{c.icon}</span>{c.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}