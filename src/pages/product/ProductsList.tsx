// ProductsPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Search, ImageOff, SlidersHorizontal, X } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_API_URL } from "../../constant";

interface Product {
  id: number;
  productName: string;
  description: string;
  price: number;
  image: string | null;
  category: string;
}

interface Category {
  id: number;
  categoryName: string;
}

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";

const PAGE_SIZE = 12;

const SORT_LABELS: Record<SortOption, string> = {
  default: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "name-asc": "Name: A to Z",
};

const ProductsList = () => {
  const token = useSelector((state: any) => state.auth?.token);
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(
    searchParams.get("category") || "All"
  );
  const [sort, setSort] = useState<SortOption>("default");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${BASE_API_URL}/api/Product/all`, { headers: authHeaders }),
          axios.get(`${BASE_API_URL}/api/Category/all`, { headers: authHeaders }),
        ]);
        setProducts(productsRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Keep URL in sync when category filter changes
  useEffect(() => {
    if (activeCategory === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", activeCategory);
    }
    setSearchParams(searchParams, { replace: true });
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  useEffect(() => {
    setPage(1);
  }, [search, sort]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.productName?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      default:
        break;
    }

    return result;
  }, [products, activeCategory, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All");
    setSort("default");
  };

  const hasActiveFilters = search.trim() !== "" || activeCategory !== "All" || sort !== "default";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
            Catalog
          </span>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
            All Products
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {loading ? "Loading products..." : `${filteredProducts.length} products available`}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
        {/* Search + Sort bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full text-sm outline-none placeholder:text-gray-400"
            />
            {search && (
              <button onClick={() => setSearch("")} type="button">
                <X size={16} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 sm:hidden"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="hidden rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm outline-none focus:border-orange-500 sm:block"
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABELS[key]}
              </option>
            ))}
          </select>
        </div>

        {/* Category chips */}
        <div
          className={`mb-8 flex flex-wrap gap-2 ${
            showFilters ? "flex" : "hidden sm:flex"
          }`}
        >
          <button
            onClick={() => setActiveCategory("All")}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              activeCategory === "All"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.categoryName)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                activeCategory === cat.categoryName
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.categoryName}
            </button>
          ))}

          {/* Mobile-only sort select, shown inside the filter drawer */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 outline-none sm:hidden"
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABELS[key]}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="rounded-full px-4 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl border border-gray-100 bg-gray-50"
              />
            ))}
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-200 py-20 text-center">
            <ImageOff size={28} className="text-gray-300" />
            <p className="font-medium text-gray-600">No products found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {paginatedProducts.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/60"
                >
                  <div className="aspect-square w-full overflow-hidden bg-gray-50">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.productName}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-300">
                        <ImageOff size={28} />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-1 p-4">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400">
                      {product.category}
                    </span>
                    <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">
                      {product.productName}
                    </h3>
                    <p className="line-clamp-2 text-xs text-gray-500">
                      {product.description}
                    </p>
                    <p className="mt-auto pt-2 font-mono text-base font-bold text-gray-900">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                      page === i + 1
                        ? "bg-orange-500 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsList;