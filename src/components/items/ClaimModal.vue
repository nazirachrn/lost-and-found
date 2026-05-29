<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-[9999] overflow-y-auto bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4"
  >
    <div class="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform transition-all duration-300">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div>
          <h3 class="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Verifikasi Kepemilikan Barang</h3>
          <p class="text-xs text-slate-400 mt-0.5 leading-snug">Klaim barang: <span class="font-semibold text-brand-500">{{ itemName }}</span></p>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form Body -->
      <form @submit.prevent="handleSubmit" class="p-6 flex flex-col gap-4">
        <!-- 1. Ciri Khusus -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Ciri-Ciri Khusus</label>
          <textarea 
            v-model="form.ciriKhusus" 
            required
            rows="3"
            placeholder="Sebutkan detail goresan, stiker, wallpaper, keretakan, casing, atau tanda fisik yang membedakan barang ini dari barang sejenis."
            class="text-xs rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none placeholder:text-slate-400"
          ></textarea>
        </div>

        <!-- 2. Isi Barang -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Isi Di Dalam Barang</label>
          <textarea 
            v-model="form.isiBarang" 
            required
            rows="2"
            placeholder="Sebutkan benda, nominal uang, kartu identitas, file skripsi, atau barang di dalam ransel/dompet tersebut."
            class="text-xs rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none placeholder:text-slate-400"
          ></textarea>
        </div>

        <!-- 3. Bukti Tambahan -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Bukti Tambahan Kepemilikan</label>
          <textarea 
            v-model="form.buktiTambahan" 
            required
            rows="2"
            placeholder="Misal: Nomor IMEI HP yang sesuai box, foto jas lab dengan nama saya, bukti struk beli, atau STNK motor."
            class="text-xs rounded-xl border border-slate-200 px-3 py-2 focus:border-brand-500 focus:outline-none placeholder:text-slate-400"
          ></textarea>
        </div>

        <!-- 4. Upload Foto Pendukung (Optional) -->
        <div class="flex flex-col gap-1.5">
          <label class="text-xs font-bold text-slate-500 uppercase tracking-wide">Foto Pendukung (Opsional)</label>
          <div class="flex items-center gap-3">
            <input 
              type="file" 
              ref="fileInput" 
              accept="image/*" 
              @change="handleFileChange" 
              class="hidden"
            />
            <button 
              type="button" 
              @click="$refs.fileInput.click()" 
              class="flex items-center gap-1.5 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Pilih Gambar
            </button>
            <span class="text-[10px] text-slate-400 truncate max-w-[200px]">
              {{ selectedFileName || "Belum ada file dipilih" }}
            </span>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
          <button 
            type="button" 
            @click="$emit('close')" 
            class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            :disabled="submitting"
          >
            Batal
          </button>
          
          <button 
            type="submit" 
            class="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-black shadow-md shadow-brand-100 flex items-center gap-2 transition-all"
            :disabled="submitting"
          >
            <span v-if="submitting" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Kirim Klaim Verifikasi</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { storageService } from "../../firebase/storageService";
import { useClaimsStore } from "../../stores/claims";
import { useAuthStore } from "../../stores/auth";

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  itemType: { type: String, required: true }, // 'missing' or 'found'
  reporterId: { type: String, required: true } // Added reporterId prop
});

const emit = defineEmits(["close", "success"]);

const claimsStore = useClaimsStore();
const authStore = useAuthStore();

const submitting = ref(false);
const selectedFile = ref(null);
const selectedFileName = ref("");
const fileInput = ref(null);

const form = ref({
  ciriKhusus: "",
  isiBarang: "",
  buktiTambahan: "",
  fotoPendukung: ""
});

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile.value = file;
    selectedFileName.value = file.name;
  }
};

const handleSubmit = async () => {
  if (submitting.value) return;
  submitting.value = true;

  try {
    let fotoUrl = "";
    if (selectedFile.value) {
      fotoUrl = await storageService.uploadFile("claims", selectedFile.value);
    }

    const payload = {
      itemId: props.itemId,
      itemName: props.itemName,
      itemType: props.itemType,
      reporterId: props.reporterId, // Propagated reporterId
      ciriKhusus: form.value.ciriKhusus,
      isiBarang: form.value.isiBarang,
      buktiTambahan: form.value.buktiTambahan,
      fotoPendukung: fotoUrl
    };

    const user = authStore.currentUser;
    await claimsStore.submitClaim(payload, user.uid, user.nama);

    // Reset Form
    form.value = {
      ciriKhusus: "",
      isiBarang: "",
      buktiTambahan: "",
      fotoPendukung: ""
    };
    selectedFile.value = null;
    selectedFileName.value = "";

    emit("success");
  } catch (err) {
    console.error("Gagal mengirim klaim:", err);
  } finally {
    submitting.value = false;
  }
};
</script>
