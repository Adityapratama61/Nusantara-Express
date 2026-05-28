import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import TrackingPage from "../pages/TrackingPage";
import CekOngkirPage from "../pages/CekOngkirPage";
import NotFoundPage from "../pages/NotFoundPage";

import UserLayout from "../layouts/UserLayout";
import UserDashboardPage from "../pages/user/UserDashboardPage";
import RiwayatPengirimanPage from "../pages/user/RiwayatPengirimanPage";
import DetailPengirimanPage from "../pages/user/DetailPengirimanPage";
import NotificationPage from "../pages/user/NotificationPage";
import ProfilePage from "../pages/user/ProfilePage";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminPelangganPage from "../pages/admin/AdminPelangganPage";
import AdminArmadaPage from "../pages/admin/AdminArmadaPage";
import AdminKurirPage from "../pages/admin/AdminKurirPage";
import AdminPengirimanPage from "../pages/admin/AdminPengirimanPage";
import AdminDetailPengirimanPage from "../pages/admin/AdminDetailPengirimanPage";
import AdminTarifOngkirPage from "../pages/admin/AdminTarifOngkirPage";
import AdminLaporanPage from "../pages/admin/AdminLaporanPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/tracking" element={<TrackingPage />} />
      <Route path="/cek-ongkir" element={<CekOngkirPage />} />

      {/* USER ROUTES */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["user", "pelanggan", "kurir"]} />
        }>
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Navigate to="/user/dashboard" replace />} />
          <Route path="dashboard" element={<UserDashboardPage />} />
          <Route
            path="riwayat-pengiriman"
            element={<RiwayatPengirimanPage />}
          />
          <Route
            path="detail-pengiriman/:id"
            element={<DetailPengirimanPage />}
          />
          <Route path="notifikasi" element={<NotificationPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* ADMIN ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={["admin", "staff"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="pelanggan" element={<AdminPelangganPage />} />
          <Route path="armada" element={<AdminArmadaPage />} />
          <Route path="kurir" element={<AdminKurirPage />} />
          <Route path="pengiriman" element={<AdminPengirimanPage />} />
          <Route
            path="pengiriman/detail/:id"
            element={<AdminDetailPengirimanPage />}
          />
          <Route path="tarif-ongkir" element={<AdminTarifOngkirPage />} />
          <Route path="laporan" element={<AdminLaporanPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>
      </Route>

      {/* NOT FOUND */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
