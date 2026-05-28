<?php

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../helpers/response.php";

class ArmadaController
{
    public function index()
    {
        global $pdo;

        $search = $_GET["search"] ?? "";

        if ($search !== "") {
            $stmt = $pdo->prepare("
                SELECT *
                FROM armada
                WHERE 
                    nomor_kendaraan LIKE :search OR
                    jenis_kendaraan LIKE :search OR
                    kapasitas LIKE :search OR
                    sopir LIKE :search OR
                    status_armada LIKE :search OR
                    rute_aktif LIKE :search
                ORDER BY id_armada DESC
            ");

            $stmt->execute([
                ":search" => "%" . $search . "%"
            ]);
        } else {
            $stmt = $pdo->query("
                SELECT *
                FROM armada
                ORDER BY id_armada DESC
            ");
        }

        $data = $stmt->fetchAll();

        jsonResponse(true, "Data armada berhasil diambil", $data);
    }

    public function show($id)
    {
        global $pdo;

        $stmt = $pdo->prepare("
            SELECT *
            FROM armada
            WHERE id_armada = :id
            LIMIT 1
        ");

        $stmt->execute([
            ":id" => $id
        ]);

        $data = $stmt->fetch();

        if (!$data) {
            jsonResponse(false, "Data armada tidak ditemukan", null, 404);
        }

        jsonResponse(true, "Detail armada berhasil diambil", $data);
    }

    public function store()
    {
        global $pdo;

        $input = getJsonInput();

        $nomor_kendaraan = strtoupper(trim($input["nomor_kendaraan"] ?? ""));
        $jenis_kendaraan = trim($input["jenis_kendaraan"] ?? "");
        $kapasitas = trim($input["kapasitas"] ?? "");
        $sopir = trim($input["sopir"] ?? "");
        $status_armada = trim($input["status_armada"] ?? "tersedia");
        $bahan_bakar = trim($input["bahan_bakar"] ?? "");
        $rute_aktif = trim($input["rute_aktif"] ?? "");

        if ($nomor_kendaraan === "" || $jenis_kendaraan === "" || $kapasitas === "" || $sopir === "") {
            jsonResponse(false, "Nomor kendaraan, jenis kendaraan, kapasitas, dan sopir wajib diisi", null, 400);
        }

        if (!in_array($status_armada, ["tersedia", "digunakan", "perawatan"])) {
            jsonResponse(false, "Status armada tidak valid", null, 400);
        }

        $check = $pdo->prepare("
            SELECT id_armada
            FROM armada
            WHERE nomor_kendaraan = :nomor_kendaraan
            LIMIT 1
        ");

        $check->execute([
            ":nomor_kendaraan" => $nomor_kendaraan
        ]);

        if ($check->fetch()) {
            jsonResponse(false, "Nomor kendaraan sudah terdaftar", null, 409);
        }

        $stmt = $pdo->prepare("
            INSERT INTO armada
            (
                nomor_kendaraan,
                jenis_kendaraan,
                kapasitas,
                sopir,
                status_armada,
                bahan_bakar,
                rute_aktif
            )
            VALUES
            (
                :nomor_kendaraan,
                :jenis_kendaraan,
                :kapasitas,
                :sopir,
                :status_armada,
                :bahan_bakar,
                :rute_aktif
            )
        ");

        $stmt->execute([
            ":nomor_kendaraan" => $nomor_kendaraan,
            ":jenis_kendaraan" => $jenis_kendaraan,
            ":kapasitas" => $kapasitas,
            ":sopir" => $sopir,
            ":status_armada" => $status_armada,
            ":bahan_bakar" => $bahan_bakar,
            ":rute_aktif" => $rute_aktif
        ]);

        jsonResponse(true, "Data armada berhasil ditambahkan", [
            "id_armada" => $pdo->lastInsertId(),
            "nomor_kendaraan" => $nomor_kendaraan
        ], 201);
    }

    public function update($id)
    {
        global $pdo;

        $input = getJsonInput();

        $check = $pdo->prepare("
            SELECT *
            FROM armada
            WHERE id_armada = :id
            LIMIT 1
        ");

        $check->execute([
            ":id" => $id
        ]);

        $oldData = $check->fetch();

        if (!$oldData) {
            jsonResponse(false, "Data armada tidak ditemukan", null, 404);
        }

        $nomor_kendaraan = strtoupper(trim($input["nomor_kendaraan"] ?? $oldData["nomor_kendaraan"]));
        $jenis_kendaraan = trim($input["jenis_kendaraan"] ?? $oldData["jenis_kendaraan"]);
        $kapasitas = trim($input["kapasitas"] ?? $oldData["kapasitas"]);
        $sopir = trim($input["sopir"] ?? $oldData["sopir"]);
        $status_armada = trim($input["status_armada"] ?? $oldData["status_armada"]);
        $bahan_bakar = trim($input["bahan_bakar"] ?? $oldData["bahan_bakar"]);
        $rute_aktif = trim($input["rute_aktif"] ?? $oldData["rute_aktif"]);

        if ($nomor_kendaraan === "" || $jenis_kendaraan === "" || $kapasitas === "" || $sopir === "") {
            jsonResponse(false, "Nomor kendaraan, jenis kendaraan, kapasitas, dan sopir wajib diisi", null, 400);
        }

        if (!in_array($status_armada, ["tersedia", "digunakan", "perawatan"])) {
            jsonResponse(false, "Status armada tidak valid", null, 400);
        }

        $duplicate = $pdo->prepare("
            SELECT id_armada
            FROM armada
            WHERE nomor_kendaraan = :nomor_kendaraan
            AND id_armada != :id
            LIMIT 1
        ");

        $duplicate->execute([
            ":nomor_kendaraan" => $nomor_kendaraan,
            ":id" => $id
        ]);

        if ($duplicate->fetch()) {
            jsonResponse(false, "Nomor kendaraan sudah digunakan armada lain", null, 409);
        }

        $stmt = $pdo->prepare("
            UPDATE armada
            SET
                nomor_kendaraan = :nomor_kendaraan,
                jenis_kendaraan = :jenis_kendaraan,
                kapasitas = :kapasitas,
                sopir = :sopir,
                status_armada = :status_armada,
                bahan_bakar = :bahan_bakar,
                rute_aktif = :rute_aktif
            WHERE id_armada = :id
        ");

        $stmt->execute([
            ":nomor_kendaraan" => $nomor_kendaraan,
            ":jenis_kendaraan" => $jenis_kendaraan,
            ":kapasitas" => $kapasitas,
            ":sopir" => $sopir,
            ":status_armada" => $status_armada,
            ":bahan_bakar" => $bahan_bakar,
            ":rute_aktif" => $rute_aktif,
            ":id" => $id
        ]);

        jsonResponse(true, "Data armada berhasil diperbarui");
    }

    public function destroy($id)
    {
        global $pdo;

        $check = $pdo->prepare("
            SELECT id_armada
            FROM armada
            WHERE id_armada = :id
            LIMIT 1
        ");

        $check->execute([
            ":id" => $id
        ]);

        if (!$check->fetch()) {
            jsonResponse(false, "Data armada tidak ditemukan", null, 404);
        }

        $stmt = $pdo->prepare("
            DELETE FROM armada
            WHERE id_armada = :id
        ");

        $stmt->execute([
            ":id" => $id
        ]);

        jsonResponse(true, "Data armada berhasil dihapus");
    }
}