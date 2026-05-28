import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/images/logo-nusantara.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navClass = ({ isActive }) =>
    isActive
      ? "text-blue-700 font-semibold"
      : "text-slate-600 hover:text-blue-700";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Nusantara Express"
            className="h-11 w-11 rounded-xl object-contain"
          />
          <div>
            <h1 className="text-lg font-bold leading-tight text-slate-900">
              Nusantara Express
            </h1>
            <p className="text-xs text-slate-500">Logistics</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>
          <NavLink to="/tracking" className={navClass}>
            Tracking
          </NavLink>
          <NavLink to="/cek-ongkir" className={navClass}>
            Cek Ongkir
          </NavLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600">
            Daftar
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
              to="/"
              className={navClass}
              onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
            <NavLink
              to="/tracking"
              className={navClass}
              onClick={() => setIsOpen(false)}>
              Tracking
            </NavLink>
            <NavLink
              to="/cek-ongkir"
              className={navClass}
              onClick={() => setIsOpen(false)}>
              Cek Ongkir
            </NavLink>

            <div className="mt-3 flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-center text-sm font-semibold text-slate-700">
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="rounded-xl bg-orange-500 px-5 py-2.5 text-center text-sm font-semibold text-white">
                Daftar
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
