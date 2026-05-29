<template>
  <header class="sticky top-0 z-40 w-full glass border-b border-slate-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center shadow-md shadow-brand-100 transition-all duration-300 group-hover:scale-105">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <span class="text-lg font-black tracking-tight bg-gradient-to-r from-slate-900 via-brand-600 to-accent-600 bg-clip-text text-transparent">
            LostLink<span class="text-brand-500">.</span>
          </span>
        </RouterLink>

        <!-- Desktop Navigation -->
        <nav v-if="user" class="hidden md:flex items-center gap-1">
          <RouterLink 
            v-for="link in navLinks" 
            :key="link.path" 
            :to="link.path" 
            class="px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200"
            :class="$route.path.startsWith(link.path) 
              ? 'bg-brand-50 text-brand-600 font-extrabold' 
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'"
          >
            {{ link.name }}
          </RouterLink>

          <!-- Admin Panel Button -->
          <RouterLink 
            v-if="user.role === 'admin'"
            to="/admin" 
            class="px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200"
            :class="$route.path.startsWith('/admin') 
              ? 'bg-purple-50 text-purple-600 font-extrabold' 
              : 'text-slate-500 hover:text-purple-600 hover:bg-purple-50/50'"
          >
            Panel Admin
          </RouterLink>
        </nav>

        <!-- Right Side Widgets -->
        <div class="flex items-center gap-3">
          <!-- Non-Authenticated CTA -->
          <div v-if="!user" class="flex items-center gap-2">
            <RouterLink to="/login" class="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2">
              Masuk
            </RouterLink>
            <RouterLink to="/register" class="bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-brand-100 transition-all hover:scale-102">
              Daftar Gratis
            </RouterLink>
          </div>

          <!-- Authenticated Widgets -->
          <div v-else class="flex items-center gap-3 relative">
            <!-- 1. Chat Icon Route -->
            <RouterLink 
              to="/chat" 
              class="relative p-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100/70 transition-colors"
              title="Pesan Chat"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </RouterLink>

            <!-- 2. Notification Center Bell -->
            <div class="relative">
              <button 
                @click="toggleNotifMenu" 
                class="p-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100/70 transition-colors focus:outline-none"
                title="Notifikasi"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                
                <!-- Live badge counter -->
                <span 
                  v-if="unreadCount > 0" 
                  class="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white"
                >
                  {{ unreadCount }}
                </span>
              </button>

              <!-- Notifications Floating Panel -->
              <div 
                v-if="showNotifPanel" 
                class="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden"
              >
                <div class="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-800">Notifikasi Terbaru</h3>
                  <button 
                    v-if="unreadCount > 0"
                    @click="markAllAsRead" 
                    class="text-[10px] font-bold text-brand-500 hover:text-brand-600 hover:underline"
                  >
                    Tandai Semua Dibaca
                  </button>
                </div>

                <div class="max-h-[300px] overflow-y-auto divide-y divide-slate-50">
                  <div v-if="notifications.length === 0" class="p-8 text-center text-slate-400 text-xs">
                    Tidak ada notifikasi baru
                  </div>
                  
                  <div 
                    v-for="notif in notifications" 
                    :key="notif.id" 
                    class="p-4 flex gap-3 hover:bg-slate-50 transition-colors"
                    :class="!notif.read ? 'bg-brand-50/20' : ''"
                  >
                    <!-- Notification Type Icon -->
                    <div class="flex-shrink-0 mt-0.5">
                      <div 
                        class="w-7 h-7 rounded-lg flex items-center justify-center"
                        :class="{
                          'bg-sky-50 text-sky-500': notif.type === 'chat',
                          'bg-amber-50 text-amber-500': notif.type === 'match',
                          'bg-emerald-50 text-emerald-500': notif.type === 'claim_approved',
                          'bg-rose-50 text-rose-500': notif.type === 'claim_rejected'
                        }"
                      >
                        <svg v-if="notif.type === 'chat'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                        <svg v-else-if="notif.type === 'match'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 8 8 0 0118 0z"/></svg>
                      </div>
                    </div>

                    <!-- Text details -->
                    <div class="flex-grow">
                      <div class="flex justify-between items-start">
                        <h4 class="text-xs font-bold text-slate-800 leading-snug">{{ notif.title }}</h4>
                        <button 
                          @click.stop="deleteNotif(notif.id)" 
                          class="text-slate-300 hover:text-slate-500 ml-1 transition-colors"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      </div>
                      <p class="text-[11px] text-slate-500 mt-1 leading-relaxed">{{ notif.message }}</p>
                      
                      <!-- Mark as read -->
                      <button 
                        v-if="!notif.read"
                        @click="markRead(notif.id)" 
                        class="text-[9px] font-bold text-brand-500 hover:text-brand-600 mt-2 flex items-center gap-1"
                      >
                        <span class="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                        Tandai sudah dibaca
                      </button>
                    </div>
                  </div>
                </div>

                <div class="p-3 border-t border-slate-50 text-center bg-slate-50/30">
                  <RouterLink 
                    to="/notifications" 
                    @click="showNotifPanel = false" 
                    class="text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    Lihat Semua Notifikasi &rarr;
                  </RouterLink>
                </div>
              </div>
            </div>

            <!-- 3. Profile Dropdown Trigger -->
            <div class="relative">
              <button 
                @click="toggleProfileMenu"
                class="flex items-center gap-2 p-1 rounded-full border border-slate-100 hover:bg-slate-100/50 transition-colors focus:outline-none"
              >
                <img 
                  :src="user.photoURL" 
                  alt="Avatar" 
                  class="w-8 h-8 rounded-full border border-slate-100 flex-shrink-0"
                />
                <span class="hidden lg:inline text-xs font-bold text-slate-700 pr-2">{{ user.nama.split(' ')[0] }}</span>
              </button>

              <div 
                v-if="showProfilePanel"
                class="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden"
              >
                <!-- User Summary -->
                <div class="p-4 border-b border-slate-50 bg-slate-50/50">
                  <h4 class="text-xs font-bold text-slate-800 truncate leading-snug">{{ user.nama }}</h4>
                  <p class="text-[10px] text-slate-400 truncate mt-0.5 leading-snug">{{ user.email }}</p>
                  <span class="inline-block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-50 text-brand-600 mt-2">
                    {{ user.role === 'admin' ? 'Administrator' : 'User' }}
                  </span>
                </div>

                <div class="py-1">
                  <RouterLink 
                    to="/profile" 
                    @click="showProfilePanel = false" 
                    class="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    Profil Saya
                  </RouterLink>
                  
                  <button 
                    @click="handleLogout" 
                    class="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50/50 transition-colors text-left"
                  >
                    Keluar Sesi
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Burger Menu -->
          <button 
            v-if="user"
            @click="mobileMenuOpen = !mobileMenuOpen" 
            class="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <Transition name="slide">
      <div v-if="user && mobileMenuOpen" class="md:hidden border-t border-slate-100 bg-white/95 px-4 py-4 flex flex-col gap-2 shadow-inner">
        <RouterLink 
          v-for="link in navLinks" 
          :key="link.path" 
          :to="link.path" 
          @click="mobileMenuOpen = false"
          class="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50"
          :class="$route.path.startsWith(link.path) ? 'bg-brand-50 text-brand-600' : ''"
        >
          {{ link.name }}
        </RouterLink>

        <!-- Admin Gateway mobile -->
        <RouterLink 
          v-if="user.role === 'admin'"
          to="/admin" 
          @click="mobileMenuOpen = false"
          class="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-purple-50 text-purple-600"
          :class="$route.path.startsWith('/admin') ? 'bg-purple-50 text-purple-600' : ''"
        >
          Panel Admin
        </RouterLink>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useNotificationsStore } from '../../stores/notifications';

