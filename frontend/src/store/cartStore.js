// src/store/cartStore.js
import { create } from 'zustand'
import api from '@/lib/api'

export const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,

  fetchCart: async () => {
    set({ loading: true })
    try {
      const { data } = await api.get('/cart')
      set({ cart: data.data.cart, loading: false })
    } catch (error) {
      set({ loading: false })
      throw error
    }
  },

  addToCart: async (productId, quantity) => {
    try {
      const { data } = await api.post('/cart/add', { productId, quantity })
      set({ cart: data.data.cart })
      return data
    } catch (error) {
      throw error
    }
  },

  updateCartItem: async (productId, quantity) => {
    try {
      const { data } = await api.put('/cart/update', { productId, quantity })
      set({ cart: data.data.cart })
      return data
    } catch (error) {
      throw error
    }
  },

  removeFromCart: async (productId) => {
    try {
      const { data } = await api.delete(`/cart/remove/${productId}`)
      set({ cart: data.data.cart })
      return data
    } catch (error) {
      throw error
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart/clear')
      set({ cart: { items: [] } })
    } catch (error) {
      throw error
    }
  },

  getCartTotal: () => {
    const { cart } = get()
    if (!cart || !cart.items) return 0
    return cart.items.reduce((total, item) => {
      return total + (item.quantity * item.price)
    }, 0)
  },

  getCartCount: () => {
    const { cart } = get()
    if (!cart || !cart.items) return 0
    return cart.items.reduce((count, item) => count + item.quantity, 0)
  }
}))