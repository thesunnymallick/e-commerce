import { useState, useRef } from "react";
import { X, UploadCloud, ImageOff } from "lucide-react";

export interface ProductFormData {
  ProductName: string;
  Description: string;
  Price: string;
  Category: string;
  image: File | null;
  imagePreview: string | null;
}
interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: ProductFormData) => void;
}

const CATEGORIES = ["Mobiles", "Laptops", "Fashion", "Electronics", "Home", "Beauty"];

const emptyForm = {
  ProductName: "",
  Description: "",
  Price: "",
  Category: "",
};

const AddProductModal = ({ isOpen, onClose, onAddProduct }: AddProductModalProps) => {
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setForm(emptyForm);
    setPreview(null);
    setErrors({});
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
  
    setImageFile(file);
    setErrors((prev) => ({ ...prev, image: "" }));
  
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      setImageFile(null);
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};

    if (!form.ProductName.trim()) next.ProductName = "Product name is required";
    if (!form.Description.trim()) next.Description = "Description is required";
    if (!form.Price.trim()) next.Price = "Price is required";
    else if (isNaN(Number(form.Price)) || Number(form.Price) <= 0)
      next.Price = "Enter a valid price";
    if (!form.Category) next.Category = "Select a category";
    if (!preview) next.image = "Product image is required";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onAddProduct({
      ...form,
      image: imageFile,
      imagePreview: preview,
    });

    resetAndClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-bold text-gray-900">Add Product</h2>
          <button
            onClick={resetAndClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          {/* Product Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              name="ProductName"
              value={form.ProductName}
              onChange={handleChange}
              placeholder="e.g. Samsung A52s 5g"
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-orange-500/30 ${
                errors.ProductName
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-orange-500"
              }`}
            />
            {errors.ProductName && (
              <p className="mt-1 text-xs text-red-500">{errors.ProductName}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="Description"
              value={form.Description}
              onChange={handleChange}
              rows={3}
              placeholder="This is Samsung A52s 5g mobile"
              className={`w-full resize-none rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-orange-500/30 ${
                errors.Description
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-orange-500"
              }`}
            />
            {errors.Description && (
              <p className="mt-1 text-xs text-red-500">{errors.Description}</p>
            )}
          </div>

          {/* Price + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Price (₹)
              </label>
              <input
                type="number"
                name="Price"
                value={form.Price}
                onChange={handleChange}
                placeholder="29000"
                min={0}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-orange-500/30 ${
                  errors.Price
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-orange-500"
                }`}
              />
              {errors.Price && <p className="mt-1 text-xs text-red-500">{errors.Price}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                name="Category"
                value={form.Category}
                onChange={handleChange}
                className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-orange-500/30 ${
                  errors.Category
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-200 focus:border-orange-500"
                }`}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.Category && (
                <p className="mt-1 text-xs text-red-500">{errors.Category}</p>
              )}
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Product Image
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed px-4 py-4 transition hover:bg-orange-50/50 ${
                errors.image ? "border-red-300" : "border-gray-200"
              }`}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-16 w-16 rounded-lg object-cover ring-1 ring-gray-200"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                  <ImageOff size={22} />
                </div>
              )}

              <div className="flex flex-col">
                <span className="flex items-center gap-1.5 text-sm font-medium text-orange-600">
                  <UploadCloud size={16} />
                  {preview ? "Change image" : "Upload image"}
                </span>
                <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
              </div>
            </div>
            {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={resetAndClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-orange-600"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;