
// src/store/authStore.js
import { create } from 'zustand'
import api from '@/lib/api'

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (phoneNumber, password) => {
    const { data } = await api.post('/auth/login', { phoneNumber, password })
    localStorage.setItem('token', data.data.token)
    localStorage.setItem('user', JSON.stringify(data.data.user))
    set({ user: data.data.user, token: data.data.token, isAuthenticated: true })
    return data
  },

  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData)
    localStorage.setItem('token', data.data.token)
    localStorage.setItem('user', JSON.stringify(data.data.user))
    set({ user: data.data.user, token: data.data.token, isAuthenticated: true })
    return data
  },

  logout: async () => {
    await api.post('/auth/logout')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null, isAuthenticated: false })
  },

  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  }
}))