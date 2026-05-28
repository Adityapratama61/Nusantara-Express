<?php

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../helpers/response.php";

class TarifOngkirController
{
    public function index()
    {
        global $pdo;

        $search = $_GET["search"] ?? "";

        if ($search !== "") {
            $stmt = $pdo->prepare("
                SELECT *
                FROM tarif_ongkir
                WHERE 
                    kode_tarif LIKE :search OR
                    kota_asal LIKE :search OR
                    kota_tujuan LIKE :search OR
                    layanan LIKE :search OR
                    status LIKE :search
                ORDER BY id_tarif DESC
            ");

            $stmt->execute([
                ":search" => "%" . $search . "%"
            ]);
        } else {
            $stmt = $pdo->query("
                SELECT *
                FROM tarif_ongkir
                ORDER BY id_tarif DESC
            ");
        }

        $data = $stmt->fetchAll();

        jsonResponse(true, "Data tarif ongkir berhasil diambil", $data);
    }

    public function show($id)
    {
        global $pdo;

        $stmt = $pdo->prepare("
            SELECT *
            FROM tarif_ongkir
            WHERE id_tarif = :id
            LIMIT 1
        ");

        $stmt->execute([
            ":id" => $id
        ]);

        $data = $stmt->fetch();

        if (!$data) {
            jsonResponse(false, "Data tarif ongkir tidak ditemukan", null, 404);
        }

        jsonResponse(true, "Detail tarif ongkir berhasil diambil", $data);
    }

    public function store()
    {
        global $pdo;

        $input = getJsonInput();

        $kota_asal = trim($input["kota_asal"] ?? "");
        $kota_tujuan = trim($input["kota_tujuan"] ?? "");
        $layanan = trim($input["layanan"] ?? "reguler");
        $tarif_per_kg = trim($input["tarif_per_kg"] ?? "");
        $estimasi = trim($input["estimasi"] ?? "");
        $status = trim($input["status"] ?? "aktif");

        if ($kota_asal === "" || $kota_tujuan === "" || $tarif_per_kg === "" || $estimasi === "") {
            jsonResponse(false, "Kota asal, kota tujuan, tarif per kg, dan estimasi wajib diisi", null, 400);
        }

        if (!in_array($layanan, ["reguler", "express", "cargo"])) {
            jsonResponse(false, "Layanan tidak valid", null, 400);
        }

        if (!in_array($status, ["aktif", "nonaktif"])) {
            jsonResponse(false, "Status tidak valid", null, 400);
        }

        if (!is_numeric($tarif_per_kg) || $tarif_per_kg <= 0) {
            jsonResponse(false, "Tarif per kg harus berupa angka lebih dari 0", null, 400);
        }

        $duplicate = $pdo->prepare("
            SELECT id_tarif
            FROM tarif_ongkir
            WHERE kota_asal = :kota_asal
            AND kota_tujuan = :kota_tujuan
            AND layanan = :layanan
            LIMIT 1
        ");

        $duplicate->execute([
            ":kota_asal" => $kota_asal,
            ":kota_tujuan" => $kota_tujuan,
            ":layanan" => $layanan
        ]);

        if ($duplicate->fetch()) {
            jsonResponse(false, "Tarif untuk rute dan layanan ini sudah ada", null, 409);
        }

        $kode_tarif = $this->generateKodeTarif();

        $stmt = $pdo->prepare("
            INSERT INTO tarif_ongkir
            (
                kode_tarif,
                kota_asal,
                kota_tujuan,
                layanan,
                tarif_per_kg,
                estimasi,
                status
            )
            VALUES
            (
                :kode_tarif,
                :kota_asal,
                :kota_tujuan,
                :layanan,
                :tarif_per_kg,
                :estimasi,
                :status
            )
        ");

        $stmt->execute([
            ":kode_tarif" => $kode_tarif,
            ":kota_asal" => $kota_asal,
            ":kota_tujuan" => $kota_tujuan,
            ":layanan" => $layanan,
            ":tarif_per_kg" => $tarif_per_kg,
            ":estimasi" => $estimasi,
            ":status" => $status
        ]);

        jsonResponse(true, "Data tarif ongkir berhasil ditambahkan", [
            "id_tarif" => $pdo->lastInsertId(),
            "kode_tarif" => $kode_tarif
        ], 201);
    }

    public function update($id)
    {
        global $pdo;

        $input = getJsonInput();

        $check = $pdo->prepare("
            SELECT *
            FROM tarif_ongkir
            WHERE id_tarif = :id
            LIMIT 1
        ");

        $check->execute([
            ":id" => $id
        ]);

        $oldData = $check->fetch();

        if (!$oldData) {
            jsonResponse(false, "Data tarif ongkir tidak ditemukan", null, 404);
        }

        $kota_asal = trim($input["kota_asal"] ?? $oldData["kota_asal"]);
        $kota_tujuan = trim($input["kota_tujuan"] ?? $oldData["kota_tujuan"]);
        $layanan = trim($input["layanan"] ?? $oldData["layanan"]);
        $tarif_per_kg = trim($input["tarif_per_kg"] ?? $oldData["tarif_per_kg"]);
        $estimasi = trim($input["estimasi"] ?? $oldData["estimasi"]);
        $status = trim($input["status"] ?? $oldData["status"]);

        if ($kota_asal === "" || $kota_tujuan === "" || $tarif_per_kg === "" || $estimasi === "") {
            jsonResponse(false, "Kota asal, kota tujuan, tarif per kg, dan estimasi wajib diisi", null, 400);
        }

        if (!in_array($layanan, ["reguler", "express", "cargo"])) {
            jsonResponse(false, "Layanan tidak valid", null, 400);
        }

        if (!in_array($status, ["aktif", "nonaktif"])) {
            jsonResponse(false, "Status tidak valid", null, 400);
        }

        if (!is_numeric($tarif_per_kg) || $tarif_per_kg <= 0) {
            jsonResponse(false, "Tarif per kg harus berupa angka lebih dari 0", null, 400);
        }

        $duplicate = $pdo->prepare("
            SELECT id_tarif
            FROM tarif_ongkir
            WHERE kota_asal = :kota_asal
            AND kota_tujuan = :kota_tujuan
            AND layanan = :layanan
            AND id_tarif != :id
            LIMIT 1
        ");

        $duplicate->execute([
            ":kota_asal" => $kota_asal,
            ":kota_tujuan" => $kota_tujuan,
            ":layanan" => $layanan,
            ":id" => $id
        ]);

        if ($duplicate->fetch()) {
            jsonResponse(false, "Tarif untuk rute dan layanan ini sudah digunakan data lain", null, 409);
        }

        $stmt = $pdo->prepare("
            UPDATE tarif_ongkir
            SET
                kota_asal = :kota_asal,
                kota_tujuan = :kota_tujuan,
                layanan = :layanan,
                tarif_per_kg = :tarif_per_kg,
                estimasi = :estimasi,
                status = :status
            WHERE id_tarif = :id
        ");

        $stmt->execute([
            ":kota_asal" => $kota_asal,
            ":kota_tujuan" => $kota_tujuan,
            ":layanan" => $layanan,
            ":tarif_per_kg" => $tarif_per_kg,
            ":estimasi" => $estimasi,
            ":status" => $status,
            ":id" => $id
        ]);

        jsonResponse(true, "Data tarif ongkir berhasil diperbarui");
    }

    public function destroy($id)
    {
        global $pdo;

        $check = $pdo->prepare("
            SELECT id_tarif
            FROM tarif_ongkir
            WHERE id_tarif = :id
            LIMIT 1
        ");

        $check->execute([
            ":id" => $id
        ]);

        if (!$check->fetch()) {
            jsonResponse(false, "Data tarif ongkir tidak ditemukan", null, 404);
        }

        $stmt = $pdo->prepare("
            DELETE FROM tarif_ongkir
            WHERE id_tarif = :id
        ");

        $stmt->execute([
            ":id" => $id
        ]);

        jsonResponse(true, "Data tarif ongkir berhasil dihapus");
    }

    public function cekOngkir()
    {
        global $pdo;

        $kota_asal = trim($_GET["kota_asal"] ?? "");
        $kota_tujuan = trim($_GET["kota_tujuan"] ?? "");
        $berat = trim($_GET["berat"] ?? "");
        $layanan = trim($_GET["layanan"] ?? "");

        if ($kota_asal === "" || $kota_tujuan === "" || $berat === "") {
            jsonResponse(false, "Kota asal, kota tujuan, dan berat wajib diisi", null, 400);
        }

        if (!is_numeric($berat) || $berat <= 0) {
            jsonResponse(false, "Berat harus berupa angka lebih dari 0", null, 400);
        }

        $query = "
            SELECT *
            FROM tarif_ongkir
            WHERE kota_asal = :kota_asal
            AND kota_tujuan = :kota_tujuan
            AND status = 'aktif'
        ";

        $params = [
            ":kota_asal" => $kota_asal,
            ":kota_tujuan" => $kota_tujuan
        ];

        if ($layanan !== "") {
            $query .= " AND layanan = :layanan";
            $params[":layanan"] = $layanan;
        }

        $stmt = $pdo->prepare($query);
        $stmt->execute($params);

        $tarif = $stmt->fetchAll();

        if (!$tarif) {
            jsonResponse(false, "Tarif ongkir tidak ditemukan", null, 404);
        }

        $result = array_map(function ($item) use ($berat) {
            $item["berat"] = (float) $berat;
            $item["total_biaya"] = (float) $item["tarif_per_kg"] * (float) $berat;
            return $item;
        }, $tarif);

        jsonResponse(true, "Estimasi ongkir berhasil dihitung", $result);
    }

    private function generateKodeTarif()
    {
        global $pdo;

        $stmt = $pdo->query("
            SELECT kode_tarif
            FROM tarif_ongkir
            ORDER BY id_tarif DESC
            LIMIT 1
        ");

        $last = $stmt->fetch();

        if (!$last) {
            return "TRF-001";
        }

        $lastNumber = (int) str_replace("TRF-", "", $last["kode_tarif"]);
        $newNumber = $lastNumber + 1;

        return "TRF-" . str_pad($newNumber, 3, "0", STR_PAD_LEFT);
    }
}