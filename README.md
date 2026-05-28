# Nusantara Express Logistics System
<img width="2097" height="1440" alt="Preview-Image" src="https://github.com/user-attachments/assets/dbe91b3e-0bde-47dd-983c-45754b4f5d0b" />


**Nusantara Express** adalah aplikasi sistem manajemen logistik berbasis web yang dibuat menggunakan **React JS**, **Tailwind CSS**, **PHP Native REST API**, dan **MySQL**. Aplikasi ini dirancang untuk membantu proses pengiriman barang mulai dari tracking resi, cek ongkir, dashboard pelanggan, hingga manajemen operasional admin.

## ✨ Fitur Utama

### Public

* Landing page responsive
* Login dan register pelanggan
* Tracking resi secara real-time
* Cek ongkir berdasarkan kota asal, kota tujuan, berat, dan layanan

### User / Pelanggan

* Dashboard pelanggan
* Riwayat pengiriman
* Detail pengiriman
* Timeline tracking
* Notifikasi pengiriman
* Profile pelanggan
* Update data profile

### Admin

* Dashboard admin
* Manajemen pelanggan
* Manajemen armada
* Manajemen kurir
* Manajemen tarif ongkir
* Manajemen pengiriman
* Detail pengiriman
* Update status tracking
* Laporan pengiriman
* Export laporan PDF/CSV

## 🛠️ Tech Stack

### Frontend

* React JS
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* Lucide React

### Backend

* PHP Native
* REST API
* MySQL
* Laragon

## 📁 Struktur Project

```bash
nusantara-express/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── helpers/
│   ├── index.php
│   └── .htaccess
│
├── database/
│   └── nusantara_express.sql
│
├── docs/
│   └── preview-project.jpeg
│
└── README.md
```

## 🚀 Cara Menjalankan Project

### 1. Clone Repository

```bash
git clone https://github.com/username/nusantara-express.git
cd nusantara-express
```

### 2. Jalankan Backend

Pindahkan folder backend ke Laragon:

```bash
C:/laragon/www/nusantara-express-api
```

Import database:

```bash
database/nusantara_express.sql
```

Jalankan Laragon, lalu akses API:

```text
http://localhost/nusantara-express-api
```

Jika API berhasil berjalan, response akan seperti ini:

```json
{
  "success": true,
  "message": "Nusantara Express API is running"
}
```

### 3. Jalankan Frontend

Masuk ke folder frontend:

```bash
cd frontend
npm install
npm run dev
```

Akses frontend:

```text
http://localhost:5173
```

## 🔐 Akun Demo

### Admin

```text
Username: admin
Password: password
```

### User / Pelanggan

```text
Username: budi.user
Password: password
```

> Catatan: Akun demo hanya digunakan untuk kebutuhan testing lokal.

## 📌 Endpoint API Utama

### Auth

```text
POST /auth/login
POST /auth/register
```

### Public

```text
GET /tracking/{nomor_resi}
GET /cek-ongkir
```

### Admin

```text
GET /dashboard
GET /laporan
GET /pelanggan
GET /armada
GET /kurir
GET /tarif-ongkir
GET /pengiriman
```

### User

```text
GET /user/dashboard/{id_user}
GET /user/pengiriman/{id_user}
GET /user/pengiriman/{id_user}/{id_pengiriman}
GET /user/notifikasi/{id_user}
```

## 📷 Preview

Aplikasi ini memiliki tampilan modern dan responsive untuk halaman public, dashboard user, dan dashboard admin.

![Project Preview](docs/preview-project.jpeg)

## 📦 Fitur CRUD

| Modul        | Create | Read | Update | Delete |
| ------------ | -----: | ---: | -----: | -----: |
| Pelanggan    |      ✅ |    ✅ |      ✅ |      ✅ |
| Armada       |      ✅ |    ✅ |      ✅ |      ✅ |
| Kurir        |      ✅ |    ✅ |      ✅ |      ✅ |
| Tarif Ongkir |      ✅ |    ✅ |      ✅ |      ✅ |
| Pengiriman   |      ✅ |    ✅ |      ✅ |      ✅ |
| Users        |      ✅ |    ✅ |      ✅ |      ✅ |

## 🧾 Export & Report

Admin dapat melihat laporan pengiriman dan melakukan export data dalam format:

* PDF
* CSV / Excel

## 🔒 Authentication

Sistem menggunakan login berbasis role:

* `admin`
* `staff`
* `pelanggan`
* `kurir`

Route admin dan user sudah dilindungi menggunakan protected route pada frontend.

## 📚 Tujuan Project

Project ini dibuat sebagai sistem logistik berbasis web untuk kebutuhan portfolio dan pembelajaran integrasi antara frontend React JS dengan backend PHP Native REST API.

## 👨‍💻 Developer

**Aditya Pratama**

* GitHub: [@Adityapratama61](https://github.com/Adityapratama61)
* Project: Nusantara Express Logistics System

## 📄 License

Project ini dibuat untuk kebutuhan pembelajaran dan portfolio.
