import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { productAPI } from "../services/api";
import { useCart, useAuth, useToast } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

function Stars({ rating, size = "sm" }) {
  const w = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s} className={`${w} ${s <= Math.round(rating) ? "text-amber-400" : "text-[#e2e5ea]"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetails() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { addToCart, cart } = useCart();
  const { user }     = useAuth();
  const { addToast } = useToast();

  const [product, setProduct]   = useState(null);
  const [related, setRelated]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [imgIdx, setImgIdx]     = useState(0);
  const [qty, setQty]           = useState(1);
  const [tab, setTab]           = useState("description");
  const [added, setAdded]       = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    setLoading(true);
    setImgIdx(0); setQty(1); setAdded(false);
    window.scrollTo(0, 0);

    productAPI.getOne(id)
      .then(res => {
        setProduct(res.data.data);
        return productAPI.getByCategory(res.data.data.category);
      })
      .then(res => setRelated((res.data.data || []).filter(p => p._id !== id).slice(0, 4)))
      .catch(() => { addToast("Failed to load product", "error"); navigate("/products"); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-24"><Loader text="Loading product..." /></div>;
  if (!product) return null;

  const allImages = product.images?.length ? product.images : [product.image].filter(Boolean);
  const discount  = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const inCart    = cart.some(i => i._id === product._id);

  const handleAdd = () => {
    addToCart({ ...product, id: product._id });
    setAdded(true);
    addToast(`${product.name.slice(0, 30)}... added to cart!`, "success");
    setTimeout(() => setAdded(false), 2500);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { addToast("Please log in to leave a review", "warning"); navigate("/login"); return; }
    setSubmittingReview(true);
    try {
      await productAPI.addReview(id, reviewForm);
      addToast("Review submitted successfully!", "success");
      setReviewForm({ rating: 5, comment: "" });
      // Refresh product to get updated reviews
      const res = await productAPI.getOne(id);
      setProduct(res.data.data);
      setTab("reviews");
    } catch (err) {
      addToast(err.response?.data?.error || "Failed to submit review", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#94a3b8] mb-5 flex-wrap">
        <Link to="/" className="hover:text-[#0f4c81]">Home</Link><span>/</span>
        <Link to="/products" className="hover:text-[#0f4c81]">Products</Link><span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-[#0f4c81] capitalize">{product.category}</Link><span>/</span>
        <span className="text-[#0f172a] font-medium line-clamp-1 max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="bg-white border border-[#e2e5ea] rounded-2xl overflow-hidden aspect-square flex items-center justify-center">
            {allImages[imgIdx] ? (
              <img src={allImages[imgIdx]} alt={product.name}
                className="w-full h-full object-contain p-6 hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="text-5xl opacity-30">📦</div>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2">
              {allImages.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`w-16 h-16 rounded-xl border-2 overflow-hidden transition-all flex-shrink-0 ${imgIdx === i ? "border-[#0f4c81]" : "border-[#e2e5ea] hover:border-[#0f4c81]/40"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-4">
          {product.badge && (
            <span className={`w-fit text-xs font-bold px-3 py-1 rounded-md badge-${product.badge.toLowerCase()}`}>
              {product.badge}
            </span>
          )}
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#0f172a] leading-tight">{product.name}</h1>
          <p className="text-xs text-[#94a3b8] capitalize font-medium">{product.brand} · {product.category}</p>

          {/* Rating */}
          <div className="flex items-center gap-3 pb-4 border-b border-[#f1f5f9]">
            <Stars rating={product.rating} size="md" />
            <span className="text-sm font-bold text-[#0f172a]">{product.rating?.toFixed(1) || "0.0"}</span>
            <span className="text-sm text-[#94a3b8]">({product.numReviews?.toLocaleString() || 0} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-[#0f172a]">${product.price?.toFixed(2)}</span>
            {discount > 0 && <>
              <span className="text-lg text-[#94a3b8] line-through mb-0.5">${product.originalPrice?.toFixed(2)}</span>
              <span className="text-sm font-bold text-[#dc2626] bg-[#fee2e2] px-2 py-0.5 rounded-md mb-0.5">Save {discount}%</span>
            </>}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.stock > 5 ? "bg-[#16a34a]" : product.stock > 0 ? "bg-amber-400" : "bg-[#dc2626]"}`} />
            <span className="text-sm font-medium text-[#475569]">
              {product.stock > 5 ? "In Stock" : product.stock > 0 ? `Only ${product.stock} left!` : "Out of Stock"}
            </span>
            {product.sold > 0 && <span className="text-xs text-[#94a3b8]">· {product.sold} sold</span>}
          </div>

          {/* Features */}
          {product.features?.length > 0 && (
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
              <button onClick={() => setQty(q => Math.max(1, q-1))} className="px-3.5 py-3 text-[#475569] hover:bg-[#f7f8fa] transition-colors font-bold text-lg">−</button>
              <span className="px-4 py-3 font-bold text-[#0f172a] min-w-[3rem] text-center">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q+1))} className="px-3.5 py-3 text-[#475569] hover:bg-[#f7f8fa] transition-colors font-bold text-lg">+</button>
            </div>
            <button onClick={handleAdd} disabled={product.stock === 0}
              className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all ${
                added
                  ? "bg-[#16a34a] text-white shadow-lg shadow-green-500/20"
                  : "bg-[#ff6b2b] hover:bg-[#e85a1a] text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 active:scale-95"
              } disabled:opacity-50 disabled:cursor-not-allowed`}>
              {added ? "✓ Added to Cart!" : "Add to Cart"}
            </button>
          </div>

          <Link to="/cart"
            className="block w-full py-3.5 rounded-xl border-2 border-[#0f4c81] text-[#0f4c81] font-bold text-sm text-center hover:bg-[#0f4c81] hover:text-white transition-all">
            {inCart ? "View Cart →" : "Buy Now"}
          </Link>

          {/* Trust */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#f1f5f9]">
            {[["🔒","Secure Pay"],["🚚","Fast Ship"],["🔄","30d Returns"]].map(([ic,l]) => (
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
        <div className="flex border-b border-[#e2e5ea] overflow-x-auto">
          {[["description","Description"],["reviews",`Reviews (${product.numReviews || 0})`],["shipping","Shipping"]].map(([v,l]) => (
            <button key={v} onClick={() => setTab(v)}
              className={`flex-shrink-0 px-6 py-4 text-sm font-semibold capitalize transition-colors border-b-2 ${
                tab === v ? "border-[#0f4c81] text-[#0f4c81] bg-[#f0f4ff]" : "border-transparent text-[#475569] hover:text-[#0f172a]"
              }`}>{l}</button>
          ))}
        </div>

        <div className="p-6">
          {/* Description */}
          {tab === "description" && (
            <div className="space-y-3">
              <p className="text-[#475569] leading-relaxed">{product.description}</p>
              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-3">
                  {product.tags.map(t => (
                    <span key={t} className="text-xs bg-[#f1f5f9] text-[#475569] px-2.5 py-1 rounded-full capitalize">#{t}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reviews */}
          {tab === "reviews" && (
            <div>
              {/* Summary */}
              <div className="flex items-center gap-8 mb-6 pb-6 border-b border-[#f1f5f9]">
                <div className="text-center">
                  <p className="text-5xl font-bold text-[#0f172a]">{product.rating?.toFixed(1) || "0.0"}</p>
                  <Stars rating={product.rating} size="md" />
                  <p className="text-xs text-[#94a3b8] mt-1">{product.numReviews || 0} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5,4,3,2,1].map(s => {
                    const count = (product.reviews || []).filter(r => Math.round(r.rating) === s).length;
                    const pct   = product.reviews?.length ? (count / product.reviews.length * 100) : 0;
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <span className="text-xs text-[#475569] w-4">{s}</span>
                        <span className="text-amber-400 text-xs">★</span>
                        <div className="flex-1 bg-[#f1f5f9] rounded-full h-2 overflow-hidden">
                          <div className="bg-amber-400 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-[#94a3b8] w-6">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Write Review */}
              <div className="bg-[#f7f8fa] rounded-xl p-5 mb-6">
                <h3 className="text-sm font-bold text-[#0f172a] mb-4">Write a Review</h3>
                <form onSubmit={handleReview} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-[#475569] block mb-1">Your Rating</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => (
                        <button type="button" key={s} onClick={() => setReviewForm(f => ({...f, rating: s}))}
                          className={`text-2xl transition-transform hover:scale-110 ${s <= reviewForm.rating ? "text-amber-400" : "text-[#e2e5ea]"}`}>★</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#475569] block mb-1">Comment</label>
                    <textarea required rows={3} placeholder="Share your experience..."
                      value={reviewForm.comment}
                      onChange={e => setReviewForm(f => ({...f, comment: e.target.value}))}
                      className="w-full px-3 py-2.5 border border-[#e2e5ea] rounded-xl text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0f4c81] resize-none bg-white" />
                  </div>
                  <button type="submit" disabled={submittingReview}
                    className="px-6 py-2.5 bg-[#0f4c81] hover:bg-[#0a3560] text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-60">
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>

              {/* Review list */}
              {(product.reviews || []).length === 0 ? (
                <p className="text-sm text-[#94a3b8] text-center py-6">No reviews yet. Be the first!</p>
              ) : (
                <div className="space-y-5">
                  {product.reviews.map(r => (
                    <div key={r._id} className="border-b border-[#f1f5f9] pb-5 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#0f4c81] rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {r.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <span className="text-sm font-semibold text-[#0f172a]">{r.name}</span>
                        </div>
                        <span className="text-xs text-[#94a3b8]">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <Stars rating={r.rating} />
                      <p className="text-sm text-[#475569] leading-relaxed mt-2">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Shipping */}
          {tab === "shipping" && (
            <div className="space-y-4">
              {[
                ["🚚 Standard Shipping","5-7 business days","Free on orders over $50"],
                ["⚡ Express Shipping","2-3 business days","$9.99"],
                ["✈️ International","10-14 business days","From $19.99"],
              ].map(([t,d,p]) => (
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
          <h2 className="text-xl font-bold font-display text-[#0f172a] mb-5">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}