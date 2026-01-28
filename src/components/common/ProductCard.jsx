import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const ProductCard = ({ 
  product, 
  whatsappNumber, 
  getDisplayCategory = (cat) => cat, 
  WhatsAppIcon,
  trendingProductIds = [],
  bestSellerProductIds = [],
}) => {
  const displayCategory = typeof getDisplayCategory === 'function' 
    ? getDisplayCategory(product.category) 
    : product.category;
    
  const isTrending = trendingProductIds.includes(product._id || product.id);
  const isBestSeller = bestSellerProductIds.includes(product._id || product.id);
  const formatPrice = (num) => new Intl.NumberFormat('en-IN').format(num);

  const message = encodeURIComponent(
    `Hi! I'm interested in the ${product.name} priced at ₹${product.price}.
Category: ${displayCategory}
Can you confirm availability?`
  );

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : null;

  return (
    <div className="group relative h-full max-w-[280px] mx-auto">
      <div className="relative h-full flex flex-col bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
        
        {/* COMPACT IMAGE SECTION */}
        <div className="relative aspect-square overflow-hidden bg-slate-50">
          {/* Minimalist Badges */}
          <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
            {discountPercentage > 0 && (
              <span className="bg-amber-400 text-black text-[8px] font-black px-2 py-0.5 rounded-md uppercase">
                {discountPercentage}% OFF
              </span>
            )}
            {isBestSeller && (
              <span className="bg-slate-900 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                Best
              </span>
            )}
          </div>

          <Link to={`/product/${product._id || product.id}`} className="block h-full">
            <img
              src={product.image || product.mainImage || product.images?.[0] || "https://via.placeholder.com/400"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </Link>
          
          {/* Quick Category Overlay */}
          <div className="absolute bottom-2 right-2">
            <span className="text-[8px] font-bold text-white bg-black/20 backdrop-blur-md px-2 py-1 rounded-full uppercase tracking-widest border border-white/10">
              {displayCategory}
            </span>
          </div>
        </div>

        {/* COMPACT CONTENT SECTION */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex-grow">
            <Link to={`/product/${product._id || product.id}`}>
              <h3 className="text-sm font-bold text-slate-900 leading-tight line-clamp-1 uppercase tracking-tight group-hover:text-amber-600 transition-colors">
                {product.name}
              </h3>
            </Link>
            
            {/* Minimal Rating */}
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">4.9 / 5.0</span>
            </div>
          </div>

          {/* Compact Pricing */}
          <div className="mt-3 pt-3 border-t border-slate-50">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-lg font-black text-slate-900">₹{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-[10px] line-through text-slate-300 font-bold italic">₹{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            {/* Compact WhatsApp Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl transition-all hover:bg-amber-500 hover:text-black active:scale-95 shadow-md shadow-slate-100"
            >
              {WhatsAppIcon ? (
                <WhatsAppIcon size={14} strokeWidth={2.5} />
              ) : (
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              )}
              <span className="text-[9px] font-black uppercase tracking-widest">Inquire</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
