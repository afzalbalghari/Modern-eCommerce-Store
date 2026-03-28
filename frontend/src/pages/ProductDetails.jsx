import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PRODUCTS, REVIEWS } from "../data/mockData";
import { useCart } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { StarRating } from "../components/ProductCard";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, cart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty]         = useState(1);
  const [imgIdx, setImgIdx]   = useState(0);
  const [added, setAdded]     = useState(false);
  const [tab, setTab]         = useState("description");

  useEffect(() => {
    setProduct(PRODUCTS.find(p => p.id === id) || PRODUCTS[0]);
    setImgIdx(0); setQty(1); setAdded(false);
    window.scrollTo(0,0);
  }, [id]);

  if (!product) return null;

  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0,4);
  const inCart  = cart.some(i => i.id === product.id);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#94a3b8] mb-5">
        <Link to="/" className="hover:text-[#0f4c81]">Home</Link><span>/</span>
        <Link to="/products" className="hover:text-[#0f4c81]">Products</Link><span>/</span>
        <Link to={`/products?cat=${product.category}`} className="hover:text-[#0f4c81] capitalize">{product.category}</Link><span>/</span>
        <span className="text-[#0f172a] font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <div className="space-y-3">
          <div className="bg-white border border-[#e2e5ea] rounded-2xl overflow-hidden aspect-square">
            <img src={product.images[imgIdx] || product.images[0]} alt={product.name} className="w-full h-full object-contain p-6" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img,i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`w-16 h-16 rounded-xl border-2 overflow-hidden transition-all ${imgIdx===i ? "border-[#0f4c81]" : "border-[#e2e5ea] hover:border-[#0f4c81]/40"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          {product.badge && (
            <span className={`inline-block w-fit text-xs font-bold px-3 py-1 rounded-md badge-${product.badge.toLowerCase()}`}>{product.badge}</span>
          )}
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#0f172a] leading-tight">{product.name}</h1>

          {/* Rating row */}
          <div className="flex items-center gap-3 pb-4 border-b border-[#f1f5f9]">
            <StarRating rating={product.rating} size="md" />
            <span className="text-sm font-bold text-[#0f172a]">{product.rating}</span>
            <span className="text-sm text-[#94a3b8]">{product.reviews.toLocaleString()} customer reviews</span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-[#0f172a]">${product.price}</span>
            {discount > 0 && <>
              <span className="text-lg text-[#94a3b8] line-through">${product.originalPrice}</span>
              <span className="text-sm font-bold text-[#dc2626] bg-[#fee2e2] px-2 py-0.5 rounded-md">Save {discount}%</span>
            </>}
          </div>
          {discount > 0 && <p className="text-sm text-[#dc2626] font-medium">🔥 Limited time deal</p>}

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.stock > 5 ? "bg-[#16a34a]" : product.stock > 0 ? "bg-amber-400" : "bg-[#dc2626]"}`} />
            <span className="text-sm font-medium text-[#475569]">
              {product.stock > 5 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left in stock!` : "Out of Stock"}
            </span>
          </div>

          {/* Features */}
          {product.features && (
            <ul className="space-y-1.5 bg-[#f7f8fa] rounded-xl p-4">
              {product.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#475569]">
                  <svg className="w-4 h-4 text-[#16a34a] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          )}

          {/* Qty + Add */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center border-2 border-[#e2e5ea] rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1,q-1))} className="px-3.5 py-3 text-[#475569] hover:bg-[#f7f8fa] transition-colors font-bold text-lg">−</button>
              <span className="px-4 py-3 font-bold text-[#0f172a] min-w-[3rem] text-center">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q+1))} className="px-3.5 py-3 text-[#475569] hover:bg-[#f7f8fa] transition-colors font-bold text-lg">+</button>
            </div>
            <button onClick={handleAdd} disabled={product.stock === 0}
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${added ? "bg-[#16a34a] text-white shadow-lg shadow-green-500/20" : "bg-[#ff6b2b] hover:bg-[#e85a1a] text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30"} disabled:opacity-50`}>
              {added ? "✓ Added to Cart!" : "Add to Cart"}
            </button>
          </div>
          <Link to="/cart" className="block w-full py-3.5 rounded-xl border-2 border-[#0f4c81] text-[#0f4c81] font-bold text-sm text-center hover:bg-[#0f4c81] hover:text-white transition-all">
            Buy Now
          </Link>
          {inCart && <p className="text-xs text-center text-[#16a34a] font-semibold">✓ This item is in your cart</p>}

          {/* Trust */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#f1f5f9]">
            {[["🔒","Secure Checkout"],["🚚","Fast Delivery"],["🔄","Easy Returns"]].map(([ic,l]) => (
              <div key={l} className="flex flex-col items-center gap-1 text-center">
                <span className="text-lg">{ic}</span>
                <span className="text-[10px] text-[#94a3b8] font-medium">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-[#e2e5ea] rounded-2xl overflow-hidden mb-10">
        <div className="flex border-b border-[#e2e5ea]">
          {["description","reviews","shipping"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-4 text-sm font-semibold capitalize transition-colors border-b-2 ${tab===t ? "border-[#0f4c81] text-[#0f4c81] bg-[#f0f4ff]" : "border-transparent text-[#475569] hover:text-[#0f172a]"}`}>
              {t === "reviews" ? `Reviews (${REVIEWS.length})` : t}
            </button>
          ))}
        </div>
        <div className="p-6">
          {tab === "description" && (
            <div className="space-y-3">
              <p className="text-[#475569] leading-relaxed">{product.description}</p>
              <p className="text-[#475569] leading-relaxed">Experience the difference with premium quality materials and cutting-edge design. Every detail has been carefully considered to provide you with the best possible experience.</p>
            </div>
          )}
          {tab === "reviews" && (
            <div>
              {/* Rating summary */}
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-[#f1f5f9]">
                <div className="text-center">
                  <p className="text-5xl font-bold text-[#0f172a]">{product.rating}</p>
                  <StarRating rating={product.rating} size="md" />
                  <p className="text-xs text-[#94a3b8] mt-1">{product.reviews.toLocaleString()} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5,4,3,2,1].map(s => (
                    <div key={s} className="flex items-center gap-2">
                      <span className="text-xs text-[#475569] w-4">{s}</span>
                      <span className="text-amber-400 text-xs">★</span>
                      <div className="flex-1 bg-[#f1f5f9] rounded-full h-2 overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: `${s === 5 ? 65 : s === 4 ? 20 : s === 3 ? 10 : 3}%` }} />
                      </div>
                      <span className="text-xs text-[#94a3b8] w-8">{s===5?"65%":s===4?"20%":s===3?"10%":"3%"}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-5">
                {REVIEWS.map(r => (
                  <div key={r.id} className="border-b border-[#f1f5f9] pb-5 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#0f4c81] rounded-full flex items-center justify-center text-white text-xs font-bold">{r.user[0]}</div>
                        <span className="text-sm font-semibold text-[#0f172a]">{r.user}</span>
                      </div>
                      <span className="text-xs text-[#94a3b8]">{r.date}</span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {[1,2,3,4,5].map(s => <span key={s} className={`text-sm ${s<=r.rating?"text-amber-400":"text-[#e2e5ea]"}`}>★</span>)}
                    </div>
                    <p className="text-sm text-[#475569] leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === "shipping" && (
            <div className="space-y-4">
              {[["🚚 Standard Shipping","5-7 business days","Free on orders over $50"],["⚡ Express Shipping","2-3 business days","$9.99"],["✈️ International","10-14 business days","From $19.99"]].map(([t,d,p]) => (
                <div key={t} className="flex items-center justify-between p-4 bg-[#f7f8fa] rounded-xl">
                  <div><p className="font-semibold text-sm text-[#0f172a]">{t}</p><p className="text-xs text-[#94a3b8]">{d}</p></div>
                  <span className="text-sm font-bold text-[#0f4c81]">{p}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold font-display text-[#0f172a] mb-5">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}