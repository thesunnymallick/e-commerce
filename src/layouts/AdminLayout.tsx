import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900">

      {/* Mobile Header */}

      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-700 bg-slate-950 px-5 lg:hidden">

        <h1 className="text-xl font-bold text-white">
          ShopKart Admin
        </h1>

        <button onClick={() => setOpen(true)}>
          <Menu className="text-white" />
        </button>

      </div>

      <div className="flex">

        {/* Desktop Sidebar */}

        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}

        <div
          className={`fixed inset-0 z-50 transition-all duration-300 lg:hidden ${
            open ? "visible" : "invisible"
          }`}
        >
          {/* Overlay */}

          <div
            className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
              open ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}

          <div
            className={`absolute left-0 top-0 h-full transition-transform duration-300 ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar />

            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-white p-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main */}

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="min-h-[calc(100vh-32px)] rounded-3xl bg-white p-6 shadow-xl">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;