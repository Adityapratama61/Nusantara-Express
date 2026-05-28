import { useEffect, useState } from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Users,
  UserRoundPlus,
  Edit,
  Trash2,
  X,
  Save,
} from "lucide-react";
import api from "../../services/api";

const getInitial = (name = "") => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const getAvatarColor = (type) => {
  if (type === "corporate") return "bg-slate-950 text-white";
  return "bg-blue-100 text-blue-700";
};

const initialForm = {
  nama_pelanggan: "",
  no_telepon: "",
  email: "",
  alamat: "",
  kota: "",
  tipe_pelanggan: "personal",
  status: "aktif",
};

const AdminPelangganPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchCustomers = async (keyword = "") => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/pelanggan", {
        params: {
          search: keyword || undefined,
        },
      });

      setCustomers(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengambil data pelanggan.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers(search);
  };

  const openCreateModal = () => {
    setModalType("create");
    setSelectedCustomer(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setModalType("edit");
    setSelectedCustomer(customer);
    setFormData({
      nama_pelanggan: customer.nama_pelanggan || "",
      no_telepon: customer.no_telepon || "",
      email: customer.email || "",
      alamat: customer.alamat || "",
      kota: customer.kota || "",
      tipe_pelanggan: customer.tipe_pelanggan || "personal",
      status: customer.status || "aktif",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
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
        await api.post("/pelanggan", formData);
      } else {
        await api.put(`/pelanggan/${selectedCustomer.id_pelanggan}`, formData);
      }

      closeModal();
      fetchCustomers(search);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal menyimpan data pelanggan.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (customer) => {
    const confirmDelete = window.confirm(
      `Yakin ingin menghapus pelanggan ${customer.nama_pelanggan}?`,
    );

    if (!confirmDelete) return;

    setError("");

    try {
      await api.delete(`/pelanggan/${customer.id_pelanggan}`);
      fetchCustomers(search);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal menghapus data pelanggan.",
      );
    }
  };

  const totalPelanggan = customers.length;
  const pelangganAktif = customers.filter(
    (item) => item.status === "aktif",
  ).length;
  const corporateCount = customers.filter(
    (item) => item.tipe_pelanggan === "corporate",
  ).length;

  return (
    <section>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
            Manajemen Pelanggan
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola data pelanggan dan riwayat kemitraan Nusantara Express.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600">
          <UserRoundPlus size={20} />
          Tambah Pelanggan
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <Users size={25} />
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
              API
            </span>
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Total Pelanggan
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {totalPelanggan}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <UserRoundPlus size={25} />
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
              Aktif
            </span>
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Pelanggan Aktif
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {pelangganAktif}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <Building2 size={25} />
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              Corporate
            </span>
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Entitas Perusahaan
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {corporateCount}
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
              placeholder="Cari pelanggan..."
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
                fetchCustomers();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
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
                <th className="w-[150px] px-6 py-4 font-bold">ID Pelanggan</th>
                <th className="w-[250px] px-6 py-4 font-bold">
                  Nama Pelanggan
                </th>
                <th className="w-[170px] px-6 py-4 font-bold">No. Telepon</th>
                <th className="w-[260px] px-6 py-4 font-bold">Email</th>
                <th className="w-[160px] px-6 py-4 font-bold">Alamat / Kota</th>
                <th className="w-[100px] px-6 py-4 text-center font-bold">
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
                    Mengambil data pelanggan...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center font-semibold text-slate-500">
                    Data pelanggan tidak ditemukan.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id_pelanggan}
                    className="border-t border-slate-100 transition hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap font-bold text-blue-700">
                        {customer.kode_pelanggan}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${getAvatarColor(
                            customer.tipe_pelanggan,
                          )}`}>
                          {getInitial(customer.nama_pelanggan)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-950">
                            {customer.nama_pelanggan}
                          </p>
                          <span className="mt-1 inline-flex whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
                            {customer.tipe_pelanggan}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 whitespace-nowrap text-slate-700">
                        <Phone size={17} className="shrink-0 text-slate-400" />
                        {customer.no_telepon}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 whitespace-nowrap text-slate-700">
                        <Mail size={17} className="shrink-0 text-slate-400" />
                        {customer.email || "-"}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {customer.kota}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(customer)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-blue-700 hover:bg-blue-50">
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(customer)}
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
            Menampilkan <span className="font-bold">{customers.length}</span>{" "}
            data pelanggan
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
            <h2 className="text-2xl font-bold">Data Pelanggan Terhubung API</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Data pada halaman ini sudah diambil langsung dari database MySQL
              melalui endpoint backend PHP Native.
            </p>
          </div>

          <button
            onClick={() => fetchCustomers()}
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
                    ? "Tambah Pelanggan"
                    : "Edit Pelanggan"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Lengkapi data pelanggan Nusantara Express.
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
                  Nama Pelanggan
                </label>
                <input
                  type="text"
                  name="nama_pelanggan"
                  value={formData.nama_pelanggan}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Contoh: PT. Maju Jaya"
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
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="081234567890"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="email@domain.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Kota
                </label>
                <input
                  type="text"
                  name="kota"
                  value={formData.kota}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Jakarta"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Tipe Pelanggan
                </label>
                <select
                  name="tipe_pelanggan"
                  value={formData.tipe_pelanggan}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100">
                  <option value="personal">Personal</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100">
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
                  rows="4"
                  className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Masukkan alamat lengkap"
                />
              </div>

              <div className="mt-2 flex flex-col gap-3 md:col-span-2 md:flex-row md:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-slate-300 px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70">
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

export default AdminPelangganPage;
