import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Circle,
  Download,
  Headphones,
  MapPin,
  Package,
  QrCode,
  Route,
  Truck,
  User,
  WalletCards,
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

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(value || 0));
};

const formatDateTime = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const AdminDetailPengirimanPage = () => {
  const { id } = useParams();

  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchShipmentDetail = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/pengiriman/${id}`);
      setShipment(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengambil detail pengiriman.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipmentDetail();
  }, [id]);

  if (loading) {
    return (
      <section>
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="font-semibold text-slate-500">
            Mengambil detail pengiriman...
          </p>
        </div>
      </section>
    );
  }

  if (error || !shipment) {
    return (
      <section>
        <Link
          to="/admin/pengiriman"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800">
          <ArrowLeft size={18} />
          Kembali ke Pengiriman
        </Link>

        <div className="mt-6 rounded-3xl bg-red-50 p-8 text-red-600">
          <p className="font-bold">
            {error || "Data pengiriman tidak ditemukan."}
          </p>
        </div>
      </section>
    );
  }

  const trackingList = shipment.tracking || [];

  const normalizePhoneNumber = (phone = "") => {
    let number = phone.replace(/\D/g, "");

    if (number.startsWith("0")) {
      number = "62" + number.slice(1);
    }

    if (!number.startsWith("62")) {
      number = "62" + number;
    }

    return number;
  };

  const openPrintWindow = (title, content) => {
    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      alert("Popup diblokir browser. Izinkan popup untuk mencetak dokumen.");
      return;
    }

    printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 32px;
            color: #0f172a;
          }
          .header {
            border-bottom: 2px solid #1d4ed8;
            padding-bottom: 16px;
            margin-bottom: 24px;
          }
          h1 {
            margin: 0;
            color: #1d4ed8;
          }
          .section {
            margin-bottom: 24px;
          }
          .section h2 {
            font-size: 18px;
            margin-bottom: 12px;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          td, th {
            border: 1px solid #e2e8f0;
            padding: 10px;
            text-align: left;
            vertical-align: top;
          }
          .total {
            font-size: 20px;
            font-weight: bold;
            color: #1d4ed8;
          }
          .footer {
            margin-top: 40px;
            font-size: 12px;
            color: #64748b;
          }
          @media print {
            button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
  };

  const handlePrintInvoice = () => {
    const content = `
    <div class="header">
      <h1>Invoice Pengiriman</h1>
      <p>Nusantara Express Logistics</p>
    </div>

    <div class="section">
      <h2>Informasi Resi</h2>
      <table>
        <tr>
          <td>Nomor Resi</td>
          <td><strong>${shipment.nomor_resi}</strong></td>
        </tr>
        <tr>
          <td>Status</td>
          <td>${shipment.status_pengiriman}</td>
        </tr>
        <tr>
          <td>Tanggal Pengiriman</td>
          <td>${formatDateTime(shipment.tanggal_pengiriman)}</td>
        </tr>
      </table>
    </div>

    <div class="section">
      <h2>Pengirim & Penerima</h2>
      <table>
        <tr>
          <th>Pengirim</th>
          <th>Penerima</th>
        </tr>
        <tr>
          <td>
            <strong>${shipment.nama_pengirim}</strong><br />
            ${shipment.telepon_pengirim}<br />
            ${shipment.alamat_pengirim}
          </td>
          <td>
            <strong>${shipment.nama_penerima}</strong><br />
            ${shipment.telepon_penerima}<br />
            ${shipment.alamat_penerima}
          </td>
        </tr>
      </table>
    </div>

    <div class="section">
      <h2>Detail Barang</h2>
      <table>
        <tr>
          <td>Rute</td>
          <td>${shipment.kota_asal} → ${shipment.kota_tujuan}</td>
        </tr>
        <tr>
          <td>Jenis Barang</td>
          <td>${shipment.jenis_barang}</td>
        </tr>
        <tr>
          <td>Berat</td>
          <td>${Number(shipment.berat_barang)} Kg</td>
        </tr>
        <tr>
          <td>Layanan</td>
          <td>${shipment.layanan}</td>
        </tr>
        <tr>
          <td>Total Biaya</td>
          <td class="total">${formatRupiah(shipment.biaya_kirim)}</td>
        </tr>
      </table>
    </div>

    <div class="footer">
      Invoice ini dibuat otomatis oleh sistem Nusantara Express Logistics.
    </div>
  `;

    openPrintWindow(`Invoice ${shipment.nomor_resi}`, content);
  };

  const handleExportDetail = () => {
    const trackingRows = trackingList
      .map(
        (item) => `
        <tr>
          <td>${item.status_tracking}</td>
          <td>${item.lokasi}</td>
          <td>${formatDateTime(item.waktu_update)}</td>
          <td>${item.keterangan || "-"}</td>
        </tr>
      `,
      )
      .join("");

    const content = `
    <div class="header">
      <h1>Detail Pengiriman</h1>
      <p>Nusantara Express Logistics</p>
    </div>

    <div class="section">
      <h2>Informasi Utama</h2>
      <table>
        <tr><td>Nomor Resi</td><td><strong>${shipment.nomor_resi}</strong></td></tr>
        <tr><td>Status</td><td>${shipment.status_pengiriman}</td></tr>
        <tr><td>Rute</td><td>${shipment.kota_asal} → ${shipment.kota_tujuan}</td></tr>
        <tr><td>Estimasi Tiba</td><td>${shipment.estimasi_tiba || "-"}</td></tr>
        <tr><td>Kurir</td><td>${shipment.nama_kurir || "-"} / ${shipment.telepon_kurir || "-"}</td></tr>
        <tr><td>Armada</td><td>${shipment.nomor_kendaraan || "-"} / ${shipment.jenis_kendaraan || "-"}</td></tr>
      </table>
    </div>

    <div class="section">
      <h2>Tracking Timeline</h2>
      <table>
        <tr>
          <th>Status</th>
          <th>Lokasi</th>
          <th>Waktu</th>
          <th>Keterangan</th>
        </tr>
        ${trackingRows || `<tr><td colspan="4">Belum ada tracking.</td></tr>`}
      </table>
    </div>

    <div class="footer">
      Detail ini dibuat otomatis oleh sistem Nusantara Express Logistics.
    </div>
  `;

    openPrintWindow(`Detail ${shipment.nomor_resi}`, content);
  };

  const handleContactCourier = () => {
    if (!shipment.telepon_kurir) {
      alert("Nomor telepon kurir belum tersedia.");
      return;
    }

    const phone = normalizePhoneNumber(shipment.telepon_kurir);
    const message = encodeURIComponent(
      `Halo ${shipment.nama_kurir || "Kurir"}, saya ingin menanyakan status pengiriman dengan nomor resi ${shipment.nomor_resi}.`,
    );

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <section>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <Link
            to="/admin/pengiriman"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800">
            <ArrowLeft size={18} />
            Kembali ke Pengiriman
          </Link>

          <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950">
            Detail Pengiriman
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Detail lengkap pengiriman, tracking, armada, dan informasi penerima.
          </p>
        </div>

        <button
          onClick={handleExportDetail}
          className="inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50">
          <Download size={20} />
          Export Detail
        </button>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_420px]">
        <div className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
                  Nomor Resi
                </p>

                <h2 className="mt-3 text-4xl font-extrabold text-blue-700">
                  {shipment.nomor_resi}
                </h2>

                <div className="mt-5 flex flex-wrap gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
                      statusStyles[shipment.status_pengiriman] ||
                      "bg-slate-100 text-slate-700"
                    }`}>
                    <Truck size={18} />
                    {shipment.status_pengiriman}
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                    <CheckCircle2 size={18} />
                    Biaya {formatRupiah(shipment.biaya_kirim)}
                  </span>
                </div>
              </div>

              <div className="flex h-32 w-32 items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 text-slate-700">
                <QrCode size={76} />
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <MapPin size={24} />
              </div>

              <p className="mt-5 text-sm font-semibold text-slate-500">
                Kota Asal
              </p>
              <h3 className="mt-2 text-2xl font-extrabold text-slate-950">
                {shipment.kota_asal}
              </h3>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                <Route size={24} />
              </div>

              <p className="mt-5 text-sm font-semibold text-slate-500">
                Kota Tujuan
              </p>
              <h3 className="mt-2 text-2xl font-extrabold text-slate-950">
                {shipment.kota_tujuan}
              </h3>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                <CalendarClock size={24} />
              </div>

              <p className="mt-5 text-sm font-semibold text-slate-500">
                Estimasi Tiba
              </p>
              <h3 className="mt-2 text-2xl font-extrabold text-slate-950">
                {shipment.estimasi_tiba || "-"}
              </h3>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <User size={24} />
                </div>
                <h2 className="text-xl font-extrabold text-slate-950">
                  Informasi Pengirim
                </h2>
              </div>

              <div className="mt-7 space-y-5">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Nama Pengirim
                  </p>
                  <p className="mt-1 font-bold text-slate-950">
                    {shipment.nama_pengirim}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Nomor Telepon
                  </p>
                  <p className="mt-1 font-bold text-slate-950">
                    {shipment.telepon_pengirim}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">Alamat</p>
                  <p className="mt-1 leading-7 text-slate-700">
                    {shipment.alamat_pengirim}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <User size={24} />
                </div>
                <h2 className="text-xl font-extrabold text-slate-950">
                  Informasi Penerima
                </h2>
              </div>

              <div className="mt-7 space-y-5">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Nama Penerima
                  </p>
                  <p className="mt-1 font-bold text-slate-950">
                    {shipment.nama_penerima}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Nomor Telepon
                  </p>
                  <p className="mt-1 font-bold text-slate-950">
                    {shipment.telepon_penerima}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">Alamat</p>
                  <p className="mt-1 leading-7 text-slate-700">
                    {shipment.alamat_penerima}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Package size={24} />
              </div>
              <h2 className="text-xl font-extrabold text-slate-950">
                Informasi Barang & Biaya
              </h2>
            </div>

            <div className="mt-7 grid gap-6 md:grid-cols-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Jenis Barang
                </p>
                <p className="mt-1 font-bold text-slate-950">
                  {shipment.jenis_barang}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Berat Barang
                </p>
                <p className="mt-1 font-bold text-slate-950">
                  {Number(shipment.berat_barang)} Kg
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500">Layanan</p>
                <p className="mt-1 font-bold capitalize text-slate-950">
                  {shipment.layanan}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Biaya Kirim
                </p>
                <p className="mt-1 font-bold text-blue-700">
                  {formatRupiah(shipment.biaya_kirim)}
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <Truck size={22} className="text-blue-700" />
                  <p className="font-bold text-slate-950">Armada</p>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {shipment.nomor_kendaraan || "-"} ·{" "}
                  {shipment.jenis_kendaraan || "-"} · Kapasitas{" "}
                  {shipment.kapasitas || "-"}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <User size={22} className="text-blue-700" />
                  <p className="font-bold text-slate-950">Kurir</p>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {shipment.nama_kurir || "-"} · {shipment.telepon_kurir || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <button
              onClick={handlePrintInvoice}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-700 px-6 py-4 font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800">
              <WalletCards size={22} />
              Cetak Invoice
            </button>

            <button
              onClick={handleContactCourier}
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-6 py-4 font-bold text-slate-700 shadow-sm transition hover:bg-slate-50">
              <Headphones size={22} />
              Hubungi Kurir
            </button>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-extrabold text-slate-950">
              Tracking Timeline
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Riwayat status pengiriman terbaru dari database.
            </p>

            <div className="mt-8">
              {trackingList.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">
                  Belum ada data tracking.
                </div>
              ) : (
                trackingList.map((item, index) => (
                  <div
                    key={item.id_tracking}
                    className="relative flex gap-5 pb-10 last:pb-0">
                    {index !== trackingList.length - 1 && (
                      <div className="absolute left-[17px] top-9 h-full w-px bg-slate-200" />
                    )}

                    <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-blue-700 text-white shadow-sm">
                      {index === trackingList.length - 1 ? (
                        <Circle size={15} />
                      ) : (
                        <CheckCircle2 size={18} />
                      )}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-950">
                        {item.status_tracking}
                      </h3>

                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {item.lokasi}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatDateTime(item.waktu_update)}
                      </p>

                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {item.keterangan || "-"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm">
            <h2 className="text-xl font-bold">Catatan Pengiriman</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {shipment.catatan ||
                "Tidak ada catatan tambahan untuk pengiriman ini."}
            </p>

            <button
              onClick={fetchShipmentDetail}
              className="mt-6 w-full rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:bg-slate-100">
              Refresh Detail
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default AdminDetailPengirimanPage;
