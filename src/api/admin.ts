// 管理相关API
import { http } from '@/utils/request'
import { handleApiResponse, buildPaginationParams ,API_CONFIG} from './config'
import type {
  IUser,
  IUserListResponse,
  IUserQueryParams,
  IUpdateUserRequest
} from '@/types/user.types'
import type { IApiResponse } from '@/types/api.types'

/**
 * 管理相关API
 */
export const adminApi = {
  // 用户管理
  
  /**
   * 获取用户列表
   */
  async getUsers(params?: IUserQueryParams) {
    const queryParams = buildPaginationParams(params)
    return handleApiResponse<IApiResponse<IUserListResponse>>(
      http.get(`admin/users${queryParams}`)
    )
  },
  
  /**
   * 获取用户详情
   */
  async getUser(id: string) {
    return handleApiResponse<IApiResponse<IUser>>(
      http.get(`admin/users/${id}`)
    )
  },
  
  /**
   * 创建用户
   */
  async createUser(data: Partial<IUser>) {
    return handleApiResponse<IApiResponse<IUser>>(
      http.post(`admin/users`, data)
    )
  },
  
  /**
   * 更新用户
   */
  async updateUser(id: string, data: IUpdateUserRequest) {
    return handleApiResponse<IApiResponse<IUser>>(
      http.put(`admin/users/${id}`, data)
    )
  },
  
  /**
   * 删除用户
   */
  async deleteUser(id: string) {
    return handleApiResponse<IApiResponse<void>>(
      http.delete(`admin/users/${id}`)
    )
  },
  
  /**
   * 启用/禁用用户
   */
  async toggleUserStatus(id: string, status: 'active' | 'inactive') {
    return handleApiResponse<IApiResponse<IUser>>(
      http.patch(`admin/users/${id}/status`, { status })
    )
  },
  
  /**
   * 重置用户密码
   */
  async resetUserPassword(id: string) {
    return handleApiResponse<IApiResponse<{ newPassword: string }>>(
      http.post(`admin/users/${id}/reset-password`)
    )
  },
  
  /**
   * 调整用户信用分
   */
  async adjustUserCredit(id: string, amount: number, reason: string) {
    return handleApiResponse<IApiResponse<IUser>>(
      http.post(`admin/users/${id}/adjust-credit`, { amount, reason })
    )
  },
  
  // 公告管理
  
  /**
   * 获取公告列表
   */
  async getAnnouncements(params?: { page?: number; pageSize?: number }) {
    const queryParams = buildPaginationParams(params)
    return handleApiResponse<IApiResponse<{
      list: Array<{
        id: string
        title: string
        content: string
        type: 'info' | 'warning' | 'important'
        publishTime: string
        publisher: string
        isActive: boolean
      }>
      total: number
    }>>(
      http.get(`admin/announcements${queryParams}`)
    )
  },
  
  /**
   * 创建公告
   */
  async createAnnouncement(data: {
    title: string
    content: string
    type: 'info' | 'warning' | 'important'
  }) {
    return handleApiResponse<IApiResponse<any>>(
      http.post(`admin/announcements`, data)
    )
  },
  
  /**
   * 更新公告
   */
  async updateAnnouncement(id: string, data: Partial<{
    title: string
    content: string
    type: 'info' | 'warning' | 'important'
    isActive: boolean
  }>) {
    return handleApiResponse<IApiResponse<any>>(
      http.put(`admin/announcements/${id}`, data)
    )
  },
  
  /**
   * 删除公告
   */
  async deleteAnnouncement(id: string) {
    return handleApiResponse<IApiResponse<void>>(
      http.delete(`admin/announcements/${id}`)
    )
  },
  
  // 系统设置
  
  /**
   * 获取系统设置
   */
  async getSystemSettings() {
    return handleApiResponse<IApiResponse<Record<string, any>>>(
      http.get(`admin/settings`)
    )
  },
  
  /**
   * 更新系统设置
   */
  async updateSystemSettings(data: Record<string, any>) {
    return handleApiResponse<IApiResponse<Record<string, any>>>(
      http.put(`admin/settings`, data)
    )
  },
  
  /**
   * 获取预约规则设置
   */
  async getReservationRules() {
    return handleApiResponse<IApiResponse<{
      maxReservationPerDay: number
      maxFutureDays: number
      minReservationMinutes: number
      maxReservationMinutes: number
      checkInEarlyMinutes: number
      checkInLateMinutes: number
      autoCancelMinutes: number
      tempLeaveMaxMinutes: number
    }>>(
      http.get(`admin/settings/reservation-rules`)
    )
  },
  
  /**
   * 更新预约规则设置
   */
  async updateReservationRules(data: Partial<{
    maxReservationPerDay: number
    maxFutureDays: number
    minReservationMinutes: number
    maxReservationMinutes: number
    checkInEarlyMinutes: number
    checkInLateMinutes: number
    autoCancelMinutes: number
    tempLeaveMaxMinutes: number
  }>) {
    return handleApiResponse<IApiResponse<any>>(
      http.put(`admin/settings/reservation-rules`, data)
    )
  },
  
  // 数据清理
  
  /**
   * 清理过期数据
   */
  async cleanupExpiredData() {
    return handleApiResponse<IApiResponse<{
      deletedReservations: number
      deletedLogs: number
      freedSpace: string
    }>>(
      http.post(`admin/cleanup`)
    )
  },
  
  /**
   * 备份系统数据
   */
  async backupData() {
    return handleApiResponse<IApiResponse<{ backupId: string; downloadUrl: string }>>(
      http.post(`admin/backup`)
    )
  },
  
  /**
   * 查看系统日志
   */
  async getSystemLogs(params?: {
    page?: number
    pageSize?: number
    level?: 'info' | 'warn' | 'error'
    startDate?: string
    endDate?: string
    keyword?: string
  }) {
    const queryParams = buildPaginationParams(params)
    return handleApiResponse<IApiResponse<{
      list: Array<{
        id: string
        level: string
        message: string
        timestamp: string
        userId?: string
        ip?: string
        userAgent?: string
      }>
      total: number
    }>>(
      http.get(`admin/logs${queryParams}`)
    )
  }
}