// src/pages/AdminPanel.jsx
import { useState, useEffect, useRef } from "react";
import { useProducts } from "../Context/ProductContext";
import {
  Package,
  Image as ImageIcon,
  Grid3X3,
  TrendingUp,
  Menu,
  Gift,
  BookOpen,
  PlusCircle,
  Bell,
} from "lucide-react";

import ProductsManagement from "../components/admin/ProductsManagement";
import BannersManagement from "../components/admin/BannersManagement";
import CategoriesManagement from "../components/admin/CategoriesManagement";
import FeaturedManagement from "../components/admin/FeaturedManagement";
import SpecialOffersAdmin from "../components/admin/SpecialOffersAdmin";
import AdminCustomOrders from "../components/admin/AdminCustomOrders";
import AdminAddProduct from "../components/admin/AdminAddProduct";
import SubcategoriesManagement from "../components/admin/SubcategoriesManagement";
import Sidebar from "../components/admin/Sidebar";
import AdminNavbar from "../components/admin/AdminNavbar";
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

      {/* ADMIN NAVBAR */}
      <AdminNavbar
        customOrdersCount={customOrdersCount}
        recentOrders={recentOrders}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        showProfileDropdown={showProfileDropdown}
        setShowProfileDropdown={setShowProfileDropdown}
        profileRef={profileRef}
        handleTabChange={handleTabChange}
        logout={logout}
      />

      <div className="flex flex-1">

        {/* Sidebar Component */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
          menuItems={menuItems}
          logo={logo}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white md:ml-72 pt-16">
          <div className="md:hidden sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md p-4 flex items-center justify-between z-40 md:ml-72">
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