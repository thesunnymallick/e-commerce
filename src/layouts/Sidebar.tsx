import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
  Bell,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const user = useSelector((state: any) => state.auth.user);

  const menus = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      title: "Products",
      icon: Package,
      path: "/admin/products",
    },
    {
      title: "Products",
      icon: Package,
      path: "/admin/products/add",
    },
    {
      title: "Orders",
      icon: ShoppingCart,
      path: "/admin/orders",
    },
    {
      title: "Users",
      icon: Users,
      path: "/admin/users",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  return (
    <aside className="flex h-screen w-72 flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white shadow-2xl lg:m-5 lg:h-[calc(100vh-40px)] lg:rounded-3xl">

      {/* Logo */}
      <div className="border-b border-slate-800 px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/40">
            <ShieldCheck size={28} />
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-wide">
              ShopKart
            </h2>

            <p className="text-sm text-slate-400">
              Ecommerce Admin
            </p>
          </div>
        </div>
      </div>

      {/* Profile */}
      <div className="mx-4 my-5 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">

        <div className="flex items-center gap-4">
          <img
            src={`https://ui-avatars.com/api/?name=${user?.firstName || "Admin"}&background=f97316&color=fff`}
            alt="Admin"
            className="h-16 w-16 rounded-full border-4 border-orange-500"
          />

          <div>
            <h3 className="text-lg font-semibold">
              {user?.firstName} {user?.lastName}
            </h3>

            <p className="capitalize text-sm text-slate-400">
              {user?.role}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-slate-800 p-3 text-center">

          <div>
            <h4 className="font-bold text-white">125</h4>
            <p className="text-xs text-slate-400">Orders</p>
          </div>

          <div>
            <h4 className="font-bold text-white">₹85K</h4>
            <p className="text-xs text-slate-400">Revenue</p>
          </div>

          <div className="flex items-center justify-center">
            <Bell className="text-orange-400" size={22} />
          </div>

        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto px-4">

        <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-[3px] text-slate-500">
          Main Menu
        </p>

        <nav className="space-y-2">

          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <NavLink
                key={menu.path}
                to={menu.path}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30"
                      : "hover:bg-slate-800"
                  }`
                }
              >
                <div className="flex items-center gap-4">
                  <Icon size={20} />

                  <span className="font-medium">
                    {menu.title}
                  </span>
                </div>

                <ChevronRight
                  size={18}
                  className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                />
              </NavLink>
            );
          })}

        </nav>
      </div>

      {/* Logout */}
      <div className="border-t border-slate-800 p-5">

        <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-500 py-3 font-semibold transition-all hover:bg-red-600">
          <LogOut size={20} />
          Logout
        </button>

        <p className="mt-5 text-center text-xs text-slate-500">
          ShopKart Admin v1.0
        </p>

      </div>

    </aside>
  );
};

export default Sidebar;