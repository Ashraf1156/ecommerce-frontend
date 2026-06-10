import type { FC } from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import type { Product } from "../types";
import {
  ArrowLeft,
  MessageCircle,
  RefreshCw,
  AlertCircle,
  Cpu,
  HardDrive,
  Palette,
  CheckCircle,
} from "lucide-react";

const formatCondition = (cond: string): string => {
  switch (cond) {
    case "BRAND_NEW":
      return "Brand New";
    case "LIKE_NEW":
      return "Like New";
    case "EXCELLENT":
      return "Excellent";
    case "GOOD":
      return "Good";
    case "USED":
      return "Used";
    default:
      return cond;
  }
};

const getConditionBadgeStyle = (cond: string): string => {
  switch (cond) {
    case "BRAND_NEW":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "LIKE_NEW":
    case "EXCELLENT":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "GOOD":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "USED":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export const ProductDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await api.get<Product>(`/products/${id}`);
        setProduct(response.data);
      } catch {
        setError("Failed to load product details. Item may have been removed.");
      } finally {
        setLoading(false);
      }
    };
    void fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 text-gray-500 bg-gray-50">
        <RefreshCw className="animate-spin text-blue-600" size={32} />
        <p className="text-sm font-medium">Loading premium product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-lg mt-20 px-4 text-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm space-y-4">
          <AlertCircle className="mx-auto text-red-600" size={40} />
          <h3 className="text-lg font-bold text-red-800">Details Unavailable</h3>
          <p className="text-sm text-red-650">{error || "Product not found."}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Return to Catalog</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleWhatsAppInquiry = () => {
    const message = `Hi, I am interested in purchasing this product listing:
    
*Product:* ${product.title}
*Condition:* ${formatCondition(product.deviceCondition)}
*Price:* ₹${product.price.toLocaleString("en-IN")}
    
Is this item still available for sale?`;
    
    const whatsappUrl = `https://wa.me/918074029899?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const imagesList = product.images && product.images.length > 0 ? product.images : [{ imageUrl: "" }];
  const mainImage = imagesList[activeImageIndex]?.imageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-gray-50 min-h-screen text-left">
      {/* Back to Catalog button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-650 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Catalog</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
            {product.sold && (
              <div className="absolute left-4 top-4 z-10 rounded-md bg-rose-600 px-2.5 py-1 text-xs font-semibold tracking-wide text-white uppercase shadow-sm animate-pulse">
                SOLD OUT
              </div>
            )}
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-102"
            />
          </div>

          {/* Thumbnail Strip */}
          {imagesList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 bg-gray-50 flex-shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === idx ? "border-blue-600 shadow-sm scale-98" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img src={img.imageUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details Content */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Breadcrumb / Category info */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <span>{product.category?.name}</span>
              {product.subcategory && (
                <>
                  <span>/</span>
                  <span className="text-gray-500">{product.subcategory.name}</span>
                </>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              {product.title}
            </h1>

            {/* Condition Badge and Price */}
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider shadow-inner ${getConditionBadgeStyle(product.deviceCondition)}`}
              >
                {formatCondition(product.deviceCondition)}
              </span>
              
              <span className="text-2xl font-black text-blue-600">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Phone Specifications Panel */}
            {product.category?.code === "PHONE" && product.phoneSpecification && (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 border-b border-gray-200/60 pb-2">
                  <Cpu size={14} className="text-gray-400" />
                  <span>Device Specifications</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-blue-500 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 block">Brand</span>
                      <span className="font-semibold text-gray-800">{product.phoneSpecification.brand}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu size={14} className="text-blue-500 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 block">Model</span>
                      <span className="font-semibold text-gray-800">{product.phoneSpecification.modelName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive size={14} className="text-blue-500 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 block">Storage</span>
                      <span className="font-semibold text-gray-800">{product.phoneSpecification.storageCapacity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette size={14} className="text-blue-500 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 block">Color</span>
                      <span className="font-semibold text-gray-800">{product.phoneSpecification.color}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Description / Check notes */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Device Condition Check Notes
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 border border-gray-100 rounded-2xl p-4 whitespace-pre-line">
                {product.description || "No specific condition check notes or test logs provided for this listing."}
              </p>
            </div>
          </div>

          {/* Action Call buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleWhatsAppInquiry}
              disabled={product.sold}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold shadow-md transition-all active:scale-[0.98] ${
                product.sold
                  ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-600/20"
              }`}
            >
              <MessageCircle size={18} />
              <span>{product.sold ? "Item Sold Out" : "Inquire on WhatsApp"}</span>
            </button>
            
            <p className="text-[11px] text-gray-400 text-center leading-normal">
              Clicking inquiry redirects to WhatsApp to coordinate secure payment, verified handoff, and immediate shipment.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
