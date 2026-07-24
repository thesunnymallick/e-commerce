import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
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
      title: "Orders",
      icon: ShoppingCart,
      path: "/admin/orders",
    },
    {
      title: "Customers",
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
    <aside className="flex h-screen w-72 flex-col border-r border-gray-200 bg-white shadow-sm">
      {/* Logo */}
      <div className="border-b border-gray-100 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg">
            <ShieldCheck size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              ShopKart
            </h2>

            <p className="text-sm text-gray-500">
              Admin Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-5 py-6">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            <img
              src={`https://ui-avatars.com/api/?name=${
                user?.firstName || "Admin"
              }&background=F97316&color=fff`}
              alt="Admin"
              className="h-14 w-14 rounded-full ring-2 ring-orange-500"
            />

            <div>
              <h3 className="font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h3>

              <p className="text-sm capitalize text-gray-500">
                {user?.role || "Administrator"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-5">
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
          MENU
        </p>

        <nav className="space-y-2">
          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <NavLink
                key={menu.path}
                to={menu.path}
                className={({ isActive }) =>
                  `group flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={20}
                      className={
                        isActive
                          ? "text-white"
                          : "text-gray-500 group-hover:text-orange-500"
                      }
                    />

                    <span className="font-medium">
                      {menu.title}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="border-t border-gray-100 p-5">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 font-medium text-red-600 transition hover:bg-red-500 hover:text-white">
          <LogOut size={18} />
          Logout
        </button>

        <p className="mt-5 text-center text-xs text-gray-400">
          ShopKart Admin • v1.0.0
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;