import { useState, useEffect } from "react";
import {
  ChevronDown,
  User,
  Phone,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import AdminOrderDetail from "./AdminOrderDetail";

import { getCustomBookOrders } from "../../api";

// Helper to fix image URLs (VERY IMPORTANT for /uploads/... paths)
const getImageUrl = (path) => {
  if (!path) return "/vite.svg"; // fallback image in public folder

  // If already full URL (rare), return as-is
  if (path.startsWith("http") || path.startsWith("//")) {
    return path;
  }

  // Most common case: backend serves from /uploads
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
  const url = `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  // Debug log for image URL
  console.log("Image URL generated:", url);
  return url;
};

export default function AdminCustomOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const closeDetail = () => setSelectedOrder(null);

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getCustomBookOrders({ page, limit: 10 });
      
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders(data.orders || []);
        setPagination(data.pagination || { page: 1, pages: 1 });
      }
    } catch (err) {
      setError(err.message || "Failed to load orders");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="animate-spin mb-3" size={32} />
        <p>Loading custom book orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 border border-red-200 rounded-xl m-6 bg-red-50">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500 border border-dashed rounded-xl m-6">
        No custom photo book orders received yet.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Custom Photo Book Orders
      </h2>

      <div className="space-y-4">
        {orders.map((order) => {
          // Debug log – helps you see real paths coming from backend
          console.log(
            `Order ${order._id.slice(-6)} → cover:`,
            order.coverImage,
          );

          return (
            <div
              key={order._id}
              onClick={() => setSelectedOrder(order)}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer overflow-hidden"
            >
              <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/60">
                <div className="flex items-start gap-4">
                  {/* Small cover preview thumbnail */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-300 shadow-sm">
                    {order.coverImage ? (
                      <img
                        src={getImageUrl(order.coverImage)}
                        alt="Cover preview"
                        className="w-full h-full object-cover bg-white"
                        onError={(e) => {
                          e.target.src = "/vite.svg";
                          e.target.onerror = null;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-white">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="font-semibold text-lg">
                      {order.book?.name || order.bookName || ""}
                    </div>
                    <div className="text-sm text-gray-600 flex flex-wrap items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {order.customer?.name || "—"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={14} />
                        {order.customer?.phone || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right sm:text-center flex flex-col gap-1">
                  <div className="font-bold text-lg text-gray-900">
                    {order.book?.price || order.bookPrice || ""}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                  <div className="text-xs mt-1">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.status || "Pending"}
                    </span>
                  </div>
                </div>

                <ChevronDown
                  size={20}
                  className="text-gray-400 hidden sm:block"
                />
              </div>

              {/* Quick info row */}
              <div className="px-5 py-3 bg-white border-t text-sm text-gray-600 flex justify-between items-center">
                <div>{order.photos?.length || 0} photos uploaded</div>
                {order.coverImage && (
                  <div className="text-indigo-600">Cover image included</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination UI */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 pb-10">
          <button
            onClick={() => fetchOrders(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm font-medium">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => fetchOrders(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {selectedOrder && (
        <AdminOrderDetail order={selectedOrder} onClose={closeDetail} />
      )}
    </div>
  );
}
