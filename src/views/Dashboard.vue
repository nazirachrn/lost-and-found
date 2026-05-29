<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
    <!-- Header Summary -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight font-sans">Dashboard Utama</h1>
        <p class="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Pantau status laporan dan kecocokan barang Anda</p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex gap-2">
        <RouterLink 
          to="/report-missing" 
          class="bg-rose-500 hover:bg-rose-600 text-white text-xs font-black px-4.5 py-2.5 rounded-xl shadow-md shadow-rose-100 transition-all hover:scale-102 flex items-center gap-1.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 8 8 0 0118 0z"/></svg>
          <span>Laporkan Barang Hilang</span>
        </RouterLink>
        
        <RouterLink 
          to="/report-found" 
          class="bg-sky-500 hover:bg-sky-600 text-white text-xs font-black px-4.5 py-2.5 rounded-xl shadow-md shadow-sky-100 transition-all hover:scale-102 flex items-center gap-1.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 8 8 0 0118 0z"/></svg>
          <span>Temukan Barang</span>
        </RouterLink>
      </div>
    </div>

    <!-- 1. Metric Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div 
        v-for="stat in metrics" 
        :key="stat.title"
        class="card-premium p-5 flex items-center gap-4 bg-white border-l-4"
        :style="{ borderLeftColor: stat.color }"
      >
        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-slate-800" :style="{ backgroundColor: stat.bgColor }">
          <component :is="stat.icon" class="w-5 h-5" :style="{ color: stat.color }" />
        </div>
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ stat.title }}</span>
          <h3 class="text-xl font-black text-slate-800 mt-0.5 leading-snug">{{ stat.value }} <span class="text-[10px] font-semibold text-slate-400">barang</span></h3>
        </div>
      </div>
    </div>

    <!-- 1.5. Claims Pending Approval (Klaim Masuk direct approvals) -->
    <div v-if="incomingClaims.length > 0" class="flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <span class="w-2.5 h-2.5 rounded-full bg-accent-500 animate-ping"></span>
        <h3 class="text-xs font-extrabold uppercase tracking-wider text-brand-700">Klaim Kepemilikan Masuk ({{ incomingClaims.length }})</h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div 
          v-for="claim in incomingClaims" 
          :key="claim.id"
          class="card-premium p-6 bg-[#fdfcf7] flex flex-col gap-4 border-2 border-brand-200/50 hover:border-brand-300 transition-all duration-300"
        >
          <!-- Claimant header -->
          <div class="flex items-center justify-between border-b border-brand-100/50 pb-3">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-black text-xs">
                {{ claim.claimantName.charAt(0) }}
              </div>
              <div>
                <h4 class="text-xs font-extrabold text-slate-800 leading-snug">{{ claim.claimantName }}</h4>
                <p class="text-[10px] text-slate-400 mt-0.5 leading-none">Mengajukan klaim bukti</p>
              </div>
            </div>
            
            <span class="px-2.5 py-1 rounded-xl bg-accent-100 text-accent-700 text-[10px] font-extrabold uppercase tracking-wider">
              {{ claim.itemName }}
            </span>
          </div>

          <!-- Claim Details -->
          <div class="flex flex-col gap-2 text-[11px] text-slate-600 leading-relaxed bg-[#f8fbf9] p-3 rounded-2xl border border-brand-50/50">
            <p><strong class="text-slate-800">Ciri Khusus:</strong> {{ claim.ciriKhusus }}</p>
            <p><strong class="text-slate-800">Isi di Dalam:</strong> {{ claim.isiBarang }}</p>
            <p><strong class="text-slate-800">Bukti Tambahan:</strong> {{ claim.buktiTambahan }}</p>
            
            <!-- Picture proof, if any -->
            <div v-if="claim.fotoPendukung" class="mt-2">
              <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Foto Bukti Pendukung:</p>
              <img :src="claim.fotoPendukung" class="w-28 h-20 object-cover rounded-xl border border-slate-100" />
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 justify-end pt-2">
            <button 
              @click="handleRejectClaim(claim)"
              :disabled="processingId === claim.id"
              class="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 text-xs font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50"
            >
              Tolak Klaim
            </button>
            <button 
              @click="handleApproveClaim(claim)"
              :disabled="processingId === claim.id"
              class="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-black rounded-xl shadow-md shadow-brand-100 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              <span v-if="processingId === claim.id" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Setujui Kepemilikan ✓</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Auto-Matching System Highlights -->
    <div v-if="ownMatches.length > 0" class="flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
        <h3 class="text-xs font-extrabold uppercase tracking-wider text-amber-600">Pencocokan Otomatis Pintar (Potential Matches)</h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          v-for="match in ownMatches.slice(0, 4)" 
          :key="match.id" 
          class="glass border-amber-200 bg-amber-50/45 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glow-accent transition-all duration-300 hover:shadow-md"
        >
          <div>
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
              Kecocokan {{ match.score }}%
            </span>
            <h4 class="text-sm font-extrabold text-slate-800 mt-2 leading-snug">
              {{ match.ownItem.namaBarang }} &harr; {{ match.matchedItem.namaBarang }}
            </h4>
            <p class="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Kategori <strong class="text-slate-700">{{ match.ownItem.kategori }}</strong> serupa ditaruh di <strong class="text-slate-700">{{ match.matchedItem.lokasi }}</strong> oleh {{ match.matchedItem.senderName || 'Pengguna Lain' }}.
            </p>
          </div>

          <RouterLink 
            :to="`/item/${match.matchedType}/${match.matchedItem.id}`" 
            class="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-black px-4 py-2 rounded-xl transition-all active:scale-95 shadow-md shadow-amber-200"
          >
            Lihat Kecocokan
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- 3. Chart & Analytics Dashboard Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <SimpleChart 
          title="Analisis Bulanan Laporan" 
          :data="chartWeeklyData" 
          :donutData="chartCategoryData"
        />
      </div>
      
      <!-- Quick Info Guides -->
      <div class="card-premium p-6 bg-white flex flex-col justify-between">
        <div>
          <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-4">Panduan Keamanan</h3>
          
          <div class="flex flex-col gap-4">
            <div 
              v-for="guide in safetyGuides" 
              :key="guide.title" 
              class="flex gap-3 items-start"
            >
              <div class="w-6 h-6 rounded bg-brand-50 text-brand-500 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                i
              </div>
              <div>
                <h4 class="text-xs font-bold text-slate-700">{{ guide.title }}</h4>
                <p class="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{{ guide.desc }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <RouterLink 
          to="/missing" 
          class="w-full text-center py-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/50 text-xs font-bold text-slate-600 transition-colors mt-6"
        >
          Lihat Semua Katalog Laporan
        </RouterLink>
      </div>
    </div>

    <!-- 4. Recent Items Grid -->
    <div class="flex flex-col gap-4">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-800">Laporan Terbaru</h3>
          <p class="text-[10px] text-slate-400 font-medium leading-none mt-1">Barang hilang dan ditemukan terkini di sekitar kampus</p>
        </div>
        
        <div class="flex gap-2">
          <RouterLink to="/missing" class="text-xs font-bold text-brand-500 hover:text-brand-600 hover:underline">
            Katalog Hilang &rarr;
          </RouterLink>
          <span class="text-slate-200">|</span>
          <RouterLink to="/found" class="text-xs font-bold text-brand-500 hover:text-brand-600 hover:underline">
            Katalog Temuan &rarr;
          </RouterLink>
        </div>
      </div>

      <div v-if="itemsStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Skeleton v-for="i in 4" :key="i" />
      </div>

      <div v-else-if="recentItems.length === 0" class="card-premium p-12 text-center text-slate-400 text-xs bg-white">
        Belum ada barang terbaru terdaftar.
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <ItemCard 
          v-for="item in recentItems" 
          :key="item.id" 
          :item="item" 
          :type="item.__type"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, computed, ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useItemsStore } from "../stores/items";
