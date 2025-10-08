// FILE: src/store/authStore.js
// ============================================
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "@/lib/api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          const { user, token } = response.data;
          
          localStorage.setItem("token", token);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || "Đăng nhập thất bại";
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      // Register
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(userData);
          const { user, token } = response.data;
          
          localStorage.setItem("token", token);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || "Đăng ký thất bại";
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      // Logout
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          localStorage.removeItem("token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      // Get current user
      getCurrentUser: async () => {
        set({ isLoading: true });
        try {
          const response = await authAPI.getCurrentUser();
          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // Change password
      changePassword: async (passwords) => {
        set({ isLoading: true, error: null });
        try {
          await authAPI.changePassword(passwords);
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || "Đổi mật khẩu thất bại";
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
