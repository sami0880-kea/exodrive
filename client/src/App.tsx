import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Theme } from "@radix-ui/themes";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import { ToastProvider } from "@radix-ui/react-toast";

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
              </Routes>
            </div>
          </ToastProvider>
        </AuthProvider>
      </Theme>
    </Router>
  );
}

export default App;
