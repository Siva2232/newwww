// src/Context/ProductContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as api from "../api";

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  // ─── Helpers ─────────────────────────────────────────────────────────────
  const loadFromStorage = useCallback((key, defaultValue = []) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return defaultValue;

      const parsed = JSON.parse(saved);

      // Special migration/normalization for products
      if (key === "products") {
        return parsed.map((p) => ({
          ...p,
          id: p.id ?? `prod_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          name: p.name?.trim() || "Unnamed Product",
          price: Number(p.price) || 0,
          originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
          category: p.category?.trim() || "uncategorized",
          description: p.description?.trim() || "",
          detailedDescription:
            p.detailedDescription?.trim() ||
            p.longDescription?.trim() ||
            p.description?.trim() ||
            "",
          mainImage: p.mainImage || p.image || p.images?.[0] || null,
          carouselImages: p.carouselImages || (Array.isArray(p.images) ? p.images.slice(1) : []),
          images: p.images || (p.mainImage ? [p.mainImage] : []),
          image: p.image || p.mainImage || p.images?.[0] || null,
        }));
      }

      return parsed;
    } catch (err) {
      console.warn(`Failed to parse ${key} from localStorage:`, err);
      return defaultValue;
    }
  }, []);

  const saveToStorage = useCallback((key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`Failed to save ${key} to localStorage:`, err);
    }
  }, []);

  // ─── Debounce for localStorage (reduces lag when typing/editing) ─────────────
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSave = useCallback(
    debounce((key, value) => saveToStorage(key, value), 600),
    [saveToStorage]
  );

  // ─── State ───────────────────────────────────────────────────────────────
  const [products, setProducts] = useState(() => loadFromStorage("products", []));
  const [heroBanners, setHeroBanners] = useState(() => loadFromStorage("heroBanners", []));
  const [shopCategories, setShopCategories] = useState(() => loadFromStorage("shopCategories", []));
  const [trendingProductIds, setTrendingProductIds] = useState(() =>
    loadFromStorage("trendingProductIds", [])
  );
  const [bestSellerProductIds, setBestSellerProductIds] = useState(() =>
    loadFromStorage("bestSellerProductIds", [])
  );

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isAdminLoggedIn") === "true"
  );

  // ─── Fetch products and categories from backend on mount ──────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await api.getProducts();
        if (Array.isArray(productsData)) {
          setProducts(productsData);
          
          // Extract featured product IDs from database
          const trendingIds = productsData
            .filter(p => p.isTrending)
            .map(p => p._id);
          const bestSellerIds = productsData
            .filter(p => p.isBestSeller)
            .map(p => p._id);
          
          if (trendingIds.length > 0) setTrendingProductIds(trendingIds);
          if (bestSellerIds.length > 0) setBestSellerProductIds(bestSellerIds);
        }
      } catch (error) {
        console.warn("Failed to fetch products from backend, using localStorage:", error);
      }

      try {
        const categoriesData = await api.getCategories();
        if (Array.isArray(categoriesData)) {
          setShopCategories(categoriesData);
        }
      } catch (error) {
        console.warn("Failed to fetch categories from backend, using localStorage:", error);
      }

      try {
        const bannersData = await api.getHeroBanners();
        if (Array.isArray(bannersData)) {
          setHeroBanners(bannersData);
        }
      } catch (error) {
        console.warn("Failed to fetch banners from backend, using localStorage:", error);
      }
    };

    fetchData();
  }, []);

  // ─── Cross-tab / cross-window sync ───────────────────────────────────────
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (!event.key) return;

      switch (event.key) {
        case "products":
          setProducts(loadFromStorage("products", products));
          break;
        case "heroBanners":
          setHeroBanners(loadFromStorage("heroBanners", heroBanners));
          break;
        case "shopCategories":
          setShopCategories(loadFromStorage("shopCategories", shopCategories));
          break;
        case "trendingProductIds":
          setTrendingProductIds(loadFromStorage("trendingProductIds", trendingProductIds));
          break;
        case "bestSellerProductIds":
          setBestSellerProductIds(loadFromStorage("bestSellerProductIds", bestSellerProductIds));
          break;
        case "isAdminLoggedIn":
          setIsAuthenticated(localStorage.getItem("isAdminLoggedIn") === "true");
          break;
        default:
          break;
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadFromStorage, products, heroBanners, shopCategories, trendingProductIds, bestSellerProductIds]);

  // ─── Auto-save ───────────────────────────────────────────────────────────
  useEffect(() => debouncedSave("products", products), [products]);
  useEffect(() => debouncedSave("heroBanners", heroBanners), [heroBanners]);
  useEffect(() => debouncedSave("shopCategories", shopCategories), [shopCategories]);
  useEffect(() => debouncedSave("trendingProductIds", trendingProductIds), [trendingProductIds]);
  useEffect(() => debouncedSave("bestSellerProductIds", bestSellerProductIds), [bestSellerProductIds]);

  // ─── Auth ────────────────────────────────────────────────────────────────
  const login = () => {
    localStorage.setItem("isAdminLoggedIn", "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    setIsAuthenticated(false);
  };

  // ─── Product CRUD ────────────────────────────────────────────────────────
  const addProduct = async (data) => {
    try {
      const mainImage = data.mainImage || null;
      const carouselImages = Array.isArray(data.carouselImages) ? data.carouselImages : [];

      // Create optimistic product for instant UI update
      const tempId = `prod_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const optimisticProduct = {
        _id: tempId,
        id: tempId,
        name: data.name?.trim() || "New Product",
        price: Number(data.price) || 0,
        originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
        category: data.category?.trim() || "uncategorized",
        description: data.description?.trim() || "",
        image: mainImage,
        images: [mainImage, ...carouselImages].filter(Boolean),
        isTrending: false,
        isBestSeller: false,
        createdAt: new Date().toISOString(),
      };

      // Immediately update UI (optimistic update)
      setProducts((prev) => [optimisticProduct, ...prev]);

      // Prepare payload for backend
      const payload = {
        name: data.name?.trim() || "New Product",
        price: Number(data.price) || 0,
        originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
        category: data.category?.trim() || "uncategorized",
        description: data.description?.trim() || "",
        image: mainImage,
        images: [mainImage, ...carouselImages].filter(Boolean),
      };

      // Send to backend
      const response = await api.createProduct(payload);

      // Replace temp ID with real ID from backend
      setProducts((prev) =>
        prev.map((p) =>
          p._id === tempId
            ? {
                _id: response._id,
                id: response._id,
                ...response,
              }
            : p
        )
      );
    } catch (error) {
      // Rollback on error: remove the optimistic product
      setProducts((prev) => prev.filter((p) => !p._id.startsWith("prod_")));
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const mainImage = updates.mainImage || null;
      const carouselImages = Array.isArray(updates.carouselImages) ? updates.carouselImages : [];

      // Optimistically update UI immediately
      setProducts((prev) =>
        prev.map((p) => {
          if (p._id !== id && p.id !== id) return p;
          return {
            ...p,
            name: updates.name?.trim() || "Product",
            price: Number(updates.price) || 0,
            originalPrice: updates.originalPrice ? Number(updates.originalPrice) : null,
            category: updates.category?.trim() || "uncategorized",
            description: updates.description?.trim() || "",
            image: mainImage,
            images: [mainImage, ...carouselImages].filter(Boolean),
          };
        })
      );

      // Prepare payload for backend
      const payload = {
        name: updates.name?.trim() || "Product",
        price: Number(updates.price) || 0,
        originalPrice: updates.originalPrice ? Number(updates.originalPrice) : null,
        category: updates.category?.trim() || "uncategorized",
        description: updates.description?.trim() || "",
        image: mainImage,
        images: [mainImage, ...carouselImages].filter(Boolean),
      };

      // Send to backend
      const response = await api.updateProduct(id, payload);

      // Sync with backend response
      setProducts((prev) =>
        prev.map((p) => {
          if (p._id !== response._id && p.id !== response._id) return p;
          return {
            _id: response._id,
            id: response._id,
            ...response,
          };
        })
      );
      return response;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      // Optimistically remove from UI immediately
      setProducts((prev) => prev.filter((p) => p._id !== id && p.id !== id));
      setTrendingProductIds((prev) => prev.filter((pid) => pid !== id));
      setBestSellerProductIds((prev) => prev.filter((pid) => pid !== id));

      // Delete from backend
      await api.deleteProduct(id);
    } catch (error) {
      // Rollback: re-fetch products on error
      const productsData = await api.getProducts();
      if (Array.isArray(productsData)) {
        setProducts(productsData);
        const trendingIds = productsData.filter(p => p.isTrending).map(p => p._id);
        const bestSellerIds = productsData.filter(p => p.isBestSeller).map(p => p._id);
        if (trendingIds.length > 0) setTrendingProductIds(trendingIds);
        if (bestSellerIds.length > 0) setBestSellerProductIds(bestSellerIds);
      }
      console.error("Error deleting product:", error);
      throw error;
    }
  };

  // ─── Category CRUD ──────────────────────────────────────────────────────
  const addCategory = async (data) => {
    try {
      const tempId = `cat_${Date.now()}`;
      const optimisticCategory = {
        _id: tempId,
        id: tempId,
        name: data.name?.trim() || "New Category",
        image: data.imageBase64 || null,
        description: data.description?.trim() || "",
        link: `/category/${(data.name || "").toLowerCase().replace(/\s+/g, "-")}`,
        createdAt: new Date().toISOString(),
      };

      // Optimistic update
      setShopCategories((prev) => [optimisticCategory, ...prev]);

      const payload = {
        name: data.name?.trim() || "New Category",
        image: data.imageBase64 || null,
        description: data.description?.trim() || "",
      };

      const response = await api.createCategory(payload);

      // Replace temp with real data from backend
      setShopCategories((prev) =>
        prev.map((cat) =>
          cat._id === tempId
            ? {
                _id: response._id,
                id: response._id,
                ...response,
              }
            : cat
        )
      );
      return response;
    } catch (error) {
      // Rollback on error
      setShopCategories((prev) => prev.filter((c) => !c._id.startsWith("cat_")));
      console.error("Error adding category:", error);
      throw error;
    }
  };

  const updateCategory = async (id, data) => {
    try {
      // Optimistic update
      setShopCategories((prev) =>
        prev.map((cat) =>
          cat._id === id || cat.id === id
            ? {
                ...cat,
                name: data.name?.trim() || "Category",
                image: data.imageBase64 || cat.image,
                description: data.description?.trim() || "",
              }
            : cat
        )
      );

      const payload = {
        name: data.name?.trim() || "Category",
        image: data.imageBase64 || null,
        description: data.description?.trim() || "",
      };

      const response = await api.updateCategory(id, payload);

      // Sync with backend
      setShopCategories((prev) =>
        prev.map((cat) =>
          cat._id === response._id || cat.id === response._id
            ? {
                _id: response._id,
                id: response._id,
                ...response,
              }
            : cat
        )
      );
      return response;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    try {
      // Optimistic delete
      setShopCategories((prev) => prev.filter((cat) => cat._id !== id && cat.id !== id));
      await api.deleteCategory(id);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  };

  // ─── Hero Banner CRUD ─────────────────────────────────────────────────
  const addHeroBanner = async (data) => {
    try {
      const tempId = `banner_${Date.now()}`;
      const optimisticBanner = {
        _id: tempId,
        id: tempId,
        title: data.title?.trim() || "New Banner",
        description: data.description?.trim() || "",
        image: data.imageBase64 || null,
        active: true,
        createdAt: new Date().toISOString(),
      };

      // Optimistic update
      setHeroBanners((prev) => [optimisticBanner, ...prev]);

      const payload = {
        title: data.title?.trim() || "New Banner",
        description: data.description?.trim() || "",
        image: data.imageBase64 || null,
      };

      const response = await api.createHeroBanner(payload);

      // Replace temp with real data
      setHeroBanners((prev) =>
        prev.map((b) =>
          b._id === tempId
            ? {
                _id: response._id,
                id: response._id,
                ...response,
              }
            : b
        )
      );
      return response;
    } catch (error) {
      // Rollback on error
      setHeroBanners((prev) => prev.filter((b) => !b._id.startsWith("banner_")));
      console.error("Error adding banner:", error);
      throw error;
    }
  };

  const updateHeroBanner = async (id, data) => {
    try {
      // Optimistic update
      setHeroBanners((prev) =>
        prev.map((b) =>
          b._id === id || b.id === id
            ? {
                ...b,
                title: data.title?.trim() || "Banner",
                description: data.description?.trim() || "",
                image: data.imageBase64 || b.image,
              }
            : b
        )
      );

      const payload = {
        title: data.title?.trim() || "Banner",
        description: data.description?.trim() || "",
        image: data.imageBase64 || null,
      };

      const response = await api.updateHeroBanner(id, payload);

      // Sync with backend
      setHeroBanners((prev) =>
        prev.map((b) =>
          b._id === response._id || b.id === response._id
            ? {
                _id: response._id,
                id: response._id,
                ...response,
              }
            : b
        )
      );
      return response;
    } catch (error) {
      console.error("Error updating banner:", error);
      throw error;
    }
  };

  const deleteHeroBanner = async (id) => {
    try {
      // Optimistic delete
      setHeroBanners((prev) => prev.filter((b) => b._id !== id && b.id !== id));
      await api.deleteHeroBanner(id);
    } catch (error) {
      console.error("Error deleting banner:", error);
      throw error;
    }
  };

  // ─── Featured toggles ────────────────────────────────────────────────────
  const toggleTrending = async (id) => {
    try {
      const isCurrentlyTrending = trendingProductIds.includes(id);
      const newTrendingState = !isCurrentlyTrending;

      // Update ID list
      setTrendingProductIds((prev) =>
        newTrendingState
          ? [...prev, id]
          : prev.filter((x) => x !== id)
      );

      // Also update isTrending flag in products → UI refreshes immediately
      setProducts((prev) =>
        prev.map((p) =>
          (p._id === id || p.id === id)
            ? { ...p, isTrending: newTrendingState }
            : p
        )
      );

      await api.toggleProductTrending(id);
    } catch (error) {
      // Rollback both
      setTrendingProductIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
      setProducts((prev) =>
        prev.map((p) =>
          (p._id === id || p.id === id)
            ? { ...p, isTrending: !trendingProductIds.includes(id) }
            : p
        )
      );
      console.error("Error toggling trending:", error);
      throw error;
    }
  };

  const toggleBestSeller = async (id) => {
    try {
      const isCurrentlyBest = bestSellerProductIds.includes(id);
      const newBestState = !isCurrentlyBest;

      // Update ID list
      setBestSellerProductIds((prev) =>
        newBestState
          ? [...prev, id]
          : prev.filter((x) => x !== id)
      );

      // Also update isBestSeller flag in products → UI refreshes immediately
      setProducts((prev) =>
        prev.map((p) =>
          (p._id === id || p.id === id)
            ? { ...p, isBestSeller: newBestState }
            : p
        )
      );

      await api.toggleProductBestSeller(id);
    } catch (error) {
      // Rollback both
      setBestSellerProductIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
      setProducts((prev) =>
        prev.map((p) =>
          (p._id === id || p.id === id)
            ? { ...p, isBestSeller: !bestSellerProductIds.includes(id) }
            : p
        )
      );
      console.error("Error toggling best seller:", error);
      throw error;
    }
  };

  // ─── Exposed value ───────────────────────────────────────────────────────
  const value = {
    products,
    heroBanners,
    setHeroBanners,
    shopCategories,
    setShopCategories,
    trendingProductIds,
    bestSellerProductIds,
    toggleTrending,
    toggleBestSeller,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addHeroBanner,
    updateHeroBanner,
    deleteHeroBanner,
    isAuthenticated,
    login,
    logout,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export default ProductProvider;