import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useProducts } from "../../Context/ProductContext";
import { getImageUrl } from "../../utils/imageUrl";
import {
  getProductId,
  isProductInList,
  sameProductId,
} from "../../utils/productIds";
import DeleteConfirmModal from "./DeleteConfirmModal";
import {
  Award,
  Search,
  X,
  TrendingUp,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  LayoutGrid,
  Eye,
  Plus,
  Trash2,
  Zap,
} from "lucide-react";

const STEPS = [
  { id: 1, title: "Spotlight type", subtitle: "Trending or bestseller", icon: Zap },
  { id: 2, title: "Pick products", subtitle: "Search & select", icon: LayoutGrid },
  { id: 3, title: "Review", subtitle: "Preview & publish", icon: Eye },
];

const SPOTLIGHT_TYPES = [
  {
    id: "trending",
    label: "Trending Now",
    desc: "Hot picks carousel on the homepage",
    icon: TrendingUp,
    gradient: "from-amber-500 to-orange-600",
    ring: "ring-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-800",
    badge: "Hot",
  },
  {
    id: "best-seller",
    label: "Best Sellers",
    desc: "Top sellers section below trending",
    icon: Award,
    gradient: "from-emerald-500 to-green-600",
    ring: "ring-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    badge: "Bestseller",
  },
];

const inputClass =
  "w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition text-sm";

