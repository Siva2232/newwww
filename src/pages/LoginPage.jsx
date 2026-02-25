// src/pages/LoginPage.jsx
import { useState } from "react";
import { useProducts } from "../Context/ProductContext"; // assuming this exists
import { Package } from "lucide-react";

import { loginAdmin } from "../api"; // real login endpoint
export default function LoginPage() {
  const { login, isAuthenticated } = useProducts();
  const [email, setEmail] = useState("");       // changed from username → email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginAdmin(email, password);

      // You need to decide what your real API returns. Common patterns:
      // ───────────────────────────────────────────────────────────────
      // Option A: returns { token, user }
      if (data.token) {
        // Save token (localStorage, context, cookie, etc)
        localStorage.setItem("adminToken", data.token);
        login(); // call context login → sets isAuthenticated true
        // Optional: redirect here or let router handle it
      }
      
      // Option B: returns { success: true, message: "Logged in" }
      else if (data.success) {
        login();
      }
      
      // Option C: just returns user object when successful
      else if (data.email || data.id) {
        login();
      }
      
      // If none of the above match → adjust according to your actual response
      else {
        setError(data.message || "Login failed - unexpected response");
      }
    } catch (err) {
      setError(
        err.message.includes("Failed to fetch")
          ? "Cannot reach server. Is backend running?"
          : "Login failed. Check credentials or server."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard"/>; // or <Navigate to="/dashboard" replace /> if using react-router
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500 rounded-full mb-4">
            <Package size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Admin Login</h1>
          <p className="text-gray-600 mt-2">Manage your store content</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Email/Username
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password123"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-4 rounded-xl transition shadow-lg transform hover:scale-105 ${
              loading
                ? "bg-amber-400 cursor-not-allowed"
                : "bg-amber-600 hover:bg-amber-700 text-white"
            }`}
          >
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </form>

        {/* Remove or comment out demo credentials in production */}
        {/* <div className="mt-8 p-4 bg-gray-50 rounded-xl text-center text-sm text-gray-600">
          <p className="font-bold text-gray-800">Demo Credentials:</p>
          <p className="mt-1">
            Email: <span className="font-mono font-bold">admin@example.com</span>
            <br />
            Password: <span className="font-mono font-bold">your_real_password</span>
          </p>
        </div> */}
      </div>
    </div>
  );
}