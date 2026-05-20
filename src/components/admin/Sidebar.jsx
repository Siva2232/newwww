import { X, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

const itemAccent = {
  dashboard: "indigo",
  products: "amber",
  banners: "sky",
  categories: "violet",
  subcategories: "purple",
  featured: "emerald",
  "special-offers": "orange",
  "add-product": "teal",
  "custom-orders": "rose",
};

const accentStyles = {
  indigo: {
    active: "bg-indigo-50 text-indigo-700 border-indigo-500",
    iconActive: "bg-indigo-600 text-white shadow-indigo-200 shadow-md",
    icon: "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
    badge: "bg-indigo-100 text-indigo-700",
  },
  amber: {
    active: "bg-amber-50 text-amber-900 border-amber-500",
    iconActive: "bg-amber-500 text-white shadow-amber-200 shadow-md",
    icon: "bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
    badge: "bg-amber-100 text-amber-800",
  },
  sky: {
    active: "bg-sky-50 text-sky-800 border-sky-500",
    iconActive: "bg-sky-500 text-white shadow-sky-200 shadow-md",
    icon: "bg-sky-100 text-sky-600 group-hover:bg-sky-500 group-hover:text-white",
    badge: "bg-sky-100 text-sky-700",
  },
  violet: {
    active: "bg-violet-50 text-violet-800 border-violet-500",
    iconActive: "bg-violet-500 text-white shadow-violet-200 shadow-md",
    icon: "bg-violet-100 text-violet-600 group-hover:bg-violet-500 group-hover:text-white",
    badge: "bg-violet-100 text-violet-700",
  },
  purple: {
    active: "bg-purple-50 text-purple-800 border-purple-500",
    iconActive: "bg-purple-500 text-white shadow-purple-200 shadow-md",
    icon: "bg-purple-100 text-purple-600 group-hover:bg-purple-500 group-hover:text-white",
    badge: "bg-purple-100 text-purple-700",
  },
  emerald: {
    active: "bg-emerald-50 text-emerald-800 border-emerald-500",
    iconActive: "bg-emerald-500 text-white shadow-emerald-200 shadow-md",
    icon: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white",
    badge: "bg-emerald-100 text-emerald-700",
  },
  orange: {
    active: "bg-orange-50 text-orange-800 border-orange-500",
    iconActive: "bg-orange-500 text-white shadow-orange-200 shadow-md",
    icon: "bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white",
    badge: "bg-orange-100 text-orange-700",
  },
  teal: {
    active: "bg-teal-50 text-teal-800 border-teal-500",
    iconActive: "bg-teal-500 text-white shadow-teal-200 shadow-md",
    icon: "bg-teal-100 text-teal-600 group-hover:bg-teal-500 group-hover:text-white",
    badge: "bg-teal-100 text-teal-700",
  },
  rose: {
    active: "bg-rose-50 text-rose-800 border-rose-500",
    iconActive: "bg-rose-500 text-white shadow-rose-200 shadow-md",
    icon: "bg-rose-100 text-rose-600 group-hover:bg-rose-500 group-hover:text-white",
    badge: "bg-rose-100 text-rose-700",
  },
};

function groupItems(menuItems) {
  const groups = [];
  const map = new Map();

  menuItems.forEach((item) => {
    const section = item.section || "Menu";
    if (!map.has(section)) {
      const group = { title: section, items: [] };
      map.set(section, group);
      groups.push(group);
    }
    map.get(section).items.push(item);
  });

  return groups;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  handleTabChange,
  menuItems,
  collapsed = false,
  onToggleCollapse,
}) {
  const groups = groupItems(menuItems);

  const onSelect = (id) => {
    handleTabChange(id);
    setSidebarOpen(false);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />

      <aside
        className={`
          fixed top-0 md:top-[5.25rem] left-0 z-50 md:z-30
          h-screen md:h-[calc(100vh-5.25rem)]
          flex flex-col overflow-hidden
          bg-white border-r border-slate-200/80
          shadow-xl md:shadow-none
          transform transition-all duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${collapsed ? "w-[280px] md:w-[4.5rem]" : "w-[280px] md:w-72"}
        `}
      >
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-600 to-violet-600">
          <div className="flex items-center gap-2 text-white">
            <Sparkles size={18} />
            <span className="font-bold text-lg tracking-tight">Admin Menu</span>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg bg-white/15 text-white hover:bg-white/25 transition"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Desktop header + collapse toggle */}
        <div
          className={`hidden md:flex items-center border-b border-slate-100 flex-shrink-0 ${
            collapsed ? "justify-center px-2 py-3" : "justify-between px-3 py-3"
          }`}
        >
          {!collapsed && (
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 pl-1">
              Navigation
            </p>
          )}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav
          className={`flex-1 overflow-y-auto overflow-x-hidden no-scrollbar py-2 space-y-4 md:space-y-5 ${
            collapsed ? "md:px-1.5 px-3" : "px-3 md:py-1"
          }`}
        >
          {groups.map((group, groupIndex) => (
            <div key={group.title}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {group.title}
                </p>
              )}
              {collapsed && groupIndex > 0 && (
                <div className="hidden md:block mx-auto w-6 h-px bg-slate-200 mb-2" />
              )}
              <ul className={`space-y-1 ${collapsed ? "md:space-y-1.5" : ""}`}>
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const accent = accentStyles[itemAccent[item.id] || "indigo"];
                  const hasCount = item.count !== null && item.count !== undefined;

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(item.id)}
                        title={collapsed ? item.label : undefined}
                        className={`
                          group relative w-full flex items-center rounded-xl transition-all duration-200
                          ${collapsed ? "md:justify-center md:px-0 md:py-2 md:border-l-0 md:gap-0 gap-3 px-3 py-2.5" : "gap-3 px-3 py-2.5"}
                          border-l-[3px]
                          ${
                            isActive
                              ? `${accent.active} font-semibold shadow-sm`
                              : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }
                        `}
                      >
                        <span
                          className={`
                            flex-shrink-0 rounded-lg transition-all duration-200
                            ${collapsed ? "md:p-2 p-2" : "p-2"}
                            ${isActive ? accent.iconActive : accent.icon}
                          `}
                        >
                          <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                        </span>

                        <span
                          className={`flex-1 text-left text-sm leading-snug truncate ${
                            collapsed ? "md:hidden" : ""
                          }`}
                        >
                          {item.label}
                        </span>

                        {hasCount && (
                          <span
                            className={`
                              flex-shrink-0 min-w-[1.5rem] px-2 py-0.5 rounded-full text-xs font-bold tabular-nums
                              ${collapsed ? "md:hidden" : ""}
                              ${isActive ? accent.badge : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"}
                            `}
                          >
                            {item.count}
                          </span>
                        )}

                        {hasCount && collapsed && (
                          <span
                            className={`
                              hidden md:flex absolute top-0.5 right-0.5 min-w-[14px] h-[14px] px-0.5 items-center justify-center rounded-full text-[8px] font-bold
                              ${isActive ? "bg-rose-500 text-white" : "bg-slate-400 text-white"}
                            `}
                          >
                            {item.count > 9 ? "9+" : item.count}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div
          className={`flex-shrink-0 border-t border-slate-100 ${
            collapsed ? "md:px-1.5 md:py-2 px-2.5 py-2" : "px-2.5 py-2"
          }`}
        >
          {collapsed ? (
            <div
              className="hidden md:flex justify-center"
              title="Perfect Digital Press — Store Manager"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-sm">
                <Sparkles size={16} />
              </div>
            </div>
          ) : null}
          <div
            className={`rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm ${
              collapsed ? "md:hidden px-2.5 py-2" : "px-2.5 py-2"
            }`}
          >
            <p className="text-[9px] font-semibold text-indigo-100/95 leading-none tracking-wide">
              Perfect Digital Press
            </p>
            <p className="text-[11px] font-bold mt-0.5 leading-tight">Store Manager</p>
            <p className="text-[8px] text-indigo-100/80 mt-1 leading-snug line-clamp-2">
              Manage products, banners & orders in one place.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
