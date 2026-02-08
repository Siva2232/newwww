// src/pages/AdminPanel.jsx
import { useState } from "react";
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
  PlusCircle,           // ← new icon for "Add Product"
} from "lucide-react";

import ProductsManagement from "../components/admin/ProductsManagement";
import BannersManagement from "../components/admin/BannersManagement";
import CategoriesManagement from "../components/admin/CategoriesManagement";
import FeaturedManagement from "../components/admin/FeaturedManagement";
import SpecialOffersAdmin from "../components/admin/SpecialOffersAdmin";
import AdminCustomOrders from "../components/admin/AdminCustomOrders";     // ← your orders list + modal
import AdminAddProduct from "../components/admin/AdminAddProduct";       // ← add/edit product form

export default function AdminPanel() {
  const {
    products,
    heroBanners,
    shopCategories,
    trendingProductIds,
    logout,
    specialOffers,
  } = useProducts();

  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("adminActiveTab") || "products"
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const specialOffersCount = specialOffers?.length || 0;

  const menuItems = [
    { id: "products", label: "Products", icon: Package, count: products.length },
    { id: "add-product", label: "Add Product", icon: PlusCircle, count: null }, // ← NEW
    { id: "banners", label: "Hero Banners", icon: ImageIcon, count: heroBanners.length },
    { id: "categories", label: "Shop Categories", icon: Grid3X3, count: shopCategories.length },
    { id: "featured", label: "Featured Products", icon: TrendingUp, count: trendingProductIds.length },
    { id: "special-offers", label: "Special Offers", icon: Gift, count: specialOffersCount },
    { id: "custom-orders", label: "Custom Orders", icon: BookOpen, count: "New" }, // ← renamed & used
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
      amber: { icon: 'text-amber-600', bg: 'bg-amber-100', text: 'text-amber-700' },
      green: { icon: 'text-green-600', bg: 'bg-green-100', text: 'text-green-700' },
      sky: { icon: 'text-sky-600', bg: 'bg-sky-100', text: 'text-sky-700' },
      purple: { icon: 'text-purple-600', bg: 'bg-purple-100', text: 'text-purple-700' },
      emerald: { icon: 'text-emerald-600', bg: 'bg-emerald-100', text: 'text-emerald-700' },
      orange: { icon: 'text-orange-600', bg: 'bg-orange-100', text: 'text-orange-700' },
      indigo: { icon: 'text-indigo-600', bg: 'bg-indigo-100', text: 'text-indigo-700' },
      gray: { icon: 'text-gray-600', bg: 'bg-gray-100', text: 'text-gray-700' },
    };
    return map[name] || map.gray;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-gray-950 to-gray-900 text-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Perfect Digital Press
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  localStorage.setItem("adminActiveTab", item.id);
                  setSidebarOpen(false);
                }}
                className={`group w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "hover:bg-gray-800"
                }`}
              >
                <item.icon
                  size={22}
                  className={`transition-colors ${
                    activeTab === item.id
                      ? "text-indigo-200"
                      : "text-gray-400 group-hover:text-indigo-400"
                  }`}
                />
                <div className="flex-1 flex items-center justify-between">
                  <span
                    className={`font-medium transition-colors ${
                      activeTab === item.id ? "" : "group-hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.count !== null && item.count !== undefined && (
                    <span
                      className={`text-xs px-3 py-1 rounded-full transition-colors ${
                        activeTab === item.id
                          ? "bg-indigo-700"
                          : "bg-gray-700 group-hover:bg-gray-600"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-gray-800 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-xl shadow-md">
                A
              </div>
              <div>
                <p className="font-semibold text-lg">Admin</p>
                <p className="text-sm text-gray-400">Perfect Digital Press</p>
              </div>
            </div>

            <button
              onClick={() => window.confirm("Are you sure you want to logout?") && logout()}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-red-600 hover:bg-red-700 rounded-xl font-medium transition shadow-md"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="md:hidden sticky top-0 bg-white shadow-md p-4 flex items-center justify-between z-40">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Menu size={26} />
          </button>
          <h2 className="font-bold text-xl">{currentItem?.label}</h2>
          <div className="w-10" />
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
            <StatCard icon={Package} color="amber" count={products.length} label="Products" />
            <StatCard icon={ImageIcon} color="sky" count={heroBanners.length} label="Banners" />
            <StatCard icon={Grid3X3} color="purple" count={shopCategories.length} label="Categories" />
            <StatCard icon={TrendingUp} color="emerald" count={trendingProductIds.length} label="Featured" />
            <StatCard icon={Gift} color="orange" count={specialOffersCount} label="Offers" />
            <StatCard icon={BookOpen} color="indigo" count="?" label="Custom Orders" />
          </div>

          {/* Page Title (Desktop) */}
          <div className="hidden md:flex items-end gap-5 mb-10">
            {currentItem && (
              <currentItem.icon size={48} className={getColorClasses(currentColor).icon} />
            )}
            <h1 className="text-4xl font-extrabold text-gray-800">{currentItem?.label}</h1>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden min-h-[70vh]">
            {activeTab === "products" && <ProductsManagement />}
            {activeTab === "add-product" && <AdminAddProduct />}
            {activeTab === "banners" && <BannersManagement />}
            {activeTab === "categories" && <CategoriesManagement />}
            {activeTab === "featured" && <FeaturedManagement />}
            {activeTab === "special-offers" && <SpecialOffersAdmin />}
            {activeTab === "custom-orders" && <AdminCustomOrders />}
          </div>
        </div>
      </main>
    </div>
  );
}

// Reusable Stat Card
function StatCard({ icon: Icon, color, count, label }) {
  const colorMap = {
    amber: { bg: 'bg-amber-100', icon: 'text-amber-600', text: 'text-amber-700' },
    sky: { bg: 'bg-sky-100', icon: 'text-sky-600', text: 'text-sky-700' },
    purple: { bg: 'bg-purple-100', icon: 'text-purple-600', text: 'text-purple-700' },
    emerald: { bg: 'bg-emerald-100', icon: 'text-emerald-600', text: 'text-emerald-700' },
    orange: { bg: 'bg-orange-100', icon: 'text-orange-600', text: 'text-orange-700' },
    indigo: { bg: 'bg-indigo-100', icon: 'text-indigo-600', text: 'text-indigo-700' },
    green: { bg: 'bg-green-100', icon: 'text-green-600', text: 'text-green-700' },
    gray: { bg: 'bg-gray-100', icon: 'text-gray-600', text: 'text-gray-700' },
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