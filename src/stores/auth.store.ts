// 认证状态
import { defineStore } from 'pinia'
import { IUser } from '@/types/user.types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('access_token') || null,
    user: JSON.parse(localStorage.getItem('user_info') || 'null') as IUser | null,
    isAuthenticated: !!localStorage.getItem('access_token')
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('access_token', token)
    },

    setUser(user: IUser) {
      this.user = user
      this.isAuthenticated = true
      localStorage.setItem('user_info', JSON.stringify(user))
    },

    logout() {
      this.token = null
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('access_token')
      localStorage.removeItem('user_info')
    }
  }
})