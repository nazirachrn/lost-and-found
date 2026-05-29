import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { databaseService } from "../firebase/databaseService";
import { useNotificationsStore } from "./notifications";

export const useChatStore = defineStore("chat", () => {
  const messages = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Sync real-time message stream for a specific logged-in user
  const initializeChatStream = (userId) => {
    if (!userId) return () => {};
    loading.value = true;
    
    // In order to get all chats involving this user, we stream all messages, 
    // and filter them reactively in JS. This avoids complex OR queries in Firestore!
    return databaseService.onSnapshot(
      "messages", 
      [], 
      (items) => {
        // Filter messages that belong to this user
        messages.value = items.filter(
          m => m.senderId === userId || m.receiverId === userId
        );
        loading.value = false;
      },
      "createdAt",
      "asc" // Sort ascending so chat bubbles render in timeline order!
    );
  };

  // Group messages into distinct rooms / channels
  const activeRooms = computed(() => {
    const rooms = {};
    
    messages.value.forEach(msg => {
      if (!rooms[msg.chatId]) {
        rooms[msg.chatId] = {
          chatId: msg.chatId,
          lastMessage: msg.text,
          lastMessageTime: msg.createdAt,
          // Extract participants
          senderId: msg.senderId,
          senderName: msg.senderName,
          receiverId: msg.receiverId,
          messages: []
        };
      }
      
      rooms[msg.chatId].messages.push(msg);
      rooms[msg.chatId].lastMessage = msg.text;
      rooms[msg.chatId].lastMessageTime = msg.createdAt;
    });

    return Object.values(rooms).sort(
      (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );
  });

  // Send a new message
  const sendMessage = async (chatId, senderId, senderName, receiverId, text) => {
    if (!text.trim()) return;
    
    try {
      const payload = {
        chatId,
        senderId,
        senderName,
        receiverId,
        text: text.trim()
      };

      const newMsg = await databaseService.addDoc("messages", payload);
      
      // Also send a real-time notification to the receiver in the background
      await databaseService.addDoc("notifications", {
        userId: receiverId,
        title: `Pesan baru dari ${senderName}`,
        message: text.length > 50 ? `${text.substr(0, 47)}...` : text,
        type: "chat",
        itemId: chatId,
        read: false
      });

      return newMsg;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  return {
    messages,
    loading,
    error,
    activeRooms,
    initializeChatStream,
    sendMessage
  };
});
