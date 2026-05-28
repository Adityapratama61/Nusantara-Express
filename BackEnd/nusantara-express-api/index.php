<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/helpers/response.php";
require_once __DIR__ . "/controllers/AuthController.php";
require_once __DIR__ . "/controllers/PelangganController.php";
require_once __DIR__ . "/controllers/ArmadaController.php";
require_once __DIR__ . "/controllers/KurirController.php";
require_once __DIR__ . "/controllers/TarifOngkirController.php";
require_once __DIR__ . "/controllers/PengirimanController.php";
require_once __DIR__ . "/controllers/DashboardController.php";
require_once __DIR__ . "/controllers/LaporanController.php";
require_once __DIR__ . "/controllers/UserController.php";

$basePath = "/nusantara-express-api";
$requestUri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$route = str_replace($basePath, "", $requestUri);
$route = trim($route, "/");

$method = $_SERVER["REQUEST_METHOD"];

if ($route === "" || $route === "health") {
    jsonResponse(true, "Nusantara Express API is running", [
        "app" => "Nusantara Express Logistics API",
        "version" => "1.0.0"
    ]);
}

// =====================================================
// ROUTE AUTH
// =====================================================
if ($route === "auth/login" && $method === "POST") {
    $controller = new AuthController();
    $controller->login();
}

if ($route === "auth/register" && $method === "POST") {
    $controller = new AuthController();
    $controller->register();
}

// =====================================================
// ROUTE PELANGGAN
// =====================================================
if ($route === "pelanggan" && $method === "GET") {
    $controller = new PelangganController();
    $controller->index();
}

if (preg_match("/^pelanggan\/([0-9]+)$/", $route, $matches) && $method === "GET") {
    $controller = new PelangganController();
    $controller->show($matches[1]);
}

if ($route === "pelanggan" && $method === "POST") {
    $controller = new PelangganController();
    $controller->store();
}

if (preg_match("/^pelanggan\/([0-9]+)$/", $route, $matches) && $method === "PUT") {
    $controller = new PelangganController();
    $controller->update($matches[1]);
}

if (preg_match("/^pelanggan\/([0-9]+)$/", $route, $matches) && $method === "DELETE") {
    $controller = new PelangganController();
    $controller->destroy($matches[1]);
}

// =====================================================
// ROUTE ARMADA
// =====================================================
if ($route === "armada" && $method === "GET") {
    $controller = new ArmadaController();
    $controller->index();
}

if (preg_match("/^armada\/([0-9]+)$/", $route, $matches) && $method === "GET") {
    $controller = new ArmadaController();
    $controller->show($matches[1]);
}

if ($route === "armada" && $method === "POST") {
    $controller = new ArmadaController();
    $controller->store();
}

if (preg_match("/^armada\/([0-9]+)$/", $route, $matches) && $method === "PUT") {
    $controller = new ArmadaController();
    $controller->update($matches[1]);
}

if (preg_match("/^armada\/([0-9]+)$/", $route, $matches) && $method === "DELETE") {
    $controller = new ArmadaController();
    $controller->destroy($matches[1]);
}

// =====================================================
// ROUTE KURIR
// =====================================================
if ($route === "kurir" && $method === "GET") {
    $controller = new KurirController();
    $controller->index();
}

if (preg_match("/^kurir\/([0-9]+)$/", $route, $matches) && $method === "GET") {
    $controller = new KurirController();
    $controller->show($matches[1]);
}

if ($route === "kurir" && $method === "POST") {
    $controller = new KurirController();
    $controller->store();
}

if (preg_match("/^kurir\/([0-9]+)$/", $route, $matches) && $method === "PUT") {
    $controller = new KurirController();
    $controller->update($matches[1]);
}

if (preg_match("/^kurir\/([0-9]+)$/", $route, $matches) && $method === "DELETE") {
    $controller = new KurirController();
    $controller->destroy($matches[1]);
}

// =====================================================
// ROUTE TARIF ONGKIR
// =====================================================
if ($route === "tarif-ongkir" && $method === "GET") {
    $controller = new TarifOngkirController();
    $controller->index();
}

if ($route === "cek-ongkir" && $method === "GET") {
    $controller = new TarifOngkirController();
    $controller->cekOngkir();
}

if (preg_match("/^tarif-ongkir\/([0-9]+)$/", $route, $matches) && $method === "GET") {
    $controller = new TarifOngkirController();
    $controller->show($matches[1]);
}

if ($route === "tarif-ongkir" && $method === "POST") {
    $controller = new TarifOngkirController();
    $controller->store();
}

if (preg_match("/^tarif-ongkir\/([0-9]+)$/", $route, $matches) && $method === "PUT") {
    $controller = new TarifOngkirController();
    $controller->update($matches[1]);
}

if (preg_match("/^tarif-ongkir\/([0-9]+)$/", $route, $matches) && $method === "DELETE") {
    $controller = new TarifOngkirController();
    $controller->destroy($matches[1]);
}

// =====================================================
// ROUTE PENGIRIMAN
// =====================================================
if ($route === "pengiriman" && $method === "GET") {
    $controller = new PengirimanController();
    $controller->index();
}

if (preg_match("/^pengiriman\/([0-9]+)$/", $route, $matches) && $method === "GET") {
    $controller = new PengirimanController();
    $controller->show($matches[1]);
}

if ($route === "pengiriman" && $method === "POST") {
    $controller = new PengirimanController();
    $controller->store();
}

if (preg_match("/^pengiriman\/([0-9]+)$/", $route, $matches) && $method === "PUT") {
    $controller = new PengirimanController();
    $controller->update($matches[1]);
}

if (preg_match("/^pengiriman\/([0-9]+)\/status$/", $route, $matches) && $method === "PUT") {
    $controller = new PengirimanController();
    $controller->updateStatus($matches[1]);
}

if (preg_match("/^pengiriman\/([0-9]+)$/", $route, $matches) && $method === "DELETE") {
    $controller = new PengirimanController();
    $controller->destroy($matches[1]);
}

// =====================================================
// ROUTE PUBLIC TRACKING RESI
// =====================================================
if (preg_match("/^tracking\/(.+)$/", $route, $matches) && $method === "GET") {
    $controller = new PengirimanController();
    $controller->trackingByResi($matches[1]);
}

// =====================================================
// ROUTE DASHBOARD
// =====================================================
if ($route === "dashboard" && $method === "GET") {
    $controller = new DashboardController();
    $controller->index();
}

// =====================================================
// ROUTE LAPORAN
// =====================================================
if ($route === "laporan" && $method === "GET") {
    $controller = new LaporanController();
    $controller->index();
}

// =====================================================
// ROUTE USER
// =====================================================
if (preg_match("/^user\/dashboard\/([0-9]+)$/", $route, $matches) && $method === "GET") {
    $controller = new UserController();
    $controller->dashboard($matches[1]);
}

if (preg_match("/^user\/pengiriman\/([0-9]+)$/", $route, $matches) && $method === "GET") {
    $controller = new UserController();
    $controller->pengiriman($matches[1]);
}

if (preg_match("/^user\/pengiriman\/([0-9]+)\/([0-9]+)$/", $route, $matches) && $method === "GET") {
    $controller = new UserController();
    $controller->detailPengiriman($matches[1], $matches[2]);
}

if (preg_match("/^user\/notifikasi\/([0-9]+)$/", $route, $matches) && $method === "GET") {
    $controller = new UserController();
    $controller->notifikasi($matches[1]);
}

jsonResponse(false, "Endpoint tidak ditemukan", [
    "route" => $route,
    "method" => $method
], 404);