<template>
  <div class="relative overflow-hidden rounded-2xl border border-slate-200 shadow-premium group">
    <!-- Overlay while loading map -->
    <div v-if="loading" class="absolute inset-0 bg-slate-100 flex flex-col justify-center items-center gap-3 z-10">
      <div class="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-xs text-slate-500 font-medium">Memuat peta...</p>
    </div>
    
    <!-- Map Container -->
    <div :id="mapId" :style="{ height }" class="w-full"></div>
    
    <!-- Floating Geocoding Search Input -->
    <div 
      class="absolute top-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-80 z-[1000] flex flex-col gap-1.5"
    >
      <div class="glass flex items-center gap-2 px-3.5 py-2.5 rounded-2xl shadow-lg">
        <svg class="w-4 h-4 text-brand-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="handleSearchInput"
          @keydown.enter.prevent="triggerSearch"
          placeholder="Cari lokasi kejadian..." 
          class="bg-transparent text-xs text-slate-800 placeholder:text-slate-400 font-bold focus:outline-none w-full"
        />
        <button 
          v-if="searchQuery" 
          @click="clearSearch" 
          class="text-slate-400 hover:text-slate-600 flex-shrink-0"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Autocomplete Dropdown List -->
      <div 
        v-if="searchResults.length > 0" 
        class="glass max-h-48 overflow-y-auto rounded-2xl shadow-xl divide-y divide-brand-100/30"
      >
        <button 
          v-for="res in searchResults" 
          :key="res.place_id"
          @click="selectLocation(res)"
          type="button"
          class="w-full text-left px-4 py-2.5 hover:bg-brand-50/50 text-[11px] font-semibold text-slate-700 leading-snug transition-colors flex flex-col gap-0.5"
        >
          <span class="font-extrabold text-slate-800">{{ res.display_name.split(',')[0] }}</span>
          <span class="text-[9px] text-slate-400 font-normal truncate max-w-full leading-none">{{ res.display_name }}</span>
        </button>
      </div>
    </div>
    
    <!-- Helper tag -->
    <div 
      v-if="!readonly" 
      class="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-slate-900/90 text-white text-[11px] font-medium px-3 py-1.5 rounded-full shadow-lg pointer-events-none z-[1000] flex items-center gap-1.5 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100"
    >
      <svg class="w-3.5 h-3.5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span>Klik peta atau geser penanda untuk menetapkan lokasi</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch, nextTick } from "vue";
import L from "leaflet";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ lat: -6.2088, lng: 106.8456 }) // Default Campus Jakarta center
  },
  readonly: {
    type: Boolean,
    default: false
  },
  height: {
    type: String,
    default: "350px"
  },
  markers: {
    type: Array,
    default: () => [] // Multiple marker arrays: [{ id, latitude, longitude, title, type }]
  }
});

const emit = defineEmits(["update:modelValue"]);

const mapId = `leaflet-map-${Math.random().toString(36).substr(2, 9)}`;
const loading = ref(true);
let map = null;
let activeMarker = null;
let staticMarkers = [];

// Geocoding search reactive variables
const searchQuery = ref("");
const searchResults = ref([]);
let searchTimeout = null;

const handleSearchInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  searchTimeout = setTimeout(async () => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
          searchQuery.value
        )}`,
        {
          headers: {
            "Accept-Language": "id-ID,id;q=0.9,en;q=0.8",
            "User-Agent": "LostLink-Campus-LostAndFound"
          }
        }
      );
      if (res.ok) {
        searchResults.value = await res.json();
      }
    } catch (e) {
      console.error("Geocoding fetch failed:", e);
    }
  }, 400);
};

const triggerSearch = () => {
  if (searchResults.value.length > 0) {
    selectLocation(searchResults.value[0]);
  }
};

const selectLocation = (location) => {
  const lat = parseFloat(location.lat);
  const lng = parseFloat(location.lon);
  
  if (map) {
    const latlng = [lat, lng];
    if (!props.readonly && activeMarker) {
      activeMarker.setLatLng(latlng);
      emit("update:modelValue", { lat, lng });
    }
    map.setView(latlng, 17);
  }
  
  searchQuery.value = location.display_name.split(',')[0];
  searchResults.value = [];
};

const clearSearch = () => {
  searchQuery.value = "";
  searchResults.value = [];
};

// Curated custom SVG markers for premium aesthetics
const getSvgIcon = (colorHex) => {
  return L.divIcon({
    html: `
      <div class="relative w-8 h-8 flex items-center justify-center">
        <div class="absolute w-6 h-6 rounded-full bg-white/45 animate-ping opacity-75" style="background: ${colorHex}50"></div>
        <div class="absolute w-8 h-8 rounded-full flex items-center justify-center shadow-lg border border-white" style="background: ${colorHex}">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
        </div>
      </div>
    `,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });
};

onMounted(() => {
  nextTick(() => {
    // Map setup
    const initialLat = props.modelValue?.lat || -6.2088;
    const initialLng = props.modelValue?.lng || 106.8456;

    map = L.map(mapId, {
      zoomControl: true,
      attributionControl: false
    }).setView([initialLat, initialLng], 16);

    // Standard OpenStreetMap tiles (but beautiful and muted using CartoDB Positron for premium minimalist look!)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    loading.value = false;

    // Mode A: Readonly & Multiple Markers
    if (props.readonly && props.markers.length > 0) {
      const bounds = [];
      
      props.markers.forEach(m => {
        if (!m.latitude || !m.longitude) return;
        
        // Match marker colors
        const color = m.type === 'missing' ? '#f43f5e' : '#0ea5e9'; // Rose red for missing, Sky blue for found
        const icon = getSvgIcon(color);
        
        const staticMarker = L.marker([m.latitude, m.longitude], { icon })
          .addTo(map)
          .bindPopup(`
            <div class="p-2 min-w-[150px] font-sans">
              <span class="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${
                m.type === 'missing' ? 'bg-rose-50 text-rose-600' : 'bg-sky-50 text-sky-600'
              }">
                ${m.type === 'missing' ? 'Hilang' : 'Ditemukan'}
              </span>
              <h4 class="text-xs font-semibold text-slate-800 leading-snug">${m.namaBarang}</h4>
              <p class="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                ${m.lokasi}
              </p>
              <a href="/item/${m.type}/${m.id}" class="inline-block text-[10px] font-medium text-brand-500 hover:text-brand-600 mt-2 hover:underline">
                Lihat Detail &rarr;
              </a>
            </div>
          `);
        
        staticMarkers.push(staticMarker);
        bounds.push([m.latitude, m.longitude]);
      });

      // Autofit multiple markers
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    } 
    // Mode B: Readonly Single Marker
    else if (props.readonly) {
      const color = '#f43f5e'; // Red
      const icon = getSvgIcon(color);
      activeMarker = L.marker([initialLat, initialLng], { icon }).addTo(map);
      map.setView([initialLat, initialLng], 16);
    } 
    // Mode C: Write Mode (Draggable & Clickable)
    else {
      const color = '#0ea5e9'; // Blue for creation marker
      const icon = getSvgIcon(color);
      
      activeMarker = L.marker([initialLat, initialLng], {
        icon,
        draggable: true
      }).addTo(map);

      // Listen to drag ends
      activeMarker.on("dragend", () => {
        const position = activeMarker.getLatLng();
        emit("update:modelValue", { lat: position.lat, lng: position.lng });
      });

      // Listen to map clicks
      map.on("click", (e) => {
        activeMarker.setLatLng(e.latlng);
        emit("update:modelValue", { lat: e.latlng.lat, lng: e.latlng.lng });
      });
    }

    // Leaflet rendering bug fix
    setTimeout(() => {
      if (map) map.invalidateSize();
    }, 400);
  });
});

// Watch coordinate changes (especially for single marker write mode updates)
watch(
  () => props.modelValue,
  (newCoords) => {
    if (!props.readonly && activeMarker && newCoords) {
      const activeCoords = activeMarker.getLatLng();
      if (activeCoords.lat !== newCoords.lat || activeCoords.lng !== newCoords.lng) {
        activeMarker.setLatLng([newCoords.lat, newCoords.lng]);
        map.panTo([newCoords.lat, newCoords.lng]);
      }
    }
  },
  { deep: true }
);

onUnmounted(() => {
  if (searchTimeout) clearTimeout(searchTimeout);
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<style>
/* Remove default Leaflet popup shadows for a custom sleek style */
.leaflet-popup-content-wrapper {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(12px);
  border-radius: 12px !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgba(241, 245, 249, 1) !important;
  padding: 0px !important;
}

.leaflet-popup-content {
  margin: 8px !important;
}

.leaflet-popup-tip {
  background: white !important;
  box-shadow: none !important;
}
</style>
