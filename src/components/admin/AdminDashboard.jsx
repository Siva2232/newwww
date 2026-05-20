import { useState, useEffect, useMemo } from "react";
import {
  Package,
  Image as ImageIcon,
  Grid3X3,
  TrendingUp,
  Gift,
  BookOpen,
  PlusCircle,
  LayoutDashboard,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Layers,
  AlertCircle,
  CheckCircle2,
  Clock,
  Star,
  Zap,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { getCustomProducts } from "../../api";
import { getImageUrl } from "../../utils/imageUrl";

const statConfig = [
  { id: "products", label: "Products", icon: Package, color: "amber", desc: "Catalog items" },
  { id: "banners", label: "Banners", icon: ImageIcon, color: "sky", desc: "Hero slides" },
  { id: "categories", label: "Categories", icon: Grid3X3, color: "purple", desc: "Main groups" },
  { id: "subcategories", label: "Subcategories", icon: Layers, color: "violet", desc: "Sub groups" },
  { id: "featured", label: "Featured", icon: TrendingUp, color: "emerald", desc: "Trending picks" },
  { id: "special-offers", label: "Offers", icon: Gift, color: "orange", desc: "Promotions" },
  { id: "custom-orders", label: "Orders", icon: BookOpen, color: "rose", desc: "Book requests" },
];

const quickActions = [
  { id: "products", label: "Add product", icon: Package, gradient: "from-amber-500 to-orange-500" },
  { id: "categories", label: "New category", icon: Grid3X3, gradient: "from-violet-500 to-purple-600" },
  { id: "banners", label: "Upload banner", icon: ImageIcon, gradient: "from-sky-500 to-blue-600" },
  { id: "add-product", label: "Custom book", icon: PlusCircle, gradient: "from-teal-500 to-emerald-600" },
  { id: "featured", label: "Set featured", icon: Star, gradient: "from-emerald-500 to-green-600" },
  { id: "custom-orders", label: "View orders", icon: BookOpen, gradient: "from-rose-500 to-pink-600" },
];

const colorStyles = {
  amber: { card: "from-amber-500/10 to-orange-500/5 border-amber-200", icon: "bg-amber-500 text-white", text: "text-amber-700" },
  sky: { card: "from-sky-500/10 to-blue-500/5 border-sky-200", icon: "bg-sky-500 text-white", text: "text-sky-700" },
  purple: { card: "from-purple-500/10 to-violet-500/5 border-purple-200", icon: "bg-purple-500 text-white", text: "text-purple-700" },
  violet: { card: "from-violet-500/10 to-purple-500/5 border-violet-200", icon: "bg-violet-500 text-white", text: "text-violet-700" },
  emerald: { card: "from-emerald-500/10 to-green-500/5 border-emerald-200", icon: "bg-emerald-500 text-white", text: "text-emerald-700" },
  orange: { card: "from-orange-500/10 to-amber-500/5 border-orange-200", icon: "bg-orange-500 text-white", text: "text-orange-700" },
  rose: { card: "from-rose-500/10 to-pink-500/5 border-rose-200", icon: "bg-rose-500 text-white", text: "text-rose-700" },
  indigo: { card: "from-indigo-500/10 to-violet-500/5 border-indigo-200", icon: "bg-indigo-500 text-white", text: "text-indigo-700" },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function statusBadge(status) {
  const s = (status || "pending").toLowerCase();
  if (s.includes("complete") || s.includes("done"))
    return "bg-emerald-100 text-emerald-700";
  if (s.includes("process") || s.includes("progress"))
    return "bg-sky-100 text-sky-700";
  return "bg-amber-100 text-amber-800";
}

export default function AdminDashboard({
  stats,
  onNavigate,
  recentOrders = [],
  products = [],
  bestSellerCount = 0,
}) {
  const [customBooksCount, setCustomBooksCount] = useState(0);
  const [loadingExtras, setLoadingExtras] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getCustomProducts({ page: 1, limit: 1 });
        const total = Array.isArray(data)
          ? data.length
          : (data?.pagination?.total ?? data?.products?.length ?? 0);
        if (!cancelled) setCustomBooksCount(total);
      } catch {
        if (!cancelled) setCustomBooksCount(0);
      } finally {
        if (!cancelled) setLoadingExtras(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalCatalog =
    (stats.products ?? 0) +
    (stats.categories ?? 0) +
    (stats.subcategories ?? 0) +
    customBooksCount;

  const storeHealth = useMemo(() => {
    const checks = [
      { id: "products", label: "Products listed", ok: (stats.products ?? 0) > 0, tab: "products" },
      { id: "categories", label: "Categories set up", ok: (stats.categories ?? 0) > 0, tab: "categories" },
      { id: "banners", label: "Home banners live", ok: (stats.banners ?? 0) > 0, tab: "banners" },
      { id: "featured", label: "Featured products", ok: (stats.featured ?? 0) > 0, tab: "featured" },
      { id: "offers", label: "Special offers", ok: (stats["special-offers"] ?? 0) > 0, tab: "special-offers" },
    ];
    const done = checks.filter((c) => c.ok).length;
    const percent = Math.round((done / checks.length) * 100);
    return { checks, done, total: checks.length, percent };
  }, [stats]);

  const orderStats = useMemo(() => {
    const pending = recentOrders.filter((o) =>
      !(o.status || "").toLowerCase().includes("complete")
    ).length;
    return { pending, total: stats["custom-orders"] ?? recentOrders.length };
  }, [recentOrders, stats]);

  const alerts = useMemo(() => {
    const list = [];
    if ((stats.products ?? 0) === 0)
      list.push({ type: "warn", text: "No products yet — add your first product.", tab: "products" });
    if ((stats.banners ?? 0) === 0)
      list.push({ type: "info", text: "Homepage has no banners — upload hero images.", tab: "banners" });
    if ((stats["special-offers"] ?? 0) === 0)
      list.push({ type: "info", text: "Create a special offer to boost conversions.", tab: "special-offers" });
    if (orderStats.pending > 0)
      list.push({
        type: "action",
        text: `${orderStats.pending} order(s) need attention.`,
        tab: "custom-orders",
      });
    return list;
  }, [stats, orderStats.pending]);

  const latestProducts = products.slice(0, 4);

  return (
    <div className="p-5 md:p-8 lg:p-10 space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-xl shadow-indigo-300/30">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-fuchsia-400/40 blur-2xl" />
        </div>
        <div className="relative px-6 py-8 md:px-10 md:py-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-sm mb-4">
              <Sparkles size={14} />
              Store overview
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {getGreeting()}, Admin
            </h1>
            <p className="text-indigo-100 mt-2 flex items-center gap-2 text-sm md:text-base">
              <Calendar size={16} />
              {formatDate()}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <HeroPill icon={ShoppingBag} label="Catalog items" value={totalCatalog} />
            <HeroPill icon={BookOpen} label="Custom orders" value={stats["custom-orders"] ?? 0} />
            <HeroPill icon={Star} label="Best sellers" value={bestSellerCount} />
          </div>
        </div>
      </section>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title="Store health"
          value={`${storeHealth.percent}%`}
          sub={`${storeHealth.done}/${storeHealth.total} setup steps`}
          icon={CheckCircle2}
          gradient="from-emerald-500 to-teal-600"
          onClick={() => onNavigate("products")}
        />
        <KpiCard
          title="Custom books"
          value={loadingExtras ? "…" : customBooksCount}
          sub="Bespoke catalog"
          icon={PlusCircle}
          gradient="from-teal-500 to-cyan-600"
          onClick={() => onNavigate("add-product")}
        />
        <KpiCard
          title="Pending orders"
          value={orderStats.pending}
          sub={`${orderStats.total} total orders`}
          icon={Clock}
          gradient="from-amber-500 to-orange-600"
          onClick={() => onNavigate("custom-orders")}
        />
        <KpiCard
          title="Marketing"
          value={(stats.banners ?? 0) + (stats["special-offers"] ?? 0)}
          sub="Banners + offers"
          icon={Zap}
          gradient="from-violet-500 to-purple-600"
          onClick={() => onNavigate("banners")}
        />
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 px-1">
            Action needed
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {alerts.map((a, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onNavigate(a.tab)}
                className={`flex items-start gap-3 p-4 rounded-xl border text-left transition hover:shadow-md ${
                  a.type === "warn"
                    ? "bg-amber-50 border-amber-200 hover:border-amber-300"
                    : a.type === "action"
                      ? "bg-rose-50 border-rose-200 hover:border-rose-300"
                      : "bg-sky-50 border-sky-200 hover:border-sky-300"
                }`}
              >
                <AlertCircle
                  size={20}
                  className={
                    a.type === "warn"
                      ? "text-amber-600"
                      : a.type === "action"
                        ? "text-rose-600"
                        : "text-sky-600"
                  }
                />
                <span className="text-sm font-medium text-slate-800 flex-1">{a.text}</span>
                <ArrowRight size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Stat grid */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-bold text-slate-800">Content breakdown</h2>
          <span className="text-xs font-medium text-slate-500">Click to manage</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 md:gap-4">
          {statConfig.map((item) => (
            <StatCard
              key={item.id}
              icon={item.icon}
              color={item.color}
              count={stats[item.id] ?? 0}
              label={item.label}
              desc={item.desc}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">Quick actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => onNavigate(action.id)}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-slate-200 hover:border-transparent hover:shadow-lg transition-all duration-200"
            >
              <span
                className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-md group-hover:scale-105 transition-transform`}
              >
                <action.icon size={22} />
              </span>
              <span className="text-sm font-semibold text-slate-700 text-center leading-tight">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Two columns: health + products | orders */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Store setup */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Store setup</h2>
            <span className="text-sm font-bold text-indigo-600">{storeHealth.percent}%</span>
          </div>
          <div className="px-6 py-4">
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden mb-5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                style={{ width: `${storeHealth.percent}%` }}
              />
            </div>
            <ul className="space-y-3">
              {storeHealth.checks.map((check) => (
                <li key={check.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(check.tab)}
                    className="w-full flex items-center gap-3 text-left group"
                  >
                    {check.ok ? (
                      <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex-shrink-0 group-hover:border-indigo-400" />
                    )}
                    <span
                      className={`text-sm flex-1 ${check.ok ? "text-slate-600" : "text-slate-800 font-medium"}`}
                    >
                      {check.label}
                    </span>
                    {!check.ok && (
                      <ExternalLink size={14} className="text-slate-400 opacity-0 group-hover:opacity-100" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Latest products */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Latest products</h2>
            <button
              type="button"
              onClick={() => onNavigate("products")}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Manage all
            </button>
          </div>
          {latestProducts.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {latestProducts.map((p) => {
                const thumbSrc = getImageUrl(
                  p.mainImage || p.image || p.images?.[0]
                );
                return (
                <li key={p._id || p.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate("products")}
                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {thumbSrc ? (
                        <img
                          src={thumbSrc}
                          alt={p.name || "Product"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/96x96?text=No+Image";
                          }}
                        />
                      ) : (
                        <Package className="text-slate-400" size={20} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 truncate">{p.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{p.category || "—"}</p>
                    </div>
                    <p className="font-bold text-indigo-600 text-sm">
                      ₹{Number(p.price || 0).toLocaleString()}
                    </p>
                  </button>
                </li>
                );
              })}
            </ul>
          ) : (
            <div className="py-12 text-center text-slate-500 text-sm">
              <Package className="mx-auto mb-2 text-slate-300" size={32} />
              No products yet
            </div>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-100">
              <BookOpen className="text-rose-600" size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Recent custom orders</h2>
              <p className="text-xs text-slate-500">Latest customer book requests</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("custom-orders")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
          >
            View all
            <ArrowRight size={16} />
          </button>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Book</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.slice(0, 6).map((order, i) => (
                  <tr
                    key={order._id || i}
                    className="hover:bg-slate-50/80 cursor-pointer transition"
                    onClick={() => onNavigate("custom-orders")}
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {order.customer?.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {order.book?.name || "Custom book"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusBadge(order.status)}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <BookOpen className="mx-auto text-slate-300 mb-3" size={40} />
            <p className="font-medium text-slate-600">No custom orders yet</p>
            <p className="text-sm text-slate-400 mt-1">Orders from the custom book page appear here</p>
          </div>
        )}
      </section>
    </div>
  );
}

function HeroPill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 min-w-[140px]">
      <Icon size={22} className="text-indigo-100" />
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-[11px] text-indigo-100/90 mt-1">{label}</p>
      </div>
    </div>
  );
}

function KpiCard({ title, value, sub, icon: Icon, gradient, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left p-5 rounded-2xl bg-white border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">{value}</p>
          <p className="text-xs text-slate-500 mt-1">{sub}</p>
        </div>
        <span
          className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md group-hover:scale-105 transition-transform`}
        >
          <Icon size={22} />
        </span>
      </div>
    </button>
  );
}

function StatCard({ icon: Icon, color, count, label, desc, onClick }) {
  const c = colorStyles[color] || colorStyles.indigo;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-4 rounded-2xl bg-gradient-to-br border ${c.card} hover:shadow-md transition-all w-full group`}
    >
      <div className={`inline-flex p-2 rounded-lg ${c.icon} mb-3 group-hover:scale-105 transition-transform`}>
        <Icon size={18} />
      </div>
      <p className={`text-2xl font-extrabold ${c.text}`}>{count}</p>
      <p className="text-sm font-semibold text-slate-800 mt-0.5">{label}</p>
      <p className="text-[11px] text-slate-500">{desc}</p>
    </button>
  );
}
