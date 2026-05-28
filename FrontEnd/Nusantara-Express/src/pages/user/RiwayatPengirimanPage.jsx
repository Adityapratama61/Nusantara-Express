import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Search,
  ArrowRight,
} from "lucide-react";

const statusStyles = {
  Selesai: "bg-green-100 text-green-700 border-green-200",
  "Dalam Perjalanan": "bg-blue-100 text-blue-700 border-blue-200",
  Transit: "bg-orange-100 text-orange-700 border-orange-200",
  "Menunggu Pickup": "bg-slate-100 text-slate-700 border-slate-200",
  "Sampai Tujuan": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Gagal Kirim": "bg-red-100 text-red-700 border-red-200",
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
        statusStyles[status] || "bg-slate-100 text-slate-700 border-slate-200"
      }`}>
      {status}
    </span>
  );
};

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

const getUserFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

const RiwayatPengirimanPage = () => {
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [dateFilter, setDateFilter] = useState("");
  const [activeChip, setActiveChip] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = getUserFromStorage();
  const idUser = user?.id_user || 4;

  const fetchShipments = async (keyword = "") => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/user/pengiriman/${idUser}`, {
        params: {
          search: keyword || undefined,
        },
      });

      setShipments(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengambil riwayat pengiriman.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleFilter = () => {
    fetchShipments(search);
  };

  const handleChipClick = (item) => {
    setActiveChip(item);
    setStatusFilter(item === "Semua" ? "Semua Status" : item);
  };

  const filteredShipments = shipments.filter((item) => {
    const matchStatus =
      statusFilter === "Semua Status" ||
      activeChip === "Semua" ||
      item.status_pengiriman === statusFilter ||
      item.status_pengiriman === activeChip;

    const matchDate =
      dateFilter === "" ||
      formatDate(item.tanggal_pengiriman)
        .toLowerCase()
        .includes(dateFilter.toLowerCase()) ||
      String(item.tanggal_pengiriman || "")
        .toLowerCase()
        .includes(dateFilter.toLowerCase());

    return matchStatus && matchDate;
  });

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">
          Riwayat Pengiriman
        </h1>
        <p className="mt-2 text-slate-600">
          Lihat seluruh riwayat pengiriman Anda dalam satu tempat.
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[1.5fr_0.8fr_0.8fr_auto] lg:items-end">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Cari Nomor Resi
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3.5">
              <Search size={22} className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Masukkan nomor resi"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setActiveChip(
                  e.target.value === "Semua Status" ? "Semua" : e.target.value,
                );
              }}
              className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3.5 outline-none">
              <option>Semua Status</option>
              <option>Menunggu Pickup</option>
              <option>Dalam Perjalanan</option>
              <option>Transit</option>
              <option>Sampai Tujuan</option>
              <option>Selesai</option>
              <option>Gagal Kirim</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Rentang Tanggal
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3.5">
              <input
                type="text"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                placeholder="dd/mm/yyyy"
                className="w-full bg-transparent outline-none"
              />
              <Calendar size={20} className="text-slate-500" />
            </div>
          </div>

          <button
            onClick={handleFilter}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-7 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600">
            <Filter size={20} />
            Filter
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {[
            "Semua",
            "Menunggu Pickup",
            "Dalam Perjalanan",
            "Transit",
            "Sampai Tujuan",
            "Selesai",
            "Gagal Kirim",
          ].map((item) => (
            <button
              key={item}
              onClick={() => handleChipClick(item)}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                activeChip === item
                  ? "bg-blue-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}>
              {item}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-6 py-5 font-semibold">Nomor Resi</th>
                <th className="px-6 py-5 font-semibold">Pengirim</th>
                <th className="px-6 py-5 font-semibold">Penerima</th>
                <th className="px-6 py-5 font-semibold">Asal / Tujuan</th>
                <th className="px-6 py-5 font-semibold">Berat</th>
                <th className="px-6 py-5 font-semibold">Biaya Kirim</th>
                <th className="px-6 py-5 font-semibold">Status</th>
                <th className="px-6 py-5 font-semibold">Tanggal</th>
                <th className="px-6 py-5 font-semibold">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-10 text-center font-semibold text-slate-500">
                    Mengambil data riwayat pengiriman...
                  </td>
                </tr>
              ) : filteredShipments.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-10 text-center font-semibold text-slate-500">
                    Data pengiriman tidak ditemukan.
                  </td>
                </tr>
              ) : (
                filteredShipments.map((item) => (
                  <tr
                    key={item.id_pengiriman}
                    className="border-t border-slate-100 transition hover:bg-slate-50">
                    <td className="px-6 py-5 font-bold text-blue-700">
                      {item.nomor_resi}
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-950">
                        {item.nama_pengirim}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">-</p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-950">
                        {item.nama_penerima}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">-</p>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 font-semibold text-slate-950">
                        <span>{item.kota_asal}</span>
                        <ArrowRight size={16} className="text-slate-400" />
                        <span>{item.kota_tujuan}</span>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-slate-700">
                      {Number(item.berat_barang || 0)}kg
                    </td>

                    <td className="px-6 py-5 font-bold text-slate-950">
                      {formatRupiah(item.biaya_kirim)}
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={item.status_pengiriman} />
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {formatDate(item.tanggal_pengiriman)}
                    </td>

                    <td className="px-6 py-5">
                      <Link
                        to={`/user/detail-pengiriman/${item.id_pengiriman}`}
                        className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50">
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-600">
            Menampilkan{" "}
            <span className="font-bold">{filteredShipments.length}</span> dari{" "}
            <span className="font-bold">{shipments.length}</span> pengiriman
          </p>

          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-slate-200 p-3 text-slate-500 hover:bg-slate-50">
              <ChevronLeft size={18} />
            </button>
            <button className="rounded-xl bg-blue-700 px-4 py-3 font-bold text-white">
              1
            </button>
            <button className="rounded-xl border border-slate-200 p-3 text-slate-500 hover:bg-slate-50">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <Link
        to="/cek-ongkir"
        className="fixed bottom-8 right-8 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white shadow-xl shadow-orange-500/30 transition hover:bg-orange-600">
        <Plus size={30} />
      </Link>
    </section>
  );
};

export default RiwayatPengirimanPage;
