// CategoryModal.tsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export interface CategoryFormData {
  categoryName: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
  mode: "add" | "edit";
  initialData?: { id: number; categoryName: string } | null;
}

const CategoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData,
}: CategoryModalProps) => {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setCategoryName(initialData.categoryName);
    } else {
      setCategoryName("");
    }
    setError("");
  }, [mode, initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }
    onSubmit({ categoryName: categoryName.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-bold text-gray-900">
            {mode === "add" ? "Add Category" : "Edit Category"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
                setError("");
              }}
              placeholder="e.g. Mobiles"
              autoFocus
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-orange-500/30 ${
                error ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-orange-500"
              }`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-orange-600"
            >
              {mode === "add" ? "Add Category" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;