import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  MapPin,
  Plus,
  Save,
  Search,
  Trash2,
  WalletCards,
  X,
  Clock,
  Route,
} from "lucide-react";
import api from "../../services/api";

const initialForm = {
  kota_asal: "",
  kota_tujuan: "",
  layanan: "reguler",
  tarif_per_kg: "",
  estimasi: "",
  status: "aktif",
};

const serviceStyles = {
  reguler: "bg-blue-100 text-blue-700",
  express: "bg-orange-100 text-orange-700",
  cargo: "bg-slate-100 text-slate-700",
};

const serviceLabels = {
  reguler: "Reguler",
  express: "Express",
  cargo: "Cargo",
};

const statusStyles = {
  aktif: "bg-green-100 text-green-700",
  nonaktif: "bg-red-100 text-red-700",
};

const statusLabels = {
  aktif: "Aktif",
  nonaktif: "Nonaktif",
};

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(value || 0));
};

const AdminTarifOngkirPage = () => {
  const [rates, setRates] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedRate, setSelectedRate] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchRates = async (keyword = "") => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/tarif-ongkir", {
        params: {
          search: keyword || undefined,
        },
      });

      setRates(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengambil data tarif ongkir.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRates(search);
  };

  const openCreateModal = () => {
    setModalType("create");
    setSelectedRate(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (rate) => {
    setModalType("edit");
    setSelectedRate(rate);
    setFormData({
      kota_asal: rate.kota_asal || "",
      kota_tujuan: rate.kota_tujuan || "",
      layanan: rate.layanan || "reguler",
      tarif_per_kg: rate.tarif_per_kg || "",
      estimasi: rate.estimasi || "",
      status: rate.status || "aktif",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRate(null);
    setFormData(initialForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (modalType === "create") {
        await api.post("/tarif-ongkir", formData);
      } else {
        await api.put(`/tarif-ongkir/${selectedRate.id_tarif}`, formData);
      }

      closeModal();
      fetchRates(search);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal menyimpan data tarif ongkir.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (rate) => {
    const confirmDelete = window.confirm(
      `Yakin ingin menghapus tarif ${rate.kota_asal} ke ${rate.kota_tujuan}?`,
    );

    if (!confirmDelete) return;

    setError("");

    try {
      await api.delete(`/tarif-ongkir/${rate.id_tarif}`);
      fetchRates(search);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal menghapus data tarif ongkir.",
      );
    }
  };

  const totalTarif = rates.length;
  const ruteAktif = rates.filter((item) => item.status === "aktif").length;
  const ruteNonaktif = rates.filter(
    (item) => item.status === "nonaktif",
  ).length;
  const rataTarif =
    rates.length > 0
      ? rates.reduce((sum, item) => sum + Number(item.tarif_per_kg || 0), 0) /
        rates.length
      : 0;

  return (
    <section>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
            Tarif Ongkir
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola tarif pengiriman antar kota, layanan, estimasi, dan status.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600">
          <Plus size={20} />
          Tambah Tarif
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <WalletCards size={25} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Total Tarif
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {totalTarif}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <Route size={25} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Rute Aktif
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {ruteAktif}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
            <X size={25} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Rute Nonaktif
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {ruteNonaktif}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
            <WalletCards size={25} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Rata-rata Tarif
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {formatRupiah(rataTarif)}
          </h2>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center gap-3 rounded-2xl bg-slate-100 px-5 py-3 md:max-w-md">
            <Search size={20} className="text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kota asal, tujuan, layanan, atau status..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 text-sm font-bold text-white hover:bg-blue-800">
              <Search size={18} />
              Cari
            </button>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                fetchRates();
              }}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
              Reset
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
              <Plus size={18} />
              Tambah Data
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] table-fixed text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="w-[130px] px-6 py-4 font-bold">ID Tarif</th>
                <th className="w-[170px] px-6 py-4 font-bold">Kota Asal</th>
                <th className="w-[180px] px-6 py-4 font-bold">Kota Tujuan</th>
                <th className="w-[140px] px-6 py-4 font-bold">Layanan</th>
                <th className="w-[150px] px-6 py-4 font-bold">Tarif / Kg</th>
                <th className="w-[130px] px-6 py-4 font-bold">Estimasi</th>
                <th className="w-[150px] px-6 py-4 font-bold">Status</th>
                <th className="w-[120px] px-6 py-4 text-center font-bold">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-10 text-center font-semibold text-slate-500">
                    Mengambil data tarif ongkir...
                  </td>
                </tr>
              ) : rates.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-10 text-center font-semibold text-slate-500">
                    Data tarif ongkir tidak ditemukan.
                  </td>
                </tr>
              ) : (
                rates.map((rate) => (
                  <tr
                    key={rate.id_tarif}
                    className="border-t border-slate-100 transition hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap font-extrabold text-blue-700">
                        {rate.kode_tarif}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 whitespace-nowrap font-semibold text-slate-800">
                        <MapPin size={17} className="shrink-0 text-blue-700" />
                        {rate.kota_asal}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 whitespace-nowrap font-semibold text-slate-800">
                        <MapPin
                          size={17}
                          className="shrink-0 text-orange-600"
                        />
                        {rate.kota_tujuan}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex w-fit whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${
                          serviceStyles[rate.layanan] ||
                          "bg-slate-100 text-slate-700"
                        }`}>
                        {serviceLabels[rate.layanan] || rate.layanan}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap font-extrabold text-slate-950">
                        {formatRupiah(rate.tarif_per_kg)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 whitespace-nowrap text-slate-700">
                        <Clock size={17} className="shrink-0 text-slate-400" />
                        {rate.estimasi}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${
                          statusStyles[rate.status] ||
                          "bg-slate-100 text-slate-700"
                        }`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {statusLabels[rate.status] || rate.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(rate)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-blue-700 hover:bg-blue-50">
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(rate)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-red-600 hover:bg-red-50">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-600">
            Menampilkan <span className="font-bold">{rates.length}</span> data
            tarif ongkir
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

      <div className="mt-10 rounded-3xl bg-slate-950 p-8 text-white shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Data Tarif Ongkir Terhubung API
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Data tarif ongkir pada halaman ini sudah diambil langsung dari
              database MySQL melalui backend PHP Native.
            </p>
          </div>

          <button
            onClick={() => fetchRates()}
            className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-950 hover:bg-slate-100">
            Refresh Data
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-6">
          <div className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950">
                  {modalType === "create"
                    ? "Tambah Tarif Ongkir"
                    : "Edit Tarif Ongkir"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Lengkapi data rute dan biaya pengiriman.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
                <X size={22} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Kota Asal
                </label>
                <input
                  type="text"
                  name="kota_asal"
                  value={formData.kota_asal}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Jakarta"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Kota Tujuan
                </label>
                <input
                  type="text"
                  name="kota_tujuan"
                  value={formData.kota_tujuan}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Bandung"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Layanan
                </label>
                <select
                  name="layanan"
                  value={formData.layanan}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100">
                  <option value="reguler">Reguler</option>
                  <option value="express">Express</option>
                  <option value="cargo">Cargo</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Tarif per Kg
                </label>
                <input
                  type="number"
                  name="tarif_per_kg"
                  value={formData.tarif_per_kg}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="8000"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Estimasi
                </label>
                <input
                  type="text"
                  name="estimasi"
                  value={formData.estimasi}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="1-2 Hari"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100">
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>

              <div className="mt-2 flex flex-col gap-3 md:col-span-2 md:flex-row md:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70">
                  <Save size={18} />
                  {submitting ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminTarifOngkirPage;
