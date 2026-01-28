import { defineStore } from 'pinia'
import type { IUser, ILoginRequest, ILoginResponse, IUpdateUserRequest, IChangePasswordRequest } from '@/types/user.types'
import { UserRole,UserStatus } from '@/types/user.types'
import { authApi  } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('access_token') || null,
    user: JSON.parse(localStorage.getItem('user_info') || 'null') as IUser | null,
    isAuthenticated: !!localStorage.getItem('access_token'),
    loading: false,
    error: null as string | null
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
    getError: (state) => state.error
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
    },

    // 登录方法
    async login(data: ILoginRequest) {
      this.loading = true
      this.error = null
      console.log('登录参数', data)
      try {
        const { data: response, error } = await authApi.login(data)
        
        if (error) throw error
        
        const { token, user } = response
        this.setUser(user)
        this.setToken(token)
        
        return user
      } catch (error: any) {
        this.error = error.message || '登录失败'
        console.error('登录失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 获取当前用户信息
    async getCurrentUser() {
      this.loading = true
      this.error = null
      try {
        if (!this.token) {
          throw new Error('未登录')
        }
        
        // 如果已经有用户信息，直接返回
        if (this.user) {
          return this.user
        }
        
        const { data, error } = await authApi.getCurrentUser()
        if (error) throw error
        this.setUser(data)
        return data
      } catch (error: any) {
        this.error = error.message || '获取用户信息失败'
        console.error('获取用户信息失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 更新用户信息
    async updateUserInfo(data: IUpdateUserRequest) {
      this.loading = true
      this.error = null
      
      try {
        if (!this.user) {
          throw new Error('用户未登录')
        }
        
        const { data: user, error } = await authApi.updateUserInfo(data)
        if (error) throw error
        this.setUser(user)
        
        return user
      } catch (error: any) {
        this.error = error.message || '更新用户信息失败'
        console.error('更新用户信息失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 修改密码
    async changePassword(data: IChangePasswordRequest) {
      this.loading = true
      this.error = null
      
      try {
        const { error } = await authApi.changePassword(data)
        if (error) throw error
        
        return true
      } catch (error: any) {
        this.error = error.message || '修改密码失败'
        console.error('修改密码失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})