<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
          <span class="text-[10px] font-extrabold text-brand-600 uppercase tracking-widest">Dashboard Aktivitas</span>
        </div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight font-sans">Kalender Barang Hilang & Temuan</h1>
        <p class="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
          Jelajahi lini masa pelaporan barang berdasarkan tanggal kejadian
        </p>
      </div>
    </div>

    <!-- 1. Statistics Highlights Widget -->
    <div class="grid grid-cols-3 gap-4">
      <div class="card-premium p-4 bg-[#fdfcf7] flex flex-col gap-1 border-b-4 border-rose-500">
        <span class="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Laporan Hilang</span>
        <h3 class="text-xl font-black text-rose-500 leading-none mt-1">{{ monthlyStats.lost }}</h3>
        <p class="text-[9px] text-slate-400 mt-1">Bulan ini</p>
      </div>
      
      <div class="card-premium p-4 bg-[#fdfcf7] flex flex-col gap-1 border-b-4 border-brand-500">
        <span class="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Laporan Temuan</span>
        <h3 class="text-xl font-black text-brand-500 leading-none mt-1">{{ monthlyStats.found }}</h3>
        <p class="text-[9px] text-slate-400 mt-1">Bulan ini</p>
      </div>

      <div class="card-premium p-4 bg-[#fdfcf7] flex flex-col gap-1 border-b-4 border-accent-600">
        <span class="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Telah Dikembalikan</span>
        <h3 class="text-xl font-black text-accent-600 leading-none mt-1">{{ monthlyStats.resolved }}</h3>
        <p class="text-[9px] text-slate-400 mt-1">Selesai diklaim</p>
      </div>
    </div>

    <!-- Main Content: Calendar Grid + Selected Day Panel -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left side: Calendar Grid (8 Cols) -->
      <div class="lg:col-span-8 flex flex-col gap-4">
        <div class="card-premium p-6 bg-[#fdfcf7] flex flex-col gap-6 relative">
          <!-- Calendar Header: Month/Year selector -->
          <div class="flex justify-between items-center pb-4 border-b border-brand-50/50">
            <h2 class="text-sm font-black text-slate-800 uppercase tracking-wider">
              {{ currentMonthName }} {{ currentYear }}
            </h2>
            
            <div class="flex items-center gap-1.5">
              <button 
                @click="changeMonth(-1)"
                class="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-all duration-200 active:scale-90"
              >
                &larr;
              </button>
              <button 
                @click="setToday"
                class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-bold text-slate-600 uppercase tracking-wider transition-all duration-200 active:scale-95"
              >
                Hari Ini
              </button>
              <button 
                @click="changeMonth(1)"
                class="w-8 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-all duration-200 active:scale-90"
              >
                &rarr;
              </button>
            </div>
          </div>

          <!-- Week Days Headers -->
          <div class="grid grid-cols-7 gap-2 text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            <span v-for="d in weekDays" :key="d" class="py-1">{{ d }}</span>
          </div>

          <!-- Calendar Days Grid -->
          <div class="grid grid-cols-7 gap-2">
            <!-- Empty cells for leading padding days -->
            <div 
              v-for="empty in leadDays" 
              :key="`empty-${empty}`" 
              class="aspect-square bg-slate-50/40 rounded-2xl border border-dashed border-slate-100"
            ></div>

            <!-- Calendar Active Cells -->
            <div 
              v-for="day in daysInMonth" 
              :key="`day-${day}`"
              @click="selectDay(day)"
              @mouseenter="hoverDay(day, $event)"
              @mouseleave="leaveDay"
              class="aspect-square rounded-2xl border flex flex-col items-center justify-between p-2 cursor-pointer relative transition-all duration-300 hover:scale-105 active:scale-95 group"
              :class="getDayCellClass(day)"
            >
              <!-- Day Number -->
              <span class="text-xs font-bold leading-none select-none transition-colors" :class="getDayNumClass(day)">
                {{ day }}
              </span>

              <!-- Status markers (Rose, Sage, Gold dots) -->
              <div class="flex gap-1 justify-center items-center h-2 flex-wrap max-w-full">
                <span 
                  v-for="(marker, idx) in getDayMarkers(day)" 
                  :key="idx"
                  class="w-1.5 h-1.5 rounded-full"
                  :class="marker.color"
                ></span>
              </div>
            </div>
          </div>

          <!-- Hover Tooltip Overlay (Framer Motion level hover card) -->
          <Transition name="fade">
            <div 
              v-if="hoveredDayData && hoveredDayData.items.length > 0"
              class="absolute z-[1000] pointer-events-none w-64 glass p-4 rounded-2xl shadow-xl flex flex-col gap-2.5 transition-all duration-200"
              :style="{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }"
            >
              <div class="border-b border-brand-100/50 pb-1.5">
                <h4 class="text-[10px] font-extrabold uppercase text-brand-700 tracking-wider">Laporan pada {{ formatSelectedDate(hoveredDayData.day) }}</h4>
              </div>
              <div class="flex flex-col gap-2 max-h-36 overflow-y-auto">
                <div 
                  v-for="it in hoveredDayData.items" 
                  :key="it.id"
                  class="flex items-center gap-2"
                >
                  <img :src="it.foto || 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=80'" class="w-8 h-8 rounded-lg object-cover border border-slate-100 flex-shrink-0" />
                  <div class="min-w-0 flex-grow">
                    <h5 class="text-[10px] font-bold text-slate-800 truncate leading-tight">{{ it.namaBarang }}</h5>
                    <span 
                      class="text-[8px] font-extrabold uppercase tracking-wider"
                      :class="it.status === 'missing' ? 'text-rose-500' : ['verified','returned'].includes(it.status) ? 'text-accent-600' : 'text-brand-600'"
                    >
                      {{ it.status === 'missing' ? 'Hilang' : ['verified','returned'].includes(it.status) ? 'Selesai' : 'Ditemukan' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Right side: Selected Day Detail list (4 Cols) -->
      <div class="lg:col-span-4 flex flex-col gap-4">
        <div class="card-premium p-6 bg-[#fdfcf7] flex flex-col gap-5 min-h-[400px]">
          <div class="border-b border-brand-100 pb-3">
            <h3 class="text-xs font-black text-slate-800 uppercase tracking-wider">Detail Aktivitas Tanggal</h3>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              {{ formatSelectedDate(selectedDay) }}
            </p>
          </div>

          <div v-if="selectedDayItems.length === 0" class="flex-grow flex flex-col justify-center items-center text-center p-8 text-slate-400 gap-2">
            <span class="text-2xl">🍃</span>
            <p class="text-[10px] uppercase font-extrabold tracking-wider">Tidak ada aktivitas laporan terdaftar</p>
          </div>

          <div v-else class="flex-grow flex flex-col gap-3.5 overflow-y-auto max-h-[450px] pr-1">
            <div 
              v-for="it in selectedDayItems" 
              :key="it.id"
              class="p-4 rounded-2xl bg-white border border-[#e4eeeb] flex flex-col gap-3 transition-all hover:scale-102 shadow-sm"
            >
              <div class="flex items-center gap-3">
                <img :src="it.foto || 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=100'" class="w-12 h-12 rounded-xl object-cover border border-slate-100 flex-shrink-0" />
                <div class="min-w-0">
                  <span 
                    class="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    :class="it.status === 'missing' 
                      ? 'bg-rose-50 text-rose-600' 
                      : ['verified', 'returned'].includes(it.status)
                        ? 'bg-accent-50 text-accent-700' 
                        : 'bg-brand-50 text-brand-600'"
                  >
                    {{ it.status === 'missing' ? 'Hilang' : ['verified','returned'].includes(it.status) ? 'Selesai' : 'Ditemukan' }}
                  </span>
                  <h4 class="text-xs font-bold text-slate-800 truncate mt-1.5 leading-snug">{{ it.namaBarang }}</h4>
                  <p class="text-[10px] text-slate-400 leading-none mt-0.5">{{ it.lokasi }}</p>
                </div>
              </div>

              <div class="flex justify-between items-center pt-2 border-t border-slate-50 mt-1">
                <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Oleh: {{ getSenderName(it) }}</span>
                <RouterLink 
                  :to="`/item/${it.status === 'missing' ? 'missing' : 'found'}/${it.id}`"
                  class="text-[10px] font-extrabold text-brand-500 hover:text-brand-600 flex items-center gap-0.5 hover:underline"
                >
                  <span>Lihat Detail</span>
                  <span>&rarr;</span>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { RouterLink } from "vue-router";
import { useItemsStore } from "../stores/items";

const itemsStore = useItemsStore();

// Calendar active dates states
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const selectedDay = ref(new Date().getDate());

// Tooltip positioning and hover states
const hoveredDayData = ref(null);
const tooltipPos = ref({ x: 0, y: 0 });

const weekDays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const monthsNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// Initialize items on mount
let unsubItems = null;
onMounted(() => {
  unsubItems = itemsStore.initializeItems();
});

onUnmounted(() => {
  if (unsubItems) unsubItems();
});

// Format month name
const currentMonthName = computed(() => monthsNames[currentMonth.value]);

// Calculate calendar grid sizes
const leadDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1).getDay();
  return firstDay;
});

