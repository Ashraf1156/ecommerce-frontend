import type { FC, ChangeEvent } from "react";
import { useState, useEffect } from "react";
import api from "../../services/api";
import type { HeroImage } from "../../types";
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export const HeroBannerManager: FC = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHeroImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<HeroImage[]>("/hero-images");
      setHeroImages(response.data);
    } catch {
      setError("Failed to fetch hero banner images from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchHeroImages();
  }, []);

  const handleUploadHeroImage = async (
    e: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);

      // 1. Upload to Cloudflare R2 via existing backend endpoint
      const uploadResponse = await api.post<{ imageUrl: string }>(
        "/admin/products/upload-asset",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      const imageUrl = uploadResponse.data.imageUrl;
      if (!imageUrl) {
        throw new Error("No URL returned from upload");
      }

      // 2. Save hero image details to PostgreSQL database
      await api.post("/admin/hero-images", { imageUrl });

      // Refresh listings
      await fetchHeroImages();
    } catch (err) {
      console.error(err);
      alert("Failed to upload hero image. Ensure your R2/database configurations are healthy.");
    } finally {
      setUploading(false);
      // Reset the file input value
      e.target.value = "";
    }
  };

  const handleDeleteHeroImage = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this hero banner image?")) {
      return;
    }
    try {
      await api.delete(`/admin/hero-images/${id}`);
      await fetchHeroImages();
    } catch {
      alert("Failed to delete the selected hero image.");
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Upload and Control Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4 max-w-2xl">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <ImageIcon className="text-blue-600" size={20} />
          <h3 className="text-lg font-bold text-gray-900 font-sans">Manage Hero Banner</h3>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
          Upload landscape banners to cycle as slide galleries in the background of the customer catalog hero section.
          Images will be scaled and centered automatically. We recommend a wide aspect ratio (e.g. 16:9 or 21:9).
        </p>

        <div className="pt-2">
          <label className={`relative flex flex-col items-center justify-center border-2 border-dashed border-gray-350 hover:border-blue-500 rounded-2xl p-6 cursor-pointer bg-gray-50 hover:bg-blue-50/20 transition-all ${uploading ? "pointer-events-none opacity-50" : ""}`}>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => void handleUploadHeroImage(e)}
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-blue-600">
                <Loader2 className="animate-spin" size={28} />
                <span className="text-xs font-bold font-sans">Uploading to Cloudflare R2...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                <Upload size={28} />
                <span className="text-xs font-bold font-sans">Click to upload new banner image</span>
                <span className="text-[10px] text-gray-400 font-sans">Supports PNG, JPG, WEBP formats</span>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Grid of uploaded images */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-gray-150 pb-2">
          <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider font-sans">
            Active Hero Banner Slides
          </h3>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-sans">
            {heroImages.length} Slides active
          </span>
        </div>

        {loading ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 text-gray-400">
            <Loader2 className="animate-spin text-blue-600" size={24} />
            <p className="text-xs font-sans">Loading active slides...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-xs font-medium text-red-700 shadow-sm flex items-center justify-center gap-2">
            <AlertCircle size={16} />
            <span className="font-sans">{error}</span>
          </div>
        ) : heroImages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
            <HelpCircle className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-sm font-semibold text-gray-900 font-sans">No Active Hero Slides</p>
            <p className="text-xs text-gray-400 mt-1 font-sans">Currently displaying the default premium gradient background on the storefront.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {heroImages.map((img) => (
              <div
                key={img.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="aspect-[21/9] w-full bg-gray-100 rounded-xl overflow-hidden mb-3 border border-gray-100">
                  <img
                    src={img.imageUrl}
                    alt="Hero Slide"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-mono text-gray-400 select-all truncate max-w-[70%]">
                    {img.imageUrl}
                  </span>
                  <button
                    onClick={() => void handleDeleteHeroImage(img.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-100 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Delete Slide</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
