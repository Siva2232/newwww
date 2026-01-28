import React, { useState } from 'react';
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowLeft, Star, Check, Heart, Quote } from "lucide-react";
import { useProducts } from "../Context/ProductContext";

// WhatsApp business number
const whatsappNumber = "9746683778";

// Inline WhatsApp Icon
const WhatsAppIcon = ({ size = 24, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.884 3.088" />
  </svg>
);

// Helper to display category nicely
const getDisplayCategory = (cat) => {
  switch (cat) {
    case "frames": return "Frames";
    case "albums": return "Albums";
    case "books": return "Photo Books";
    default: return cat || "Product";
  }
};

// Enhanced Carousel - hides controls when only one image
function ProductCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prev = () => setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  const multiple = images.length > 1;

  return (
    <div className="relative group rounded-3xl overflow-hidden shadow-2xl">
      <div className="aspect-[4/5] sm:aspect-[3/4] md:aspect-[4/5] lg:aspect-[5/4]">
        <div className="flex h-full transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {images.map((src, idx) => (
            <img key={idx} src={src} alt={`Product detail ${idx + 1}`} className="min-w-full h-full object-cover" loading="lazy" />
          ))}
        </div>
      </div>
      {multiple && (
        <>
          <button onClick={prev} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-3 sm:p-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition">
            <ChevronLeft size={28} />
          </button>
          <button onClick={next} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-3 sm:p-4 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition">
            <ChevronRight size={28} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
            {images.map((_, idx) => (
              <div key={idx} className={`h-1.5 sm:h-2 rounded-full transition-all ${idx === currentIndex ? "bg-white w-8 sm:w-10" : "bg-white/50 w-1.5 sm:w-2"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function DetailedPage() {
  const { products } = useProducts();
  const { id } = useParams();
  const productId = Number(id);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-2xl text-gray-600">Product not found</p>
      </div>
    );
  }

  const displayCategory = getDisplayCategory(product.category);

  // Generic description based on category
  let description = "Premium quality product crafted to preserve and showcase your cherished memories.";
  if (product.category === "frames") {
    description = "Elegant high-quality frame, perfect for displaying your favorite photos with style and protection.";
  } else if (product.category === "albums") {
    description = "Handcrafted premium album designed to preserve your precious stories and photographs beautifully.";
  } else if (product.category === "books") {
    description = "Custom photo book with professional layout options – ideal for weddings, occasions, and special moments.";
  }

  // Generic features based on category
  let features = ["Premium Materials", "Expert Craftsmanship", "Perfect for Memories", "Durable & Long-Lasting"];
  if (product.category === "frames") {
    features = ["Sturdy Construction", "Elegant Finish", "Easy Wall Mounting", "Protective Cover"];
  } else if (product.category === "albums") {
    features = ["Luxury Cover Options", "Archival-Quality Pages", "Custom Layouts", "Handcrafted Binding"];
  } else if (product.category === "books") {
    features = ["Hardcover Options", "Layflat Panoramic Pages", "Professional Design", "Personalized Touch"];
  }

  // Generic reviews
  const reviews = [
    { user: "Priya S.", rating: 5, comment: "Amazing quality! Exactly what I was looking for. Highly recommend." },
    { user: "Arjun K.", rating: 5, comment: "Beautiful craftsmanship and excellent service. Very happy with my purchase!" },
  ];

  // Related products (same category)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Prefer full images array, then mainImage, then legacy image
  const images = (product.images && product.images.length > 0)
    ? product.images
    : (product.mainImage ? [product.mainImage] : (product.image ? [product.image] : []));

  const whatsappMessage = (prod) => encodeURIComponent(
    `Hi! I'm interested in the ${prod.name} (₹${prod.price}).
Category: ${getDisplayCategory(prod.category)}
Can you provide more details, customization options, and confirm availability?`
  );

  const bottomWhatsappMessage = encodeURIComponent(
    `Hi! I'm viewing the ${product.name} and want to place an order or discuss customization options.`
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Back Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-3 text-gray-700 hover:text-amber-700 font-semibold transition">
            <ArrowLeft size={28} />
            Back to Collection
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <ProductCarousel images={images} />

          <div className="space-y-8 lg:space-y-10">
            <div>
              <span className="inline-block px-4 py-2 bg-amber-100 text-amber-900 text-sm font-bold uppercase tracking-wider rounded-full">
                {displayCategory}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mt-4 mb-4 leading-tight">{product.name}</h1>
              <p className="text-3xl sm:text-4xl font-bold text-amber-700">₹{product.price}</p>
            </div>

            <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed">{description}</p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} size={24} fill="currentColor" />)}
              </div>
              <span className="font-semibold text-base sm:text-lg">5.0 (Excellent Reviews)</span>
              <Heart className="text-red-500 hover:fill-red-500 transition mt-2 sm:mt-0 sm:ml-auto" size={28} />
            </div>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage(product)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg sm:text-xl py-5 rounded-full shadow-2xl transition transform hover:scale-105"
            >
              <WhatsAppIcon size={32} />
              Order & Customize via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center mb-12 lg:mb-16">Key Features</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
            {features.map((feature, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-amber-100 rounded-full flex items-center justify-center">
                  <Check size={32} className="text-amber-700" />
                </div>
                <p className="font-bold text-sm sm:text-base lg:text-lg">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center mb-12 lg:mb-16">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {reviews.map((review, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl">
                <Quote size={36} className="text-amber-200 mb-4" />
                <p className="text-base lg:text-lg italic mb-6">"{review.comment}"</p>
                <div className="flex items-center gap-2">
                  {[...Array(review.rating)].map((_, s) => <Star key={s} size={20} fill="currentColor" className="text-amber-500" />)}
                </div>
                <p className="font-bold mt-4">- {review.user}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products - Now uses EXACT same card style as the main shop page for perfect UI consistency */}
      {relatedProducts.length > 0 && (
        <section className="py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center mb-12 lg:mb-16">You Might Also Like</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
              {relatedProducts.map((rel) => (
                <Link key={rel.id} to={`/product/${rel.id}`} className="group block">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <img
                        src={rel.image || rel.mainImage || rel.images?.[0] || "https://via.placeholder.com/600x800?text=No+Image"}
                        alt={rel.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                        <div className="text-white">
                          <h3 className="text-base font-bold">{rel.name}</h3>
                          <p className="text-xl font-bold">₹{rel.price}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 md:p-5 text-center">
                      <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider rounded-full mb-2">
                        {getDisplayCategory(rel.category)}
                      </span>
                      <h3 className="text-base md:text-lg font-bold mb-1 line-clamp-2">{rel.name}</h3>
                      <p className="text-xl md:text-2xl font-bold text-amber-600 mb-4">₹{rel.price}</p>
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage(rel)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center w-full gap-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold py-2.5 rounded-full transition text-sm shadow-md"
                      >
                        <WhatsAppIcon size={18} className="flex-shrink-0" />
                        <span>Order</span>
                      </a>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 text-white">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 lg:mb-8">Preserve Your Memories Beautifully</h2>
          <p className="text-lg sm:text-xl lg:text-2xl mb-10 lg:mb-12 opacity-90">Premium frames, albums & photo books – fully customizable for your special moments.</p>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${bottomWhatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 sm:gap-5 bg-black hover:bg-gray-900 px-10 sm:px-14 py-6 sm:py-7 rounded-full text-xl sm:text-2xl font-bold shadow-2xl transition transform hover:scale-110"
          >
            <WhatsAppIcon size={40} />
            Start Your Order Today
          </a>
        </div>
      </section>
    </div>
  );
}