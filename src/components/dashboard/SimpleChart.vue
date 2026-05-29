<template>
  <div class="card-premium p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider">{{ title }}</h3>
        <p class="text-2xl font-bold text-slate-800 mt-1">{{ totalCount }} <span class="text-xs font-normal text-slate-400">total laporan</span></p>
      </div>
      
      <!-- Chart Filter Tabs -->
      <div class="flex bg-slate-100 p-1 rounded-lg gap-1">
        <button 
          v-for="mode in ['line', 'donuts']" 
          :key="mode"
          @click="chartMode = mode"
          class="text-xs font-medium px-3 py-1.5 rounded-md transition-all"
          :class="chartMode === mode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'"
        >
          {{ mode === 'line' ? 'Tren Mingguan' : 'Kategori' }}
        </button>
      </div>
    </div>

    <!-- Mode A: SVG Area / Line Chart -->
    <div v-if="chartMode === 'line'" class="w-full">
      <div class="relative h-[220px] w-full">
        <!-- SVG Grid & Area -->
        <svg viewBox="0 0 500 200" class="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <!-- Premium Gradient Fill -->
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#0ea5e9" />
              <stop offset="100%" stop-color="#a855f7" />
            </linearGradient>
          </defs>

          <!-- Horizontal Grid Lines -->
          <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4" />
          <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4" />
          <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4" />
          <line x1="0" y1="200" x2="500" y2="200" stroke="#e2e8f0" stroke-width="1" />

          <!-- Area under curve -->
          <path :d="areaPath" fill="url(#areaGradient)" />

          <!-- Spline Line -->
          <path :d="linePath" fill="none" stroke="url(#lineGradient)" stroke-width="3" stroke-linecap="round" />

          <!-- Hover active interactive circles -->
          <g v-for="(p, index) in points" :key="index">
            <circle 
              :cx="p.x" 
              :cy="p.y" 
              r="4" 
              fill="#ffffff" 
              stroke="#0ea5e9" 
              stroke-width="2.5"
              class="transition-all duration-200 cursor-pointer hover:r-6" 
              @mouseenter="hoveredIndex = index"
              @mouseleave="hoveredIndex = null"
            />
          </g>
        </svg>

        <!-- Hover dynamic tooltip bubble -->
        <div 
          v-if="hoveredIndex !== null" 
          class="absolute glass px-3 py-1.5 rounded-lg shadow-md pointer-events-none text-[11px] font-semibold text-slate-800 transition-all duration-150 z-20"
          :style="{
            left: `${(points[hoveredIndex].x / 500) * 100}%`,
            top: `${(points[hoveredIndex].y / 200) * 100 - 18}%`,
            transform: 'translate(-50%, -100%)'
          }"
        >
          {{ data[hoveredIndex].label }}: <span class="text-brand-500 font-bold">{{ data[hoveredIndex].value }}</span>
        </div>
      </div>

      <!-- X-Axis Labels -->
      <div class="flex justify-between items-center px-2 mt-4">
        <span 
          v-for="(item, i) in data" 
          :key="i" 
          class="text-[10px] font-bold tracking-wider text-slate-400 uppercase transition-all duration-200"
          :class="hoveredIndex === i ? 'text-brand-500 font-extrabold' : ''"
        >
          {{ item.label }}
        </span>
      </div>
    </div>

    <!-- Mode B: Circular Donuts gauges -->
    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4 py-3">
      <div 
        v-for="cat in donutData" 
        :key="cat.name" 
        class="flex flex-col items-center p-3 rounded-xl bg-slate-50 border border-slate-100 text-center"
      >
        <div class="relative w-16 h-16 flex items-center justify-center">
          <!-- SVG Circular Gauge -->
          <svg class="absolute w-full h-full transform -rotate-90">
            <!-- Background track -->
            <circle cx="32" cy="32" r="26" fill="transparent" stroke="#e2e8f0" stroke-width="4.5" />
            <!-- Active value path -->
            <circle 
              cx="32" 
              cy="32" 
              r="26" 
              fill="transparent" 
              :stroke="cat.color" 
              stroke-width="4.5"
              stroke-linecap="round"
              :stroke-dasharray="2 * Math.PI * 26"
              :stroke-dashoffset="(1 - cat.percentage / 100) * (2 * Math.PI * 26)"
              class="transition-all duration-1000 ease-out"
            />
          </svg>
          <span class="text-[11px] font-bold text-slate-700">{{ cat.percentage }}%</span>
        </div>
        
        <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wide mt-3">{{ cat.name }}</span>
        <span class="text-xs font-black text-slate-800 mt-0.5">{{ cat.count }} pcs</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "Tren Laporan Masuk"
  },
  data: {
    type: Array,
    default: () => [
      { label: "Sen", value: 4 },
      { label: "Sel", value: 8 },
      { label: "Rab", value: 5 },
      { label: "Kam", value: 12 },
      { label: "Jum", value: 18 },
      { label: "Sab", value: 15 },
      { label: "Min", value: 22 }
    ]
  },
  donutData: {
    type: Array,
    default: () => [
      { name: "HP", count: 8, percentage: 32, color: "#0ea5e9" },
      { name: "Laptop", count: 5, percentage: 20, color: "#a855f7" },
      { name: "Dompet", count: 6, percentage: 24, color: "#f43f5e" },
      { name: "Kunci", count: 4, percentage: 16, color: "#10b981" }
    ]
  }
});

const chartMode = ref("line");
const hoveredIndex = ref(null);

const totalCount = computed(() => {
  return props.data.reduce((sum, item) => sum + item.value, 0);
});

// Normalize SVG points based on data values
const points = computed(() => {
  const maxVal = Math.max(...props.data.map(d => d.value), 1);
  const w = 500;
  const h = 200;
  const padding = 20;
  const graphH = h - padding * 2;
  const graphW = w - padding * 2;
  
  return props.data.map((d, index) => {
    const x = padding + (index / (props.data.length - 1)) * graphW;
    // Invert Y because SVG coordinate 0,0 is in top-left
    const y = h - padding - (d.value / maxVal) * graphH;
    return { x, y };
  });
});

// Construct SVG smooth polyline lines
const linePath = computed(() => {
  if (points.value.length === 0) return "";
  return points.value.reduce((path, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, "");
});

// Construct SVG gradient filled path
const areaPath = computed(() => {
  if (points.value.length === 0) return "";
  const first = points.value[0];
  const last = points.value[points.value.length - 1];
  
  let path = `M ${first.x} 200 L ${first.x} ${first.y}`;
  points.value.forEach((p, i) => {
    if (i > 0) path += ` L ${p.x} ${p.y}`;
  });
  path += ` L ${last.x} 200 Z`;
  return path;
});
</script>
