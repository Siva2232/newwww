/** Normalize MongoDB / local IDs for reliable comparisons */
export const normalizeProductId = (id) => {
  if (id == null || id === "") return "";
  return String(id);
};

export const getProductId = (product) =>
  normalizeProductId(product?._id ?? product?.id);

export const sameProductId = (a, b) => normalizeProductId(a) === normalizeProductId(b);

export const isProductInList = (productId, idList = []) =>
  idList.some((id) => sameProductId(id, productId));

export const pruneFeaturedIds = (idList, products = []) => {
  const valid = new Set(products.map((p) => getProductId(p)).filter(Boolean));
  return idList
    .map(normalizeProductId)
    .filter((id) => id && valid.has(id));
};

export const featuredIdsFromProducts = (products = []) => ({
  trending: products.filter((p) => p.isTrending).map(getProductId).filter(Boolean),
  bestSeller: products.filter((p) => p.isBestSeller).map(getProductId).filter(Boolean),
});
