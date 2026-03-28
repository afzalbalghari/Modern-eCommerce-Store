import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD": {
      const ex = state.items.find(i => i.id === action.payload.id);
      const items = ex
        ? state.items.map(i => i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i)
        : [...state.items, { ...action.payload, qty: 1 }];
      return { ...state, items };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case "UPDATE_QTY":
      return { ...state, items: state.items.map(i => i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i) };
    case "CLEAR":
      return { ...state, items: [] };
    default: return state;
  }
};

const AuthContext = createContext();

export function AppProvider({ children }) {
  const saved = JSON.parse(localStorage.getItem("cart") || "[]");
  const [state, dispatch] = useReducer(cartReducer, { items: saved });
  const [user, setUser] = useReducer((s, a) => a, JSON.parse(localStorage.getItem("user") || "null"));

  useEffect(() => { localStorage.setItem("cart", JSON.stringify(state.items)); }, [state.items]);

  const addToCart    = p  => dispatch({ type: "ADD", payload: p });
  const removeFromCart = id => dispatch({ type: "REMOVE", payload: id });
  const updateQty    = (id, qty) => qty < 1 ? dispatch({ type: "REMOVE", payload: id }) : dispatch({ type: "UPDATE_QTY", payload: { id, qty } });
  const clearCart    = () => dispatch({ type: "CLEAR" });

  const totalItems = state.items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = state.items.reduce((s, i) => s + i.price * i.qty, 0);

  const login = (userData, token) => {
    const u = { ...userData, token };
    localStorage.setItem("user", JSON.stringify(u));
    localStorage.setItem("token", token);
    setUser(u);
  };
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <CartContext.Provider value={{ cart: state.items, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}>
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
export const useAuth = () => useContext(AuthContext);