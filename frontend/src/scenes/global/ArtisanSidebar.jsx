import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Heart,
  Star,
  ShoppingBag,
  Menu,
  X,
  LogOut,
  Package,
} from "lucide-react";
import { Box, useMediaQuery, useTheme } from "@mui/material";

function ArtisanSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const theme = useTheme();
  // Check if the screen size is below the 'lg' breakpoint (mobile)
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  // Force the sidebar to be open if it's not mobile
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/artisan-dashboard" },
    { icon: Package, label: "Products", path: "/my-products" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: Star, label: "Reviews", path: "/reviews" },
    { icon: ShoppingBag, label: "Orders", path: "/orders" },
  ];

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div>
      {/* Mobile toggle button (only visible on mobile) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle Sidebar"
        className="lg:hidden fixed top-4 right-4 z-50 bg-[#FFB636] p-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#FFB636]"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-white border-r border-gray-200 shadow-lg z-40`}
      >
        {/* Header with Logo and User Avatar */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={user.profilePicture ?? "../../public/default.png"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <Box
              component="img"
              src="../../public/logo.png"
              alt="logo image"
              sx={{
                width: "70%",
                height: "auto",
                borderRadius: "50%",
                cursor: "pointer",
              }}
              onClick={() => {
                window.location.href = "/";
              }}
            />
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close Sidebar"
            className="lg:hidden text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFB636]"
          >
            <X size={24} />
          </button>
        </div>

        {/* User Info Section */}
        <div className="px-6 py-4 border-b border-gray-200">
          <p className="text-lg font-semibold text-gray-800">
            Welcome, {user.name}
          </p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-6 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-4 py-3 mb-2 transition-colors duration-200 rounded-lg ${
                  isActive
                    ? "bg-[#FFF8E7] text-[#FFB636] font-semibold border-l-4 border-[#FFB636]"
                    : "text-gray-600 hover:bg-[#FFF8E7] hover:text-[#FFB636]"
                }`}
              >
                <item.icon size={20} className="flex-shrink-0" />
                <span className="ml-4">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer: Logout Button */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            className="w-full flex items-center px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 rounded-lg"
            onClick={handleLogout}
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className="ml-4">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArtisanSidebar;
