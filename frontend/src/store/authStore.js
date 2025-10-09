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
      rehydrating: true,
      error: null,

      register: async (registerData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authAPI.register(registerData);
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

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authAPI.login(credentials);
          console.log("Login response:", data);
          if (!data.token) {
            throw new Error("API không trả về token");
          }
          localStorage.setItem("token", data.token);
          console.log("Stored token:", localStorage.getItem("token"));
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        } catch (err) {
          console.error("Login error:", err);
          set({
            error: err.response?.data?.message || err.message || "Đăng nhập thất bại",
            isLoading: false,
          });
          return { success: false };
        }
      },

      logout: async () => {
        console.log("Logout called from:", new Error().stack); // Debug nơi gọi logout
        try {
          await authAPI.logout();
        } catch (err) {
          console.error("Logout error:", err);
        } finally {
          console.log("Removing token from localStorage");
          localStorage.removeItem("token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },

      getCurrentUser: async () => {
        const token = localStorage.getItem("token");
        console.log("Token before getCurrentUser:", token);
        if (!token) {
          console.warn("No token found for getCurrentUser, skipping request");
          set({ isLoading: false, isAuthenticated: false });
          return;
        }
        set({ isLoading: true });
        try {
          const { data } = await authAPI.getCurrentUser();
          console.log("getCurrentUser response:", data);
          set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          console.error("getCurrentUser error:", err);
          if (err.response?.status === 401) {
            console.warn("401 Unauthorized in getCurrentUser, clearing auth state");
            localStorage.removeItem("token");
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
        }
      },

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
        if (state) state.rehydrating = false;
      },
    }
  )
);