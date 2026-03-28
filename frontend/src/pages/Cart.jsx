import { Link } from "react-router-dom";
import { useCart } from "../context/AppContext";

export default function Cart() {
  const { cart, removeFromCart, updateQty, totalPrice, clearCart } = useCart();

  if (cart.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="w-24 h-24 bg-[#f0f4ff] rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-[#0f4c81]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold font-display text-[#0f172a] mb-3">Your cart is empty</h2>
      <p className="text-[#475569] mb-8">Looks like you haven't added anything yet. Start shopping!</p>
      <Link to="/products" className="inline-block bg-[#ff6b2b] hover:bg-[#e85a1a] text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:-translate-y-0.5">
        Start Shopping →
      </Link>
    </div>
  );

  const shipping = totalPrice >= 50 ? 0 : 9.99;
  const tax      = totalPrice * 0.08;
  const total    = totalPrice + shipping + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold font-display text-[#0f172a] mb-6">
        Shopping Cart <span className="text-base font-normal text-[#94a3b8]">({cart.length} item{cart.length!==1?"s":""})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {/* Free shipping banner */}
          {shipping === 0 ? (
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-[#16a34a] font-semibold">
              <span>🚚</span> You qualify for FREE shipping!
            </div>
          ) : (
            <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl px-4 py-3 text-sm text-[#0f4c81]">
              Add <span className="font-bold">${(50 - totalPrice).toFixed(2)}</span> more to get free shipping 🚚
            </div>
          )}

          {cart.map((item) => {
            const disc = item.originalPrice > item.price
              ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;
            return (
              <div key={item.id} className="bg-white border border-[#e2e5ea] rounded-xl p-4 hover:shadow-md transition-shadow animate-fadeIn">
                <div className="flex gap-4">
                  <Link to={`/product/${item.id}`} className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-[#f7f8fa] border border-[#f1f5f9] hover:border-[#0f4c81]/30 transition-colors">
                    <img src={item.images?.[0] || item.image} alt={item.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-[#94a3b8] capitalize">{item.category}</p>
                        <Link to={`/product/${item.id}`} className="text-sm font-semibold text-[#0f172a] hover:text-[#0f4c81] transition-colors line-clamp-2 leading-snug">{item.name}</Link>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-[#94a3b8] hover:text-[#dc2626] hover:bg-[#fee2e2] rounded-lg transition-all flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                    {item.stock <= 5 && item.stock > 0 && <p className="text-[10px] text-[#dc2626] font-semibold mt-1">⚠️ Only {item.stock} left!</p>}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#e2e5ea] rounded-lg overflow-hidden">
                        <button onClick={() => updateQty(item.id, item.qty - 1)}
                          className="px-3 py-1.5 text-[#475569] hover:bg-[#f7f8fa] transition-colors text-sm font-bold">−</button>
                        <span className="px-3 py-1.5 text-sm font-bold text-[#0f172a] border-x border-[#e2e5ea] min-w-[2.5rem] text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)}
                          className="px-3 py-1.5 text-[#475569] hover:bg-[#f7f8fa] transition-colors text-sm font-bold">+</button>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-[#0f172a]">${(item.price * item.qty).toFixed(2)}</p>
                        {disc > 0 && <p className="text-xs text-[#94a3b8] line-through">${(item.originalPrice * item.qty).toFixed(2)}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between items-center pt-2">
            <button onClick={clearCart} className="text-sm text-[#dc2626] hover:underline font-medium">🗑️ Clear Cart</button>
            <Link to="/products" className="text-sm text-[#0f4c81] hover:underline font-medium">← Continue Shopping</Link>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="bg-white border border-[#e2e5ea] rounded-xl p-5 sticky top-28">
            <h2 className="font-bold text-[#0f172a] text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-[#475569]">
                <span>Subtotal ({cart.reduce((s,i)=>s+i.qty,0)} items)</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#475569]">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-[#16a34a] font-semibold" : "font-medium"}>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-[#475569]">
                <span>Estimated Tax (8%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-[#f1f5f9] pt-3 flex justify-between text-[#0f172a] font-bold text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo */}
            <div className="flex gap-2 mb-4">
              <input type="text" placeholder="Promo code" className="flex-1 px-3 py-2.5 border border-[#e2e5ea] rounded-xl text-sm focus:outline-none focus:border-[#0f4c81] transition-colors" />
              <button className="px-4 py-2.5 bg-[#0f172a] text-white text-sm font-semibold rounded-xl hover:bg-[#1e293b] transition-colors">Apply</button>
            </div>

            <Link to="/checkout"
              className="block w-full text-center bg-[#ff6b2b] hover:bg-[#e85a1a] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:-translate-y-0.5 text-sm">
              Proceed to Checkout →
            </Link>
            <div className="mt-4 flex justify-center gap-1.5 flex-wrap">
              {["Visa","Mastercard","PayPal","Apple Pay"].map(p => (
                <span key={p} className="text-[10px] border border-[#e2e5ea] px-2 py-0.5 rounded text-[#94a3b8]">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}