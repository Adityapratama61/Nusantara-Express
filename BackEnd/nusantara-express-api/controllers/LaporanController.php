<?php

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../helpers/response.php";

class LaporanController
{
    public function index()
    {
        global $pdo;

        $jenis = $_GET["jenis"] ?? "bulanan";
        $tanggalMulai = $_GET["tanggal_mulai"] ?? null;
        $tanggalAkhir = $_GET["tanggal_akhir"] ?? null;

        $where = "WHERE 1=1";
        $params = [];

        if ($tanggalMulai && $tanggalAkhir) {
            $where .= " AND DATE(tanggal_pengiriman) BETWEEN :tanggal_mulai AND :tanggal_akhir";
            $params[":tanggal_mulai"] = $tanggalMulai;
            $params[":tanggal_akhir"] = $tanggalAkhir;
        }

        $summaryStmt = $pdo->prepare("
            SELECT 
                COUNT(*) AS total_pengiriman,
                COALESCE(SUM(CASE WHEN status_pengiriman != 'Gagal Kirim' THEN biaya_kirim ELSE 0 END), 0) AS total_pendapatan,
                COUNT(DISTINCT kota_tujuan) AS total_kota,
                COUNT(DISTINCT id_kurir) AS total_kurir
            FROM pengiriman
            $where
        ");

        $summaryStmt->execute($params);
        $summary = $summaryStmt->fetch();

        $pengirimanPerKotaStmt = $pdo->prepare("
            SELECT 
                kota_tujuan AS kota,
                COUNT(*) AS total_pengiriman,
                COALESCE(SUM(biaya_kirim), 0) AS total_pendapatan
            FROM pengiriman
            $where
            GROUP BY kota_tujuan
            ORDER BY total_pengiriman DESC
        ");

        $pengirimanPerKotaStmt->execute($params);
        $pengirimanPerKota = $pengirimanPerKotaStmt->fetchAll();

        $pengirimanPerKurirStmt = $pdo->prepare("
            SELECT 
                k.nama_kurir,
                COUNT(p.id_pengiriman) AS total_pengiriman,
                SUM(CASE WHEN p.status_pengiriman = 'Selesai' THEN 1 ELSE 0 END) AS total_selesai,
                SUM(CASE WHEN p.status_pengiriman = 'Gagal Kirim' THEN 1 ELSE 0 END) AS total_gagal
            FROM pengiriman p
            LEFT JOIN kurir k ON p.id_kurir = k.id_kurir
            $where
            GROUP BY p.id_kurir, k.nama_kurir
            ORDER BY total_pengiriman DESC
        ");

        $pengirimanPerKurirStmt->execute($params);
        $pengirimanPerKurir = $pengirimanPerKurirStmt->fetchAll();

        $formatTanggal = $this->getDateFormat($jenis);

        $grafikStmt = $pdo->prepare("
            SELECT 
                DATE_FORMAT(tanggal_pengiriman, '$formatTanggal') AS periode,
                COUNT(*) AS total_pengiriman,
                COALESCE(SUM(biaya_kirim), 0) AS total_pendapatan
            FROM pengiriman
            $where
            GROUP BY DATE_FORMAT(tanggal_pengiriman, '$formatTanggal')
            ORDER BY periode ASC
        ");

        $grafikStmt->execute($params);
        $grafik = $grafikStmt->fetchAll();

        $detailStmt = $pdo->prepare("
            SELECT 
                p.id_pengiriman,
                p.nomor_resi,
                p.nama_pengirim,
                p.nama_penerima,
                p.kota_asal,
                p.kota_tujuan,
                p.berat_barang,
                p.biaya_kirim,
                p.status_pengiriman,
                p.tanggal_pengiriman,
                k.nama_kurir,
                a.nomor_kendaraan
            FROM pengiriman p
            LEFT JOIN kurir k ON p.id_kurir = k.id_kurir
            LEFT JOIN armada a ON p.id_armada = a.id_armada
            $where
            ORDER BY p.tanggal_pengiriman DESC
        ");

        $detailStmt->execute($params);
        $detail = $detailStmt->fetchAll();

        jsonResponse(true, "Data laporan berhasil diambil", [
            "filter" => [
                "jenis" => $jenis,
                "tanggal_mulai" => $tanggalMulai,
                "tanggal_akhir" => $tanggalAkhir
            ],
            "summary" => [
                "total_pengiriman" => (int) $summary["total_pengiriman"],
                "total_pendapatan" => (float) $summary["total_pendapatan"],
                "total_kota" => (int) $summary["total_kota"],
                "total_kurir" => (int) $summary["total_kurir"]
            ],
            "grafik" => $grafik,
            "pengiriman_per_kota" => $pengirimanPerKota,
            "pengiriman_per_kurir" => $pengirimanPerKurir,
            "detail" => $detail
        ]);
    }

    private function getDateFormat($jenis)
    {
        switch ($jenis) {
            case "harian":
                return "%Y-%m-%d";
            case "tahunan":
                return "%Y";
            case "bulanan":
            default:
                return "%Y-%m";
        }
    }
}