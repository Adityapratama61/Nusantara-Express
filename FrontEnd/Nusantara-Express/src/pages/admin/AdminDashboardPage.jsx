import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  RefreshCcw,
  TrendingUp,
  Truck,
  Users,
  WalletCards,
} from "lucide-react";
import api from "../../services/api";

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(value || 0));
};

const formatDate = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const statusStyles = {
  "Menunggu Pickup": "bg-slate-100 text-slate-700",
  "Dalam Perjalanan": "bg-blue-100 text-blue-700",
  Transit: "bg-orange-100 text-orange-700",
  "Sampai Tujuan": "bg-indigo-100 text-indigo-700",
  Selesai: "bg-green-100 text-green-700",
  "Gagal Kirim": "bg-red-100 text-red-700",
};

const AdminDashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/dashboard");
      setDashboard(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengambil data dashboard.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const summary = dashboard?.summary || {};
  const monthlyShipments = dashboard?.monthly_shipments || [];
  const statusDistribution = dashboard?.status_distribution || [];
  const recentShipments = dashboard?.recent_shipments || [];

  const maxMonthlyShipment =
    monthlyShipments.length > 0
      ? Math.max(
          ...monthlyShipments.map((item) => Number(item.total_pengiriman || 0)),
        )
      : 1;

  if (loading) {
    return (
      <section>
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="font-semibold text-slate-500">
            Mengambil data dashboard...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Ringkasan performa pengiriman, pelanggan, armada, kurir, dan
            pendapatan.
          </p>
        </div>

        <button
          onClick={fetchDashboard}
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800">
          <RefreshCcw size={20} />
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <Package size={25} />
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              API
            </span>
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Total Pengiriman
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {summary.total_pengiriman || 0}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
            <Clock size={25} />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Dalam Proses
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {summary.dalam_proses || 0}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <CheckCircle2 size={25} />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Pengiriman Selesai
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {summary.pengiriman_selesai || 0}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <WalletCards size={25} />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Total Pendapatan
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {formatRupiah(summary.total_pendapatan)}
          </h2>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <Users size={25} />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Total Pelanggan
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {summary.total_pelanggan || 0}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
            <Truck size={25} />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Total Armada
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {summary.total_armada || 0}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <Users size={25} />
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Total Kurir
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {summary.total_kurir || 0}
          </h2>
        </div>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_390px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Grafik Pengiriman Bulanan
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Data jumlah pengiriman berdasarkan bulan dari database.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
              <TrendingUp size={18} />
              Monthly Report
            </div>
          </div>

          <div className="mt-8 flex h-80 items-end gap-4 rounded-3xl bg-slate-50 p-6">
            {monthlyShipments.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
                Belum ada data grafik bulanan.
              </div>
            ) : (
              monthlyShipments.map((item) => {
                const height =
                  maxMonthlyShipment > 0
                    ? (Number(item.total_pengiriman || 0) /
                        maxMonthlyShipment) *
                      100
                    : 0;

                return (
                  <div
                    key={item.bulan}
                    className="flex flex-1 flex-col items-center">
                    <div
                      className="w-full rounded-t-xl bg-blue-700"
                      style={{ height: `${Math.max(height, 8)}%` }}
                      title={`${item.total_pengiriman} pengiriman`}
                    />
                    <span className="mt-3 text-xs font-bold text-slate-500">
                      {item.bulan}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">
            Distribusi Status
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Jumlah pengiriman berdasarkan status.
          </p>

          <div className="mt-7 space-y-5">
            {statusDistribution.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">
                Belum ada data status.
              </div>
            ) : (
              statusDistribution.map((item) => (
                <div
                  key={item.status_pengiriman}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                        statusStyles[item.status_pengiriman] ||
                        "bg-slate-100 text-slate-700"
                      }`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {item.status_pengiriman}
                    </span>
                  </div>

                  <p className="text-xl font-extrabold text-slate-950">
                    {item.total}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 px-7 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Pengiriman Terbaru
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Lima data pengiriman terbaru dari database.
            </p>
          </div>

          <Link
            to="/admin/pengiriman"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
            Lihat Semua
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] table-fixed text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="w-[190px] px-6 py-4 font-bold">Nomor Resi</th>
                <th className="w-[180px] px-6 py-4 font-bold">Pengirim</th>
                <th className="w-[180px] px-6 py-4 font-bold">Penerima</th>
                <th className="w-[220px] px-6 py-4 font-bold">Rute</th>
                <th className="w-[150px] px-6 py-4 font-bold">Biaya</th>
                <th className="w-[180px] px-6 py-4 font-bold">Status</th>
                <th className="w-[120px] px-6 py-4 text-center font-bold">
                  Detail
                </th>
              </tr>
            </thead>

            <tbody>
              {recentShipments.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-10 text-center font-semibold text-slate-500">
                    Belum ada pengiriman terbaru.
                  </td>
                </tr>
              ) : (
                recentShipments.map((item) => (
                  <tr
                    key={item.id_pengiriman}
                    className="border-t border-slate-100 transition hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="whitespace-nowrap font-extrabold text-blue-700">
                        {item.nomor_resi}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatDate(item.tanggal_pengiriman)}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="block truncate font-semibold text-slate-800">
                        {item.nama_pengirim}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="block truncate font-semibold text-slate-800">
                        {item.nama_penerima}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 whitespace-nowrap font-semibold text-slate-800">
                        <MapPin size={17} className="shrink-0 text-blue-700" />
                        <span>{item.kota_asal}</span>
                        <ArrowRight
                          size={16}
                          className="shrink-0 text-slate-400"
                        />
                        <span>{item.kota_tujuan}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap font-extrabold text-slate-950">
                        {formatRupiah(item.biaya_kirim)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${
                          statusStyles[item.status_pengiriman] ||
                          "bg-slate-100 text-slate-700"
                        }`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {item.status_pengiriman}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/admin/pengiriman/detail/${item.id_pengiriman}`}
                        className="inline-flex items-center justify-center rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100">
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 rounded-3xl bg-slate-950 p-8 text-white shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Dashboard Terhubung API</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Semua angka pada dashboard ini sudah diambil langsung dari
              database MySQL melalui endpoint backend PHP Native.
            </p>
          </div>

          <Link
            to="/admin/laporan"
            className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-950 hover:bg-slate-100">
            Lihat Laporan
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboardPage;
