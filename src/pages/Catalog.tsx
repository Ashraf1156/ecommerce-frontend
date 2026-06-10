import type { FC, ReactNode } from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import type { Product, Category, DeviceCondition, HeroImage } from "../types";
import {
  Smartphone,
  Headphones,
  SlidersHorizontal,
  RefreshCw,
  X,
  Check,
  Tag,
} from "lucide-react";

// Pre-defined premium brand asset indices for matching filters dynamically
const BRAND_OPTIONS = [
  // Major Smartphone Brands
  { name: "Samsung", logoUrl: "https://cdn.simpleicons.org/samsung" },
  { name: "Apple", logoUrl: "https://cdn.simpleicons.org/apple" },
  { name: "Xiaomi", logoUrl: "https://cdn.simpleicons.org/xiaomi" },
  { name: "Redmi", logoUrl: "/redmi-2024-1.svg" },
  { name: "POCO", logoUrl: "https://cdn.simpleicons.org/poco" },
  { name: "vivo", logoUrl: "https://cdn.simpleicons.org/vivo" },
  { name: "iQOO", logoUrl: "https://cdn.simpleicons.org/iqoo" },
  { name: "OPPO", logoUrl: "https://cdn.simpleicons.org/oppo" },
  { name: "OnePlus", logoUrl: "https://cdn.simpleicons.org/oneplus" },
  { name: "Realme", logoUrl: "/realme-1.svg" },
  { name: "Motorola", logoUrl: "https://cdn.simpleicons.org/motorola" },
  { name: "Nothing", logoUrl: "https://cdn.simpleicons.org/nothing" },
  { name: "CMF", logoUrl: "https://cdn.simpleicons.org/cmf" },
  { name: "Google", logoUrl: "https://cdn.simpleicons.org/google" },
  { name: "Honor", logoUrl: "https://cdn.simpleicons.org/honor" },
  { name: "HMD", logoUrl: "https://cdn.simpleicons.org/hmd" },
  { name: "Nokia", logoUrl: "https://cdn.simpleicons.org/nokia" },
  { name: "Infinix", logoUrl: "/infinix-1.svg" },
  { name: "Tecno", logoUrl: "https://cdn.simpleicons.org/tecno" },
  { name: "Itel", logoUrl: "https://cdn.simpleicons.org/itel" },
  { name: "Acer", logoUrl: "https://cdn.simpleicons.org/acer" },
  // Indian Mobile Brands
  { name: "Lava", logoUrl: "https://cdn.simpleicons.org/lava" },
  { name: "Micromax", logoUrl: "https://cdn.simpleicons.org/micromax" },
  { name: "Karbonn", logoUrl: "https://cdn.simpleicons.org/karbonn" },
  { name: "Intex", logoUrl: "https://cdn.simpleicons.org/intex" },
  { name: "iBall", logoUrl: "https://cdn.simpleicons.org/iball" },
  { name: "Celkon", logoUrl: "https://cdn.simpleicons.org/celkon" },
  { name: "Ai+", logoUrl: "https://cdn.simpleicons.org/aiplus" },
  { name: "JioPhone", logoUrl: "https://cdn.simpleicons.org/jio" },
];

