<template>
  <div class="card-premium p-5 bg-amber-50 border border-amber-200 flex flex-col gap-3">
    <div class="flex items-center gap-2 text-amber-700 font-bold text-sm">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
      Tanam Data Dummy (Seed Database)
    </div>
    <p class="text-xs text-amber-600/80 leading-relaxed">
      Gunakan fitur ini untuk mengisi Firestore dengan data laporan acak secara otomatis agar Anda tidak perlu menginput manual saat testing Firebase.
    </p>
    <button 
      @click="seedDatabase" 
      :disabled="seeding"
      class="mt-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
    >
      <span v-if="seeding" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      {{ seeding ? 'Sedang Menanam Data...' : 'Mulai Tanam 8 Data Dummy' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { databaseService } from '../../firebase/databaseService';
import { useNotificationsStore } from '../../stores/notifications';

const seeding = ref(false);
const notifStore = useNotificationsStore();

const seedDatabase = async () => {
  if (seeding.value) return;
  seeding.value = true;
  
  const dummyData = [
    { type: 'missing', data: { namaBarang: 'iPhone 13 Pro Max', kategori: 'HP', warna: 'Biru Pasifik', lokasi: 'Perpustakaan Pusat', tanggal: '2023-11-01', deskripsi: 'Tertinggal di lantai 2 meja baca dekat jendela.', ciriKhusus: 'Ada goresan kecil di layar kiri atas, casing Spigen hitam.', latitude: -6.2088, longitude: 106.8456, status: 'missing', userId: 'user-demo-1' } },
    { type: 'found', data: { namaBarang: 'Dompet Kulit Coklat', kategori: 'Dompet', warna: 'Coklat', lokasi: 'Cafe Kopi', tanggal: '2023-11-02', deskripsi: 'Ditemukan di kursi sofa pojok setelah jam makan siang.', ciriKhusus: 'Ada KTP atas nama Budi dan beberapa struk belanja.', latitude: -6.2090, longitude: 106.8460, status: 'found', userId: 'user-demo-2' } },
    { type: 'missing', data: { namaBarang: 'MacBook Air M1', kategori: 'Laptop', warna: 'Silver', lokasi: 'Aula Seminar', tanggal: '2023-11-03', deskripsi: 'Lupa dimasukkan ke tas setelah acara seminar selesai.', ciriKhusus: 'Ada stiker VueJS dan logo startup di belakang.', latitude: -6.2085, longitude: 106.8450, status: 'missing', userId: 'user-demo-3' } },
    { type: 'found', data: { namaBarang: 'Kunci Motor Vario', kategori: 'Kunci', warna: 'Hitam', lokasi: 'Parkiran Utara', tanggal: '2023-11-04', deskripsi: 'Tergantung masih di lubang kunci motor.', ciriKhusus: 'Gantungan kunci karet bentuk beruang kecil.', latitude: -6.2095, longitude: 106.8470, status: 'found', userId: 'user-demo-4' } },
    { type: 'missing', data: { namaBarang: 'Tas Ransel Eiger', kategori: 'Tas', warna: 'Hitam', lokasi: 'Kampus Utama', tanggal: '2023-11-05', deskripsi: 'Hilang saat istirahat di gazebo fakultas.', ciriKhusus: 'Ada pin logo pramuka di tali kanannya.', latitude: -6.2080, longitude: 106.8440, status: 'missing', userId: 'user-demo-5' } },
    { type: 'found', data: { namaBarang: 'AirPods Pro Gen 2', kategori: 'Aksesoris', warna: 'Putih', lokasi: 'Aula Seminar', tanggal: '2023-11-06', deskripsi: 'Ditemukan tergeletak di bawah kursi nomor 12.', ciriKhusus: 'Pakai case silikon warna kuning mustard.', latitude: -6.2086, longitude: 106.8451, status: 'found', userId: 'user-demo-6' } },
    { type: 'missing', data: { namaBarang: 'KTM Mahasiswa Baru', kategori: 'Kartu Identitas', warna: 'Biru', lokasi: 'Perpustakaan Pusat', tanggal: '2023-11-07', deskripsi: 'Jatuh dari dompet pas lagi pinjem buku.', ciriKhusus: 'Fotonya pakai kemeja putih jas almamater.', latitude: -6.2089, longitude: 106.8457, status: 'missing', userId: 'user-demo-7' } },
    { type: 'found', data: { namaBarang: 'Botol Minum Corkcicle', kategori: 'Lainnya...', warna: 'Pink', lokasi: 'Kampus Utama', tanggal: '2023-11-08', deskripsi: 'Ditemukan di meja kantin blok A.', ciriKhusus: 'Bagian bawahnya ada penyok sedikit.', latitude: -6.2081, longitude: 106.8441, status: 'found', userId: 'user-demo-8' } }
  ];

  try {
    let count = 0;
    // Menggunakan perulangan untuk meniru batch insert (dalam skenario asli gunakan batch write Firebase)
    for (const item of dummyData) {
      const colName = item.type === 'missing' ? 'missing_items' : 'found_items';
      await databaseService.addDoc(colName, item.data);
      count++;
    }
    notifStore.showToast(`Berhasil menanam ${count} data dummy ke Firebase!`, 'success');
  } catch (err) {
    notifStore.showToast(`Gagal melakukan seeding: ${err.message}`, 'error');
  } finally {
    seeding.value = false;
  }
};
</script>
