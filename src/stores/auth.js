import { defineStore } from "pinia";
import { ref } from "vue";
import { authService } from "../firebase/authService";

export const useAuthStore = defineStore("auth", () => {
  const currentUser = ref(null);
  const loading = ref(true);
  const error = ref(null);

  // Sync auth state listener
  const initializeAuth = () => {
    loading.value = true;
    return authService.onAuthStateChanged((user) => {
      currentUser.value = user;
      loading.value = false;
    });
  };

  const login = async (email, password) => {
    loading.value = true;
    error.value = null;
    try {
      const user = await authService.login(email, password);
      currentUser.value = user;
      return user;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const register = async (email, password, name) => {
    loading.value = true;
    error.value = null;
    try {
      const user = await authService.register(email, password, name);
      currentUser.value = user;
      return user;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const loginWithGoogle = async () => {
    loading.value = true;
    error.value = null;
    try {
      const user = await authService.loginWithGoogle();
      currentUser.value = user;
      return user;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const forgotPassword = async (email) => {
    loading.value = true;
    error.value = null;
    try {
      return await authService.forgotPassword(email);
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      await authService.logout();
      currentUser.value = null;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    currentUser,
    loading,
    error,
    initializeAuth,
    login,
    register,
    loginWithGoogle,
    forgotPassword,
    logout
  };
});
