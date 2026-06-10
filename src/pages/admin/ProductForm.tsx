import type { FC, FormEvent, ChangeEvent } from "react";
import { useState, useEffect } from "react";
import api from "../../services/api";
import type { Category, DeviceCondition } from "../../types";
import {
  PlusCircle,
  Upload,
  Loader2,
  X,
} from "lucide-react";

interface ProductFormProps {
  onProductCreated: () => void;
}

export const ProductForm: FC<ProductFormProps> = ({ onProductCreated }) => {
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  
  // Dynamic Categories states
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number>(0);
  const [condition, setCondition] = useState<DeviceCondition>("BRAND_NEW");

  // Phone Specifications States
  const [brand, setBrand] = useState<string>("");
  const [storage, setStorage] = useState<string>("");
  const [color, setColor] = useState<string>("");

  // UPGRADED: Tracks an active array of verified Cloudflare R2 links
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);


  const fetchCategories = async () => {
    try {
      const response = await api.get<Category[]>("/categories");
      setCategories(response.data);
      if (response.data.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(response.data[0].id);
      }
    } catch {
      console.error("Failed to load dynamic categories");
    }
  };

  useEffect(() => {
    void fetchCategories();
  }, []);

  const handleMediaUpload = async (
    e: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);

      // Process files sequentially or map out for batch handling
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        const response = await api.post<{ imageUrl: string }>(
          "/admin/products/upload-asset",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );

        if (response.data.imageUrl) {
          setUploadedUrls((prev) => [...prev, response.data.imageUrl]);
        }
      }
    } catch {
      alert(
        "Failed to stream image binaries to Cloudflare R2 buckets. Verify bucket credentials.",
      );
    } finally {
      setUploading(false);
    }
  };

  const removeUploadedImage = (indexToRemove: number): void => {
    setUploadedUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (uploadedUrls.length === 0) {
      alert("Please upload at least one device image asset before publishing.");
      return;
    }
    if (!selectedCategoryId) {
      alert("Please select a valid Stock Category.");
      return;
    }
    setSubmitting(true);

    const selectedCat = categories.find((c) => c.id === selectedCategoryId);
    const isPhone = selectedCat?.code === "PHONE";

    // Maps out complete structured model payload matching backend schema requirements
    const payload = {
      title,
      price,
      description,
      category: { id: selectedCategoryId },
      subcategory: selectedSubcategoryId ? { id: selectedSubcategoryId } : null,
      deviceCondition: condition,
      images: uploadedUrls.map((url) => ({ imageUrl: url })),
      phoneSpecification:
        isPhone
          ? { brand, modelName: title, storageCapacity: storage, color }
          : null,
    };

    try {
      await api.post("/admin/products", payload);
      setTitle("");
      setPrice(0);
      setDescription("");
      setUploadedUrls([]);
      setBrand("");
      setStorage("");
      setColor("");
      setSelectedSubcategoryId(0);
      onProductCreated();
    } catch {
      alert("Failed to commit listing payload to database storage pools.");
    } finally {
      setSubmitting(false);
    }
  };


  const selectedCategoryCode = categories.find((c) => c.id === selectedCategoryId)?.code;

  return (
    <div className="space-y-6">
      {/* 🚀 Main Listing Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6 text-left"
      >
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
          <PlusCircle className="text-blue-600" size={20} />
          <span>Add New Asset Listing</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Product Title / Model Name
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="iPhone 16 Pro Max"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Listing Price (₹)
            </label>
            <input
              type="number"
              required
              value={price || ""}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="85000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Stock Category
            </label>
            <select
              value={selectedCategoryId}
              onChange={(e) => {
                const catId = Number(e.target.value);
                setSelectedCategoryId(catId);
                setSelectedSubcategoryId(0);
              }}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 outline-none"
            >
              <option value={0}>Select Category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Subcategory
            </label>
            <select
              value={selectedSubcategoryId}
              onChange={(e) => setSelectedSubcategoryId(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 outline-none"
              disabled={!categories.find((c) => c.id === selectedCategoryId)?.subcategories?.length}
            >
              <option value={0}>None (No Subcategory)</option>
              {categories.find((c) => c.id === selectedCategoryId)?.subcategories?.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Device Quality State
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as DeviceCondition)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 outline-none"
            >
              <option value="BRAND_NEW">Brand New</option>
              <option value="LIKE_NEW">Like New (No Visible Marks)</option>
              <option value="EXCELLENT">Excellent (Very Minor Signs of Use)</option>
              <option value="GOOD">Good (Some Small Scratches)</option>
              <option value="USED">Used (Visible Scratches & Wear)</option>
            </select>
          </div>
        </div>

        {selectedCategoryCode === "PHONE" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                Brand
              </label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                placeholder="Apple"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                Storage Capacity
              </label>
              <input
                type="text"
                required
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                placeholder="256 GB"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                Color Variant
              </label>
              <input
                type="text"
                required
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                placeholder="Coal Black"
              />
            </div>
          </div>
        )}

        {/* 🚀 Image Uploader */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Device Images Asset Pool ({uploadedUrls.length} uploaded)
          </label>

          {/* Live Grid Previews layout panel */}
          {uploadedUrls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {uploadedUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl border border-gray-200 overflow-hidden bg-white h-24 shadow-sm"
                >
                  <img
                    src={url}
                    alt={`Upload thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeUploadedImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-md bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-all opacity-90"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100/70 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                {uploading ? (
                  <>
                    <Loader2
                      className="animate-spin text-blue-600 mb-2"
                      size={24}
                    />
                    <p className="text-sm font-medium text-gray-600">
                      Streaming binary sequences to Cloudflare R2...
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="text-gray-400 mb-2" size={24} />
                    <p className="text-sm font-medium text-gray-600">
                      <span className="font-bold text-blue-600">
                        Click to upload multiple
                      </span>{" "}
                      or drag files
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Select one or more device files simultaneously
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                disabled={uploading || submitting}
                onChange={handleMediaUpload}
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Verification Context Notes
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 outline-none"
            placeholder="Describe condition details, battery status parameters..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting || uploading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 outline-none transition-all active:scale-[0.99] disabled:opacity-50"
        >
          {submitting ? <Loader2 className="animate-spin" size={16} /> : null}
          <span>
            {submitting ? "Publishing Listing..." : "Publish Item Entry Live"}
          </span>
        </button>
      </form>

    </div>
  );
};
