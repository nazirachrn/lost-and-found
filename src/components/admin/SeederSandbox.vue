<template>
  <div class="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-6 max-w-2xl my-6">
    <div>
      <h2 class="text-lg font-black text-slate-800 mb-1">Database Seeder & Admin Sandbox</h2>
      <p class="text-sm text-slate-500">Utilitas khusus developer untuk menanam data dummy dan membuat akun Super Admin secara otomatis ke Firebase.</p>
    </div>

    <div class="flex flex-col sm:flex-row gap-4">
      <button 
        @click="seedDatabase" 
        :disabled="isSeeding"
        class="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span v-if="isSeeding" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        {{ isSeeding ? 'Menanam data...' : '🌱 Jalankan Seeder Database' }}
      </button>

      <button 
        @click="seedAdminRole" 
        :disabled="isAdminSeeding"
        class="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span v-if="isAdminSeeding" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        {{ isAdminSeeding ? 'Membuat Akun Admin...' : '👑 Buat Akun Super Admin' }}
      </button>
    </div>

    <!-- Info Kredensial Admin -->
    <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl">
      <div class="flex items-center gap-2 mb-3">
        <span class="w-2 h-2 rounded-full bg-purple-500"></span>
        <h3 class="text-xs font-black text-slate-700 uppercase tracking-wider">Kredensial Login Admin (Hardcoded)</h3>
      </div>
      
      <div v-for="(admin, index) in ADMIN_CREDENTIALS" :key="index" class="mb-4 last:mb-0">
        <h4 class="text-[11px] font-bold text-slate-600 mb-2">{{ admin.nama_lengkap }}</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email / Username</label>
            <div class="text-sm font-mono text-slate-800 bg-white px-3 py-2 border border-slate-200 rounded-lg mt-1 select-all cursor-text">
              {{ admin.email }}
            </div>
          </div>
          <div>
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <div class="text-sm font-mono text-slate-800 bg-white px-3 py-2 border border-slate-200 rounded-lg mt-1 select-all cursor-text">
              {{ admin.password }}
            </div>
          </div>
        </div>
      </div>
      
      <p class="text-[10px] text-slate-400 mt-3 font-semibold uppercase">* Klik teks untuk menyorot dan menyalin</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();

const isSeeding = ref(false);
const isAdminSeeding = ref(false);

const ADMIN_CREDENTIALS = [
  {
    email: "nazira.lostlink@upi-yptk.ac.id",
    password: "SuperAdminLostLink2026!",
    nama_lengkap: "Nazira Chairani Fauza (Admin)",
    role: "super_admin"
  },
  {
    email: "damai.lostlink@upi-yptk.ac.id",
    password: "SuperAdminLostLink2026!",
    nama_lengkap: "Damai Puti Afifah (Admin)",
    role: "admin"
  }
];

