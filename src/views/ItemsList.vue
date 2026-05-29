<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight font-sans">
          {{ isMissingTab ? 'Katalog Barang Hilang' : 'Katalog Barang Ditemukan' }}
        </h1>
        <p class="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
          {{ isMissingTab ? 'Cari barang Anda yang hilang di lingkungan kampus' : 'Lihat barang temuan yang diamankan di pos' }}
        </p>
      </div>

      <!-- Toggle Tabs -->
      <div class="flex bg-slate-100 p-1 rounded-xl gap-1">
        <button 
          @click="switchTab('missing')" 
          class="text-xs font-bold uppercase tracking-wide px-4 py-2.5 rounded-xl transition-all"
          :class="isMissingTab ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
        >
          Barang Hilang
        </button>
        <button 
          @click="switchTab('found')" 
          class="text-xs font-bold uppercase tracking-wide px-4 py-2.5 rounded-xl transition-all"
          :class="!isMissingTab ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
        >
          Barang Temuan
        </button>
      </div>
    </div>

    <!-- Smart Search Bar with Multi-Filters -->
    <div class="card-premium p-5 bg-white flex flex-col gap-4">
      <!-- Search Input -->
      <div class="relative w-full">
        <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </span>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Cari berdasarkan nama barang, ciri khusus, warna..."
          class="text-xs rounded-xl border border-slate-200 pl-10 pr-4 py-3.5 w-full focus:border-brand-500 focus:outline-none"
        />
        <span v-if="searchQuery" class="absolute inset-y-0 right-0 pr-3.5 flex items-center">
          <button @click="searchQuery = ''" class="text-slate-400 hover:text-slate-600">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </span>
      </div>

      <!-- Filters Row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
        <!-- 1. Kategori -->
        <select 
          v-model="filterCategory"
          class="text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none bg-slate-50/50"
        >
          <option value="">Semua Kategori</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <!-- 2. Lokasi -->
        <select 
          v-model="filterLocation"
          class="text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none bg-slate-50/50"
        >
          <option value="">Semua Lokasi</option>
          <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
        </select>

        <!-- 3. Status -->
        <select 
          v-model="filterStatus"
          class="text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none bg-slate-50/50"
        >
          <option value="">Semua Status</option>
          <option value="missing" v-if="isMissingTab">Hilang</option>
          <option value="found" v-else>Ditemukan</option>
          <option value="matching">Status Cocok</option>
          <option value="verified">Terverifikasi</option>
          <option value="returned">Kembali/Selesai</option>
        </select>

        <!-- 4. Sorting -->
        <select 
          v-model="sortBy"
          class="text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-none bg-slate-50/50 col-span-1"
        >
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
        </select>

        <!-- 5. Clear Filters Button -->
        <button 
          @click="clearFilters"
          class="text-xs font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl px-4 py-2.5 border border-rose-100/50 transition-colors col-span-2 sm:col-span-1"
        >
          Reset Filter
        </button>
      </div>
    </div>

    <!-- Items Grid Section -->
    <div v-if="itemsStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Skeleton v-for="i in 8" :key="i" />
    </div>

    <!-- Empty State -->
    <div v-else-if="paginatedItems.length === 0" class="card-premium p-16 text-center bg-white flex flex-col items-center justify-center gap-4">
      <div class="w-16 h-16 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 8 8 0 0118 0z"/></svg>
      </div>
      <div>
        <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wide">Laporan Tidak Ditemukan</h3>
        <p class="text-xs text-slate-400 mt-1 max-w-sm leading-relaxed">Tidak ada barang yang cocok dengan kriteria kata kunci atau filter pencarian Anda saat ini.</p>
      </div>
    </div>

    <!-- Grid items rendering -->
    <div v-else class="flex flex-col gap-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ItemCard 
          v-for="item in paginatedItems" 
          :key="item.id" 
          :item="item" 
          :type="isMissingTab ? 'missing' : 'found'"
        />
      </div>

      <!-- Pagination Footer -->
      <div v-if="totalPages > 1" class="flex justify-between items-center pt-4 border-t border-slate-100">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="flex items-center gap-1 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-500 bg-white hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          &larr; Sebelumnya
        </button>
        
        <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider">Halaman {{ currentPage }} dari {{ totalPages }}</span>
        
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="flex items-center gap-1 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-500 bg-white hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          Berikutnya &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useItemsStore } from "../stores/items";
import { useDebounce } from "../composables/useDebounce";
import ItemCard from "../components/items/ItemCard.vue";
import Skeleton from "../components/common/Skeleton.vue";

const route = useRoute();
const router = useRouter();
const itemsStore = useItemsStore();

// Sync list on mount
let unsubItems = null;
onMounted(() => {
  unsubItems = itemsStore.initializeItems();
});

onUnmounted(() => {
  if (unsubItems) unsubItems();
});

// Detect tab mode based on route path
const isMissingTab = computed(() => route.path === "/missing");

// Filters & State
const searchQuery = ref("");
const filterCategory = ref("");
const filterLocation = ref("");
const filterStatus = ref("");
const sortBy = ref("newest");

const categories = ["HP", "Laptop", "Dompet", "Tas", "Kunci", "Kartu Identitas", "Aksesoris", "Lainnya"];
const locations = ["Kampus Utama", "Cafe Kopi", "Perpustakaan Pusat", "Parkiran Utara", "Aula Seminar"];

// Apply useDebounce composable to search query!
const debouncedSearch = useDebounce(searchQuery, 300);

// Pagination settings
const currentPage = ref(1);
const itemsPerPage = 8;

const switchTab = (tab) => {
  clearFilters();
  router.push(`/${tab}`);
};

const clearFilters = () => {
  searchQuery.value = "";
  filterCategory.value = "";
  filterLocation.value = "";
  filterStatus.value = "";
  sortBy.value = "newest";
  currentPage.value = 1;
};

// Reset page upon filters modification
watch([debouncedSearch, filterCategory, filterLocation, filterStatus, sortBy], () => {
  currentPage.value = 1;
});

// Core filter & sort engine
const filteredItems = computed(() => {
  const allItems = isMissingTab.value ? itemsStore.missingItems : itemsStore.foundItems;
  let items = [...allItems];

  // 1. Search Query Debounced Filter
  if (debouncedSearch.value.trim() !== "") {
    const q = debouncedSearch.value.toLowerCase().trim();
    items = items.filter(
      item => 
        item.namaBarang.toLowerCase().includes(q) ||
        item.deskripsi.toLowerCase().includes(q) ||
        item.warna.toLowerCase().includes(q) ||
        item.ciriKhusus.toLowerCase().includes(q)
    );
  }

  // 2. Category Filter
  if (filterCategory.value !== "") {
    items = items.filter(item => item.kategori === filterCategory.value);
  }

  // 3. Location Filter
  if (filterLocation.value !== "") {
    items = items.filter(item => item.lokasi === filterLocation.value);
  }

  // 4. Status Filter
  if (filterStatus.value !== "") {
    items = items.filter(item => item.status === filterStatus.value);
  }

  // 5. Sorting
  items.sort((a, b) => {
    const dateA = new Date(a.createdAt || a.tanggal);
    const dateB = new Date(b.createdAt || b.tanggal);
    return sortBy.value === "newest" ? dateB - dateA : dateA - dateB;
  });

  return items;
});

// Pagination calculations
const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage);
});

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredItems.value.slice(start, start + itemsPerPage);
});
</script>
