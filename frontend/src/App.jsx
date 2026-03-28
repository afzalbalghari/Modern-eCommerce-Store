import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar   from "./components/Navbar";
import Footer   from "./components/Footer";
import Home     from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart     from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login    from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"              element={<Home />} />
              <Route path="/products"      element={<Products />} />
              <Route path="/product/:id"   element={<ProductDetails />} />
              <Route path="/cart"          element={<Cart />} />
              <Route path="/checkout"      element={<Checkout />} />
              <Route path="/login"         element={<Login />} />
              <Route path="/register"      element={<Register />} />
              <Route path="/dashboard"     element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}