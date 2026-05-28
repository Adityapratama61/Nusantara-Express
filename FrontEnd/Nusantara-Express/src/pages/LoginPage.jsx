import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import loginIllustration from "../assets/images/login-illustration.png";
import {
  Eye,
  EyeOff,
  LogIn,
  MapPin,
  PackageCheck,
  WalletCards,
  Bell,
} from "lucide-react";
import logo from "../assets/images/logo-nusantara.png";

const LoginPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        identifier,
        password,
      });

      const { token, user } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin" || user.role === "staff") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login gagal. Silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section className="flex items-center justify-center px-6 py-10 lg:px-16">
          <div className="w-full max-w-xl">
            <Link to="/" className="mb-14 flex items-center gap-4">
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
                Masuk ke Akun Anda
              </h2>
              <p className="mt-4 max-w-md text-lg leading-8 text-slate-600">
                Lacak pengiriman dan cek status barang Anda dengan mudah.
              </p>
            </div>

            <form onSubmit={handleLogin} className="mt-10 space-y-6">
              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-900">
                  Username atau Email
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Masukan Username"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-900">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
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

              {error && (
                <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Ingat saya
                </label>

                <a
                  href="#"
                  className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                  Lupa password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70">
                {loading ? "Memproses..." : "Masuk"}
                <LogIn size={22} />
              </button>

              <div className="flex items-center gap-5">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-sm font-medium text-slate-500">ATAU</span>
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

              <p className="pt-3 text-center text-sm text-slate-600">
                Belum punya akun?{" "}
                <Link
                  to="/register"
                  className="font-bold text-blue-700 hover:text-blue-800">
                  Daftar sekarang
                </Link>
              </p>
            </form>
          </div>
        </section>

        <section className="hidden bg-slate-950 p-10 text-white lg:block">
          <div className="flex h-full flex-col justify-center">
            <div className="mx-auto w-full max-w-2xl">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-10 shadow-2xl">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-blue-500 blur-3xl" />
                  <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-orange-500 blur-3xl" />
                </div>

                <div className="relative flex min-h-[360px] items-center justify-center">
                  <div className="rounded-[2rem] border border-white/10 bg-white/10 p-10 backdrop-blur">
                    <img
                      src={loginIllustration}
                      alt="Login Nusantara Express"
                      className="w-full rounded-[2rem] object-cover"
                    />
                    <p className="mt-6 text-center text-lg font-semibold">
                      Fast, Safe, and Real-Time Delivery
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-xl">
                <h2 className="text-3xl font-bold leading-tight">
                  Pantau Pengiriman Anda Secara Real-Time
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-300">
                  Dapatkan informasi status barang, estimasi ongkir, dan riwayat
                  pengiriman dalam satu platform terintegrasi.
                </p>

                <div className="mt-8 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-600/20 p-3 text-blue-300">
                      <MapPin size={22} />
                    </div>
                    <p className="font-semibold">Tracking resi real-time</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-600/20 p-3 text-blue-300">
                      <WalletCards size={22} />
                    </div>
                    <p className="font-semibold">Cek ongkir cepat</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-600/20 p-3 text-blue-300">
                      <PackageCheck size={22} />
                    </div>
                    <p className="font-semibold">
                      Riwayat pengiriman tersimpan
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-blue-600/20 p-3 text-blue-300">
                      <Bell size={22} />
                    </div>
                    <p className="font-semibold">
                      Notifikasi status pengiriman
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

export default LoginPage;
