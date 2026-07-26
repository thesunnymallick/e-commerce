// AdminOrders.tsx
import { useEffect, useState } from "react";
import { Package, ChevronDown } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BASE_API_URL } from "../../constant";

interface AdminOrder {
  id: number;
  totalAmount: number;
  items: number;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const AdminOrders = () => {
  const token = useSelector((state: any) => state.auth?.token);

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASE_API_URL}/api/Order/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleStatusChange = async (order: AdminOrder, newStatus: string) => {
    if (newStatus === order.orderStatus) return;

    const previousStatus = order.orderStatus;

    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, orderStatus: newStatus } : o))
    );

    try {
      setUpdatingId(order.id);
      // ASSUMPTION: UpdateOrderStatusDto shape is { orderId, orderStatus }.
      // Adjust field names here if your DTO differs.
      const { data } = await axios.post(
        `${BASE_API_URL}/api/Order/updateOrderStatus`,
        { orderId: order.id, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(data?.message || data || "Order status updated");
    } catch (error: any) {
      // Revert on failure
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, orderStatus: previousStatus } : o
        )
      );
      toast.error(error?.response?.data?.message || "Failed to update status.");
      console.log(error?.response?.data || error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((o) => o.orderStatus === statusFilter);

  return (
    <div className="p-4 sm:p-6">
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          {loading ? "Loading..." : `${filteredOrders.length} orders`}
        </p>
      </div>
  
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm outline-none focus:border-orange-500 sm:w-auto"
      >
        <option value="All">All statuses</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* This wrapper is the key fix — lets the table scroll horizontally on small screens */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Order
              </th>
              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Date
              </th>
              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Items
              </th>
              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Total
              </th>
              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Payment
              </th>
              <th className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                Order Status
              </th>
            </tr>
          </thead>
  
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="px-6 py-4">
                    <div className="h-6 animate-pulse rounded bg-gray-100" />
                  </td>
                </tr>
              ))
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <Package size={24} className="text-gray-300" />
                    No orders found.
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const statusClass =
                  STATUS_STYLES[order.orderStatus] ?? "bg-gray-100 text-gray-600";
  
                return (
                  <tr key={order.id} className="transition hover:bg-orange-50/40">
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-gray-900">
                        #{order.id}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {order.items} item{order.items !== 1 ? "s" : ""}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-sm font-bold text-gray-900">
                      ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order, e.target.value)}
                          disabled={updatingId === order.id}
                          className={`appearance-none rounded-full py-1.5 pl-3 pr-8 text-xs font-semibold outline-none disabled:opacity-50 ${statusClass}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={12}
                          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-current"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
};

export default AdminOrders;