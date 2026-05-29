<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
    <!-- Profile Header Card -->
    <div class="card-premium bg-white relative overflow-hidden">
      <!-- Background gradient decoration -->
      <div class="h-32 bg-gradient-to-r from-brand-500 to-accent-500 opacity-90 w-full"></div>
      
      <div class="px-8 pb-8 relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 -mt-12">
        <!-- Avatar -->
        <div class="relative flex-shrink-0">
          <img 
            :src="user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nama || 'User')}&background=f9a8d4&color=be185d&bold=true&size=128`" 
            alt="Avatar"
            class="w-28 h-28 rounded-2xl border-4 border-white shadow-lg object-cover bg-white"
          />
          <span 
            class="absolute -bottom-2 -right-2 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full text-white shadow-sm"
            :class="['admin', 'super_admin'].includes(user?.role) ? 'bg-purple-500' : 'bg-brand-500'"
          >
            {{ user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin' : 'User' }}
          </span>
        </div>

        <div class="flex flex-col items-center sm:items-start sm:mt-14 w-full text-center sm:text-left">
          <h1 class="text-2xl font-black text-slate-800 tracking-tight">{{ user?.nama }}</h1>
          <p class="text-slate-500 text-xs font-semibold mt-1">{{ user?.email }}</p>
          <div class="mt-4 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <span class="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest">
              {{ user?.role === 'super_admin' ? 'Hak Akses: Super Administrator' : user?.role === 'admin' ? 'Hak Akses: Administrator' : 'Hak Akses: Pengguna Standar' }}
            </span>
          </div>
        </div>
        
        <!-- Edit Profile Button -->
        <div class="sm:ml-auto mt-2 sm:mt-14 flex-shrink-0">
          <button @click="openEditProfile" class="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-50 hover:text-brand-600 hover:border-brand-200 flex items-center gap-2 transition-colors">
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            Edit Profil
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="stat in profileStats" :key="stat.label" class="card-premium p-5 bg-white text-center">
        <span class="text-2xl font-black" :style="{ color: stat.color }">{{ stat.value }}</span>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">{{ stat.label }}</p>
      </div>
    </div>

    <!-- My Reports Section -->
    <div class="flex flex-col gap-5">
      <!-- Section Tabs -->
      <div class="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
        <button 
          v-for="tab in tabs" :key="tab.key"
          @click="activeTab = tab.key"
          class="text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-xl transition-all"
          :class="activeTab === tab.key ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
        >
          {{ tab.label }} ({{ tab.count }})
        </button>
      </div>

      <!-- Loading -->
      <div v-if="itemsStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="i in 3" :key="i" class="animate-pulse card-premium p-4 bg-white flex flex-col gap-3">
          <div class="w-full h-36 bg-slate-200 rounded-xl"></div>
          <div class="h-3 bg-slate-200 rounded w-2/3"></div>
          <div class="h-2.5 bg-slate-100 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="currentTabItems.length === 0" class="card-premium p-12 bg-white text-center flex flex-col items-center gap-3">
        <div class="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center">
          <svg class="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 8 8 0 0118 0z"/></svg>
        </div>
        <p class="text-sm font-bold text-slate-500">Belum ada laporan di kategori ini</p>
        <RouterLink :to="activeTab === 'missing' ? '/report-missing' : '/report-found'" class="text-xs text-brand-500 font-bold hover:underline">
          + Buat Laporan Baru
        </RouterLink>
      </div>

      <!-- Items Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div 
          v-for="item in currentTabItems" 
          :key="item.id"
          class="card-premium bg-white overflow-hidden flex flex-col group"
        >
          <div class="relative w-full h-36 overflow-hidden">
            <img :src="item.foto || 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=400'" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <span 
              class="absolute top-3 left-3 text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full text-white"
              :class="{
                'bg-rose-500': item.status === 'missing',
                'bg-sky-500': item.status === 'found',
                'bg-amber-500 text-slate-900': item.status === 'matching',
                'bg-emerald-500': item.status === 'verified',
                'bg-slate-500': item.status === 'returned',
              }"
            >{{ getStatusLabel(item.status) }}</span>
          </div>
          
          <div class="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h4 class="text-xs font-extrabold text-slate-800 truncate">{{ item.namaBarang }}</h4>
              <p class="text-[10px] text-slate-400 mt-1">{{ item.lokasi }} · {{ formatDate(item.tanggal) }}</p>
            </div>
            <div class="flex gap-2 mt-4">
              <RouterLink 
                :to="`/item/${activeTab}/${item.id}`"
                class="flex-1 text-center py-2 text-[10px] font-bold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Lihat Detail
              </RouterLink>
              <button 
                @click="confirmDelete(item.id, activeTab)"
                class="py-2 px-3 text-[10px] font-bold rounded-lg border border-rose-100 text-rose-500 hover:bg-rose-50 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="card-premium p-6 bg-white border border-rose-100">
      <h3 class="text-xs font-extrabold text-rose-600 uppercase tracking-wider mb-4">Zona Bahaya</h3>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 class="text-sm font-bold text-slate-800">Keluar Sesi</h4>
          <p class="text-xs text-slate-400 mt-0.5">Sesi akan dihapus dan Anda akan diarahkan ke halaman login.</p>
        </div>
        <button 
          @click="handleLogout"
          class="flex-shrink-0 bg-rose-500 hover:bg-rose-600 text-white text-xs font-black px-6 py-2.5 rounded-xl transition-all shadow-md shadow-rose-100"
        >
          Logout Sekarang
        </button>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <div v-if="deleteConfirm.show" class="fixed inset-0 z-[9999] bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 flex flex-col gap-4 border border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <div>
            <h3 class="text-sm font-extrabold text-slate-800">Hapus Laporan?</h3>
            <p class="text-xs text-slate-400 mt-0.5">Tindakan ini tidak dapat dibatalkan.</p>
          </div>
        </div>
        <div class="flex gap-2 mt-2">
          <button @click="deleteConfirm.show = false" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50">Batal</button>
          <button @click="doDelete" class="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors">Ya, Hapus</button>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="editProfile.show" class="fixed inset-0 z-[9999] bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 flex flex-col gap-5 border border-slate-100">
        <div class="flex items-center justify-between border-b border-slate-50 pb-3">
          <h3 class="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Edit Profil</h3>
          <button @click="editProfile.show = false" class="text-slate-400 hover:text-slate-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        
        <form @submit.prevent="saveProfile" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
            <input 
              type="text" 
              v-model="editProfile.nama" 
              required 
              class="text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:border-brand-500 focus:outline-none"
            />
          </div>
          
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Email (Hanya Baca)</label>
            <input 
              type="text" 
              :value="user?.email" 
              disabled
              class="text-xs rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-slate-400"
            />
          </div>

          <div class="flex gap-2 mt-2 pt-4 border-t border-slate-50">
            <button type="button" @click="editProfile.show = false" class="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50">Batal</button>
            <button type="submit" :disabled="editProfile.saving" class="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold transition-colors flex justify-center items-center gap-2">
              <span v-if="editProfile.saving" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useItemsStore } from '../stores/items';
