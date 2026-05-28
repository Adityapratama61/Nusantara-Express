import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Eye,
  MapPin,
  Package,
  Plus,
  Save,
  Search,
  Trash2,
  Truck,
  WalletCards,
  X,
} from "lucide-react";
import api from "../../services/api";

const statusStyles = {
  "Menunggu Pickup": "bg-slate-100 text-slate-700",
  "Dalam Perjalanan": "bg-blue-100 text-blue-700",
  Transit: "bg-orange-100 text-orange-700",
  "Sampai Tujuan": "bg-indigo-100 text-indigo-700",
  Selesai: "bg-green-100 text-green-700",
  "Gagal Kirim": "bg-red-100 text-red-700",
};

const statusOptions = [
  "Menunggu Pickup",
  "Dalam Perjalanan",
  "Transit",
  "Sampai Tujuan",
  "Selesai",
  "Gagal Kirim",
];

const initialShipmentForm = {
  id_pelanggan: "",
  id_kurir: "",
  id_armada: "",
  id_tarif: "",
  nama_pengirim: "",
  telepon_pengirim: "",
  alamat_pengirim: "",
  nama_penerima: "",
  telepon_penerima: "",
  alamat_penerima: "",
  kota_asal: "",
  kota_tujuan: "",
  berat_barang: "",
  jenis_barang: "",
  layanan: "reguler",
  biaya_kirim: "",
  status_pengiriman: "Menunggu Pickup",
  estimasi_tiba: "",
  catatan: "",
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

const AdminPengirimanPage = () => {
  const [shipments, setShipments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);
  const [shipmentModalType, setShipmentModalType] = useState("create");
  const [selectedEditShipment, setSelectedEditShipment] = useState(null);
  const [shipmentForm, setShipmentForm] = useState(initialShipmentForm);

  const [customers, setCustomers] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [fleets, setFleets] = useState([]);
  const [rates, setRates] = useState([]);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [statusForm, setStatusForm] = useState({
    status: "Dalam Perjalanan",
    lokasi: "",
    keterangan: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchShipments = async (keyword = "") => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/pengiriman", {
        params: {
          search: keyword || undefined,
        },
      });

      setShipments(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengambil data pengiriman.",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchMasterData = async () => {
    try {
      const [customersRes, couriersRes, fleetsRes, ratesRes] =
        await Promise.all([
          api.get("/pelanggan"),
          api.get("/kurir"),
          api.get("/armada"),
          api.get("/tarif-ongkir"),
        ]);

      setCustomers(customersRes.data.data || []);
      setCouriers(couriersRes.data.data || []);
      setFleets(fleetsRes.data.data || []);
      setRates(ratesRes.data.data || []);
    } catch (err) {
      setError("Gagal mengambil data master pengiriman.");
    }
  };

  useEffect(() => {
    fetchShipments();
    fetchMasterData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchShipments(search);
  };

  const openCreateShipmentModal = () => {
    setShipmentModalType("create");
    setSelectedEditShipment(null);
    setShipmentForm(initialShipmentForm);
    setIsShipmentModalOpen(true);
  };

  const openEditShipmentModal = (shipment) => {
    setShipmentModalType("edit");
    setSelectedEditShipment(shipment);

    setShipmentForm({
      id_pelanggan: shipment.id_pelanggan || "",
      id_kurir: shipment.id_kurir || "",
      id_armada: shipment.id_armada || "",
      id_tarif: shipment.id_tarif || "",
      nama_pengirim: shipment.nama_pengirim || "",
      telepon_pengirim: shipment.telepon_pengirim || "",
      alamat_pengirim: shipment.alamat_pengirim || "",
      nama_penerima: shipment.nama_penerima || "",
      telepon_penerima: shipment.telepon_penerima || "",
      alamat_penerima: shipment.alamat_penerima || "",
      kota_asal: shipment.kota_asal || "",
      kota_tujuan: shipment.kota_tujuan || "",
      berat_barang: shipment.berat_barang || "",
      jenis_barang: shipment.jenis_barang || "",
      layanan: shipment.layanan || "reguler",
      biaya_kirim: shipment.biaya_kirim || "",
      status_pengiriman: shipment.status_pengiriman || "Menunggu Pickup",
      estimasi_tiba: shipment.estimasi_tiba || "",
      catatan: shipment.catatan || "",
    });

    setIsShipmentModalOpen(true);
  };

  const closeShipmentModal = () => {
    setIsShipmentModalOpen(false);
    setShipmentModalType("create");
    setSelectedEditShipment(null);
    setShipmentForm(initialShipmentForm);
  };

  const openStatusModal = (shipment) => {
    setSelectedShipment(shipment);
    setStatusForm({
      status: shipment.status_pengiriman || "Dalam Perjalanan",
      lokasi: shipment.kota_tujuan || "",
      keterangan: "",
    });
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedShipment(null);
    setStatusForm({
      status: "Dalam Perjalanan",
      lokasi: "",
      keterangan: "",
    });
  };

  const handleShipmentInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "id_tarif") {
      const selectedRate = rates.find(
        (rate) => String(rate.id_tarif) === String(value),
      );

      if (selectedRate) {
        setShipmentForm((prev) => ({
          ...prev,
          id_tarif: value,
          kota_asal: selectedRate.kota_asal,
          kota_tujuan: selectedRate.kota_tujuan,
          layanan: selectedRate.layanan,
          estimasi_tiba: selectedRate.estimasi,
        }));
        return;
      }

      setShipmentForm((prev) => ({
        ...prev,
        id_tarif: value,
      }));
      return;
    }

    if (name === "id_pelanggan") {
      const selectedCustomer = customers.find(
        (customer) => String(customer.id_pelanggan) === String(value),
      );

      if (selectedCustomer) {
        setShipmentForm((prev) => ({
          ...prev,
          id_pelanggan: value,
          nama_pengirim: selectedCustomer.nama_pelanggan,
          telepon_pengirim: selectedCustomer.no_telepon,
          alamat_pengirim: selectedCustomer.alamat,
          kota_asal: selectedCustomer.kota || prev.kota_asal,
        }));
        return;
      }

      setShipmentForm((prev) => ({
        ...prev,
        id_pelanggan: value,
      }));
      return;
    }

    setShipmentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusInputChange = (e) => {
    const { name, value } = e.target;

    setStatusForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectedRate = rates.find(
    (rate) => String(rate.id_tarif) === String(shipmentForm.id_tarif),
  );

  const estimatedShippingCost =
    selectedRate && shipmentForm.berat_barang
      ? Number(selectedRate.tarif_per_kg || 0) *
        Number(shipmentForm.berat_barang || 0)
      : Number(shipmentForm.biaya_kirim || 0);

  const handleSubmitShipment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        ...shipmentForm,
        id_pelanggan: shipmentForm.id_pelanggan || null,
        id_kurir: shipmentForm.id_kurir || null,
        id_armada: shipmentForm.id_armada || null,
        id_tarif: shipmentForm.id_tarif || null,
        biaya_kirim: estimatedShippingCost,
      };

      if (shipmentModalType === "create") {
        await api.post("/pengiriman", payload);
      } else {
        await api.put(
          `/pengiriman/${selectedEditShipment.id_pengiriman}`,
          payload,
        );
      }

      closeShipmentModal();
      fetchShipments(search);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal menyimpan data pengiriman.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();

    if (!selectedShipment) return;

    setSubmitting(true);
    setError("");

    try {
      await api.put(`/pengiriman/${selectedShipment.id_pengiriman}/status`, {
        status: statusForm.status,
        lokasi: statusForm.lokasi,
        keterangan: statusForm.keterangan,
      });

      closeStatusModal();
      fetchShipments(search);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal memperbarui status pengiriman.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (shipment) => {
    const confirmDelete = window.confirm(
      `Yakin ingin menghapus pengiriman ${shipment.nomor_resi}?`,
    );

    if (!confirmDelete) return;

    setError("");

    try {
      await api.delete(`/pengiriman/${shipment.id_pengiriman}`);
      fetchShipments(search);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal menghapus data pengiriman.",
      );
    }
  };

  const totalPengiriman = shipments.length;

  const dalamProses = shipments.filter((item) =>
    [
      "Menunggu Pickup",
      "Dalam Perjalanan",
      "Transit",
      "Sampai Tujuan",
    ].includes(item.status_pengiriman),
  ).length;

  const selesai = shipments.filter(
    (item) => item.status_pengiriman === "Selesai",
  ).length;

  const totalPendapatan = shipments
    .filter((item) => item.status_pengiriman !== "Gagal Kirim")
    .reduce((sum, item) => sum + Number(item.biaya_kirim || 0), 0);

  return (
    <section>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
            Pengiriman Barang
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola seluruh proses pengiriman, status barang, kurir, dan armada.
          </p>
        </div>

        <button
          onClick={openCreateShipmentModal}
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600">
          <Plus size={20} />
          Tambah Pengiriman
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <Package size={25} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Total Pengiriman
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {totalPengiriman}
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
            {dalamProses}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <Truck size={25} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Selesai
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {selesai}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <WalletCards size={25} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Pendapatan
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {formatRupiah(totalPendapatan)}
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
              placeholder="Cari nomor resi, pengirim, penerima, kota, atau status..."
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
                fetchShipments();
              }}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
              Reset
            </button>

            <button
              type="button"
              onClick={openCreateShipmentModal}
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
          <table className="w-full min-w-[1320px] table-fixed text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="w-[190px] px-6 py-4 font-bold">Nomor Resi</th>
                <th className="w-[180px] px-6 py-4 font-bold">Pengirim</th>
                <th className="w-[180px] px-6 py-4 font-bold">Penerima</th>
                <th className="w-[220px] px-6 py-4 font-bold">Rute</th>
                <th className="w-[100px] px-6 py-4 font-bold">Berat</th>
                <th className="w-[150px] px-6 py-4 font-bold">Biaya</th>
                <th className="w-[160px] px-6 py-4 font-bold">Kurir</th>
                <th className="w-[150px] px-6 py-4 font-bold">Armada</th>
                <th className="w-[180px] px-6 py-4 font-bold">Status</th>
                <th className="w-[180px] px-6 py-4 text-center font-bold">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="10"
                    className="px-6 py-10 text-center font-semibold text-slate-500">
                    Mengambil data pengiriman...
                  </td>
                </tr>
              ) : shipments.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="px-6 py-10 text-center font-semibold text-slate-500">
                    Data pengiriman tidak ditemukan.
                  </td>
                </tr>
              ) : (
                shipments.map((item) => (
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
                      <span className="inline-flex whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                        {Number(item.berat_barang)} Kg
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="whitespace-nowrap font-extrabold text-slate-950">
                        {formatRupiah(item.biaya_kirim)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="block truncate text-slate-700">
                        {item.nama_kurir || "-"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {item.nomor_kendaraan || "-"}
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
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/admin/pengiriman/detail/${item.id_pengiriman}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                          title="Detail">
                          <Eye size={18} />
                        </Link>

                        <button
                          onClick={() => openEditShipmentModal(item)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-blue-700 hover:bg-blue-50"
                          title="Edit Data">
                          <Edit size={18} />
                        </button>

                        <button
                          onClick={() => openStatusModal(item)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-orange-600 hover:bg-orange-50"
                          title="Update Status">
                          <Clock size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(item)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-red-600 hover:bg-red-50"
                          title="Hapus">
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
            Menampilkan <span className="font-bold">{shipments.length}</span>{" "}
            data pengiriman
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
              Data Pengiriman Terhubung API
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Data pengiriman pada halaman ini sudah diambil langsung dari
              database MySQL melalui backend PHP Native.
            </p>
          </div>

          <button
            onClick={() => fetchShipments()}
            className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-950 hover:bg-slate-100">
            Refresh Data
          </button>
        </div>
      </div>

      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-6">
          <div className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950">
                  Update Status Pengiriman
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Resi:{" "}
                  <span className="font-bold text-blue-700">
                    {selectedShipment?.nomor_resi}
                  </span>
                </p>
              </div>

              <button
                onClick={closeStatusModal}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Status Baru
                </label>
                <select
                  name="status"
                  value={statusForm.status}
                  onChange={handleStatusInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100">
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Lokasi Terbaru
                </label>
                <input
                  type="text"
                  name="lokasi"
                  value={statusForm.lokasi}
                  onChange={handleStatusInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Contoh: Hub Bandung"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Keterangan
                </label>
                <textarea
                  name="keterangan"
                  value={statusForm.keterangan}
                  onChange={handleStatusInputChange}
                  rows="3"
                  className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Masukkan keterangan update status..."
                />
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:justify-end">
                <button
                  type="button"
                  onClick={closeStatusModal}
                  className="rounded-2xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70">
                  <Save size={18} />
                  {submitting ? "Menyimpan..." : "Simpan Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isShipmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-6">
          <div className="w-full max-w-4xl rounded-3xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-slate-950">
                  {shipmentModalType === "create"
                    ? "Tambah Pengiriman"
                    : "Edit Pengiriman"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Lengkapi data pengirim, penerima, armada, kurir, dan tarif
                  ongkir.
                </p>
              </div>

              <button
                onClick={closeShipmentModal}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
                <X size={22} />
              </button>
            </div>

            <form
              onSubmit={handleSubmitShipment}
              className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Pelanggan / Pengirim
                </label>
                <select
                  name="id_pelanggan"
                  value={shipmentForm.id_pelanggan}
                  onChange={handleShipmentInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100">
                  <option value="">Pilih pelanggan</option>
                  {customers.map((customer) => (
                    <option
                      key={customer.id_pelanggan}
                      value={customer.id_pelanggan}>
                      {customer.kode_pelanggan} - {customer.nama_pelanggan}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Tarif Ongkir
                </label>
                <select
                  name="id_tarif"
                  value={shipmentForm.id_tarif}
                  onChange={handleShipmentInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100">
                  <option value="">Pilih tarif ongkir</option>
                  {rates
                    .filter((rate) => rate.status === "aktif")
                    .map((rate) => (
                      <option key={rate.id_tarif} value={rate.id_tarif}>
                        {rate.kode_tarif} - {rate.kota_asal} ke{" "}
                        {rate.kota_tujuan} ({rate.layanan}) -{" "}
                        {formatRupiah(rate.tarif_per_kg)}/kg
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Nama Pengirim
                </label>
                <input
                  type="text"
                  name="nama_pengirim"
                  value={shipmentForm.nama_pengirim}
                  onChange={handleShipmentInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Nama pengirim"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Telepon Pengirim
                </label>
                <input
                  type="text"
                  name="telepon_pengirim"
                  value={shipmentForm.telepon_pengirim}
                  onChange={handleShipmentInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="081234567890"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Alamat Pengirim
                </label>
                <textarea
                  name="alamat_pengirim"
                  value={shipmentForm.alamat_pengirim}
                  onChange={handleShipmentInputChange}
                  rows="2"
                  className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Alamat lengkap pengirim"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Nama Penerima
                </label>
                <input
                  type="text"
                  name="nama_penerima"
                  value={shipmentForm.nama_penerima}
                  onChange={handleShipmentInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Nama penerima"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Telepon Penerima
                </label>
                <input
                  type="text"
                  name="telepon_penerima"
                  value={shipmentForm.telepon_penerima}
                  onChange={handleShipmentInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="081288887777"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Alamat Penerima
                </label>
                <textarea
                  name="alamat_penerima"
                  value={shipmentForm.alamat_penerima}
                  onChange={handleShipmentInputChange}
                  rows="2"
                  className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Alamat lengkap penerima"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Kota Asal
                </label>
                <input
                  type="text"
                  name="kota_asal"
                  value={shipmentForm.kota_asal}
                  onChange={handleShipmentInputChange}
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
                  value={shipmentForm.kota_tujuan}
                  onChange={handleShipmentInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Bandung"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Berat Barang
                </label>
                <input
                  type="number"
                  name="berat_barang"
                  value={shipmentForm.berat_barang}
                  onChange={handleShipmentInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Estimasi Biaya Kirim
                </label>
                <input
                  type="text"
                  value={formatRupiah(estimatedShippingCost)}
                  readOnly
                  className="w-full rounded-2xl border border-slate-300 bg-slate-100 px-4 py-2.5 font-bold text-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Jenis Barang
                </label>
                <input
                  type="text"
                  name="jenis_barang"
                  value={shipmentForm.jenis_barang}
                  onChange={handleShipmentInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Dokumen / Elektronik / Pakaian"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Kurir
                </label>
                <select
                  name="id_kurir"
                  value={shipmentForm.id_kurir}
                  onChange={handleShipmentInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100">
                  <option value="">Pilih kurir</option>
                  {couriers
                    .filter((courier) => courier.status === "aktif")
                    .map((courier) => (
                      <option key={courier.id_kurir} value={courier.id_kurir}>
                        {courier.kode_kurir} - {courier.nama_kurir}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Armada
                </label>
                <select
                  name="id_armada"
                  value={shipmentForm.id_armada}
                  onChange={handleShipmentInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100">
                  <option value="">Pilih armada</option>
                  {fleets.map((fleet) => (
                    <option key={fleet.id_armada} value={fleet.id_armada}>
                      {fleet.nomor_kendaraan} - {fleet.jenis_kendaraan}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Status Awal
                </label>
                <select
                  name="status_pengiriman"
                  value={shipmentForm.status_pengiriman}
                  onChange={handleShipmentInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100">
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Estimasi Tiba
                </label>
                <input
                  type="text"
                  name="estimasi_tiba"
                  value={shipmentForm.estimasi_tiba}
                  onChange={handleShipmentInputChange}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="1-2 Hari"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Catatan
                </label>
                <textarea
                  name="catatan"
                  value={shipmentForm.catatan}
                  onChange={handleShipmentInputChange}
                  rows="2"
                  className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  placeholder="Catatan tambahan"
                />
              </div>

              <div className="mt-2 flex flex-col gap-3 border-t border-slate-200 pt-5 md:col-span-2 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-slate-600">
                  Biaya akan dihitung otomatis oleh backend jika memilih tarif
                  ongkir.
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={closeShipmentModal}
                    className="rounded-2xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70">
                    <Save size={18} />
                    {submitting
                      ? "Menyimpan..."
                      : shipmentModalType === "create"
                        ? "Simpan Pengiriman"
                        : "Update Pengiriman"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminPengirimanPage;
