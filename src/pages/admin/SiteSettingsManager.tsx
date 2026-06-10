import type { FC, ChangeEvent, FormEvent } from "react";
import { useState, useEffect } from "react";
import { Settings, Save, ImagePlus, Loader2, AlertCircle } from "lucide-react";
import api from "../../services/api";
import type { StoreSettings } from "../../types";

export const SiteSettingsManager: FC = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get<StoreSettings>("/settings");
      setSettings(res.data);
    } catch (err: any) {
      setError("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!settings) return;
    setSettings({ ...settings, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    try {
      setUploadingImage(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<{ imageUrl: string }>(
        "/admin/products/upload-asset",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (settings) {
        setSettings({ ...settings, logoUrl: response.data.imageUrl });
      }
    } catch (err: any) {
      setError("Failed to upload image.");
    } finally {
      setUploadingImage(false);
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      await api.put<StoreSettings>("/admin/settings", settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="mb-8 border-b border-gray-100 pb-5">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="text-blue-600" /> Site Configuration
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your website's logo, global name, and footer details.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 border border-green-100">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0">
            <Settings size={12} className="text-white" />
          </div>
          <p className="text-sm font-semibold">Settings saved successfully!</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        {/* Header Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Header Settings</h3>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Website Name</label>
            <input
              type="text"
              name="websiteName"
              value={settings.websiteName}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Website Logo</label>
            <div className="flex items-center gap-4 mt-2">
              <div className="w-20 h-20 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo preview" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-xs text-gray-400 font-medium">No Logo</span>
                )}
              </div>
              <div className="flex-1">
                <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  uploadingImage ? "bg-gray-100 text-gray-400" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}>
                  {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                  {uploadingImage ? "Uploading..." : "Upload New Logo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Upload an image (PNG, JPG, SVG). It will be scaled to fit the header layout.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="my-6 border-t border-gray-100"></div>

        {/* Footer Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Footer Settings</h3>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Footer Description</label>
            <textarea
              name="footerDescription"
              value={settings.footerDescription}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Contact Phone</label>
              <input
                type="text"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp Number</label>
              <input
                type="text"
                name="whatsappNumber"
                value={settings.whatsappNumber}
                onChange={handleChange}
                placeholder="e.g. 918074029899"
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Store Address</label>
            <textarea
              name="contactAddress"
              value={settings.contactAddress}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving || uploadingImage}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};
