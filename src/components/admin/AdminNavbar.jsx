// src/components/admin/AdminNavbar.jsx
import React from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
} from "lucide-react";

export default function AdminNavbar({
  customOrdersCount,
  recentOrders,
  showNotifications,
  setShowNotifications,
  showProfileDropdown,
  setShowProfileDropdown,
  profileRef,
  handleTabChange,
  logout,
}) {
  return (
    <header className="hidden md:flex bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 w-full z-40">
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
  );
}
