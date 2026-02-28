// src/components/admin/Sidebar.jsx
import React from "react";
import { X } from "lucide-react";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  handleTabChange,
  menuItems,
  logo,
}) {
  return (
    <aside
      className={`
        fixed top-0 md:top-16 left-0 md:left-0 md:z-30
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
      </div>
    </aside>
  );
}
