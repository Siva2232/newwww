// src/api.js
// HTTP helper used by the React frontend to talk to the Express backend.
// Environment variable VITE_API_BASE_URL should point at the backend (e.g.
// http://localhost:5000) and is set in .env.* files.

// ensure the base URL always includes a protocol; Vite env vars must be reloaded after editing
let BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
if (BASE_URL && !/^https?:\/\//i.test(BASE_URL)) {
  // missing protocol, default to https
  BASE_URL = `https://${BASE_URL}`;
}
// remove trailing slash to avoid double slashes
if (BASE_URL.endsWith('/')) {
  BASE_URL = BASE_URL.slice(0, -1);
}
console.debug('API BASE_URL set to', BASE_URL);
export { BASE_URL };

const getHeaders = (json = true) => {
  const headers = {};
  if (json) headers['Content-Type'] = 'application/json';
  const token = localStorage.getItem('adminToken');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

async function handleResponse(res) {
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    data = text;
  }
  if (!res.ok) {
    // Handle unauthorized or invalid token
    if (res.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("isAdminLoggedIn");
      // Optional: force reload to trigger Auth check in Context
      if (typeof window !== "undefined") {
        // window.location.href = "/login"; 
      }
    }
    const message = data && data.message ? data.message : res.statusText;
    throw new Error(message || "API error");
  }
  return data;
}

export const loginAdmin = async (email, password) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

export const getProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/api/products${query ? `?${query}` : ''}`, {
    headers: getHeaders(),
  });
  return handleResponse(res);
};
export const searchProducts = async (term) => {
  const url = `${BASE_URL}/api/products/search?q=${encodeURIComponent(term)}`;
  console.debug('searchProducts url', url);
  try {
    const res = await fetch(url, {
      headers: getHeaders(),
    });
    if (res.status === 404) {
      // backend doesn't support search endpoint (e.g. prod) – just return empty
      console.warn('searchProducts endpoint returned 404; falling back to empty array');
      return [];
    }
    return handleResponse(res);
  } catch (err) {
    console.error('searchProducts fetch failed', err);
    return [];
  }
};
export const createProduct = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};
export const updateProduct = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};
export const deleteProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(res);
};
export const toggleProductTrending = async (id) => {
  const res = await fetch(`${BASE_URL}/api/products/${id}/toggle-trending`, {
    method: 'PATCH',
    headers: getHeaders(),
  });
  return handleResponse(res);
};
export const toggleProductBestSeller = async (id) => {
  const res = await fetch(`${BASE_URL}/api/products/${id}/toggle-best-seller`, {
    method: 'PATCH',
    headers: getHeaders(),
  });
  return handleResponse(res);
};

export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/api/categories`, { headers: getHeaders() });
  return handleResponse(res);
};
export const createCategory = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/categories`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};
export const updateCategory = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/api/categories/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};
export const deleteCategory = async (id) => {
  const res = await fetch(`${BASE_URL}/api/categories/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(res);
};

export const getSubCategories = async () => {
  const res = await fetch(`${BASE_URL}/api/subcategories`, { headers: getHeaders() });
  return handleResponse(res);
};
export const createSubCategory = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/subcategories`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};
export const updateSubCategory = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/api/subcategories/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};
export const deleteSubCategory = async (id) => {
  const res = await fetch(`${BASE_URL}/api/subcategories/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(res);
};

export const getHeroBanners = async () => {
  const res = await fetch(`${BASE_URL}/api/banners`, { headers: getHeaders() });
  return handleResponse(res);
};
export const createHeroBanner = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/banners`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};
export const updateHeroBanner = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/api/banners/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};
export const deleteHeroBanner = async (id) => {
  const res = await fetch(`${BASE_URL}/api/banners/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(res);
};

export const getSpecialOffers = async () => {
  const res = await fetch(`${BASE_URL}/api/special-offers`, { headers: getHeaders() });
  return handleResponse(res);
};
export const createSpecialOffer = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/special-offers`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};
export const updateSpecialOffer = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/api/special-offers/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};
export const deleteSpecialOffer = async (id) => {
  const res = await fetch(`${BASE_URL}/api/special-offers/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(res);
};

export const getCustomBookOrders = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/api/custom-orders${query ? `?${query}` : ''}`, {
    headers: getHeaders(),
  });
  return handleResponse(res);
};
export const submitCustomBookOrder = async (payload) => {
  const isFormData = payload instanceof FormData;
  const res = await fetch(`${BASE_URL}/api/custom-orders`, {
    method: 'POST',
    headers: getHeaders(!isFormData),
    body: isFormData ? payload : JSON.stringify(payload),
  });
  return handleResponse(res);
};
export const updateCustomBookOrder = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/api/custom-orders/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const getCustomProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/api/custom-products${query ? `?${query}` : ''}`, {
    headers: getHeaders(),
  });
  return handleResponse(res);
};
export const createCustomProduct = async (payload) => {
  const res = await fetch(`${BASE_URL}/api/custom-products`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};
export const updateCustomProduct = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/api/custom-products/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};
export const deleteCustomProduct = async (id) => {
  const res = await fetch(`${BASE_URL}/api/custom-products/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(res);
};

// file upload helper
export const uploadImage = async (file) => {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    body: form,
  });
  return handleResponse(res);
};

// other helpers
export const getCustomProductOrders = async () => {
  const res = await fetch(`${BASE_URL}/api/custom-orders`, { headers: getHeaders() });
  return handleResponse(res);
};
