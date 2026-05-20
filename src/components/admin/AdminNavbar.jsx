import {
  Bell,
  ChevronDown,
  LogOut,
  Shield,
  Package,
  Sparkles,
} from "lucide-react";

function formatOrderDate(dateStr) {
  if (!dateStr) return { date: "—", time: "" };
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    time: d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function AdminNavbar({
  logo,
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
  const orderCount = customOrdersCount || 0;

  return (
    <header className="hidden md:block fixed top-0 left-0 right-0 z-40">
      {/* Accent line */}
      {/* <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-500" /> */}

      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-sm shadow-slate-200/50">
        <div className="h-20 px-5 lg:px-8 flex items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
              {logo ? (
                <img
                  src={logo}
                  alt="Logo"
                  className="h-14 w-auto max-w-[220px] object-contain"
                />
              ) : (
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <Sparkles className="text-white" size={24} />
                </div>
              )}
            </div>
            <div className="hidden xl:block border-l border-slate-200 pl-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600">
                Admin Console
              </p>
              <p className="text-base font-bold text-slate-800 leading-tight">
                Perfect Digital Press
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Store management dashboard</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Orders shortcut */}
            <button
              type="button"
              onClick={() => handleTabChange("custom-orders")}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-all"
            >
              <Package size={18} className="text-indigo-600" />
              Orders
              {orderCount > 0 && (
                <span className="ml-1 min-w-[1.25rem] px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold text-center">
                  {orderCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileDropdown(false);
                }}
                className={`
                  relative p-3 rounded-xl border transition-all duration-200
                  ${
                    showNotifications
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-inner"
                      : "bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-600"
                  }
                `}
                aria-label="Notifications"
              >
                <Bell size={20} strokeWidth={2} />
                {orderCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {orderCount > 9 ? "9+" : orderCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-[340px] rounded-2xl bg-white shadow-2xl shadow-slate-300/40 border border-slate-200/80 overflow-hidden">
                  <div className="px-5 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-indigo-100">Inbox</p>
                        <h3 className="text-lg font-bold">Custom Orders</h3>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm">
                        {orderCount} total
                      </span>
                    </div>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order, i) => {
                        const { date, time } = formatOrderDate(order.createdAt);
                        return (
                          <button
                            type="button"
                            key={order._id || i}
                            onClick={() => {
                              handleTabChange("custom-orders");
                              setShowNotifications(false);
                            }}
                            className="w-full text-left px-5 py-3.5 hover:bg-slate-50 border-b border-slate-100 transition group"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800 text-sm truncate group-hover:text-indigo-700">
                                  {order.customer?.name || order.customerName || "New customer"}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5 capitalize">
                                  {order.status || "pending"}
                                </p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-xs font-medium text-slate-600">{date}</p>
                                <p className="text-[11px] text-slate-400">{time}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="py-12 px-6 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                          <Bell className="text-slate-400" size={22} />
                        </div>
                        <p className="text-sm font-medium text-slate-600">No orders yet</p>
                        <p className="text-xs text-slate-400 mt-1">New custom book orders appear here</p>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleTabChange("custom-orders");
                      setShowNotifications(false);
                    }}
                    className="w-full py-3.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50 border-t border-slate-100 transition"
                  >
                    View all orders →
                  </button>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="w-px h-10 bg-slate-200 hidden sm:block" />

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown);
                  setShowNotifications(false);
                }}
                className={`
                  flex items-center gap-3 pl-2 pr-3 py-2 rounded-2xl border transition-all duration-200
                  ${
                    showProfileDropdown
                      ? "bg-indigo-50 border-indigo-200 shadow-sm"
                      : "bg-white border-slate-200 hover:border-indigo-200 hover:shadow-md"
                  }
                `}
              >
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200/60">
                    A
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                </div>
                <div className="hidden lg:flex flex-col items-start text-left">
                  <span className="text-sm font-bold text-slate-800 leading-none">Admin</span>
                  <span className="text-[11px] text-slate-500 mt-1">Store manager</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform hidden lg:block ${
                    showProfileDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white shadow-2xl shadow-slate-300/40 border border-slate-200/80 overflow-hidden">
                  <div className="px-5 py-4 bg-gradient-to-br from-slate-50 to-indigo-50/80 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
                        A
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">Admin User</p>
                        <p className="text-xs text-slate-500 truncate">admin@ppdo.shop</p>
                      </div>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold">
                      <Shield size={12} />
                      Authenticated
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Are you sure you want to logout?")) {
                          logout();
                        }
                        setShowProfileDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
                    >
                      <span className="p-2 rounded-lg bg-rose-100">
                        <LogOut size={18} />
                      </span>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
