<?php

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../helpers/response.php";

class PengirimanController
{
    private $validStatuses = [
        "Menunggu Pickup",
        "Dalam Perjalanan",
        "Transit",
        "Sampai Tujuan",
        "Selesai",
        "Gagal Kirim"
    ];

    public function index()
    {
        global $pdo;

        $search = $_GET["search"] ?? "";

        $query = "
            SELECT 
                p.*,
                pl.nama_pelanggan,
                k.nama_kurir,
                a.nomor_kendaraan
            FROM pengiriman p
            LEFT JOIN pelanggan pl ON p.id_pelanggan = pl.id_pelanggan
            LEFT JOIN kurir k ON p.id_kurir = k.id_kurir
            LEFT JOIN armada a ON p.id_armada = a.id_armada
        ";

        if ($search !== "") {
            $query .= "
                WHERE 
                    p.nomor_resi LIKE :search OR
                    p.nama_pengirim LIKE :search OR
                    p.nama_penerima LIKE :search OR
                    p.kota_asal LIKE :search OR
                    p.kota_tujuan LIKE :search OR
                    p.status_pengiriman LIKE :search
            ";
        }

        $query .= " ORDER BY p.id_pengiriman DESC";

        $stmt = $pdo->prepare($query);

        if ($search !== "") {
            $stmt->execute([
                ":search" => "%" . $search . "%"
            ]);
        } else {
            $stmt->execute();
        }

        jsonResponse(true, "Data pengiriman berhasil diambil", $stmt->fetchAll());
    }

