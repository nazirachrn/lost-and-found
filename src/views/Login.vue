<template>
  <main class="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
    <!-- Background glow spheres -->
    <div class="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-brand-200/30 blur-3xl glow-brand"></div>
    <div class="absolute -bottom-10 -right-10 w-72 h-72 rounded-full bg-accent-200/25 blur-3xl glow-accent"></div>

    <div class="glass max-w-md w-full p-8 rounded-3xl shadow-xl border border-slate-100/60 relative z-10 flex flex-col gap-6">
      <div class="text-center">
        <h2 class="text-2xl font-black text-slate-800 tracking-tight font-sans">Masuk ke Akun Anda</h2>
        <p class="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">Selamat datang kembali di LostLink</p>
      </div>

      <!-- Quick Backdoor Banner for Demo Mode -->
      <div 
        v-if="isDemo" 
        class="bg-brand-50 border border-brand-100 rounded-xl p-3.5 text-xs text-brand-950 flex flex-col gap-1"
      >
        <span class="font-extrabold uppercase tracking-wider text-[10px] text-brand-600">Backdoor Sandbox (Demo Mode):</span>
        <div class="flex justify-between items-center mt-1">
          <span>Admin: <strong class="select-all">admin@lostlink.com</strong> (admin123)</span>
          <button 
            @click="fillAdmin" 
            class="px-2 py-1 bg-white border border-brand-200 hover:bg-brand-50 rounded text-[9px] font-bold text-brand-600 transition-all active:scale-95"
          >
            Gunakan
          </button>
        </div>
        <div class="flex justify-between items-center mt-1.5">
          <span>User: <strong class="select-all">fandi@lostlink.com</strong> (fandi123)</span>
          <button 
            @click="fillUser" 
            class="px-2 py-1 bg-white border border-brand-200 hover:bg-brand-50 rounded text-[9px] font-bold text-brand-600 transition-all active:scale-95"
          >
            Gunakan
          </button>
        </div>
      </div>

      <!-- Form Error Alert -->
      <div v-if="error" class="bg-rose-50 border border-rose-100 rounded-xl p-3 text-xs text-rose-700 font-medium">
        {{ error }}
      </div>

      <!-- Reset Password Notification -->
      <div v-if="resetSuccess" class="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs text-emerald-700 font-medium">
        {{ resetSuccess }}
      </div>

      <!-- Mode A: Normal Email Password Login -->
      <form v-if="!forgotMode" @submit.prevent="handleLogin" class="flex flex-col gap-4" autocomplete="off">
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Alamat Email</label>
          <input 
            type="email" 
            v-model="email" 
            required 
            placeholder="nama@email.com"
            autocomplete="one-time-code"
            class="text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:border-brand-500 focus:outline-none bg-white/70"
          />
        </div>

        <div class="flex flex-col gap-1">
          <div class="flex justify-between items-center">
            <label class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Kata Sandi</label>
            <button 
              type="button" 
              @click="forgotMode = true; error = null; resetSuccess = null" 
              class="text-[10px] font-bold text-brand-500 hover:underline"
            >
              Lupa Password?
            </button>
          </div>
          <input 
            type="password" 
            v-model="password" 
            required 
            placeholder="••••••••"
            autocomplete="new-password"
            class="text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:border-brand-500 focus:outline-none bg-white/70"
          />
        </div>

        <button 
          type="submit" 
          class="w-full mt-2 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-black shadow-md shadow-brand-100 transition-all flex items-center justify-center gap-2"
          :disabled="loading"
        >
          <span v-if="loading" class="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>Masuk Sekarang</span>
        </button>
      </form>

      <!-- Mode B: Forgot Password Request Form -->
      <form v-else @submit.prevent="handleReset" class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Alamat Email Pemulihan</label>
          <input 
            type="email" 
            v-model="email" 
            required 
            placeholder="nama@email.com"
            class="text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:border-brand-500 focus:outline-none bg-white/70"
          />
        </div>

        <div class="flex gap-2 mt-2">
          <button 
            type="button" 
            @click="forgotMode = false; error = null; resetSuccess = null" 
            class="w-1/3 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
            :disabled="loading"
          >
            Kembali
          </button>
          <button 
            type="submit" 
            class="w-2/3 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-black shadow-md shadow-brand-100 transition-all flex items-center justify-center gap-2"
            :disabled="loading"
          >
            <span v-if="loading" class="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>Kirim Link Reset</span>
          </button>
        </div>
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
        <span>Masuk dengan Google</span>
      </button>

      <!-- Footer navigation -->
      <div class="text-center mt-2 text-xs text-slate-500 font-medium">
        Belum punya akun? 
        <RouterLink to="/register" class="text-brand-500 font-bold hover:underline">
          Daftar di sini
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useNotificationsStore } from "../stores/notifications";
import { isDemoMode } from "../firebase/config";

const authStore = useAuthStore();
const notifStore = useNotificationsStore();
const router = useRouter();

const isDemo = computed(() => isDemoMode);

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref(null);
const forgotMode = ref(false);
const resetSuccess = ref(null);

const fillAdmin = () => {
  email.value = "admin@lostlink.com";
  password.value = "admin123";
};

const fillUser = () => {
  email.value = "fandi@lostlink.com";
  password.value = "fandi123";
};

const handleLogin = async () => {
  if (loading.value) return;
  loading.value = true;
  error.value = null;
  resetSuccess.value = null;

  try {
    await authStore.login(email.value, password.value);
    notifStore.showToast(`Selamat datang kembali, ${authStore.currentUser.nama}!`, "success");
    router.push("/dashboard");
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const handleReset = async () => {
  if (loading.value) return;
  loading.value = true;
  error.value = null;
  resetSuccess.value = null;

  try {
    const msg = await authStore.forgotPassword(email.value);
    resetSuccess.value = msg;
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
    notifStore.showToast(`Berhasil masuk via Google!`, "success");
    router.push("/dashboard");
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>
