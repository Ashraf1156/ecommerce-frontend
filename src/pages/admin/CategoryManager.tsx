import type { FC, FormEvent } from "react";
import { useState, useEffect } from "react";
import api from "../../services/api";
import type { Category } from "../../types";
import {
  FolderPlus,
  Plus,
  Trash2,
  Tag,
  Smartphone,
  Layers,
  X,
  Loader2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

export const CategoryManager: FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Forms states
  const [newCatName, setNewCatName] = useState<string>("");
  const [newCatCode, setNewCatCode] = useState<string>("");
  const [newSubName, setNewSubName] = useState<string>("");
  const [newSubCode, setNewSubCode] = useState<string>("");
  const [selectedParentId, setSelectedParentId] = useState<number>(0);

  const [creatingCategory, setCreatingCategory] = useState<boolean>(false);
  const [creatingSubcategory, setCreatingSubcategory] = useState<boolean>(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Category[]>("/categories");
      setCategories(response.data);
      if (response.data.length > 0 && !selectedParentId) {
        setSelectedParentId(response.data[0].id);
      }
    } catch {
      setError("Failed to stream categories list from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCategories();
  }, []);

  const handleCreateCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      setCreatingCategory(true);
      const code = newCatCode.trim() 
        ? newCatCode.trim().toUpperCase().replaceAll("\\s+", "_") 
        : newCatName.trim().toUpperCase().replaceAll("\\s+", "_");

      await api.post("/admin/categories", {
        name: newCatName.trim(),
        code,
      });

      setNewCatName("");
      setNewCatCode("");
      await fetchCategories();
    } catch {
      alert("Failed to create new category. Code may already exist.");
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleCreateSubcategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !selectedParentId) return;
    try {
      setCreatingSubcategory(true);
      const code = newSubCode.trim()
        ? newSubCode.trim().toUpperCase().replaceAll("\\s+", "_")
        : newSubName.trim().toUpperCase().replaceAll("\\s+", "_");

      await api.post(`/admin/categories/${selectedParentId}/subcategories`, {
        name: newSubName.trim(),
        code,
      });

      setNewSubName("");
      setNewSubCode("");
      await fetchCategories();
    } catch {
      alert("Failed to create new subcategory under the chosen category.");
    } finally {
      setCreatingSubcategory(false);
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the category "${name}"?`)) {
      return;
    }
    try {
      await api.delete(`/admin/categories/${id}`);
      await fetchCategories();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to delete category. Ensure no products are currently associated with it.");
      }
    }
  };

  const handleDeleteSubcategory = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the subcategory "${name}"?`)) {
      return;
    }
    try {
      await api.delete(`/admin/subcategories/${id}`);
      await fetchCategories();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to delete subcategory. Ensure no products are currently associated with it.");
      }
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Forms Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Creation Form Card */}
        <form
          onSubmit={handleCreateCategory}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <FolderPlus className="text-blue-600" size={20} />
            <h3 className="text-lg font-bold text-gray-900">Add New Category</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                Category Name
              </label>
              <input
                type="text"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Laptops"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1 flex items-center gap-1">
                Category Code <span className="text-gray-400 normal-case font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={newCatCode}
                onChange={(e) => setNewCatCode(e.target.value)}
                placeholder="e.g. LAPTOP"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            Categories represent top-level tabs (e.g. Smartphones, Accessories, or future expansions like Laptops).
            If code is empty, it will be automatically derived from the name.
          </p>

          <button
            type="submit"
            disabled={creatingCategory || !newCatName.trim()}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 outline-none transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {creatingCategory ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
            <span>Create Category</span>
          </button>
        </form>

        {/* Subcategory Creation Form Card */}
        <form
          onSubmit={handleCreateSubcategory}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Layers className="text-indigo-600" size={20} />
            <h3 className="text-lg font-bold text-gray-900">Add New Subcategory</h3>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              Parent Category
            </label>
            <select
              required
              value={selectedParentId}
              onChange={(e) => setSelectedParentId(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 outline-none cursor-pointer transition-all"
            >
              <option value={0} disabled>Select Parent Category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                Subcategory Name
              </label>
              <input
                type="text"
                required
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
                placeholder="e.g. Chargers & Cables"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1 flex items-center gap-1">
                Subcategory Code <span className="text-gray-400 normal-case font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={newSubCode}
                onChange={(e) => setNewSubCode(e.target.value)}
                placeholder="e.g. CHARGERS_CABLES"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            Subcategories partition categories into finer collections (e.g. Audio, Cases under Accessories, or Gaming under Laptops).
          </p>

          <button
            type="submit"
            disabled={creatingSubcategory || !newSubName.trim() || !selectedParentId}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 outline-none transition-all active:scale-[0.99] disabled:opacity-50"
          >
            {creatingSubcategory ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
            <span>Create Subcategory</span>
          </button>
        </form>
      </div>

      {/* Categories Grid List */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-gray-150 pb-2">
          <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider">
            Active Catalog Categories & Subcategories
          </h3>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            {categories.length} Top-level Categories
          </span>
        </div>

        {loading ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 text-gray-400">
            <Loader2 className="animate-spin text-blue-600" size={24} />
            <p className="text-xs">Loading categories structure...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-xs font-medium text-red-700 shadow-sm flex items-center justify-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
            <HelpCircle className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-sm font-semibold text-gray-900">No Categories Found</p>
            <p className="text-xs text-gray-400 mt-1">Create one using the form above to build the catalog.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = cat.code === "PHONE" ? Smartphone : Tag;
              return (
                <div
                  key={cat.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-gray-50 text-gray-700 border border-gray-100">
                          <Icon size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm leading-tight">{cat.name}</h4>
                          <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                            CODE: {cat.code}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Subcategories list */}
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Subcategories ({cat.subcategories?.length || 0})
                      </p>
                      {cat.subcategories && cat.subcategories.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                          {cat.subcategories.map((sub) => (
                            <span
                              key={sub.id}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-150 bg-gray-50/50 pl-2.5 pr-1 py-1 text-xs text-gray-700 group/item"
                            >
                              <span>{sub.name}</span>
                              <button
                                onClick={() => handleDeleteSubcategory(sub.id, sub.name)}
                                className="p-0.5 rounded text-gray-400 hover:text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                                title="Delete Subcategory"
                              >
                                <X size={10} strokeWidth={3} />
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">No subcategories defined.</p>
                      )}
                    </div>
                  </div>

                  {/* Add subcategory shortcut in card */}
                  <div className="mt-5 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedParentId(cat.id);
                        const el = document.getElementById("subcategory-form-anchor");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} strokeWidth={2.5} />
                      <span>Add Subcategory</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div id="subcategory-form-anchor"></div>
    </div>
  );
};
