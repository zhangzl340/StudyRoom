// 统计相关API
import { http } from '@/utils/request'
import { handleApiResponse } from './config'
import type { ISystemStats } from '@/types/api.types'

/**
 * 统计相关API
 */
export const statisticsApi = {
  /**
   * 获取系统统计信息
   */
  async getSystemStats() {
    return handleApiResponse<ISystemStats>(
      http.get('/statistics/system')
    )
  },
  
  /**
   * 获取自习室使用统计
   */
  async getRoomUsageStats(
    roomId?: string,
    startDate?: string,
    endDate?: string,
    interval: 'day' | 'week' | 'month' = 'day'
  ) {
    return handleApiResponse<Array<{
      date: string
      usageHours: number
      reservationCount: number
      avgOccupancyRate: number
    }>>(
      http.get('/statistics/room-usage', {
        params: { roomId, startDate, endDate, interval }
      })
    )
  },
  
  /**
   * 获取座位热度统计
   */
  async getSeatHeatmap(roomId: string, date?: string) {
    return handleApiResponse<Array<{
      seatId: string
      seatNumber: string
      usageHours: number
      reservationCount: number
      popularityScore: number
    }>>(
      http.get('/statistics/seat-heatmap', {
        params: { roomId, date: date || new Date().toISOString().split('T')[0] }
      })
    )
  },
  
  /**
   * 获取用户活跃度统计
   */
  async getUserActivityStats(
    startDate?: string,
    endDate?: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ) {
    return handleApiResponse<Array<{
      date: string
      activeUsers: number
      newUsers: number
      avgUsageHours: number
    }>>(
      http.get('/statistics/user-activity', {
        params: { startDate, endDate, groupBy }
      })
    )
  },
  
  /**
   * 获取时间段使用统计
   */
  async getTimeSlotStats(roomId?: string, date?: string) {
    return handleApiResponse<Array<{
      timeSlot: string
      occupancyRate: number
      reservationCount: number
    }>>(
      http.get('/statistics/time-slot', {
        params: { roomId, date: date || new Date().toISOString().split('T')[0] }
      })
    )
  },
  
  /**
   * 获取学院分布统计
   */
  async getCollegeDistribution(date?: string) {
    return handleApiResponse<Array<{
      college: string
      userCount: number
      reservationCount: number
      totalUsageHours: number
    }>>(
      http.get('/statistics/college-distribution', {
        params: { date: date || new Date().toISOString().split('T')[0] }
      })
    )
  },
  
  /**
   * 获取违规统计
   */
  async getViolationStats(startDate?: string, endDate?: string) {
    return handleApiResponse<{
      totalViolations: number
      byType: Record<string, number>
      byUser: Array<{
        userId: string
        username: string
        violationCount: number
      }>
    }>(
      http.get('/statistics/violations', {
        params: { startDate, endDate }
      })
    )
  },
  
  /**
   * 导出统计数据
   */
  async exportStats(
    type: 'room-usage' | 'user-activity' | 'violations' | 'time-slot',
    startDate?: string,
    endDate?: string
  ) {
    return handleApiResponse<{ downloadUrl: string }>(
      http.get(`/statistics/export/${type}`, {
        params: { startDate, endDate },
        responseType: 'blob'
      })
    )
  }
}