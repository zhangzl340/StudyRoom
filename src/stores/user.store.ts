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
        // 这里先使用模拟数据，等后端API完成后替换
        console.log('获取用户列表，参数:', params)
        
        // 模拟数据
        const mockUsers: IUser[] = [
          {
            id: '1',
            username: 'zhangsan',
            realName: '张三',
            email: 'zhangsan@university.edu.cn',
            phone: '13800138001',
            studentId: '20240001',
            avatar: '',
            college: '计算机学院',
            major: '软件工程',
            grade: '2024级',
            className: '软件2401',
            role: 'student',
            status: 'active',
            creditScore: 95,
            reservationCount: 10,
            totalUsageHours: 45,
            lastLoginTime: '2024-01-15T08:30:00Z',
            createdAt: '2024-09-01T00:00:00Z',
            updatedAt: '2024-01-15T08:30:00Z'
          },
          {
            id: '2',
            username: 'lisi',
            realName: '李四',
            email: 'lisi@university.edu.cn',
            phone: '13800138002',
            studentId: '20240002',
            avatar: '',
            college: '信息工程学院',
            major: '计算机科学与技术',
            grade: '2024级',
            className: '计科2401',
            role: 'student',
            status: 'active',
            creditScore: 88,
            reservationCount: 8,
            totalUsageHours: 32,
            lastLoginTime: '2024-01-14T14:20:00Z',
            createdAt: '2024-09-01T00:00:00Z',
            updatedAt: '2024-01-14T14:20:00Z'
          },
          {
            id: '3',
            username: 'admin1',
            realName: '王管理员',
            email: 'admin1@university.edu.cn',
            phone: '13800138003',
            studentId: 'STAFF001',
            avatar: '',
            college: '教务处',
            major: '',
            grade: '',
            className: '',
            role: 'academic_admin',
            status: 'active',
            creditScore: 100,
            reservationCount: 0,
            totalUsageHours: 0,
            lastLoginTime: '2024-01-15T09:00:00Z',
            createdAt: '2024-09-01T00:00:00Z',
            updatedAt: '2024-01-15T09:00:00Z'
          }
        ]
        
        // 模拟过滤
        let filteredUsers = [...mockUsers]
        if (params?.college) {
          filteredUsers = filteredUsers.filter(user => user.college?.includes(params.college))
        }
        if (params?.role) {
          filteredUsers = filteredUsers.filter(user => user.role === params.role)
        }
        if (params?.status) {
          filteredUsers = filteredUsers.filter(user => user.status === params.status)
        }
        
        this.userList = filteredUsers
        this.totalUsers = filteredUsers.length
        
        // 实际使用时取消注释以下代码
        /*
        const { data, error } = await userApi.getUsers(params)
        if (error) throw error
        this.userList = data.list
        this.totalUsers = data.total
        */
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
        console.log('更新用户信息:', { id, userData })
        
        // 更新本地数据
        const userIndex = this.userList.findIndex(user => user.id === id)
        if (userIndex !== -1) {
          this.userList[userIndex] = { ...this.userList[userIndex], ...userData }
        }
        
        if (this.currentUser?.id === id) {
          this.currentUser = { ...this.currentUser, ...userData }
        }
        
        // 实际使用时取消注释以下代码
        /*
        const { data, error } = await userApi.updateUser(id, userData)
        if (error) throw error
        */
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
        console.log('删除用户:', id)
        
        // 更新本地数据
        this.userList = this.userList.filter(user => user.id !== id)
        this.totalUsers = this.userList.length
        
        if (this.currentUser?.id === id) {
          this.currentUser = null
        }
        
        // 实际使用时取消注释以下代码
        /*
        const { error } = await userApi.deleteUser(id)
        if (error) throw error
        */
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