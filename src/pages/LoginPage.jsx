import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useProducts } from "../Context/ProductContext";
import { loginAdmin } from "../api";
import {
  Mail,
  Lock,
  Loader2,
  Sparkles,
  Shield,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import logo from "../assets/hhhh.jpg";

const inputClass =
  "w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition text-sm";

export default function LoginPage() {
  const { login, isAuthenticated } = useProducts();
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginAdmin(email, password);

      if (data.token) {
        localStorage.setItem("adminToken", data.token);
        login();
        toast.success("Welcome back!");
      } else if (data.success) {
        login();
        toast.success("Welcome back!");
      } else if (data.email || data.id) {
        login();
        toast.success("Welcome back!");
      } else {
        setError(data.message || "Login failed — unexpected response");
      }
    } catch (err) {
      setError(
        err.message?.includes("Failed to fetch")
          ? "Cannot reach server. Is the backend running on port 5000?"
          : "Invalid email or password. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Brand panel — desktop */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-fuchsia-400/40 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-sm border border-white/20">
              <Sparkles size={14} />
              Admin Console
            </div>
          </div>

          <div className="space-y-8">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-white shadow-2xl shadow-indigo-900/30">
              <img
                src={logo}
                alt="Perfect Digital Press"
                className="h-16 xl:h-20 w-auto max-w-[280px] object-contain"
              />
            </div>
            <div>
              <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
                Perfect Digital Press
              </h1>
              <p className="text-lg text-indigo-100/90 mt-3 max-w-md leading-relaxed">
                Manage products, banners, categories, and custom orders from one
                beautiful dashboard.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-indigo-100/95">
              {[
                "Full catalog & inventory control",
                "Homepage banners & featured picks",
                "Custom book orders inbox",
              ].map((text) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Shield size={12} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-indigo-200/80">
            © {new Date().getFullYear()} Perfect Digital Press · Store Manager
          </p>
        </div>
      </div>

      {/* Login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-[#f8f9fc]">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/60 mb-5">
              <img
                src={logo}
                alt="Perfect Digital Press"
                className="h-12 w-auto max-w-[200px] object-contain"
              />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Store Manager
            </h1>
            <p className="text-sm text-slate-500 mt-1">Sign in to your admin panel</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-8 sm:p-10">
            <div className="hidden lg:block mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200/60 mb-4">
                <LayoutDashboard size={24} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Welcome back</h2>
              <p className="text-sm text-slate-500 mt-1">
                Enter your credentials to access the dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gmail.com"
                    required
                    autoComplete="username"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className={inputClass}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                  <span className="font-medium leading-snug">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-lg shadow-indigo-300/40 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Login to Dashboard
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2">
                Dev credentials
              </p>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-600">
                <span>
                  <span className="text-slate-400">Email:</span>{" "}
                  <code className="font-semibold text-indigo-700">admin@gmail.com</code>
                </span>
                <span>
                  <span className="text-slate-400">Pass:</span>{" "}
                  <code className="font-semibold text-indigo-700">password123</code>
                </span>
              </div>
            </div> */}
          </div>

          <p className="text-center text-xs text-slate-400 mt-6 lg:hidden">
            Perfect Digital Press · Admin access only
          </p>
        </div>
      </div>
    </div>
  );
}
