<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
    <!-- Breadcrumb & Title -->
    <div>
      <RouterLink to="/dashboard" class="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors mb-2">
        &larr; Kembali ke Dashboard
      </RouterLink>
      <h1 class="text-2xl font-black text-slate-800 tracking-tight font-sans">
        {{ type === 'missing' ? 'Laporkan Barang Hilang' : 'Saya Menemukan Barang' }}
      </h1>
      <p class="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
        {{ type === 'missing' ? 'Berikan detail lengkap barang berharga Anda yang hilang' : 'Unggah penemuan barang agar terhubung ke pemiliknya' }}
      </p>
    </div>

    <!-- Form layout split with Map -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Form fields -->
      <form @submit.prevent="handleSubmit" class="lg:col-span-7 card-premium p-6 flex flex-col gap-4 bg-white">
        
        <!-- 1. Nama Barang & Kategori -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Nama Barang</label>
            <input 
              type="text" 
              v-model="form.namaBarang" 
              required 
              placeholder="iPhone 13 Pro Max / Kunci Vario"
              class="text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Kategori</label>
            <select 
              v-model="form.kategori" 
              required
              class="text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:border-brand-500 focus:outline-none"
            >
              <option value="" disabled>Pilih Kategori</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
        </div>

        <!-- 2. Warna & Lokasi -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Warna Utama</label>
            <input 
              type="text" 
              v-model="form.warna" 
              required 
              placeholder="Hitam / Abu-abu / Coklat"
              class="text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Tempat Kejadian / Lokasi</label>
            <select 
              v-model="form.lokasi" 
              required
              class="text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:border-brand-500 focus:outline-none"
            >
              <option value="" disabled>Pilih Lokasi</option>
              <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
            </select>
            <!-- Conditional Input Custom Lokasi -->
            <input 
              v-if="form.lokasi === 'Lainnya...'"
              type="text"
              v-model="customLokasi"
              required
              placeholder="Sebutkan nama lokasi/tempat spesifik Anda..."
              class="text-xs rounded-xl border border-slate-200 px-3 py-2.5 mt-2 focus:border-brand-500 focus:outline-none"
            />
          </div>
        </div>

        <!-- 3. Tanggal & Upload Foto -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
              {{ type === 'missing' ? 'Tanggal Kehilangan' : 'Tanggal Menemukan' }}
            </label>
            <input 
              type="date" 
              v-model="form.tanggal" 
              required 
              class="text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Foto Barang</label>
            <div class="flex items-center gap-2">
              <input 
                type="file" 
                ref="fileInput" 
                accept="image/*" 
                @change="handleFileChange" 
                class="hidden"
                :required="type === 'found'" 
              />
              <button 
                type="button" 
                @click="$refs.fileInput.click()" 
                class="flex items-center gap-1.5 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors w-full justify-center"
              >
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                Pilih Gambar
              </button>
            </div>
            <span class="text-[9px] text-slate-400 truncate text-center mt-1">
              {{ selectedFileName || "Belum ada file dipilih" }}
            </span>
          </div>
        </div>

        <!-- 4. Deskripsi Detail -->
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Deskripsi Detail</label>
          <textarea 
            v-model="form.deskripsi" 
            required 
            rows="3"
            placeholder="Jelaskan secara kronologis kejadian penemuan atau kehilangan barang."
            class="text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:border-brand-500 focus:outline-none"
          ></textarea>
        </div>

        <!-- 5. Ciri Khusus -->
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Ciri Khusus (Fisik)</label>
          <textarea 
            v-model="form.ciriKhusus" 
            required 
            rows="2"
            placeholder="Sebutkan ciri fisik unik (misal: baret, casing, sticker di belakang, retak kecil, isi gantungan)."
            class="text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:border-brand-500 focus:outline-none"
          ></textarea>
        </div>

        <!-- 6. Kontak Alternatif (Optional, for Missing only) -->
        <div v-if="type === 'missing'" class="flex flex-col gap-1">
          <label class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Kontak Alternatif (Opsional)</label>
          <input 
            type="text" 
            v-model="form.kontakAlternatif" 
            placeholder="Telegram: @username / No WA"
            class="text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:border-brand-500 focus:outline-none"
          />
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
          <RouterLink 
            to="/dashboard" 
            class="px-5 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
          >
            Batal
          </RouterLink>
          <button 
            type="submit" 
            class="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-black shadow-md shadow-brand-100 transition-all flex items-center justify-center gap-2"
            :disabled="submitting"
          >
            <span v-if="submitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Unggah Laporan</span>
          </button>
        </div>
      </form>

      <!-- Leaflet Map Selector panel -->
      <div class="lg:col-span-5 flex flex-col gap-3">
        <div class="flex flex-col">
          <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-800">Koordinat Lokasi Kejadian</h3>
          <p class="text-[10px] text-slate-400 mt-1 leading-snug">Geser penanda pin atau klik peta untuk menetapkan koordinat koordinasi lokasi barang Anda secara presisi.</p>
        </div>

        <!-- Map Component -->
        <div class="relative rounded-2xl transition-all" :class="{ 'pointer-events-none opacity-85': isMapLocked }">
          <LeafletMap 
            v-model="mapCoords" 
            :readonly="false" 
            height="390px" 
          />
        </div>

        <div class="flex bg-slate-100 rounded-xl p-3 justify-between items-center text-[10px] text-slate-500">
          <span>Lat: <strong>{{ mapCoords.lat.toFixed(6) }}</strong></span>
          <span>Lng: <strong>{{ mapCoords.lng.toFixed(6) }}</strong></span>
        </div>

        <!-- Lock Map Action Buttons -->
        <div class="flex items-center gap-2 mt-1">
          <button 
            type="button"
            v-if="!isMapLocked"
            @click="isMapLocked = true"
            class="flex-1 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold py-3 rounded-xl shadow-md transition-all active:scale-95"
          >
            Konfirmasi Koordinat Lokasi
          </button>
          <button 
            type="button"
            v-else
            @click="isMapLocked = false"
            class="flex-1 bg-emerald-500 text-white text-xs font-bold py-3 rounded-xl shadow-md cursor-default flex justify-center items-center gap-2"
          >
            Lokasi Berhasil Dikunci <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
          </button>
          
          <button 
            type="button"
            v-if="isMapLocked"
            @click="isMapLocked = false"
            class="px-4 py-3 text-[10px] font-bold text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all border border-transparent hover:border-brand-200 flex-shrink-0"
          >
            Ubah Lokasi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useItemsStore } from "../stores/items";