    public function show($id)
    {
        global $pdo;

        $stmt = $pdo->prepare("
            SELECT 
                p.*,
                pl.nama_pelanggan,
                k.nama_kurir,
                k.no_telepon AS telepon_kurir,
                a.nomor_kendaraan,
                a.jenis_kendaraan,
                a.kapasitas
            FROM pengiriman p
            LEFT JOIN pelanggan pl ON p.id_pelanggan = pl.id_pelanggan
            LEFT JOIN kurir k ON p.id_kurir = k.id_kurir
            LEFT JOIN armada a ON p.id_armada = a.id_armada
            WHERE p.id_pengiriman = :id
            LIMIT 1
        ");

        $stmt->execute([
            ":id" => $id
        ]);

        $pengiriman = $stmt->fetch();

        if (!$pengiriman) {
            jsonResponse(false, "Data pengiriman tidak ditemukan", null, 404);
        }

        $tracking = $pdo->prepare("
            SELECT *
            FROM tracking_pengiriman
            WHERE id_pengiriman = :id
            ORDER BY waktu_update ASC
        ");

        $tracking->execute([
            ":id" => $id
        ]);

        $pengiriman["tracking"] = $tracking->fetchAll();

        jsonResponse(true, "Detail pengiriman berhasil diambil", $pengiriman);
    }

    public function store()
    {
        global $pdo;

        $input = getJsonInput();

        $id_pelanggan = $input["id_pelanggan"] ?? null;
        $id_kurir = $input["id_kurir"] ?? null;
        $id_armada = $input["id_armada"] ?? null;
        $id_tarif = $input["id_tarif"] ?? null;

        $nama_pengirim = trim($input["nama_pengirim"] ?? "");
        $telepon_pengirim = trim($input["telepon_pengirim"] ?? "");
        $alamat_pengirim = trim($input["alamat_pengirim"] ?? "");

        $nama_penerima = trim($input["nama_penerima"] ?? "");
        $telepon_penerima = trim($input["telepon_penerima"] ?? "");
        $alamat_penerima = trim($input["alamat_penerima"] ?? "");

        $kota_asal = trim($input["kota_asal"] ?? "");
        $kota_tujuan = trim($input["kota_tujuan"] ?? "");
        $berat_barang = $input["berat_barang"] ?? "";
        $jenis_barang = trim($input["jenis_barang"] ?? "");
        $layanan = trim($input["layanan"] ?? "reguler");
        $biaya_kirim = $input["biaya_kirim"] ?? null;
        $status_pengiriman = trim($input["status_pengiriman"] ?? "Menunggu Pickup");
        $estimasi_tiba = trim($input["estimasi_tiba"] ?? "");
        $catatan = trim($input["catatan"] ?? "");

        if (
            $nama_pengirim === "" ||
            $telepon_pengirim === "" ||
            $alamat_pengirim === "" ||
            $nama_penerima === "" ||
            $telepon_penerima === "" ||
            $alamat_penerima === "" ||
            $kota_asal === "" ||
            $kota_tujuan === "" ||
            $berat_barang === "" ||
            $jenis_barang === ""
        ) {
            jsonResponse(false, "Data pengirim, penerima, kota, berat, dan jenis barang wajib diisi", null, 400);
        }

        if (!is_numeric($berat_barang) || $berat_barang <= 0) {
            jsonResponse(false, "Berat barang harus berupa angka lebih dari 0", null, 400);
        }

        if (!in_array($layanan, ["reguler", "express", "cargo"])) {
            jsonResponse(false, "Layanan tidak valid", null, 400);
        }

        if (!in_array($status_pengiriman, $this->validStatuses)) {
            jsonResponse(false, "Status pengiriman tidak valid", null, 400);
        }

        if ($id_tarif) {
            $tarifStmt = $pdo->prepare("
                SELECT *
                FROM tarif_ongkir
                WHERE id_tarif = :id_tarif
                LIMIT 1
            ");

            $tarifStmt->execute([
                ":id_tarif" => $id_tarif
            ]);

            $tarif = $tarifStmt->fetch();

            if (!$tarif) {
                jsonResponse(false, "Tarif ongkir tidak ditemukan", null, 404);
            }

            $layanan = $tarif["layanan"];
            $biaya_kirim = (float) $tarif["tarif_per_kg"] * (float) $berat_barang;
            $estimasi_tiba = $estimasi_tiba ?: $tarif["estimasi"];
        }

        if ($biaya_kirim === null || $biaya_kirim === "") {
            jsonResponse(false, "Biaya kirim wajib diisi jika tidak menggunakan id_tarif", null, 400);
        }

        if (!is_numeric($biaya_kirim) || $biaya_kirim < 0) {
            jsonResponse(false, "Biaya kirim harus berupa angka valid", null, 400);
        }

        try {
            $pdo->beginTransaction();

            $nomor_resi = $this->generateNomorResi();

            $stmt = $pdo->prepare("
                INSERT INTO pengiriman
                (
                    nomor_resi,
                    id_pelanggan,
                    id_kurir,
                    id_armada,
                    id_tarif,
                    nama_pengirim,
                    telepon_pengirim,
                    alamat_pengirim,
                    nama_penerima,
                    telepon_penerima,
                    alamat_penerima,
                    kota_asal,
                    kota_tujuan,
                    berat_barang,
                    jenis_barang,
                    layanan,
                    biaya_kirim,
                    status_pengiriman,
                    estimasi_tiba,
                    catatan
                )
                VALUES
                (
                    :nomor_resi,
                    :id_pelanggan,
                    :id_kurir,
                    :id_armada,
                    :id_tarif,
                    :nama_pengirim,
                    :telepon_pengirim,
                    :alamat_pengirim,
                    :nama_penerima,
                    :telepon_penerima,
                    :alamat_penerima,
                    :kota_asal,
                    :kota_tujuan,
                    :berat_barang,
                    :jenis_barang,
                    :layanan,
                    :biaya_kirim,
                    :status_pengiriman,
                    :estimasi_tiba,
                    :catatan
                )
            ");

            $stmt->execute([
                ":nomor_resi" => $nomor_resi,
                ":id_pelanggan" => $id_pelanggan ?: null,
                ":id_kurir" => $id_kurir ?: null,
                ":id_armada" => $id_armada ?: null,
                ":id_tarif" => $id_tarif ?: null,
                ":nama_pengirim" => $nama_pengirim,
                ":telepon_pengirim" => $telepon_pengirim,
                ":alamat_pengirim" => $alamat_pengirim,
                ":nama_penerima" => $nama_penerima,
                ":telepon_penerima" => $telepon_penerima,
                ":alamat_penerima" => $alamat_penerima,
                ":kota_asal" => $kota_asal,
                ":kota_tujuan" => $kota_tujuan,
                ":berat_barang" => $berat_barang,
                ":jenis_barang" => $jenis_barang,
                ":layanan" => $layanan,
                ":biaya_kirim" => $biaya_kirim,
                ":status_pengiriman" => $status_pengiriman,
                ":estimasi_tiba" => $estimasi_tiba,
                ":catatan" => $catatan
            ]);

            $id_pengiriman = $pdo->lastInsertId();

            $tracking = $pdo->prepare("
                INSERT INTO tracking_pengiriman
                (
                    id_pengiriman,
                    status_tracking,
                    lokasi,
                    keterangan
                )
                VALUES
                (
                    :id_pengiriman,
                    :status_tracking,
                    :lokasi,
                    :keterangan
                )
            ");

            $tracking->execute([
                ":id_pengiriman" => $id_pengiriman,
                ":status_tracking" => $status_pengiriman,
                ":lokasi" => $kota_asal,
                ":keterangan" => "Data pengiriman dibuat."
            ]);

            $pdo->commit();

            jsonResponse(true, "Data pengiriman berhasil ditambahkan", [
                "id_pengiriman" => $id_pengiriman,
                "nomor_resi" => $nomor_resi,
                "biaya_kirim" => (float) $biaya_kirim
            ], 201);
        } catch (Exception $e) {
            $pdo->rollBack();

            jsonResponse(false, "Gagal menambahkan data pengiriman", [
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function update($id)
    {
        global $pdo;

        $input = getJsonInput();

        $check = $pdo->prepare("
            SELECT *
            FROM pengiriman
            WHERE id_pengiriman = :id
            LIMIT 1
        ");

        $check->execute([
            ":id" => $id
        ]);

        $oldData = $check->fetch();

        if (!$oldData) {
            jsonResponse(false, "Data pengiriman tidak ditemukan", null, 404);
        }

        $nama_pengirim = trim($input["nama_pengirim"] ?? $oldData["nama_pengirim"]);
        $telepon_pengirim = trim($input["telepon_pengirim"] ?? $oldData["telepon_pengirim"]);
        $alamat_pengirim = trim($input["alamat_pengirim"] ?? $oldData["alamat_pengirim"]);
        $nama_penerima = trim($input["nama_penerima"] ?? $oldData["nama_penerima"]);
        $telepon_penerima = trim($input["telepon_penerima"] ?? $oldData["telepon_penerima"]);
        $alamat_penerima = trim($input["alamat_penerima"] ?? $oldData["alamat_penerima"]);
        $kota_asal = trim($input["kota_asal"] ?? $oldData["kota_asal"]);
        $kota_tujuan = trim($input["kota_tujuan"] ?? $oldData["kota_tujuan"]);
        $berat_barang = $input["berat_barang"] ?? $oldData["berat_barang"];
        $jenis_barang = trim($input["jenis_barang"] ?? $oldData["jenis_barang"]);
        $layanan = trim($input["layanan"] ?? $oldData["layanan"]);
        $biaya_kirim = $input["biaya_kirim"] ?? $oldData["biaya_kirim"];
        $estimasi_tiba = trim($input["estimasi_tiba"] ?? $oldData["estimasi_tiba"]);
        $catatan = trim($input["catatan"] ?? $oldData["catatan"]);

        if (!is_numeric($berat_barang) || $berat_barang <= 0) {
            jsonResponse(false, "Berat barang harus berupa angka lebih dari 0", null, 400);
        }

        if (!is_numeric($biaya_kirim) || $biaya_kirim < 0) {
            jsonResponse(false, "Biaya kirim harus berupa angka valid", null, 400);
        }

        if (!in_array($layanan, ["reguler", "express", "cargo"])) {
            jsonResponse(false, "Layanan tidak valid", null, 400);
        }

        $stmt = $pdo->prepare("
            UPDATE pengiriman
            SET
                id_pelanggan = :id_pelanggan,
                id_kurir = :id_kurir,
                id_armada = :id_armada,
                id_tarif = :id_tarif,
                nama_pengirim = :nama_pengirim,
                telepon_pengirim = :telepon_pengirim,
                alamat_pengirim = :alamat_pengirim,
                nama_penerima = :nama_penerima,
                telepon_penerima = :telepon_penerima,
                alamat_penerima = :alamat_penerima,
                kota_asal = :kota_asal,
                kota_tujuan = :kota_tujuan,
                berat_barang = :berat_barang,
                jenis_barang = :jenis_barang,
                layanan = :layanan,
                biaya_kirim = :biaya_kirim,
                estimasi_tiba = :estimasi_tiba,
                catatan = :catatan
            WHERE id_pengiriman = :id
        ");

        $stmt->execute([
            ":id_pelanggan" => $input["id_pelanggan"] ?? $oldData["id_pelanggan"],
            ":id_kurir" => $input["id_kurir"] ?? $oldData["id_kurir"],
            ":id_armada" => $input["id_armada"] ?? $oldData["id_armada"],
            ":id_tarif" => $input["id_tarif"] ?? $oldData["id_tarif"],
            ":nama_pengirim" => $nama_pengirim,
            ":telepon_pengirim" => $telepon_pengirim,
            ":alamat_pengirim" => $alamat_pengirim,
            ":nama_penerima" => $nama_penerima,
            ":telepon_penerima" => $telepon_penerima,
            ":alamat_penerima" => $alamat_penerima,
            ":kota_asal" => $kota_asal,
            ":kota_tujuan" => $kota_tujuan,
            ":berat_barang" => $berat_barang,
            ":jenis_barang" => $jenis_barang,
            ":layanan" => $layanan,
            ":biaya_kirim" => $biaya_kirim,
            ":estimasi_tiba" => $estimasi_tiba,
            ":catatan" => $catatan,
            ":id" => $id
        ]);

        jsonResponse(true, "Data pengiriman berhasil diperbarui");
    }

    public function updateStatus($id)
    {
        global $pdo;

        $input = getJsonInput();

        $status = trim($input["status"] ?? "");
        $lokasi = trim($input["lokasi"] ?? "");
        $keterangan = trim($input["keterangan"] ?? "");

        if ($status === "" || $lokasi === "") {
            jsonResponse(false, "Status dan lokasi wajib diisi", null, 400);
        }

        if (!in_array($status, $this->validStatuses)) {
            jsonResponse(false, "Status pengiriman tidak valid", null, 400);
        }

        $check = $pdo->prepare("
            SELECT *
            FROM pengiriman
            WHERE id_pengiriman = :id
            LIMIT 1
        ");

        $check->execute([
            ":id" => $id
        ]);

        $pengiriman = $check->fetch();

        if (!$pengiriman) {
            jsonResponse(false, "Data pengiriman tidak ditemukan", null, 404);
        }

        try {
            $pdo->beginTransaction();

            $update = $pdo->prepare("
                UPDATE pengiriman
                SET status_pengiriman = :status
                WHERE id_pengiriman = :id
            ");

            $update->execute([
                ":status" => $status,
                ":id" => $id
            ]);

            $tracking = $pdo->prepare("
                INSERT INTO tracking_pengiriman
                (
                    id_pengiriman,
                    status_tracking,
                    lokasi,
                    keterangan
                )
                VALUES
                (
                    :id_pengiriman,
                    :status_tracking,
                    :lokasi,
                    :keterangan
                )
            ");

            $tracking->execute([
                ":id_pengiriman" => $id,
                ":status_tracking" => $status,
                ":lokasi" => $lokasi,
                ":keterangan" => $keterangan
            ]);

            $pdo->commit();

            jsonResponse(true, "Status pengiriman berhasil diperbarui");
        } catch (Exception $e) {
            $pdo->rollBack();

            jsonResponse(false, "Gagal memperbarui status pengiriman", [
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        global $pdo;

        $check = $pdo->prepare("
            SELECT id_pengiriman
            FROM pengiriman
            WHERE id_pengiriman = :id
            LIMIT 1
        ");

        $check->execute([
            ":id" => $id
        ]);

        if (!$check->fetch()) {
            jsonResponse(false, "Data pengiriman tidak ditemukan", null, 404);
        }

        $stmt = $pdo->prepare("
            DELETE FROM pengiriman
            WHERE id_pengiriman = :id
        ");

        $stmt->execute([
            ":id" => $id
        ]);

        jsonResponse(true, "Data pengiriman berhasil dihapus");
    }

    public function trackingByResi($nomorResi)
    {
        global $pdo;

        $stmt = $pdo->prepare("
            SELECT 
                p.*,
                k.nama_kurir,
                k.no_telepon AS telepon_kurir,
                a.nomor_kendaraan
            FROM pengiriman p
            LEFT JOIN kurir k ON p.id_kurir = k.id_kurir
            LEFT JOIN armada a ON p.id_armada = a.id_armada
            WHERE p.nomor_resi = :nomor_resi
            LIMIT 1
        ");

        $stmt->execute([
            ":nomor_resi" => $nomorResi
        ]);

        $pengiriman = $stmt->fetch();

        if (!$pengiriman) {
            jsonResponse(false, "Nomor resi tidak ditemukan", null, 404);
        }

        $tracking = $pdo->prepare("
            SELECT *
            FROM tracking_pengiriman
            WHERE id_pengiriman = :id_pengiriman
            ORDER BY waktu_update ASC
        ");

        $tracking->execute([
            ":id_pengiriman" => $pengiriman["id_pengiriman"]
        ]);

        $pengiriman["tracking"] = $tracking->fetchAll();

        jsonResponse(true, "Data tracking berhasil diambil", $pengiriman);
    }

    private function generateNomorResi()
    {
        global $pdo;

        $prefix = "NX-" . date("Ymd") . "-";

        $stmt = $pdo->prepare("
            SELECT nomor_resi
            FROM pengiriman
            WHERE nomor_resi LIKE :prefix
            ORDER BY id_pengiriman DESC
            LIMIT 1
        ");

        $stmt->execute([
            ":prefix" => $prefix . "%"
        ]);

        $last = $stmt->fetch();

        if (!$last) {
            return $prefix . "001";
        }

        $lastNumber = (int) substr($last["nomor_resi"], -3);
        $newNumber = $lastNumber + 1;

        return $prefix . str_pad($newNumber, 3, "0", STR_PAD_LEFT);
    }
}