import { useRef, useState } from "react";
import {
  UploadCloud,
  ImageOff,
  Tag,
  IndianRupee,
  AlignLeft,
  Layers,
  Sparkles,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";

/**
 * Category -> Model options.
 * Replace this with data fetched from your CategoryModel API if you have one;
 * the shape (id + label) is all AddProduct needs.
 */
const CATEGORY_MODELS: Record<string, { id: number; label: string }[]> = {
  Mobiles: [
    { id: 1, label: "iPhone 16 Pro" },
    { id: 2, label: "iPhone 16" },
    { id: 3, label: "Galaxy S24 Ultra" },
  ],
  Laptops: [
    { id: 4, label: "MacBook Pro 14\"" },
    { id: 5, label: "MacBook Air 15\"" },
    { id: 6, label: "Dell XPS 15" },
  ],
  Audio: [
    { id: 7, label: "AirPods Pro" },
    { id: 8, label: "Sony WH-1000XM5" },
  ],
  Wearables: [
    { id: 9, label: "Apple Watch Series 10" },
    { id: 10, label: "Galaxy Watch 7" },
  ],
};

const CATEGORIES = Object.keys(CATEGORY_MODELS);

type FormState = {
  productName: string;
  description: string;
  price: string;
  category: string;
  categoryModelId: string;
};

const initialState: FormState = {
  productName: "",
  description: "",
  price: "",
  category: CATEGORIES[0],
  categoryModelId: String(CATEGORY_MODELS[CATEGORIES[0]][0].id),
};

const AddProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>(initialState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | "imageFile", string>>>({});

  const modelOptions = CATEGORY_MODELS[form.category] ?? [];

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleCategoryChange = (category: string) => {
    const firstModel = CATEGORY_MODELS[category]?.[0];
    setForm((prev) => ({
      ...prev,
      category,
      categoryModelId: firstModel ? String(firstModel.id) : "",
    }));
  };

  const handleFile = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, imageFile: "Please choose an image file." }));
      return;
    }
    setImageFile(file);
    setErrors((prev) => ({ ...prev, imageFile: undefined }));
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!form.productName.trim()) next.productName = "Product name is required.";
    if (!form.description.trim()) next.description = "Add a short description.";
    if (!form.price.trim() || Number(form.price) <= 0) next.price = "Enter a valid price.";
    if (!imageFile) next.imageFile = "Product image is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSuccess(false);

    try {
      const body = new FormData();
      body.append("ProductName", form.productName.trim());
      body.append("Description", form.description.trim());
      body.append("Price", form.price);
      if (imageFile) body.append("imageFile", imageFile);
      body.append("Category", form.category);
      body.append("CategoryModelId", form.categoryModelId);

      const res = await fetch("https://localhost:7249/api/Product/Add", {
        method: "POST",
        body,
      });

      if (!res.ok) throw new Error(`Request failed with ${res.status}`);

      setSuccess(true);
      setForm(initialState);
      clearImage();
      setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        productName: prev.productName,
      }));
      alert("Could not add the product. Please check the API and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formattedPrice = form.price
    ? Number(form.price).toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : null;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[3px] text-orange-500">
            Products / New
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Add a new product
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the details below — you'll see exactly how it looks to shoppers on the right.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="mt-4 w-fit rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:mt-0"
        >
          Back to products
        </button>
      </div>

      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
          <CheckCircle2 size={20} />
          <p className="text-sm font-medium">Product added successfully.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left: form fields */}
        <div className="space-y-6 lg:col-span-3">
          {/* Image upload */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <UploadCloud size={16} className="text-orange-500" />
              Product image
            </label>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFile(e.dataTransfer.files?.[0] ?? null);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all ${
                dragActive
                  ? "border-orange-400 bg-orange-50"
                  : errors.imageFile
                  ? "border-red-300 bg-red-50/40"
                  : "border-slate-200 hover:border-orange-300 hover:bg-orange-50/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30">
                <UploadCloud size={26} />
              </div>
              <p className="text-sm font-medium text-slate-700">
                Drag & drop an image, or click to browse
              </p>
              <p className="mt-1 text-xs text-slate-400">PNG or JPG, up to 5MB</p>
            </div>
            {errors.imageFile && (
              <p className="mt-2 text-xs font-medium text-red-500">{errors.imageFile}</p>
            )}
          </div>

          {/* Basic details */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Tag size={16} className="text-orange-500" />
                  Product name
                </label>
                <input
                  type="text"
                  value={form.productName}
                  onChange={(e) => updateField("productName", e.target.value)}
                  placeholder="e.g. Apple iPhone 16 Pro"
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                    errors.productName
                      ? "border-red-300 focus:ring-red-200"
                      : "border-slate-200 focus:border-orange-400 focus:ring-orange-100"
                  }`}
                />
                {errors.productName && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">{errors.productName}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <AlignLeft size={16} className="text-orange-500" />
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="A short, clear description shoppers will see on the product page"
                  rows={4}
                  className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-slate-800 outline-none transition focus:ring-2 ${
                    errors.description
                      ? "border-red-300 focus:ring-red-200"
                      : "border-slate-200 focus:border-orange-400 focus:ring-orange-100"
                  }`}
                />
                {errors.description && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <IndianRupee size={16} className="text-orange-500" />
                  Price
                </label>
                <div
                  className={`flex items-center rounded-xl border px-4 transition focus-within:ring-2 ${
                    errors.price
                      ? "border-red-300 focus-within:ring-red-200"
                      : "border-slate-200 focus-within:border-orange-400 focus-within:ring-orange-100"
                  }`}
                >
                  <span className="text-sm font-medium text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    placeholder="139999"
                    className="w-full bg-transparent px-2 py-3 text-sm text-slate-800 outline-none"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Layers size={16} className="text-orange-500" />
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Sparkles size={16} className="text-orange-500" />
                  Model
                </label>
                <select
                  value={form.categoryModelId}
                  onChange={(e) => updateField("categoryModelId", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                >
                  {modelOptions.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-3.5 font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-orange-500/50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Adding product...
              </>
            ) : (
              "Add product"
            )}
          </button>
        </div>

        {/* Right: live preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-6">
            <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-[3px] text-slate-400">
              Storefront preview
            </p>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="relative flex h-56 items-center justify-center bg-slate-50">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-md transition hover:bg-white"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-slate-300">
                    <ImageOff size={32} />
                    <p className="mt-2 text-xs font-medium text-slate-400">No image yet</p>
                  </div>
                )}

                <span className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
                  {form.category}
                </span>
              </div>

              <div className="space-y-2 p-5">
                <h3 className="truncate text-base font-semibold text-slate-900">
                  {form.productName || "Product name"}
                </h3>
                <p className="line-clamp-2 text-sm text-slate-500">
                  {form.description || "A short description will appear here."}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-lg font-bold text-slate-900">
                    {formattedPrice ? `₹${formattedPrice}` : "₹ —"}
                  </span>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                    {modelOptions.find((m) => String(m.id) === form.categoryModelId)?.label ??
                      "Model"}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 px-1 text-xs leading-relaxed text-slate-400">
              This preview updates live as you fill the form, so you can catch typos or a
              stretched image before it ever reaches the store.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;