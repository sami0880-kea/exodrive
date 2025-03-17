import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "../constants";
import { Button } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <a href="/">
              <img className="h-10 mr-2" src="/logo_light.png" alt="Logo" />
            </a>
          </div>
          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className={`relative py-2 transition-colors duration-300 hover:text-red-500
                    ${isActive(item.href) ? "text-red-500" : "text-white"}
                  `}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform origin-bottom scale-x-0 transition-transform duration-300
                      ${isActive(item.href) ? "scale-x-100" : ""}
                    `}
                  />
                </Link>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex justify-center space-x-12 items-center">
            <Button
              bgGradient="to-r"
              gradientFrom="red.700"
              gradientTo="red.700"
              color="white"
              className="px-2"
              stroke="red.300"
              strokeWidth={2}
            >
              Indhendt tilbud
            </Button>
          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  <Link
                    to={item.href}
                    className={`relative py-2 transition-colors duration-300 hover:text-red-500
                      ${isActive(item.href) ? "text-red-500" : "text-white"}
                    `}
                  >
                    {item.label}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform origin-bottom scale-x-0 transition-transform duration-300
                        ${isActive(item.href) ? "scale-x-100" : ""}
                      `}
                    />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex space-x-6">
              <Button variant="surface" className="px-2">
                Indhendt tilbud
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
