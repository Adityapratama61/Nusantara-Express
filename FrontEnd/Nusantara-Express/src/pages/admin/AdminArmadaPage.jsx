import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Fuel,
  Plus,
  Route,
  Save,
  Search,
  Trash2,
  Truck,
  User,
  Wrench,
  X,
} from "lucide-react";
import api from "../../services/api";

const initialForm = {
  nomor_kendaraan: "",
  jenis_kendaraan: "",
  kapasitas: "",
  sopir: "",
  status_armada: "tersedia",
  bahan_bakar: "",
  rute_aktif: "",
};

const statusStyles = {
  tersedia: "bg-green-100 text-green-700",
  digunakan: "bg-blue-100 text-blue-700",
  perawatan: "bg-orange-100 text-orange-700",
};

const statusLabels = {
  tersedia: "Tersedia",
  digunakan: "Digunakan",
  perawatan: "Perawatan",
};

const AdminArmadaPage = () => {
  const [fleets, setFleets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedFleet, setSelectedFleet] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchFleets = async (keyword = "") => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/armada", {
        params: {
          search: keyword || undefined,
        },
      });

      setFleets(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data armada.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFleets();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFleets(search);
  };

  const openCreateModal = () => {
    setModalType("create");
    setSelectedFleet(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (fleet) => {
    setModalType("edit");
    setSelectedFleet(fleet);
    setFormData({
      nomor_kendaraan: fleet.nomor_kendaraan || "",
      jenis_kendaraan: fleet.jenis_kendaraan || "",
      kapasitas: fleet.kapasitas || "",
      sopir: fleet.sopir || "",
      status_armada: fleet.status_armada || "tersedia",
      bahan_bakar: fleet.bahan_bakar || "",
      rute_aktif: fleet.rute_aktif || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFleet(null);
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
        await api.post("/armada", formData);
      } else {
        await api.put(`/armada/${selectedFleet.id_armada}`, formData);
      }

      closeModal();
      fetchFleets(search);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan data armada.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (fleet) => {
    const confirmDelete = window.confirm(
      `Yakin ingin menghapus armada ${fleet.nomor_kendaraan}?`,
    );

    if (!confirmDelete) return;

    setError("");

    try {
      await api.delete(`/armada/${fleet.id_armada}`);
      fetchFleets(search);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menghapus data armada.");
    }
  };

  const totalArmada = fleets.length;
  const tersedia = fleets.filter(
    (item) => item.status_armada === "tersedia",
  ).length;
  const digunakan = fleets.filter(
    (item) => item.status_armada === "digunakan",
  ).length;
  const perawatan = fleets.filter(
    (item) => item.status_armada === "perawatan",
  ).length;

  return (
    <section>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
            Manajemen Armada
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola kendaraan, kapasitas, sopir, dan status operasional.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600">
          <Plus size={20} />
          Tambah Armada
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <Truck size={25} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Total Armada
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {totalArmada}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <CheckCircle2 size={25} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Tersedia
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {tersedia}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <Clock size={25} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Digunakan
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {digunakan}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
            <Wrench size={25} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Perawatan
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {perawatan}
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
              placeholder="Cari armada, sopir, atau nomor kendaraan..."
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
                fetchFleets();
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
          <table className="w-full min-w-[1150px] table-fixed text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="w-[170px] px-6 py-4 font-bold">
                  Nomor Kendaraan
                </th>
                <th className="w-[170px] px-6 py-4 font-bold">
                  Jenis Kendaraan
                </th>
                <th className="w-[120px] px-6 py-4 font-bold">Kapasitas</th>
                <th className="w-[170px] px-6 py-4 font-bold">Sopir</th>
                <th className="w-[180px] px-6 py-4 font-bold">Rute Aktif</th>
                <th className="w-[140px] px-6 py-4 font-bold">Bahan Bakar</th>
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
                    Mengambil data armada...
                  </td>
                </tr>
              ) : fleets.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-10 text-center font-semibold text-slate-500">
                    Data armada tidak ditemukan.
                  </td>
                </tr>
              ) : (
                fleets.map((fleet) => (
                  <tr
                    key={fleet.id_armada}
                    className="border-t border-slate-100 transition hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="whitespace-nowrap font-extrabold text-slate-950">
                        {fleet.nomor_kendaraan}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-blue-700">
                        Fleet Unit
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 whitespace-nowrap font-semibold text-slate-800">
                        <Truck size={17} className="shrink-0 text-blue-700" />
                        {fleet.jenis_kendaraan}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                        {fleet.kapasitas}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 whitespace-nowrap text-slate-700">
                        <User size={17} className="shrink-0 text-slate-400" />
                        {fleet.sopir}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Route size={17} className="shrink-0 text-slate-400" />
                        <span className="line-clamp-2">
                          {fleet.rute_aktif || "-"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 whitespace-nowrap text-slate-700">
                        <Fuel size={17} className="shrink-0 text-slate-400" />
                        {fleet.bahan_bakar || "-"}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${
                          statusStyles[fleet.status_armada] ||
                          "bg-slate-100 text-slate-700"
                        }`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {statusLabels[fleet.status_armada] ||
                          fleet.status_armada}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(fleet)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-blue-700 hover:bg-blue-50">
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(fleet)}
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
            Menampilkan <span className="font-bold">{fleets.length}</span> data
            armada
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
            <h2 className="text-2xl font-bold">Data Armada Terhubung API</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Data armada pada halaman ini sudah diambil langsung dari database
              MySQL melalui backend PHP Native.
            </p>
          </div>

          <button
            onClick={() => fetchFleets()}
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
                  {modalType === "create" ? "Tambah Armada" : "Edit Armada"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Lengkapi data kendaraan operasional Nusantara Express.
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
                  Nomor Kendaraan
                </label>
                <input
                  type="text"
                  name="nomor_kendaraan"
                  value={formData.nomor_kendaraan}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="B 1234 NEL"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Jenis Kendaraan
                </label>
                <input
                  type="text"
                  name="jenis_kendaraan"
                  value={formData.jenis_kendaraan}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Box Truck"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Kapasitas
                </label>
                <input
                  type="text"
                  name="kapasitas"
                  value={formData.kapasitas}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="2 Ton"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Sopir
                </label>
                <input
                  type="text"
                  name="sopir"
                  value={formData.sopir}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Agus Setiawan"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Status Armada
                </label>
                <select
                  name="status_armada"
                  value={formData.status_armada}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100">
                  <option value="tersedia">Tersedia</option>
                  <option value="digunakan">Digunakan</option>
                  <option value="perawatan">Perawatan</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Bahan Bakar
                </label>
                <input
                  type="text"
                  name="bahan_bakar"
                  value={formData.bahan_bakar}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Diesel"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Rute Aktif
                </label>
                <input
                  type="text"
                  name="rute_aktif"
                  value={formData.rute_aktif}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Jakarta - Bandung"
                />
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

export default AdminArmadaPage;
