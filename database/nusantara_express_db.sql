-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 28, 2026 at 03:39 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nusantara_express_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `armada`
--

CREATE TABLE `armada` (
  `id_armada` int NOT NULL,
  `nomor_kendaraan` varchar(30) NOT NULL,
  `jenis_kendaraan` varchar(50) NOT NULL,
  `kapasitas` varchar(50) NOT NULL,
  `sopir` varchar(100) NOT NULL,
  `status_armada` enum('tersedia','digunakan','perawatan') DEFAULT 'tersedia',
  `bahan_bakar` varchar(50) DEFAULT NULL,
  `rute_aktif` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `armada`
--

INSERT INTO `armada` (`id_armada`, `nomor_kendaraan`, `jenis_kendaraan`, `kapasitas`, `sopir`, `status_armada`, `bahan_bakar`, `rute_aktif`, `created_at`, `updated_at`) VALUES
(1, 'B 1234 NEL', 'Box Truck', '2 Ton', 'Agus Setiawan', 'digunakan', 'Diesel', 'Jakarta - Bandung', '2026-05-27 15:06:10', '2026-05-27 15:06:10'),
(2, 'D 4521 NEX', 'Pickup', '1 Ton', 'Rudi Hartono', 'digunakan', 'Pertalite', 'Bandung - Semarang', '2026-05-27 15:06:10', '2026-05-27 15:06:10'),
(3, 'L 8871 LOG', 'Container Truck', '8 Ton', 'Bambang Riyadi', 'perawatan', 'Diesel', 'Surabaya - Bali', '2026-05-27 15:06:10', '2026-05-27 15:06:10'),
(4, 'B 7788 EXP', 'Van Delivery', '800 Kg', 'Dimas Pratama', 'tersedia', 'Pertamax', 'Jakarta - Bekasi', '2026-05-27 15:06:10', '2026-05-27 15:06:10'),
(5, 'AB 9090 NUS', 'Cold Storage Truck', '3 Ton', 'Fajar Nugroho', 'digunakan', 'Diesel', 'Yogyakarta - Solo', '2026-05-27 15:06:10', '2026-05-27 15:06:10');

-- --------------------------------------------------------

--
-- Table structure for table `kurir`
--

CREATE TABLE `kurir` (
  `id_kurir` int NOT NULL,
  `kode_kurir` varchar(20) NOT NULL,
  `id_user` int DEFAULT NULL,
  `nama_kurir` varchar(100) NOT NULL,
  `no_telepon` varchar(20) NOT NULL,
  `alamat` text NOT NULL,
  `area_tugas` varchar(100) DEFAULT NULL,
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `kurir`
--

INSERT INTO `kurir` (`id_kurir`, `kode_kurir`, `id_user`, `nama_kurir`, `no_telepon`, `alamat`, `area_tugas`, `status`, `created_at`, `updated_at`) VALUES
(1, 'KUR-001', 3, 'Agus Setiawan Updated', '081222113344', 'Jakarta Timur', 'Jakarta - Bekasi', 'aktif', '2026-05-27 15:06:10', '2026-05-27 22:42:23'),
(2, 'KUR-002', NULL, 'Rudi Hartono', '081399887766', 'Bandung', 'Bandung - Cimahi', 'aktif', '2026-05-27 15:06:10', '2026-05-27 15:06:10'),
(3, 'KUR-003', NULL, 'Dimas Pratama', '085633442211', 'Surabaya', 'Surabaya - Sidoarjo', 'nonaktif', '2026-05-27 15:06:10', '2026-05-28 10:50:06'),
(4, 'KUR-004', NULL, 'Fajar Nugroho', '082166778899', 'Yogyakarta', 'Jogja - Solo', 'aktif', '2026-05-27 15:06:10', '2026-05-27 15:06:10'),
(5, 'KUR-005', NULL, 'Bambang Riyadi', '081155664433', 'Medan', 'Medan Kota', 'aktif', '2026-05-27 15:06:10', '2026-05-27 15:06:10');

-- --------------------------------------------------------

--
-- Table structure for table `notifikasi`
--

CREATE TABLE `notifikasi` (
  `id_notifikasi` int NOT NULL,
  `id_user` int DEFAULT NULL,
  `id_pengiriman` int DEFAULT NULL,
  `judul` varchar(150) NOT NULL,
  `pesan` text NOT NULL,
  `tipe` enum('info','success','warning','danger') DEFAULT 'info',
  `status_baca` enum('belum_dibaca','dibaca') DEFAULT 'belum_dibaca',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `notifikasi`
--

INSERT INTO `notifikasi` (`id_notifikasi`, `id_user`, `id_pengiriman`, `judul`, `pesan`, `tipe`, `status_baca`, `created_at`) VALUES
(1, 4, 1, 'Paket sedang dalam perjalanan', 'Paket Anda dengan resi NX-20260812-001 sedang menuju Bandung.', 'info', 'belum_dibaca', '2026-05-27 15:06:10'),
(2, 4, 2, 'Paket telah sampai tujuan', 'Paket Anda dengan resi NX-20260812-002 telah berhasil diterima.', 'success', 'dibaca', '2026-05-27 15:06:10'),
(3, 4, 3, 'Status pengiriman diperbarui', 'Paket Anda berada di hub transit Semarang.', 'warning', 'belum_dibaca', '2026-05-27 15:06:10');

-- --------------------------------------------------------

--
-- Table structure for table `pelanggan`
--

CREATE TABLE `pelanggan` (
  `id_pelanggan` int NOT NULL,
  `kode_pelanggan` varchar(20) NOT NULL,
  `id_user` int DEFAULT NULL,
  `nama_pelanggan` varchar(100) NOT NULL,
  `no_telepon` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `alamat` text NOT NULL,
  `kota` varchar(100) NOT NULL,
  `tipe_pelanggan` enum('personal','corporate') DEFAULT 'personal',
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pelanggan`
--

INSERT INTO `pelanggan` (`id_pelanggan`, `kode_pelanggan`, `id_user`, `nama_pelanggan`, `no_telepon`, `email`, `alamat`, `kota`, `tipe_pelanggan`, `status`, `created_at`, `updated_at`) VALUES
(1, 'CUST-001', NULL, 'PT. Maju Jaya Updated', '081234567890', 'info@majujaya.co.id', 'Jl. Sudirman No. 123 Jakarta', 'Jakarta', 'corporate', 'aktif', '2026-05-27 15:06:10', '2026-05-27 17:22:28'),
(2, 'CUST-002', 4, 'Budi Santoso', '085778901234', 'budi@example.com', 'Jl. Ahmad Yani No. 45', 'Surabaya', 'personal', 'aktif', '2026-05-27 15:06:10', '2026-05-27 15:06:10'),
(3, 'CUST-003', NULL, 'Sinar Logistik', '081311223344', 'ops@sinarlogistik.id', 'Jl. Asia Afrika No. 88', 'Bandung', 'corporate', 'aktif', '2026-05-27 15:06:10', '2026-05-27 15:06:10'),
(4, 'CUST-004', NULL, 'Global Kargo', '082144556677', 'support@globalkargo.net', 'Jl. Pettarani No. 10', 'Makassar', 'corporate', 'aktif', '2026-05-27 15:06:10', '2026-05-27 15:06:10'),
(5, 'CUST-005', NULL, 'Andi Mandiri', '085677889900', 'andi.mandiri@gmail.com', 'Jl. Gatot Subroto No. 7', 'Medan', 'personal', 'aktif', '2026-05-27 15:06:10', '2026-05-27 15:06:10'),
(6, 'CUST-006', NULL, 'Toko Sumber Rezeki', '081299887766', 'sumberrezeki@gmail.com', 'Jl. Merdeka No. 99', 'Bekasi', 'personal', 'aktif', '2026-05-27 17:21:47', '2026-05-27 17:21:47'),
(9, 'CUST-007', 6, 'Rizky Pratama 4', '081234567894', 'rizky4@example.com', 'Jl. Melati No. 10', 'Jakarta', 'personal', 'aktif', '2026-05-28 15:20:16', '2026-05-28 15:20:16'),
(10, 'CUST-008', 7, 'Aditya dermawan', '124567890', 'aditya@gmail.com', 'jalan raya al', 'bekasi', 'personal', 'aktif', '2026-05-28 15:25:43', '2026-05-28 15:25:43');

-- --------------------------------------------------------

--
-- Table structure for table `pengiriman`
--

CREATE TABLE `pengiriman` (
  `id_pengiriman` int NOT NULL,
  `nomor_resi` varchar(50) NOT NULL,
  `id_pelanggan` int DEFAULT NULL,
  `id_kurir` int DEFAULT NULL,
  `id_armada` int DEFAULT NULL,
  `id_tarif` int DEFAULT NULL,
  `nama_pengirim` varchar(100) NOT NULL,
  `telepon_pengirim` varchar(20) NOT NULL,
  `alamat_pengirim` text NOT NULL,
  `nama_penerima` varchar(100) NOT NULL,
  `telepon_penerima` varchar(20) NOT NULL,
  `alamat_penerima` text NOT NULL,
  `kota_asal` varchar(100) NOT NULL,
  `kota_tujuan` varchar(100) NOT NULL,
  `berat_barang` decimal(10,2) NOT NULL,
  `jenis_barang` varchar(100) NOT NULL,
  `layanan` enum('reguler','express','cargo') DEFAULT 'reguler',
  `biaya_kirim` decimal(12,2) NOT NULL,
  `status_pengiriman` enum('Menunggu Pickup','Dalam Perjalanan','Transit','Sampai Tujuan','Selesai','Gagal Kirim') DEFAULT 'Menunggu Pickup',
  `estimasi_tiba` varchar(100) DEFAULT NULL,
  `catatan` text,
  `tanggal_pengiriman` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pengiriman`
--

INSERT INTO `pengiriman` (`id_pengiriman`, `nomor_resi`, `id_pelanggan`, `id_kurir`, `id_armada`, `id_tarif`, `nama_pengirim`, `telepon_pengirim`, `alamat_pengirim`, `nama_penerima`, `telepon_penerima`, `alamat_penerima`, `kota_asal`, `kota_tujuan`, `berat_barang`, `jenis_barang`, `layanan`, `biaya_kirim`, `status_pengiriman`, `estimasi_tiba`, `catatan`, `tanggal_pengiriman`, `created_at`, `updated_at`) VALUES
(1, 'NX-20260812-001', 1, 1, 1, 1, 'PT. Maju Jaya', '081234567890', 'Jl. Sudirman No. 123, Jakarta', 'Jane Doe', '085778901234', 'Jl. Asia Afrika No. 45, Bandung', 'Jakarta', 'Bandung', 5.00, 'Elektronik', 'reguler', 40000.00, 'Transit', 'Hari ini, 17:00 WIB', 'Paket sedang dalam perjalanan menuju Bandung.', '2026-05-27 22:06:10', '2026-05-27 15:06:10', '2026-05-27 22:52:30'),
(2, 'NX-20260812-002', 2, 2, 3, 2, 'Budi Santoso', '085778901234', 'Jl. Ahmad Yani No. 45, Surabaya', 'Rudi Hartono', '081399887766', 'Jl. Ijen No. 10, Malang', 'Surabaya', 'Malang', 2.00, 'Dokumen', 'express', 48000.00, 'Selesai', 'Selesai', 'Paket telah diterima oleh penerima.', '2026-05-27 22:06:10', '2026-05-27 15:06:10', '2026-05-27 15:06:10'),
(3, 'NX-20260812-003', 3, 3, 2, 3, 'Sinar Logistik', '081311223344', 'Jl. Asia Afrika No. 88, Bandung', 'Ani Putri', '082233445566', 'Jl. Pandanaran No. 9, Semarang', 'Bandung', 'Semarang', 10.00, 'Sparepart', 'reguler', 120000.00, 'Transit', 'Besok, 10:00 WIB', 'Paket berada di hub transit.', '2026-05-27 22:06:10', '2026-05-27 15:06:10', '2026-05-27 15:06:10'),
(4, 'NX-20260812-004', 5, 4, 5, 5, 'Andi Mandiri', '085677889900', 'Jl. Gatot Subroto No. 7, Medan', 'Toko Berkah', '081288776655', 'Jl. Pemuda No. 12, Padang', 'Medan', 'Padang', 7.00, 'Pakaian', 'reguler', 112000.00, 'Menunggu Pickup', 'Besok, 15:00 WIB', 'Menunggu kurir melakukan pickup.', '2026-05-27 22:06:10', '2026-05-27 15:06:10', '2026-05-27 15:06:10'),
(5, 'NX-20260527-001', 1, 5, 1, 1, 'PT. Maju Jaya', '081234567890', 'Jl. Sudirman No. 123, Jakarta', 'Doni Saputra', '081288887777', 'Jl. Merdeka No. 20, Bandung', 'Jakarta', 'Bandung', 6.00, 'Dokumen', 'reguler', 54000.00, 'Menunggu Pickup', '1-2 Hari', 'Paket fragile', '2026-05-28 05:51:50', '2026-05-27 22:51:50', '2026-05-28 13:45:00');

-- --------------------------------------------------------

--
-- Table structure for table `tarif_ongkir`
--

CREATE TABLE `tarif_ongkir` (
  `id_tarif` int NOT NULL,
  `kode_tarif` varchar(20) NOT NULL,
  `kota_asal` varchar(100) NOT NULL,
  `kota_tujuan` varchar(100) NOT NULL,
  `layanan` enum('reguler','express','cargo') DEFAULT 'reguler',
  `tarif_per_kg` decimal(12,2) NOT NULL,
  `estimasi` varchar(50) NOT NULL,
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tarif_ongkir`
--

INSERT INTO `tarif_ongkir` (`id_tarif`, `kode_tarif`, `kota_asal`, `kota_tujuan`, `layanan`, `tarif_per_kg`, `estimasi`, `status`, `created_at`, `updated_at`) VALUES
(1, 'TRF-001', 'Jakarta', 'Bandung', 'reguler', 9000.00, '1-2 Hari', 'aktif', '2026-05-27 15:06:10', '2026-05-27 22:46:53'),
(2, 'TRF-002', 'Jakarta', 'Surabaya', 'express', 14000.00, '2-3 Hari', 'aktif', '2026-05-27 15:06:10', '2026-05-27 15:06:10'),
(3, 'TRF-003', 'Bandung', 'Semarang', 'reguler', 12000.00, '2 Hari', 'aktif', '2026-05-27 15:06:10', '2026-05-27 15:06:10'),
(4, 'TRF-004', 'Surabaya', 'Denpasar', 'cargo', 18000.00, '3-4 Hari', 'nonaktif', '2026-05-27 15:06:10', '2026-05-28 10:52:53'),
(5, 'TRF-005', 'Medan', 'Padang', 'reguler', 16000.00, '2-3 Hari', 'aktif', '2026-05-27 15:06:10', '2026-05-27 15:06:10'),
(6, 'TRF-006', 'Jakarta', 'Medan', 'express', 28000.00, '3-4 Hari', 'aktif', '2026-05-27 15:06:10', '2026-05-27 15:06:10'),
(7, 'TRF-007', 'Jakarta', 'Makassar', 'cargo', 22000.00, '4-5 Hari', 'aktif', '2026-05-27 15:06:10', '2026-05-27 15:06:10');

-- --------------------------------------------------------

--
-- Table structure for table `tracking_pengiriman`
--

CREATE TABLE `tracking_pengiriman` (
  `id_tracking` int NOT NULL,
  `id_pengiriman` int NOT NULL,
  `status_tracking` enum('Menunggu Pickup','Dalam Perjalanan','Transit','Sampai Tujuan','Selesai','Gagal Kirim') NOT NULL,
  `lokasi` varchar(150) NOT NULL,
  `keterangan` text,
  `waktu_update` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tracking_pengiriman`
--

INSERT INTO `tracking_pengiriman` (`id_tracking`, `id_pengiriman`, `status_tracking`, `lokasi`, `keterangan`, `waktu_update`, `created_at`) VALUES
(1, 1, 'Menunggu Pickup', 'Gudang Jakarta Pusat', 'Data pengiriman dibuat dan menunggu pickup.', '2026-08-12 08:30:00', '2026-05-27 15:06:10'),
(2, 1, 'Dalam Perjalanan', 'Tol Jakarta - Cikampek', 'Paket telah dijemput dan sedang dalam perjalanan.', '2026-08-12 13:45:00', '2026-05-27 15:06:10'),
(3, 2, 'Menunggu Pickup', 'Gudang Surabaya', 'Data pengiriman dibuat.', '2026-08-12 09:00:00', '2026-05-27 15:06:10'),
(4, 2, 'Dalam Perjalanan', 'Surabaya Kota', 'Paket sedang dikirim oleh kurir.', '2026-08-12 11:30:00', '2026-05-27 15:06:10'),
(5, 2, 'Selesai', 'Alamat Penerima', 'Paket berhasil diterima oleh penerima.', '2026-08-12 16:20:00', '2026-05-27 15:06:10'),
(6, 3, 'Menunggu Pickup', 'Gudang Bandung', 'Paket menunggu proses pickup.', '2026-08-13 08:00:00', '2026-05-27 15:06:10'),
(7, 3, 'Dalam Perjalanan', 'Bandung Timur', 'Paket sedang dalam perjalanan.', '2026-08-13 11:00:00', '2026-05-27 15:06:10'),
(8, 3, 'Transit', 'Hub Semarang', 'Paket berada di hub transit.', '2026-08-13 18:10:00', '2026-05-27 15:06:10'),
(9, 4, 'Menunggu Pickup', 'Gudang Medan', 'Menunggu pickup dari kurir.', '2026-08-14 09:00:00', '2026-05-27 15:06:10'),
(10, 5, 'Menunggu Pickup', 'Jakarta', 'Data pengiriman dibuat.', '2026-05-28 05:51:50', '2026-05-27 22:51:50'),
(11, 1, 'Transit', 'Hub Bandung', 'Paket sudah tiba di hub transit Bandung dan sedang disortir.', '2026-05-28 05:52:30', '2026-05-27 22:52:30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','staff','kurir','pelanggan') NOT NULL,
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `nama_lengkap`, `username`, `email`, `password`, `role`, `status`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'Admin Nusantara', 'admin', 'admin@nusantaraexpress.id', '$2y$10$g644t9mRk1PZWFqLx6IjsugEdR3MzALRvtIZerRskrl/femm.6DTi', 'admin', 'aktif', '2026-05-28 22:05:33', '2026-05-27 15:06:10', '2026-05-28 15:05:33'),
(2, 'Staff Operasional', 'staff', 'staff@nusantaraexpress.id', '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'staff', 'aktif', NULL, '2026-05-27 15:06:10', '2026-05-27 15:06:10'),
(3, 'Agus Setiawan', 'agus.kurir', 'agus@nusantaraexpress.id', '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'kurir', 'aktif', NULL, '2026-05-27 15:06:10', '2026-05-27 15:06:10'),
(4, 'Budi Santoso', 'budi.user', 'budi@example.com', '$2y$10$QLqnkgRdZx1/V1m6Robqg.PWHrlwt.dlFLpGgVtoVu2hrlHVxsKMe', 'pelanggan', 'aktif', '2026-05-28 22:07:02', '2026-05-27 15:06:10', '2026-05-28 15:07:02'),
(6, 'Rizky Pratama 4', 'rizky4.user', 'rizky4@example.com', '$2y$10$n9b3saePKtZ/gfCHjT4a.uUHoDLgN8ZZOYa0uNVHvZsLTqYdP6X62', 'pelanggan', 'aktif', '2026-05-28 22:20:35', '2026-05-28 15:20:16', '2026-05-28 15:20:35'),
(7, 'Aditya dermawan', 'Aditya61', 'aditya@gmail.com', '$2y$10$R27mmWgg1wf5LGr0G0MiVe7LQutctOXbjfvK8DsAkglHuTXeBkI8S', 'pelanggan', 'aktif', '2026-05-28 22:25:57', '2026-05-28 15:25:43', '2026-05-28 15:25:57');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `armada`
--
ALTER TABLE `armada`
  ADD PRIMARY KEY (`id_armada`),
  ADD UNIQUE KEY `nomor_kendaraan` (`nomor_kendaraan`);

--
-- Indexes for table `kurir`
--
ALTER TABLE `kurir`
  ADD PRIMARY KEY (`id_kurir`),
  ADD UNIQUE KEY `kode_kurir` (`kode_kurir`),
  ADD KEY `fk_kurir_user` (`id_user`);

--
-- Indexes for table `notifikasi`
--
ALTER TABLE `notifikasi`
  ADD PRIMARY KEY (`id_notifikasi`),
  ADD KEY `fk_notifikasi_user` (`id_user`),
  ADD KEY `fk_notifikasi_pengiriman` (`id_pengiriman`);

--
-- Indexes for table `pelanggan`
--
ALTER TABLE `pelanggan`
  ADD PRIMARY KEY (`id_pelanggan`),
  ADD UNIQUE KEY `kode_pelanggan` (`kode_pelanggan`),
  ADD KEY `fk_pelanggan_user` (`id_user`);

--
-- Indexes for table `pengiriman`
--
ALTER TABLE `pengiriman`
  ADD PRIMARY KEY (`id_pengiriman`),
  ADD UNIQUE KEY `nomor_resi` (`nomor_resi`),
  ADD KEY `fk_pengiriman_pelanggan` (`id_pelanggan`),
  ADD KEY `fk_pengiriman_kurir` (`id_kurir`),
  ADD KEY `fk_pengiriman_armada` (`id_armada`),
  ADD KEY `fk_pengiriman_tarif` (`id_tarif`),
  ADD KEY `idx_resi` (`nomor_resi`),
  ADD KEY `idx_status_pengiriman` (`status_pengiriman`);

--
-- Indexes for table `tarif_ongkir`
--
ALTER TABLE `tarif_ongkir`
  ADD PRIMARY KEY (`id_tarif`),
  ADD UNIQUE KEY `kode_tarif` (`kode_tarif`),
  ADD KEY `idx_kota_asal_tujuan` (`kota_asal`,`kota_tujuan`);

--
-- Indexes for table `tracking_pengiriman`
--
ALTER TABLE `tracking_pengiriman`
  ADD PRIMARY KEY (`id_tracking`),
  ADD KEY `idx_tracking_pengiriman` (`id_pengiriman`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `armada`
--
ALTER TABLE `armada`
  MODIFY `id_armada` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `kurir`
--
ALTER TABLE `kurir`
  MODIFY `id_kurir` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `notifikasi`
--
ALTER TABLE `notifikasi`
  MODIFY `id_notifikasi` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `pelanggan`
--
ALTER TABLE `pelanggan`
  MODIFY `id_pelanggan` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `pengiriman`
--
ALTER TABLE `pengiriman`
  MODIFY `id_pengiriman` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tarif_ongkir`
--
ALTER TABLE `tarif_ongkir`
  MODIFY `id_tarif` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `tracking_pengiriman`
--
ALTER TABLE `tracking_pengiriman`
  MODIFY `id_tracking` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `kurir`
--
ALTER TABLE `kurir`
  ADD CONSTRAINT `fk_kurir_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `notifikasi`
--
ALTER TABLE `notifikasi`
  ADD CONSTRAINT `fk_notifikasi_pengiriman` FOREIGN KEY (`id_pengiriman`) REFERENCES `pengiriman` (`id_pengiriman`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_notifikasi_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pelanggan`
--
ALTER TABLE `pelanggan`
  ADD CONSTRAINT `fk_pelanggan_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `pengiriman`
--
ALTER TABLE `pengiriman`
  ADD CONSTRAINT `fk_pengiriman_armada` FOREIGN KEY (`id_armada`) REFERENCES `armada` (`id_armada`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pengiriman_kurir` FOREIGN KEY (`id_kurir`) REFERENCES `kurir` (`id_kurir`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pengiriman_pelanggan` FOREIGN KEY (`id_pelanggan`) REFERENCES `pelanggan` (`id_pelanggan`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pengiriman_tarif` FOREIGN KEY (`id_tarif`) REFERENCES `tarif_ongkir` (`id_tarif`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `tracking_pengiriman`
--
ALTER TABLE `tracking_pengiriman`
  ADD CONSTRAINT `fk_tracking_pengiriman` FOREIGN KEY (`id_pengiriman`) REFERENCES `pengiriman` (`id_pengiriman`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
