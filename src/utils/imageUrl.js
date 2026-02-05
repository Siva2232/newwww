import { BACKEND_URL } from "../api";

/**
 * Helper to resolve image URL
 * @param {string} img - The image path or base64 string
 * @returns {string|null} - The full URL to the image
 */
export const getImageUrl = (img) => {
  if (!img) return null;
  // Support existing Base64 strings and external URLs (e.g. from placeholder services)
  if (img.startsWith("data:") || img.startsWith("http")) return img;
  
  // Prepend backend URL for local uploads
  return `${BACKEND_URL}${img}`;
};
