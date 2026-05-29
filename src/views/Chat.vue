<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-5rem)] flex flex-col gap-0">
    <div class="flex h-full bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
      
      <!-- Sidebar: Chat Rooms -->
      <div 
        class="w-full md:w-80 flex-shrink-0 border-r border-slate-100 flex flex-col"
        :class="activeChat && 'hidden md:flex'"
      >
        <div class="p-5 border-b border-slate-50 bg-slate-50/50">
          <h2 class="text-sm font-black text-slate-800 uppercase tracking-wider">Pesan Saya</h2>
          <p class="text-[10px] text-slate-400 font-medium mt-0.5">Chat internal aman tanpa nomor HP</p>
        </div>

        <div class="flex-1 overflow-y-auto divide-y divide-slate-50">
          <!-- Admin Contacts -->
          <div v-if="adminContacts.length > 0" class="p-3 bg-brand-50/30">
            <h3 class="text-[10px] font-extrabold uppercase tracking-wider text-brand-500 mb-2 px-2">Hubungi Admin</h3>
            <div 
              v-for="admin in adminContacts" 
              :key="admin.id"
              @click="openAdminChat(admin)"
              class="p-2 flex items-center gap-3 cursor-pointer hover:bg-brand-50 transition-colors rounded-xl"
              :class="activeChat?.receiverId === admin.id || activeChat?.senderId === admin.id ? 'bg-brand-100 border border-brand-200' : 'border border-transparent'"
            >
              <img 
                :src="admin.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${admin.nama}`" 
                class="w-8 h-8 rounded-full border border-brand-100 flex-shrink-0" 
              />
              <div class="min-w-0 flex-1">
                <h4 class="text-[11px] font-bold text-slate-800 truncate">{{ admin.nama }}</h4>
                <p class="text-[9px] text-brand-600 font-semibold">{{ admin.role === 'super_admin' ? 'Super Admin' : 'Admin' }}</p>
              </div>
            </div>
          </div>
          <!-- Empty state -->
          <div v-if="chatStore.loading" class="p-6 flex flex-col gap-3">
            <div v-for="i in 4" :key="i" class="animate-pulse flex gap-3 items-center">
              <div class="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0"></div>
              <div class="flex flex-col gap-2 flex-1">
                <div class="h-3 bg-slate-200 rounded w-3/4"></div>
                <div class="h-2.5 bg-slate-100 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          <div v-else-if="chatStore.activeRooms.length === 0" class="p-10 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
            <svg class="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
            <div>
              <p class="font-bold text-slate-500">Belum ada percakapan</p>
              <p class="text-[10px] mt-1 leading-relaxed">Buka halaman detail barang dan tekan "Hubungi Penemu" untuk memulai chat.</p>
            </div>
          </div>

          <div 
            v-for="room in chatStore.activeRooms" 
            :key="room.chatId"
            @click="openChat(room)"
            class="p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
            :class="activeChat?.chatId === room.chatId ? 'bg-brand-50/50 border-l-2 border-brand-500' : ''"
          >
            <img 
              :src="getPartnerAvatar(room)" 
              class="w-10 h-10 rounded-full border border-slate-100 flex-shrink-0" 
            />
            <div class="min-w-0 flex-1">
              <div class="flex justify-between items-start">
                <h4 class="text-xs font-bold text-slate-800 truncate">{{ getPartnerName(room) }}</h4>
                <span class="text-[9px] text-slate-400 flex-shrink-0 ml-1">{{ formatTime(room.lastMessageTime) }}</span>
              </div>
              <p class="text-[11px] text-slate-400 truncate mt-0.5">{{ room.lastMessage }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Window -->
      <div class="flex-1 flex flex-col" :class="!activeChat && 'hidden md:flex'">
        <!-- No chat selected state -->
        <div v-if="!activeChat" class="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
          <div class="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center">
            <svg class="w-8 h-8 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-600">Pilih percakapan</h3>
            <p class="text-xs text-slate-400 mt-1">Pilih room chat di sebelah kiri atau buka barang ditemukan dan tekan "Hubungi Penemu"</p>
          </div>
        </div>

        <!-- Active Chat Window -->
        <template v-else>
          <!-- Chat Header -->
          <div class="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <button @click="activeChat = null" class="md:hidden p-1 text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <img :src="getPartnerAvatar(activeChat)" class="w-9 h-9 rounded-full border border-slate-100" />
            <div>
              <h4 class="text-sm font-bold text-slate-800">{{ getPartnerName(activeChat) }}</h4>
              <span class="flex items-center gap-1 text-[10px] text-emerald-500 font-bold">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                Aktif
              </span>
            </div>
          </div>

          <!-- Messages -->
          <div ref="messagesContainer" class="flex-1 overflow-y-auto p-5 flex flex-col gap-3 bg-slate-50/20">
            <div 
              v-for="msg in activeChatMessages" 
              :key="msg.id"
              class="flex"
              :class="msg.senderId === user.uid ? 'justify-end' : 'justify-start'"
            >
              <div 
                class="max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed"
                :class="msg.senderId === user.uid 
                  ? 'bg-brand-500 text-white rounded-tr-sm' 
                  : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-sm'"
              >
                <p>{{ msg.text }}</p>
                <span 
                  class="text-[9px] mt-1 block"
                  :class="msg.senderId === user.uid ? 'text-brand-200' : 'text-slate-400'"
                >
                  {{ formatTime(msg.createdAt) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <form @submit.prevent="sendMsg" class="p-4 border-t border-slate-100 bg-white flex items-center gap-3">
            <input 
              v-model="messageInput" 
              type="text"
              placeholder="Tulis pesan Anda dengan sopan..."
              class="flex-1 text-xs rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none bg-slate-50/50"
              :disabled="sending"
            />
            <button 
              type="submit"
              class="p-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition-all disabled:opacity-50 flex-shrink-0"
              :disabled="!messageInput.trim() || sending"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useChatStore } from '../stores/chat';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const route = useRoute();
const authStore = useAuthStore();
const chatStore = useChatStore();

const user = computed(() => authStore.currentUser);
const activeChat = ref(null);
const messageInput = ref('');
const sending = ref(false);
const messagesContainer = ref(null);
const adminContacts = ref([]);

const fetchAdmins = async () => {
  try {
    const db = getFirestore();
    const q = query(
      collection(db, "users"),
      where("role", "in", ["admin", "super_admin"])
    );
    
    const querySnapshot = await getDocs(q);
    const admins = [];
    querySnapshot.forEach((doc) => {
      if (user.value && doc.id !== user.value.uid) {
        admins.push({ id: doc.id, ...doc.data() });
      }
    });
    if (admins.length === 0) {
      admins.push({
        id: "admin-nazira",
        nama: "Nazira Chairani Fauza",
        role: "super_admin",
        email: "nazira.lostlink@upi-yptk.ac.id"
      });
      admins.push({
        id: "admin-damai",
        nama: "Damai Puti Afifah",
        role: "admin",
        email: "damai.lostlink@upi-yptk.ac.id"
      });
    }
    
    adminContacts.value = admins;
  } catch (error) {
    console.error("Gagal mengambil kontak admin:", error);
  }
};

let unsubChat = null;
onMounted(() => {
  if (user.value) {
    unsubChat = chatStore.initializeChatStream(user.value.uid);
    fetchAdmins();
    
    // Auto-open chatId from query param (from ItemDetail)
    if (route.query.chatId) {
      nextTick(() => {
        const room = chatStore.activeRooms.find(r => r.chatId === route.query.chatId);
        if (room) activeChat.value = room;
        else {
          // Pre-create a mock room from query params
          activeChat.value = {
            chatId: route.query.chatId,
            senderId: user.value.uid,
            senderName: user.value.nama,
            receiverId: route.query.with,
            messages: [],
            lastMessage: '',
            lastMessageTime: new Date().toISOString()
          };
        }
      });
    }
  }
});

onUnmounted(() => {
  if (unsubChat) unsubChat();
});

// Watch for new messages → auto-scroll to bottom
const activeChatMessages = computed(() => {
  if (!activeChat.value) return [];
  const allMsgs = chatStore.messages;
  return allMsgs
    .filter(m => m.chatId === activeChat.value.chatId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
});

watch(activeChatMessages, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
});

const openChat = (room) => {
  activeChat.value = room;
};

const openAdminChat = (admin) => {
  const generatedChatId = [user.value.uid, admin.id].sort().join('_');
  
  const existingRoom = chatStore.activeRooms.find(r => r.chatId === generatedChatId);
  if (existingRoom) {
    activeChat.value = existingRoom;
  } else {
    activeChat.value = {
      chatId: generatedChatId,
      senderId: user.value.uid,
      senderName: user.value.nama,
      receiverId: admin.id,
      messages: [],
      lastMessage: 'Mulai percakapan dengan admin',
      lastMessageTime: new Date().toISOString()
    };
    partnerProfiles.value[admin.id] = admin;
  }
};

const sendMsg = async () => {
  if (!messageInput.value.trim() || sending.value || !activeChat.value) return;
  sending.value = true;
  const text = messageInput.value.trim();
  messageInput.value = '';

  try {
    const receiverId = activeChat.value.senderId === user.value.uid 
      ? activeChat.value.receiverId 
      : activeChat.value.senderId;

    await chatStore.sendMessage(
      activeChat.value.chatId,
      user.value.uid,
      user.value.nama,
      receiverId,
      text
    );
  } catch (e) {
    console.error('Gagal kirim pesan:', e);
  } finally {
    sending.value = false;
  }
};

import { databaseService } from '../firebase/databaseService';

const partnerProfiles = ref({});

const loadPartnerProfile = async (partnerId) => {
  if (!partnerId || partnerProfiles.value[partnerId] || partnerProfiles.value[partnerId] === 'loading') return;
  
  partnerProfiles.value[partnerId] = 'loading'; // prevent duplicate fetches
  
  try {
    const userDoc = await databaseService.getDoc('users', partnerId);
    if (userDoc) {
      partnerProfiles.value[partnerId] = userDoc;
    } else {
      partnerProfiles.value[partnerId] = { nama: 'Pengguna LostLink', photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=user` };
    }
  } catch (error) {
    // If not found in firestore, fallback to default
    partnerProfiles.value[partnerId] = { nama: 'Pengguna LostLink', photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=user` };
  }
};

// Prefetch partner profiles when rooms are loaded
watch(() => chatStore.activeRooms, (newRooms) => {
  if (user.value) {
    newRooms.forEach(room => {
      const partnerId = room.senderId === user.value.uid ? room.receiverId : room.senderId;
      loadPartnerProfile(partnerId);
    });
  }
}, { immediate: true });

// Prefetch for query param mock room
watch(() => route.query.with, (newPartnerId) => {
  if (newPartnerId) {
    loadPartnerProfile(newPartnerId);
  }
}, { immediate: true });

const getPartnerName = (room) => {
  if (!room || !user.value) return 'Pengguna';
  const partnerId = room.senderId === user.value.uid ? room.receiverId : room.senderId;
  const profile = partnerProfiles.value[partnerId];
  return (profile && profile !== 'loading') ? profile.nama : (profile === 'loading' ? 'Memuat...' : 'Pengguna LostLink');
};

const getPartnerAvatar = (room) => {
  if (!room || !user.value) return '';
  const partnerId = room.senderId === user.value.uid ? room.receiverId : room.senderId;
  const profile = partnerProfiles.value[partnerId];
  return (profile && profile !== 'loading') ? profile.photoURL : `https://api.dicebear.com/7.x/adventurer/svg?seed=user`;
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};
</script>
