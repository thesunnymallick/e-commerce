// CheckoutPage.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { MapPin, ShoppingBag, ImageOff, ArrowRight, Plus } from "lucide-react";
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
  category: string;
}

interface Address {
  id: number;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.auth?.token);
  const authHeaders = { Authorization: `Bearer ${token}` };

  const [items, setItems] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoadingCart(true);
        const { data } = await axios.get(`${BASE_API_URL}/api/Cart/Items`, {
          headers: authHeaders,
        });
        setItems(Array.isArray(data?.cartItems) ? data.cartItems : []);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load your cart.");
      } finally {
        setLoadingCart(false);
      }
    };

    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const { data } = await axios.get(`${BASE_API_URL}/api/Profile/GetAddress`, {
          headers: authHeaders,
        });
        const list = Array.isArray(data) ? data : data?.addresses ?? [];
        setAddresses(list);
        if (list.length > 0) setSelectedAddressId(list[0].id);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load addresses.");
      } finally {
        setLoadingAddresses(false);
      }
    };

    if (token) {
      fetchCart();
      fetchAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Matches the schema shown in Swagger: array of { productId, name, price, quantity, address }
    const payload = items.map((item) => ({
      productId: item.productId,
      name: item.productName,
      price: item.price,
      quantity: item.quantity,
      address: selectedAddressId,
    }));

    try {
      setPlacingOrder(true);
      const { data } = await axios.post(
        `${BASE_API_URL}/api/Stripe/create-payment-intent`,
        payload,
        { headers: authHeaders }
      );

      // ASSUMPTION: response includes a Stripe Checkout url to redirect to.
      // Common shapes: { url } or { checkoutUrl } or { sessionUrl }.
      const redirectUrl = data?.url || data?.checkoutUrl || data?.sessionUrl;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        console.log("Unexpected create-payment-intent response:", data);
        toast.error(
          "Checkout session created, but no redirect URL was found in the response."
        );
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to start checkout.");
      console.log(error?.response?.data || error.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loadingCart || loadingAddresses) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse space-y-4 px-6 py-10 sm:px-8">
        <div className="h-8 w-48 rounded bg-gray-100" />
        <div className="h-40 rounded-2xl bg-gray-100" />
        <div className="h-40 rounded-2xl bg-gray-100" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-24 text-center sm:px-8">
        <ShoppingBag size={32} className="text-gray-300" />
        <h1 className="text-xl font-bold text-gray-900">Your cart is empty</h1>
        <Link
          to="/products"
          className="mt-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
          Checkout
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left: address + items */}
          <div className="space-y-6 lg:col-span-2">
            {/* Address selection */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <MapPin size={18} className="text-orange-500" />
                  Delivery Address
                </h2>
                <Link
                  to="/profile"
                  className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:underline"
                >
                  <Plus size={14} />
                  Add new
                </Link>
              </div>

              {addresses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 py-8 text-center">
                  <p className="text-sm text-gray-400">No saved addresses.</p>
                  <Link
                    to="/profile"
                    className="mt-2 inline-block text-sm font-semibold text-orange-600 hover:underline"
                  >
                    Add an address
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                        selectedAddressId === address.id
                          ? "border-orange-500 bg-orange-50/50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                        className="mt-1 accent-orange-500"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {address.addressLine}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Items */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                <ShoppingBag size={18} className="text-orange-500" />
                Order Items
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                          <ImageOff size={18} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.productName}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-mono text-sm font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: summary */}
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

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder || !selectedAddressId}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition hover:bg-orange-600 disabled:opacity-60"
            >
              {placingOrder ? "Redirecting to payment..." : "Proceed to Payment"}
              {!placingOrder && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;