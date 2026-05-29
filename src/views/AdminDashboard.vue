<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
    <!-- Admin Header -->
    <div class="flex justify-between items-center">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="w-2 h-2 rounded-full bg-purple-500"></span>
          <span class="text-[10px] font-extrabold text-purple-600 uppercase tracking-widest">Panel Administrator</span>
        </div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight font-sans">Admin Dashboard</h1>
        <p class="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Kelola semua laporan, klaim, dan pengguna platform</p>
      </div>
    </div>

    <!-- Seed Database Utility (Demo/Dev only) -->
    <SeederSandbox />

    <!-- Admin Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-5">
      <div 
        v-for="stat in adminStats" :key="stat.title"
        class="card-premium p-5 bg-white border-t-4"
        :style="{ borderTopColor: stat.color }"
      >
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ stat.title }}</span>
        <p class="text-2xl font-black text-slate-800 mt-1">{{ stat.value }}</p>
      </div>
    </div>

    <!-- Category Stats Chart  -->
    <div class="card-premium p-6 bg-white">
      <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-5">Distribusi Kategori Barang Hilang</h3>
      <div class="flex flex-wrap gap-3">
        <div v-for="cat in categoryStats" :key="cat.name" class="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
          <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ backgroundColor: cat.color }"></span>
          <span class="text-xs font-bold text-slate-700">{{ cat.name }}</span>
          <span class="text-xs font-black text-slate-400">{{ cat.count }}</span>
        </div>
      </div>
    </div>

    <!-- Main Tabs: Claims | Reports | Users -->
    <div>
      <div class="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
        <button 
          v-for="tab in adminTabs" :key="tab.key"
          @click="activeTab = tab.key"
          class="text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-xl transition-all"
          :class="activeTab === tab.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
        >
          {{ tab.label }}
          <span v-if="tab.badge > 0" class="ml-1.5 bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">{{ tab.badge }}</span>
        </button>
      </div>


      <!-- All Reports Tab (Missing + Found) -->
      <div v-if="activeTab === 'reports'" class="flex flex-col gap-5">
        <div class="flex gap-2">
          <button @click="reportSubTab = 'missing'" class="text-xs font-bold px-4 py-2 rounded-xl transition-all" :class="reportSubTab === 'missing' ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'">
            Barang Hilang ({{ itemsStore.missingItems.length }})
          </button>
          <button @click="reportSubTab = 'found'" class="text-xs font-bold px-4 py-2 rounded-xl transition-all" :class="reportSubTab === 'found' ? 'bg-sky-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'">
            Barang Temuan ({{ itemsStore.foundItems.length }})
          </button>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-slate-100">
          <table class="min-w-full bg-white text-xs">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr>
                <th class="text-left px-5 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Barang</th>
                <th class="text-left px-5 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Kategori</th>
                <th class="text-left px-5 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Lokasi</th>
                <th class="text-left px-5 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Status</th>
                <th class="text-left px-5 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="item in currentReportItems" :key="item.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-5 py-3.5 font-bold text-slate-800 truncate max-w-[160px]">{{ item.namaBarang }}</td>
                <td class="px-5 py-3.5 text-slate-500">{{ item.kategori }}</td>
                <td class="px-5 py-3.5 text-slate-500">{{ item.lokasi }}</td>
                <td class="px-5 py-3.5">
                  <select 
                    v-model="item.status"
                    @change="adminChangeStatus(item, $event.target.value)"
                    class="text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-lg border outline-none cursor-pointer"
                    :class="{
                      'bg-rose-100 text-rose-700 border-rose-200': item.status === 'missing',
                      'bg-sky-100 text-sky-700 border-sky-200': item.status === 'found',
                      'bg-amber-100 text-amber-700 border-amber-200': item.status === 'matching',
                      'bg-emerald-100 text-emerald-700 border-emerald-200': item.status === 'verified' || item.status === 'returned',
                    }"
                  >
                    <option value="missing">MISSING</option>
                    <option value="found">FOUND</option>
                    <option value="matching">MATCHING</option>
                    <option value="verified">VERIFIED</option>
                    <option value="returned">RETURNED</option>
                  </select>
                </td>
                <td class="px-5 py-3.5">
                  <button 
                    @click="adminDeleteItem(item.id, reportSubTab)"
                    class="text-[10px] font-bold text-rose-500 hover:text-rose-700 transition-colors"
                  >Hapus Spam</button>
                </td>
              </tr>
              <tr v-if="currentReportItems.length === 0">
                <td colspan="5" class="px-5 py-8 text-center text-slate-400">Tidak ada laporan.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Users Management Tab -->
      <div v-if="activeTab === 'users'" class="flex flex-col gap-3">
        <div v-if="allUsers.length === 0" class="card-premium p-12 text-center bg-white text-slate-400 text-xs">
          Tidak ada pengguna terdaftar.
        </div>
        
        <div class="overflow-x-auto rounded-2xl border border-slate-100">
          <table class="min-w-full bg-white text-xs">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr>
                <th class="text-left px-5 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Pengguna</th>
                <th class="text-left px-5 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Email</th>
                <th class="text-left px-5 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Role</th>
                <th class="text-left px-5 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Laporan</th>
                <th class="text-left px-5 py-3 font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="u in allUsers" :key="u.uid" class="hover:bg-slate-50 transition-colors">
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-2.5">
                    <img :src="getUserAvatar(u)" @error="(e) => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.nama || 'User')}&background=e2e8f0&color=64748b&bold=true&size=128`" class="w-7 h-7 rounded-full border border-slate-100" />
                    <span class="font-bold text-slate-800">{{ u.nama }}</span>
                  </div>
                </td>
                <td class="px-5 py-3.5 text-slate-500">{{ u.email }}</td>
                <td class="px-5 py-3.5">
                  <span class="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full" :class="u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-brand-50 text-brand-700'">
                    {{ u.role }}
                  </span>
                </td>
                <td class="px-5 py-3.5 text-slate-500">{{ getUserReportCount(u.uid) }}</td>
                <td class="px-5 py-3.5">
                  <button 
                    v-if="u.role !== 'admin'"
                    @click="blockUser(u.uid)"
                    class="text-[10px] font-bold text-rose-500 hover:text-rose-700 transition-colors"
                  >Blok User</button>
                  <span v-else class="text-[10px] text-slate-300">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useItemsStore } from '../stores/items';
