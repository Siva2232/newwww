const BASE_URL = "https://newweb11.onrender.com/api";

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem("adminToken");
};

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const loginAdmin = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Login failed");
  }
  return res.json();
};

export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`);
  return res.json();
};

export const createProduct = async (productData) => {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
};

export const updateProduct = async (productId, productData) => {
  const res = await fetch(`${BASE_URL}/products/${productId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
};

export const deleteProduct = async (productId) => {
  const res = await fetch(`${BASE_URL}/products/${productId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
};

// Category APIs
export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories`);
  return res.json();
};

export const createCategory = async (categoryData) => {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData),
  });
  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
};

export const updateCategory = async (categoryId, categoryData) => {
  const res = await fetch(`${BASE_URL}/categories/${categoryId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData),
  });
  if (!res.ok) throw new Error("Failed to update category");
  return res.json();
};

export const deleteCategory = async (categoryId) => {
  const res = await fetch(`${BASE_URL}/categories/${categoryId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete category");
  return res.json();
};

// Hero Banner APIs
export const getHeroBanners = async () => {
  const res = await fetch(`${BASE_URL}/hero-banners`);
  return res.json();
};

export const createHeroBanner = async (bannerData) => {
  const res = await fetch(`${BASE_URL}/hero-banners`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(bannerData),
  });
  if (!res.ok) throw new Error("Failed to create banner");
  return res.json();
};

export const updateHeroBanner = async (bannerId, bannerData) => {
  const res = await fetch(`${BASE_URL}/hero-banners/${bannerId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(bannerData),
  });
  if (!res.ok) throw new Error("Failed to update banner");
  return res.json();
};

export const deleteHeroBanner = async (bannerId) => {
  const res = await fetch(`${BASE_URL}/hero-banners/${bannerId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete banner");
  return res.json();
};

// Product Toggle APIs
export const toggleProductTrending = async (productId) => {
  const res = await fetch(`${BASE_URL}/products/${productId}/trending`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to toggle trending status");
  return res.json();
};

export const toggleProductBestSeller = async (productId) => {
  const res = await fetch(`${BASE_URL}/products/${productId}/best-seller`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to toggle best seller status");
  return res.json();
};
