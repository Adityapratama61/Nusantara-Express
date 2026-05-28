import {
  ChevronLeft,
  ChevronRight,
  Edit,
  KeyRound,
  Mail,
  MoreVertical,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  Users,
  UserRoundCheck,
} from "lucide-react";

const users = [
  {
    id: "USR-001",
    name: "Aditya Pratama",
    username: "aditya.admin",
    email: "aditya@nusantaraexpress.id",
    role: "Admin",
    status: "Aktif",
    lastLogin: "Hari ini, 09:30",
    initial: "AP",
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "USR-002",
    name: "Siska Putri",
    username: "siska.staff",
    email: "siska@nusantaraexpress.id",
    role: "Staff Operasional",
    status: "Aktif",
    lastLogin: "Hari ini, 08:15",
    initial: "SP",
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "USR-003",
    name: "Agus Setiawan",
    username: "agus.kurir",
    email: "agus@nusantaraexpress.id",
    role: "Kurir",
    status: "Aktif",
    lastLogin: "Kemarin, 17:45",
    initial: "AS",
    color: "bg-green-100 text-green-700",
  },
  {
    id: "USR-004",
    name: "Rudi Hartono",
    username: "rudi.staff",
    email: "rudi@nusantaraexpress.id",
    role: "Staff Operasional",
    status: "Nonaktif",
    lastLogin: "2 hari lalu",
    initial: "RH",
    color: "bg-slate-100 text-slate-700",
  },
  {
    id: "USR-005",
    name: "Dimas Pratama",
    username: "dimas.kurir",
    email: "dimas@nusantaraexpress.id",
    role: "Kurir",
    status: "Aktif",
    lastLogin: "Hari ini, 10:05",
    initial: "DP",
    color: "bg-purple-100 text-purple-700",
  },
];

const roleStyles = {
  Admin: "bg-blue-100 text-blue-700",
  "Staff Operasional": "bg-orange-100 text-orange-700",
  Kurir: "bg-green-100 text-green-700",
};

const statusStyles = {
  Aktif: "bg-green-100 text-green-700",
  Nonaktif: "bg-red-100 text-red-700",
};

const AdminUsersPage = () => {
  return (
    <section>
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
            Manajemen Users
          </h1>
          <p className="mt-2 text-slate-600">
            Kelola akun admin, staff operasional, dan kurir dalam sistem
            Nusantara Express.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-3 rounded-2xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600">
          <Plus size={20} />
          Tambah User
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <Users size={28} />
          </div>
          <p className="mt-6 text-sm font-semibold text-slate-500">
            Total Users
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">128</h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <ShieldCheck size={28} />
          </div>
          <p className="mt-6 text-sm font-semibold text-slate-500">Admin</p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">8</h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
            <UserCog size={28} />
          </div>
          <p className="mt-6 text-sm font-semibold text-slate-500">
            Staff Operasional
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">42</h2>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
            <UserRoundCheck size={28} />
          </div>
          <p className="mt-6 text-sm font-semibold text-slate-500">
            User Aktif
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-950">116</h2>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex w-full items-center gap-3 rounded-2xl bg-slate-100 px-5 py-3 xl:max-w-md">
            <Search size={20} className="text-slate-500" />
            <input
              type="text"
              placeholder="Cari nama, username, atau email..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 outline-none">
              <option>Semua Role</option>
              <option>Admin</option>
              <option>Staff Operasional</option>
              <option>Kurir</option>
            </select>

            <select className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 outline-none">
              <option>Semua Status</option>
              <option>Aktif</option>
              <option>Nonaktif</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-7 py-5 font-bold">User</th>
                <th className="px-7 py-5 font-bold">Username</th>
                <th className="px-7 py-5 font-bold">Email</th>
                <th className="px-7 py-5 font-bold">Role</th>
                <th className="px-7 py-5 font-bold">Status</th>
                <th className="px-7 py-5 font-bold">Last Login</th>
                <th className="px-7 py-5 text-center font-bold">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-slate-100 transition hover:bg-slate-50">
                  <td className="px-7 py-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-extrabold ${user.color}`}>
                        {user.initial}
                      </div>

                      <div>
                        <p className="font-extrabold text-slate-950">
                          {user.name}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-blue-700">
                          {user.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-7 py-5 font-semibold text-slate-800">
                    {user.username}
                  </td>

                  <td className="px-7 py-5">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail size={17} className="text-slate-400" />
                      {user.email}
                    </div>
                  </td>

                  <td className="px-7 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        roleStyles[user.role]
                      }`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="px-7 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        statusStyles[user.status]
                      }`}>
                      • {user.status}
                    </span>
                  </td>

                  <td className="px-7 py-5 text-slate-600">{user.lastLogin}</td>

                  <td className="px-7 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button className="inline-flex h-9 w-9 items-center justify-center rounded-full text-blue-700 hover:bg-blue-50">
                        <Edit size={18} />
                      </button>

                      <button className="inline-flex h-9 w-9 items-center justify-center rounded-full text-orange-600 hover:bg-orange-50">
                        <KeyRound size={18} />
                      </button>

                      <button className="inline-flex h-9 w-9 items-center justify-center rounded-full text-red-600 hover:bg-red-50">
                        <Trash2 size={18} />
                      </button>

                      <button className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-950">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-slate-200 px-7 py-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-600">
            Showing <span className="font-bold">1 to 5</span> of{" "}
            <span className="font-bold">128</span> users
          </p>

          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-slate-200 p-3 text-slate-500 hover:bg-slate-50">
              <ChevronLeft size={18} />
            </button>

            <button className="rounded-xl bg-blue-700 px-4 py-3 font-bold text-white">
              1
            </button>

            <button className="rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50">
              2
            </button>

            <button className="rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50">
              3
            </button>

            <span className="px-2 text-slate-500">...</span>

            <button className="rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50">
              26
            </button>

            <button className="rounded-xl border border-slate-200 p-3 text-slate-500 hover:bg-slate-50">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-sm">
          <h2 className="text-2xl font-bold">User Access Control</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Pastikan setiap pengguna memiliki role dan akses yang sesuai dengan
            tanggung jawab operasional.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-sm text-slate-300">Admin Access</p>
              <h3 className="mt-2 text-3xl font-bold">8</h3>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-sm text-slate-300">Staff Access</p>
              <h3 className="mt-2 text-3xl font-bold">42</h3>
            </div>

            <div className="rounded-2xl bg-white/10 p-5">
              <p className="text-sm text-slate-300">Courier Access</p>
              <h3 className="mt-2 text-3xl font-bold">78</h3>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Distribusi Role</h2>

          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold text-slate-600">Admin</span>
                <span className="font-bold text-slate-950">6%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 w-[6%] rounded-full bg-blue-600" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold text-slate-600">
                  Staff Operasional
                </span>
                <span className="font-bold text-slate-950">33%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 w-[33%] rounded-full bg-orange-500" />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold text-slate-600">Kurir</span>
                <span className="font-bold text-slate-950">61%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div className="h-3 w-[61%] rounded-full bg-green-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminUsersPage;
