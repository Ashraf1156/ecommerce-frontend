import type { FC, FormEvent } from "react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { Lock, AlertCircle, Loader2 } from "lucide-react";

export const ResetPassword: FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing password reset token.");
    }
  }, [token]);

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/login");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to reset password. The token may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        
        <div className="text-center relative">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-sm">
            TD
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            Set New Password
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Please enter your new administrative password below.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3.5 text-sm text-green-700">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0">
              <Lock size={12} className="text-white" />
            </div>
            <span>Password reset successfully! Redirecting to login...</span>
          </div>
        )}

        {!success && (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    required
                    disabled={!token}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    required
                    disabled={!token}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="flex w-full justify-center items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 outline-none transition-all disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
