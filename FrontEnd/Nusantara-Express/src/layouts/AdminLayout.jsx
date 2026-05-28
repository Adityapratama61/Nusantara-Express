import { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  Truck,
  UserCog,
  Users,
  WalletCards,
  X,
  Plus,
} from "lucide-react";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";

const mobileMenus = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Pelanggan", path: "/admin/pelanggan", icon: Users },
  { name: "Armada", path: "/admin/armada", icon: Truck },
  { name: "Kurir", path: "/admin/kurir", icon: MapPin },
  { name: "Pengiriman", path: "/admin/pengiriman", icon: Package },
  { name: "Tarif Ongkir", path: "/admin/tarif-ongkir", icon: WalletCards },
  { name: "Laporan", path: "/admin/laporan", icon: BarChart3 },
  { name: "Users", path: "/admin/users", icon: UserCog },
];

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white"
      : "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-white";

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
          <aside className="h-full w-72 bg-[#111827] px-6 py-7 text-white">
            <div className="flex items-start justify-between gap-4">
              <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>
                <h1 className="text-xl font-bold leading-tight">
                  Nusantara Express
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Logistics Management
                </p>
              </Link>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-slate-700 p-2 text-slate-300">
                <X size={20} />
              </button>
            </div>

            <nav className="mt-12 space-y-2">
              {mobileMenus.map((menu) => {
                const Icon = menu.icon;

                return (
                  <NavLink
                    key={menu.name}
                    to={menu.path}
                    className={navClass}
                    onClick={() => setIsOpen(false)}>
                    <Icon size={20} />
                    {menu.name}
                  </NavLink>
                );
              })}
            </nav>

            <div className="absolute bottom-8 left-6 right-6">
              <div className="mb-6 h-px bg-slate-800" />

              <Link
                to="/admin/pengiriman"
                onClick={() => setIsOpen(false)}
                className="mb-5 flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white">
                <Plus size={20} />
                New Shipment
              </Link>

              <Link
                to="/login"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400">
                <LogOut size={20} />
                Logout
              </Link>
            </div>
          </aside>
        </div>
      )}

      <div className="min-h-screen lg:ml-72">
        <AdminTopbar onOpenSidebar={() => setIsOpen(true)} />

        <main className="min-h-screen overflow-x-hidden bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1500px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
