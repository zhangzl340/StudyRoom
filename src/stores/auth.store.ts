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
      
      try {
        // 模拟登录，实际使用时调用authApi.login
        console.log('用户登录:', data)
        
        // 模拟用户数据
        const mockUser: IUser = {
          id: '1',
          username: data.username,
          realName: '测试用户',
          email: `${data.username}@university.edu.cn`,
          phone: '13800138000',
          studentId: '20240001',
          avatar: '',
          college: '计算机学院',
          major: '软件工程',
          grade: '2024级',
          className: '软件2401',
          role: UserRole.STUDENT,
          status: UserStatus.ACTIVE,
          creditScore: 100,
          reservationCount: 5,
          totalUsageHours: 25,
          lastLoginTime: new Date().toISOString(),
          createdAt: '2024-09-01T00:00:00Z',
          updatedAt: new Date().toISOString()
        }
        
        this.setUser(mockUser)
        this.setToken('mock-jwt-token-' + Date.now())
        
        // 实际使用时取消注释以下代码
        /*
        const { data: response, error } = await authApi.login(data)
        if (error) throw error
        this.setUser(response.user)
        this.setToken(response.token)
        */
        
        return mockUser
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
        
        // 模拟获取用户信息
        console.log('获取当前用户信息')
        const mockUser: IUser = {
          id: '1',
          username: 'testuser',
          realName: '测试用户',
          email: 'test@university.edu.cn',
          phone: '13800138000',
          studentId: '20240001',
          avatar: '',
          college: '计算机学院',
          major: '软件工程',
          grade: '2024级',
          className: '软件2401',
          role: UserRole.STUDENT,
          status: UserStatus.ACTIVE,
          creditScore: 100,
          reservationCount: 5,
          totalUsageHours: 25,
          lastLoginTime: new Date().toISOString(),
          createdAt: '2024-09-01T00:00:00Z',
          updatedAt: new Date().toISOString()
        }
        
        this.setUser(mockUser)
        return mockUser
        
        // 实际使用时取消注释以下代码
        /*
        const { data, error } = await authApi.getCurrentUser()
        if (error) throw error
        this.setUser(data)
        return data
        */
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
        console.log('更新用户信息:', data)
        
        if (!this.user) {
          throw new Error('用户未登录')
        }
        
        // 更新本地数据
        const updatedUser = { ...this.user, ...data }
        this.setUser(updatedUser)
        
        // 实际使用时取消注释以下代码
        /*
        const { data: user, error } = await authApi.updateUserInfo(data)
        if (error) throw error
        this.setUser(user)
        */
        
        return updatedUser
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
        console.log('修改密码:', data)
        
        // 实际使用时取消注释以下代码
        /*
        const { error } = await authApi.changePassword(data)
        if (error) throw error
        */
        
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