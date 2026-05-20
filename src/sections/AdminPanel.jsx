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
  LayoutDashboard,
} from "lucide-react";

import AdminDashboard from "../components/admin/AdminDashboard";
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
import AdminDataLoader from "../components/admin/AdminDataLoader";
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
    bestSellerProductIds,
    logout,
    specialOffers,
    catalogLoading,
  } = useProducts();

  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("adminActiveTab") ?? "dashboard"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem("adminSidebarCollapsed") === "true"
  );
  const [customOrdersCount, setCustomOrdersCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
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
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();

    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const adminDataReady = !catalogLoading && !ordersLoading;

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

  const dashboardStats = {
    products: products.length,
    banners: heroBanners.length,
    categories: shopCategories.length,
    subcategories: shopSubCategories?.length || 0,
    featured: trendingProductIds.length,
    "special-offers": specialOffersCount,
    "custom-orders": customOrdersCount,
  };

  const countOrNull = (n) => (adminDataReady ? n : null);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, count: null, section: "Overview" },
    { id: "products", label: "Products", icon: Package, count: countOrNull(products.length), section: "Catalog" },
    { id: "categories", label: "Categories", icon: Grid3X3, count: countOrNull(shopCategories.length), section: "Catalog" },
    { id: "subcategories", label: "Subcategories", icon: Grid3X3, count: countOrNull(shopSubCategories?.length || 0), section: "Catalog" },
    { id: "add-product", label: "Custom Books", icon: PlusCircle, count: null, section: "Catalog" },
    { id: "banners", label: "Banners", icon: ImageIcon, count: countOrNull(heroBanners.length), section: "Marketing" },
    { id: "featured", label: "Featured", icon: TrendingUp, count: countOrNull(trendingProductIds.length), section: "Marketing" },
    { id: "special-offers", label: "Special Offers", icon: Gift, count: countOrNull(specialOffersCount), section: "Marketing" },
    { id: "custom-orders", label: "Custom Orders", icon: BookOpen, count: countOrNull(customOrdersCount), section: "Orders" },
  ];

  const currentItem = menuItems.find((item) => item.id === activeTab);

  const tabColors = {
    dashboard: "indigo",
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

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("adminSidebarCollapsed", String(next));
      return next;
    });
  };

  const renderActivePanel = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <AdminDashboard
            stats={dashboardStats}
            onNavigate={handleTabChange}
            recentOrders={recentOrders}
            products={products}
            bestSellerCount={bestSellerProductIds?.length || 0}
          />
        );
      case "products":
        return <ProductsManagement />;
      case "add-product":
        return <AdminAddProduct />;
      case "banners":
        return <BannersManagement />;
      case "categories":
        return <CategoriesManagement />;
      case "subcategories":
        return <SubcategoriesManagement />;
      case "featured":
        return <FeaturedManagement />;
      case "special-offers":
        return <SpecialOffersAdmin />;
      case "custom-orders":
        return <AdminCustomOrders />;
      default:
        return (
          <AdminDashboard
            stats={dashboardStats}
            onNavigate={handleTabChange}
            recentOrders={recentOrders}
            products={products}
            bestSellerCount={bestSellerProductIds?.length || 0}
          />
        );
    }
  };

  const isDashboard = activeTab === "dashboard";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* ADMIN NAVBAR */}
      <AdminNavbar
        logo={logo}
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
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />

        {/* Main Content */}
        <main
          className={`flex-1 overflow-y-auto bg-slate-50 pt-0 md:pt-[5.25rem] transition-[margin] duration-300 ease-out ${
            sidebarCollapsed ? "md:ml-[4.5rem]" : "md:ml-72"
          }`}
        >
          <div className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
               <button
                 type="button"
                 onClick={() => setSidebarOpen(true)}
                 className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition"
                 aria-label="Open menu"
               >
                 <Menu size={22} />
               </button>
               <h2 className="font-bold text-slate-800 truncate">{currentItem?.label || "Dashboard"}</h2>
            </div>
            
            <button
              type="button"
              onClick={() => handleTabChange("custom-orders")}
              className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            >
               <Bell size={22} />
               {customOrdersCount > 0 && (
                 <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
               )}
            </button>
          </div>

          <div className="p-6 md:p-10 max-w-7xl mx-auto">
            {!isDashboard && (
              <div className="hidden md:flex items-center justify-between mb-8">
                <div className="flex items-end gap-5">
                  {currentItem && (
                    <currentItem.icon size={48} className={`${getColorClasses(currentColor).icon}`} />
                  )}
                  <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">
                    {currentItem?.label || "Admin"}
                  </h1>
                </div>
              </div>
            )}

            <div
              className={
                isDashboard
                  ? "min-h-[70vh]"
                  : "bg-white rounded-2xl shadow-lg overflow-hidden min-h-[70vh]"
              }
            >
              {!adminDataReady ? (
                <AdminDataLoader />
              ) : (
                renderActivePanel()
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}