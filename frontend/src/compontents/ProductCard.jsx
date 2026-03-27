import { Link } from "react-router-dom";
import { useCart } from "../context/AppContext";
import { useState } from "react";

function StarRating({ rating, size = "sm" }) {
  const w = size === "sm" ? "w-3 h-3" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <svg key={s} className={`${w} ${s <= Math.round(rating) ? "text-amber-400" : "text-[#e2e5ea]"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export { StarRating };

export default function ProductCard({ product, view = "grid" }) {
  const { addToCart, cart } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = cart.some(i => i.id === product.id);
  const discount = product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  if (view === "list") return (
    <Link to={`/product/${product.id}`} className="flex gap-4 bg-white border border-[#e2e5ea] rounded-xl p-4 hover:shadow-md hover:border-[#0f4c81]/30 transition-all group animate-fadeInUp">
      <div className="w-36 h-36 flex-shrink-0 rounded-xl overflow-hidden bg-[#f7f8fa]">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-[#94a3b8] capitalize mb-0.5">{product.category}</p>
            <h3 className="font-semibold text-[#0f172a] text-sm leading-snug line-clamp-2 group-hover:text-[#0f4c81] transition-colors">{product.name}</h3>
          </div>
          {product.badge && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 badge-${product.badge.toLowerCase()}`}>{product.badge}</span>}
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <StarRating rating={product.rating} />
          <span className="text-xs text-[#94a3b8]">({product.reviews.toLocaleString()})</span>
        </div>
        <p className="text-xs text-[#475569] line-clamp-2 mt-2">{product.description}</p>
        <div className="flex items-center justify-between mt-auto pt-3">
          <div>
            <span className="text-xl font-bold text-[#0f172a]">${product.price}</span>
            {discount > 0 && <><span className="text-xs text-[#94a3b8] line-through ml-2">${product.originalPrice}</span><span className="text-xs font-bold text-[#dc2626] ml-1">-{discount}%</span></>}
          </div>
          <button onClick={handleAdd} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${added ? "bg-green-500 text-white" : "bg-[#ff6b2b] hover:bg-[#e85a1a] text-white"}`}>
            {added ? "✓ Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </Link>
  );

  return (
    <Link to={`/product/${product.id}`}
      className="bg-white border border-[#e2e5ea] rounded-xl overflow-hidden hover:shadow-lg hover:border-[#0f4c81]/25 transition-all duration-300 group flex flex-col animate-fadeInUp">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f7f8fa]">
        <img src={product.images[0]} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {product.badge && (
          <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md badge-${product.badge.toLowerCase()}`}>
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute top-2.5 right-2.5 bg-[#dc2626] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
            -{discount}%
          </span>
        )}
        {/* Quick add overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
        <button onClick={handleAdd}
          className="absolute bottom-0 left-0 right-0 py-2.5 bg-[#0f4c81] text-white text-xs font-semibold translate-y-full group-hover:translate-y-0 transition-transform duration-200 hover:bg-[#0a3560]">
          {added ? "✓ Added to Cart!" : "+ Add to Cart"}
        </button>
      </div>
      {/* Body */}
      <div className="p-3.5 flex flex-col flex-1">
        <p className="text-[10px] text-[#94a3b8] uppercase tracking-wider font-medium mb-1">{product.category}</p>
        <h3 className="text-sm font-semibold text-[#0f172a] line-clamp-2 leading-snug group-hover:text-[#0f4c81] transition-colors mb-2 flex-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 mb-2.5">
          <StarRating rating={product.rating} />
          <span className="text-xs text-[#94a3b8]">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-[#0f172a]">${product.price}</span>
            {discount > 0 && <span className="text-xs text-[#94a3b8] line-through ml-1.5">${product.originalPrice}</span>}
          </div>
          {product.stock <= 5 && <span className="text-[10px] text-[#dc2626] font-semibold">Only {product.stock} left!</span>}
        </div>
        {inCart && <p className="text-[10px] text-[#16a34a] font-semibold mt-1.5">✓ In your cart</p>}
      </div>
    </Link>
  );
}