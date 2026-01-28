// 用户信息
import { defineStore } from 'pinia'
import  { IUser, IUserQueryParams, IUserListResponse } from '@/types/user.types'
import { userApi } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as IUser | null,
    userList: [] as IUser[],
    totalUsers: 0,
    userLoading: false,
    userError: null as string | null
  }),

  getters: {
    // 按ID获取用户
    getUserById: (state) => (id: string) => {
      return state.userList.find(user => user.id === id)
    },
    
    // 搜索用户
    searchUsers: (state) => (keyword: string) => {
      if (!keyword.trim()) return state.userList
      const search = keyword.toLowerCase()
      return state.userList.filter(user => 
        user.username.toLowerCase().includes(search) ||
        user.realName.toLowerCase().includes(search) ||
        user.studentId?.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      )
    }
  },

  actions: {
    // 设置当前用户
    setCurrentUser(user: IUser) {
      this.currentUser = user
      this.userError = null
    },

    // 清除当前用户
    clearCurrentUser() {
      this.currentUser = null
    },

    // 获取用户列表
    async fetchUsers(params?: IUserQueryParams) {
      this.userLoading = true
      this.userError = null
      
      try {
        const { data, error } = await userApi.getUsers(params)
        if (error) throw error
        this.userList = data.list
        this.totalUsers = data.total
      } catch (error: any) {
        this.userError = error.message || '获取用户列表失败'
        console.error('获取用户列表失败:', error)
      } finally {
        this.userLoading = false
      }
    },

    // 更新用户信息
    async updateUser(id: string, userData: Partial<IUser>) {
      this.userLoading = true
      this.userError = null
      
      try {
        const { data, error } = await userApi.updateUser(id, userData)
        if (error) throw error
        
        // 更新本地数据
        const userIndex = this.userList.findIndex(user => user.id === id)
        if (userIndex !== -1) {
          this.userList[userIndex] = { ...this.userList[userIndex], ...data }
        }
        
        if (this.currentUser?.id === id) {
          this.currentUser = { ...this.currentUser, ...data }
        }
      } catch (error: any) {
        this.userError = error.message || '更新用户信息失败'
        console.error('更新用户信息失败:', error)
        throw error
      } finally {
        this.userLoading = false
      }
    },

    // 删除用户
    async deleteUser(id: string) {
      this.userLoading = true
      this.userError = null
      
      try {
        const { error } = await userApi.deleteUser(id)
        if (error) throw error
        
        // 更新本地数据
        this.userList = this.userList.filter(user => user.id !== id)
        this.totalUsers = this.userList.length
        
        if (this.currentUser?.id === id) {
          this.currentUser = null
        }
      } catch (error: any) {
        this.userError = error.message || '删除用户失败'
        console.error('删除用户失败:', error)
        throw error
      } finally {
        this.userLoading = false
      }
    },

    // 重置用户密码
    async resetUserPassword(id: string) {
      try {
        console.log('重置用户密码:', id)
        // 这里调用API
      } catch (error: any) {
        console.error('重置用户密码失败:', error)
        throw error
      }
    },

    // 调整用户信用分
    async adjustUserCredit(id: string, amount: number, reason: string) {
      try {
        console.log('调整用户信用分:', { id, amount, reason })
        // 这里调用API
      } catch (error: any) {
        console.error('调整用户信用分失败:', error)
        throw error
      }
    }
  }
})