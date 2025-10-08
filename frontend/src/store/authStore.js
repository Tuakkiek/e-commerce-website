// FILE: src/store/authStore.js
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
      rehydrating: true, // trạng thái đang load từ localStorage
      error: null,

      // Register
      register: async (registerData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authAPI.register(registerData);
          // tùy backend có trả token không, nếu chỉ trả user thì xử lý khác
          if (data.token) {
            localStorage.setItem("token", data.token);
            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
          return { success: true };
        } catch (err) {
          set({
            error: err.response?.data?.message || "Đăng ký thất bại",
            isLoading: false,
          });
          return { success: false };
        }
      },

      // Login
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authAPI.login(credentials);
          localStorage.setItem("token", data.token);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (err) {
          set({
            error: err.response?.data?.message || "Đăng nhập thất bại",
            isLoading: false,
          });
          return { success: false };
        }
      },

      // Logout
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (err) {
          console.error("Logout error:", err);
        } finally {
          localStorage.removeItem("token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      // Lấy thông tin user hiện tại
      getCurrentUser: async () => {
        set({ isLoading: true });
        try {
          const { data } = await authAPI.getCurrentUser();
          set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch {
          localStorage.removeItem("token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // Clear lỗi
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.rehydrating = false; // đánh dấu đã load xong
      },
    }
  )
);
