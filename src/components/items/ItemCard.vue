<template>
  <RouterLink 
    :to="`/item/${type}/${item.id}`" 
    class="card-premium flex flex-col h-full group overflow-hidden border border-slate-100/80 bg-white"
  >
    <!-- Card Image Header -->
    <div class="relative w-full h-48 bg-slate-100 overflow-hidden flex-shrink-0">
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-10"></div>
      
      <!-- Actual Image -->
      <img 
        :src="item.foto || 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=400'" 
        alt="Barang" 
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      <!-- Dynamic Status Badge Overlay -->
      <span 
        class="absolute top-4 left-4 z-20 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm text-white"
        :class="{
          'bg-rose-500': item.status === 'missing',
          'bg-sky-500': item.status === 'found',
          'bg-amber-500 text-slate-900': item.status === 'matching',
          'bg-emerald-500': item.status === 'verified',
          'bg-slate-500': item.status === 'returned',
        }"
      >
        {{ getStatusLabel(item.status) }}
      </span>

      <!-- Category Overlay -->
      <span class="absolute bottom-4 left-4 z-20 text-[10px] font-bold text-white bg-slate-900/60 backdrop-blur-xs px-2.5 py-1 rounded-lg">
        {{ item.kategori }}
      </span>
    </div>

    <!-- Card Contents -->
    <div class="p-5 flex-grow flex flex-col justify-between">
      <div>
        <h4 class="text-sm font-black text-slate-800 leading-snug group-hover:text-brand-500 transition-colors line-clamp-1">
          {{ item.namaBarang }}
        </h4>
        <p class="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {{ item.deskripsi }}
        </p>
      </div>

      <!-- Footer Info -->
      <div class="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
        <!-- Location -->
        <span class="flex items-center gap-1 font-semibold text-slate-500 truncate max-w-[150px]">
          <svg class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ item.lokasi }}
        </span>

        <!-- Date -->
        <span class="flex-shrink-0 text-slate-400 font-medium">
          {{ formatDate(item.tanggal) }}
        </span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from "vue-router";

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    required: true // 'missing' or 'found'
  }
});

const getStatusLabel = (status) => {
  const labels = {
    missing: "Hilang",
    found: "Ditemukan",
    matching: "Cocok",
    verified: "Terverifikasi",
    returned: "Selesai"
  };
  return labels[status] || status;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Ags", "Sep", "Okt", "Nov", "Des"
  ];
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  return `${date.getDate()} ${months[date.getMonth()]}`;
};
</script>
