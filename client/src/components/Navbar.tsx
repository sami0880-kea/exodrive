import {
  User,
  Menu,
  X,
  Car,
  ChevronDown,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { NAV_ITEMS, LIGHT_BACKGROUND_PAGES } from "../constants";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button, Text } from "@radix-ui/themes";
import { useAuth } from "../context/AuthContext";
import AuthModals from "./auth/AuthModals";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const isDarkText = LIGHT_BACKGROUND_PAGES.includes(location.pathname);
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavLink = ({
    to,
    children,
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <RouterLink to={to}>
      <Text
        as="span"
        weight="medium"
        className={`relative py-2 ${
          !isDarkText
            ? isActive(to)
              ? "text-gray-900"
              : "text-gray-600"
            : isActive(to)
            ? "text-white"
            : "text-white/70"
        } hover:${
          !isDarkText ? "text-gray-900" : "text-white"
        } transition-colors duration-200`}
      >
        {children}
      </Text>
    </RouterLink>
  );

  return (
    <nav className={`absolute top-0 left-0 right-0 z-50 py-4`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between lg:justify-start">
          <div className="flex items-center flex-shrink-0 lg:w-1/3">
            <a href="/" className="flex items-center">
              <img
                className="h-14 w-auto"
                src={!isDarkText ? "/logo_dark.png" : "/logo_light.png"}
                alt="Logo"
              />
            </a>
          </div>

          <NavigationMenu.Root className="hidden lg:flex justify-center w-1/3">
            <NavigationMenu.List className="flex gap-6 list-none">
              {NAV_ITEMS.map((item, index) => (
                <NavigationMenu.Item key={index}>
                  <NavLink to={item.href}>{item.label}</NavLink>
                </NavigationMenu.Item>
              ))}
            </NavigationMenu.List>
          </NavigationMenu.Root>

          <div className="hidden lg:flex items-center gap-4 justify-end w-1/3">
            {user ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-2 !h-10 !m-0 !p-0 !px-2 focus:outline-none focus:ring-0 focus:ring-offset-0 active:bg-transparent data-[state=open]:bg-transparent ${
                      !isDarkText
                        ? "hover:bg-gray-100 text-gray-900"
                        : "hover:bg-white/10 text-white"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full  flex items-center justify-center flex-shrink-0 ${
                        !isDarkText
                          ? "bg-gray-500 text-white"
                          : "bg-white text-gray-900"
                      }`}
                    >
                      <Text className="font-medium text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </Text>
                    </div>
                    <Text
                      size="3"
                      weight="medium"
                      className={!isDarkText ? "text-gray-900" : "text-white"}
                    >
                      {user.name}
                    </Text>
                    <ChevronDown
                      size={14}
                      className={!isDarkText ? "text-gray-900" : "text-white"}
                    />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[180px] bg-white rounded-lg p-2 shadow-lg border border-gray-200"
                    sideOffset={8}
                  >
                    <DropdownMenu.Item
                      className="flex items-center gap-3 text-gray-700 hover:bg-gray-50 px-3 py-2.5 rounded-md cursor-pointer outline-none transition-colors"
                      onClick={() => navigate("/messages")}
                    >
                      <MessageCircle size={16} className="text-gray-500" />
                      <span className="font-medium">Mine Beskeder</span>
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
                    <DropdownMenu.Item
                      className="flex items-center gap-3 text-gray-700 hover:bg-gray-50 px-3 py-2.5 rounded-md cursor-pointer outline-none transition-colors"
                      onClick={logout}
                    >
                      <LogOut size={16} className="text-gray-500" />
                      <span className="font-medium">Log ud</span>
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <Button
                variant="ghost"
                className={`${
                  !isDarkText
                    ? "hover:bg-gray-100 text-gray-900"
                    : "hover:bg-white/10 text-white"
                }`}
                onClick={() => setAuthModalOpen(true)}
              >
                <Text className={!isDarkText ? "text-gray-900" : "text-white"}>
                  Log ind
                </Text>
                <User size={16} strokeWidth={2} className="ml-2" />
              </Button>
            )}
            <Button
              variant="solid"
              className="p-5"
              radius="full"
              onClick={() => {
                if (user) {
                  navigate("/sell");
                } else {
                  setAuthModalOpen(true);
                }
              }}
            >
              <Text className="text-white font-medium">Sælg din bil</Text>
            </Button>
          </div>

          <div className="flex lg:hidden">
            <Dialog.Root
              open={mobileDrawerOpen}
              onOpenChange={setMobileDrawerOpen}
            >
              <Dialog.Trigger asChild>
                <Button
                  variant="ghost"
                  className={`${
                    !isDarkText
                      ? "hover:bg-gray-100 text-gray-900"
                      : "hover:bg-white/10 text-white"
                  }`}
                >
                  {mobileDrawerOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/10" />
                <Dialog.Content
                  className="fixed right-0 top-0 z-20 w-full max-w-sm h-full p-6 bg-white shadow-xl"
                  aria-describedby={undefined}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex justify-end mb-8">
                      <Dialog.Close asChild>
                        <Button variant="ghost" className="hover:bg-gray-50">
                          <X size={24} />
                        </Button>
                      </Dialog.Close>
                    </div>
                    <div className="flex flex-col gap-6">
                      {NAV_ITEMS.map((item, index) => (
                        <div key={index} className="py-2">
                          <NavLink to={item.href}>{item.label}</NavLink>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col gap-4 mt-auto pt-8">
                      {user ? (
                        <>
                          <div className="flex items-center justify-between">
                            <Text>{user.name}</Text>
                          </div>
                          <Button
                            variant="ghost"
                            className="w-full hover:bg-gray-50 flex items-center justify-start gap-3"
                            onClick={() => {
                              navigate("/messages");
                              setMobileDrawerOpen(false);
                            }}
                          >
                            <MessageCircle
                              size={16}
                              className="text-gray-500"
                            />
                            <Text>Mine Beskeder</Text>
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full hover:bg-gray-50 flex items-center justify-start gap-3"
                            onClick={logout}
                          >
                            <LogOut size={16} className="text-gray-500" />
                            <Text>Log ud</Text>
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          className="w-full hover:bg-gray-50"
                          onClick={() => setAuthModalOpen(true)}
                        >
                          <Text>Log ind</Text>
                          <User size={16} strokeWidth={2} className="ml-2" />
                        </Button>
                      )}
                      <Button
                        variant="solid"
                        className="w-full transition-all duration-200 border-0 bg-red-500 hover:bg-red-600"
                        onClick={() => {
                          if (user) {
                            navigate("/sell");
                            setMobileDrawerOpen(false);
                          } else {
                            setMobileDrawerOpen(false);
                            setAuthModalOpen(true);
                          }
                        }}
                      >
                        <Car size={16} strokeWidth={2} className="mr-2" />
                        <Text className="text-white font-medium">
                          Sælg din bil
                        </Text>
                      </Button>
                    </div>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </div>

      <AuthModals
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
