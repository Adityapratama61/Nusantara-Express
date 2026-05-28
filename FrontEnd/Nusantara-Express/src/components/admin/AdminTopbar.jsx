import { Bell, Menu, Search, UserCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/admin/dashboard": {
    title: "Dashboard Overview",
    subtitle: "Real-time logistics performance and operational metrics.",
  },
  "/admin/pelanggan": {
    title: "Manajemen Pelanggan",
    subtitle: "Kelola akun pelanggan dan data kemitraan.",
  },
  "/admin/armada": {
    title: "Manajemen Armada",
    subtitle: "Kelola kendaraan, kapasitas, sopir, dan status armada.",
  },
  "/admin/kurir": {
    title: "Data Kurir",
    subtitle: "Pantau data kurir dan performa operasional.",
  },
  "/admin/pengiriman": {
    title: "Pengiriman Barang",
    subtitle: "Kelola seluruh proses pengiriman dan status barang.",
  },
  "/admin/tarif-ongkir": {
    title: "Tarif Ongkir",
    subtitle: "Kelola tarif pengiriman antar kota dan layanan.",
  },
  "/admin/laporan": {
    title: "Laporan Pengiriman",
    subtitle: "Analisis performa logistik dan pendapatan.",
  },
  "/admin/users": {
    title: "Manajemen Users",
    subtitle: "Kelola akun admin, staff operasional, dan kurir.",
  },
};

const AdminTopbar = ({ onOpenSidebar }) => {
  const location = useLocation();

  const currentPage =
    pageTitles[location.pathname] ||
    (location.pathname.includes("/admin/pengiriman/detail")
      ? {
          title: "Detail Pengiriman",
          subtitle: "Detail lengkap pengiriman dan tracking barang.",
        }
      : {
          title: "Admin Panel",
          subtitle: "Kelola operasional Nusantara Express.",
        });

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-[76px] items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <button
            onClick={onOpenSidebar}
            className="rounded-xl border border-slate-200 p-2 text-slate-700 lg:hidden">
            <Menu size={22} />
          </button>

          <div className="min-w-0">
            <h2 className="truncate text-xl font-extrabold text-slate-950">
              {currentPage.title}
            </h2>
            <p className="mt-1 hidden max-w-md truncate text-sm text-slate-500 md:block">
              {currentPage.subtitle}
            </p>
          </div>
        </div>

        <div className="hidden w-full max-w-lg items-center gap-3 rounded-full bg-slate-100 px-5 py-3 xl:flex">
          <Search size={20} className="shrink-0 text-slate-500" />
          <input
            type="text"
            placeholder="Search shipment, customer, or driver..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <button className="relative rounded-full p-2 text-slate-700 hover:bg-slate-100">
            <Bell size={21} />
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
          </button>

          <div className="hidden h-9 w-px bg-slate-200 md:block" />

          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <p className="text-sm font-bold text-slate-950">Admin Profile</p>
              <p className="text-xs uppercase text-slate-500">
                Logistics Manager
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-200">
              <UserCircle size={28} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
