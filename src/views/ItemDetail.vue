<template>
  <div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8" v-if="!loading && item">
    <!-- Back nav -->
    <RouterLink 
      :to="type === 'missing' ? '/missing' : '/found'" 
      class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
    >
      &larr; Kembali ke Katalog
    </RouterLink>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Left: Image + Details -->
      <div class="lg:col-span-8 flex flex-col gap-6">
        <!-- Image Hero -->
        <div class="relative w-full h-80 rounded-2xl overflow-hidden border border-slate-100 bg-slate-100">
          <img 
            :src="item.foto || 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800'" 
            alt="Foto Barang"
            class="w-full h-full object-cover"
          />
          <!-- Badges -->
          <span 
            class="absolute top-5 left-5 text-[11px] font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-full text-white shadow"
            :class="{
              'bg-rose-500': item.status === 'missing',
              'bg-sky-500': item.status === 'found',
              'bg-amber-500 text-slate-900': item.status === 'matching',
              'bg-emerald-500': item.status === 'verified',
              'bg-slate-500': item.status === 'returned',
            }"
          >{{ statusLabel }}</span>
          <span class="absolute top-5 right-5 bg-slate-900/50 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
            {{ item.kategori }}
          </span>
        </div>

        <!-- Item Info Card -->
        <div class="card-premium p-6 bg-white flex flex-col gap-5">
          <div>
            <h1 class="text-2xl font-black text-slate-800 tracking-tight">{{ item.namaBarang }}</h1>
            <div class="flex flex-wrap gap-3 mt-3">
              <span class="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {{ item.lokasi }}
              </span>
              <span class="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                📅 {{ formatDate(item.tanggal) }}
              </span>
              <span class="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                🎨 {{ item.warna }}
              </span>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-50">
            <h3 class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">Deskripsi Lengkap</h3>
            <p class="text-sm text-slate-600 leading-relaxed">{{ item.deskripsi }}</p>
          </div>

          <div class="pt-4 border-t border-slate-50">
            <h3 class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">Ciri Khusus Fisik</h3>
            <div class="bg-amber-50/60 border border-amber-100 rounded-xl p-4 text-sm text-slate-700 leading-relaxed">
              {{ item.ciriKhusus }}
            </div>
          </div>

          <div v-if="item.kontakAlternatif" class="pt-4 border-t border-slate-50">
            <h3 class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">Kontak Alternatif</h3>
            <p class="text-sm text-slate-600">{{ item.kontakAlternatif }}</p>
          </div>
        </div>

        <!-- Potential Matches Section -->
        <div v-if="potentialMatches.length > 0" class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <h3 class="text-xs font-extrabold uppercase tracking-wider text-amber-600">Potential Match Ditemukan ({{ potentialMatches.length }})</h3>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RouterLink 
              v-for="match in potentialMatches.slice(0, 4)"
              :key="match.item.id"
              :to="`/item/${type === 'missing' ? 'found' : 'missing'}/${match.item.id}`"
              class="flex items-center gap-3 p-4 rounded-2xl border border-amber-200/70 bg-amber-50/50 hover:border-amber-300 hover:bg-amber-50 transition-all"
            >
              <img :src="match.item.foto || 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=100'" class="w-12 h-12 rounded-xl object-cover border border-amber-100" />
              <div class="min-w-0">
                <span class="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">{{ match.score }}% cocok</span>
                <h4 class="text-xs font-bold text-slate-800 truncate mt-0.5">{{ match.item.namaBarang }}</h4>
                <p class="text-[10px] text-slate-400">{{ match.item.lokasi }}</p>
              </div>
            </RouterLink>
          </div>
        </div>

        <!-- Location Map -->
        <div class="flex flex-col gap-3">
          <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-800">Lokasi Koordinat Kejadian</h3>
          <LeafletMap 
            :model-value="{ lat: item.latitude || -6.2088, lng: item.longitude || 106.8456 }"
            :readonly="true"
            height="280px"
          />
          <div class="flex bg-slate-50 rounded-xl p-3 justify-between items-center text-[10px] text-slate-500 border border-slate-100">
            <span>Lat: <strong class="font-mono text-slate-700">{{ (item.latitude || -6.2088).toFixed(6) }}</strong></span>
            <span>Lng: <strong class="font-mono text-slate-700">{{ (item.longitude || 106.8456).toFixed(6) }}</strong></span>
          </div>
        </div>
      </div>

      <!-- Right: Action Panel -->
      <div class="lg:col-span-4 flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
        <!-- Pelapor Card -->
        <div class="card-premium p-5 bg-white flex flex-col gap-3">
          <h3 class="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            {{ type === 'missing' ? 'Dilaporkan Oleh' : 'Ditemukan Oleh' }}
          </h3>
          <div class="flex items-center gap-3">
            <img 
              :src="reporterAvatar" 
              class="w-10 h-10 rounded-full border border-slate-100" 
              alt="Pelapor"
            />
            <div>
              <h4 class="text-sm font-bold text-slate-800">{{ reporterName }}</h4>
              <p class="text-[10px] text-slate-400 mt-0.5">{{ formatDate(item.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col gap-3">
          <!-- Button 1: Chat / Hubungi -->
          <button 
            v-if="isNotOwner && item.status !== 'returned'"
            @click="startChat"
            class="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-black shadow-md shadow-sky-100 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            <span>{{ type === 'found' ? 'Hubungi Penemu' : 'Chat Pemilik' }}</span>
          </button>

          <!-- Button 2: Klaim Barang -->
          <button 
            v-if="canClaim"
            @click="openClaimModal"
            class="w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-black shadow-md shadow-brand-100 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            <span>Klaim Barang Ini</span>
          </button>

          <!-- Status Tags (non-actionable) -->
          <div v-if="item.status === 'returned'" class="w-full py-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold text-center">
            ✅ Barang Telah Dikembalikan
          </div>

          <div v-if="item.status === 'verified' && !isNotOwner" class="w-full py-3.5 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 text-sm font-bold text-center">
            🔐 Klaim Anda Sedang Diverifikasi
          </div>
        </div>

        <!-- Status Timeline -->
        <div class="card-premium p-5 bg-white flex flex-col gap-3">
          <h3 class="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Status Barang</h3>
          <div class="flex flex-col gap-2">
            <div v-for="step in statusSteps" :key="step.key" class="flex items-center gap-2.5">
              <div 
                class="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-black"
                :class="isStatusReached(step.key) 
                  ? 'bg-brand-500 text-white' 
                  : 'bg-slate-100 text-slate-400'"
              >
                {{ isStatusReached(step.key) ? '✓' : '' }}
              </div>
              <span 
                class="text-[11px] font-semibold"
                :class="item.status === step.key ? 'text-brand-600 font-bold' : isStatusReached(step.key) ? 'text-slate-500' : 'text-slate-300'"
              >
                {{ step.label }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Claim Modal -->
    <ClaimModal 
      :is-open="claimModalOpen"
      :item-id="item.id"
      :item-name="item.namaBarang"
      :item-type="type"
      :reporter-id="item.userId"
      @close="claimModalOpen = false"
      @success="handleClaimSuccess"
    />
  </div>

  <!-- Loading Skeleton -->
  <div v-else-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
    <div class="w-48 h-5 bg-slate-200 rounded mb-6"></div>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-8 flex flex-col gap-6">
        <div class="w-full h-80 bg-slate-200 rounded-2xl"></div>
        <div class="h-64 bg-slate-200 rounded-2xl"></div>
      </div>
      <div class="lg:col-span-4 flex flex-col gap-4">
        <div class="h-28 bg-slate-200 rounded-2xl"></div>
        <div class="h-40 bg-slate-200 rounded-2xl"></div>
      </div>
    </div>
  </div>

  <!-- Not Found -->
  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
    <h2 class="text-xl font-bold text-slate-500">Barang tidak ditemukan.</h2>
    <RouterLink to="/dashboard" class="text-brand-500 font-bold text-sm hover:underline mt-3 inline-block">&larr; Kembali ke Dashboard</RouterLink>
  </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useItemsStore } from '../stores/items';
import { useNotificationsStore } from '../stores/notifications';
import { databaseService } from '../firebase/databaseService';
import LeafletMap from '../components/common/LeafletMap.vue';
import ClaimModal from '../components/items/ClaimModal.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const itemsStore = useItemsStore();
const notifStore = useNotificationsStore();

const type = computed(() => route.params.type);
const itemId = computed(() => route.params.id);

const item = ref(null);
const loading = ref(true);
const claimModalOpen = ref(false);

const user = computed(() => authStore.currentUser);

const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.role === 'super_admin');
const adminStatusInput = ref('');
const updatingStatus = ref(false);

watch(item, (newVal) => {
  if (newVal) {
    adminStatusInput.value = newVal.status;
  }
});

const updateItemStatus = async () => {
  if (!confirm(`Ubah status barang menjadi ${adminStatusInput.value}?`)) {
    adminStatusInput.value = item.value.status; // Revert
    return;
  }
  
  updatingStatus.value = true;
  try {
    const col = type.value === 'missing' ? 'missing_items' : 'found_items';
    await databaseService.updateDoc(col, itemId.value, { status: adminStatusInput.value });
    
    item.value.status = adminStatusInput.value;
    notifStore.showToast('Status berhasil diubah', 'success');

    // Email Trigger
    if (adminStatusInput.value === 'found' || adminStatusInput.value === 'returned') {
      if (reporterProfile.value?.email) {
        await databaseService.addDoc('mail', {
          to: reporterProfile.value.email,
          message: {
            subject: `Pembaruan Status Barang: ${item.value.name}`,
            text: `Status barang "${item.value.name}" Anda telah diubah menjadi: ${adminStatusInput.value.toUpperCase()}.`,
            html: `<h3>Halo ${reporterProfile.value.nama},</h3><p>Status pelaporan barang Anda <b>${item.value.name}</b> telah diperbarui oleh Admin menjadi: <span style="color:#0ea5e9;font-weight:bold;">${adminStatusInput.value.toUpperCase()}</span>.</p><p>Silakan buka aplikasi LostLink untuk melihat detail lebih lanjut.</p>`
          }
        });
      }
    }
  } catch (err) {
    notifStore.showToast('Gagal mengubah status', 'error');
    adminStatusInput.value = item.value.status; // Revert
  } finally {
    updatingStatus.value = false;
  }
};

let unsubItems = null;
const reporterProfile = ref(null);

onMounted(async () => {
  unsubItems = itemsStore.initializeItems();
  try {
    const col = type.value === 'missing' ? 'missing_items' : 'found_items';
    const docData = await databaseService.getDoc(col, itemId.value);
    item.value = docData;
    
    // Fetch reporter profile from Firestore
    if (docData && docData.userId) {
      try {
        reporterProfile.value = await databaseService.getDoc('users', docData.userId);
      } catch (err) {
        reporterProfile.value = { nama: 'Pengguna LostLink', photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=user` };
      }
    }
  } catch (e) {
    item.value = null;
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  if (unsubItems) unsubItems();
});

const isNotOwner = computed(() => {
  return user.value && item.value && user.value.uid !== item.value.userId;
});

const canClaim = computed(() => {
  if (!user.value || !item.value) return false;
  if (item.value.status === 'returned') return false;
  // Can only claim FOUND items (when you lost something)
  if (type.value !== 'found') return false;
  return isNotOwner.value;
});

const potentialMatches = computed(() => {
  if (!item.value) return [];
  return itemsStore.getPotentialMatches(item.value, type.value);
});

const reporterName = computed(() => {
  return reporterProfile.value?.nama || 'Pengguna LostLink';
});

const reporterAvatar = computed(() => {
  return reporterProfile.value?.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=user`;
});

const statusLabel = computed(() => {
  const labels = { missing: 'Hilang', found: 'Ditemukan', matching: 'Status Cocok', verified: 'Terverifikasi', returned: 'Dikembalikan' };
  return labels[item.value?.status] || item.value?.status;
});

const statusSteps = [
  { key: 'missing', label: 'Laporan Masuk' },
  { key: 'found', label: 'Penemu Melaporkan' },
  { key: 'matching', label: 'Auto Matching Terdeteksi' },
  { key: 'verified', label: 'Klaim Diverifikasi Admin' },
  { key: 'returned', label: 'Barang Dikembalikan ✅' }
];

const statusOrder = ['missing', 'found', 'matching', 'verified', 'returned'];

const isStatusReached = (key) => {
  if (!item.value) return false;
  const currentIndex = statusOrder.indexOf(item.value.status);
  const stepIndex = statusOrder.indexOf(key);
  return stepIndex <= currentIndex;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const startChat = () => {
  if (!user.value || !item.value) return;
  const participants = [user.value.uid, item.value.userId].sort();
  const chatId = `chat-${participants.join('-')}`;
  router.push(`/chat?chatId=${chatId}&with=${item.value.userId}&item=${item.value.id}`);
};

const openClaimModal = () => {
  claimModalOpen.value = true;
};

const handleClaimSuccess = () => {
  claimModalOpen.value = false;
  notifStore.showToast('Klaim berhasil diajukan! Penemu akan segera memverifikasi.', 'success');
  router.push('/dashboard');
};
</script>