const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();
const router = useRouter();
const route = useRoute();

const user = computed(() => authStore.currentUser);

// Floating panels togglers
const showNotifPanel = ref(false);
const showProfilePanel = ref(false);
const mobileMenuOpen = ref(false);

const toggleNotifMenu = () => {
  showNotifPanel.value = !showNotifPanel.value;
  showProfilePanel.value = false;
};

const toggleProfileMenu = () => {
  showProfilePanel.value = !showProfilePanel.value;
  showNotifPanel.value = false;
};

// Sync Notification actions
const notifications = computed(() => notificationsStore.notifications);
const unreadCount = computed(() => notificationsStore.unreadCount);
const markRead = (id) => notificationsStore.markAsRead(id);
const markAllAsRead = () => notificationsStore.markAllAsRead();
const deleteNotif = (id) => notificationsStore.deleteNotification(id);

// Synchronize notification loading to currentUser
let stopNotifWatcher = null;
watch(() => authStore.currentUser, (newUser) => {
  if (stopNotifWatcher) stopNotifWatcher();
  if (newUser) {
    stopNotifWatcher = notificationsStore.initializeNotifications(newUser.uid);
  }
}, { immediate: true });

// Close panels on route shifts
watch(() => route.path, () => {
  showNotifPanel.value = false;
  showProfilePanel.value = false;
  mobileMenuOpen.value = false;
});

const navLinks = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Barang Hilang", path: "/missing" },
  { name: "Barang Temuan", path: "/found" },
  { name: "Kalender", path: "/calendar" },
  { name: "Chat", path: "/chat" },
  { name: "Profil Saya", path: "/profile" }
];

const handleLogout = async () => {
  showProfilePanel.value = false;
  await authStore.logout();
  notificationsStore.showToast("Berhasil keluar sesi.", "info");
  router.push("/");
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
