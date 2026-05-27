import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/api'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:  null,
      token: null,

      setAuth: (token, user) => {
        localStorage.setItem('fl_token', token)
        set({ token, user })
      },

      setUser: (user) => set({ user }),

      logout: () => {
        localStorage.removeItem('fl_token')
        set({ user: null, token: null })
      },

      refreshUser: async () => {
        try {
          const user = await api.get('/auth/me')
          set({ user })
          return user
        } catch {
          get().logout()
        }
      },

      isLoggedIn: () => !!get().token && !!get().user,
    }),
    {
      name: 'fl_auth',
      partialize: (s) => ({ token: s.token, user: s.user }),
    }
  )
)
