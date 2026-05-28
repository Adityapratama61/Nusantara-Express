<?php

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../helpers/response.php";

class DashboardController
{
    public function index()
    {
        global $pdo;

        $totalPengiriman = $pdo->query("
            SELECT COUNT(*) AS total 
            FROM pengiriman
        ")->fetch()["total"];

        $dalamProses = $pdo->query("
            SELECT COUNT(*) AS total 
            FROM pengiriman
            WHERE status_pengiriman IN ('Menunggu Pickup', 'Dalam Perjalanan', 'Transit', 'Sampai Tujuan')
        ")->fetch()["total"];

        $pengirimanSelesai = $pdo->query("
            SELECT COUNT(*) AS total 
            FROM pengiriman
            WHERE status_pengiriman = 'Selesai'
        ")->fetch()["total"];

        $totalPelanggan = $pdo->query("
            SELECT COUNT(*) AS total 
            FROM pelanggan
        ")->fetch()["total"];

        $totalArmada = $pdo->query("
            SELECT COUNT(*) AS total 
            FROM armada
        ")->fetch()["total"];

        $totalKurir = $pdo->query("
            SELECT COUNT(*) AS total 
            FROM kurir
        ")->fetch()["total"];

        $totalPendapatan = $pdo->query("
            SELECT COALESCE(SUM(biaya_kirim), 0) AS total 
            FROM pengiriman
            WHERE status_pengiriman != 'Gagal Kirim'
        ")->fetch()["total"];

        $statusDistribution = $pdo->query("
            SELECT 
                status_pengiriman,
                COUNT(*) AS total
            FROM pengiriman
            GROUP BY status_pengiriman
            ORDER BY total DESC
        ")->fetchAll();

        $monthlyShipments = $pdo->query("
            SELECT 
                DATE_FORMAT(tanggal_pengiriman, '%Y-%m') AS bulan,
                COUNT(*) AS total_pengiriman,
                COALESCE(SUM(biaya_kirim), 0) AS total_pendapatan
            FROM pengiriman
            GROUP BY DATE_FORMAT(tanggal_pengiriman, '%Y-%m')
            ORDER BY bulan ASC
        ")->fetchAll();

        $recentShipments = $pdo->query("
            SELECT 
                p.id_pengiriman,
                p.nomor_resi,
                p.nama_pengirim,
                p.nama_penerima,
                p.kota_asal,
                p.kota_tujuan,
                p.status_pengiriman,
                p.biaya_kirim,
                p.tanggal_pengiriman,
                k.nama_kurir,
                a.nomor_kendaraan
            FROM pengiriman p
            LEFT JOIN kurir k ON p.id_kurir = k.id_kurir
            LEFT JOIN armada a ON p.id_armada = a.id_armada
            ORDER BY p.id_pengiriman DESC
            LIMIT 5
        ")->fetchAll();

        jsonResponse(true, "Data dashboard berhasil diambil", [
            "summary" => [
                "total_pengiriman" => (int) $totalPengiriman,
                "dalam_proses" => (int) $dalamProses,
                "pengiriman_selesai" => (int) $pengirimanSelesai,
                "total_pelanggan" => (int) $totalPelanggan,
                "total_armada" => (int) $totalArmada,
                "total_kurir" => (int) $totalKurir,
                "total_pendapatan" => (float) $totalPendapatan
            ],
            "status_distribution" => $statusDistribution,
            "monthly_shipments" => $monthlyShipments,
            "recent_shipments" => $recentShipments
        ]);
    }
}