const CUSTOM_LOGOS: Record<string, ReactNode> = {
  POCO: (
    <svg
      viewBox="0 0 100 30"
      className="w-full h-full text-black"
      fill="currentColor"
    >
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="950"
        fontSize="28"
        letterSpacing="0.5"
      >
        POCO
      </text>
    </svg>
  ),
  iQOO: (
    <svg viewBox="0 0 100 30" className="w-full h-full">
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="950"
        fontSize="28"
        letterSpacing="-0.5"
      >
        <tspan fill="#F59E0B">i</tspan>
        <tspan fill="#0F172A">QOO</tspan>
      </text>
    </svg>
  ),
  Nothing: (
    <svg viewBox="0 0 100 25" className="w-full h-full">
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="18"
        letterSpacing="2.5"
        fill="#0F172A"
      >
        NOTHING
      </text>
    </svg>
  ),
  CMF: (
    <svg viewBox="0 0 100 30" className="w-full h-full">
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="32"
        fill="#FF5A00"
        letterSpacing="-1.5"
      >
        cmf
      </text>
    </svg>
  ),
  HMD: (
    <svg viewBox="0 0 100 30" className="w-full h-full">
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="950"
        fontSize="32"
        fill="#0284C7"
        letterSpacing="0.5"
      >
        HMD
      </text>
    </svg>
  ),
  Tecno: (
    <svg viewBox="0 0 100 30" className="w-full h-full">
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="950"
        fontSize="26"
        fill="#1E40AF"
        letterSpacing="0.5"
      >
        TECNO
      </text>
    </svg>
  ),
  Itel: (
    <svg viewBox="0 0 100 30" className="w-full h-full">
      <text
        x="50%"
        y="52%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="30"
        fill="#E11D48"
        fontStyle="italic"
      >
        itel
      </text>
    </svg>
  ),
  Lava: (
    <svg viewBox="0 0 100 30" className="w-full h-full">
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="950"
        fontSize="32"
        fill="#DC2626"
        letterSpacing="0.5"
      >
        LAVA
      </text>
    </svg>
  ),
  Micromax: (
    <svg viewBox="0 0 100 28" className="w-full h-full">
      <g transform="translate(6, 2) scale(0.85)">
        <path
          d="M5,15 C5,8 10,5 15,5 C18,5 20,7 20,10 C20,7 23,5 26,5 C29,5 31,7 31,10 C31,7 34,5 37,5 C41,5 44,8 44,13 L44,22 C44,27 39,30 33,30 L15,30 C9,30 5,26 5,20 Z"
          fill="#FF6B00"
        />
        <path
          d="M12,12 L18,12 C20,12 21,13 21,15 L21,20 C21,22 20,23 18,23 L12,23 C10,23 9,22 9,20 L9,15 C9,13 10,12 12,12 Z"
          fill="#1E3A8A"
        />
      </g>
      <text
        x="68"
        y="18"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="950"
        fontSize="12"
        fill="#1E3A8A"
        textAnchor="middle"
      >
        MICROMAX
      </text>
    </svg>
  ),
  Karbonn: (
    <svg viewBox="0 0 100 30" className="w-full h-full">
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="24"
        fill="#E11D48"
      >
        Karbonn
      </text>
    </svg>
  ),
  Intex: (
    <svg viewBox="0 0 100 30" className="w-full h-full">
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="950"
        fontSize="26"
        fill="#1E3A8A"
        letterSpacing="-0.5"
      >
        INTEX
      </text>
    </svg>
  ),
  iBall: (
    <svg viewBox="0 0 100 30" className="w-full h-full">
      <text
        x="45%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="26"
        fill="#0F172A"
        letterSpacing="-0.5"
      >
        iBall
      </text>
      <circle cx="70" cy="9" r="4.5" fill="#EF4444" />
    </svg>
  ),
  Celkon: (
    <svg viewBox="0 0 100 30" className="w-full h-full">
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="950"
        fontSize="24"
        fill="#B91C1C"
        letterSpacing="0.5"
      >
        CELKON
      </text>
    </svg>
  ),
  "Ai+": (
    <svg viewBox="0 0 100 30" className="w-full h-full">
      <defs>
        <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <text
        x="50%"
        y="55%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="950"
        fontSize="32"
        fill="url(#aiGrad)"
      >
        Ai+
      </text>
    </svg>
  ),
};

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

interface BrandLogoProps {
  name: string;
  logoUrl: string;
}

