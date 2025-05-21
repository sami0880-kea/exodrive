import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Theme } from "@radix-ui/themes";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import { ToastProvider } from "@radix-ui/react-toast";
import Sell from "./pages/Sell";
import Listings from "./pages/Listings";
import ListingDetails from "./pages/ListingDetails";

function App() {
  return (
    <Router>
      <Theme>
        <AuthProvider>
          <ToastProvider swipeDirection="right">
            <div className="min-h-screen bg-[#f8f9fd]">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/sell" element={<Sell />} />
                <Route path="/listings" element={<Listings />} />
                <Route path="/listings/:id" element={<ListingDetails />} />
              </Routes>
            </div>
          </ToastProvider>
        </AuthProvider>
      </Theme>
    </Router>
  );
}

export default App;
