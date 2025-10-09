// FILE: frontend/src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '@/lib/api';

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
          const { user, token } = response.data.data;
          
          // Lưu vào store (tự động persist vào localStorage)
          set({ 
            user, 
            token,
            isAuthenticated: true,
            isLoading: false 
          });
          
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Đăng nhập thất bại';
          set({ 
            error: message, 
            isLoading: false,
            isAuthenticated: false 
          });
          return { success: false, message };
        }
      },

      // Register
      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await authAPI.register(data);
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Đăng ký thất bại';
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      // Logout
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ 
            user: null, 
            token: null,
            isAuthenticated: false,
            error: null 
          });
        }
      },

      // Get current user (để refresh thông tin user)
      getCurrentUser: async () => {
        const token = get().token;
        
        if (!token) {
          return { success: false };
        }

        try {
          const response = await authAPI.getCurrentUser();
          set({ 
            user: response.data.data.user,
            isAuthenticated: true
          });
          return { success: true };
        } catch (error) {
          // Token không hợp lệ, clear store
          set({ 
            user: null, 
            token: null,
            isAuthenticated: false 
          });
          return { success: false };
        }
      },

      // Change password
      changePassword: async (data) => {
        set({ isLoading: true, error: null });
        try {
          await authAPI.changePassword(data);
          set({ isLoading: false });
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || 'Đổi mật khẩu thất bại';
          set({ error: message, isLoading: false });
          return { success: false, message };
        }
      },

      // Clear error
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage', // Key trong localStorage
      // Chỉ persist những field cần thiết
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);