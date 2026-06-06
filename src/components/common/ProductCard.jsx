import { Link } from "react-router-dom";
import { Sparkles, ShoppingBag, ArrowUpRight } from "lucide-react";
import { getImageUrl } from "../../utils/imageUrl";
import { getProductId, isProductInList } from "../../utils/productIds";

const ProductCard = ({
  product,
  whatsappNumber,
  getDisplayCategory = (cat) => cat,
  WhatsAppIcon,
  trendingProductIds = [],
  bestSellerProductIds = [],
  onSelect,
  selected = false,
}) => {
  const displayCategory =
    typeof getDisplayCategory === "function"
      ? getDisplayCategory(product.category)
      : product.category;
  const displaySubcategory = product.subcategory
    ? ` · ${product.subcategory}`
    : "";

  const pid = getProductId(product);
  const isTrending = isProductInList(pid, trendingProductIds);
  const isBestSeller = isProductInList(pid, bestSellerProductIds);
  const formatPrice = (num) =>
    new Intl.NumberFormat("en-IN").format(Number(num) || 0);

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) *
          100,
      )
    : null;

  const message = encodeURIComponent(
    `Hi! I'm interested in:\n*${product.name}*\nPrice: ₹${product.price}\nCategory: ${displayCategory}${displaySubcategory}`,
  );

  const productPath = `/product/${product._id || product.id}`;
  const imageSrc =
    getImageUrl(product.image || product.mainImage || product.images?.[0]) ||
    "/placeholder-product.jpg";

  const cardInner = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f8f8fa]">
        <div className="absolute left-3 top-3 z-20 flex flex-col gap-1.5">
          {isBestSeller && (
            <span className="inline-flex items-center gap-1 rounded-full border border-black/[0.06] bg-white/95 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#1d1d1f] shadow-sm backdrop-blur-sm">
              <Sparkles size={9} className="text-orange-500" fill="currentColor" />
              Bestseller
            </span>
          )}
          {discountPercentage > 0 && (
            <span className="rounded-lg bg-orange-500 px-2 py-0.5 text-[9px] font-bold text-white">
              {discountPercentage}% off
            </span>
          )}
          {isTrending && !isBestSeller && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#1d1d1f] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-white">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange-400" />
              </span>
              Trending
            </span>
          )}
        </div>

        {onSelect ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <Link to={productPath} className="block h-full">
            <img
              src={imageSrc}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </Link>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {!onSelect && (
          <div className="absolute bottom-3 left-3 right-3 z-30 translate-y-10 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
            <Link
              to={productPath}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/80 bg-white/95 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#1d1d1f] shadow-lg backdrop-blur-md"
            >
              <ShoppingBag size={12} />
              View details
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-col p-4 sm:p-5">
        <span className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#86868b]">
          {displayCategory}
          {displaySubcategory}
        </span>

        {onSelect ? (
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug tracking-[-0.01em] text-[#1d1d1f] sm:text-[15px]">
            {product.name}
          </h3>
        ) : (
          <Link to={productPath}>
            <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug tracking-[-0.01em] text-[#1d1d1f] transition-colors group-hover:text-orange-600 sm:text-[15px]">
              {product.name}
            </h3>
          </Link>
        )}

        {product.description && (
          <p className="mb-3 line-clamp-2 text-xs font-medium leading-relaxed text-[#86868b]">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <span className="text-base font-semibold tracking-tight text-[#1d1d1f] sm:text-lg">
              ₹{formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="ml-2 text-xs font-medium text-[#86868b] line-through">
                ₹{formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {whatsappNumber && !onSelect && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(
                  `https://wa.me/${whatsappNumber}?text=${message}`,
                  "_blank",
                );
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1d1d1f] text-white shadow-sm transition-all hover:bg-[#25D366] active:scale-95"
              aria-label="Inquire on WhatsApp"
            >
              {WhatsAppIcon ? (
                <WhatsAppIcon size={17} />
              ) : (
                <ArrowUpRight size={17} />
              )}
            </button>
          )}

          {onSelect && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1d1d1f] text-white transition-transform group-hover:scale-105">
              <ArrowUpRight size={16} />
            </span>
          )}
        </div>
      </div>
    </>
  );

  const shellClass = `group relative w-full overflow-hidden rounded-[22px] border bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] ${
    selected
      ? "border-orange-400 ring-2 ring-orange-400/30"
      : "border-black/[0.05]"
  }`;

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(product)}
        className={`${shellClass} text-left`}
      >
        {cardInner}
      </button>
    );
  }

  return <div className={shellClass}>{cardInner}</div>;
};

export default ProductCard;
