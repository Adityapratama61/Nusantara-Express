import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import registerIllustration from "../assets/images/register-illustration.png";
import {
  ArrowRight,
  Bell,
  Eye,
  EyeOff,
  PackageCheck,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import logo from "../assets/images/logo-nusantara.png";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    nama_lengkap: "",
    username: "",
    email: "",
    no_telepon: "",
    alamat: "",
    kota: "",
    password: "",
    confirm_password: "",
  });

  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.nama_lengkap ||
      !formData.username ||
      !formData.email ||
      !formData.no_telepon ||
      !formData.alamat ||
      !formData.kota ||
      !formData.password ||
      !formData.confirm_password
    ) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Konfirmasi password tidak sesuai.");
      return;
    }

    if (!agree) {
      setError("Anda harus menyetujui Syarat & Ketentuan terlebih dahulu.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        nama_lengkap: formData.nama_lengkap,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        no_telepon: formData.no_telepon,
        alamat: formData.alamat,
        kota: formData.kota,
      });

      setSuccess("Registrasi berhasil. Silakan login.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section className="flex items-center justify-center px-6 py-10 lg:px-16">
          <div className="w-full max-w-2xl">
            <Link to="/" className="mb-10 flex items-center gap-4">
              <img
                src={logo}
                alt="Nusantara Express"
                className="h-12 w-12 rounded-xl object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-slate-950">
                  Nusantara Express
                </h1>
                <p className="text-sm text-slate-500">Logistics</p>
              </div>
            </Link>

            <div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-950">
                Buat Akun Pelanggan
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
                Daftar untuk mulai melacak dan mengelola pengiriman Anda secara
                real-time.
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-6 rounded-2xl bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={handleRegister} className="mt-8 space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-900">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="nama_lengkap"
                    value={formData.nama_lengkap}
                    onChange={handleInputChange}
                    placeholder="Budi Santoso"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-900">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="budi.user"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-900">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="budi@example.com"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-900">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    name="no_telepon"
                    value={formData.no_telepon}
                    onChange={handleInputChange}
                    placeholder="+62 812 3456 7890"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-900">
                    Kota
                  </label>
                  <input
                    type="text"
                    name="kota"
                    value={formData.kota}
                    onChange={handleInputChange}
                    placeholder="Jakarta"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-900">
                    Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    placeholder="Jl. Sudirman No. 123"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-900">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 pr-14 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-900">
                    Konfirmasi Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 pr-14 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                      {showConfirmPassword ? (
                        <EyeOff size={22} />
                      ) : (
                        <Eye size={22} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm leading-6 text-slate-600">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>
                  Saya menyetujui{" "}
                  <a href="#" className="font-semibold text-blue-700">
                    Syarat & Ketentuan
                  </a>{" "}
                  serta{" "}
                  <a href="#" className="font-semibold text-blue-700">
                    Kebijakan Privasi
                  </a>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70">
                {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
                <ArrowRight size={22} />
              </button>

              <div className="flex items-center gap-5">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-sm font-medium text-slate-500">atau</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Google
                </button>

                <button
                  type="button"
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  Facebook
                </button>
              </div>

              <p className="pt-2 text-center text-sm text-slate-600">
                Sudah punya akun?{" "}
                <Link
                  to="/login"
                  className="font-bold text-blue-700 hover:text-blue-800">
                  Masuk di sini
                </Link>
              </p>
            </form>
          </div>
        </section>

        <section className="hidden bg-slate-950 p-10 text-white lg:block">
          <div className="flex h-full flex-col justify-center">
            <div className="mx-auto w-full max-w-2xl">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 p-10 shadow-2xl">
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-blue-500 blur-3xl" />
                  <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-cyan-500 blur-3xl" />
                </div>

                <div className="relative">
                  <h2 className="text-5xl font-bold leading-tight">
                    Gabung dengan Nusantara Express
                  </h2>
                  <p className="mt-6 text-lg leading-8 text-slate-300">
                    Nikmati pengalaman pengiriman yang lebih mudah, aman, dan
                    transparan dengan jaringan logistik luas di seluruh
                    Nusantara.
                  </p>

                  <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                      <PackageCheck className="text-blue-300" size={30} />
                      <h3 className="mt-5 font-bold">Simpan data pengiriman</h3>
                      <p className="mt-2 text-sm text-slate-300">
                        Riwayat transaksi tersimpan rapi.
                      </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                      <ShieldCheck className="text-blue-300" size={30} />
                      <h3 className="mt-5 font-bold">Tracking lebih cepat</h3>
                      <p className="mt-2 text-sm text-slate-300">
                        Pantau paket dalam satu klik.
                      </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                      <WalletCards className="text-blue-300" size={30} />
                      <h3 className="mt-5 font-bold">Cek ongkir otomatis</h3>
                      <p className="mt-2 text-sm text-slate-300">
                        Estimasi harga instan dan akurat.
                      </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                      <Bell className="text-blue-300" size={30} />
                      <h3 className="mt-5 font-bold">Notifikasi update</h3>
                      <p className="mt-2 text-sm text-slate-300">
                        Update status via sistem.
                      </p>
                    </div>
                  </div>

                  <div className="mt-10 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-950 to-slate-800 p-10">
                    <div className="flex items-center justify-center">
                      <img
                        src={registerIllustration}
                        alt="Register Nusantara Express"
                        className="w-full rounded-[2rem] object-cover"
                      />
                    </div>
                    <p className="mt-5 text-center text-sm text-slate-300">
                      Logistics network for faster delivery across Indonesia.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-8 text-sm text-slate-500">
                © 2026 Nusantara Express Logistics.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