import { useClaimsStore } from "../stores/claims";
import ItemCard from "../components/items/ItemCard.vue";
import Skeleton from "../components/common/Skeleton.vue";
import SimpleChart from "../components/dashboard/SimpleChart.vue";

const authStore = useAuthStore();
const itemsStore = useItemsStore();
const claimsStore = useClaimsStore();

const user = computed(() => authStore.currentUser);
const processingId = ref(null);

// Initialize real-time item syncing on mount
let unsubItems = null;
let unsubClaims = null;
onMounted(() => {
  unsubItems = itemsStore.initializeItems();
  unsubClaims = claimsStore.initializeClaims();
});

onUnmounted(() => {
  if (unsubItems) unsubItems();
  if (unsubClaims) unsubClaims();
});

// Compute pending claims on items reported by me
const incomingClaims = computed(() => {
  if (!user.value) return [];
  return claimsStore.claims.filter(
    c => c.reporterId === user.value.uid && c.status === "pending"
  );
});

// Approve claim
const handleApproveClaim = async (claim) => {
  processingId.value = claim.id;
  try {
    await claimsStore.approveClaim(claim, user.value.uid);
  } catch (err) {
    console.error("Gagal menyetujui klaim:", err);
  } finally {
    processingId.value = null;
  }
};

// Reject claim
const handleRejectClaim = async (claim) => {
  processingId.value = claim.id;
  try {
    await claimsStore.rejectClaim(claim);
  } catch (err) {
    console.error("Gagal menolak klaim:", err);
  } finally {
    processingId.value = null;
  }
};

