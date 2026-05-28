import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="max-w-xl text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <SearchX size={44} />
        </div>

        <h1 className="mt-8 text-5xl font-extrabold text-slate-950">404</h1>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">
          Halaman Tidak Ditemukan
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-500">
          Maaf, halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600">
          <Home size={18} />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
