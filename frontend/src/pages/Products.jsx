import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
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

const SORT_OPTIONS = [
  { value: "-sold",         label: "Most Popular" },
  { value: "-createdAt",    label: "Newest First" },
  { value: "price",         label: "Price: Low to High" },
  { value: "-price",        label: "Price: High to Low" },
  { value: "-rating",       label: "Highest Rated" },
];

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [view, setView]       = useState("grid");
  const [sideOpen, setSideOpen] = useState(false);

  // Filter state (read from URL params)
  const category   = params.get("category") || "";
  const sort       = params.get("sort")     || "-sold";
  const search     = params.get("q")        || "";
  const badge      = params.get("badge")    || "";
  const page       = parseInt(params.get("page") || "1");
  const priceMax   = parseInt(params.get("priceMax") || "1200");
  const minRating  = parseFloat(params.get("rating") || "0");

  const setParam = (key, val) => {
    const next = new URLSearchParams(params);
    if (val) next.set(key, val); else next.delete(key);
    next.delete("page");  // reset page on filter change
    setParams(next);
  };
  const setPage = (p) => {
    const next = new URLSearchParams(params);
    next.set("page", p);
    setParams(next);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const query = { page, limit: 8, sort };
      if (category)  query.category = category;
      if (badge)     query.badge    = badge;
      if (search)    query.search   = search;
      if (priceMax < 1200) query["price[lte]"] = priceMax;
      if (minRating > 0)   query["rating[gte]"] = minRating;

      const res = await productAPI.getAll(query);
      setProducts(res.data.data       || []);
      setPagination(res.data.pagination || { total: 0, pages: 1, page: 1 });
    } catch (err) {
      console.error("Failed to fetch products:", err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, sort, category, badge, search, priceMax, minRating]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const resetFilters = () => setParams({});

  const activeFilters = [category, badge, search, priceMax < 1200, minRating > 0].filter(Boolean).length;

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold text-[#0f172a] mb-3">Categories</h3>
        <div className="space-y-1">
          <button onClick={() => setParam("category", "")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!category ? "bg-[#0f4c81] text-white font-semibold" : "text-[#475569] hover:bg-[#f7f8fa]"}`}>
            All Products
          </button>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setParam("category", c.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${category === c.id ? "bg-[#0f4c81] text-white font-semibold" : "text-[#475569] hover:bg-[#f7f8fa]"}`}>
              <span>{c.icon}</span><span className="flex-1">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-bold text-[#0f172a] mb-3">Max Price</h3>
        <input type="range" min="10" max="1200" step="10"
          value={priceMax}
          onChange={e => setParam("priceMax", e.target.value)}
          className="w-full accent-[#0f4c81]" />
        <div className="flex justify-between text-xs text-[#475569] mt-1">
          <span>$0</span>
          <span className="font-semibold text-[#0f4c81]">
            {priceMax >= 1200 ? "Any price" : `Up to $${priceMax}`}
          </span>
        </div>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {[[50,"<$50"],[200,"<$200"],[500,"<$500"],[1200,"Any"]].map(([v,l]) => (
            <button key={v} onClick={() => setParam("priceMax", v === 1200 ? "" : v)}
              className={`px-2.5 py-1 text-[10px] rounded-lg border transition-colors ${
                (v === 1200 ? priceMax >= 1200 : priceMax == v)
                  ? "bg-[#0f4c81] text-white border-[#0f4c81]"
                  : "border-[#e2e5ea] text-[#475569] hover:border-[#0f4c81]"
              }`}>{l}</button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-bold text-[#0f172a] mb-3">Min Rating</h3>
        <div className="space-y-1">
          {[[0,"All Ratings"],[3,"3+ Stars"],[4,"4+ Stars"],[4.5,"4.5+ Stars"]].map(([v,l]) => (
            <button key={v} onClick={() => setParam("rating", v || "")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${minRating == v ? "bg-[#e8f0fe] text-[#0f4c81] font-semibold" : "text-[#475569] hover:bg-[#f7f8fa]"}`}>
              <span className="text-amber-400">{"★".repeat(Math.floor(v) || 0)}</span>
              <span>{l}</span>
            </button>
          ))}
        </div>
      </div>

      {activeFilters > 0 && (
        <button onClick={resetFilters}
          className="w-full py-2.5 border border-[#e2e5ea] rounded-xl text-sm text-[#475569] hover:border-[#dc2626] hover:text-[#dc2626] transition-colors font-medium">
          ✕ Clear {activeFilters} filter{activeFilters > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#94a3b8] mb-4">
        <Link to="/" className="hover:text-[#0f4c81]">Home</Link><span>/</span>
        <span className="text-[#0f172a] font-medium capitalize">
          {category ? CATEGORIES.find(c => c.id === category)?.label || category : "All Products"}
        </span>
      </nav>

      <div className="flex gap-6">
        {/* Desktop sidebar */}
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
              <button onClick={() => setSideOpen(!sideOpen)}
                className="lg:hidden p-1.5 border border-[#e2e5ea] rounded-lg hover:border-[#0f4c81] transition-colors relative">
                <svg className="w-4 h-4 text-[#475569]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M10 12h4"/>
                </svg>
                {activeFilters > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#0f4c81] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {activeFilters}
                  </span>
                )}
              </button>
              <p className="text-sm text-[#475569]">
                <span className="font-bold text-[#0f172a]">{pagination.total}</span> products
                {search && <span> for "<span className="text-[#0f4c81] font-semibold">{search}</span>"</span>}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select value={sort} onChange={e => setParam("sort", e.target.value)}
                className="text-sm border border-[#e2e5ea] rounded-lg px-3 py-1.5 text-[#475569] focus:outline-none focus:border-[#0f4c81] bg-white cursor-pointer">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="flex border border-[#e2e5ea] rounded-lg overflow-hidden">
                {["grid","list"].map(v => (
                  <button key={v} onClick={() => setView(v)}
                    className={`p-1.5 transition-colors ${view === v ? "bg-[#0f4c81] text-white" : "text-[#94a3b8] hover:bg-[#f7f8fa]"}`}>
                    {v === "grid"
                      ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3A1.5 1.5 0 0115 10.5v3A1.5 1.5 0 0113.5 15h-3A1.5 1.5 0 019 13.5v-3z"/></svg>
                      : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M2.5 12a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h10a.5.5 0 010 1H3a.5.5 0 01-.5-.5z"/></svg>
                    }
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile sidebar */}
          {sideOpen && (
            <div className="lg:hidden mb-4 bg-white border border-[#e2e5ea] rounded-xl p-5 animate-slideDown">
              <SidebarContent />
            </div>
          )}

          {/* Products */}
          {loading ? (
            <div className={`grid gap-4 ${view === "list" ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"}`}>
              {[...Array(8)].map((_,i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#e2e5ea] rounded-xl">
              <p className="text-4xl mb-3">🔍</p>
              <h3 className="font-bold text-[#0f172a] mb-2">No products found</h3>
              <p className="text-sm text-[#475569] mb-4">Try adjusting filters or run <code className="bg-[#f1f5f9] px-1 rounded">npm run seed</code></p>
              <button onClick={resetFilters} className="text-sm text-[#0f4c81] font-semibold hover:underline">Clear all filters</button>
            </div>
          ) : (
            <div className={`grid gap-4 ${view === "list" ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"}`}>
              {products.map(p => <ProductCard key={p._id} product={p} view={view} />)}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-8">
              <button onClick={() => setPage(page - 1)} disabled={page <= 1}
                className="px-3 py-2 border border-[#e2e5ea] rounded-lg text-sm text-[#475569] hover:border-[#0f4c81] hover:text-[#0f4c81] disabled:opacity-40 transition-colors">
                ← Prev
              </button>
              {[...Array(pagination.pages)].map((_,i) => (
                <button key={i} onClick={() => setPage(i+1)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${page===i+1 ? "bg-[#0f4c81] text-white" : "border border-[#e2e5ea] text-[#475569] hover:border-[#0f4c81]"}`}>
                  {i+1}
                </button>
              ))}
              <button onClick={() => setPage(page + 1)} disabled={page >= pagination.pages}
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