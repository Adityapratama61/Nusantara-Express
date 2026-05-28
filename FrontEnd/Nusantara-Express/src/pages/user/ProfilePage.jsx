import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  CalendarDays,
  CheckCircle2,
  Lock,
  Mail,
  MapPin,
  Package,
  Phone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";

const getUserFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

const formatMonthYear = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const initialForm = {
  nama_lengkap: "",
  email: "",
  no_telepon: "",
  kota: "",
  alamat: "",
};

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [summary, setSummary] = useState({});
  const [formData, setFormData] = useState(initialForm);
  const [passwordForm, setPasswordForm] = useState({
    password_lama: "",
    password_baru: "",
    konfirmasi_password: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const user = getUserFromStorage();
  const idUser = user?.id_user || 4;

  const fetchProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/user/dashboard/${idUser}`);
      const data = response.data.data;
      const profile = data.profile || {};

      setProfileData(profile);
      setSummary(data.summary || {});

      setFormData({
        nama_lengkap: profile.nama_pelanggan || profile.nama_lengkap || "",
        email: profile.email_pelanggan || profile.email_user || "",
        no_telepon: profile.no_telepon || "",
        kota: profile.kota || "",
        alamat: profile.alamat || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data profil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!profileData?.id_pelanggan) {
      setError("Data pelanggan belum terhubung dengan akun user ini.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      await api.put(`/pelanggan/${profileData.id_pelanggan}`, {
        nama_pelanggan: formData.nama_lengkap,
        no_telepon: formData.no_telepon,
        email: formData.email,
        alamat: formData.alamat,
        kota: formData.kota,
        tipe_pelanggan: profileData.tipe_pelanggan || "personal",
        status: profileData.status_pelanggan || "aktif",
      });

      setMessage("Profil berhasil diperbarui.");
      fetchProfile();
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal menyimpan perubahan profil.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (
      !passwordForm.password_lama ||
      !passwordForm.password_baru ||
      !passwordForm.konfirmasi_password
    ) {
      setError("Semua field password wajib diisi.");
      setMessage("");
      return;
    }

    if (passwordForm.password_baru !== passwordForm.konfirmasi_password) {
      setError("Konfirmasi password tidak sesuai.");
      setMessage("");
      return;
    }

    setError("");
    setMessage(
      "Fitur ubah password membutuhkan endpoint backend khusus. Saat ini belum disimpan ke database.",
    );
  };

  const handleContactSupport = () => {
    const message = encodeURIComponent(
      `Halo Customer Service Nusantara Express, saya membutuhkan bantuan terkait akun ${formData.nama_lengkap || "saya"}.`,
    );

    window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="font-semibold text-slate-500">
            Mengambil data profil...
          </p>
        </div>
      </section>
    );
  }

  const statusAkun =
    profileData?.status_pelanggan || profileData?.status_user || "aktif";

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">Profil Saya</h1>
        <p className="mt-2 text-slate-600">
          Kelola informasi akun dan keamanan pelanggan Anda.
        </p>
      </div>

      {message && (
        <div className="mt-6 rounded-2xl bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <User size={56} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-950">
              {formData.nama_lengkap || "Pelanggan"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Pelanggan {statusAkun === "aktif" ? "Aktif" : "Nonaktif"}
            </p>

            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
              <CheckCircle2 size={17} />
              Akun Terverifikasi
            </span>

            <div className="mt-7 space-y-4 text-left">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                <Mail size={21} className="text-blue-700" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-bold text-slate-950">
                    {formData.email || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
                <Phone size={21} className="text-blue-700" />
                <div>
                  <p className="text-xs text-slate-500">Nomor Telepon</p>
                  <p className="text-sm font-bold text-slate-950">
                    {formData.no_telepon || "-"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <MapPin size={21} className="mt-1 text-blue-700" />
                <div>
                  <p className="text-xs text-slate-500">Alamat</p>
                  <p className="text-sm font-bold leading-6 text-slate-950">
                    {formData.alamat || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-950">Informasi Akun</h3>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <CalendarDays size={21} className="text-blue-700" />
                  <span className="text-sm font-semibold text-slate-600">
                    Bergabung
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-950">
                  {formatMonthYear(profileData?.created_at)}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-blue-50 p-4">
                <div className="flex items-center gap-3">
                  <Package size={21} className="text-blue-700" />
                  <span className="text-sm font-semibold text-blue-700">
                    Total Pengiriman
                  </span>
                </div>
                <span className="text-xl font-bold text-blue-700">
                  {summary.total_pengiriman || 0}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-green-50 p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={21} className="text-green-700" />
                  <span className="text-sm font-semibold text-green-700">
                    Status Akun
                  </span>
                </div>
                <span className="text-sm font-bold text-green-700">
                  {statusAkun === "aktif" ? "Aktif" : "Nonaktif"}
                </span>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <User className="text-blue-700" size={26} />
              <h2 className="text-2xl font-bold text-slate-950">
                Data Pribadi
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Perbarui data pribadi Anda agar proses pengiriman lebih mudah.
            </p>

            <form
              onSubmit={handleSaveProfile}
              className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-3 block text-sm font-bold text-slate-800">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="nama_lengkap"
                  value={formData.nama_lengkap}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold text-slate-800">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold text-slate-800">
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  name="no_telepon"
                  value={formData.no_telepon}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold text-slate-800">
                  Kota
                </label>
                <input
                  type="text"
                  name="kota"
                  value={formData.kota}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-3 block text-sm font-bold text-slate-800">
                  Alamat Lengkap
                </label>
                <textarea
                  rows="4"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  className="w-full resize-none rounded-2xl border border-slate-300 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-orange-500 px-7 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70">
                  <Save size={21} />
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <Lock className="text-blue-700" size={26} />
              <h2 className="text-2xl font-bold text-slate-950">
                Keamanan Akun
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Ubah password secara berkala untuk menjaga keamanan akun Anda.
            </p>

            <form
              onSubmit={handleChangePassword}
              className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-3 block text-sm font-bold text-slate-800">
                  Password Lama
                </label>
                <input
                  type="password"
                  name="password_lama"
                  value={passwordForm.password_lama}
                  onChange={handlePasswordChange}
                  placeholder="Masukkan password lama"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold text-slate-800">
                  Password Baru
                </label>
                <input
                  type="password"
                  name="password_baru"
                  value={passwordForm.password_baru}
                  onChange={handlePasswordChange}
                  placeholder="Masukkan password baru"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold text-slate-800">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  name="konfirmasi_password"
                  value={passwordForm.konfirmasi_password}
                  onChange={handlePasswordChange}
                  placeholder="Ulangi password baru"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-5 py-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-700 px-7 py-4 font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800">
                  <Lock size={21} />
                  Ubah Password
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Butuh Bantuan?</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
                  Tim customer service kami siap membantu jika Anda mengalami
                  kendala terkait akun atau pengiriman.
                </p>
              </div>

              <button
                onClick={handleContactSupport}
                className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-950 hover:bg-slate-100">
                Hubungi Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
