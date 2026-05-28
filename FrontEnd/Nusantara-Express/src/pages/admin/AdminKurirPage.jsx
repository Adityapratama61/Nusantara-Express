import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  MapPin,
  Phone,
  Plus,
  Save,
  Search,
  Trash2,
  User,
  UserCheck,
  UserRound,
  UserX,
  X,
} from "lucide-react";
import api from "../../services/api";

const initialForm = {
  nama_kurir: "",
  no_telepon: "",
  alamat: "",
  area_tugas: "",
  status: "aktif",
};

const statusStyles = {
  aktif: "bg-green-100 text-green-700",
  nonaktif: "bg-red-100 text-red-700",
};

const statusLabels = {
  aktif: "Aktif",
  nonaktif: "Nonaktif",
};

const getInitial = (name = "") => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const AdminKurirPage = () => {
  const [couriers, setCouriers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchCouriers = async (keyword = "") => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/kurir", {
        params: {
          search: keyword || undefined,
        },
      });

      setCouriers(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data kurir.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCouriers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCouriers(search);
  };

  const openCreateModal = () => {
    setModalType("create");
    setSelectedCourier(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (courier) => {
    setModalType("edit");
    setSelectedCourier(courier);
    setFormData({
      nama_kurir: courier.nama_kurir || "",
      no_telepon: courier.no_telepon || "",
      alamat: courier.alamat || "",
      area_tugas: courier.area_tugas || "",
      status: courier.status || "aktif",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourier(null);
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
        await api.post("/kurir", formData);
      } else {
        await api.put(`/kurir/${selectedCourier.id_kurir}`, formData);
      }

      closeModal();
      fetchCouriers(search);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan data kurir.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (courier) => {
    const confirmDelete = window.confirm(
      `Yakin ingin menghapus kurir ${courier.nama_kurir}?`,
    );

    if (!confirmDelete) return;

    setError("");

    try {
      await api.delete(`/kurir/${courier.id_kurir}`);
      fetchCouriers(search);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menghapus data kurir.");
    }
  };

  const totalKurir = couriers.length;
  const kurirAktif = couriers.filter((item) => item.status === "aktif").length;
  const kurirNonaktif = couriers.filter(
    (item) => item.status === "nonaktif",
  ).length;

  return (
    <section>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
            Data Kurir
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola data kurir, nomor telepon, alamat, area tugas, dan status.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600">
          <Plus size={20} />
          Tambah Kurir
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <UserRound size={25} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Total Kurir
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {totalKurir}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <UserCheck size={25} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Kurir Aktif
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {kurirAktif}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
            <UserX size={25} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Kurir Nonaktif
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {kurirNonaktif}
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
              placeholder="Cari nama kurir, area, atau status..."
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
                fetchCouriers();
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
          <table className="w-full min-w-[1050px] table-fixed text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="w-[240px] px-6 py-4 font-bold">Nama Kurir</th>
                <th className="w-[170px] px-6 py-4 font-bold">Nomor Telepon</th>
                <th className="w-[190px] px-6 py-4 font-bold">Alamat</th>
                <th className="w-[220px] px-6 py-4 font-bold">Area Tugas</th>
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
                    colSpan="6"
                    className="px-6 py-10 text-center font-semibold text-slate-500">
                    Mengambil data kurir...
                  </td>
                </tr>
              ) : couriers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center font-semibold text-slate-500">
                    Data kurir tidak ditemukan.
                  </td>
                </tr>
              ) : (
                couriers.map((courier) => (
                  <tr
                    key={courier.id_kurir}
                    className="border-t border-slate-100 transition hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-sm font-extrabold text-blue-700">
                          {getInitial(courier.nama_kurir)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-extrabold text-slate-950">
                            {courier.nama_kurir}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-blue-700">
                            {courier.kode_kurir}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 whitespace-nowrap text-slate-700">
                        <Phone size={17} className="shrink-0 text-slate-400" />
                        {courier.no_telepon}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <MapPin size={17} className="shrink-0 text-slate-400" />
                        <span className="truncate">{courier.alamat}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex max-w-full rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        <span className="truncate">
                          {courier.area_tugas || "-"}
                        </span>
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${
                          statusStyles[courier.status] ||
                          "bg-slate-100 text-slate-700"
                        }`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {statusLabels[courier.status] || courier.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(courier)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-blue-700 hover:bg-blue-50">
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(courier)}
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
            Menampilkan <span className="font-bold">{couriers.length}</span>{" "}
            data kurir
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
            <h2 className="text-2xl font-bold">Data Kurir Terhubung API</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Data kurir pada halaman ini sudah diambil langsung dari database
              MySQL melalui backend PHP Native.
            </p>
          </div>

          <button
            onClick={() => fetchCouriers()}
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
                  {modalType === "create" ? "Tambah Kurir" : "Edit Kurir"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Lengkapi data kurir operasional Nusantara Express.
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
                  Nama Kurir
                </label>
                <input
                  type="text"
                  name="nama_kurir"
                  value={formData.nama_kurir}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Agus Setiawan"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  No. Telepon
                </label>
                <input
                  type="text"
                  name="no_telepon"
                  value={formData.no_telepon}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="081222113344"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Area Tugas
                </label>
                <input
                  type="text"
                  name="area_tugas"
                  value={formData.area_tugas}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Jakarta - Bekasi"
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

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Alamat
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Masukkan alamat kurir"
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

export default AdminKurirPage;
