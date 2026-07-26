// ProductDetails.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  ImageOff,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BASE_API_URL } from "../../constant";

interface Product {
  id: number;
  productName: string;
  description: string;
  price: number;
  image: string | null;
  category: string;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const token = useSelector((state: any) => state.auth?.token);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [related, setRelated] = useState<Product[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setNotFound(false);
        const { data } = await axios.get(
          `${BASE_API_URL}/api/Product/Item/${id}`,
          {
            headers: authHeaders,
          }
        );
        setProduct(data);
        setQuantity(1);
      } catch (error: any) {
        if (error?.response?.status === 404) {
          setNotFound(true);
        } else {
          toast.error("Failed to load product.");
        }
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!product?.category) return;
      try {
        setLoadingRelated(true);
        const { data } = await axios.get(
          `${BASE_API_URL}/api/Product/Category/${product.category}`,
          { headers: authHeaders }
        );
        setRelated(
          (data || []).filter((p: Product) => p.id !== product.id).slice(0, 4)
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.category, product?.id]);

  const handleAddToCart = async () => {
    if (!token) {
      toast.error("Please log in to add items to your cart");
      return;
    }
    if (!product) return;

    try {
      setAddingToCart(true);
      const { data } = await axios.post(
        `${BASE_API_URL}/api/Cart/AddToCart`,
        { productId: product.id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(
        data?.message || `Added ${quantity} × ${product.productName} to cart`
      );
      window.dispatchEvent(new Event("cart-updated")); 
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add to cart.");
      console.log(error?.response?.data || error.message);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse px-6 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="aspect-square rounded-2xl bg-gray-100" />
          <div className="space-y-4">
            <div className="h-4 w-24 rounded bg-gray-100" />
            <div className="h-8 w-3/4 rounded bg-gray-100" />
            <div className="h-4 w-1/2 rounded bg-gray-100" />
            <div className="h-24 w-full rounded bg-gray-100" />
            <div className="h-12 w-40 rounded bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-24 text-center sm:px-8">
        <ImageOff size={32} className="text-gray-300" />
        <h1 className="text-xl font-bold text-gray-900">Product not found</h1>
        <p className="text-sm text-gray-500">
          This product may have been removed or the link is incorrect.
        </p>
        <Link
          to="/products"
          className="mt-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Back to all products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-xs font-medium text-gray-400">
          <Link to="/" className="hover:text-gray-700">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:text-gray-700">
            Products
          </Link>
          <ChevronRight size={14} />
          <Link
            to={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-gray-700"
          >
            {product.category}
          </Link>
          <ChevronRight size={14} />
          <span className="line-clamp-1 text-gray-600">
            {product.productName}
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          {/* Image */}
          <div className="aspect-square w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
            {product.image ? (
              <img
                src={product.image}
                alt={product.productName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-300">
                <ImageOff size={40} />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
              {product.category}
            </span>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
              {product.productName}
            </h1>

            <p className="mt-4 font-mono text-3xl font-bold text-gray-900">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>

            <p className="mt-6 text-sm leading-relaxed text-gray-600">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="mt-8">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Quantity
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-11 w-11 items-center justify-center text-gray-500 transition hover:bg-gray-50"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-11 w-11 items-center justify-center text-gray-500 transition hover:bg-gray-50"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600 disabled:opacity-60"
                >
                  <ShoppingCart size={18} />
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>

            {/* Trust row */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
              <div className="flex flex-col items-start gap-2">
                <Truck size={18} className="text-orange-500" />
                <span className="text-xs text-gray-500">Free delivery</span>
              </div>
              <div className="flex flex-col items-start gap-2">
                <ShieldCheck size={18} className="text-orange-500" />
                <span className="text-xs text-gray-500">Secure payment</span>
              </div>
              <div className="flex flex-col items-start gap-2">
                <RotateCcw size={18} className="text-orange-500" />
                <span className="text-xs text-gray-500">7-day returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {(loadingRelated || related.length > 0) && (
          <div className="mt-20">
            <h2 className="mb-6 text-xl font-black tracking-tight text-gray-900">
              You may also like
            </h2>

            {loadingRelated ? (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-56 animate-pulse rounded-2xl border border-gray-100 bg-gray-50"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                {related.map((item) => (
                  <Link
                    to={`/product/${item.id}`}
                    key={item.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="aspect-square w-full overflow-hidden bg-gray-50">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                          <ImageOff size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 p-3">
                      <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">
                        {item.productName}
                      </h3>
                      <p className="font-mono text-sm font-bold text-gray-900">
                        ₹{Number(item.price).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
