import { isDemoMode } from "./config";

// Cloudinary Configuration
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/ecogoals/image/upload";
const UPLOAD_PRESET = "lostlink_preset";

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
      // Use Cloudinary for actual uploads
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      // Optional: you can pass the 'path' as a folder parameter if desired, 
      // but the preset 'lostlink_assets' folder setting usually overrides it.
      formData.append("folder", `lostlink_assets/${path}`); 

      try {
        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error?.message || "Gagal mengunggah gambar ke Cloudinary");
        }

        const data = await response.json();
        // Return the secure URL provided by Cloudinary
        return data.secure_url;
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
      }
    }
  }
};
