import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Headphones,
  Info,
  Package,
  Search,
  Truck,
  WalletCards,
  MapPin,
} from "lucide-react";

const StatusBadge = ({ status }) => {
  const styles = {
    Selesai: "bg-green-100 text-green-700",
    "Gagal Kirim": "bg-red-100 text-red-700",
    Gagal: "bg-red-100 text-red-700",
    "Dalam Perjalanan": "bg-blue-100 text-blue-700",
    "Sedang Dikirim": "bg-blue-100 text-blue-700",
    Transit: "bg-orange-100 text-orange-700",
    "Menunggu Pickup": "bg-slate-100 text-slate-700",
    "Sampai Tujuan": "bg-indigo-100 text-indigo-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}>
      {status}
    </span>
  );
};

const formatDate = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const getUserFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

const UserDashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = getUserFromStorage();
  const idUser = user?.id_user || 4;

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/user/dashboard/${idUser}`);
      setDashboard(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengambil data dashboard user.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const profile = dashboard?.profile || {};
  const summary = dashboard?.summary || {};
  const recentShipments = dashboard?.recent_pengiriman || [];

  const mainShipment =
    recentShipments.find(
      (item) =>
        item.status_pengiriman !== "Selesai" &&
        item.status_pengiriman !== "Gagal Kirim",
    ) || recentShipments[0];

  const handleQuickTrack = () => {
    if (!trackingInput.trim()) {
      window.location.href = "/tracking";
      return;
    }

    localStorage.setItem("tracking_resi", trackingInput.trim());
    window.location.href = "/tracking";
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="font-semibold text-slate-500">
            Mengambil data dashboard...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">
          Halo, {profile.nama_lengkap || profile.nama_pelanggan || "User"} 👋
        </h1>
        <p className="mt-2 text-slate-600">
          Pantau pengiriman Anda dengan mudah hari ini.
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Lacak Cepat</h2>

            <div className="mt-5 flex flex-col gap-4 md:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-300 bg-slate-50 px-5 py-4">
                <Search className="text-slate-400" size={22} />
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="Masukkan Nomor Resi"
                  className="w-full bg-transparent outline-none"
                />
              </div>

              <button
                onClick={handleQuickTrack}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-8 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600">
                Lacak Paket
                <Truck size={19} />
              </button>
            </div>
          </div>

          {mainShipment ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Nomor Resi
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-blue-700">
                    {mainShipment.nomor_resi}
                  </h2>
                </div>

                <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700">
                  {mainShipment.status_pengiriman}
                </span>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-[1fr_120px] md:items-center">
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-700 text-white">
                        <MapPin size={22} />
                      </div>
                      <h3 className="mt-3 font-bold text-slate-950">
                        {mainShipment.kota_asal}
                      </h3>
                      <p className="text-sm text-slate-500">Origin</p>
                    </div>

                    <div className="mx-5 h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full w-[78%] rounded-full bg-green-500" />
                    </div>

                    <div className="text-right">
                      <div className="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                        <Package size={22} />
                      </div>
                      <h3 className="mt-3 font-bold text-slate-950">
                        {mainShipment.kota_tujuan}
                      </h3>
                      <p className="text-sm text-slate-500">Destination</p>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between text-sm">
                    <span className="font-semibold text-green-600">
                      Status: {mainShipment.status_pengiriman}
                    </span>
                    <span className="text-slate-500">
                      Est. Tiba: {mainShipment.estimasi_tiba || "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-slate-50 p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-3">
                  <Info size={22} className="shrink-0 text-blue-700" />
                  <p className="text-sm text-slate-700">
                    Pengiriman menuju {mainShipment.kota_tujuan}. Kurir:{" "}
                    {mainShipment.nama_kurir || "Belum ditugaskan"}.
                  </p>
                </div>

                <Link
                  to={`/user/detail-pengiriman/${mainShipment.id_pengiriman}`}
                  className="text-sm font-bold text-blue-700">
                  Detail Lengkap
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <Package className="mx-auto text-slate-400" size={46} />
              <h2 className="mt-4 text-xl font-bold text-slate-950">
                Belum Ada Pengiriman
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Data pengiriman Anda akan muncul di sini.
              </p>
            </div>
          )}

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between px-6 py-5">
              <h2 className="text-xl font-bold text-slate-950">
                Pengiriman Terbaru
              </h2>
              <Link
                to="/user/riwayat-pengiriman"
                className="text-sm font-bold text-blue-700">
                Lihat Semua
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Resi</th>
                    <th className="px-6 py-4 font-semibold">Tujuan</th>
                    <th className="px-6 py-4 font-semibold">Tanggal</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentShipments.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center font-semibold text-slate-500">
                        Belum ada data pengiriman.
                      </td>
                    </tr>
                  ) : (
                    recentShipments.map((item) => (
                      <tr
                        key={item.id_pengiriman}
                        className="border-t border-slate-100">
                        <td className="px-6 py-4 font-bold text-blue-700">
                          {item.nomor_resi}
                        </td>
                        <td className="px-6 py-4">{item.kota_tujuan}</td>
                        <td className="px-6 py-4 text-slate-600">
                          {formatDate(item.tanggal_pengiriman)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={item.status_pengiriman} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/user/detail-pengiriman/${item.id_pengiriman}`}>
                            <ArrowRight size={18} />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                <Package size={22} />
              </div>
              <p className="mt-5 text-sm text-slate-500">Total Pengiriman</p>
              <h3 className="mt-1 text-3xl font-bold">
                {summary.total_pengiriman || 0}
              </h3>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Clock size={22} />
              </div>
              <p className="mt-5 text-sm text-slate-500">Dalam Kirim</p>
              <h3 className="mt-1 text-3xl font-bold">
                {summary.dalam_proses || 0}
              </h3>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <CheckCircle2 size={22} />
              </div>
              <p className="mt-5 text-sm text-slate-500">Selesai</p>
              <h3 className="mt-1 text-3xl font-bold">
                {summary.selesai || 0}
              </h3>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-700">
                <AlertCircle size={22} />
              </div>
              <p className="mt-5 text-sm text-slate-500">Gagal Kirim</p>
              <h3 className="mt-1 text-3xl font-bold">{summary.gagal || 0}</h3>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Akses Cepat</h2>

            <div className="mt-5 space-y-4">
              <Link
                to="/tracking"
                className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
                <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                  <BarChart3 size={22} />
                </div>
                <div>
                  <h3 className="font-bold">Statistik Tracking</h3>
                  <p className="text-sm text-slate-500">Analisis waktu kirim</p>
                </div>
              </Link>

              <Link
                to="/cek-ongkir"
                className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
                <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                  <WalletCards size={22} />
                </div>
                <div>
                  <h3 className="font-bold">Cek Ongkos Kirim</h3>
                  <p className="text-sm text-slate-500">
                    Bandingkan harga layanan
                  </p>
                </div>
              </Link>

              <Link
                to="/user/riwayat-pengiriman"
                className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
                <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                  <Clock size={22} />
                </div>
                <div>
                  <h3 className="font-bold">Riwayat Transaksi</h3>
                  <p className="text-sm text-slate-500">
                    Download invoice & resi
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 hover:bg-slate-50">
                <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                  <Headphones size={22} />
                </div>
                <div>
                  <h3 className="font-bold">Customer Service</h3>
                  <p className="text-sm text-slate-500">Bantuan 24/7</p>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
            <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold">
              PROMO
            </span>
            <h3 className="mt-5 text-xl font-bold">Kirim Ke Seluruh Asia</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Diskon 15% untuk pengiriman internasional pertama Anda.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default UserDashboardPage;
