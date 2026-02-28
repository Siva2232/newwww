// src/pages/AdminPanel.jsx
import { useState, useEffect, useRef } from "react";
import { useProducts } from "../Context/ProductContext";
import {
  Package,
  Image as ImageIcon,
  Grid3X3,
  TrendingUp,
  Menu,
  X,
  LogOut,
  Gift,
  BookOpen,
  PlusCircle,
  Bell,
  ChevronDown,
} from "lucide-react";

import ProductsManagement from "../components/admin/ProductsManagement";
import BannersManagement from "../components/admin/BannersManagement";
import CategoriesManagement from "../components/admin/CategoriesManagement";
import FeaturedManagement from "../components/admin/FeaturedManagement";
import SpecialOffersAdmin from "../components/admin/SpecialOffersAdmin";
import AdminCustomOrders from "../components/admin/AdminCustomOrders";
import AdminAddProduct from "../components/admin/AdminAddProduct";
import SubcategoriesManagement from "../components/admin/SubcategoriesManagement";
import logo from "../assets/hhhh.jpg";

// we'll fetch orders from the shared api helper
import { getCustomBookOrders as fetchOrdersFromApi } from "../api";

export default function AdminPanel() {
  const {
    products,
    heroBanners,
    shopCategories,
    shopSubCategories,
    trendingProductIds,
    logout,
    specialOffers,
  } = useProducts();

  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("adminActiveTab") ?? "products"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customOrdersCount, setCustomOrdersCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // backend may return either raw array or an object with {orders, pagination}
        const data = await fetchOrdersFromApi({ page: 1, limit: 5 });
        let orders = [];
        let total = 0;

        if (Array.isArray(data)) {
          orders = data;
          total = data.length;
        } else {
          orders = Array.isArray(data.orders) ? data.orders : [];
          total = data.pagination?.total ?? orders.length;
        }

        setCustomOrdersCount(total);
        setRecentOrders(orders);
      } catch (err) {
        console.error("Failed to fetch custom orders count", err);
      }
    };
    fetchOrders();

    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const specialOffersCount = specialOffers?.length || 0;

  const menuItems = [
    { id: "products", label: "Add Products", icon: Package, count: products.length },
    { id: "banners", label: "Main Banners", icon: ImageIcon, count: heroBanners.length },
    { id: "categories", label: "Main Categories", icon: Grid3X3, count: shopCategories.length },
    { id: "subcategories", label: "Sub Categories", icon: Grid3X3, count: shopSubCategories?.length || 0 },
    { id: "featured", label: "Featured Products", icon: TrendingUp, count: trendingProductIds.length },
    { id: "special-offers", label: "Special Offers", icon: Gift, count: specialOffersCount },
    { id: "add-product", label: "Add custom book products", icon: PlusCircle, count: null },
    { id: "custom-orders", label: "Custom Orders", icon: BookOpen, count: customOrdersCount },
  ];

  const currentItem = menuItems.find((item) => item.id === activeTab);

  const tabColors = {
    products: "amber",
    "add-product": "green",
    banners: "sky",
    categories: "purple",
    featured: "emerald",
    "special-offers": "orange",
    "custom-orders": "indigo",
  };

  const currentColor = tabColors[activeTab] || "gray";

  const getColorClasses = (name) => {
    const map = {
      amber: { icon: "text-amber-600", bg: "bg-amber-100", text: "text-amber-700" },
      green: { icon: "text-green-600", bg: "bg-green-100", text: "text-green-700" },
      sky: { icon: "text-sky-600", bg: "bg-sky-100", text: "text-sky-700" },
      purple: { icon: "text-purple-600", bg: "bg-purple-100", text: "text-purple-700" },
      emerald: { icon: "text-emerald-600", bg: "bg-emerald-100", text: "text-emerald-700" },
      orange: { icon: "text-orange-600", bg: "bg-orange-100", text: "text-orange-700" },
      indigo: { icon: "text-indigo-600", bg: "bg-indigo-100", text: "text-indigo-700" },
      gray: { icon: "text-gray-600", bg: "bg-gray-100", text: "text-gray-700" },
    };
    return map[name] || map.gray;
  };

  const handleTabChange = (id) => {
    setActiveTab(id);
    localStorage.setItem("adminActiveTab", id);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* DESKTOP TOP NAVBAR */}
      <header className="hidden md:flex bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="flex-1 px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Logo */}
            <div className="flex items-center gap-4">
              {/* <img 
                src={logo} 
                alt="Logo" 
                className="h-10 w-auto object-contain" 
              /> */}
              <span className="text-2xl font-semibold text-gray-800 ml-7">Admin Panel</span>
            </div>

            {/* Right - Notifications + Profile */}
            <div className="flex items-center gap-5">

              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition"
                >
                  <Bell size={22} />
                  {customOrdersCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                      <h3 className="font-bold text-gray-800">New Orders</h3>
                      <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 rounded-full">
                        {customOrdersCount} New
                      </span>
                    </div>
                    
                    <div className="max-h-[320px] overflow-y-auto">
                      {recentOrders.length > 0 ? (
                        recentOrders.map((order, i) => (
                          <div 
                            key={order._id || i}
                            onClick={() => {
                              handleTabChange("custom-orders");
                              setShowNotifications(false);
                            }}
                            className="p-4 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors group"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {order.customer?.name || "Customer"}
                              </span>
                              <div className="text-right">
                                <span className="block text-xs text-gray-500">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                                <span className="block text-xs text-gray-400">
                                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                            {/* ... rest of your order display content ... */}
                          </div>
                        ))
                      ) : (
                        <div className="p-10 text-center text-gray-500 text-sm">
                          No recent orders
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => {
                        handleTabChange("custom-orders");
                        setShowNotifications(false);
                      }}
                      className="w-full py-3 text-center text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition border-t border-gray-100"
                    >
                      View All Orders
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Button + Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-3 py-2 transition"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold shadow-sm">
                    A
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-gray-800 text-sm">Admin</span>
                    <span className="text-xs text-gray-500">Perfect Digital Press</span>
                  </div>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900">Admin User</p>
                      <p className="text-sm text-gray-500 truncate">admin@perfectdigitalpress.com</p>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to logout?")) {
                          logout();
                        }
                        setShowProfileDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-medium transition"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">

        {/* Sidebar - now sticky on desktop */}
        <aside
          className={`
            fixed md:sticky md:top-16 md:left-0 md:z-30
            w-72 bg-gradient-to-b from-gray-950 to-gray-900 text-white shadow-2xl
            h-screen md:h-[calc(100vh-4rem)] overflow-y-auto
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <div className="h-full flex flex-col">
            <div className="p-6 bg-white border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="h-20 w-55 rounded-xl bg-white object-contain shadow-sm" 
                />             
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-3">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`group w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive ? "bg-indigo-600 shadow-lg" : "hover:bg-gray-800"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full transition-colors ${
                        isActive
                          ? "bg-white text-indigo-600"
                          : "bg-gray-700 text-gray-300 group-hover:bg-indigo-500 group-hover:text-white"
                      }`}
                    >
                      <item.icon size={20} />
                    </div>
                    <span
                      className={`flex-1 font-medium transition-colors ${
                        isActive ? "text-white" : "text-gray-300 group-hover:text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.count !== null && item.count !== undefined && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full transition-colors ${
                          isActive
                            ? "bg-white text-indigo-600"
                            : "bg-gray-700 group-hover:bg-indigo-600 text-gray-300"
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* BOTTOM LOGOUT BUTTON REMOVED */}

          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
          <div className="md:hidden sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md p-4 flex items-center justify-between z-40">
            <div className="flex items-center gap-3">
               <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white rounded-full shadow hover:shadow-md transition">
                 <Menu size={26} className="text-indigo-600" />
               </button>
               <h2 className="font-bold text-xl">{currentItem?.label || "Admin"}</h2>
            </div>
            
            <button 
              onClick={() => handleTabChange("custom-orders")}
              className="relative p-2"
            >
               <Bell size={24} className="text-white" />
               {customOrdersCount > 0 && (
                 <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
               )}
            </button>
          </div>

          <div className="p-6 md:p-10 max-w-7xl mx-auto">
            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-7 gap-6 mb-8">
              <StatCard icon={Package} color="amber" count={products.length} label="Products" />
              <StatCard icon={ImageIcon} color="sky" count={heroBanners.length} label="Banners" />
              <StatCard icon={Grid3X3} color="purple" count={shopCategories.length} label="Categories" />
              <StatCard icon={Grid3X3} color="purple" count={shopSubCategories?.length || 0} label="Subcategories" />
              <StatCard icon={TrendingUp} color="emerald" count={trendingProductIds.length} label="Featured" />
              <StatCard icon={Gift} color="orange" count={specialOffersCount} label="Offers" />
              <StatCard icon={BookOpen} color="indigo" count={customOrdersCount} label="Custom Orders" />
            </div>

            {/* Page Title (Desktop) */}
            <div className="hidden md:flex items-center justify-between mb-10">
              <div className="flex items-end gap-5">
                {currentItem && (
                  <currentItem.icon size={48} className={`${getColorClasses(currentColor).icon}`} />
                )}
                <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">
                  {currentItem?.label || "Select a section"}
                </h1>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden min-h-[70vh]">
              <div className={activeTab === "products" ? "" : "hidden"}>
                <ProductsManagement />
              </div>
              <div className={activeTab === "add-product" ? "" : "hidden"}>
                <AdminAddProduct />
              </div>
              <div className={activeTab === "banners" ? "" : "hidden"}>
                <BannersManagement />
              </div>
              <div className={activeTab === "categories" ? "" : "hidden"}>
                <CategoriesManagement />
              </div>
              <div className={activeTab === "subcategories" ? "" : "hidden"}>
                <SubcategoriesManagement />
              </div>
              <div className={activeTab === "featured" ? "" : "hidden"}>
                <FeaturedManagement />
              </div>
              <div className={activeTab === "special-offers" ? "" : "hidden"}>
                <SpecialOffersAdmin />
              </div>
              <div className={activeTab === "custom-orders" ? "" : "hidden"}>
                <AdminCustomOrders />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Reusable Stat Card (unchanged)
function StatCard({ icon: Icon, color, count, label }) {
  const colorMap = {
    amber: { bg: "bg-amber-100", icon: "text-amber-600", text: "text-amber-700" },
    sky: { bg: "bg-sky-100", icon: "text-sky-600", text: "text-sky-700" },
    purple: { bg: "bg-purple-100", icon: "text-purple-600", text: "text-purple-700" },
    emerald: { bg: "bg-emerald-100", icon: "text-emerald-600", text: "text-emerald-700" },
    orange: { bg: "bg-orange-100", icon: "text-orange-600", text: "text-orange-700" },
    indigo: { bg: "bg-indigo-100", icon: "text-indigo-600", text: "text-indigo-700" },
    green: { bg: "bg-green-100", icon: "text-green-600", text: "text-green-700" },
    gray: { bg: "bg-gray-100", icon: "text-gray-600", text: "text-gray-700" },
  };
  const c = colorMap[color] || colorMap.gray;
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition">
      <div className={`mx-auto mb-2 flex items-center justify-center w-10 h-10 rounded-full ${c.bg}`}>
        <Icon className={`${c.icon} w-5 h-5`} />
      </div>
      <p className={`${c.text} text-2xl font-bold leading-tight`}>{count}</p>
      <p className="text-xs font-medium text-gray-500">{label}</p>
    </div>
  );
}