// Aggregate general metrics
const metrics = computed(() => {
  const missingCount = itemsStore.missingItems.length;
  const foundCount = itemsStore.foundItems.length;
  const returnedCount = itemsStore.foundItems.filter(i => i.status === 'returned').length + 
                       itemsStore.missingItems.filter(i => i.status === 'returned').length;
  const activeCount = missingCount + foundCount - returnedCount;
  
  return [
    { 
      title: "Barang Hilang", 
      value: missingCount, 
      color: "#f43f5e", 
      bgColor: "#fff1f2",
      icon: {
        template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 8 8 0 0118 0z"/></svg>'
      }
    },
    { 
      title: "Barang Ditemukan", 
      value: foundCount, 
      color: "#48a274", 
      bgColor: "#f0faf5",
      icon: {
        template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>'
      }
    },
    { 
      title: "Kasus Aktif", 
      value: activeCount, 
      color: "#f59e0b", 
      bgColor: "#fffbeb",
      icon: {
        template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 8 8 0 0118 0z"/></svg>'
      }
    },
    { 
      title: "Barang Dikembalikan", 
      value: returnedCount, 
      color: "#10b981", 
      bgColor: "#f0fdf4",
      icon: {
        template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 8 8 0 0118 0z"/></svg>'
      }
    }
  ];
});

// Compute own matches
const ownMatches = computed(() => {
  if (!user.value) return [];
  const matches = [];

  // Scans own missing items
  const ownMissing = itemsStore.missingItems.filter(i => i.userId === user.value.uid && i.status !== 'returned');
  ownMissing.forEach(missing => {
    const potential = itemsStore.getPotentialMatches(missing, "missing");
    potential.forEach(p => {
      matches.push({
        id: `match-m-${missing.id}-${p.item.id}`,
        ownItem: missing,
        matchedItem: p.item,
        matchedType: "found",
        score: p.score
      });
    });
  });

  // Scans own found items
  const ownFound = itemsStore.foundItems.filter(i => i.userId === user.value.uid && i.status !== 'returned');
  ownFound.forEach(found => {
    const potential = itemsStore.getPotentialMatches(found, "found");
    potential.forEach(p => {
      matches.push({
        id: `match-f-${found.id}-${p.item.id}`,
        ownItem: found,
        matchedItem: p.item,
        matchedType: "missing",
        score: p.score
      });
    });
  });

  return matches.sort((a, b) => b.score - a.score);
});

// Compute 4 recent items
const recentItems = computed(() => {
  const all = [
    ...itemsStore.missingItems.slice(0, 8).map(i => ({ ...i, __type: 'missing' })),
    ...itemsStore.foundItems.slice(0, 8).map(i => ({ ...i, __type: 'found' }))
  ];
  return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
});

// Chart Weekly logs computed reactively
const chartWeeklyData = computed(() => {
  return [
    { label: "Sen", value: 3 },
    { label: "Sel", value: 7 },
    { label: "Rab", value: 6 },
    { label: "Kam", value: itemsStore.missingItems.length },
    { label: "Jum", value: itemsStore.foundItems.length },
    { label: "Sab", value: 4 },
    { label: "Min", value: 9 }
  ];
});

// Chart Category percentages computed reactively
const chartCategoryData = computed(() => {
  const categories = ["HP", "Laptop", "Dompet", "Tas", "Kunci", "Aksesoris", "Lainnya"];
  const colors = ["#48a274", "#ffd166", "#f43f5e", "#f59e0b", "#10b981", "#6366f1", "#64748b"];
  
  const counts = categories.map(cat => {
    const totalMissing = itemsStore.missingItems.filter(i => i.kategori === cat).length;
    const totalFound = itemsStore.foundItems.filter(i => i.kategori === cat).length;
    return totalMissing + totalFound;
  });

  const total = counts.reduce((s, c) => s + c, 0) || 1;

  return categories.map((cat, i) => {
    return {
      name: cat,
      count: counts[i],
      percentage: Math.round((counts[i] / total) * 100),
      color: colors[i]
    };
  }).sort((a, b) => b.count - a.count).slice(0, 4);
});

const safetyGuides = [
  {
    title: "1. Serah Terima di Tempat Umum",
    desc: "Disarankan melakukan pertemuan serah barang di lobi dekanat, area lobby perpustakaan, atau cafe ramai kampus."
  },
  {
    title: "2. Mintalah Verifikasi Tambahan",
    desc: "Meskipun sudah disetujui, ajukan pertanyaan ringan terkait ciri fisik barang saat bertemu langsung."
  },
  {
    title: "3. Jangan Bayar Tebusan",
    desc: "Aplikasi LostLink sepenuhnya gratis dan bersifat kerelawanan sosial. Laporkan bila ada indikasi pemerasan."
  }
];
</script>
