import { NavLink, Link } from "react-router-dom";
import { Bell, UserCircle, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import logo from "../../assets/images/logo-nusantara.png";

const UserNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navClass = ({ isActive }) =>
    isActive
      ? "border-b-2 border-blue-700 pb-1 font-bold text-blue-700"
      : "text-slate-700 hover:text-blue-700";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/user/dashboard" className="flex items-center gap-3">
          <img src={logo} alt="Nusantara Express" className="h-10 w-10" />

          <div>
            <h1 className="text-lg font-bold leading-tight text-slate-950">
              Nusantara Express
            </h1>
            <p className="text-xs text-slate-500">Customer Dashboard</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          <NavLink to="/user/dashboard" className={navClass}>
            Dashboard
          </NavLink>

          <NavLink to="/user/riwayat-pengiriman" className={navClass}>
            Riwayat Pengiriman
          </NavLink>

          <NavLink to="/user/notifikasi" className={navClass}>
            Notifikasi
          </NavLink>

          <NavLink to="/user/profile" className={navClass}>
            Profil
          </NavLink>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/user/notifikasi"
            className="relative rounded-full p-2 text-slate-700 hover:bg-slate-100">
            <Bell size={21} />
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
          </Link>

          <Link
            to="/user/profile"
            className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50">
            <UserCircle size={22} className="text-blue-700" />
            Budi Santoso
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
            <LogOut size={17} />
            Logout
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-xl border border-slate-200 p-2 md:hidden">
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4 text-sm">
            <NavLink
              to="/user/dashboard"
              className={navClass}
              onClick={() => setIsOpen(false)}>
              Dashboard
            </NavLink>

            <NavLink
              to="/user/riwayat-pengiriman"
              className={navClass}
              onClick={() => setIsOpen(false)}>
              Riwayat Pengiriman
            </NavLink>

            <NavLink
              to="/user/notifikasi"
              className={navClass}
              onClick={() => setIsOpen(false)}>
              Notifikasi
            </NavLink>

            <NavLink
              to="/user/profile"
              className={navClass}
              onClick={() => setIsOpen(false)}>
              Profil
            </NavLink>

            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">
              <LogOut size={17} />
              Logout
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default UserNavbar;
