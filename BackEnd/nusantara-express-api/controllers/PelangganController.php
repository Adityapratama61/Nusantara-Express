<?php

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../helpers/response.php";

class PelangganController
{
    public function index()
    {
        global $pdo;

        $search = $_GET["search"] ?? "";

        if ($search !== "") {
            $query = "
                SELECT *
                FROM pelanggan
                WHERE 
                    kode_pelanggan LIKE :search OR
                    nama_pelanggan LIKE :search OR
                    no_telepon LIKE :search OR
                    email LIKE :search OR
                    kota LIKE :search
                ORDER BY id_pelanggan DESC
            ";

            $stmt = $pdo->prepare($query);
            $stmt->execute([
                ":search" => "%" . $search . "%"
            ]);
        } else {
            $stmt = $pdo->query("
                SELECT *
                FROM pelanggan
                ORDER BY id_pelanggan DESC
            ");
        }

        $data = $stmt->fetchAll();

        jsonResponse(true, "Data pelanggan berhasil diambil", $data);
    }

    public function show($id)
    {
        global $pdo;

        $stmt = $pdo->prepare("
            SELECT *
            FROM pelanggan
            WHERE id_pelanggan = :id
            LIMIT 1
        ");

        $stmt->execute([
            ":id" => $id
        ]);

        $data = $stmt->fetch();

        if (!$data) {
            jsonResponse(false, "Data pelanggan tidak ditemukan", null, 404);
        }

        jsonResponse(true, "Detail pelanggan berhasil diambil", $data);
    }

    public function store()
    {
        global $pdo;

        $input = getJsonInput();

        $nama_pelanggan = trim($input["nama_pelanggan"] ?? "");
        $no_telepon = trim($input["no_telepon"] ?? "");
        $email = trim($input["email"] ?? "");
        $alamat = trim($input["alamat"] ?? "");
        $kota = trim($input["kota"] ?? "");
        $tipe_pelanggan = trim($input["tipe_pelanggan"] ?? "personal");
        $status = trim($input["status"] ?? "aktif");

        if ($nama_pelanggan === "" || $no_telepon === "" || $alamat === "" || $kota === "") {
            jsonResponse(false, "Nama, nomor telepon, alamat, dan kota wajib diisi", null, 400);
        }

        $kode_pelanggan = $this->generateKodePelanggan();

        $stmt = $pdo->prepare("
            INSERT INTO pelanggan
            (
                kode_pelanggan,
                nama_pelanggan,
                no_telepon,
                email,
                alamat,
                kota,
                tipe_pelanggan,
                status
            )
            VALUES
            (
                :kode_pelanggan,
                :nama_pelanggan,
                :no_telepon,
                :email,
                :alamat,
                :kota,
                :tipe_pelanggan,
                :status
            )
        ");

        $stmt->execute([
            ":kode_pelanggan" => $kode_pelanggan,
            ":nama_pelanggan" => $nama_pelanggan,
            ":no_telepon" => $no_telepon,
            ":email" => $email,
            ":alamat" => $alamat,
            ":kota" => $kota,
            ":tipe_pelanggan" => $tipe_pelanggan,
            ":status" => $status
        ]);

        jsonResponse(true, "Data pelanggan berhasil ditambahkan", [
            "id_pelanggan" => $pdo->lastInsertId(),
            "kode_pelanggan" => $kode_pelanggan
        ], 201);
    }

    public function update($id)
    {
        global $pdo;

        $input = getJsonInput();

        $check = $pdo->prepare("
            SELECT *
            FROM pelanggan
            WHERE id_pelanggan = :id
            LIMIT 1
        ");

        $check->execute([
            ":id" => $id
        ]);

        $oldData = $check->fetch();

        if (!$oldData) {
            jsonResponse(false, "Data pelanggan tidak ditemukan", null, 404);
        }

        $nama_pelanggan = trim($input["nama_pelanggan"] ?? $oldData["nama_pelanggan"]);
        $no_telepon = trim($input["no_telepon"] ?? $oldData["no_telepon"]);
        $email = trim($input["email"] ?? $oldData["email"]);
        $alamat = trim($input["alamat"] ?? $oldData["alamat"]);
        $kota = trim($input["kota"] ?? $oldData["kota"]);
        $tipe_pelanggan = trim($input["tipe_pelanggan"] ?? $oldData["tipe_pelanggan"]);
        $status = trim($input["status"] ?? $oldData["status"]);

        if ($nama_pelanggan === "" || $no_telepon === "" || $alamat === "" || $kota === "") {
            jsonResponse(false, "Nama, nomor telepon, alamat, dan kota wajib diisi", null, 400);
        }

        $stmt = $pdo->prepare("
            UPDATE pelanggan
            SET
                nama_pelanggan = :nama_pelanggan,
                no_telepon = :no_telepon,
                email = :email,
                alamat = :alamat,
                kota = :kota,
                tipe_pelanggan = :tipe_pelanggan,
                status = :status
            WHERE id_pelanggan = :id
        ");

        $stmt->execute([
            ":nama_pelanggan" => $nama_pelanggan,
            ":no_telepon" => $no_telepon,
            ":email" => $email,
            ":alamat" => $alamat,
            ":kota" => $kota,
            ":tipe_pelanggan" => $tipe_pelanggan,
            ":status" => $status,
            ":id" => $id
        ]);

        jsonResponse(true, "Data pelanggan berhasil diperbarui");
    }

    public function destroy($id)
    {
        global $pdo;

        $check = $pdo->prepare("
            SELECT id_pelanggan
            FROM pelanggan
            WHERE id_pelanggan = :id
            LIMIT 1
        ");

        $check->execute([
            ":id" => $id
        ]);

        if (!$check->fetch()) {
            jsonResponse(false, "Data pelanggan tidak ditemukan", null, 404);
        }

        $stmt = $pdo->prepare("
            DELETE FROM pelanggan
            WHERE id_pelanggan = :id
        ");

        $stmt->execute([
            ":id" => $id
        ]);

        jsonResponse(true, "Data pelanggan berhasil dihapus");
    }

    private function generateKodePelanggan()
    {
        global $pdo;

        $stmt = $pdo->query("
            SELECT kode_pelanggan
            FROM pelanggan
            ORDER BY id_pelanggan DESC
            LIMIT 1
        ");

        $last = $stmt->fetch();

        if (!$last) {
            return "CUST-001";
        }

        $lastNumber = (int) str_replace("CUST-", "", $last["kode_pelanggan"]);
        $newNumber = $lastNumber + 1;

        return "CUST-" . str_pad($newNumber, 3, "0", STR_PAD_LEFT);
    }
}