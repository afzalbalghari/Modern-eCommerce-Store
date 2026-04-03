import { createContext, useContext, useReducer, useEffect, useState, useCallback } from "react";
import { authAPI } from "../services/api";

// ── Cart ──────────────────────────────────────────────────
const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD": {
      const ex = state.items.find(i => i._id === action.payload._id);
      const items = ex
        ? state.items.map(i => i._id === action.payload._id ? { ...i, qty: i.qty + 1 } : i)
        : [...state.items, { ...action.payload, qty: 1 }];
      return { ...state, items };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter(i => i._id !== action.payload) };
    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items.map(i =>
          i._id === action.payload.id ? { ...i, qty: action.payload.qty } : i
        ),
      };
    case "CLEAR":
      return { ...state, items: [] };
    default:
      return state;
  }
};

// ── Auth ──────────────────────────────────────────────────
const AuthContext = createContext();

// ── Toast ─────────────────────────────────────────────────
const ToastContext = createContext();

export function AppProvider({ children }) {
  // ── Cart state ─────────────────────────────────────────
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); }
    catch { return []; }
  })();
  const [cartState, dispatch] = useReducer(cartReducer, { items: saved });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartState.items));
  }, [cartState.items]);

  const addToCart      = p    => dispatch({ type: "ADD",        payload: p });
  const removeFromCart = id   => dispatch({ type: "REMOVE",     payload: id });
  const updateQty      = (id, qty) =>
    qty < 1
      ? dispatch({ type: "REMOVE",     payload: id })
      : dispatch({ type: "UPDATE_QTY", payload: { id, qty } });
  const clearCart      = ()   => dispatch({ type: "CLEAR" });

  const totalItems = cartState.items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cartState.items.reduce((s, i) => s + i.price * i.qty, 0);

  // ── Auth state ─────────────────────────────────────────
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  });
  const [authLoading, setAuthLoading] = useState(false);

  // Re-validate token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || user) return;
    authAPI.getMe()
      .then(res => setUser(res.data.data))
      .catch(() => { localStorage.removeItem("token"); localStorage.removeItem("user"); });
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };
  const logout = async () => {
    try { await authAPI.logout(); } catch (_) {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ── Toast state ────────────────────────────────────────
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  const removeToast = id => setToasts(t => t.filter(x => x.id !== id));

  return (
    <ToastContext.Provider value={{ addToast }}>
      <AuthContext.Provider value={{ user, login, logout, authLoading, setAuthLoading }}>
        <CartContext.Provider value={{
          cart: cartState.items,
          addToCart, removeFromCart, updateQty, clearCart,
          totalItems, totalPrice,
        }}>
          {children}

          {/* Global Toast UI */}
          <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm">
            {toasts.map(t => (
              <div key={t.id}
                onClick={() => removeToast(t.id)}
                className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium cursor-pointer animate-slideDown
                  ${t.type === "success" ? "bg-[#16a34a]"
                    : t.type === "error"   ? "bg-[#dc2626]"
                    : t.type === "warning" ? "bg-amber-500"
                    : "bg-[#0f4c81]"}`}>
                <span className="mt-0.5 flex-shrink-0">
                  {t.type === "success" ? "✓" : t.type === "error" ? "✗" : t.type === "warning" ? "⚠" : "ℹ"}
                </span>
                <span>{t.message}</span>
              </div>
            ))}
          </div>
        </CartContext.Provider>
      </AuthContext.Provider>
    </ToastContext.Provider>
  );
}

export const useCart    = () => useContext(CartContext);
export const useAuth    = () => useContext(AuthContext);
export const useToast   = () => useContext(ToastContext);