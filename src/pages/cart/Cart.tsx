// CartPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Minus, Plus, Trash2, ImageOff, ShoppingBag, ArrowRight } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BASE_API_URL } from "../../constant";

interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  image: string | null;
  description: string;
  category: string;
}

const CartPage = () => {
  const token = useSelector((state: any) => state.auth?.token);

  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const fetchCart = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_API_URL}/api/Cart/Items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(Array.isArray(data?.cartItems) ? data.cartItems : []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load your cart.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleQuantityChange = async (item: CartItem, delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;

    // Optimistic update
    setItems((prev) =>
      prev.map((i) =>
        i.productId === item.productId ? { ...i, quantity: newQuantity } : i
      )
    );

    try {
      setUpdatingId(item.productId);
      await axios.put(
        `${BASE_API_URL}/api/Cart/UpdateQuantity/${item.productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      // Revert on failure
      setItems((prev) =>
        prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: item.quantity } : i
        )
      );
      toast.error("Failed to update quantity.");
      console.log(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (item: CartItem) => {
    try {
      setRemovingId(item.productId);
      const { data } = await axios.post(
        `${BASE_API_URL}/api/Cart/RemoveFromCart/${item.productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems((prev) => prev.filter((i) => i.productId !== item.productId));
      toast.success(data?.message || "Item removed from cart");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to remove item.");
      console.log(error);
    } finally {
      setRemovingId(null);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (!token) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 py-24 text-center sm:px-8">
        <ShoppingBag size={32} className="text-gray-300" />
        <h1 className="text-xl font-bold text-gray-900">Log in to view your cart</h1>
        <Link
          to="/login"
          className="mt-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
          Your Cart
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {loading ? "Loading..." : `${itemCount} item${itemCount !== 1 ? "s" : ""}`}
        </p>

        {loading ? (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl border border-gray-100 bg-white"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <ShoppingBag size={32} className="text-gray-300" />
            <p className="font-medium text-gray-600">Your cart is empty</p>
            <Link
              to="/products"
              className="mt-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Items */}
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-300">
                        <ImageOff size={20} />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-gray-400">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {item.productName}
                    </h3>
                    <p className="font-mono text-sm font-bold text-gray-900">
                      ₹{Number(item.price).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex items-center rounded-xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item, -1)}
                      disabled={updatingId === item.productId || item.quantity <= 1}
                      className="flex h-9 w-9 items-center justify-center text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item, 1)}
                      disabled={updatingId === item.productId}
                      className="flex h-9 w-9 items-center justify-center text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemove(item)}
                    disabled={removingId === item.productId}
                    className="ml-2 flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              <div className="mt-4 space-y-2 border-b border-gray-100 pb-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
              </div>
              <div className="flex justify-between pt-4 text-base font-bold text-gray-900">
                <span>Total</span>
                <span className="font-mono">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600">
                Checkout
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;