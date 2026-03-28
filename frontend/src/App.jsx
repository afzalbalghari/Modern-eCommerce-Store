import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar   from "./components/Navbar";
import Footer   from "./components/Footer";
import Home     from "./pages/Home";


export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#f7f8fa]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/"              element={<Home />} />
              
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}