const daysInMonth = computed(() => {
  const lastDate = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
  return lastDate;
});

// Sync all missing + found items
const allItems = computed(() => {
  return [...itemsStore.missingItems, ...itemsStore.foundItems];
});

// Monthly stats selector
const monthlyStats = computed(() => {
  const list = allItems.value.filter(it => {
    const d = new Date(it.tanggal);
    return d.getMonth() === currentMonth.value && d.getFullYear() === currentYear.value;
  });

  return {
    lost: list.filter(it => it.status === "missing").length,
    found: list.filter(it => !["missing", "verified", "returned"].includes(it.status)).length,
    resolved: list.filter(it => ["verified", "returned"].includes(it.status)).length
  };
});

// Selected day items compiler
const selectedDayItems = computed(() => {
  if (!selectedDay.value) return [];
  const dateStr = formatDateStr(selectedDay.value);
  return allItems.value.filter(it => it.tanggal === dateStr);
});

// Helper: Format YYYY-MM-DD
const formatDateStr = (day) => {
  const mm = String(currentMonth.value + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${currentYear.value}-${mm}-${dd}`;
};

// Actions
const selectDay = (day) => {
  selectedDay.value = day;
};

const changeMonth = (offset) => {
  let newMonth = currentMonth.value + offset;
  let newYear = currentYear.value;

  if (newMonth < 0) {
    newMonth = 11;
    newYear -= 1;
  } else if (newMonth > 11) {
    newMonth = 0;
    newYear += 1;
  }

  currentMonth.value = newMonth;
  currentYear.value = newYear;

  // Sync selected day to last day of month if out of bounds
  const lastDay = new Date(newYear, newMonth + 1, 0).getDate();
  if (selectedDay.value > lastDay) {
    selectedDay.value = lastDay;
  }
};

const setToday = () => {
  const d = new Date();
  currentMonth.value = d.getMonth();
  currentYear.value = d.getFullYear();
  selectedDay.value = d.getDate();
};

// Hover tooltip triggers
const hoverDay = (day, event) => {
  const dateStr = formatDateStr(day);
  const items = allItems.value.filter(it => it.tanggal === dateStr);
  
  if (items.length > 0) {
    // Relative position bounding box
    const cardEl = event.currentTarget;
    const parentEl = cardEl.offsetParent;
    
    // Position it float top-center of the hovered day cell
    const x = cardEl.offsetLeft - (256 - cardEl.offsetWidth) / 2;
    const y = cardEl.offsetTop - 145; // float above
    
    tooltipPos.value = { 
      x: Math.max(10, Math.min(x, parentEl.clientWidth - 270)), // clamp bounding
      y: y 
    };
    
    hoveredDayData.value = { day, items };
  } else {
    hoveredDayData.value = null;
  }
};

const leaveDay = () => {
  hoveredDayData.value = null;
};

// Styling helpers
const getDayCellClass = (day) => {
  const isSelected = selectedDay.value === day;
  const isToday = isDateToday(day);
  
  let classes = "";
  if (isSelected) {
    classes = "bg-brand-50 border-brand-300 ring-2 ring-brand-100 shadow-sm";
  } else if (isToday) {
    classes = "bg-[#fdfcf7] border-accent-400 shadow-xs";
  } else {
    classes = "bg-white border-[#e4eeeb] hover:bg-slate-50/50";
  }
  
  return classes;
};

const getDayNumClass = (day) => {
  const isSelected = selectedDay.value === day;
  const isToday = isDateToday(day);
  
  if (isSelected) return "text-brand-600 font-extrabold";
  if (isToday) return "text-accent-600 font-extrabold underline underline-offset-4 decoration-2";
  return "text-slate-700";
};

const isDateToday = (day) => {
  const d = new Date();
  return d.getDate() === day && d.getMonth() === currentMonth.value && d.getFullYear() === currentYear.value;
};

// Generate dots dynamically
const getDayMarkers = (day) => {
  const dateStr = formatDateStr(day);
  const list = allItems.value.filter(it => it.tanggal === dateStr);
  
  const markers = [];
  
  if (list.some(it => it.status === "missing")) {
    markers.push({ color: "bg-rose-500" });
  }
  if (list.some(it => !["missing", "verified", "returned"].includes(it.status))) {
    markers.push({ color: "bg-brand-500" });
  }
  if (list.some(it => ["verified", "returned"].includes(it.status))) {
    markers.push({ color: "bg-accent-600" });
  }
  
  return markers;
};

// Format beautiful date in ID
const formatSelectedDate = (day) => {
  if (!day) return "";
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  const d = new Date(currentYear.value, currentMonth.value, day);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

// Helper: Get sender display name
const getSenderName = (item) => {
  const users = JSON.parse(localStorage.getItem("ll_users") || "[]");
  const match = users.find(u => u.uid === item.userId);
  return match ? match.nama : "Pengguna LostLink";
};
</script>

<style scoped>
/* Tooltip Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(4px);
}
</style>
