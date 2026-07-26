// CheckoutSuccess.tsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { CheckCircle2, XCircle, Loader2, Package } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_API_URL } from "../../constant";

interface StripeSession {
  id: number;
  sessionId: string;
  customerEmail: string;
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
  productId: string;
  productQuantity: string;
  address: string;
  orderStatus: number;
}

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const token = useSelector((state: any) => state.auth?.token);

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<StripeSession | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      if (!sessionId) {
        setError(true);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${BASE_API_URL}/api/Stripe/session/${sessionId}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        setSession(data);
        // Remember the email actually used at checkout, for My Orders lookup
        if (data?.customerEmail) {
          localStorage.setItem("lastOrderEmail", data.customerEmail);
        }
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, token]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 size={28} className="animate-spin text-orange-500" />
        <p className="text-sm text-gray-500">Confirming your payment...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-6 py-24 text-center">
        <XCircle size={40} className="text-red-400" />
        <h1 className="text-xl font-bold text-gray-900">
          We couldn't confirm your payment
        </h1>
        <p className="text-sm text-gray-500">
          If you were charged, contact support with your order details.
        </p>
        <Link
          to="/"
          className="mt-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Back to home
        </Link>
      </div>
    );
  }

  const isPaid = session.paymentStatus === "paid";

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-6 py-20 text-center">
      {isPaid ? (
        <CheckCircle2 size={44} className="text-green-500" />
      ) : (
        <XCircle size={44} className="text-amber-500" />
      )}

      <div>
        <h1 className="text-xl font-bold text-gray-900">
          {isPaid ? "Payment successful!" : "Payment not completed"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isPaid
            ? `A confirmation has been sent to ${session.customerEmail}`
            : "Your payment wasn't confirmed. Please try checking out again."}
        </p>
      </div>

      {isPaid && (
        <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <Package size={16} className="text-orange-500" />
            Order Summary
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID</span>
              <span className="font-mono font-medium text-gray-900">
                #{session.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Quantity</span>
              <span className="font-medium text-gray-900">
                {session.productQuantity}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2">
              <span className="text-gray-500">Total Paid</span>
              <span className="font-mono font-bold text-gray-900">
                ₹{Number(session.totalAmount).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      )}

      <Link
        to="/products"
        className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
      >
        Continue shopping
      </Link>
    </div>
  );
};

export default CheckoutSuccess;
