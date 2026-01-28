import { http } from '@/utils/request'
import { handleApiResponse, buildPaginationParams, API_CONFIG } from './config'
import type { IUser, IUserListResponse, IUserQueryParams } from '@/types/user.types'
import type { IApiResponse } from '@/types/api.types'

/**
 * 用户相关API
 */
export const userApi = {
  /**
   * 获取用户列表
   */
  async getUsers(params?: IUserQueryParams) {
    return handleApiResponse<IApiResponse<IUserListResponse>>(
      http.get(`admin/user/list`, { params })
    )
  },
  
  /**
   * 获取用户详情
   */
  async getUser(id: string) {
    return handleApiResponse<IApiResponse<IUser>>(
      http.get(`admin/user/detail/${id}`)
    )
  },
  
  /**
   * 创建用户
   */
  async createUser(data: any) {
    return handleApiResponse<IApiResponse<IUser>>(
      http.post(`admin/user/create`, data)
    )
  },
  
  /**
   * 更新用户信息
   */
  async updateUser(id: string, data: Partial<IUser>) {
    return handleApiResponse<IApiResponse<IUser>>(
      http.put(`admin/user/update/${id}`, data)
    )
  },
  
  /**
   * 删除用户
   */
  async deleteUser(id: string) {
    return handleApiResponse<IApiResponse<void>>(
      http.delete(`admin/user/delete/${id}`)
    )
  },
  
  /**
   * 启用/禁用用户
   */
  async updateUserStatus(id: string, status: string) {
    return handleApiResponse<IApiResponse<IUser>>(
      http.put(`admin/user/status/${id}`, null, {
        params: { status }
      })
    )
  },
  
  /**
   * 重置用户密码
   */
  async resetUserPassword(id: string) {
    return handleApiResponse<IApiResponse<string>>(
      http.post(`admin/user/reset-password/${id}`)
    )
  },
  
  /**
   * 调整用户信用分
   */
  async adjustUserCredit(id: string, amount: number, reason: string) {
    return handleApiResponse<IApiResponse<IUser>>(
      http.post(`admin/user/adjust-credit/${id}`, null, {
        params: { amount, reason }
      })
    )
  },
  
  /**
   * 搜索用户
   */
  async searchUsers(keyword: string) {
    return handleApiResponse<IApiResponse<IUser[]>>(
      http.get(`admin/user/list`, { params: { keyword } })
    )
  }
}

export default userApi