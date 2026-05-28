import { NavLink, Link } from "react-router-dom";
import logo from "../../assets/images/logo-nusantara-admin.png";
import {
  LayoutDashboard,
  Users,
  Truck,
  MapPin,
  Package,
  WalletCards,
  BarChart3,
  UserCog,
  LogOut,
  Plus,
} from "lucide-react";

const menus = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Pelanggan", path: "/admin/pelanggan", icon: Users },
  { name: "Armada", path: "/admin/armada", icon: Truck },
  { name: "Kurir", path: "/admin/kurir", icon: MapPin },
  { name: "Pengiriman", path: "/admin/pengiriman", icon: Package },
  { name: "Tarif Ongkir", path: "/admin/tarif-ongkir", icon: WalletCards },
  { name: "Laporan", path: "/admin/laporan", icon: BarChart3 },
  { name: "Users", path: "/admin/users", icon: UserCog },
];

const AdminSidebar = () => {
  const navClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20"
      : "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-white";

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 bg-[#111827] px-6 py-7 text-white lg:flex lg:flex-col">
      <Link to="/admin/dashboard" className="shrink-0">
        <img
          src={logo}
          alt="Nusantara Express"
          className="h-20 w-45 object-contain"
        />
      </Link>

      <nav className="no-scrollbar mt-12 flex-1 space-y-2 overflow-y-auto pr-1">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink key={menu.name} to={menu.path} className={navClass}>
              <Icon size={20} />
              {menu.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-6 shrink-0">
        <div className="mb-5 h-px bg-slate-800" />

        <Link
          to="/admin/pengiriman"
          className="mb-4 flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700">
          <Plus size={20} />
          New Shipment
        </Link>

        <Link
          to="/login"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-white">
          <LogOut size={20} />
          Logout
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