import { useNotificationsStore } from "../stores/notifications";
import { storageService } from "../firebase/storageService";
import LeafletMap from "../components/common/LeafletMap.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const itemsStore = useItemsStore();
const notifStore = useNotificationsStore();

const type = computed(() => route.meta.type || "missing");

const submitting = ref(false);
const selectedFile = ref(null);
const selectedFileName = ref("");
const fileInput = ref(null);

const customLokasi = ref("");
const isMapLocked = ref(false);

// Center point of university Campus
const mapCoords = ref({ lat: -6.2088, lng: 106.8456 });

const form = ref({
  namaBarang: "",
  kategori: "",
  warna: "",
  lokasi: "",
  tanggal: new Date().toISOString().split('T')[0],
  deskripsi: "",
  ciriKhusus: "",
  kontakAlternatif: "",
  foto: ""
});

const categories = ["HP", "Laptop", "Dompet", "Tas", "Kunci", "Kartu Identitas", "Aksesoris", "Lainnya"];
const locations = ["Kampus Utama", "Cafe Kopi", "Perpustakaan Pusat", "Parkiran Utara", "Aula Seminar", "Lainnya..."];

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
    let uploadedFoto = "";
    if (selectedFile.value) {
      uploadedFoto = await storageService.uploadFile(type.value, selectedFile.value);
    } else {
      // Dummy visual placeholder
      uploadedFoto = "https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=400";
    }

    const payload = {
      namaBarang: form.value.namaBarang,
      kategori: form.value.kategori,
      warna: form.value.warna,
      lokasi: form.value.lokasi === "Lainnya..." ? customLokasi.value : form.value.lokasi,
      tanggal: form.value.tanggal,
      deskripsi: form.value.deskripsi,
      ciriKhusus: form.value.ciriKhusus,
      kontakAlternatif: form.value.kontakAlternatif || "",
      foto: uploadedFoto,
      latitude: mapCoords.value.lat,
      longitude: mapCoords.value.lng
    };

    const user = authStore.currentUser;
    
    if (type.value === "missing") {
      await itemsStore.addMissingItem(payload, user.uid);
      notifStore.showToast("Berhasil melaporkan barang hilang!", "success");
    } else {
      await itemsStore.addFoundItem(payload, user.uid);
      notifStore.showToast("Berhasil melaporkan temuan barang!", "success");
    }

    router.push("/dashboard");
  } catch (err) {
    notifStore.showToast(`Gagal: ${err.message}`, "error");
  } finally {
    submitting.value = false;
  }
};
</script>