import { useNotificationsStore } from '../stores/notifications';
import { databaseService } from '../firebase/databaseService';
import SeederSandbox from '../components/admin/SeederSandbox.vue';

const itemsStore = useItemsStore();
const notifStore = useNotificationsStore();
const activeTab = ref('reports');
const reportSubTab = ref('missing');
const processingId = ref(null);
const allUsers = ref([]);

const adminTabs = computed(() => [
  { key: 'reports', label: 'Semua Laporan', badge: 0 },
  { key: 'users', label: 'Pengguna', badge: 0 },
]);

let unsubItems = null;

onMounted(async () => {
  unsubItems = itemsStore.initializeItems();
  // Load users from Firestore
  try {
    allUsers.value = await databaseService.getDocs('users');
  } catch (err) {
    console.error("Gagal memuat pengguna:", err);
  }
});

onUnmounted(() => {
  if (unsubItems) unsubItems();
});

const adminStats = computed(() => [
  { title: 'Total Barang Hilang', value: itemsStore.missingItems.length, color: '#f43f5e' },
  { title: 'Total Barang Temuan', value: itemsStore.foundItems.length, color: '#0ea5e9' },
  { title: 'Berhasil Dikembalikan', value: [...itemsStore.missingItems, ...itemsStore.foundItems].filter(i => i.status === 'returned').length, color: '#10b981' },
]);

const categoryStats = computed(() => {
  const cats = ['HP','Laptop','Dompet','Tas','Kunci','Kartu Identitas','Aksesoris','Lainnya'];
  const colors = ['#0ea5e9','#a855f7','#f43f5e','#f59e0b','#10b981','#6366f1','#ec4899','#64748b'];
  return cats.map((name, i) => ({
    name,
    count: itemsStore.missingItems.filter(it => it.kategori === name).length,
    color: colors[i]
  })).filter(c => c.count > 0).sort((a, b) => b.count - a.count);
});

const currentReportItems = computed(() => {
  return reportSubTab.value === 'missing' ? itemsStore.missingItems : itemsStore.foundItems;
});

const getUserReportCount = (uid) => {
  const missing = itemsStore.missingItems.filter(i => i.userId === uid).length;
  const found = itemsStore.foundItems.filter(i => i.userId === uid).length;
  return missing + found;
};

const adminDeleteItem = async (id, type) => {
  try {
    await itemsStore.deleteItem(id, type);
    notifStore.showToast('Laporan dihapus sebagai spam.', 'info');
  } catch (e) {
    notifStore.showToast('Gagal menghapus laporan.', 'error');
  }
};

const adminChangeStatus = async (item, newStatus) => {
  const collectionName = reportSubTab.value === 'missing' ? 'missing_items' : 'found_items';
  try {
    await databaseService.updateDoc(collectionName, item.id, { status: newStatus });
    item.status = newStatus;
    notifStore.showToast(`Status laporan berhasil diubah ke ${newStatus}`, 'success');

    // Jika barang milik user (missing) diubah menjadi "found" atau "returned", kirim notifikasi email
    if (collectionName === 'missing_items' && (newStatus === 'found' || newStatus === 'returned')) {
      const user = allUsers.value.find(u => u.uid === item.userId);
      if (user && user.email) {
        await databaseService.addDoc("mail", {
          to: user.email,
          message: {
            subject: `Pembaruan Laporan: Barang Anda Ditemukan!`,
            html: `
              <h2>Halo, ${user.nama}!</h2>
              <p>Ada kabar baik mengenai laporan barang hilang Anda.</p>
              <p>Barang: <strong>${item.namaBarang}</strong></p>
              <p>Status laporan ini telah diubah menjadi: <strong style="color: green;">${newStatus.toUpperCase()}</strong></p>
              <p>Silakan periksa dashboard akun Anda di LostLink untuk detail lebih lanjut dan langkah selanjutnya.</p>
              <br/>
              <p>Salam,</p>
              <p>Tim Admin LostLink</p>
            `
          }
        });
        notifStore.showToast(`Email notifikasi terkirim ke ${user.email}`, 'success');
      }
    }
  } catch (e) {
    notifStore.showToast('Gagal mengubah status', 'error');
  }
};

const blockUser = async (uid) => {
  try {
    // Sebagai fallback sederhana: menghapus dari firestore atau mengubah role
    await databaseService.deleteDoc('users', uid);
    allUsers.value = allUsers.value.filter(u => u.uid !== uid);
    notifStore.showToast('Pengguna berhasil diblokir dari sistem.', 'info');
  } catch (e) {
    notifStore.showToast('Gagal memblokir pengguna', 'error');
  }
};
</script>
