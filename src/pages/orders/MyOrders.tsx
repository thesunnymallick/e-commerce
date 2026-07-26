// MyOrders.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Package, ImageOff, Search, MapPin, ChevronDown } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BASE_API_URL } from "../../constant";

interface OrderProduct {
  productId: number;
  productName: string;
  productDescription: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface OrderAddress {
  id: number;
  addressLine: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

interface Order {
  id: number;
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
  address: OrderAddress;
  orderStatus: string;
  products: OrderProduct[];
}

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const MyOrders = () => {
  const token = useSelector((state: any) => state.auth?.token);
  const reduxEmail = useSelector(
    (state: any) =>
      state.auth?.user?.email ?? state.auth?.email ?? state.auth?.userInfo?.email
  );
  const userId = useSelector(
    (state: any) => state.auth?.user?.id ?? state.auth?.userId
  );

  const [email, setEmail] = useState<string | null>(
    localStorage.getItem("lastOrderEmail") || reduxEmail || null
  );
  const [emailInput, setEmailInput] = useState(email || "");

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [triedProfile, setTriedProfile] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const resolveFromProfile = async () => {
      if (email || !userId || !token || triedProfile) return;
      try {
        setTriedProfile(true);
        const { data } = await axios.get(`${BASE_API_URL}/api/Profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data?.email) {
          setEmail(data.email);
          setEmailInput(data.email);
        }
      } catch (error) {
        console.log(error);
      }
    };
    resolveFromProfile();
  }, [email, userId, token, triedProfile]);

  const fetchOrders = async (targetEmail: string) => {
    if (!targetEmail) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_API_URL}/api/Order/${encodeURIComponent(targetEmail)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load orders for this email.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) fetchOrders(email);
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, token]);

  const handleManualLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    setEmail(emailInput.trim());
    localStorage.setItem("lastOrderEmail", emailInput.trim());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-10 sm:px-8">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
          My Orders
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {loading
            ? "Loading..."
            : email
            ? `Showing orders for ${email}`
            : "Enter the email you used at checkout"}
        </p>

        <form
          onSubmit={handleManualLookup}
          className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm">
            <Search size={16} className="text-gray-400" />
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Email used at checkout"
              className="w-full text-sm outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Find orders
          </button>
        </form>

        {loading ? (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl border border-gray-100 bg-white"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <Package size={32} className="text-gray-300" />
            <p className="font-medium text-gray-600">
              {email ? "No orders found for this email" : "No orders yet"}
            </p>
            <Link
              to="/products"
              className="mt-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedId === order.id;
              const statusClass =
                STATUS_STYLES[order.orderStatus] ?? "bg-gray-100 text-gray-600";
              const itemCount = order.products.reduce(
                (sum, p) => sum + p.quantity,
                0
              );

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                >
                  {/* Header row — click to expand */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-gray-50/60"
                  >
                    {/* Stacked product thumbnails preview */}
                    <div className="flex -space-x-3">
                      {order.products.slice(0, 3).map((p, i) => (
                        <div
                          key={i}
                          className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border-2 border-white bg-gray-50"
                        >
                          {p.imageUrl && p.imageUrl !== "Unknown" ? (
                            <img
                              src={p.imageUrl}
                              alt={p.productName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageOff size={16} className="text-gray-300" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          Order #{order.id}
                        </p>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusClass}`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {itemCount} item{itemCount !== 1 ? "s" : ""} ·{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="font-mono text-sm font-bold text-gray-900">
                        ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                      </p>
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/50 p-5">
                      <div className="space-y-3">
                        {order.products.map((p, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                              {p.imageUrl && p.imageUrl !== "Unknown" ? (
                                <img
                                  src={p.imageUrl}
                                  alt={p.productName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <ImageOff size={16} className="text-gray-300" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {p.productName}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty {p.quantity} · ₹
                                {Number(p.price).toLocaleString("en-IN")} each
                              </p>
                            </div>
                            <p className="font-mono text-sm font-semibold text-gray-900">
                              ₹{(p.price * p.quantity).toLocaleString("en-IN")}
                            </p>
                          </div>
                        ))}
                      </div>

                      {order.address?.addressLine &&
                        order.address.addressLine !== "Unknown" && (
                          <div className="mt-4 flex items-start gap-2 border-t border-gray-200 pt-4 text-sm">
                            <MapPin
                              size={16}
                              className="mt-0.5 shrink-0 text-orange-500"
                            />
                            <p className="text-gray-600">
                              {order.address.addressLine}, {order.address.city},{" "}
                              {order.address.state} - {order.address.pinCode}
                            </p>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;