import { useNotificationsStore } from '../stores/notifications';

const authStore = useAuthStore();
const itemsStore = useItemsStore();
const notifStore = useNotificationsStore();
const router = useRouter();

const user = computed(() => authStore.currentUser);
const activeTab = ref('missing');

const deleteConfirm = ref({ show: false, id: null, type: null });
const editProfile = ref({ show: false, nama: '', saving: false });

let unsubItems = null;
onMounted(() => { unsubItems = itemsStore.initializeItems(); });
onUnmounted(() => { if (unsubItems) unsubItems(); });

const myMissing = computed(() => {
  if (!user.value) return [];
  return itemsStore.missingItems.filter(i => i.userId === user.value.uid);
});

const myFound = computed(() => {
  if (!user.value) return [];
  return itemsStore.foundItems.filter(i => i.userId === user.value.uid);
});

const tabs = computed(() => [
  { key: 'missing', label: 'Barang Hilang Saya', count: myMissing.value.length },
  { key: 'found', label: 'Barang Temuan Saya', count: myFound.value.length },
]);

const currentTabItems = computed(() => activeTab.value === 'missing' ? myMissing.value : myFound.value);

const profileStats = computed(() => [
  { label: 'Barang Hilang', value: myMissing.value.length, color: '#f43f5e' },
  { label: 'Barang Temuan', value: myFound.value.length, color: '#0ea5e9' },
  { label: 'Kasus Aktif', value: myMissing.value.filter(i => i.status !== 'returned').length + myFound.value.filter(i => i.status !== 'returned').length, color: '#f59e0b' },
  { label: 'Berhasil Selesai', value: myMissing.value.filter(i => i.status === 'returned').length + myFound.value.filter(i => i.status === 'returned').length, color: '#10b981' },
]);

const getStatusLabel = (s) => ({ missing:'Hilang', found:'Temuan', matching:'Cocok', verified:'Terverifikasi', returned:'Selesai' })[s] || s;

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
  const d = new Date(dateStr);
  return isNaN(d) ? dateStr : `${d.getDate()} ${months[d.getMonth()]}`;
};

const confirmDelete = (id, type) => {
  deleteConfirm.value = { show: true, id, type };
};

const doDelete = async () => {
  try {
    await itemsStore.deleteItem(deleteConfirm.value.id, deleteConfirm.value.type);
    notifStore.showToast('Laporan berhasil dihapus.', 'info');
  } catch (e) {
    notifStore.showToast('Gagal menghapus laporan.', 'error');
  } finally {
    deleteConfirm.value = { show: false, id: null, type: null };
  }
};

import { databaseService } from '../firebase/databaseService';

const openEditProfile = () => {
  editProfile.value.nama = user.value.nama;
  editProfile.value.show = true;
};

const saveProfile = async () => {
  if (!editProfile.value.nama.trim()) return;
  editProfile.value.saving = true;
  
  try {
    const newName = editProfile.value.nama.trim();
    // Auto update avatar based on new name
    const newPhotoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=f9a8d4&color=be185d&bold=true&size=128`;
    
    // Update firestore document
    await databaseService.updateDoc("users", user.value.uid, {
      nama: newName,
      displayName: newName,
      photoURL: newPhotoURL
    });
    
    // Update local state directly for instant feedback
    if (authStore.currentUser) {
      authStore.currentUser.nama = newName;
      authStore.currentUser.displayName = newName;
      authStore.currentUser.photoURL = newPhotoURL;
      
      // Update local storage demo session if it exists
      const session = localStorage.getItem("ll_active_session");
      if (session) {
        const parsed = JSON.parse(session);
        parsed.nama = newName;
        parsed.displayName = newName;
        parsed.photoURL = newPhotoURL;
        localStorage.setItem("ll_active_session", JSON.stringify(parsed));
      }
    }
    
    notifStore.showToast('Profil berhasil diperbarui.', 'success');
    editProfile.value.show = false;
  } catch (err) {
    notifStore.showToast('Gagal memperbarui profil: ' + err.message, 'error');
  } finally {
    editProfile.value.saving = false;
  }
};

const handleLogout = async () => {
  await authStore.logout();
  notifStore.showToast('Berhasil keluar sesi.', 'info');
  router.push('/');
};
</script>
