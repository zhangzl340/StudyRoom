import { http } from '@/utils/request'
import { handleApiResponse, buildPaginationParams } from './config'
import type { IUser, IUserListResponse, IUserQueryParams } from '@/types/user.types'

/**
 * 用户相关API
 */
export const userApi = {
  /**
   * 获取用户列表
   */
  async getUsers(params?: IUserQueryParams) {
    const queryParams = buildPaginationParams(params)
    return handleApiResponse<IUserListResponse>(
      http.get(`/users${queryParams}`)
    )
  },
  
  /**
   * 获取用户详情
   */
  async getUser(id: string) {
    return handleApiResponse<IUser>(
      http.get(`/users/${id}`)
    )
  },
  
  /**
   * 更新用户信息
   */
  async updateUser(id: string, data: Partial<IUser>) {
    return handleApiResponse<IUser>(
      http.put(`/users/${id}`, data)
    )
  },
  
  /**
   * 删除用户
   */
  async deleteUser(id: string) {
    return handleApiResponse<void>(
      http.delete(`/users/${id}`)
    )
  },
  
  /**
   * 搜索用户
   */
  async searchUsers(keyword: string) {
    return handleApiResponse<IUser[]>(
      http.get('/users/search', { params: { keyword } })
    )
  }
}

export default userApi