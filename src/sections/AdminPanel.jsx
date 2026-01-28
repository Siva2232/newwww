// src/pages/AdminPanel.jsx (Improved UI - Modern, Premium & Responsive)
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
} from "lucide-react";

import ProductsManagement from "../components/admin/ProductsManagement";
import BannersManagement from "../components/admin/BannersManagement";
import CategoriesManagement from "../components/admin/CategoriesManagement";
import FeaturedManagement from "../components/admin/FeaturedManagement";

export default function AdminPanel() {
  const {
    products,
    heroBanners,
    shopCategories,
    trendingProductIds,
    logout,
  } = useProducts();

  const [activeTab, setActiveTab] = useState("products");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: "products", label: "Products", icon: Package, count: products.length },
    { id: "banners", label: "Hero Banners", icon: ImageIcon, count: heroBanners.length },
    { id: "categories", label: "Shop Categories", icon: Grid3X3, count: shopCategories.length },
    { id: "featured", label: "Featured Products", icon: TrendingUp, count: trendingProductIds.length },
  ];

  const currentItem = menuItems.find((item) => item.id === activeTab);

  const tabColors = {
    products: "amber",
    banners: "sky",
    categories: "purple",
    featured: "emerald",
  };

  const currentColor = tabColors[activeTab] || "gray";

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
                  setSidebarOpen(false);
                }}
                className={`group w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-amber-600 text-white shadow-lg"
                    : "hover:bg-gray-800"
                }`}
              >
                <item.icon
                  size={22}
                  className={`transition-colors ${
                    activeTab === item.id
                      ? "text-amber-200"
                      : "text-gray-400 group-hover:text-amber-400"
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
                  {item.count !== undefined && (
                    <span
                      className={`text-xs px-3 py-1 rounded-full transition-colors ${
                        activeTab === item.id
                          ? "bg-amber-700"
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

          {/* User Profile & Logout */}
          <div className="p-6 border-t border-gray-800 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-xl shadow-md">
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
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 bg-white shadow-md p-4 flex items-center justify-between z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu size={26} />
          </button>
          <h2 className="font-bold text-xl">{currentItem?.label}</h2>
          <div className="w-10" />
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {/* Stats Row */}
   <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
  {/* Products */}
  <div className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition">
    <div className="mx-auto mb-2 flex items-center justify-center w-10 h-10 rounded-full bg-amber-100">
      <Package className="w-5 h-5 text-amber-600" />
    </div>
    <p className="text-2xl font-bold text-amber-700 leading-tight">
      {products.length}
    </p>
    <p className="text-xs font-medium text-gray-500">
      Products
    </p>
  </div>

  {/* Banners */}
  <div className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition">
    <div className="mx-auto mb-2 flex items-center justify-center w-10 h-10 rounded-full bg-sky-100">
      <ImageIcon className="w-5 h-5 text-sky-600" />
    </div>
    <p className="text-2xl font-bold text-sky-700 leading-tight">
      {heroBanners.length}
    </p>
    <p className="text-xs font-medium text-gray-500">
      Banners
    </p>
  </div>

  {/* Categories */}
  <div className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition">
    <div className="mx-auto mb-2 flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
      <Grid3X3 className="w-5 h-5 text-purple-600" />
    </div>
    <p className="text-2xl font-bold text-purple-700 leading-tight">
      {shopCategories.length}
    </p>
    <p className="text-xs font-medium text-gray-500">
      Categories
    </p>
  </div>

  {/* Featured */}
  <div className="bg-white rounded-lg shadow-sm p-4 text-center hover:shadow-md transition">
    <div className="mx-auto mb-2 flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100">
      <TrendingUp className="w-5 h-5 text-emerald-600" />
    </div>
    <p className="text-2xl font-bold text-emerald-700 leading-tight">
      {trendingProductIds.length}
    </p>
    <p className="text-xs font-medium text-gray-500">
      Featured
    </p>
  </div>
</div>


          {/* Page Title (Desktop) */}
          <div className="hidden md:flex items-end gap-5 mb-10">
            {currentItem && (
              <currentItem.icon size={48} className={`text-${currentColor}-600`} />
            )}
            <h1 className="text-4xl font-extrabold text-gray-800">
              {currentItem?.label}
            </h1>
          </div>

          {/* Tab Contents */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {activeTab === "products" && <ProductsManagement />}
            {activeTab === "banners" && <BannersManagement />}
            {activeTab === "categories" && <CategoriesManagement />}
            {activeTab === "featured" && <FeaturedManagement />}
          </div>
        </div>
      </main>
    </div>
  );
}