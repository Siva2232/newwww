// src/context/OrderContext.jsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { toast } from "react-hot-toast";
// backend removed – submission unavailable
const submitCustomBookOrder = async () => {
  return Promise.reject(new Error("submitCustomBookOrder called but backend removed"));
};

const OrderContext = createContext();

export function OrderProvider({ children }) {
  // ── Main state ────────────────────────────────────────────────────────
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    pages: "20", // default minimum
    notes: "",
    bookName: "",
    bookPrice: "",
    bookDescription: "",
  });

  const [photos, setPhotos] = useState([]); // File[]
  const [photoPreviews, setPhotoPreviews] = useState([]); // string[] (object URLs)

  const [coverImage, setCoverImage] = useState(null); // File | null
  const [coverPreview, setCoverPreview] = useState(""); // string

  const [step, setStep] = useState(1); // 1 = details, 2 = upload
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // ── Reset everything when flow completes or cancelled ────────────────
  const resetOrder = useCallback(() => {
    // Clean up object URLs to prevent memory leaks
    photoPreviews.forEach(URL.revokeObjectURL);
    if (coverPreview) URL.revokeObjectURL(coverPreview);

    setSelectedProduct(null);
    setForm({
      name: "",
      phone: "",
      pages: "20",
      notes: "",
      bookName: "",
      bookPrice: "",
      bookDescription: "",
    });
    setPhotos([]);
    setPhotoPreviews([]);
    setCoverImage(null);
    setCoverPreview("");
    setStep(1);
    setIsSubmitting(false);
    setOrderSubmitted(false);
    setOrderId(null);
  }, [photoPreviews, coverPreview]);

  // ── When user selects a product from ProductSelection ────────────────
  const selectProduct = useCallback((product) => {
    if (!product) return;

    setSelectedProduct(product);
    setForm((prev) => ({
      ...prev,
      bookName: product.name || "",
      bookPrice: product.price || "",
      bookDescription: product.shortDesc || product.fullDesc || "",
    }));
    setStep(1);
  }, []);

  // ── Form field updates ────────────────────────────────────────────────
  const updateForm = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  // ── Photo handling ────────────────────────────────────────────────────
  const addPhotos = useCallback(
    (newFiles) => {
      const validFiles = Array.from(newFiles).filter((f) =>
        f.type.startsWith("image/"),
      );
      if (validFiles.length === 0) {
        toast.error("Only image files are allowed");
        return;
      }

      if (photos.length + validFiles.length > 50) {
        toast.error("Maximum 50 photos allowed");
        return;
      }

      const newPreviews = validFiles.map((f) => URL.createObjectURL(f));

      setPhotos((prev) => [...prev, ...validFiles]);
      setPhotoPreviews((prev) => [...prev, ...newPreviews]);
    },
    [photos.length],
  );

  const removePhoto = useCallback(
    (index) => {
      URL.revokeObjectURL(photoPreviews[index]);
      setPhotos((prev) => prev.filter((_, i) => i !== index));
      setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
    },
    [photoPreviews],
  );

  // ── Cover image handling ──────────────────────────────────────────────
  const setCover = useCallback(
    (file) => {
      if (!file || !file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      if (coverPreview) URL.revokeObjectURL(coverPreview);

      const preview = URL.createObjectURL(file);
      setCoverImage(file);
      setCoverPreview(preview);
    },
    [coverPreview],
  );

  const removeCover = useCallback(() => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverImage(null);
    setCoverPreview("");
  }, [coverPreview]);

  // ── Navigation ────────────────────────────────────────────────────────
  const goToNextStep = useCallback(() => {
    if (step === 1) {
      if (!form.name.trim() || !form.phone.trim()) {
        toast.error("Name and WhatsApp number are required");
        return;
      }
      setStep(2);
    }
  }, [step, form.name, form.phone]);

  const goToPreviousStep = useCallback(() => {
    setStep((prev) => Math.max(1, prev - 1));
  }, []);

  // ── Submit order to backend ──────────────────────────────────────────
  const submitOrder = useCallback(async () => {
    if (isSubmitting) return;
    if (photos.length === 0) {
      toast.error("Please upload at least one interior photo");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Text fields
      formData.append("customerName", form.name.trim());
      formData.append("customerPhone", form.phone.trim());
      formData.append("pages", form.pages || "20");
      formData.append(
        "bookName",
        form.bookName.trim() || selectedProduct?.name || "Custom Book",
      );
      formData.append(
        "bookPrice",
        form.bookPrice.trim() || selectedProduct?.price || "Custom Quote",
      );
      formData.append(
        "bookDescription",
        form.bookDescription.trim() || selectedProduct?.shortDesc || "",
      );
      formData.append("notes", form.notes.trim());

      if (selectedProduct?._id) {
        formData.append("productId", selectedProduct._id);
      }

      // Files
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }
      photos.forEach((file) => {
        formData.append("photos", file);
      });

      const response = await submitCustomBookOrder(formData);

      toast.success("Order submitted successfully!");
      setOrderSubmitted(true);
      setOrderId(response.orderId || response.order?._id || null);

      // Optional: reset after success (or keep for showing confirmation)
      // resetOrder();
    } catch (err) {
      console.error("Order submission failed:", err);
      toast.error(err.message || "Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    form,
    selectedProduct,
    coverImage,
    photos,
    submitCustomBookOrder,
  ]);

  // ── Cleanup previews on unmount ───────────────────────────────────────
  useEffect(() => {
    return () => {
      photoPreviews.forEach(URL.revokeObjectURL);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [photoPreviews, coverPreview]);

  const value = {
    selectedProduct,
    selectProduct,
    form,
    updateForm,
    photos,
    photoPreviews,
    addPhotos,
    removePhoto,
    coverImage,
    coverPreview,
    setCover,
    removeCover,
    step,
    goToNextStep,
    goToPreviousStep,
    isSubmitting,
    orderSubmitted,
    orderId,
    submitOrder,
    resetOrder,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within OrderProvider");
  }
  return context;
};
