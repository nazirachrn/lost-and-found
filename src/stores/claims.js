import { defineStore } from "pinia";
import { ref } from "vue";
import { databaseService } from "../firebase/databaseService";
import { useNotificationsStore } from "./notifications";
import { useItemsStore } from "./items";

export const useClaimsStore = defineStore("claims", () => {
  const claims = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Initialize and sync all claims (P2P model pulls all and filters locally)
  const initializeClaims = (role = "user", userId = null) => {
    loading.value = true;
    return databaseService.onSnapshot("claims", [], (items) => {
      claims.value = items;
      loading.value = false;
    });
  };

  // Submit a new claim
  const submitClaim = async (payload, claimantId, claimantName) => {
    loading.value = true;
    try {
      const data = {
        ...payload,
        claimantId,
        claimantName,
        status: "pending"
      };

      const newClaim = await databaseService.addDoc("claims", data);
      
      // Update item status to matching / under review
      const itemsStore = useItemsStore();
      await itemsStore.updateItemStatus(payload.itemId, payload.itemType, "matching");

      // Notify user via Toast
      const notifStore = useNotificationsStore();
      notifStore.showToast("Klaim berhasil diajukan! Menunggu verifikasi dari penemu.", "success");

      return newClaim;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // User (reporter/finder) approves a claim on their item
  const approveClaim = async (claim, approverUserId) => {
    loading.value = true;
    try {
      // 1. Update claim status to 'verified'
      await databaseService.updateDoc("claims", claim.id, { status: "verified" });

      // 2. Update item status to 'verified'
      const itemsStore = useItemsStore();
      await itemsStore.updateItemStatus(claim.itemId, claim.itemType, "verified");

      // 3. Send Notification to claimant
      const notifStore = useNotificationsStore();
      await databaseService.addDoc("notifications", {
        userId: claim.claimantId,
        title: "Klaim Disetujui Penemu!",
        message: `Klaim Anda untuk barang '${claim.itemName}' telah disetujui oleh Penemu! Silakan hubungi melalui chat internal untuk serah terima.`,
        type: "claim_approved",
        itemId: claim.itemId,
        read: false
      });

      // 4. Send Notification to reporter (approver)
      if (approverUserId && approverUserId !== claim.claimantId) {
        await databaseService.addDoc("notifications", {
          userId: approverUserId,
          title: "Verifikasi Kepemilikan Selesai",
          message: `Anda menyetujui klaim dari '${claim.claimantName}' untuk barang '${claim.itemName}'. Silakan koordinasikan serah terima via chat.`,
          type: "claim_approved",
          itemId: claim.itemId,
          read: false
        });
      }

      notifStore.showToast("Klaim berhasil Anda setujui!", "success");
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // User (reporter/finder) rejects a claim on their item
  const rejectClaim = async (claim, reason = "Bukti atau ciri-ciri khusus kurang akurat.") => {
    loading.value = true;
    try {
      // 1. Update claim status to 'rejected'
      await databaseService.updateDoc("claims", claim.id, { status: "rejected" });

      // 2. Revert item status back to 'missing' or 'found'
      const itemsStore = useItemsStore();
      const defaultStatus = claim.itemType === "missing" ? "missing" : "found";
      await itemsStore.updateItemStatus(claim.itemId, claim.itemType, defaultStatus);

      // 3. Send Notification to claimant
      const notifStore = useNotificationsStore();
      await databaseService.addDoc("notifications", {
        userId: claim.claimantId,
        title: "Klaim Ditolak Penemu",
        message: `Maaf, klaim Anda untuk barang '${claim.itemName}' ditolak oleh Penemu. Alasan: ${reason}`,
        type: "claim_rejected",
        itemId: claim.itemId,
        read: false
      });

      notifStore.showToast("Klaim berhasil ditolak.", "info");
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    claims,
    loading,
    error,
    initializeClaims,
    submitClaim,
    approveClaim,
    rejectClaim
  };
});