export default function FeaturedManagement() {
  const {
    products,
    trendingProductIds,
    bestSellerProductIds,
    toggleTrending,
    toggleBestSeller,
  } = useProducts();

  const [currentStep, setCurrentStep] = useState(1);
  const [spotlightType, setSpotlightType] = useState("trending");
  const [selectedIds, setSelectedIds] = useState([]);
  const [wizardSearch, setWizardSearch] = useState("");
  const [listSearchTrending, setListSearchTrending] = useState("");
  const [listSearchBest, setListSearchBest] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removeLoading, setRemoveLoading] = useState(false);

  const isTrending = spotlightType === "trending";
  const activeIds = isTrending ? trendingProductIds : bestSellerProductIds;
  const toggleFn = isTrending ? toggleTrending : toggleBestSeller;
  const theme = SPOTLIGHT_TYPES.find((t) => t.id === spotlightType) || SPOTLIGHT_TYPES[0];

  const resetWizard = () => {
    setCurrentStep(1);
    setSpotlightType("trending");
    setSelectedIds([]);
    setWizardSearch("");
    setError("");
  };

  const wizardProducts = useMemo(() => {
    const q = wizardSearch.toLowerCase().trim();
    return products.filter((p) => {
      if (!q) return true;
      return (
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    });
  }, [products, wizardSearch]);

  const selectedProducts = useMemo(
    () =>
      products.filter((p) =>
        selectedIds.some((sid) => sameProductId(sid, getProductId(p)))
      ),
    [products, selectedIds]
  );

  const newToAdd = selectedIds.filter(
    (id) => !activeIds.some((aid) => sameProductId(aid, id))
  );

  const validateStep = (step) => {
    if (step === 1) return true;
    if (step === 2) {
      if (newToAdd.length === 0) {
        setError(
          selectedIds.length === 0
            ? "Select at least one product to feature"
            : "Selected products are already featured — pick others or change spotlight type"
        );
        return false;
      }
      return true;
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    setError("");
    setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => {
    setError("");
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.some((x) => sameProductId(x, id))
        ? prev.filter((x) => !sameProductId(x, id))
        : [...prev, id]
    );
    setError("");
  };

  const handlePublish = async () => {
    if (!validateStep(2)) {
      setCurrentStep(2);
      return;
    }

    setSubmitting(true);
    setError("");
    let added = 0;

    try {
      for (const id of newToAdd) {
        setLoadingIds((prev) => new Set([...prev, id]));
        await toggleFn(id);
        added += 1;
      }
      toast.success(
        `Added ${added} product${added !== 1 ? "s" : ""} to ${theme.label}`
      );
      resetWizard();
    } catch (err) {
      const msg = err.message || "Failed to update featured products";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
      setLoadingIds(new Set());
    }
  };

  const confirmRemoveFeatured = async () => {
    if (!removeTarget) return;
    const { id, type } = removeTarget;
    const list = type === "trending" ? trendingProductIds : bestSellerProductIds;
    const fn = type === "trending" ? toggleTrending : toggleBestSeller;
    if (!isProductInList(id, list)) {
      setRemoveTarget(null);
      return;
    }

    setRemoveLoading(true);
    setLoadingIds((prev) => new Set([...prev, id]));
    try {
      await fn(id);
      toast.success("Removed from featured");
      setRemoveTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to remove");
    } finally {
      setRemoveLoading(false);
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const formatPrice = (n) =>
    n != null ? new Intl.NumberFormat("en-IN").format(n) : "—";

  return (
    <div className="space-y-8 pb-10">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Trending now"
          count={trendingProductIds.length}
          gradient="from-amber-500 to-orange-500"
        />
        <StatCard
          icon={Award}
          label="Best sellers"
          count={bestSellerProductIds.length}
          gradient="from-emerald-500 to-green-600"
        />
        <StatCard
          icon={LayoutGrid}
          label="Catalog size"
          count={products.length}
          gradient="from-slate-600 to-slate-800"
        />
      </div>

      {/* Wizard */}
      <div
        id="feature-wizard"
        className="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden"
      >
        <div className="px-6 py-5 md:px-8 border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50/80">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="text-emerald-600" size={24} />
                Feature Products
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].subtitle}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <Eye size={14} />
              Shows on homepage
            </span>
          </div>

          <div className="mt-5 flex gap-2">
            {STEPS.map((step, idx) => {
              const done = currentStep > step.id;
              const active = currentStep === step.id;
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (step.id < currentStep) setCurrentStep(step.id);
                      else if (
                        step.id === currentStep + 1 &&
                        validateStep(currentStep)
                      )
                        setCurrentStep(step.id);
                    }}
                    className={`flex items-center gap-2 w-full rounded-xl px-2 py-2 transition ${
                      active
                        ? "bg-white shadow-sm ring-2 ring-emerald-500/30"
                        : done
                          ? "opacity-90"
                          : "opacity-55"
                    }`}
                  >
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        done
                          ? "bg-emerald-500 text-white"
                          : active
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {done ? <Check size={16} /> : step.id}
                    </span>
                    <span className="hidden sm:block text-left min-w-0">
                      <span
                        className={`block text-xs font-bold truncate ${active ? "text-emerald-700" : "text-slate-700"}`}
                      >
                        {step.title}
                      </span>
                      <span className="block text-[10px] text-slate-500 truncate">
                        {step.subtitle}
                      </span>
                    </span>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`w-4 h-0.5 mx-0.5 rounded ${done ? "bg-emerald-400" : "bg-slate-200"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 md:p-8 min-h-[280px]">
          {error && (
            <div className="mb-5 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {currentStep === 1 && (
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
              {SPOTLIGHT_TYPES.map((type) => {
                const Icon = type.icon;
                const selected = spotlightType === type.id;
                const count =
                  type.id === "trending"
                    ? trendingProductIds.length
                    : bestSellerProductIds.length;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setSpotlightType(type.id);
                      setSelectedIds([]);
                      setError("");
                    }}
                    className={`text-left p-5 rounded-2xl border-2 transition-all ${
                      selected
                        ? `border-transparent ring-2 ${type.ring} shadow-lg scale-[1.01]`
                        : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center text-white mb-4 shadow-md`}
                    >
                      <Icon size={24} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{type.label}</h3>
                    <p className="text-sm text-slate-500 mt-1">{type.desc}</p>
                    <span
                      className={`inline-block mt-3 px-2.5 py-0.5 rounded-full text-xs font-bold ${type.bg} ${type.text}`}
                    >
                      {count} live on site
                    </span>
                    {selected && (
                      <span className="mt-3 flex items-center gap-1 text-emerald-600 text-xs font-bold">
                        <Check size={14} /> Selected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${theme.bg} ${theme.text}`}
                >
                  <theme.icon size={14} />
                  Adding to {theme.label}
                </span>
                {selectedIds.length > 0 && (
                  <span className="text-sm text-slate-500">
                    {newToAdd.length} new · {selectedIds.length} selected
                  </span>
                )}
              </div>

              <div className="relative max-w-md">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by name or category..."
                  value={wizardSearch}
                  onChange={(e) => setWizardSearch(e.target.value)}
                  className={inputClass}
                />
                {wizardSearch && (
                  <button
                    type="button"
                    onClick={() => setWizardSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {wizardProducts.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center text-slate-500">
                  {wizardSearch ? "No products match your search" : "No products in catalog yet"}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-h-[420px] overflow-y-auto pr-1">
                  {wizardProducts.map((product) => {
                    const id = getProductId(product);
                    const isSelected = selectedIds.some((sid) => sameProductId(sid, id));
                    const alreadyFeatured = isProductInList(id, activeIds);

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleSelect(id)}
                        className={`group relative rounded-2xl overflow-hidden border-2 text-left transition-all ${
                          isSelected
                            ? `border-emerald-500 shadow-lg ring-2 ring-emerald-500/20`
                            : alreadyFeatured
                              ? "border-slate-200 opacity-75"
                              : "border-slate-200 hover:border-emerald-300 hover:shadow-md"
                        }`}
                      >
                        <div className="aspect-square relative bg-slate-100">
                          <img
                            src={
                              getImageUrl(
                                product.mainImage ||
                                  product.images?.[0] ||
                                  product.image
                              ) || "https://placehold.co/300x300?text=Product"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div
                            className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                              isSelected
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : "bg-white/90 border-slate-300"
                            }`}
                          >
                            {isSelected && <Check size={14} />}
                          </div>
                          {alreadyFeatured && (
                            <span className="absolute bottom-2 left-2 right-2 text-center text-[9px] font-bold bg-slate-900/80 text-white py-1 rounded-lg">
                              Already live
                            </span>
                          )}
                        </div>
                        <div className="p-2.5">
                          <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-tight">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
                            ₹{formatPrice(product.price)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                <p className="text-sm font-semibold text-emerald-900">
                  Publishing {newToAdd.length} product{newToAdd.length !== 1 ? "s" : ""} to{" "}
                  <span className="font-bold">{theme.label}</span>
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Eye size={16} className="text-emerald-600" />
                  Homepage carousel preview
                </p>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <theme.icon size={20} className={isTrending ? "text-amber-600" : "text-emerald-600"} />
                      {theme.label}
                    </h4>
                    <span className="text-xs text-slate-500">Scroll on store →</span>
                  </div>
                  {selectedProducts.length === 0 ? (
                    <p className="text-sm text-slate-400 py-6 text-center">No products selected</p>
                  ) : (
                    <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                      {selectedProducts.map((product) => {
                        const id = getProductId(product);
                        const isNew = newToAdd.some((nid) => sameProductId(nid, id));
                        return (
                          <div
                            key={id}
                            className="flex-shrink-0 w-[140px] snap-start rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden"
                          >
                            <div className="aspect-square relative">
                              <img
                                src={
                                  getImageUrl(
                                    product.mainImage ||
                                      product.images?.[0] ||
                                      product.image
                                  ) || "https://placehold.co/200x200"
                                }
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              {isNew && (
                                <span className="absolute top-1.5 right-1.5 text-[8px] font-black uppercase bg-emerald-500 text-white px-1.5 py-0.5 rounded">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="p-2 text-[10px] font-bold text-slate-800 line-clamp-2 leading-tight">
                              {product.name}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <ul className="space-y-2 max-w-lg">
                {selectedProducts
                  .filter((p) =>
                    newToAdd.some((nid) => sameProductId(nid, getProductId(p)))
                  )
                  .map((p) => (
                    <li
                      key={getProductId(p)}
                      className="flex items-center gap-3 text-sm text-slate-700 bg-white border border-slate-100 rounded-xl px-3 py-2"
                    >
                      <Check size={16} className="text-emerald-500 flex-shrink-0" />
                      <span className="font-medium line-clamp-1">{p.name}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        <div className="px-6 py-4 md:px-8 border-t border-slate-100 bg-slate-50/80 flex flex-wrap justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-white disabled:opacity-40 disabled:pointer-events-none transition"
          >
            <ChevronLeft size={18} />
            Back
          </button>
          <div className="flex gap-2">
            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 shadow-md transition"
              >
                Next
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                disabled={submitting || newToAdd.length === 0}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm hover:from-emerald-700 hover:to-teal-700 shadow-lg disabled:opacity-60 transition"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Publish to {theme.label}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active featured lists */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ActiveFeaturedPanel
          title="Trending Now"
          icon={TrendingUp}
          accent="amber"
          productIds={trendingProductIds}
          products={products.filter((p) =>
            isProductInList(getProductId(p), trendingProductIds)
          )}
          listSearch={listSearchTrending}
          setListSearch={setListSearchTrending}
          loadingIds={loadingIds}
          onRemove={(id, name) =>
            setRemoveTarget({ id, name, type: "trending" })
          }
          getProductId={getProductId}
          formatPrice={formatPrice}
        />
        <ActiveFeaturedPanel
          title="Best Sellers"
          icon={Award}
          accent="emerald"
          productIds={bestSellerProductIds}
          products={products.filter((p) =>
            isProductInList(getProductId(p), bestSellerProductIds)
          )}
          listSearch={listSearchBest}
          setListSearch={setListSearchBest}
          loadingIds={loadingIds}
          onRemove={(id, name) =>
            setRemoveTarget({ id, name, type: "best-seller" })
          }
          getProductId={getProductId}
          formatPrice={formatPrice}
        />
      </div>

      <DeleteConfirmModal
        isOpen={!!removeTarget}
        title="Remove from featured?"
        description="This product will no longer appear in the Trending or Best Sellers section on your storefront."
        itemName={removeTarget?.name}
        confirmLabel="Remove"
        onConfirm={confirmRemoveFeatured}
        onCancel={() => !removeLoading && setRemoveTarget(null)}
        isLoading={removeLoading}
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, count, gradient }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md`}
      >
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{count}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function ActiveFeaturedPanel({
  title,
  icon: Icon,
  accent,
  productIds,
  products: featuredList,
  listSearch,
  setListSearch,
  loadingIds,
  onRemove,
  getProductId,
  formatPrice,
}) {
  const isAmber = accent === "amber";
  const filtered = useMemo(() => {
    const q = listSearch.toLowerCase().trim();
    if (!q) return featuredList;
    return featuredList.filter((p) => p.name?.toLowerCase().includes(q));
  }, [featuredList, listSearch]);

  const borderAccent = isAmber ? "hover:border-amber-200" : "hover:border-emerald-200";
  const badgeClass = isAmber
    ? "bg-amber-100 text-amber-800"
    : "bg-emerald-100 text-emerald-800";
  const iconColor = isAmber ? "text-amber-600" : "text-emerald-600";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Icon className={iconColor} size={20} />
          {title}
        </h3>
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${badgeClass}`}>
          {productIds.length}
        </span>
      </div>

      <div className="p-5">
        <div className="relative mb-4">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={listSearch}
            onChange={(e) => setListSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
          />
        </div>

        {productIds.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-slate-200 py-10 text-center">
            <Icon size={36} className={`mx-auto mb-2 opacity-30 ${iconColor}`} />
            <p className="text-sm font-semibold text-slate-600">Nothing featured yet</p>
            <p className="text-xs text-slate-400 mt-1">Use the wizard above to add products</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">No matches</p>
        ) : (
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {filtered.map((product) => {
              const id = getProductId(product);
              const loading = loadingIds.has(id);
              return (
                <div
                  key={id}
                  className={`flex gap-3 items-center p-3 rounded-xl border border-slate-100 ${borderAccent} hover:shadow-md transition-all`}
                >
                  <img
                    src={
                      getImageUrl(
                        product.mainImage || product.images?.[0] || product.image
                      ) || "https://placehold.co/80x80"
                    }
                    alt=""
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0 bg-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 line-clamp-1">
                      {product.name}
                    </p>
                    <p className="text-xs text-slate-500">₹{formatPrice(product.price)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(id, product.name)}
                    disabled={loading}
                    className="flex-shrink-0 p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:opacity-50 transition"
                    title="Remove"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
