import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow md:hidden">
        <h2 className="font-semibold">Admin Panel</h2>

        <button onClick={() => setOpen(!open)}>
          <Menu size={24} />
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r shadow
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static
        `}
      >
        <Sidebar />
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 pt-20 md:pt-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;