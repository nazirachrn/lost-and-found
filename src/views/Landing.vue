<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-between">
    <!-- Navbar placeholder when user is guest, handled globally by App.vue but Navbar is displayed inside layouts -->

    <main class="flex-grow">
      <!-- 1. Hero Section -->
      <section class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 flex flex-col items-center text-center overflow-hidden">
        <!-- Backdrop glowing blur spheres -->
        <div class="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-brand-200/40 blur-3xl glow-brand animate-pulse-subtle"></div>
        <div class="absolute top-40 -right-20 w-80 h-80 rounded-full bg-accent-200/30 blur-3xl glow-accent animate-pulse-subtle"></div>

        <div class="relative z-10 flex flex-col items-center">
          <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-bold uppercase tracking-wider mb-6">
            <span class="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping"></span>
            Sistem Barang Hilang & Ditemukan Kampus Anda
          </span>

          <h1 class="text-4xl md:text-6xl font-black text-slate-800 tracking-tight leading-[1.1] max-w-4xl font-sans">
            Menghubungkan <span class="bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">Barang Hilang</span> dengan Pemiliknya secara Aman
          </h1>
          
          <p class="text-slate-400 text-md md:text-lg font-medium mt-6 max-w-2xl leading-relaxed">
            LostLink membantu Anda melaporkan barang hilang, mengunggah temuan barang, melakukan pencarian realtime, dan membuktikan kepemilikan melalui verifikasi admin.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 mt-10">
            <RouterLink 
              :to="user ? '/dashboard' : '/register'" 
              class="px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-100 transition-all hover:scale-102 flex items-center gap-2 justify-center"
            >
              <span>Mulai Laporkan Sekarang</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
            </RouterLink>
            
            <RouterLink 
              :to="user ? '/found' : '/login'" 
              class="px-8 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all hover:scale-102 flex items-center gap-2 justify-center"
            >
              <span>Cari Barang Temuan</span>
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- 2. Statistics Counter -->
      <section class="bg-white border-y border-slate-100 py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="stat in stats" :key="stat.title" class="flex flex-col items-center text-center">
            <span class="text-3xl md:text-4xl font-black text-slate-800 bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">{{ stat.number }}</span>
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">{{ stat.title }}</span>
          </div>
        </div>
      </section>

      <!-- 3. How It Works Section -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight font-sans">Cara Kerja Aplikasi</h2>
        <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mt-2">Langkah mudah mengembalikan barang berharga</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div 
            v-for="(step, index) in steps" 
            :key="step.title" 
            class="card-premium p-8 flex flex-col items-center text-center bg-white"
          >
            <div class="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 text-lg font-black mb-6">
              {{ index + 1 }}
            </div>
            <h3 class="text-md font-extrabold text-slate-800">{{ step.title }}</h3>
            <p class="text-xs text-slate-400 mt-3 leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </section>

      <!-- 4. Features list -->
      <section class="bg-slate-100/50 py-24 border-y border-slate-200/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span class="text-xs font-bold text-brand-600 uppercase tracking-wider">Fitur Unggulan</span>
            <h2 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight font-sans mt-2">Didesain dengan Keamanan dan Kemudahan di Intinya</h2>
            <p class="text-slate-400 text-xs font-medium mt-4 leading-relaxed">
              LostLink menggabungkan teknologi pemetaan geografis dan pencocokan otomatis pintar agar penemuan barang kembali ke pemilik sah secara akurat.
            </p>

            <div class="flex flex-col gap-4 mt-8">
              <div v-for="feat in features" :key="feat.title" class="flex gap-4 items-start">
                <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                </div>
                <div>
                  <h4 class="text-xs font-extrabold text-slate-800 uppercase tracking-wider">{{ feat.title }}</h4>
                  <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">{{ feat.desc }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Feature Image Showcase Mockup -->
          <div class="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white p-4">
            <img 
              src="https://images.unsplash.com/photo-1496181130204-7552cc15f1e3?w=800" 
              alt="Dashboard Showcase" 
              class="w-full h-80 object-cover rounded-xl border border-slate-100"
            />
            <div class="absolute bottom-10 left-10 right-10 glass p-5 rounded-2xl shadow-lg flex items-center justify-between border border-white">
              <div>
                <h4 class="text-xs font-bold text-slate-800">Auto Matching Engine</h4>
                <p class="text-[10px] text-slate-400 mt-0.5 leading-snug">Menemukan kesamaan kategori & warna</p>
              </div>
              <span class="px-3 py-1 bg-emerald-500 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-full">Potential Match!</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Testimonials dummy -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center mb-16">
          <h2 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight font-sans">Cerita Sukses Pengguna</h2>
          <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mt-2">Mereka yang terbantu oleh LostLink</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="testi in testimonials" 
            :key="testi.name" 
            class="card-premium p-6 flex flex-col justify-between bg-white"
          >
            <p class="text-xs text-slate-500 italic leading-relaxed">
              "{{ testi.quote }}"
            </p>
            <div class="flex items-center gap-3 mt-6 pt-4 border-t border-slate-50">
              <img :src="testi.avatar" alt="Avatar" class="w-9 h-9 rounded-full border border-slate-100" />
              <div>
                <h4 class="text-xs font-extrabold text-slate-800 leading-snug">{{ testi.name }}</h4>
                <p class="text-[10px] text-slate-400 mt-0.5 leading-snug">{{ testi.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Sleek Footer -->
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const user = computed(() => authStore.currentUser);

const stats = [
  { number: "95%", title: "Tingkat Akurasi" },
  { number: "450+", title: "Laporan Selesai" },
  { number: "15 Menit", title: "Rata-rata Respon" },
  { number: "5000+", title: "Pengguna Kampus" }
];

const steps = [
  {
    title: "1. Laporkan Barang",
    desc: "Tulis detail nama barang, warna, kategori, tanggal, lokasi koordinat peta, dan ciri khusus fisik."
  },
  {
    title: "2. Verifikasi Kepemilikan",
    desc: "Bila barang ditemukan cocok, pemilik sah mengajukan bukti kepemilikan dan diverifikasi oleh Admin."
  },
  {
    title: "3. Serah Terima Aman",
    desc: "Lakukan komunikasi melalui chat internal terlindung (tanpa menyebarkan nomor HP pribadi) dan sepakati tempat."
  }
];

const features = [
  {
    title: "Smart Auto-Matching",
    desc: "Algoritma mencocokkan kategori barang, warna mirip, lokasi, dan tanggal terdekat secara realtime."
  },
  {
    title: "Internal Realtime Chat",
    desc: "Pemilik dan penemu dapat berdiskusi langsung secara aman tanpa khawatir privasi nomor kontak bocor."
  },
  {
    title: "Claim Verification System",
    desc: "Verifikasi terpusat oleh Admin mencegah penyalahgunaan barang temuan oleh pihak yang tidak bertanggung jawab."
  }
];

const testimonials = [
  {
    name: "Fandi Ahmad",
    role: "Mahasiswa Teknik Elektro",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Fandi",
    quote: "iPhone saya terjatuh saat praktikum di perpus, lapor lewat LostLink dan 10 menit kemudian dicocokkan dengan temuan temen. Sangat terbantu!"
  },
  {
    name: "Clara Sinta",
    role: "Mahasiswi FEB",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Clara",
    quote: "KTM saya jatuh dan langsung diunggah oleh Budi. Proses verifikasi admin cepet dan aman!"
  },
  {
    name: "Nazira Chairani",
    role: "Mahasiswi Teknik Kimia",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Nazira",
    quote: "Sering nemu kunci motor di parkiran, ditaruh di sini langsung terhubung ke pemiliknya. UI modern dan sangat mudah digunakan."
  }
];
</script>
