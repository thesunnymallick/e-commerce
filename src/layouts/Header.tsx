import { useState } from "react";
import {
  ShoppingCart,
  Heart,
  Search,
  User,
  Menu,
  X,
  LogOut,
  Package,
  LayoutDashboard,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CartIcon from "../components/CartIcons";
import { setLogout } from "../redux/slice/authSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");

  const { isAuthenticated, user } = useSelector((state: any) => state.auth);

  const handleLogout = () => {
    dispatch(setLogout());
    setMenuOpen(false);
    setMobileNavOpen(false);
    toast.success("Logged out successfully");
    navigate("/login");
    
  };

  const runSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    setMobileNavOpen(false);
  };

  const handleDesktopSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(searchTerm);
  };

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(mobileSearchTerm);
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/products" },
    { label: "Contact", to: "/contact" },
    { label: "About", to: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Shop<span className="text-orange-500">Kart</span>
          </h1>
        </Link>

        {/* Desktop search */}
        <form
          onSubmit={handleDesktopSearchSubmit}
          className="hidden flex-1 items-center rounded-full border bg-gray-100 px-4 py-2 md:mx-6 md:flex md:max-w-[450px]"
        >
          <button type="submit" aria-label="Search">
            <Search size={18} className="text-gray-500" />
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="ml-3 w-full bg-transparent outline-none"
          />
        </form>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-medium hover:text-orange-500"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 sm:gap-5">
          <button className="hidden sm:inline-flex">
            <Heart className="text-gray-700 hover:text-orange-500" />
          </button>

          <CartIcon />

          <div className="relative hidden lg:block">
            <button onClick={() => setMenuOpen((prev) => !prev)}>
              <User className="text-gray-700 hover:text-orange-500" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-48 rounded-md border bg-white py-2 shadow-lg">
                {isAuthenticated ? (
                  <>
                    <p className="truncate px-4 py-1 text-sm text-gray-500">
                      {user?.name || user?.email || "My Account"}
                    </p>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <User size={16} /> Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      <Package size={16} /> My Orders
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>

          <button
            className="lg:hidden"
            onClick={() => setMobileNavOpen((prev) => !prev)}
          >
            {mobileNavOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <form
        onSubmit={handleMobileSearchSubmit}
        className="border-t px-4 py-3 md:hidden"
      >
        <div className="flex items-center rounded-full border bg-gray-100 px-4 py-2">
          <button type="submit" aria-label="Search">
            <Search size={18} className="text-gray-500" />
          </button>
          <input
            type="text"
            value={mobileSearchTerm}
            onChange={(e) => setMobileSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="ml-3 w-full bg-transparent outline-none"
          />
        </div>
      </form>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div className="border-t bg-white lg:hidden">
          <nav className="flex flex-col px-4 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileNavOpen(false)}
                className="border-b py-3 font-medium hover:text-orange-500"
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-2 border-b py-3 font-medium hover:text-orange-500"
                >
                  <User size={16} /> Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-2 border-b py-3 font-medium hover:text-orange-500"
                >
                  <Package size={16} /> My Orders
                </Link>
                {user?.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileNavOpen(false)}
                    className="flex items-center gap-2 border-b py-3 font-medium hover:text-orange-500"
                  >
                    <LayoutDashboard size={16} /> Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 py-3 text-left font-medium text-red-600"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileNavOpen(false)}
                className="py-3 font-medium hover:text-orange-500"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;