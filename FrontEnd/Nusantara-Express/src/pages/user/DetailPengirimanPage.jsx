import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import {
  ArrowLeft,
  Download,
  Headphones,
  MapPin,
  Package,
  QrCode,
  Truck,
  CheckCircle2,
  Circle,
} from "lucide-react";

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(value || 0));
};

const formatDateTime = (value) => {
  if (!value) return "";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const getUserFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

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

const DetailPengirimanPage = () => {
  const { id } = useParams();

  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = getUserFromStorage();
  const idUser = user?.id_user || 4;

  const fetchDetail = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/user/pengiriman/${idUser}/${id}`);
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
    fetchDetail();
  }, [id]);

  const trackingList = shipment?.tracking || [];

  const timeline = trackingList.map((item, index) => {
    const isLast = index === trackingList.length - 1;

    return {
      status: item.status_tracking,
      label: isLast ? "Aktif" : "Selesai",
      date: formatDateTime(item.waktu_update),
      note: item.keterangan || item.status_tracking,
      active: isLast,
      done: !isLast,
      lokasi: item.lokasi,
    };
  });

  const handleDownloadBukti = () => {
    if (!shipment) return;

    const printWindow = window.open("", "_blank", "width=900,height=700");

    if (!printWindow) {
      alert("Popup diblokir browser. Izinkan popup untuk download bukti.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Bukti Pengiriman ${shipment.nomor_resi}</title>
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
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 24px;
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
              margin-top: 32px;
              font-size: 12px;
              color: #64748b;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Bukti Pengiriman</h1>
            <p>Nusantara Express Logistics</p>
          </div>

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
              <td>Pengirim</td>
              <td>${shipment.nama_pengirim}<br />${shipment.telepon_pengirim}<br />${shipment.alamat_pengirim}</td>
            </tr>
            <tr>
              <td>Penerima</td>
              <td>${shipment.nama_penerima}<br />${shipment.telepon_penerima}<br />${shipment.alamat_penerima}</td>
            </tr>
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
              <td>${Number(shipment.berat_barang || 0)} kg</td>
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

          <div class="footer">
            Bukti ini dibuat otomatis oleh sistem Nusantara Express Logistics.
          </div>

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

  const handleContactCS = () => {
    const message = encodeURIComponent(
      `Halo Customer Service Nusantara Express, saya ingin menanyakan pengiriman dengan nomor resi ${shipment?.nomor_resi || ""}.`,
    );

    window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-10">
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
      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link
          to="/user/riwayat-pengiriman"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800">
          <ArrowLeft size={20} />
          Kembali ke Riwayat
        </Link>

        <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
          <Package className="mx-auto text-red-500" size={48} />
          <h2 className="mt-5 text-2xl font-bold text-red-700">
            Detail Pengiriman Tidak Ditemukan
          </h2>
          <p className="mt-3 text-sm leading-6 text-red-600">
            {error || "Data pengiriman tidak tersedia."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <Link
        to="/user/riwayat-pengiriman"
        className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800">
        <ArrowLeft size={20} />
        Kembali ke Riwayat
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  No. Resi
                </p>
                <h1 className="mt-3 text-4xl font-bold text-slate-950">
                  {shipment.nomor_resi}
                </h1>

                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                  <Truck size={18} />
                  {shipment.status_pengiriman}
                </span>
              </div>

              <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
                <QrCode size={64} />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-700" size={26} />
                <h2 className="text-2xl font-bold text-blue-700">
                  Informasi Pengirim
                </h2>
              </div>

              <div className="mt-7 space-y-5">
                <div>
                  <p className="text-sm text-slate-500">Nama Pengirim</p>
                  <h3 className="mt-1 font-bold text-slate-950">
                    {shipment.nama_pengirim}
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Nomor Telepon</p>
                  <h3 className="mt-1 font-bold text-slate-950">
                    {shipment.telepon_pengirim}
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Alamat</p>
                  <h3 className="mt-1 leading-7 text-slate-950">
                    {shipment.alamat_pengirim}
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-700" size={26} />
                <h2 className="text-2xl font-bold text-blue-700">
                  Informasi Penerima
                </h2>
              </div>

              <div className="mt-7 space-y-5">
                <div>
                  <p className="text-sm text-slate-500">Nama Penerima</p>
                  <h3 className="mt-1 font-bold text-slate-950">
                    {shipment.nama_penerima}
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Nomor Telepon</p>
                  <h3 className="mt-1 font-bold text-slate-950">
                    {shipment.telepon_penerima}
                  </h3>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Alamat</p>
                  <h3 className="mt-1 leading-7 text-slate-950">
                    {shipment.alamat_penerima}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <Package className="text-blue-700" size={26} />
              <h2 className="text-2xl font-bold text-blue-700">
                Informasi Pengiriman
              </h2>
            </div>

            <div className="mt-6 h-px bg-slate-200" />

            <div className="mt-7 grid gap-6 md:grid-cols-4">
              <div>
                <p className="text-sm text-slate-500">Jenis Barang</p>
                <h3 className="mt-1 font-bold text-slate-950">
                  {shipment.jenis_barang}
                </h3>
              </div>

              <div>
                <p className="text-sm text-slate-500">Berat</p>
                <h3 className="mt-1 font-bold text-slate-950">
                  {Number(shipment.berat_barang || 0)} kg
                </h3>
              </div>

              <div>
                <p className="text-sm text-slate-500">Layanan</p>
                <h3 className="mt-1 font-bold text-slate-950 capitalize">
                  {shipment.layanan}
                </h3>
              </div>

              <div>
                <p className="text-sm text-slate-500">Estimasi Tiba</p>
                <h3 className="mt-1 font-bold text-blue-700">
                  {shipment.estimasi_tiba || "-"}
                </h3>
              </div>
            </div>

            <div className="my-7 h-px bg-slate-200" />

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-lg font-semibold text-slate-700">
                Biaya Pengiriman Total
              </p>
              <h3 className="text-4xl font-bold text-slate-950">
                {formatRupiah(shipment.biaya_kirim)}
              </h3>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <button
              onClick={handleDownloadBukti}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-orange-500 px-6 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600">
              <Download size={22} />
              Download Bukti Pengiriman
            </button>

            <button
              onClick={handleContactCS}
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-blue-700 px-6 py-4 font-bold text-blue-700 transition hover:bg-blue-50">
              <Headphones size={22} />
              Hubungi Customer Service
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-950">
              Status Tracking
            </h2>
            <span className="text-sm text-slate-500">Real-time</span>
          </div>

          <div className="mt-10">
            {timeline.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">
                Belum ada data tracking.
              </div>
            ) : (
              timeline.map((item, index) => (
                <div
                  key={`${item.status}-${index}`}
                  className="relative flex gap-5 pb-10">
                  {index !== timeline.length - 1 && (
                    <div className="absolute left-[17px] top-9 h-full w-px bg-slate-200" />
                  )}

                  <div
                    className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white shadow-sm ${
                      item.done
                        ? "bg-green-100 text-green-700"
                        : item.active
                          ? "bg-blue-600 text-white"
                          : "bg-slate-200 text-slate-500"
                    }`}>
                    {item.done ? (
                      <CheckCircle2 size={18} />
                    ) : item.active ? (
                      <Truck size={18} />
                    ) : (
                      <Circle size={14} />
                    )}
                  </div>

                  <div className={item.active || item.done ? "" : "opacity-45"}>
                    <h3
                      className={`font-bold ${
                        item.done
                          ? "text-green-700"
                          : item.active
                            ? "text-blue-700"
                            : "text-slate-700"
                      }`}>
                      {item.status} {item.label && `(${item.label})`}
                    </h3>

                    {item.date && (
                      <p className="mt-1 text-sm text-slate-400">{item.date}</p>
                    )}

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.note}
                    </p>

                    {item.lokasi && (
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        Lokasi: {item.lokasi}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default DetailPengirimanPage;
