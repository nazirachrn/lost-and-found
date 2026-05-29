<template>
  <div class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-md w-full px-4 md:px-0">
    <TransitionGroup name="toast-list">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        class="glass flex items-center p-4 rounded-xl shadow-lg border-l-4 transition-all duration-300 transform"
        :class="{
          'border-emerald-500 bg-emerald-50/90 text-emerald-900': toast.type === 'success',
          'border-sky-500 bg-sky-50/90 text-sky-900': toast.type === 'info',
          'border-amber-500 bg-amber-50/90 text-amber-900': toast.type === 'warning',
          'border-rose-500 bg-rose-50/90 text-rose-900': toast.type === 'error',
        }"
      >
        <!-- Icons -->
        <span class="mr-3 flex-shrink-0">
          <svg v-if="toast.type === 'success'" class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 8 8 0 0118 0z" />
          </svg>
          <svg v-else-if="toast.type === 'info'" class="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 8 8 0 0118 0z" />
          </svg>
          <svg v-else-if="toast.type === 'warning'" class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <svg v-else class="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 8 8 0 0118 0z" />
          </svg>
        </span>

        <!-- Message -->
        <p class="text-sm font-medium pr-8 leading-snug">{{ toast.message }}</p>

        <!-- Close button -->
        <button 
          @click="removeToast(toast.id)" 
          class="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useNotificationsStore } from '../../stores/notifications';

const notificationsStore = useNotificationsStore();
const toasts = computed(() => notificationsStore.toasts);
const removeToast = (id) => notificationsStore.removeToast(id);
</script>

<style scoped>
.toast-list-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
.toast-list-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
.toast-list-leave-active {
  position: absolute;
}
</style>
