import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { PRODUCTS, CATEGORIES } from "../data/mockData";
import ProductCard from "../components/ProductCard";
import { SkeletonCard } from "../components/Loader";

const SORT_OPTIONS = [
  { value: "popular",   label: "Most Popular" },
  { value: "newest",    label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc",label: "Price: High to Low" },
  { value: "rating",    label: "Highest Rated" },
];
const PAGE_SIZE = 8;

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [sort, setSort]         = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 1200]);
  const [minR, setMinR]         = useState(0);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [view, setView]         = useState("grid");
  const [sideOpen, setSideOpen] = useState(false);

  const q   = params.get("q")   || "";
  const cat = params.get("cat") || "";
  const badgeFilter = params.get("badge") || "";

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);
  useEffect(() => { setPage(1); }, [q, cat, sort, priceRange, minR]);

  const filtered = useMemo(() => {
    let p = [...PRODUCTS];
    if (cat)   p = p.filter(x => x.category === cat);
    if (q)     p = p.filter(x => x.name.toLowerCase().includes(q.toLowerCase()) || x.category.toLowerCase().includes(q.toLowerCase()));
    if (badgeFilter === "new") p = p.filter(x => x.badge === "NEW");
    p = p.filter(x => x.price >= priceRange[0] && x.price <= priceRange[1]);
    if (minR > 0) p = p.filter(x => x.rating >= minR);
    if (sort === "price_asc")  p.sort((a,b) => a.price - b.price);
    if (sort === "price_desc") p.sort((a,b) => b.price - a.price);
    if (sort === "rating")     p.sort((a,b) => b.rating - a.rating);
    if (sort === "popular")    p.sort((a,b) => b.reviews - a.reviews);
    return p;
  }, [cat, q, sort, priceRange, minR, badgeFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const setCat = c => { const p = new URLSearchParams(params); if (c) p.set("cat",c); else p.delete("cat"); p.delete("q"); setParams(p); };

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold text-[#0f172a] mb-3">Categories</h3>
        <div className="space-y-1">
          <button onClick={() => setCat("")} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!cat ? "bg-[#0f4c81] text-white font-semibold" : "text-[#475569] hover:bg-[#f7f8fa]"}`}>
            All Products <span className="float-right text-xs opacity-60">{PRODUCTS.length}</span>
          </button>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${cat === c.id ? "bg-[#0f4c81] text-white font-semibold" : "text-[#475569] hover:bg-[#f7f8fa]"}`}>
              <span>{c.icon}</span>
              <span className="flex-1">{c.label}</span>
              <span className="text-xs opacity-60">{PRODUCTS.filter(p=>p.category===c.id).length}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-bold text-[#0f172a] mb-3">Price Range</h3>
        <input type="range" min="0" max="1200" value={priceRange[1]} onChange={e => setPriceRange([0, +e.target.value])} className="w-full accent-[#0f4c81]" />
        <div className="flex justify-between text-xs text-[#475569] mt-1">
          <span>$0</span><span className="font-semibold text-[#0f4c81]">Up to ${priceRange[1]}</span>
        </div>
        <div className="flex gap-2 mt-2">
          {[[0,50],[50,200],[200,500],[500,1200]].map(([lo,hi]) => (
            <button key={lo} onClick={() => setPriceRange([lo,hi])}
              className={`flex-1 text-[10px] py-1.5 rounded-lg border transition-colors ${priceRange[0]===lo && priceRange[1]===hi ? "bg-[#0f4c81] text-white border-[#0f4c81]" : "border-[#e2e5ea] text-[#475569] hover:border-[#0f4c81]"}`}>
              ${lo}-${hi === 1200 ? "1200+" : hi}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-bold text-[#0f172a] mb-3">Minimum Rating</h3>
        <div className="space-y-1.5">
          {[0,3,4,4.5].map(r => (
            <button key={r} onClick={() => setMinR(r)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${minR===r ? "bg-[#e8f0fe] text-[#0f4c81] font-semibold" : "text-[#475569] hover:bg-[#f7f8fa]"}`}>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => <span key={s} className={`text-sm ${s<=r ? "text-amber-400":"text-[#e2e5ea]"}`}>★</span>)}
              </div>
              {r === 0 ? "All Ratings" : `${r}+ Stars`}
            </button>
          ))}
        </div>
      </div>

      <button onClick={() => { setCat(""); setPriceRange([0,1200]); setMinR(0); setSort("popular"); }}
        className="w-full py-2.5 border border-[#e2e5ea] rounded-xl text-sm text-[#475569] hover:border-[#0f4c81] hover:text-[#0f4c81] transition-colors font-medium">
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] mb-4">
        <span>Home</span><span>/</span>
        <span className="text-[#0f172a] font-medium">{cat ? CATEGORIES.find(c=>c.id===cat)?.label : "All Products"}</span>
      </div>

      <div className="flex gap-6">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="bg-white border border-[#e2e5ea] rounded-xl p-5 sticky top-32">
            <SidebarContent />
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 mb-5 bg-white border border-[#e2e5ea] rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setSideOpen(!sideOpen)} className="lg:hidden p-1.5 border border-[#e2e5ea] rounded-lg hover:border-[#0f4c81] transition-colors">
                <svg className="w-4 h-4 text-[#475569]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/></svg>
              </button>
              <p className="text-sm text-[#475569]">
                <span className="font-bold text-[#0f172a]">{filtered.length}</span> products found
                {(q || cat) && <span> for <span className="font-semibold text-[#0f4c81]">"{q || CATEGORIES.find(c=>c.id===cat)?.label}"</span></span>}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="text-sm border border-[#e2e5ea] rounded-lg px-3 py-1.5 text-[#475569] focus:outline-none focus:border-[#0f4c81] bg-white cursor-pointer">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="flex border border-[#e2e5ea] rounded-lg overflow-hidden">
                <button onClick={() => setView("grid")} className={`p-1.5 transition-colors ${view==="grid" ? "bg-[#0f4c81] text-white" : "text-[#94a3b8] hover:bg-[#f7f8fa]"}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3A1.5 1.5 0 0115 10.5v3A1.5 1.5 0 0113.5 15h-3A1.5 1.5 0 019 13.5v-3z"/></svg>
                </button>
                <button onClick={() => setView("list")} className={`p-1.5 transition-colors ${view==="list" ? "bg-[#0f4c81] text-white" : "text-[#94a3b8] hover:bg-[#f7f8fa]"}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M2.5 12a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile sidebar */}
          {sideOpen && (
            <div className="lg:hidden mb-4 bg-white border border-[#e2e5ea] rounded-xl p-5 animate-slideDown">
              <SidebarContent />
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className={`grid gap-4 ${view==="list" ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"}`}>
              {[...Array(8)].map((_,i) => <SkeletonCard key={i} />)}
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#e2e5ea] rounded-xl">
              <p className="text-4xl mb-3">🔍</p>
              <h3 className="font-bold text-[#0f172a] mb-2">No products found</h3>
              <p className="text-sm text-[#475569] mb-4">Try adjusting your filters or search terms</p>
              <button onClick={() => { setCat(""); setPriceRange([0,1200]); setMinR(0); }} className="text-sm text-[#0f4c81] font-semibold hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className={`grid gap-4 ${view==="list" ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"}`}>
              {paginated.map(p => <ProductCard key={p.id} product={p} view={view} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-8">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                className="px-3 py-2 border border-[#e2e5ea] rounded-lg text-sm text-[#475569] hover:border-[#0f4c81] hover:text-[#0f4c81] disabled:opacity-40 transition-colors">
                ← Prev
              </button>
              {[...Array(totalPages)].map((_,i) => (
                <button key={i} onClick={() => setPage(i+1)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${page===i+1 ? "bg-[#0f4c81] text-white" : "border border-[#e2e5ea] text-[#475569] hover:border-[#0f4c81]"}`}>
                  {i+1}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                className="px-3 py-2 border border-[#e2e5ea] rounded-lg text-sm text-[#475569] hover:border-[#0f4c81] hover:text-[#0f4c81] disabled:opacity-40 transition-colors">
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}