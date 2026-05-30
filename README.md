<div align="center">
  <h1>Lost & Found Management System</h1>
  <p>
    Sistem Informasi Pelacakan dan Pelaporan Barang Hilang & Ditemukan
  </p>
  <p>
    <img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D" alt="Vue 3" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white" alt="Firebase" />
  </p>
</div>

---

## Tentang Proyek

**Lost & Found Management System** adalah aplikasi web komprehensif yang dirancang untuk memfasilitasi pelaporan barang hilang dan pendataan barang yang ditemukan. Platform ini menyederhanakan proses mempertemukan kembali pemilik dengan barang mereka melalui antarmuka yang intuitif, pemetaan interaktif, serta sistem autentikasi pengguna yang aman dan terpusat.

## Fitur Utama

- **Sistem Pelaporan Terpadu:** Alur kerja terpisah dan terstruktur untuk melaporkan barang hilang dan barang yang ditemukan.
- **Visualisasi Peta Interaktif:** Integrasi peta menggunakan Leaflet untuk menentukan titik koordinat lokasi yang presisi.
- **Autentikasi Aman:** Sistem registrasi, login, dan proteksi rute halaman yang didukung oleh Firebase Authentication.
- **Database Real-time:** Sinkronisasi data yang cepat, handal, dan efisien menggunakan layanan Cloud Firestore.
- **Desain Responsif:** Tata letak yang dioptimalkan untuk berbagai ukuran layar (desktop, tablet, dan perangkat seluler) menggunakan Tailwind CSS.
- **Dasbor Admin:** Tampilan manajemen terpusat bagi administrator untuk memantau, memverifikasi, dan mengelola seluruh data pada platform.

## Stack Teknologi

### Frontend
- **Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite
- **State Management:** Pinia
- **Routing:** Vue Router
- **Styling:** Tailwind CSS
- **Icons:** Lucide Vue Next
- **Maps:** Leaflet

### Backend & Layanan
- **Autentikasi:** Firebase Authentication
- **Database:** Cloud Firestore
- **Penyimpanan:** Firebase Storage

## Prasyarat

Sebelum memulai proses instalasi, pastikan Anda telah memenuhi persyaratan sistem minimal berikut:
- Node.js (versi 18.0.0 atau lebih baru)
- Paket manajer (npm atau yarn)
- Proyek Firebase yang telah dikonfigurasi dengan layanan Auth, Firestore, dan Storage.

## Instalasi dan Pengaturan

1. **Kloning repositori:**
   ```bash
   git clone https://github.com/username/lost-and-found.git
   cd lost-and-found
   ```

2. **Instalasi dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Variabel Lingkungan:**
   - Buat file `.env` pada direktori utama proyek (root).
   - Tambahkan kredensial proyek Firebase Anda sesuai dengan format berikut:
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Menjalankan server pengembangan:**
   ```bash
   npm run dev
   ```
   Aplikasi akan mulai berjalan dan dapat diakses melalui browser pada `http://localhost:5173`.

## Struktur Proyek

```text
lost-and-found/
├── src/
│   ├── assets/       # Aset statis seperti gambar dan stylesheet global
│   ├── components/   # Komponen Vue yang dapat digunakan ulang (reusable)
│   ├── firebase/     # Konfigurasi layanan Firebase
│   ├── router/       # Konfigurasi perutean aplikasi (Vue Router)
│   ├── stores/       # Modul manajemen state (Pinia)
│   ├── views/        # Komponen level halaman (mis: AdminDashboard, Home)
│   ├── App.vue       # Komponen utama (root component)
│   └── main.js       # Titik masuk utama aplikasi (entry point)
├── public/           # File statis publik (termasuk favicon)
├── .env              # Konfigurasi variabel lingkungan (environment variables)
├── index.html        # Template HTML utama
├── package.json      # Metadata proyek dan daftar dependensi
├── tailwind.config.js# File konfigurasi utilitas Tailwind CSS
└── vite.config.js    # File konfigurasi Vite
```

## Kontribusi

Kami menyambut baik berbagai bentuk kontribusi untuk meningkatkan performa dan fitur dari proyek ini. Untuk berkontribusi, ikuti langkah-langkah berikut:

1. Lakukan *Fork* pada repositori ini.
2. Buat *branch* fitur Anda (`git checkout -b fitur/FiturBaru`).
3. Lakukan *Commit* pada setiap perubahan Anda (`git commit -m 'Menambahkan FiturBaru'`).
4. *Push* ke *branch* tersebut (`git push origin fitur/FiturBaru`).
5. Ajukan *Pull Request* untuk kami tinjau.

## Lisensi

Proyek ini didistribusikan di bawah Lisensi MIT.

---

<div align="center">
  <p>Dikembangkan dengan standar pengembangan web modern.</p>
</div>
