<?php

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../helpers/response.php";

class UserController
{
    private function getPelangganByUserId($idUser)
    {
        global $pdo;

        $stmt = $pdo->prepare("
            SELECT 
                u.id_user,
                u.nama_lengkap,
                u.username,
                u.email AS email_user,
                u.role,
                u.status AS status_user,
                p.id_pelanggan,
                p.kode_pelanggan,
                p.nama_pelanggan,
                p.no_telepon,
                p.email AS email_pelanggan,
                p.alamat,
                p.kota,
                p.tipe_pelanggan,
                p.status AS status_pelanggan
            FROM users u
            LEFT JOIN pelanggan p ON u.id_user = p.id_user
            WHERE u.id_user = :id_user
            LIMIT 1
        ");

        $stmt->execute([
            ":id_user" => $idUser
        ]);

        return $stmt->fetch();
    }

    public function dashboard($idUser)
    {
        global $pdo;

        $profile = $this->getPelangganByUserId($idUser);

        if (!$profile) {
            jsonResponse(false, "User tidak ditemukan", null, 404);
        }

        if (!$profile["id_pelanggan"]) {
            jsonResponse(true, "Dashboard user berhasil diambil", [
                "profile" => $profile,
                "summary" => [
                    "total_pengiriman" => 0,
                    "dalam_proses" => 0,
                    "selesai" => 0,
                    "gagal" => 0
                ],
                "recent_pengiriman" => [],
                "notifikasi" => []
            ]);
        }

        $idPelanggan = $profile["id_pelanggan"];

        $totalPengiriman = $pdo->prepare("
            SELECT COUNT(*) AS total
            FROM pengiriman
            WHERE id_pelanggan = :id_pelanggan
        ");
        $totalPengiriman->execute([":id_pelanggan" => $idPelanggan]);

        $dalamProses = $pdo->prepare("
            SELECT COUNT(*) AS total
            FROM pengiriman
            WHERE id_pelanggan = :id_pelanggan
            AND status_pengiriman IN ('Menunggu Pickup', 'Dalam Perjalanan', 'Transit', 'Sampai Tujuan')
        ");
        $dalamProses->execute([":id_pelanggan" => $idPelanggan]);

        $selesai = $pdo->prepare("
            SELECT COUNT(*) AS total
            FROM pengiriman
            WHERE id_pelanggan = :id_pelanggan
            AND status_pengiriman = 'Selesai'
        ");
        $selesai->execute([":id_pelanggan" => $idPelanggan]);

        $gagal = $pdo->prepare("
            SELECT COUNT(*) AS total
            FROM pengiriman
            WHERE id_pelanggan = :id_pelanggan
            AND status_pengiriman = 'Gagal Kirim'
        ");
        $gagal->execute([":id_pelanggan" => $idPelanggan]);

        $recent = $pdo->prepare("
            SELECT 
                p.id_pengiriman,
                p.nomor_resi,
                p.nama_pengirim,
                p.nama_penerima,
                p.kota_asal,
                p.kota_tujuan,
                p.berat_barang,
                p.jenis_barang,
                p.layanan,
                p.biaya_kirim,
                p.status_pengiriman,
                p.estimasi_tiba,
                p.tanggal_pengiriman,
                k.nama_kurir,
                a.nomor_kendaraan
            FROM pengiriman p
            LEFT JOIN kurir k ON p.id_kurir = k.id_kurir
            LEFT JOIN armada a ON p.id_armada = a.id_armada
            WHERE p.id_pelanggan = :id_pelanggan
            ORDER BY p.id_pengiriman DESC
            LIMIT 5
        ");
        $recent->execute([":id_pelanggan" => $idPelanggan]);

        $notifikasi = $pdo->prepare("
            SELECT *
            FROM notifikasi
            WHERE id_user = :id_user
            ORDER BY id_notifikasi DESC
            LIMIT 5
        ");
        $notifikasi->execute([":id_user" => $idUser]);

        jsonResponse(true, "Dashboard user berhasil diambil", [
            "profile" => $profile,
            "summary" => [
                "total_pengiriman" => (int) $totalPengiriman->fetch()["total"],
                "dalam_proses" => (int) $dalamProses->fetch()["total"],
                "selesai" => (int) $selesai->fetch()["total"],
                "gagal" => (int) $gagal->fetch()["total"]
            ],
            "recent_pengiriman" => $recent->fetchAll(),
            "notifikasi" => $notifikasi->fetchAll()
        ]);
    }

    public function pengiriman($idUser)
    {
        global $pdo;

        $profile = $this->getPelangganByUserId($idUser);

        if (!$profile) {
            jsonResponse(false, "User tidak ditemukan", null, 404);
        }

        if (!$profile["id_pelanggan"]) {
            jsonResponse(true, "Data pengiriman user berhasil diambil", []);
        }

        $search = $_GET["search"] ?? "";

        $query = "
            SELECT 
                p.id_pengiriman,
                p.nomor_resi,
                p.nama_pengirim,
                p.nama_penerima,
                p.kota_asal,
                p.kota_tujuan,
                p.berat_barang,
                p.jenis_barang,
                p.layanan,
                p.biaya_kirim,
                p.status_pengiriman,
                p.estimasi_tiba,
                p.tanggal_pengiriman,
                k.nama_kurir,
                a.nomor_kendaraan
            FROM pengiriman p
            LEFT JOIN kurir k ON p.id_kurir = k.id_kurir
            LEFT JOIN armada a ON p.id_armada = a.id_armada
            WHERE p.id_pelanggan = :id_pelanggan
        ";

        $params = [
            ":id_pelanggan" => $profile["id_pelanggan"]
        ];

        if ($search !== "") {
            $query .= "
                AND (
                    p.nomor_resi LIKE :search OR
                    p.nama_penerima LIKE :search OR
                    p.kota_tujuan LIKE :search OR
                    p.status_pengiriman LIKE :search
                )
            ";

            $params[":search"] = "%" . $search . "%";
        }

        $query .= " ORDER BY p.id_pengiriman DESC";

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        jsonResponse(true, "Data pengiriman user berhasil diambil", $stmt->fetchAll());
    }

    public function detailPengiriman($idUser, $idPengiriman)
    {
        global $pdo;

        $profile = $this->getPelangganByUserId($idUser);

        if (!$profile) {
            jsonResponse(false, "User tidak ditemukan", null, 404);
        }

        if (!$profile["id_pelanggan"]) {
            jsonResponse(false, "Data pelanggan tidak ditemukan untuk user ini", null, 404);
        }

        $stmt = $pdo->prepare("
            SELECT 
                p.*,
                k.nama_kurir,
                k.no_telepon AS telepon_kurir,
                a.nomor_kendaraan,
                a.jenis_kendaraan,
                a.kapasitas
            FROM pengiriman p
            LEFT JOIN kurir k ON p.id_kurir = k.id_kurir
            LEFT JOIN armada a ON p.id_armada = a.id_armada
            WHERE p.id_pengiriman = :id_pengiriman
            AND p.id_pelanggan = :id_pelanggan
            LIMIT 1
        ");

        $stmt->execute([
            ":id_pengiriman" => $idPengiriman,
            ":id_pelanggan" => $profile["id_pelanggan"]
        ]);

        $pengiriman = $stmt->fetch();

        if (!$pengiriman) {
            jsonResponse(false, "Detail pengiriman tidak ditemukan", null, 404);
        }

        $tracking = $pdo->prepare("
            SELECT *
            FROM tracking_pengiriman
            WHERE id_pengiriman = :id_pengiriman
            ORDER BY waktu_update ASC
        ");

        $tracking->execute([
            ":id_pengiriman" => $idPengiriman
        ]);

        $pengiriman["tracking"] = $tracking->fetchAll();

        jsonResponse(true, "Detail pengiriman user berhasil diambil", $pengiriman);
    }

    public function notifikasi($idUser)
    {
        global $pdo;

        $stmt = $pdo->prepare("
            SELECT 
                n.*,
                p.nomor_resi,
                p.status_pengiriman
            FROM notifikasi n
            LEFT JOIN pengiriman p ON n.id_pengiriman = p.id_pengiriman
            WHERE n.id_user = :id_user
            ORDER BY n.id_notifikasi DESC
        ");

        $stmt->execute([
            ":id_user" => $idUser
        ]);

        jsonResponse(true, "Data notifikasi berhasil diambil", $stmt->fetchAll());
    }
}