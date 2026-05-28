<?php

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../helpers/response.php";

class KurirController
{
    public function index()
    {
        global $pdo;

        $search = $_GET["search"] ?? "";

        if ($search !== "") {
            $stmt = $pdo->prepare("
                SELECT *
                FROM kurir
                WHERE 
                    kode_kurir LIKE :search OR
                    nama_kurir LIKE :search OR
                    no_telepon LIKE :search OR
                    alamat LIKE :search OR
                    area_tugas LIKE :search OR
                    status LIKE :search
                ORDER BY id_kurir DESC
            ");

            $stmt->execute([
                ":search" => "%" . $search . "%"
            ]);
        } else {
            $stmt = $pdo->query("
                SELECT *
                FROM kurir
                ORDER BY id_kurir DESC
            ");
        }

        $data = $stmt->fetchAll();

        jsonResponse(true, "Data kurir berhasil diambil", $data);
    }

    public function show($id)
    {
        global $pdo;

        $stmt = $pdo->prepare("
            SELECT *
            FROM kurir
            WHERE id_kurir = :id
            LIMIT 1
        ");

        $stmt->execute([
            ":id" => $id
        ]);

        $data = $stmt->fetch();

        if (!$data) {
            jsonResponse(false, "Data kurir tidak ditemukan", null, 404);
        }

        jsonResponse(true, "Detail kurir berhasil diambil", $data);
    }

    public function store()
    {
        global $pdo;

        $input = getJsonInput();

        $nama_kurir = trim($input["nama_kurir"] ?? "");
        $no_telepon = trim($input["no_telepon"] ?? "");
        $alamat = trim($input["alamat"] ?? "");
        $area_tugas = trim($input["area_tugas"] ?? "");
        $status = trim($input["status"] ?? "aktif");

        if ($nama_kurir === "" || $no_telepon === "" || $alamat === "") {
            jsonResponse(false, "Nama kurir, nomor telepon, dan alamat wajib diisi", null, 400);
        }

        if (!in_array($status, ["aktif", "nonaktif"])) {
            jsonResponse(false, "Status kurir tidak valid", null, 400);
        }

        $kode_kurir = $this->generateKodeKurir();

        $stmt = $pdo->prepare("
            INSERT INTO kurir
            (
                kode_kurir,
                nama_kurir,
                no_telepon,
                alamat,
                area_tugas,
                status
            )
            VALUES
            (
                :kode_kurir,
                :nama_kurir,
                :no_telepon,
                :alamat,
                :area_tugas,
                :status
            )
        ");

        $stmt->execute([
            ":kode_kurir" => $kode_kurir,
            ":nama_kurir" => $nama_kurir,
            ":no_telepon" => $no_telepon,
            ":alamat" => $alamat,
            ":area_tugas" => $area_tugas,
            ":status" => $status
        ]);

        jsonResponse(true, "Data kurir berhasil ditambahkan", [
            "id_kurir" => $pdo->lastInsertId(),
            "kode_kurir" => $kode_kurir
        ], 201);
    }

    public function update($id)
    {
        global $pdo;

        $input = getJsonInput();

        $check = $pdo->prepare("
            SELECT *
            FROM kurir
            WHERE id_kurir = :id
            LIMIT 1
        ");

        $check->execute([
            ":id" => $id
        ]);

        $oldData = $check->fetch();

        if (!$oldData) {
            jsonResponse(false, "Data kurir tidak ditemukan", null, 404);
        }

        $nama_kurir = trim($input["nama_kurir"] ?? $oldData["nama_kurir"]);
        $no_telepon = trim($input["no_telepon"] ?? $oldData["no_telepon"]);
        $alamat = trim($input["alamat"] ?? $oldData["alamat"]);
        $area_tugas = trim($input["area_tugas"] ?? $oldData["area_tugas"]);
        $status = trim($input["status"] ?? $oldData["status"]);

        if ($nama_kurir === "" || $no_telepon === "" || $alamat === "") {
            jsonResponse(false, "Nama kurir, nomor telepon, dan alamat wajib diisi", null, 400);
        }

        if (!in_array($status, ["aktif", "nonaktif"])) {
            jsonResponse(false, "Status kurir tidak valid", null, 400);
        }

        $stmt = $pdo->prepare("
            UPDATE kurir
            SET
                nama_kurir = :nama_kurir,
                no_telepon = :no_telepon,
                alamat = :alamat,
                area_tugas = :area_tugas,
                status = :status
            WHERE id_kurir = :id
        ");

        $stmt->execute([
            ":nama_kurir" => $nama_kurir,
            ":no_telepon" => $no_telepon,
            ":alamat" => $alamat,
            ":area_tugas" => $area_tugas,
            ":status" => $status,
            ":id" => $id
        ]);

        jsonResponse(true, "Data kurir berhasil diperbarui");
    }

    public function destroy($id)
    {
        global $pdo;

        $check = $pdo->prepare("
            SELECT id_kurir
            FROM kurir
            WHERE id_kurir = :id
            LIMIT 1
        ");

        $check->execute([
            ":id" => $id
        ]);

        if (!$check->fetch()) {
            jsonResponse(false, "Data kurir tidak ditemukan", null, 404);
        }

        $stmt = $pdo->prepare("
            DELETE FROM kurir
            WHERE id_kurir = :id
        ");

        $stmt->execute([
            ":id" => $id
        ]);

        jsonResponse(true, "Data kurir berhasil dihapus");
    }

    private function generateKodeKurir()
    {
        global $pdo;

        $stmt = $pdo->query("
            SELECT kode_kurir
            FROM kurir
            ORDER BY id_kurir DESC
            LIMIT 1
        ");

        $last = $stmt->fetch();

        if (!$last) {
            return "KUR-001";
        }

        $lastNumber = (int) str_replace("KUR-", "", $last["kode_kurir"]);
        $newNumber = $lastNumber + 1;

        return "KUR-" . str_pad($newNumber, 3, "0", STR_PAD_LEFT);
    }
}