import { Link } from "react-router-dom";
import { useCart } from "../context/AppContext";
import { useState } from "react";

// ── Star Rating ───────────────────────────────────────────
function StarRating({ rating = 0, size = "sm" }) {
  const w = size === "sm" ? "w-3 h-3" : "w-4 h-4";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`${w} ${s <= Math.round(rating)
            ? "text-amber-400"
            : "text-[#e2e5ea]"
            }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export { StarRating };

// ── Product Card ──────────────────────────────────────────
export default function ProductCard({ product, view = "grid" }) {
  const { addToCart, cart } = useCart();
  const [added, setAdded] = useState(false);

  // ✅ FIXED: use _id instead of id
  const inCart = cart.some((i) => i._id === product._id);

  const discount =
    product?.originalPrice > product?.price
      ? Math.round(
        (1 - product.price / product.originalPrice) * 100
      )
      : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const imageSrc =
    product?.image || product?.images?.[0] || "/placeholder.png";

  // ── LIST VIEW ───────────────────────────────────────────
  if (view === "list") {
    return (
      <Link
        to={`/product/${product._id}`}
        className="flex gap-4 bg-white border border-[#e2e5ea] rounded-xl p-4 hover:shadow-md hover:border-[#0f4c81]/30 transition-all group"
      >
        <div className="relative aspect-[4/3] bg-gray-100 flex items-center justify-center">
          <img
            src={imageSrc}
            alt={product?.name}
            className="max-h-full max-w-full object-contain object-center p-2 transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <h3 className="font-semibold text-sm">
            {product?.name}
          </h3>

          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={product?.rating || 0} />
            <span className="text-xs text-gray-400">
              ({(product?.reviews || 0).toLocaleString()})
            </span>
          </div>

          <p className="text-xs mt-2 line-clamp-2">
            {product?.description}
          </p>

          <div className="mt-auto pt-3 flex justify-between items-center">
            <span className="font-bold">
              ${product?.price}
            </span>

            <button
              onClick={handleAdd}
              className="bg-orange-500 text-white px-3 py-1 rounded"
            >
              {added ? "✓ Added" : "Add"}
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // ── GRID VIEW ───────────────────────────────────────────
  return (
    <Link
      to={`/product/${product._id}`}
      className="bg-white border rounded-xl overflow-hidden hover:shadow-lg group flex flex-col"
    >
      <div className="relative aspect-[4/3] bg-gray-100">
        <img
          src={imageSrc}
          alt={product?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />

        {discount > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-1 rounded">
            -{discount}%
          </span>
        )}

        <button
          onClick={handleAdd}
          className="absolute bottom-0 w-full bg-blue-600 text-white py-2 translate-y-full group-hover:translate-y-0 transition"
        >
          {added ? "✓ Added" : "Add to Cart"}
        </button>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm font-semibold line-clamp-2">
          {product?.name}
        </h3>

        <div className="flex items-center gap-1 mt-2">
          <StarRating rating={product?.rating || 0} />
          <span className="text-xs text-gray-400">
            ({(product?.reviews || 0).toLocaleString()})
          </span>
        </div>

        <div className="mt-auto flex justify-between items-center">
          <span className="font-bold">
            ${product?.price}
          </span>

          {inCart && (
            <span className="text-green-600 text-xs">
              ✓ In Cart
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}