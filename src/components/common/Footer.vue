<template>
  <footer class="bg-white border-t border-slate-100 py-10 mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center shadow-md">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <span class="text-md font-extrabold text-slate-800 tracking-tight">LostLink<span class="text-brand-500">.</span></span>
      </div>
      
      <p class="text-xs text-slate-400 font-medium">&copy; {{ new Date().getFullYear() }} LostLink. Menghubungkan penemu dan pemilik barang dengan aman.</p>
      
      <div class="flex gap-4 text-xs font-semibold text-slate-500">
        <a href="#" class="hover:text-slate-800 transition-colors">Syarat Ketentuan</a>
        <a href="#" class="hover:text-slate-800 transition-colors">Kebijakan Privasi</a>
        <a href="#" class="hover:text-slate-800 transition-colors font-bold text-brand-500">Hubungi Kami</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Sleek Startup Footer
</script>
