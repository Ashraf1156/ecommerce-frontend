import type { FC } from "react";
import type { Product } from "../types";
import { MessageCircle } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onInquire: (product: Product) => void;
}

export const ProductCard: FC<ProductCardProps> = ({
  product,
  onInquire,
}) => {
  // Gracefully pull the primary display photo or a fallback placeholder if empty
  const displayImage =
    product.images && product.images.length > 0
      ? product.images[0].imageUrl
      : "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60";

  // Format conditions cleanly with unique semantic badge stylings matching UntitledUI guidelines
  const getConditionColor = (cond: string) => {
    switch (cond) {
      case "MINT":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "EXCELLENT":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "GOOD":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${product.sold ? "opacity-85" : ""}`}
    >
      {/* Visual Sold Out Temporal Window Indicator Overlay */}
      {product.sold && (
        <div className="absolute left-3 top-3 z-10 rounded-md bg-rose-600 px-2.5 py-1 text-xs font-semibold tracking-wide text-white uppercase shadow-sm animate-pulse">
          SOLD OUT
        </div>
      )}

      {/* Product Image Cluster container */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
        <img
          src={displayImage}
          alt={product.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute right-3 top-3 inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider shadow-sm backdrop-blur-md ${getConditionColor(product.deviceCondition)}`}
        >
          {product.deviceCondition}
        </span>
      </div>

      {/* Card Body Descriptive Content Area */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
          <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Polymorphic Extended Specifics Row */}
        {product.category?.code === "PHONE" && product.phoneSpecification && (
          <div className="mb-4 flex flex-wrap gap-1.5 text-xs font-medium text-gray-500">
            <span className="rounded-md bg-gray-100 px-2 py-0.5">
              {product.phoneSpecification.brand}
            </span>
            <span className="rounded-md bg-gray-100 px-2 py-0.5">
              {product.phoneSpecification.storageCapacity}
            </span>
            <span className="rounded-md bg-gray-100 px-2 py-0.5">
              {product.phoneSpecification.color}
            </span>
          </div>
        )}

        <p className="mb-5 text-sm text-gray-500 line-clamp-2 flex-1">
          {product.description ||
            "No specific verification context listed for this item."}
        </p>

        {/* Interactive Dynamic Action Button */}
        <button
          onClick={() => onInquire(product)}
          disabled={product.sold}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 shadow-sm ${
            product.sold
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
              : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98]"
          }`}
        >
          <MessageCircle size={18} />
          {product.sold ? "Item Sold Out" : "Inquire on WhatsApp"}
        </button>
      </div>
    </div>
  );
};
