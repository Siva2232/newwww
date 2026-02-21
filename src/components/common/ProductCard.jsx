import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Heart, Sparkles, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../utils/imageUrl';

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
  const displaySubcategory = product.subcategory ? ` / ${product.subcategory}` : '';
    
  const isTrending = trendingProductIds.includes(product._id || product.id);
  const isBestSeller = bestSellerProductIds.includes(product._id || product.id);
  const formatPrice = (num) => new Intl.NumberFormat('en-IN').format(num);

  const message = encodeURIComponent(
    `Hi Studio! ✨ I'm interested in:\n📦 *${product.name}*\n💰 Price: ₹${product.price}\nCategory: ${displayCategory}${displaySubcategory}`
  );

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : null;

  return (
    <div className="group relative w-full max-w-[280px] mx-auto">
      {/* SHADOW GLOW EFFECT (Hidden by default, glows on hover) */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-200 to-orange-100 rounded-[2rem] blur opacity-0 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative flex flex-col bg-white rounded-[1.8rem] overflow-hidden border border-slate-100 transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] group-hover:-translate-y-1">
        
        {/* IMAGE BOX */}
        <div className="relative aspect-[10/11] overflow-hidden bg-[#f8f8f8]">
          {/* PREMIUM BADGES */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
            {isBestSeller && (
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md border border-slate-100 text-slate-900 text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
                <Sparkles size={8} className="text-amber-500" fill="currentColor" /> Bestseller
              </div>
            )}
            {discountPercentage > 0 && (
              <div className="bg-orange-500 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-lg">
                {discountPercentage}% OFF
              </div>
            )}
          </div>

          {/* FLOATING ACTION: WISHLIST */}
          <button className="absolute top-3 right-3 z-30 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full text-slate-400 hover:text-rose-500 border border-white/50 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 shadow-sm">
            <Heart size={14} className="transition-colors hover:fill-rose-500" />
          </button>

          <Link to={`/product/${product._id || product.id}`} className="block h-full">
            <img
              src={getImageUrl(product.image || product.mainImage || product.images?.[0]) || "https://via.placeholder.com/400"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            />
            {/* Soft Shadow at Bottom of Image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
          
          {/* QUICK SHOP STRIP */}
          <div className="absolute bottom-3 left-3 right-3 z-30 translate-y-12 group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
            <Link 
               to={`/product/${product._id || product.id}`}
               className="flex items-center justify-center gap-2 w-full bg-white/95 backdrop-blur-md py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] text-slate-900 shadow-xl border border-white"
            >
              <ShoppingBag size={12} /> View Details
            </Link>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="p-4 bg-white">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[9px] font-black text-amber-600/80 uppercase tracking-[0.2em]">
              {displayCategory}{displaySubcategory}
            </span>
            {isTrending && (
               <div className="flex items-center gap-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
                  </span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Hot</span>
               </div>
            )}
          </div>

          <Link to={`/product/${product._id || product.id}`}>
            <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-1 mb-3 group-hover:text-amber-600 transition-colors duration-300">
              {product.name}
            </h3>
          </Link>

          {/* PRICE & INTERACTIVE CTA */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900 tracking-tight">
                  ₹{formatPrice(product.price)}
                </span>
              </div>
              {product.originalPrice && (
                <span className="text-[10px] font-medium text-slate-300 line-through">
                  ₹{formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
              }}
              className="group/btn relative h-10 w-10 overflow-hidden bg-slate-950 text-white rounded-2xl transition-all duration-300 hover:w-28 hover:bg-green-600 shadow-lg active:scale-95"
            >
              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover/btn:-translate-x-10">
                {WhatsAppIcon ? <WhatsAppIcon size={18} /> : <Plus size={18} />}
              </div>
              <div className="absolute inset-0 flex items-center justify-center translate-x-10 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:gap-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest">Inquire</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;