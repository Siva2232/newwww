// src/api.js  (or wherever you keep your API helpers)

// Use env var or default to production backend
export const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "https://api.aktech.sbs";
export const BASE_URL = `${BACKEND_URL}/api`;

// Helper to get admin token from localStorage
const getAuthToken = () => localStorage.getItem("adminToken");

// Helper to generate headers (with optional auth)
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ────────────────────────────────────────────────
// Generic error handler
// ────────────────────────────────────────────────
const handleResponse = async (res) => {
  if (!res.ok) {
    let errorMessage = "Request failed";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // fallback if not JSON
    }
    throw new Error(errorMessage);
  }
  return res.json();
};

// ────────────────────────────────────────────────
// Auth
// ────────────────────────────────────────────────
export const loginAdmin = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

// ────────────────────────────────────────────────
// Products
// ────────────────────────────────────────────────
export const getProducts = async (query = "") => {
  const url = query ? `${BASE_URL}/products?${query}` : `${BASE_URL}/products`;
  const res = await fetch(url);
  return handleResponse(res);
};

export const getProductById = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  return handleResponse(res);
};

export const createProduct = async (productData) => {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  return handleResponse(res);
};

export const updateProduct = async (productId, productData) => {
  const res = await fetch(`${BASE_URL}/products/${productId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  return handleResponse(res);
};

export const deleteProduct = async (productId) => {
  const res = await fetch(`${BASE_URL}/products/${productId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

// Toggle trending / best-seller
export const toggleProductTrending = async (productId) => {
  const res = await fetch(`${BASE_URL}/products/${productId}/trending`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const toggleProductBestSeller = async (productId) => {
  const res = await fetch(`${BASE_URL}/products/${productId}/best-seller`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

// ────────────────────────────────────────────────
// Categories
// ────────────────────────────────────────────────
export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories`);
  return handleResponse(res);
};

export const createCategory = async (categoryData) => {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData),
  });
  return handleResponse(res);
};

export const updateCategory = async (categoryId, categoryData) => {
  const res = await fetch(`${BASE_URL}/categories/${categoryId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData),
  });
  return handleResponse(res);
};

export const deleteCategory = async (categoryId) => {
  const res = await fetch(`${BASE_URL}/categories/${categoryId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

// ────────────────────────────────────────────────
// Hero Banners
// ────────────────────────────────────────────────
export const getHeroBanners = async () => {
  const res = await fetch(`${BASE_URL}/hero-banners`);
  return handleResponse(res);
};

export const createHeroBanner = async (bannerData) => {
  const res = await fetch(`${BASE_URL}/hero-banners`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(bannerData),
  });
  return handleResponse(res);
};

export const updateHeroBanner = async (bannerId, bannerData) => {
  const res = await fetch(`${BASE_URL}/hero-banners/${bannerId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(bannerData),
  });
  return handleResponse(res);
};

export const deleteHeroBanner = async (bannerId) => {
  const res = await fetch(`${BASE_URL}/hero-banners/${bannerId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

// ────────────────────────────────────────────────
// Special Offers (new)
// ────────────────────────────────────────────────
export const getSpecialOffers = async () => {
  const res = await fetch(`${BASE_URL}/special-offers`);
  return handleResponse(res);
};

export const createSpecialOffer = async (offerData) => {
  const res = await fetch(`${BASE_URL}/special-offers`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(offerData),
  });
  return handleResponse(res);
};

export const updateSpecialOffer = async (offerId, offerData) => {
  const res = await fetch(`${BASE_URL}/special-offers/${offerId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(offerData),
  });
  return handleResponse(res);
};

export const deleteSpecialOffer = async (offerId) => {
  const res = await fetch(`${BASE_URL}/special-offers/${offerId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

// ────────────────────────────────────────────────
// Custom Products (for bespoke/custom books)
// ────────────────────────────────────────────────
// ────────────────────────────────────────────────
// Custom Products (for bespoke/custom books)
// ────────────────────────────────────────────────
export const getCustomProducts = async () => {
  const res = await fetch(`${BASE_URL}/custom-products`);
  return handleResponse(res);
};

export const createCustomProduct = async (productData) => {
  const res = await fetch(`${BASE_URL}/custom-products`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  return handleResponse(res);
};

export const updateCustomProduct = async (productId, productData) => {
  const res = await fetch(`${BASE_URL}/custom-products/${productId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  return handleResponse(res);
};

export const deleteCustomProduct = async (productId) => {
  const res = await fetch(`${BASE_URL}/custom-products/${productId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (res.status === 204) return { message: "Deleted" };
  return handleResponse(res);
};



// src/api.js — append at the end

export const submitCustomBookOrder = async (formData) => {
  const res = await fetch(`${BASE_URL}/custom-book-orders`, {
    method: "POST",
    // NO Content-Type header — browser sets multipart/form-data + boundary
    body: formData,
  });

  if (!res.ok) {
    let msg = "Submission failed";
    try {
      const err = await res.json();
      msg = err.message || msg;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
};

// Optional: admin list
export const getCustomBookOrders = async () => {
  const res = await fetch(`${BASE_URL}/custom-book-orders`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const getCustomBookOrderById = async (orderId) => {
  const res = await fetch(`${BASE_URL}/custom-book-orders/${orderId}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const updateCustomBookOrder = async (orderId, data) => {
  const res = await fetch(`${BASE_URL}/custom-book-orders/${orderId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

// ────────────────────────────────────────────────
// File Upload Helper
// ────────────────────────────────────────────────
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${BASE_URL}/uploads`, {
    method: "POST",
    body: formData,
    // Note: Do NOT set Content-Type header for FormData, browser does it with boundary
  });
  
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(errorBody || "Image upload failed");
  }
  
  return res.json(); // Expected { path: "/uploads/filename.ext" }
};




