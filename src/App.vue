<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <!-- Global Navbar -->
    <Navbar />

    <!-- Page Transitions -->
    <main class="flex-grow">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>

    <!-- Footer (shown on landing page and public pages only) -->
    <Footer v-if="showFooter" />

    <!-- Global Toast Notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { useNotificationsStore } from './stores/notifications';
import Navbar from './components/common/Navbar.vue';
import Footer from './components/common/Footer.vue';
import Toast from './components/common/Toast.vue';
import { seedMockData } from './utils/seeder';

const authStore = useAuthStore();
const notifStore = useNotificationsStore();
const route = useRoute();

// Boot: seed mock data + init auth
onMounted(() => {
  seedMockData();
  authStore.initializeAuth();
});

// Auto-start notifications when user is authenticated
watch(
  () => authStore.currentUser,
  (user) => {
    if (user) {
      notifStore.initializeNotifications(user.uid);
    }
  },
  { immediate: true }
);

// Show footer only on landing/public pages
const showFooter = computed(() => {
  const publicPaths = ['/', '/login', '/register'];
  return publicPaths.includes(route.path);
});
</script>
