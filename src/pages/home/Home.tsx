// Home.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  ImageOff,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Smartphone,
  Laptop,
  Shirt,
  Cpu,
  Home as HomeIcon,
  Sparkles,
  Mail,
} from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import HeroSection from "../../components/HeroSection";
import { BASE_API_URL } from "../../constant";

interface Product {
  id: number;
  productName: string;
  description: string;
  price: number;
  image: string | null;
  category: string;
}

const CATEGORY_ICONS: Record<string, any> = {
  Mobiles: Smartphone,
  Laptops: Laptop,
  Fashion: Shirt,
  Electronics: Cpu,
  Home: HomeIcon,
  Beauty: Sparkles,
};

const FEATURES = [
  {
    icon: Truck,
    title: "Free delivery",
    desc: "On every order, no minimum spend",
  },
  {
    icon: ShieldCheck,
    title: "Secure payment",
    desc: "256-bit encrypted checkout",
  },
  {
    icon: RotateCcw,
    title: "7-day returns",
    desc: "Change your mind, no questions asked",
  },
  {
    icon: Headphones,
    title: "24/7 support",
    desc: "Real humans, real fast",
  },
];

const CATEGORIES = ["Mobiles", "Laptops", "Electronics", "Fashion", "Home", "Beauty"];

const Home = () => {
  const token = useSelector((state: any) => state.auth?.token);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const { data, status } = await axios.get(`${BASE_API_URL}/api/Product/all`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (status === 200 || status === 201) {
          setProducts(data.slice(0, 5));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, [token]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    toast.success("You're on the list — welcome aboard!");
    setEmail("");
  };

  return (
    <div className="bg-white">
      {/* Hero */}
      <HeroSection />

      {/* ---------------- TOP 5 PRODUCTS ---------------- */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
              Top 05 / This week
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              Trending right now
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden items-center gap-1.5 text-sm font-semibold text-gray-700 transition hover:text-orange-600 sm:flex"
          >
            View all products
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl border border-gray-100 bg-gray-50"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center text-gray-400">
            No products available yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {products.map((product, index) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/60"
              >
                {/* Rank badge */}
                <span className="absolute left-3 top-3 z-10 rounded-md bg-gray-900/90 px-2 py-1 font-mono text-[10px] font-bold text-white backdrop-blur">
                  #{String(index + 1).padStart(2, "0")}
                </span>

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
                  <p className="mt-auto pt-2 font-mono text-base font-bold text-gray-900">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <Link
          to="/products"
          className="mt-8 flex items-center justify-center gap-1.5 text-sm font-semibold text-gray-700 sm:hidden"
        >
          View all products
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* ---------------- PREMIUM DARK BANNER ---------------- */}
      <section className="relative overflow-hidden bg-gray-900">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 py-20 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
              Limited time
            </span>
            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
              Upgrade your tech.
              <br />
              Pay less than you think.
            </h2>
            <p className="mt-4 text-sm text-gray-400 sm:text-base">
              Handpicked deals on mobiles, laptops, and electronics — refreshed
              every week, while stocks last.
            </p>
          </div>
          <Link
            to="/products"
            className="flex shrink-0 items-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-400"
          >
            Shop the deals
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ---------------- CATEGORY RAIL ---------------- */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
          Browse
        </span>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
          Shop by category
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] ?? Sparkles;
            return (
              <Link
                to={`/products?category=${cat}`}
                key={cat}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-8 text-center transition hover:-translate-y-1 hover:border-orange-200 hover:bg-orange-50/50 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition group-hover:bg-orange-500 group-hover:text-white">
                  <Icon size={20} />
                </div>
                <span className="text-sm font-semibold text-gray-800">{cat}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------------- TRUST STRIP ---------------- */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 sm:px-8 md:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-orange-500 shadow-sm ring-1 ring-gray-100">
                <Icon size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="mt-0.5 text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- NEWSLETTER ---------------- */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
        <div className="flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-14 text-center sm:px-16">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white">
            <Mail size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Get first access to new drops
            </h2>
            <p className="mt-2 text-sm text-orange-50">
              One email a week. Deals, launches, nothing else.
            </p>
          </div>
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border-0 px-4 py-3 text-sm text-gray-900 outline-none ring-1 ring-white/20 placeholder:text-gray-400 focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;