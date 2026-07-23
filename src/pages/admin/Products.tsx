import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  PackageX,
  Pencil,
  Trash2,
  ArrowUpDown,
  Loader2,
} from "lucide-react";
import { Link } from "react-router";

type Product = {
  id: number;
  productName: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  categoryModelId: number;
};

const CATEGORY_FILTERS = ["All", "Mobiles", "Laptops", "Audio", "Wearables"];

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortDesc, setSortDesc] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://localhost:7249/api/Product/GetAll", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Request failed with ${res.status}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError("Couldn't load products. Check your connection and try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this product? This can't be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`https://localhost:7249/api/Product/Delete/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Couldn't delete the product. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const visibleProducts = useMemo(() => {
    let list = [...products];

    if (activeCategory !== "All") {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.productName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => (sortDesc ? b.price - a.price : a.price - b.price));
    return list;
  }, [products, search, activeCategory, sortDesc]);

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[3px] text-orange-500">
            Catalog
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading ? "Loading your catalog..." : `${visibleProducts.length} of ${products.length} products`}
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="flex w-fit items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:shadow-orange-500/50"
        >
          <Plus size={18} />
          Add product
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 sm:w-80">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}

          <button
            onClick={() => setSortDesc((s) => !s)}
            className="ml-1 flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <ArrowUpDown size={13} />
            Price {sortDesc ? "high to low" : "low to high"}
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-24 text-slate-400 shadow-sm">
          <Loader2 size={28} className="animate-spin text-orange-500" />
          <p className="mt-3 text-sm font-medium">Fetching your products...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50 py-24 text-center">
          <PackageX size={32} className="text-red-400" />
          <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
        </div>
      ) : visibleProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white py-24 text-center shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-400">
            <PackageX size={28} />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-700">
            {products.length === 0 ? "No products yet" : "No products match your filters"}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            {products.length === 0
              ? "Add your first product to start building the catalog."
              : "Try a different search term or category."}
          </p>
          {products.length === 0 && (
            <Link
              to="/admin/products/add"
              className="mt-5 flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/30"
            >
              <Plus size={16} />
              Add product
            </Link>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleProducts.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-50 transition hover:bg-orange-50/30 last:border-0"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={p.imageUrl}
                        alt={p.productName}
                        className="h-12 w-12 rounded-xl border border-slate-100 object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-800">{p.productName}</p>
                        <p className="truncate text-xs text-slate-400">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    ₹{p.price.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100"
                        title="Edit product"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                        title="Delete product"
                      >
                        {deletingId === p.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Products;