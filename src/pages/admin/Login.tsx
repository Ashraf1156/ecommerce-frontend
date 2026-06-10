import type { FC, FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Lock,
  User,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Mail,
} from "lucide-react";

export const Login: FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Forgot Password State
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [email, setEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleLogin = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<{ token: string }>("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("admin_token", response.data.token);
      navigate("/admin/dashboard");
    } catch {
      setError(
        "Invalid administrative username or access password credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your admin email address.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/forgot-password", { email });
      setForgotSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Could not process request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="text-center relative">
          {isForgotMode && (
            <button
              onClick={() => {
                setIsForgotMode(false);
                setError(null);
                setForgotSuccess(false);
              }}
              className="absolute left-0 top-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-sm">
            TD
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            {isForgotMode ? "Forgot Password" : "Admin Login"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {isForgotMode
              ? "We will send you an email to reset your password."
              : "Provide system credentials to manage mobile stock indices."}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {forgotSuccess && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3.5 text-sm text-green-700">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0">
              <Lock size={12} className="text-white" />
            </div>
            <span>
              If an account matches that email, a password reset link has been
              sent.
            </span>
          </div>
        )}

        {/* Login Form */}
        {!isForgotMode && (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                    placeholder="admin"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Access Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(true);
                      setError(null);
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 outline-none transition-all active:scale-[0.99]"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading
                ? "Authorizing Session..."
                : "Access Inventory Dashboard"}
            </button>
          </form>
        )}

        {/* Forgot Password Form */}
        {isForgotMode && !forgotSuccess && (
          <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                  placeholder="admin@example.com"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !email}
              className="flex w-full justify-center items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 outline-none transition-all"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Sending Email..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
