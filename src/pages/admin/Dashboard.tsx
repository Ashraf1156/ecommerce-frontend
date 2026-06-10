import type { FC } from "react";
import { useState, useEffect } from "react";
import api from "../../services/api";
import type { Product } from "../../types";
import {
  Smartphone,
  Tag,
  CheckCircle,
  XCircle,
  Trash2,
  LogOut,
  RefreshCw,
  ClipboardList,
  FolderOpen,
  Image as ImageIcon,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProductForm } from "./ProductForm"; // Imported Product Creation Form Component
import { CategoryManager } from "./CategoryManager"; // Imported Category Manager Component
import { HeroBannerManager } from "./HeroBannerManager"; // Imported Hero Banner Manager Component
import { SiteSettingsManager } from "./SiteSettingsManager"; // Imported Site Settings Manager Component

export const Dashboard: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "listings" | "categories" | "hero" | "settings"
  >("listings");
  const navigate = useNavigate();

  const fetchAdminInventory = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      // Calls secured backend endpoint using automatic Authorization Interceptor
      const response = await api.get<Product[]>("/admin/products");
      setProducts(response.data);
    } catch {
      setError(
        "Failed to stream management logs. Verify admin session status.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchAdminInventory();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleSold = async (
    id: number,
    currentSoldState: boolean,
  ): Promise<void> => {
    try {
      await api.patch(`/admin/products/${id}/toggle-sold`, {
        sold: !currentSoldState,
      });
      void fetchAdminInventory(); // Refresh view instantly
    } catch {
      alert("Error committing transactional patch update to database server.");
    }
  };

  const handleDeleteItem = async (id: number): Promise<void> => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this asset from inventory arrays?",
      )
    ) {
      return;
    }
    try {
      await api.delete(`/admin/products/${id}`);
      void fetchAdminInventory();
    } catch {
      alert("Failed to delete record from target repository connection.");
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem("admin_token");
    navigate("/");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      {/* Dashboard Control Header Panel */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Inventory Management
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Track listings, verify Cloudflare assets, and instantly adjust
            real-time catalog metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => void fetchAdminInventory()}
            className="inline-flex items-center justify-center p-2.5 text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Modern Premium Tab Swapper */}
      <div className="flex border-b border-gray-200 mb-8 gap-6">
        <button
          onClick={() => setActiveTab("listings")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "listings"
              ? "border-blue-600 text-blue-600 font-extrabold"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <ClipboardList size={16} />
          <span>Product Listings</span>
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "categories"
              ? "border-blue-600 text-blue-600 font-extrabold"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <FolderOpen size={16} />
          <span>Categories & Subcategories</span>
        </button>
        <button
          onClick={() => setActiveTab("hero")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "hero"
              ? "border-blue-600 text-blue-600 font-extrabold"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <ImageIcon size={16} />
          <span>Hero Banner</span>
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "settings"
              ? "border-blue-600 text-blue-600 font-extrabold"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Settings size={16} />
          <span>Site Settings</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "listings" ? (
        <div className="space-y-6">
          {/* 🚀 Render Item Creation Entry Form Component directly above data grids */}
          {!loading && !error && (
            <ProductForm onProductCreated={() => void fetchAdminInventory()} />
          )}

          {/* Main Content Layout Grid Area */}
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-gray-500">
              <RefreshCw className="animate-spin text-blue-600" size={32} />
              <p className="text-sm font-medium">
                Streaming secure database telemetry updates...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-700 shadow-sm">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center shadow-sm max-w-lg mx-auto mt-12">
              <Smartphone size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-base font-semibold text-gray-900">
                Your store database is completely clean
              </p>
              <p className="mt-1 text-sm text-gray-500 mb-6">
                Create your first entry item above to seed listings.
              </p>
            </div>
          ) : (
            /* Inventory Management Table */
            <div className="overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-500">
                      <th className="px-6 py-4">Item Details</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Quality Tier</th>
                      <th className="px-6 py-4">Availability</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {products.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50/70 transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {item.title}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                            {item.category?.code === "PHONE" ? (
                              <Smartphone size={12} />
                            ) : (
                              <Tag size={12} />
                            )}
                            {item.category?.name || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          ₹{item.price.toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold tracking-wide uppercase">
                            {item.deviceCondition}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              item.id &&
                              void handleToggleSold(item.id, item.sold)
                            }
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all border ${
                              item.sold
                                ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            }`}
                          >
                            {item.sold ? (
                              <XCircle size={14} />
                            ) : (
                              <CheckCircle size={14} />
                            )}
                            <span>
                              {item.sold ? "Mark Available" : "Mark Sold"}
                            </span>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              item.id && void handleDeleteItem(item.id)
                            }
                            className="p-2 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all inline-flex items-center"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === "categories" ? (
        <div className="animate-fade-in">
          <CategoryManager />
        </div>
      ) : activeTab === "hero" ? (
        <div className="animate-fade-in">
          <HeroBannerManager />
        </div>
      ) : (
        <div className="animate-fade-in">
          <SiteSettingsManager />
        </div>
      )}
    </div>
  );
};