const BrandLogo: FC<BrandLogoProps> = ({ name, logoUrl }) => {
  const [hasError, setHasError] = useState(false);

  if (CUSTOM_LOGOS[name]) {
    return (
      <div className="w-full h-full p-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
        {CUSTOM_LOGOS[name]}
      </div>
    );
  }

  if (hasError || !logoUrl) {
    return (
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center font-black text-blue-700 text-xs sm:text-sm shadow-inner select-none transition-transform duration-300 group-hover:scale-110">
        {name.substring(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${name} logo`}
      onError={() => setHasError(true)}
      className="w-[82%] h-[58%] object-contain transition-transform duration-300 group-hover:scale-110"
    />
  );
};

export const Catalog: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Dynamic Categories list
  const [categories, setCategories] = useState<Category[]>([]);

  // Hero Banner Images
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState<number>(0);

  // Filtering States Matrix
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string>("PHONE");
  const [selectedSubcategoryCode, setSelectedSubcategoryCode] =
    useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<
    DeviceCondition | ""
  >("");
  const [maxPrice, setMaxPrice] = useState<number>(150000);

  // Pagination Matrix
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryCode, selectedSubcategoryCode, selectedBrand, selectedCondition, maxPrice]);


  useEffect(() => {
    const fetchCategoriesList = async () => {
      try {
        const response = await api.get<Category[]>("/categories");
        setCategories(response.data);
      } catch {
        console.error("Failed to fetch categories");
      }
    };
    void fetchCategoriesList();
  }, []);

  useEffect(() => {
    const fetchHeroImagesList = async () => {
      try {
        const response = await api.get<HeroImage[]>("/hero-images");
        setHeroImages(response.data);
      } catch {
        console.error("Failed to fetch hero images");
      }
    };
    void fetchHeroImagesList();
  }, []);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages]);

  useEffect(() => {
    const fetchFilteredCatalog = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await api.get<Product[]>("/products", {
          params: {
            category: selectedCategoryCode || null,
            subcategory: selectedSubcategoryCode || null,
            brand: selectedBrand || null,
            condition: selectedCondition || null,
            maxPrice: maxPrice,
          },
        });
        setProducts(response.data);
      } catch {
        console.error("Failed to load matching marketplace inventory items.");
      } finally {
        setLoading(false);
      }
    };

    void fetchFilteredCatalog();
  }, [
    selectedCategoryCode,
    selectedSubcategoryCode,
    selectedBrand,
    selectedCondition,
    maxPrice,
  ]);

  const handleSelectCategory = (code: string) => {
    setSelectedCategoryCode(code);
    setSelectedSubcategoryCode("");
    setSelectedBrand("");
  };

  const clearAllFilters = () => {
    setSelectedCategoryCode("PHONE");
    setSelectedSubcategoryCode("");
    setSelectedBrand("");
    setSelectedCondition("");
    setMaxPrice(150000);
  };

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-gray-50 min-h-screen text-left">
      {/* 🚀 PREMIUM HERO BANNER SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 mb-8 shadow-xl border border-indigo-950">
        {heroImages.length > 0 ? (
          <>
            {heroImages.map((img, index) => (
              <img
                key={img.id}
                src={img.imageUrl}
                alt="Store Banner"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                  index === currentHeroIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            {/* Dark overlay to ensure readability */}
            <div className="absolute inset-0 bg-slate-950/50 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>
          </>
        ) : (
          <>
            {/* Background ambient glowing shapes */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
          </>
        )}

        <div className="relative max-w-2xl z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 !text-indigo-300 border border-indigo-500/30 mb-4 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
            Verified Store Inventory
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight !text-white mb-4 leading-tight">
            Premium Mobiles
            <br />& Accessories
          </h1>
          <p className="text-sm sm:text-base !text-slate-300 mb-6 leading-relaxed max-w-xl">
            Explore certified, hand-tested new and pre-owned smartphones, plus
            premium accessories.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                const el = document.getElementById("catalog-grid");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 !text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-900/40 transition-all active:scale-[0.98] cursor-pointer"
            >
              Explore Catalog
            </button>
            <a
              href="https://wa.me/918074029899" //TODO-NUMBER
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 !text-slate-200 rounded-xl text-xs sm:text-sm font-bold border border-slate-700 transition-all hover:border-slate-600 active:scale-[0.98] inline-flex items-center gap-1.5"
            >
              Contact Store
            </a>
          </div>
        </div>
      </div>

      {/* 🌟 1. CATEGORY GRID BOXES (Dynamically rendered) */}
      <div className="mb-8 flex flex-col items-center">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 text-center">
          Browse Categories
        </h3>
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-3xl">
          {categories.map((cat) => {
            const isSelected = selectedCategoryCode === cat.code;
            let IconComponent = Tag;
            const codeUpper = cat.code.toUpperCase();
            if (codeUpper === "PHONE" || codeUpper === "PHONES") IconComponent = Smartphone;
            else if (codeUpper === "ACCESSORY" || codeUpper === "ACCESSORIES") IconComponent = Headphones;

            let descriptionText = `Explore our collection of ${cat.name.toLowerCase()}`;
            if (codeUpper === "PHONE" || codeUpper === "PHONES") {
              descriptionText = "Verified and premium mobile units";
            } else if (codeUpper === "ACCESSORY" || codeUpper === "ACCESSORIES") {
              descriptionText = "Audio, chargers, cases and gear";
            }

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelectCategory(cat.code)}
                className={`flex items-center gap-4 p-5 rounded-2xl border bg-white shadow-sm transition-all duration-200 active:scale-[0.98] w-full sm:w-80 cursor-pointer ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/40 text-blue-600 ring-2 ring-blue-600/20"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                <div
                  className={`p-3 rounded-xl ${isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}
                >
                  <IconComponent size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">{cat.name}</p>
                  <p className="text-xs text-gray-400">{descriptionText}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🌟 1b. SUBCATEGORY PILLS (Shown dynamically when the selected category has subcategories) */}
      {(() => {
        const activeCategory = categories.find(
          (c) => c.code === selectedCategoryCode,
        );
        if (
          !activeCategory ||
          !activeCategory.subcategories ||
          activeCategory.subcategories.length === 0
        ) {
          return null;
        }
        return (
          <div className="mb-6 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm transition-all duration-300">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              Filter by Subcategory
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedSubcategoryCode("")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  selectedSubcategoryCode === ""
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                All {activeCategory.name}
              </button>
              {activeCategory.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() =>
                    setSelectedSubcategoryCode(
                      selectedSubcategoryCode === sub.code ? "" : sub.code,
                    )
                  }
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    selectedSubcategoryCode === sub.code
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* 🌟 2. POPULAR BRAND SELECTION ICONS */}
      {selectedCategoryCode.toUpperCase() !== "ACCESSORY" && selectedCategoryCode.toUpperCase() !== "ACCESSORIES" && (
        <div className="mb-12 mt-12">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-10 text-center">
            Shop By Popular Brand
          </h3>
          <div className="flex flex-wrap gap-6 sm:gap-8 justify-center">
            {BRAND_OPTIONS.map((brand) => {
              const isSelected = selectedBrand === brand.name;
              return (
                <button
                  key={brand.name}
                  type="button"
                  onClick={() => setSelectedBrand(isSelected ? "" : brand.name)}
                  className="flex flex-col items-center group focus:outline-none cursor-pointer"
                >
                  {/* Colored Squircle Container */}
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-[28px] flex items-center justify-center shadow-sm transition-all duration-300 relative ${
                      isSelected
                        ? "bg-blue-100/80 border-2 border-blue-600 ring-4 ring-blue-600/10 scale-95"
                        : "bg-blue-50/50 border border-blue-100/30 hover:bg-blue-50 hover:scale-105 hover:shadow-md"
                    }`}
                  >
                    {/* Selected checkmark indicator inside the squircle */}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center p-0.5 shadow-md border border-white">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                    <BrandLogo name={brand.name} logoUrl={brand.logoUrl} />
                  </div>
                  {/* External Underneath Label */}
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase mt-2.5 transition-colors duration-200 ${
                      isSelected
                        ? "text-blue-600 font-extrabold"
                        : "text-gray-500 group-hover:text-gray-800"
                    }`}
                  >
                    {brand.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Layout Block */}
      <div id="catalog-grid" className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Search Filter Panel */}
        <div className="w-full lg:w-64 flex-shrink-0 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-5 h-fit">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-gray-400" />
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Filters
              </h2>
            </div>
            {(selectedCategoryCode ||
              selectedSubcategoryCode ||
              selectedBrand ||
              selectedCondition) && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-600 font-semibold flex items-center gap-0.5 hover:underline"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>

          {/* 🌟 3. BRAND SELECTION DROPDOWN IN FILTER SIDEBAR */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
              Select Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="">All Brands</option>
              {BRAND_OPTIONS.map((brand) => (
                <option key={brand.name} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Select Option Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2">
              Condition Quality
            </label>
            <select
              value={selectedCondition}
              onChange={(e) =>
                setSelectedCondition(e.target.value as DeviceCondition | "")
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="">Any</option>
              <option value="BRAND_NEW">Brand New</option>
              <option value="LIKE_NEW">Like New (No Visible Marks)</option>
              <option value="EXCELLENT">
                Excellent (Very Minor Signs of Use)
              </option>
              <option value="GOOD">Good (Some Small Scratches)</option>
              <option value="USED">Used (Visible Scratches & Wear)</option>
            </select>
          </div>

          {/* Maximum Price Constraint Slider */}
          <div>
            <div className="flex justify-between text-xs font-bold uppercase text-gray-400 mb-2">
              <span>Max Budget</span>
              <span className="text-blue-600 font-extrabold">
                ₹{maxPrice.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={150000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        {/* Right Side: Catalog Grid Matrix View */}
        <div className="flex-1">
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 text-gray-400">
              <RefreshCw className="animate-spin text-blue-600" size={28} />
              <p className="text-sm font-medium">
                Re-indexing matching catalog feeds...
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md mx-auto mt-6">
              <p className="text-base font-bold text-gray-900">
                No active stock matching filters
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try resetting selected Filters or widening budget thresholds.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((item) => (
                  <Link
                    key={item.id}
                    to={`/product/${item.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group cursor-pointer hover:border-blue-500 hover:ring-2 hover:ring-blue-100"
                  >
                    <div className="h-44 bg-gray-100 relative overflow-hidden">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0].imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                          <Smartphone size={32} />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-gray-100 text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md uppercase text-gray-600 shadow-sm">
                        {formatCondition(item.deviceCondition)}
                      </span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {item.description ||
                            "No condition check notes provided."}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-lg font-black text-gray-950">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-md text-gray-500">
                          {item.category?.name || "Uncategorized"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* 🌟 PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      const el = document.getElementById("catalog-grid");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-xs font-bold text-gray-750 bg-white border border-gray-250 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none rounded-xl transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        const el = document.getElementById("catalog-grid");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`w-9 h-9 text-xs font-bold rounded-xl transition-all active:scale-[0.98] cursor-pointer border ${
                        currentPage === page
                          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      const el = document.getElementById("catalog-grid");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-xs font-bold text-gray-750 bg-white border border-gray-250 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none rounded-xl transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
