import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { databaseService } from "../firebase/databaseService";

export const useNotificationsStore = defineStore("notifications", () => {
  const notifications = ref([]);
  const toasts = ref([]);
  const loading = ref(false);

  // Active Toast Alerts
  const showToast = (message, type = "success") => {
    const id = `toast-${Math.random().toString(36).substr(2, 9)}`;
    toasts.value.push({ id, message, type });
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id);
    }, 4000);
  };

  const removeToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  // Real-time notifications listener for a specific logged-in user
  const initializeNotifications = (userId) => {
    if (!userId) return () => {};
    loading.value = true;
    
    return databaseService.onSnapshot(
      "notifications",
      [{ field: "userId", operator: "==", value: userId }],
      (items) => {
        notifications.value = items;
        loading.value = false;
      }
    );
  };

  // Unread badge counter
  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.read).length;
  });

  // Mark all or single notification as read
  const markAsRead = async (notifId) => {
    try {
      await databaseService.updateDoc("notifications", notifId, { read: true });
    } catch (err) {
      console.error("Gagal membaca notifikasi:", err);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.value.filter(n => !n.read);
    try {
      await Promise.all(
        unread.map(n => databaseService.updateDoc("notifications", n.id, { read: true }))
      );
    } catch (err) {
      console.error("Gagal membaca semua notifikasi:", err);
    }
  };

  // Delete notification
  const deleteNotification = async (notifId) => {
    try {
      await databaseService.deleteDoc("notifications", notifId);
    } catch (err) {
      console.error("Gagal menghapus notifikasi:", err);
    }
  };

  return {
    notifications,
    toasts,
    loading,
    unreadCount,
    showToast,
    removeToast,
    initializeNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
});
