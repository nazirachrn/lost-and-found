import { initializeApp, getApps } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseConfig, isDemoMode } from "./config";

let storage;
if (!isDemoMode) {
  storage = getStorage();
}

export const storageService = {
  // Uploads file and returns download URL
  async uploadFile(path, file) {
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate latency
      
      // We will read the file as base64 so it remains in local storage and is fully viewable!
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result); // Base64 Data URL
        };
        reader.onerror = () => {
          reject(new Error("Gagal membaca file gambar"));
        };
        reader.readAsDataURL(file);
      });
    } else {
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    }
  }
};
