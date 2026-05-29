import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { databaseService } from "../firebase/databaseService";
import { useNotificationsStore } from "./notifications";

export const useItemsStore = defineStore("items", () => {
  const missingItems = ref([]);
  const foundItems = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Haversine formula to compute distance between coordinates in km
  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Auto Matching Engine: Computes a score from 0-100 between a missing and a found item
  const calculateMatchScore = (missing, found) => {
    // 1. Category must match exactly, otherwise 0 match
    if (missing.kategori.toLowerCase() !== found.kategori.toLowerCase()) {
      return 0;
    }
    
    let score = 40; // Base score for category match

    // 2. Color Similarity (+20 pts)
    const colorM = missing.warna.toLowerCase().trim();
    const colorF = found.warna.toLowerCase().trim();
    if (colorM === colorF || colorM.includes(colorF) || colorF.includes(colorM)) {
      score += 20;
    }

    // 3. Location Proximity (+20 pts)
    const dist = getDistance(missing.latitude, missing.longitude, found.latitude, found.longitude);
    if (dist <= 1.2) { // Within 1.2 km (campus area size)
      score += 20;
    } else if (missing.lokasi.toLowerCase() === found.lokasi.toLowerCase()) {
      score += 15;
    }

    // 4. Date Proximity (+20 pts)
    const dateM = new Date(missing.tanggal);
    const dateF = new Date(found.tanggal);
    const diffTime = Math.abs(dateF - dateM);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3) {
      score += 20;
    } else if (diffDays <= 7) {
      score += 10;
    }

    return score;
  };

  // Find all matches for a given item (missing or found)
  const getPotentialMatches = (item, type = "missing") => {
    const listToScan = type === "missing" ? foundItems.value : missingItems.value;
    const matches = [];

    listToScan.forEach(scanItem => {
      const missing = type === "missing" ? item : scanItem;
      const found = type === "missing" ? scanItem : item;
      const score = calculateMatchScore(missing, found);

      // We consider score >= 60 to be a Potential Match!
      if (score >= 60 && scanItem.status !== "returned" && item.status !== "returned") {
        matches.push({
          item: scanItem,
          score
        });
      }
    });

    return matches.sort((a, b) => b.score - a.score);
  };

  // Fetch and sync lists in real-time
  const initializeItems = () => {
    loading.value = true;
    
    // Sync missing items
    const unsubMissing = databaseService.onSnapshot("missing_items", [], (items) => {
      missingItems.value = items;
      loading.value = false;
    });

    // Sync found items
    const unsubFound = databaseService.onSnapshot("found_items", [], (items) => {
      foundItems.value = items;
      loading.value = false;
    });

    return () => {
      unsubMissing();
      unsubFound();
    };
  };

  // Add a new missing item report
  const addMissingItem = async (payload, userId) => {
    loading.value = true;
    try {
      const data = {
        ...payload,
        userId,
        status: "missing"
      };
      
      const newDoc = await databaseService.addDoc("missing_items", data);
      
      // Perform reactive auto-matching trigger
      triggerAutoMatchNotify(newDoc, "missing", userId);
      
      return newDoc;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Add a new found item report
  const addFoundItem = async (payload, userId) => {
    loading.value = true;
    try {
      const data = {
        ...payload,
        userId,
        status: "found"
      };
      
      const newDoc = await databaseService.addDoc("found_items", data);
      
      // Perform reactive auto-matching trigger
      triggerAutoMatchNotify(newDoc, "found", userId);
      
      return newDoc;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Updates status (e.g. from 'missing' to 'matching' or 'returned')
  const updateItemStatus = async (itemId, type = "missing", status) => {
    const collectionName = type === "missing" ? "missing_items" : "found_items";
    try {
      await databaseService.updateDoc(collectionName, itemId, { status });
    } catch (err) {
      console.error(`Gagal update status item ${itemId}:`, err);
    }
  };

  // Client-side Reactive matching notification trigger
  const triggerAutoMatchNotify = (item, type, userId) => {
    const matches = getPotentialMatches(item, type);
    if (matches.length > 0) {
      const notifStore = useNotificationsStore();
      
      // Set status to matching in DB
      updateItemStatus(item.id, type, "matching");
      
      matches.forEach(async (m) => {
        // Also update matching status of matching partner
        const partnerType = type === "missing" ? "found" : "missing";
        updateItemStatus(m.item.id, partnerType, "matching");
        
        // Push notification in DB
        const notifPayload = {
          userId,
          title: "Potential Match Ditemukan!",
          message: `Barang '${item.namaBarang}' yang baru saja Anda laporkan memiliki kecocokan sebesar ${m.score}% dengan '${m.item.namaBarang}' di ${m.item.lokasi}!`,
          type: "match",
          itemId: item.id,
          read: false
        };
        await databaseService.addDoc("notifications", notifPayload);

        // Notify the owner of the other item too!
        if (m.item.userId && m.item.userId !== userId) {
          const partnerNotifPayload = {
            userId: m.item.userId,
            title: "Potential Match Ditemukan!",
            message: `Barang '${m.item.namaBarang}' Anda memiliki kecocokan sebesar ${m.score}% dengan laporan '${item.namaBarang}' baru!`,
            type: "match",
            itemId: m.item.id,
            read: false
          };
          await databaseService.addDoc("notifications", partnerNotifPayload);
        }

        // Show a reactive local toast
        notifStore.showToast(
          `Potential Match! '${item.namaBarang}' cocok ${m.score}% dengan '${m.item.namaBarang}'!`,
          "info"
        );
      });
    }
  };

  // Delete spam reports
  const deleteItem = async (itemId, type = "missing") => {
    const collectionName = type === "missing" ? "missing_items" : "found_items";
    loading.value = true;
    try {
      await databaseService.deleteDoc(collectionName, itemId);
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    missingItems,
    foundItems,
    loading,
    error,
    initializeItems,
    getPotentialMatches,
    addMissingItem,
    addFoundItem,
    updateItemStatus,
    deleteItem,
    getDistance
  };
});
