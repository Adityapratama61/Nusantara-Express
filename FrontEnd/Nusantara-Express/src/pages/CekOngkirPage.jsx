import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import ongkirIllustration from "../assets/images/ongkir-illustration.png";
import {
  BadgeInfo,
  Clock,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";

const services = [
  {
    id: 1,
    name: "Express",
    desc: "Layanan kilat prioritas tinggi",
    icon: Zap,
    tarif: 45000,
    estimasi: "1 Hari",
    highlight: true,
  },
  {
    id: 2,
    name: "Reguler",
    desc: "Pengiriman standar aman & terpercaya",
    icon: Truck,
    tarif: 28000,
    estimasi: "2–3 Hari",
    highlight: false,
  },
  {
    id: 3,
    name: "Cargo",
    desc: "Hemat untuk berat di atas 10kg",
    icon: Package,
    tarif: 12000,
    estimasi: "5–7 Hari",
    highlight: false,
  },
];

const serviceMeta = {
  express: {
    name: "Express",
    desc: "Layanan kilat prioritas tinggi",
    icon: Zap,
    highlight: true,
  },
  reguler: {
    name: "Reguler",
    desc: "Pengiriman standar aman & terpercaya",
    icon: Truck,
    highlight: false,
  },
  cargo: {
    name: "Cargo",
    desc: "Hemat untuk berat di atas 10kg",
    icon: Package,
    highlight: false,
  },
};

const CekOngkirPage = () => {
  const [formData, setFormData] = useState({
    asal: "Jakarta",
    tujuan: "Medan",
    berat: 1,
  });

  const [result, setResult] = useState(services);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCalculate = async () => {
    const berat = Number(formData.berat) || 1;

    if (!formData.asal || !formData.tujuan || !berat) {
      setError("Kota asal, kota tujuan, dan berat barang wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.get("/cek-ongkir", {
        params: {
          kota_asal: formData.asal,
          kota_tujuan: formData.tujuan,
          berat,
        },
      });

      const apiResults = response.data.data || [];

      const calculated = apiResults.map((item) => {
        const layanan = item.layanan || "reguler";
        const meta = serviceMeta[layanan] || serviceMeta.reguler;

        return {
          id: item.id_tarif,
          name: meta.name,
          desc: meta.desc,
          icon: meta.icon,
          tarif: Number(item.tarif_per_kg || 0),
          estimasi: item.estimasi,
          total: Number(item.total_biaya || 0),
          highlight: meta.highlight,
        };
      });

      setResult(calculated);
    } catch (err) {
      setResult([]);
      setError(err.response?.data?.message || "Tarif ongkir tidak ditemukan.");
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID").format(Number(number || 0));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="border-b border-slate-200 bg-slate-50 px-6 py-14">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-4xl font-bold text-slate-950 md:text-5xl">
              Cek Ongkir
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Hitung estimasi biaya pengiriman paket Anda ke seluruh Indonesia
              secara akurat.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[420px_1fr]">
          <div className="h-fit rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="space-y-6">
              <div>
                <label className="mb-3 block text-sm font-bold text-slate-900">
                  Kota Asal
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-4 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
                  <MapPin size={22} className="text-slate-500" />
                  <select
                    name="asal"
                    value={formData.asal}
                    onChange={handleChange}
                    className="w-full bg-transparent text-slate-900 outline-none">
                    <option value="Jakarta">Jakarta</option>
                    <option value="Bandung">Bandung</option>
                    <option value="Surabaya">Surabaya</option>
                    <option value="Semarang">Semarang</option>
                    <option value="Medan">Medan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold text-slate-900">
                  Kota Tujuan
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-4 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
                  <MapPin size={22} className="text-slate-500" />
                  <select
                    name="tujuan"
                    value={formData.tujuan}
                    onChange={handleChange}
                    className="w-full bg-transparent text-slate-900 outline-none">
                    <option value="Medan">Medan</option>
                    <option value="Jakarta">Jakarta</option>
                    <option value="Bandung">Bandung</option>
                    <option value="Surabaya">Surabaya</option>
                    <option value="Semarang">Semarang</option>
                    <option value="Padang">Padang</option>
                    <option value="Makassar">Makassar</option>
                    <option value="Denpasar">Denpasar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold text-slate-900">
                  Berat Barang (kg)
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-4 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
                  <Package size={22} className="text-slate-500" />
                  <input
                    type="number"
                    name="berat"
                    min="1"
                    value={formData.berat}
                    onChange={handleChange}
                    className="w-full bg-transparent text-slate-900 outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleCalculate}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-6 py-4 text-base font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
                <Package size={20} />
                {loading ? "Menghitung..." : "Hitung Ongkir"}
              </button>

              {error && (
                <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold leading-6 text-red-600">
                  {error}
                </div>
              )}

              <div className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                <BadgeInfo size={22} className="shrink-0 text-blue-700" />
                <p>
                  Estimasi biaya dapat berubah sesuai kebijakan operasional dan
                  dimensi paket yang sebenarnya.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {result.length === 0 && !loading ? (
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
                <h3 className="text-xl font-bold text-slate-950">
                  Tarif Tidak Ditemukan
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  Silakan pilih rute lain yang tersedia di database tarif
                  ongkir.
                </p>
              </div>
            ) : (
              result.map((service) => {
                const Icon = service.icon;
                const total =
                  service.total || service.tarif * Number(formData.berat || 1);

                return (
                  <div
                    key={service.id}
                    className={`relative rounded-[2rem] border bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                      service.highlight
                        ? "border-blue-700 ring-1 ring-blue-700"
                        : "border-slate-200"
                    }`}>
                    {service.highlight && (
                      <span className="absolute right-6 top-0 -translate-y-1/2 rounded-full bg-blue-700 px-4 py-1.5 text-xs font-bold text-white">
                        Paling Cepat
                      </span>
                    )}

                    <div className="grid gap-6 md:grid-cols-[1fr_140px_140px_160px] md:items-center">
                      <div className="flex items-center gap-5">
                        <div
                          className={`flex h-16 w-16 items-center justify-center rounded-full ${
                            service.highlight
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                          }`}>
                          <Icon size={30} />
                        </div>

                        <div>
                          <h3 className="text-2xl font-bold text-slate-950">
                            {service.name}
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            {service.desc}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase text-slate-500">
                          Tarif / Kg
                        </p>
                        <h4 className="mt-1 text-xl font-bold text-slate-950">
                          Rp {formatRupiah(service.tarif)}
                        </h4>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase text-slate-500">
                          Estimasi
                        </p>
                        <h4 className="mt-1 text-xl font-bold text-slate-950">
                          {service.estimasi}
                        </h4>
                      </div>

                      <div
                        className={`rounded-3xl p-5 text-center ${
                          service.highlight
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-950"
                        }`}>
                        <p className="text-xs font-bold uppercase">
                          Total Biaya
                        </p>
                        <h4 className="mt-2 text-2xl font-extrabold">
                          Rp {formatRupiah(total)}
                        </h4>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="relative min-h-[190px] bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 p-8 text-white">
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute right-10 top-6 h-32 w-32 rounded-full bg-blue-500 blur-3xl" />
                  <div className="absolute bottom-5 left-10 h-24 w-24 rounded-full bg-orange-500 blur-3xl" />
                </div>

                <div className="relative">
                  <img
                    src={ongkirIllustration}
                    alt="Cek Ongkir Nusantara Express"
                    className="w-full rounded-[2rem] object-cover"
                  />
                  <h3 className="mt-5 text-2xl font-bold">Keamanan Terjamin</h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                    Setiap paket ditangani dengan SOP ketat untuk memastikan
                    barang sampai tanpa cacat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-center text-3xl font-bold text-slate-950">
            Kenapa Memilih Nusantara Express?
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <ShieldCheck size={30} />
              </div>
              <h3 className="mt-5 font-bold text-slate-950">Terpercaya</h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500">
                Telah melayani jutaan pengiriman dengan tingkat keberhasilan
                tinggi.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Clock size={30} />
              </div>
              <h3 className="mt-5 font-bold text-slate-950">
                Real-Time Tracking
              </h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500">
                Pantau posisi paket Anda kapan saja melalui dashboard kami.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Truck size={30} />
              </div>
              <h3 className="mt-5 font-bold text-slate-950">Layanan 24/7</h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500">
                Tim customer service kami siap membantu kendala pengiriman.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CekOngkirPage;
