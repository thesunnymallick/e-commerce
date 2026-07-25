// EditProductModal.tsx
import { useState, useEffect } from "react";
import { X, ImageOff } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_API_URL } from "../../constant";

export interface EditProductFormData {
  ProductName: string;
  Description: string;
  Price: string;
  Category: string;
}

interface CategoryOption {
  id: number;
  categoryName: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateProduct: (id: number, product: EditProductFormData) => void;
  product: any | null; // the product being edited
}

const EditProductModal = ({
  isOpen,
  onClose,
  onUpdateProduct,
  product,
}: EditProductModalProps) => {
  const token = useSelector((state: any) => state.auth.token);

  const [form, setForm] = useState<EditProductFormData>({
    ProductName: "",
    Description: "",
    Price: "",
    Category: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch categories whenever the modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const { data, status } = await axios.get(`${BASE_API_URL}/api/Category/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (status === 200 || status === 201) {
          setCategories(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [isOpen, token]);

  // Pre-fill form whenever a new product is passed in
  useEffect(() => {
    if (product) {
      setForm({
        ProductName: product.productName || "",
        Description: product.description || "",
        Price: String(product.price ?? ""),
        Category: product.category || "",
      });
      setErrors({});
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.ProductName.trim()) next.ProductName = "Product name is required";
    if (!form.Description.trim()) next.Description = "Description is required";
    if (!form.Price.trim() || isNaN(Number(form.Price)) || Number(form.Price) <= 0)
      next.Price = "Enter a valid price";
    if (!form.Category) next.Category = "Select a category";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onUpdateProduct(product.id, form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="text-lg font-bold text-gray-900">Edit Product</h2>
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
              Product Name
            </label>
            <input
              type="text"
              name="ProductName"
              value={form.ProductName}
              onChange={handleChange}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-orange-500/30 ${
                errors.ProductName ? "border-red-300" : "border-gray-200 focus:border-orange-500"
              }`}
            />
            {errors.ProductName && (
              <p className="mt-1 text-xs text-red-500">{errors.ProductName}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="Description"
              value={form.Description}
              onChange={handleChange}
              rows={3}
              className={`w-full resize-none rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-orange-500/30 ${
                errors.Description ? "border-red-300" : "border-gray-200 focus:border-orange-500"
              }`}
            />
            {errors.Description && (
              <p className="mt-1 text-xs text-red-500">{errors.Description}</p>
            )}
          </div>

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
                min={0}
                className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-orange-500/30 ${
                  errors.Price ? "border-red-300" : "border-gray-200 focus:border-orange-500"
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
                disabled={loadingCategories}
                className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-orange-500/30 disabled:opacity-60 ${
                  errors.Category ? "border-red-300" : "border-gray-200 focus:border-orange-500"
                }`}
              >
                <option value="">
                  {loadingCategories ? "Loading categories..." : "Select category"}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.categoryName}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
              {errors.Category && (
                <p className="mt-1 text-xs text-red-500">{errors.Category}</p>
              )}
            </div>
          </div>

          {product.image ? (
            <img
              src={product.image}
              alt="Current"
              className="h-16 w-16 rounded-lg object-cover ring-1 ring-gray-200"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
              <ImageOff size={22} />
            </div>
          )}

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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;