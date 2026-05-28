import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Search,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1E40AF,transparent_35%),radial-gradient(circle_at_bottom_left,#F97316,transparent_25%)] opacity-40" />

          <div className="relative mx-auto grid min-h-[650px] max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-200">
                <Truck size={16} />
                Pengiriman cepat dan terpantau
              </span>

              <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight md:text-6xl">
                Kirim Barang Lebih Mudah, Cepat, dan Terpantau
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
                Kelola pengiriman antar kota dan antar provinsi dengan sistem
                tracking yang aman, transparan, dan real-time.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/tracking"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600">
                  Lacak Resi
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/cek-ongkir"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
                  Cek Ongkir
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-400" />
                  Real-time tracking
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-400" />
                  Armada terpercaya
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-400" />
                  Ongkir transparan
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur">
                <div className="rounded-[1.5rem] bg-white p-6 text-slate-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Tracking Paket</p>
                      <h3 className="text-xl font-bold">NX-2026-00125</h3>
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Dalam Perjalanan
                    </span>
                  </div>

                  <div className="mt-8 space-y-5">
                    <div className="flex gap-4">
                      <div className="rounded-full bg-blue-100 p-3 text-blue-700">
                        <Package size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold">Paket diproses</h4>
                        <p className="text-sm text-slate-500">
                          Jakarta Barat, 08:30 WIB
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="rounded-full bg-orange-100 p-3 text-orange-600">
                        <Truck size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold">Dalam perjalanan</h4>
                        <p className="text-sm text-slate-500">
                          Menuju Bandung, 11:45 WIB
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="rounded-full bg-slate-100 p-3 text-slate-600">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold">Estimasi tiba</h4>
                        <p className="text-sm text-slate-500">
                          Hari ini, 17:00 WIB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <Search size={20} className="text-slate-400" />
                      <input
                        type="text"
                        placeholder="Masukkan nomor resi"
                        className="w-full bg-transparent text-sm outline-none"
                      />
                      <Link
                        to="/tracking"
                        className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                        Lacak
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-5 text-slate-900 shadow-xl md:block">
                <p className="text-sm text-slate-500">Total Pengiriman</p>
                <h4 className="mt-1 text-2xl font-bold">12.580+</h4>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Layanan Kami
            </p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Solusi Logistik untuk Semua Kebutuhan
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500">
              Kami membantu proses pengiriman barang menjadi lebih mudah,
              transparan, dan terkelola dengan baik.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="inline-flex rounded-2xl bg-blue-100 p-3 text-blue-700">
                <Truck />
              </div>
              <h3 className="mt-6 text-lg font-bold text-slate-900">
                Pengiriman Antar Kota
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Pengiriman cepat untuk kebutuhan personal maupun bisnis.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
              <div className="inline-flex rounded-2xl bg-orange-500/20 p-3 text-orange-400">
                <MapPin />
              </div>
              <h3 className="mt-6 text-lg font-bold">Tracking Real-Time</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Pantau status paket secara langsung menggunakan nomor resi.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="inline-flex rounded-2xl bg-green-100 p-3 text-green-700">
                <ShieldCheck />
              </div>
              <h3 className="mt-6 text-lg font-bold text-slate-900">
                Aman & Terpercaya
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Barang dikirim dengan sistem pencatatan dan armada terkelola.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="inline-flex rounded-2xl bg-orange-100 p-3 text-orange-600">
                <BarChart3 />
              </div>
              <h3 className="mt-6 text-lg font-bold text-slate-900">
                Data Tercatat
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                Riwayat pengiriman tersimpan rapi dan mudah dicek kembali.
              </p>
            </div>
          </div>
        </section>
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">
                Keunggulan Kami
              </p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
                Mengapa Memilih Nusantara Express?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500">
                Kami menghadirkan sistem pengiriman yang cepat, transparan, dan
                mudah dipantau untuk kebutuhan personal maupun bisnis.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <Zap size={30} />
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-950">
                  Pengiriman Cepat
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  Proses pengiriman lebih efisien dengan armada dan kurir yang
                  terjadwal.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <ShieldCheck size={30} />
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-950">
                  Barang Lebih Aman
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  Setiap status pengiriman tercatat sehingga paket lebih mudah
                  dipantau.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                  <BarChart3 size={30} />
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-950">
                  Tarif Transparan
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  Estimasi ongkir dapat dicek lebih awal berdasarkan kota dan
                  berat barang.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
            <div className="bg-slate-950 p-8 text-white md:p-12">
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-400">
                Cek Ongkir
              </p>
              <h2 className="mt-4 text-3xl font-bold md:text-4xl">
                Hitung Estimasi Biaya Pengiriman
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
                Masukkan kota asal, kota tujuan, dan berat barang untuk
                mengetahui estimasi biaya pengiriman.
              </p>

              <Link
                to="/cek-ongkir"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600">
                Cek Ongkir Sekarang
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="p-8 md:p-12">
              <div className="space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Kota Asal</p>
                  <h3 className="mt-1 font-bold text-slate-950">Jakarta</h3>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Kota Tujuan</p>
                  <h3 className="mt-1 font-bold text-slate-950">Surabaya</h3>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">Berat Barang</p>
                    <h3 className="mt-1 font-bold text-slate-950">5 Kg</h3>
                  </div>

                  <div className="rounded-2xl bg-blue-700 p-5 text-white">
                    <p className="text-sm text-blue-100">Estimasi Ongkir</p>
                    <h3 className="mt-1 text-2xl font-extrabold">Rp 140.000</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">
                  Cara Kerja
                </p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
                  Proses Pengiriman yang Mudah Dipahami
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">
                  Mulai dari input data pengiriman, pickup barang, proses
                  perjalanan, hingga paket sampai di tujuan.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["01", "Input Pengiriman", "Data paket dicatat ke sistem."],
                  ["02", "Pickup Barang", "Kurir mengambil barang."],
                  ["03", "Dalam Perjalanan", "Status paket diperbarui."],
                  ["04", "Sampai Tujuan", "Paket diterima pelanggan."],
                ].map((item) => (
                  <div
                    key={item[0]}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <span className="text-sm font-bold text-orange-500">
                      {item[0]}
                    </span>
                    <h3 className="mt-3 font-bold text-slate-900">{item[1]}</h3>
                    <p className="mt-2 text-sm text-slate-500">{item[2]}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-[2rem] bg-slate-950 px-6 py-12 text-center text-white md:px-12">
            <div className="mx-auto max-w-2xl">
              <Clock className="mx-auto text-orange-400" size={42} />
              <h2 className="mt-5 text-3xl font-bold">
                Siap Mengirim Barang Hari Ini?
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                Cek ongkir dan lacak pengiriman kamu dengan mudah melalui
                Nusantara Express Logistics.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  to="/cek-ongkir"
                  className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600">
                  Cek Ongkir Sekarang
                </Link>
                <Link
                  to="/tracking"
                  className="rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                  Tracking Resi
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
