<?php

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../helpers/response.php";

class AuthController
{
    public function login()
    {
        global $pdo;

        $input = getJsonInput();

        $identifier = trim($input["identifier"] ?? "");
        $password = trim($input["password"] ?? "");

        if ($identifier === "" || $password === "") {
            jsonResponse(false, "Username/email dan password wajib diisi", null, 400);
        }

        $query = "
            SELECT 
                id_user,
                nama_lengkap,
                username,
                email,
                password,
                role,
                status
            FROM users
            WHERE username = :identifier OR email = :identifier
            LIMIT 1
        ";

        $stmt = $pdo->prepare($query);
        $stmt->execute([
            ":identifier" => $identifier
        ]);

        $user = $stmt->fetch();

        if (!$user) {
            jsonResponse(false, "Akun tidak ditemukan", null, 404);
        }

        if ($user["status"] !== "aktif") {
            jsonResponse(false, "Akun tidak aktif", null, 403);
        }

        if (!password_verify($password, $user["password"])) {
            jsonResponse(false, "Password salah", null, 401);
        }

        $updateLogin = $pdo->prepare("
            UPDATE users 
            SET last_login = NOW() 
            WHERE id_user = :id_user
        ");

        $updateLogin->execute([
            ":id_user" => $user["id_user"]
        ]);

        unset($user["password"]);

        $token = bin2hex(random_bytes(32));

        jsonResponse(true, "Login berhasil", [
            "token" => $token,
            "user" => $user
        ]);
    }

    public function register()
    {
        global $pdo;

        $input = getJsonInput();

        $namaLengkap = trim($input["nama_lengkap"] ?? "");
        $username = trim($input["username"] ?? "");
        $email = trim($input["email"] ?? "");
        $password = trim($input["password"] ?? "");
        $noTelepon = trim($input["no_telepon"] ?? "");
        $alamat = trim($input["alamat"] ?? "");
        $kota = trim($input["kota"] ?? "");

        if (
            $namaLengkap === "" ||
            $username === "" ||
            $email === "" ||
            $password === "" ||
            $noTelepon === "" ||
            $alamat === "" ||
            $kota === ""
        ) {
            jsonResponse(false, "Semua field wajib diisi", null, 400);
        }

        if (strlen($password) < 6) {
            jsonResponse(false, "Password minimal 6 karakter", null, 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonResponse(false, "Format email tidak valid", null, 400);
        }

        try {
            $checkUser = $pdo->prepare("
                SELECT id_user 
                FROM users 
                WHERE username = :username OR email = :email
                LIMIT 1
            ");

            $checkUser->execute([
                ":username" => $username,
                ":email" => $email
            ]);

            if ($checkUser->fetch()) {
                jsonResponse(false, "Username atau email sudah digunakan", null, 409);
            }

            $pdo->beginTransaction();

            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $insertUser = $pdo->prepare("
                INSERT INTO users 
                (nama_lengkap, username, email, password, role, status, created_at, updated_at)
                VALUES
                (:nama_lengkap, :username, :email, :password, 'pelanggan', 'aktif', NOW(), NOW())
            ");

            $insertUser->execute([
                ":nama_lengkap" => $namaLengkap,
                ":username" => $username,
                ":email" => $email,
                ":password" => $hashedPassword
            ]);

            $idUser = $pdo->lastInsertId();

            /*
             * Generate kode pelanggan aman.
             * Tidak lagi memakai id_user, supaya tidak bentrok dengan kode pelanggan lama.
             */
            $getLastCode = $pdo->query("
                SELECT kode_pelanggan
                FROM pelanggan
                WHERE kode_pelanggan REGEXP '^CUST-[0-9]+$'
                ORDER BY CAST(SUBSTRING(kode_pelanggan, 6) AS UNSIGNED) DESC
                LIMIT 1
            ");

            $lastCode = $getLastCode->fetch();
            $lastNumber = 0;

            if ($lastCode && isset($lastCode["kode_pelanggan"])) {
                $lastNumber = (int) str_replace("CUST-", "", $lastCode["kode_pelanggan"]);
            }

            do {
                $lastNumber++;
                $kodePelanggan = "CUST-" . str_pad($lastNumber, 3, "0", STR_PAD_LEFT);

                $checkKode = $pdo->prepare("
                    SELECT id_pelanggan
                    FROM pelanggan
                    WHERE kode_pelanggan = :kode_pelanggan
                    LIMIT 1
                ");

                $checkKode->execute([
                    ":kode_pelanggan" => $kodePelanggan
                ]);

                $kodeExists = $checkKode->fetch();
            } while ($kodeExists);

            $insertPelanggan = $pdo->prepare("
                INSERT INTO pelanggan
                (
                    kode_pelanggan,
                    id_user,
                    nama_pelanggan,
                    no_telepon,
                    email,
                    alamat,
                    kota,
                    tipe_pelanggan,
                    status,
                    created_at,
                    updated_at
                )
                VALUES
                (
                    :kode_pelanggan,
                    :id_user,
                    :nama_pelanggan,
                    :no_telepon,
                    :email,
                    :alamat,
                    :kota,
                    'personal',
                    'aktif',
                    NOW(),
                    NOW()
                )
            ");

            $insertPelanggan->execute([
                ":kode_pelanggan" => $kodePelanggan,
                ":id_user" => $idUser,
                ":nama_pelanggan" => $namaLengkap,
                ":no_telepon" => $noTelepon,
                ":email" => $email,
                ":alamat" => $alamat,
                ":kota" => $kota
            ]);

            $pdo->commit();

            jsonResponse(true, "Registrasi berhasil", [
                "id_user" => (int) $idUser,
                "kode_pelanggan" => $kodePelanggan,
                "nama_lengkap" => $namaLengkap,
                "username" => $username,
                "email" => $email,
                "role" => "pelanggan",
                "status" => "aktif"
            ], 201);
        } catch (Exception $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }

            jsonResponse(false, "Registrasi gagal: " . $e->getMessage(), null, 500);
        }
    }
}