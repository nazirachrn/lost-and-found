<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight font-sans">Notifikasi</h1>
        <p class="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
          {{ unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca' }}
        </p>
      </div>
      <button 
        v-if="unreadCount > 0"
        @click="markAllAsRead"
        class="text-xs font-bold text-brand-500 hover:text-brand-600 border border-brand-200 bg-brand-50 px-4 py-2 rounded-xl hover:bg-brand-100 transition-colors"
      >
        Tandai Semua Dibaca
      </button>
    </div>

    <!-- Loading -->
    <div v-if="notifStore.loading" class="flex flex-col gap-3">
      <div v-for="i in 5" :key="i" class="animate-pulse card-premium p-4 flex gap-4 bg-white">
        <div class="w-10 h-10 bg-slate-200 rounded-xl flex-shrink-0"></div>
        <div class="flex-1 flex flex-col gap-2">
          <div class="h-3 bg-slate-200 rounded w-2/3"></div>
          <div class="h-2.5 bg-slate-100 rounded w-full"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="notifications.length === 0" class="card-premium p-16 bg-white flex flex-col items-center gap-4 text-center">
      <div class="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
        <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
      </div>
      <div>
        <h3 class="text-sm font-bold text-slate-600">Tidak ada notifikasi</h3>
        <p class="text-xs text-slate-400 mt-1">Anda akan mendapat pemberitahuan saat ada kecocokan barang, klaim disetujui, atau pesan baru.</p>
      </div>
    </div>

    <!-- Notifications List -->
    <div v-else class="flex flex-col gap-3">
      <TransitionGroup name="notif-list">
        <div 
          v-for="notif in notifications" 
          :key="notif.id"
          class="card-premium p-4 bg-white flex gap-4 items-start transition-all duration-200"
          :class="!notif.read ? 'border-l-4 border-brand-400' : ''"
        >
          <!-- Type Icon -->
          <div 
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            :class="{
              'bg-sky-50 text-sky-500': notif.type === 'chat',
              'bg-amber-50 text-amber-500': notif.type === 'match',
              'bg-emerald-50 text-emerald-500': notif.type === 'claim_approved',
              'bg-rose-50 text-rose-500': notif.type === 'claim_rejected',
            }"
          >
            <svg v-if="notif.type === 'chat'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            <svg v-else-if="notif.type === 'match'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            <svg v-else-if="notif.type === 'claim_approved'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 8 8 0 0118 0z"/></svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 8 8 0 0118 0z"/></svg>
          </div>

          <!-- Text Content -->
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start gap-2">
              <h4 class="text-xs font-extrabold text-slate-800 leading-snug">{{ notif.title }}</h4>
              <span class="text-[10px] text-slate-400 font-medium flex-shrink-0">{{ formatDate(notif.createdAt) }}</span>
            </div>
            <p class="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{{ notif.message }}</p>
            
            <div class="flex items-center gap-3 mt-3">
              <button 
                v-if="!notif.read"
                @click="markRead(notif.id)"
                class="text-[10px] font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-brand-500 inline-block"></span>
                Tandai Dibaca
              </button>
              <button 
                @click="deleteNotif(notif.id)"
                class="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors"
              >
                Hapus
              </button>
              <RouterLink 
                v-if="notif.itemId && notif.type !== 'chat'"
                :to="`/item/found/${notif.itemId}`"
                class="text-[10px] font-bold text-brand-500 hover:underline ml-auto"
              >
                Lihat Barang →
              </RouterLink>
              <RouterLink 
                v-if="notif.itemId && notif.type === 'chat'"
                :to="`/chat`"
                class="text-[10px] font-bold text-brand-500 hover:underline ml-auto"
              >
                Buka Chat →
              </RouterLink>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useNotificationsStore } from '../stores/notifications';
import { useAuthStore } from '../stores/auth';

const notifStore = useNotificationsStore();
const authStore = useAuthStore();
const user = computed(() => authStore.currentUser);

const notifications = computed(() => notifStore.notifications);
const unreadCount = computed(() => notifStore.unreadCount);

let unsubNotifs = null;
onMounted(() => {
  if (user.value) {
    unsubNotifs = notifStore.initializeNotifications(user.value.uid);
  }
});

onUnmounted(() => {
  if (unsubNotifs) unsubNotifs();
});

const markRead = (id) => notifStore.markAsRead(id);
const markAllAsRead = () => notifStore.markAllAsRead();
const deleteNotif = (id) => notifStore.deleteNotification(id);

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
  return `${d.getDate()} ${months[d.getMonth()]}, ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
};
</script>

<style scoped>
.notif-list-enter-from { opacity: 0; transform: translateX(-12px); }
.notif-list-leave-to { opacity: 0; transform: translateX(12px); }
.notif-list-leave-active { position: absolute; width: 100%; }
</style>
