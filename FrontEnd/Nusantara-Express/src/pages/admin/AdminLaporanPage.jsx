import { useEffect, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  CalendarDays,
  Download,
  FileSpreadsheet,
  FileText,
  MapPin,
  Package,
  RefreshCcw,
  Search,
  TrendingUp,
  Truck,
  UserRound,
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

const AdminLaporanPage = () => {
  const [report, setReport] = useState(null);
  const [jenis, setJenis] = useState("bulanan");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/laporan", {
        params: {
          jenis,
          tanggal_mulai: tanggalMulai || undefined,
          tanggal_akhir: tanggalAkhir || undefined,
        },
      });

      setReport(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data laporan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const summary = report?.summary || {};
  const grafik = report?.grafik || [];
  const pengirimanPerKota = report?.pengiriman_per_kota || [];
  const pengirimanPerKurir = report?.pengiriman_per_kurir || [];
  const detail = report?.detail || [];

  const maxGrafik =
    grafik.length > 0
      ? Math.max(...grafik.map((item) => Number(item.total_pengiriman || 0)))
      : 1;

  const maxKota =
    pengirimanPerKota.length > 0
      ? Math.max(
          ...pengirimanPerKota.map((item) =>
            Number(item.total_pengiriman || 0),
          ),
        )
      : 1;

  const handleGenerate = (e) => {
    e.preventDefault();
    fetchReport();
  };

  const handleExportExcel = () => {
    if (detail.length === 0) {
      alert("Tidak ada data untuk diexport.");
      return;
    }

    const headers = [
      "Nomor Resi",
      "Pengirim",
      "Penerima",
      "Kota Asal",
      "Kota Tujuan",
      "Berat Barang",
      "Biaya Kirim",
      "Status",
      "Tanggal Pengiriman",
      "Kurir",
      "Armada",
    ];

    const rows = detail.map((item) => [
      item.nomor_resi,
      item.nama_pengirim,
      item.nama_penerima,
      item.kota_asal,
      item.kota_tujuan,
      item.berat_barang,
      item.biaya_kirim,
      item.status_pengiriman,
      item.tanggal_pengiriman,
      item.nama_kurir || "-",
      item.nomor_kendaraan || "-",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((field) => `"${String(field ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "laporan_pengiriman.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank", "width=1000,height=700");

    if (!printWindow) {
      alert("Popup diblokir browser. Izinkan popup untuk export PDF.");
      return;
    }

    const rows = detail
      .map(
        (item) => `
          <tr>
            <td>${item.nomor_resi}</td>
            <td>${item.nama_pengirim}</td>
            <td>${item.nama_penerima}</td>
            <td>${item.kota_asal} → ${item.kota_tujuan}</td>
            <td>${Number(item.berat_barang || 0)} Kg</td>
            <td>${formatRupiah(item.biaya_kirim)}</td>
            <td>${item.status_pengiriman}</td>
            <td>${formatDate(item.tanggal_pengiriman)}</td>
          </tr>
        `,
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Laporan Pengiriman</title>
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
            .summary {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 12px;
              margin-bottom: 24px;
            }
            .card {
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 16px;
            }
            .card p {
              margin: 0;
              color: #64748b;
              font-size: 12px;
            }
            .card h2 {
              margin: 8px 0 0;
              font-size: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
            }
            th, td {
              border: 1px solid #e2e8f0;
              padding: 8px;
              text-align: left;
              vertical-align: top;
            }
            th {
              background: #f1f5f9;
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
            <h1>Laporan Pengiriman</h1>
            <p>Nusantara Express Logistics</p>
            <p>Jenis laporan: ${jenis}</p>
          </div>

          <div class="summary">
            <div class="card">
              <p>Total Pengiriman</p>
              <h2>${summary.total_pengiriman || 0}</h2>
            </div>
            <div class="card">
              <p>Total Pendapatan</p>
              <h2>${formatRupiah(summary.total_pendapatan)}</h2>
            </div>
            <div class="card">
              <p>Total Kota</p>
              <h2>${summary.total_kota || 0}</h2>
            </div>
            <div class="card">
              <p>Total Kurir</p>
              <h2>${summary.total_kurir || 0}</h2>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Nomor Resi</th>
                <th>Pengirim</th>
                <th>Penerima</th>
                <th>Rute</th>
                <th>Berat</th>
                <th>Biaya</th>
                <th>Status</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              ${rows || `<tr><td colspan="8">Tidak ada data laporan.</td></tr>`}
            </tbody>
          </table>

          <div class="footer">
            Laporan ini dibuat otomatis oleh sistem Nusantara Express Logistics.
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

  if (loading) {
    return (
      <section>
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="font-semibold text-slate-500">
            Mengambil data laporan...
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
            Laporan Pengiriman
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Analisis pengiriman, pendapatan, pengiriman per kota, dan performa
            kurir dari database.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50">
            <FileText size={20} />
            Export PDF
          </button>

          <button
            onClick={handleExportExcel}
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-green-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700">
            <FileSpreadsheet size={20} />
            Export Excel
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <form
          onSubmit={handleGenerate}
          className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto_auto] lg:items-end">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Jenis Laporan
            </label>
            <select
              value={jenis}
              onChange={(e) => setJenis(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-sm font-semibold text-slate-700 outline-none">
              <option value="harian">Harian</option>
              <option value="bulanan">Bulanan</option>
              <option value="tahunan">Tahunan</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Tanggal Mulai
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5">
              <input
                type="date"
                value={tanggalMulai}
                onChange={(e) => setTanggalMulai(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold outline-none"
              />
              <CalendarDays size={20} className="text-slate-500" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Tanggal Akhir
            </label>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5">
              <input
                type="date"
                value={tanggalAkhir}
                onChange={(e) => setTanggalAkhir(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold outline-none"
              />
              <CalendarDays size={20} className="text-slate-500" />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-700 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800">
            <Search size={20} />
            Generate
          </button>

          <button
            type="button"
            onClick={fetchReport}
            className="inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
            <RefreshCcw size={20} />
            Refresh
          </button>
        </form>
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
            {summary.total_pengiriman || 0}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <WalletCards size={25} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Total Pendapatan
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {formatRupiah(summary.total_pendapatan)}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
            <MapPin size={25} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Pengiriman per Kota
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">
            {summary.total_kota || 0}
          </h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <UserRound size={25} />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-500">
            Pengiriman per Kurir
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
                Grafik Laporan
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Tren pengiriman berdasarkan jenis laporan yang dipilih.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
              <TrendingUp size={18} />
              {jenis}
            </div>
          </div>

          <div className="mt-8 flex h-80 items-end gap-4 rounded-3xl bg-slate-50 p-6">
            {grafik.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
                Belum ada data grafik.
              </div>
            ) : (
              grafik.map((item) => {
                const height =
                  maxGrafik > 0
                    ? (Number(item.total_pengiriman || 0) / maxGrafik) * 100
                    : 0;

                return (
                  <div
                    key={item.periode}
                    className="flex flex-1 flex-col items-center">
                    <div
                      className="w-full rounded-t-xl bg-blue-700"
                      style={{ height: `${Math.max(height, 8)}%` }}
                      title={`${item.total_pengiriman} pengiriman`}
                    />
                    <span className="mt-3 text-xs font-bold text-slate-500">
                      {item.periode}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">
            Pengiriman per Kota
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Kota tujuan dengan volume pengiriman tertinggi.
          </p>

          <div className="mt-7 space-y-6">
            {pengirimanPerKota.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">
                Belum ada data kota.
              </div>
            ) : (
              pengirimanPerKota.slice(0, 5).map((item) => {
                const width =
                  maxKota > 0
                    ? (Number(item.total_pengiriman || 0) / maxKota) * 100
                    : 0;

                return (
                  <div key={item.kota}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-bold text-slate-700">
                        {item.kota || "-"}
                      </span>
                      <span className="font-bold text-slate-950">
                        {item.total_pengiriman}
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100">
                      <div
                        className="h-3 rounded-full bg-blue-700"
                        style={{ width: `${Math.max(width, 8)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[420px_1fr]">
        <div className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-orange-400" size={30} />
            <h2 className="text-2xl font-bold">Revenue Summary</h2>
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-300">
            Ringkasan pendapatan berdasarkan data pengiriman yang sedang
            difilter.
          </p>

          <div className="mt-8 rounded-3xl bg-white/10 p-5">
            <p className="text-sm text-slate-300">Total Pendapatan</p>
            <h3 className="mt-2 text-3xl font-extrabold">
              {formatRupiah(summary.total_pendapatan)}
            </h3>
          </div>

          <div className="mt-5 rounded-3xl bg-white/10 p-5">
            <p className="text-sm text-slate-300">Total Pengiriman</p>
            <h3 className="mt-2 text-3xl font-extrabold">
              {summary.total_pengiriman || 0}
            </h3>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">
            Pengiriman per Kurir
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Performa pengiriman berdasarkan kurir.
          </p>

          <div className="mt-6 space-y-4">
            {pengirimanPerKurir.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">
                Belum ada data kurir.
              </div>
            ) : (
              pengirimanPerKurir.slice(0, 5).map((item, index) => {
                const total = Number(item.total_pengiriman || 0);
                const selesai = Number(item.total_selesai || 0);
                const successRate =
                  total > 0 ? Math.round((selesai / total) * 100) : 0;

                return (
                  <div
                    key={`${item.nama_kurir}-${index}`}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-sm font-extrabold text-blue-700">
                        #{index + 1}
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-950">
                          {item.nama_kurir || "Belum Ditugaskan"}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Success rate {successRate}%
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <h3 className="font-extrabold text-slate-950">{total}</h3>
                      <p className="text-xs text-slate-500">pengiriman</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 px-7 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Detail Laporan
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Data detail pengiriman berdasarkan filter laporan.
            </p>
          </div>

          <button
            onClick={fetchReport}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
            <Truck size={18} />
            Refresh Detail
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4 font-bold">Nomor Resi</th>
                <th className="px-6 py-4 font-bold">Pengirim</th>
                <th className="px-6 py-4 font-bold">Penerima</th>
                <th className="px-6 py-4 font-bold">Rute</th>
                <th className="px-6 py-4 font-bold">Berat</th>
                <th className="px-6 py-4 font-bold">Biaya</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Tanggal</th>
              </tr>
            </thead>

            <tbody>
              {detail.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-10 text-center font-semibold text-slate-500">
                    Tidak ada data laporan.
                  </td>
                </tr>
              ) : (
                detail.map((item) => (
                  <tr
                    key={item.id_pengiriman}
                    className="border-t border-slate-100 transition hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-blue-700">
                      {item.nomor_resi}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {item.nama_pengirim}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {item.nama_penerima}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {item.kota_asal} → {item.kota_tujuan}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {Number(item.berat_barang || 0)} Kg
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-950">
                      {formatRupiah(item.biaya_kirim)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        {item.status_pengiriman}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(item.tanggal_pengiriman)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminLaporanPage;
