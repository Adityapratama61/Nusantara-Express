import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import trackingIllustration from "../assets/images/tracking-illustration.png";
import {
  CalendarClock,
  MapPin,
  Package,
  Search,
  Truck,
  User,
} from "lucide-react";

const formatDate = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
};

const formatTime = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const mapTrackingData = (data) => {
  const riwayat = [...(data.tracking || [])].reverse().map((item) => ({
    status: item.status_tracking,
    title: item.keterangan || item.status_tracking,
    lokasi: item.lokasi || "-",
    tanggal: formatDate(item.waktu_update),
    waktu: `${formatTime(item.waktu_update)} WIB`,
  }));

  return {
    nomorResi: data.nomor_resi,
    status: data.status_pengiriman,
    pengirim: {
      nama: data.nama_pengirim,
      kota: data.kota_asal,
    },
    penerima: {
      nama: data.nama_penerima,
      kota: data.kota_tujuan,
    },
    layanan: data.layanan,
    berat: `${Number(data.berat_barang || 0)}kg`,
    estimasi: data.estimasi_tiba || "Estimasi belum tersedia",
    riwayat,
  };
};

const TrackingPage = () => {
  const [resi, setResi] = useState("NX-20260812-001");
  const [trackingResult, setTrackingResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTracking = async (targetResi = resi) => {
    const nomorResi = targetResi.trim();

    if (!nomorResi) {
      setTrackingResult(null);
      setNotFound(true);
      return;
    }

    setLoading(true);
    setNotFound(false);

    try {
      const response = await api.get(
        `/tracking/${encodeURIComponent(nomorResi)}`,
      );

      setTrackingResult(mapTrackingData(response.data.data));
      setNotFound(false);
    } catch (err) {
      setTrackingResult(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleTracking("NX-20260812-001");
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="border-b border-slate-200 bg-slate-50 px-6 py-16">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="text-4xl font-bold text-slate-950 md:text-5xl">
              Tracking Resi
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Pantau status pengiriman paket Anda secara real-time dengan
              memasukkan nomor resi di bawah ini.
            </p>

            <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row">
              <div className="flex flex-1 items-center gap-3 px-4">
                <Search size={24} className="text-slate-400" />
                <input
                  type="text"
                  value={resi}
                  onChange={(e) => setResi(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleTracking();
                    }
                  }}
                  placeholder="Masukkan nomor resi"
                  className="w-full bg-transparent py-3 text-base text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              <button
                onClick={() => handleTracking()}
                disabled={loading}
                className="rounded-2xl bg-blue-700 px-8 py-4 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70">
                {loading ? "Mencari..." : "Lacak Pengiriman"}
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          {notFound && (
            <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
              <Package className="mx-auto text-red-500" size={48} />
              <h2 className="mt-5 text-2xl font-bold text-red-700">
                Nomor Resi Tidak Ditemukan
              </h2>
              <p className="mt-3 text-sm leading-6 text-red-600">
                Pastikan nomor resi yang Anda masukkan sudah benar. Coba gunakan
                nomor resi yang tersedia di database, misalnya:
                <span className="font-bold"> NX-20260812-001</span>
              </p>
            </div>
          )}

          {trackingResult && (
            <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Nomor Resi
                      </p>
                      <h2 className="mt-2 text-3xl font-bold text-blue-700">
                        {trackingResult.nomorResi}
                      </h2>
                    </div>

                    <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700">
                      {trackingResult.status}
                    </span>
                  </div>

                  <div className="mt-8 space-y-6">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-blue-700">
                        <User size={22} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Pengirim</p>
                        <h3 className="font-bold text-slate-950">
                          {trackingResult.pengirim.nama}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {trackingResult.pengirim.kota}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-blue-700">
                        <MapPin size={22} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Penerima</p>
                        <h3 className="font-bold text-slate-950">
                          {trackingResult.penerima.nama}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {trackingResult.penerima.kota}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="my-8 h-px bg-slate-200" />

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <p className="text-sm text-slate-500">Layanan</p>
                      <h3 className="mt-1 text-lg font-bold text-slate-950 capitalize">
                        {trackingResult.layanan}
                      </h3>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Berat</p>
                      <h3 className="mt-1 text-lg font-bold text-slate-950">
                        {trackingResult.berat}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                  <div className="flex h-40 items-center justify-center rounded-3xl bg-slate-100">
                    <img
                      src={trackingIllustration}
                      alt="Tracking Pengiriman"
                      className="h-48 w-full rounded-3xl object-cover"
                    />
                  </div>

                  <div className="mt-6 flex items-start gap-3">
                    <span className="mt-2 h-3 w-3 rounded-full bg-blue-700" />
                    <p className="font-semibold text-slate-950">
                      {trackingResult.estimasi}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <CalendarClock size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-950">
                    Riwayat Pengiriman
                  </h2>
                </div>

                <div className="mt-10 space-y-0">
                  {trackingResult.riwayat.length === 0 ? (
                    <div className="rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">
                      Belum ada riwayat pengiriman.
                    </div>
                  ) : (
                    trackingResult.riwayat.map((item, index) => (
                      <div key={index} className="relative flex gap-8 pb-10">
                        {index !== trackingResult.riwayat.length - 1 && (
                          <div className="absolute left-[11px] top-7 h-full w-px bg-slate-200" />
                        )}

                        <div className="relative z-10 mt-1 h-6 w-6 rounded-full border-4 border-white bg-blue-700 shadow" />

                        <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                              {item.status}
                            </span>
                            <h3 className="mt-3 text-lg font-bold text-slate-950">
                              {item.title}
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-slate-500">
                              {item.lokasi}
                            </p>
                          </div>

                          <div className="text-left md:text-right">
                            <p className="font-semibold text-slate-950">
                              {item.tanggal}
                            </p>
                            <p className="text-sm text-slate-500">
                              {item.waktu}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TrackingPage;
