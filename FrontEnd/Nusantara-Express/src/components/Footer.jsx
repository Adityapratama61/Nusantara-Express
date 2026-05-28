import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <h3 className="text-xl font-bold">Nusantara Express</h3>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Solusi logistik modern untuk pengiriman barang antar kota dan antar
            provinsi di Indonesia.
          </p>
        </div>

        <div>
          <h4 className="font-semibold">Layanan</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li>
              <Link to="/tracking" className="hover:text-white">
                Tracking Resi
              </Link>
            </li>
            <li>
              <Link to="/cek-ongkir" className="hover:text-white">
                Cek Ongkir
              </Link>
            </li>
            <li>Pengiriman Antar Kota</li>
            <li>Pengiriman Antar Provinsi</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Perusahaan</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li>Tentang Kami</li>
            <li>Karier</li>
            <li>Kebijakan Privasi</li>
            <li>Syarat & Ketentuan</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Kontak</h4>
          <ul className="mt-4 space-y-4 text-sm text-slate-400">
            <li className="flex gap-3">
              <MapPin size={18} className="text-orange-400" />
              Jakarta, Indonesia
            </li>
            <li className="flex gap-3">
              <Phone size={18} className="text-orange-400" />
              +62 812-3456-7890
            </li>
            <li className="flex gap-3">
              <Mail size={18} className="text-orange-400" />
              info@nusantaraexpress.id
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        © 2026 Nusantara Express Logistics. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
