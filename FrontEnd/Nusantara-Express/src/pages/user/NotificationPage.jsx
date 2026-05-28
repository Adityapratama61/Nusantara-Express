import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Clock,
  PackageCheck,
  Truck,
  XCircle,
} from "lucide-react";

const getNotificationStyle = (type) => {
  const styles = {
    progress: {
      icon: Truck,
      iconBox: "bg-blue-100 text-blue-700",
      badge: "bg-blue-100 text-blue-700",
      label: "Dalam Perjalanan",
    },
    success: {
      icon: CheckCircle2,
      iconBox: "bg-green-100 text-green-700",
      badge: "bg-green-100 text-green-700",
      label: "Selesai",
    },
    cost: {
      icon: PackageCheck,
      iconBox: "bg-orange-100 text-orange-700",
      badge: "bg-orange-100 text-orange-700",
      label: "Ongkir",
    },
    update: {
      icon: Clock,
      iconBox: "bg-amber-100 text-amber-700",
      badge: "bg-amber-100 text-amber-700",
      label: "Update",
    },
    failed: {
      icon: XCircle,
      iconBox: "bg-red-100 text-red-700",
      badge: "bg-red-100 text-red-700",
      label: "Gagal",
    },
  };

  return styles[type] || styles.update;
};

const getUserFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

const formatDate = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
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

const getTypeFromStatus = (status = "") => {
  if (status === "Selesai") return "success";
  if (status === "Gagal Kirim") return "failed";
  if (status === "Dalam Perjalanan" || status === "Transit") return "progress";
  if (status === "Menunggu Pickup" || status === "Sampai Tujuan")
    return "update";

  return "update";
};

const mapNotification = (item) => {
  const status = item.status_pengiriman || "";
  const type =
    item.type || item.tipe || item.tipe_notifikasi || getTypeFromStatus(status);

  const createdAt =
    item.created_at ||
    item.waktu_notifikasi ||
    item.tanggal_notifikasi ||
    item.updated_at;

  const unread =
    item.unread === true ||
    item.is_read === false ||
    item.dibaca === 0 ||
    item.status_baca === "belum_dibaca" ||
    item.status_baca === "unread";

  const title =
    item.title ||
    item.judul ||
    item.judul_notifikasi ||
    (status ? `Status Pengiriman ${status}` : "Update Pengiriman");

  const description =
    item.description ||
    item.pesan ||
    item.isi ||
    item.keterangan ||
    (item.nomor_resi
      ? `Pengiriman dengan nomor resi ${item.nomor_resi} memiliki update terbaru.`
      : "Ada pembaruan terbaru terkait pengiriman Anda.");

  return {
    id: item.id_notifikasi || item.id || item.id_pengiriman || Math.random(),
    id_pengiriman: item.id_pengiriman,
    nomor_resi: item.nomor_resi,
    type,
    title,
    description,
    time: createdAt ? `${formatTime(createdAt)} WIB` : "-",
    date: createdAt ? formatDate(createdAt) : "-",
    unread,
    status_pengiriman: status,
  };
};

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = getUserFromStorage();
  const idUser = user?.id_user || 4;

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/user/notifikasi/${idUser}`);
      const data = response.data.data || [];

      setNotifications(data.map(mapNotification));
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengambil data notifikasi.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        unread: false,
      })),
    );
  };

  const handleArchive = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const totalNotifications = notifications.length;
  const unreadCount = notifications.filter((item) => item.unread).length;
  const successCount = notifications.filter(
    (item) => item.type === "success" || item.status_pengiriman === "Selesai",
  ).length;

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Notifikasi</h1>
          <p className="mt-2 text-slate-600">
            Lihat pembaruan terbaru terkait pengiriman Anda.
          </p>
        </div>

        <button
          onClick={handleMarkAllAsRead}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800">
          <CheckCheck size={20} />
          Tandai Semua Dibaca
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="font-semibold text-slate-500">
                Mengambil data notifikasi...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <Bell className="mx-auto text-slate-400" size={48} />
              <h2 className="mt-5 text-2xl font-bold text-slate-950">
                Belum Ada Notifikasi
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Pembaruan status pengiriman Anda akan muncul di sini.
              </p>
            </div>
          ) : (
            notifications.map((item) => {
              const style = getNotificationStyle(item.type);
              const Icon = style.icon;

              return (
                <div
                  key={item.id}
                  className={`relative rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                    item.unread
                      ? "border-blue-200 ring-1 ring-blue-100"
                      : "border-slate-200"
                  }`}>
                  {item.unread && (
                    <span className="absolute right-6 top-6 h-3 w-3 rounded-full bg-orange-500" />
                  )}

                  <div className="flex flex-col gap-5 md:flex-row md:items-start">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${style.iconBox}`}>
                      <Icon size={26} />
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${style.badge}`}>
                            {item.status_pengiriman || style.label}
                          </span>

                          <h2 className="mt-3 text-xl font-bold text-slate-950">
                            {item.title}
                          </h2>
                        </div>

                        <div className="text-left md:text-right">
                          <p className="text-sm font-semibold text-slate-700">
                            {item.date}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.time}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                        {item.description}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-3">
                        {item.id_pengiriman ? (
                          <Link
                            to={`/user/detail-pengiriman/${item.id_pengiriman}`}
                            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
                            Lihat Detail
                          </Link>
                        ) : (
                          <button className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">
                            Lihat Detail
                          </button>
                        )}

                        <button
                          onClick={() => handleArchive(item.id)}
                          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
                          Arsipkan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <Bell size={28} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              Ringkasan Notifikasi
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Pantau semua update pengiriman dan aktivitas akun Anda.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <span className="text-sm font-semibold text-slate-600">
                  Total Notifikasi
                </span>
                <span className="text-xl font-bold text-slate-950">
                  {totalNotifications}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-blue-50 p-4">
                <span className="text-sm font-semibold text-blue-700">
                  Belum Dibaca
                </span>
                <span className="text-xl font-bold text-blue-700">
                  {unreadCount}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-green-50 p-4">
                <span className="text-sm font-semibold text-green-700">
                  Pengiriman Selesai
                </span>
                <span className="text-xl font-bold text-green-700">
                  {successCount}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
            <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold">
              INFO
            </span>

            <h3 className="mt-5 text-xl font-bold">
              Aktifkan Notifikasi Real-Time
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Dapatkan pemberitahuan langsung saat status paket Anda berubah.
            </p>

            <button
              onClick={fetchNotifications}
              className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-950 hover:bg-slate-100">
              Refresh Notifikasi
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default NotificationPage;
