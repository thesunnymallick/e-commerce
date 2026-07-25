// CartIcon.tsx
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router";
import { ShoppingCart } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_API_URL } from "../constant";


const CartIcon = () => {
  const token = useSelector((state: any) => state.auth?.token);
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    if (!token) {
      setCount(0);
      return;
    }
    try {
      const { data } = await axios.get(`${BASE_API_URL}/api/Cart/Items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = Array.isArray(data?.cartItems) ? data.cartItems : [];
      const total = items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCount(total);
    } catch (error) {
      console.log(error);
    }
  }, [token]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  // Refresh badge whenever any page dispatches "cart-updated"
  useEffect(() => {
    window.addEventListener("cart-updated", fetchCount);
    return () => window.removeEventListener("cart-updated", fetchCount);
  }, [fetchCount]);

  return (
    <Link
      to="/cart"
      className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100"
      aria-label="Cart"
    >
      <ShoppingCart size={20} />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;