import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PRODUCTS } from "../data/mockData";

export default function SearchBar({ className = "" }) {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState([]);
  const [focused, setFocused]   = useState(false);
  const navigate                = useNavigate();
  const ref                     = useRef();

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    const r = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    setResults(r);
  }, [query]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setFocused(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const go = (id) => { setQuery(""); setResults([]); setFocused(false); navigate(`/product/${id}`); };
  const search = (e) => { e.preventDefault(); if (query.trim()) { navigate(`/products?q=${encodeURIComponent(query)}`); setFocused(false); }};

  return (
    <div ref={ref} className={`relative ${className}`}>
      <form onSubmit={search} className="flex">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search products, brands..."
          className="w-full px-4 py-2.5 bg-white border border-[#e2e5ea] border-r-0 rounded-l-lg text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0f4c81] transition-colors"
        />
        <button type="submit" className="px-4 bg-[#0f4c81] hover:bg-[#0a3560] text-white rounded-r-lg transition-colors flex-shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>
      </form>

      {/* Dropdown */}
      {focused && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e2e5ea] rounded-xl shadow-2xl z-50 overflow-hidden animate-slideDown">
          {results.map(p => (
            <button key={p.id} onClick={() => go(p.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f7f8fa] transition-colors text-left border-b border-[#f1f5f9] last:border-0">
              <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0f172a] line-clamp-1">{p.name}</p>
                <p className="text-xs text-[#94a3b8] capitalize">{p.category}</p>
              </div>
              <p className="text-sm font-bold text-[#0f4c81] flex-shrink-0">${p.price}</p>
            </button>
          ))}
          <button onClick={search} className="w-full px-4 py-2.5 text-sm text-[#0f4c81] font-medium hover:bg-[#f7f8fa] transition-colors text-center">
            See all results for "{query}" →
          </button>
        </div>
      )}
    </div>
  );
}