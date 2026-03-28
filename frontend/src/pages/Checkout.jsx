import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/AppContext";

const STEPS = [
  { n:1, label:"Shipping",  icon:"🚚" },
  { n:2, label:"Payment",   icon:"💳" },
  { n:3, label:"Review",    icon:"✅" },
];

const INPUT = "w-full px-4 py-3 border border-[#e2e5ea] rounded-xl text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0f4c81] focus:ring-2 focus:ring-[#0f4c81]/10 transition-all bg-white";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep]       = useState(1);
  const [placing, setPlacing] = useState(false);
  const [method, setMethod]   = useState("card");
  const [ship, setShip] = useState({ firstName:"", lastName:"", email:"", phone:"", address:"", city:"", zip:"", country:"Pakistan" });
  const [pay, setPay]   = useState({ card:"", expiry:"", cvv:"", name:"" });

  const setS = (k,v) => setShip(s => ({...s,[k]:v}));
  const setP = (k,v) => setPay(s => ({...s,[k]:v}));

  const shipping = totalPrice >= 50 ? 0 : 9.99;
  const tax      = totalPrice * 0.08;
  const total    = totalPrice + shipping + tax;

  const placeOrder = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1800));
    clearCart();
    navigate("/dashboard");
    alert("🎉 Order placed successfully! Check your dashboard.");
  };

  if (cart.length === 0 && step < 3) return (
    <div className="text-center py-20">
      <p className="text-[#475569] mb-4">Your cart is empty.</p>
      <Link to="/products" className="text-[#0f4c81] font-semibold hover:underline">Browse Products</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold font-display text-[#0f172a] mb-8">Checkout</h1>

      {/* Stepper */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, idx) => (
          <div key={s.n} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${s.n < step ? "bg-[#16a34a] text-white" : s.n === step ? "bg-[#0f4c81] text-white ring-4 ring-[#0f4c81]/20" : "bg-[#f1f5f9] text-[#94a3b8]"}`}>
                {s.n < step ? "✓" : s.icon}
              </div>
              <div className="hidden sm:block">
                <p className={`text-xs font-bold ${s.n === step ? "text-[#0f4c81]" : s.n < step ? "text-[#16a34a]" : "text-[#94a3b8]"}`}>Step {s.n}</p>
                <p className={`text-sm font-semibold ${s.n === step ? "text-[#0f172a]" : "text-[#94a3b8]"}`}>{s.label}</p>
              </div>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 mx-3 h-1 rounded-full transition-all ${s.n < step ? "bg-[#16a34a]" : "bg-[#e2e5ea]"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form area */}
        <div className="lg:col-span-2">

          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="bg-white border border-[#e2e5ea] rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-bold text-[#0f172a]">🚚 Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold text-[#475569] block mb-1.5">First Name *</label><input className={INPUT} placeholder="John" value={ship.firstName} onChange={e => setS("firstName",e.target.value)} /></div>
                <div><label className="text-xs font-semibold text-[#475569] block mb-1.5">Last Name *</label><input className={INPUT} placeholder="Doe" value={ship.lastName} onChange={e => setS("lastName",e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold text-[#475569] block mb-1.5">Email *</label><input type="email" className={INPUT} placeholder="john@email.com" value={ship.email} onChange={e => setS("email",e.target.value)} /></div>
                <div><label className="text-xs font-semibold text-[#475569] block mb-1.5">Phone</label><input className={INPUT} placeholder="+92 300 0000000" value={ship.phone} onChange={e => setS("phone",e.target.value)} /></div>
              </div>
              <div><label className="text-xs font-semibold text-[#475569] block mb-1.5">Street Address *</label><input className={INPUT} placeholder="123 Main Street, Apt 4B" value={ship.address} onChange={e => setS("address",e.target.value)} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-xs font-semibold text-[#475569] block mb-1.5">City *</label><input className={INPUT} placeholder="Karachi" value={ship.city} onChange={e => setS("city",e.target.value)} /></div>
                <div><label className="text-xs font-semibold text-[#475569] block mb-1.5">ZIP Code</label><input className={INPUT} placeholder="74000" value={ship.zip} onChange={e => setS("zip",e.target.value)} /></div>
                <div><label className="text-xs font-semibold text-[#475569] block mb-1.5">Country *</label>
                  <select className={INPUT} value={ship.country} onChange={e => setS("country",e.target.value)}>
                    {["Pakistan","United States","United Kingdom","India","UAE","Canada"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={() => setStep(2)} className="w-full py-4 bg-[#0f4c81] hover:bg-[#0a3560] text-white font-bold rounded-xl transition-colors mt-2">
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white border border-[#e2e5ea] rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-bold text-[#0f172a]">💳 Payment Method</h2>
              <div className="grid grid-cols-3 gap-3">
                {[["card","💳 Credit/Debit Card"],["cod","📦 Cash on Delivery"],["paypal","🅿️ PayPal"]].map(([v,l]) => (
                  <button key={v} onClick={() => setMethod(v)}
                    className={`p-4 border-2 rounded-xl text-center text-sm font-semibold transition-all ${method===v ? "border-[#0f4c81] bg-[#f0f4ff] text-[#0f4c81]" : "border-[#e2e5ea] text-[#475569] hover:border-[#0f4c81]/40"}`}>
                    {l}
                  </button>
                ))}
              </div>

              {method === "card" && (
                <div className="space-y-4 bg-[#f7f8fa] rounded-xl p-4">
                  <div><label className="text-xs font-semibold text-[#475569] block mb-1.5">Cardholder Name</label><input className={INPUT} placeholder="John Doe" value={pay.name} onChange={e => setP("name",e.target.value)} /></div>
                  <div><label className="text-xs font-semibold text-[#475569] block mb-1.5">Card Number</label><input className={INPUT} placeholder="4242 4242 4242 4242" maxLength={19} value={pay.card} onChange={e => setP("card",e.target.value.replace(/\D/g,"").replace(/(\d{4})/g,"$1 ").trim())} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-semibold text-[#475569] block mb-1.5">Expiry Date</label><input className={INPUT} placeholder="MM / YY" maxLength={7} value={pay.expiry} onChange={e => setP("expiry",e.target.value)} /></div>
                    <div><label className="text-xs font-semibold text-[#475569] block mb-1.5">CVV</label><input className={INPUT} type="password" placeholder="•••" maxLength={4} value={pay.cvv} onChange={e => setP("cvv",e.target.value)} /></div>
                  </div>
                </div>
              )}
              {method === "cod" && (
                <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 text-sm text-[#16a34a]">
                  ✅ You will pay in cash when the order is delivered to your address.
                </div>
              )}
              {method === "paypal" && (
                <button className="w-full py-3 bg-[#003087] text-white rounded-xl font-bold text-sm hover:bg-[#001f5c] transition-colors">
                  🅿️ Continue with PayPal
                </button>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="flex-1 py-3.5 border border-[#e2e5ea] text-[#475569] font-semibold rounded-xl hover:border-[#0f4c81] hover:text-[#0f4c81] transition-colors text-sm">← Back</button>
                <button onClick={() => setStep(3)} className="flex-1 py-3.5 bg-[#0f4c81] hover:bg-[#0a3560] text-white font-bold rounded-xl transition-colors text-sm">Review Order →</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="bg-white border border-[#e2e5ea] rounded-2xl p-6">
              <h2 className="text-lg font-bold text-[#0f172a] mb-5">✅ Review Order</h2>
              <div className="space-y-3 mb-5">
                {cart.map(i => (
                  <div key={i.id} className="flex items-center gap-3 py-2 border-b border-[#f1f5f9] last:border-0">
                    <img src={i.images?.[0] || i.image} alt={i.name} className="w-12 h-12 object-cover rounded-xl bg-[#f7f8fa]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0f172a] line-clamp-1">{i.name}</p>
                      <p className="text-xs text-[#94a3b8]">Qty: {i.qty}</p>
                    </div>
                    <p className="text-sm font-bold text-[#0f172a]">${(i.price*i.qty).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-[#f7f8fa] rounded-xl p-4 text-sm">
                  <p className="font-semibold text-[#0f172a] mb-2">📍 Shipping To</p>
                  <p className="text-[#475569]">{ship.firstName} {ship.lastName}</p>
                  <p className="text-[#475569]">{ship.address}</p>
                  <p className="text-[#475569]">{ship.city}, {ship.country}</p>
                </div>
                <div className="bg-[#f7f8fa] rounded-xl p-4 text-sm">
                  <p className="font-semibold text-[#0f172a] mb-2">💳 Payment</p>
                  <p className="text-[#475569] capitalize">{method === "card" ? `Card ending ****${pay.card.slice(-4)||"0000"}` : method === "cod" ? "Cash on Delivery" : "PayPal"}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3.5 border border-[#e2e5ea] text-[#475569] font-semibold rounded-xl hover:border-[#0f4c81] transition-colors text-sm">← Back</button>
                <button onClick={placeOrder} disabled={placing}
                  className="flex-1 py-3.5 bg-[#ff6b2b] hover:bg-[#e85a1a] text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 text-sm disabled:opacity-60">
                  {placing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      Placing Order...
                    </span>
                  ) : "🎉 Place Order"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar summary */}
        <div className="bg-white border border-[#e2e5ea] rounded-2xl p-5 h-fit sticky top-28">
          <h3 className="font-bold text-[#0f172a] mb-4 text-sm">Order Summary</h3>
          <div className="space-y-2.5 text-sm mb-4">
            {cart.map(i => (
              <div key={i.id} className="flex justify-between text-[#475569]">
                <span className="line-clamp-1 flex-1 pr-2">{i.name} ×{i.qty}</span>
                <span className="flex-shrink-0 font-medium">${(i.price*i.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#f1f5f9] pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-[#475569]"><span>Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
            <div className="flex justify-between text-[#475569]"><span>Shipping</span><span className={shipping===0?"text-[#16a34a] font-semibold":""}>{shipping===0?"FREE":`$${shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between text-[#475569]"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-[#0f172a] text-base border-t border-[#f1f5f9] pt-2 mt-2">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#f1f5f9] flex items-center gap-1.5 text-xs text-[#94a3b8]">
            <svg className="w-3.5 h-3.5 text-[#16a34a]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd"/></svg>
            Secured by 256-bit SSL encryption
          </div>
        </div>
      </div>
    </div>
  );
}