// 1. FITUR BUTTON TANAM DATA (SEEDER FIRESTORE)
const seedDatabase = async () => {
  if (isSeeding.value) return;
  isSeeding.value = true;
  
  const dummyReports = [
    {
      namaBarang: "Dompet Imut Lucu Warna Pink",
      kategori: "Dompet",
      warna: "Pink",
      lokasi: "Lantai 2 Gedung Utama",
      tanggal: "2026-05-29",
      deskripsi: "Dompet lipat kecil, di dalamnya ada kartu mahasiswa dan beberapa lembar uang.",
      ciriKhusus: "Ada stiker chibi pixel art menempel di bagian belakang",
      status: "missing",
      latitude: -0.9628, 
      longitude: 100.6325,
      userId: "user-dummy-1",
      createdAt: new Date().toISOString()
    },
    {
      namaBarang: "Kunci Motor Honda",
      kategori: "Kunci",
      warna: "Hitam",
      lokasi: "Parkiran Fakultas Ilmu Komputer",
      tanggal: "2026-05-28",
      deskripsi: "Kunci motor ada gantungan kain warna merah tulisan Honda.",
      ciriKhusus: "Gantungan kunci agak lecet di bagian pinggir",
      status: "missing",
      latitude: -0.9634, 
      longitude: 100.6312,
      userId: "user-dummy-2",
      createdAt: new Date().toISOString()
    },
    {
      namaBarang: "Tumbler Corkcicle Muted Pastel Sage Green",
      kategori: "Lainnya",
      warna: "Sage Green",
      lokasi: "Meja Perpustakaan Pusat",
      tanggal: "2026-05-27",
      deskripsi: "Ditemukan tertinggal di meja pojok perpustakaan dekat jendela.",
      ciriKhusus: "Ada sedikit penyok di bagian bawah botol",
      status: "found",
      latitude: -0.9641, 
      longitude: 100.6305,
      userId: "user-dummy-3",
      createdAt: new Date().toISOString()
    },
    {
      namaBarang: "Laptop ASUS ROG Strix",
      kategori: "Elektronik",
      warna: "Hitam Merah",
      lokasi: "Laboratorium Komputer Dasar",
      tanggal: "2026-05-29",
      deskripsi: "Tertinggal saat praktikum sesi sore. Baterai lowbatt.",
      ciriKhusus: "Ada stiker logo himpunan di lid laptop",
      status: "missing",
      latitude: -0.9630, 
      longitude: 100.6320,
      userId: "user-dummy-4",
      createdAt: new Date().toISOString()
    },
    {
      namaBarang: "Map Plastik Berisi Dokumen KRS",
      kategori: "Dokumen",
      warna: "Biru",
      lokasi: "Kantin Fakultas Ekonomi",
      tanggal: "2026-05-26",
      deskripsi: "Ditemukan di kursi kantin setelah jam makan siang.",
      ciriKhusus: "Map plastik warna biru dengan stempel legalisir basah.",
      status: "found",
      latitude: -0.9650, 
      longitude: 100.6300,
      userId: "user-dummy-5",
      createdAt: new Date().toISOString()
    }
  ];

  try {
    for (const report of dummyReports) {
      // Split into missing_items and found_items based on status
      const collectionName = report.status === "missing" ? "missing_items" : "found_items";
      const colRef = collection(db, collectionName);
      await addDoc(colRef, report);
    }
    alert('✅ Berhasil menanam 5 data laporan dummy ke Firebase!');
  } catch (error) {
    console.error('Gagal menanam data:', error);
    alert('❌ Terjadi kesalahan saat menanam data laporan: ' + error.message);
  } finally {
    isSeeding.value = false;
  }
};

// 2. TANAM DATA KREDENSIAL ADMIN (HARDCODED AUTH & FIRESTORE ROLE)
const seedAdminRole = async () => {
  if (isAdminSeeding.value) return;
  isAdminSeeding.value = true;

  let successCount = 0;
  
  for (const admin of ADMIN_CREDENTIALS) {
    try {
      // 1. Buat akun Auth Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, admin.email, admin.password);
      const user = userCredential.user;

      // 2. Masukkan Role Admin ke Firestore koleksi 'users'
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nama: admin.nama_lengkap,
        displayName: admin.nama_lengkap,
        email: admin.email,
        role: admin.role,
        createdAt: new Date().toISOString(),
        photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(admin.nama_lengkap)}`
      });
      
      successCount++;
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`ℹ️ Akun Admin ${admin.email} sudah terdaftar sebelumnya.`);
      } else {
        console.error(`Gagal membuat akun admin ${admin.email}:`, error);
        alert(`❌ Terjadi kesalahan saat membuat akun admin ${admin.email}: ` + error.message);
      }
    }
  }

  alert(`Selesai memproses pendaftaran. ${successCount} Akun Super Admin baru berhasil dibuat di Firebase Auth.`);
  isAdminSeeding.value = false;
};
</script>
