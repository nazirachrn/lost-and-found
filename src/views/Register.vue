<template>
  <main class="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
    <!-- Background glow spheres -->
    <div class="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-brand-200/30 blur-3xl glow-brand"></div>
    <div class="absolute -bottom-10 -right-10 w-72 h-72 rounded-full bg-accent-200/25 blur-3xl glow-accent"></div>

    <div class="glass max-w-md w-full p-8 rounded-3xl shadow-xl border border-slate-100/60 relative z-10 flex flex-col gap-6">
      <div class="text-center">
        <h2 class="text-2xl font-black text-slate-800 tracking-tight font-sans">Buat Akun Baru</h2>
        <p class="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">Bergabung dengan sistem LostLink gratis</p>
      </div>

      <!-- Form Error Alert -->
      <div v-if="error" class="bg-rose-50 border border-rose-100 rounded-xl p-3 text-xs text-rose-700 font-medium">
        {{ error }}
      </div>

      <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
        <!-- Nama Lengkap -->
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
          <input 
            type="text" 
            v-model="name" 
            required 
            placeholder="Fandi Ahmad"
            class="text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:border-brand-500 focus:outline-none bg-white/70"
          />
        </div>

        <!-- Alamat Email -->
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Alamat Email</label>
          <input 
            type="email" 
            v-model="email" 
            required 
            placeholder="nama@email.com"
            class="text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:border-brand-500 focus:outline-none bg-white/70"
          />
        </div>

        <!-- Password -->
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Kata Sandi</label>
          <input 
            type="password" 
            v-model="password" 
            required 
            placeholder="Min. 6 karakter"
            class="text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:border-brand-500 focus:outline-none bg-white/70"
          />
        </div>

        <!-- T&C Checkbox -->
        <div class="flex items-start gap-2 py-1">
          <input 
            type="checkbox" 
            id="terms" 
            required 
            class="w-4 h-4 text-brand-500 rounded border-slate-200 focus:ring-brand-400 mt-0.5"
          />
          <label for="terms" class="text-[11px] text-slate-400 leading-snug">
            Saya menyetujui <a href="#" class="text-slate-500 font-bold hover:underline">Syarat Ketentuan</a> dan <a href="#" class="text-slate-500 font-bold hover:underline">Kebijakan Privasi</a> aplikasi.
          </label>
        </div>

        <button 
          type="submit" 
          class="w-full mt-1 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-black shadow-md shadow-brand-100 transition-all flex items-center justify-center gap-2"
          :disabled="loading"
        >
          <span v-if="loading" class="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>Daftar Akun Baru</span>
        </button>
      </form>

      <!-- Divider -->
      <div class="relative flex py-1 items-center">
        <div class="flex-grow border-t border-slate-100"></div>
        <span class="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Atau</span>
        <div class="flex-grow border-t border-slate-100"></div>
      </div>

      <!-- Google Login Button -->
      <button 
        @click="handleGoogleLogin" 
        class="w-full py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 transition-colors flex items-center justify-center gap-2 text-xs font-bold text-slate-600"
        :disabled="loading"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" width="24" height="24">
          <g transform="matrix(1, 0, 0, 1, 0, 0)">
            <path d="M21.35,11.1H12v2.7h5.38C16.88,16.48,14.65,18,12,18c-3.31,0-6-2.69-6-6s2.69-6,6-6c1.47,0,2.81,0.53,3.87,1.4l2.03-2.03C16.21,3.8,14.21,3,12,3C7.03,3,3,7.03,3,12s4.03,9,9,9c4.75,0,8.5-3.41,8.5-9C20.5,11.72,21.41,11.1,21.35,11.1z" fill="#4285F4" />
          </g>
        </svg>
        <span>Daftar via Google</span>
      </button>

      <!-- Footer navigation -->
      <div class="text-center mt-2 text-xs text-slate-500 font-medium">
        Sudah punya akun? 
        <RouterLink to="/login" class="text-brand-500 font-bold hover:underline">
          Masuk di sini
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useNotificationsStore } from "../stores/notifications";

const authStore = useAuthStore();
const notifStore = useNotificationsStore();
const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref(null);

const handleRegister = async () => {
  if (loading.value) return;
  
  if (password.value.length < 6) {
    error.value = "Password minimal terdiri dari 6 karakter!";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    await authStore.register(email.value, password.value, name.value);
    notifStore.showToast(`Registrasi Berhasil! Selamat datang, ${name.value}!`, "success");
    router.push("/dashboard");
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const handleGoogleLogin = async () => {
  if (loading.value) return;
  loading.value = true;
  error.value = null;

  try {
    await authStore.loginWithGoogle();
    notifStore.showToast(`Berhasil mendaftar via Google!`, "success");
    router.push("/dashboard");
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>
