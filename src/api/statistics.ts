// 统计相关API
import { http } from '@/utils/request'
import { handleApiResponse, API_CONFIG } from './config'
import type { ISystemStats, IApiResponse } from '@/types/api.types'

// 统计查询参数接口
interface IStatisticsQueryRequest {
  roomId?: string;
  startDate?: string;
  endDate?: string;
  interval?: 'day' | 'week' | 'month';
  groupBy?: 'day' | 'week' | 'month';
  date?: string;
}

// 导出请求接口
interface IExportRequest {
  exportType: string;
  queryRequest?: IStatisticsQueryRequest;
}

/**
 * 统计相关API
 */
export const statisticsApi = {
  /**
   * 获取系统统计信息
   */
  async getSystemStats() {
    return handleApiResponse<IApiResponse<ISystemStats>>(
      http.get(`admin/statistics/system`)
    )
  },
  
  /**
   * 获取自习室使用统计
   */
  async getRoomUsageStats(params?: IStatisticsQueryRequest) {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/room/usage`, { params })
    )
  },
  
  /**
   * 获取房间使用率排名
   */
  async getRoomUsageRank(params?: IStatisticsQueryRequest) {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/room/rank`, { params })
    )
  },
  
  /**
   * 获取房间每日使用趋势
   */
  async getRoomDailyTrend(startDate: string, endDate: string) {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/room/trend`, {
        params: { startDate, endDate }
      })
    )
  },
  
  /**
   * 获取房间类型分布
   */
  async getRoomTypeDistribution() {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/room/distribution`)
    )
  },
  
  /**
   * 获取房间座位使用情况
   */
  async getSeatUsageStats(params?: IStatisticsQueryRequest) {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/room/seat`, { params })
    )
  },
  
  /**
   * 获取房间高峰期分析
   */
  async getRoomPeakHours(params?: IStatisticsQueryRequest) {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/room/peak`, { params })
    )
  },
  
  /**
   * 获取房间预约取消率
   */
  async getRoomCancellationRate(params?: IStatisticsQueryRequest) {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/room/cancellation`, { params })
    )
  },
  
  /**
   * 获取房间平均使用时长
   */
  async getRoomAverageUsageTime(params?: IStatisticsQueryRequest) {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/room/average-time`, { params })
    )
  },
  
  /**
   * 获取座位热度统计
   */
  async getReservationHeatmap(startDate: string, endDate: string) {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/heatmap`, {
        params: { startDate, endDate }
      })
    )
  },
  
  /**
   * 获取用户活跃度统计
   */
  async getUserUsageStats(params?: IStatisticsQueryRequest) {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/user/usage`, { params })
    )
  },
  
  /**
   * 获取用户活跃度排名
   */
  async getUserActivityRank(params?: IStatisticsQueryRequest) {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/user/rank`, { params })
    )
  },
  
  /**
   * 获取用户增长趋势
   */
  async getUserGrowthTrend(startDate: string, endDate: string) {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/user/growth`, {
        params: { startDate, endDate }
      })
    )
  },
  
  /**
   * 获取用户类型分布
   */
  async getUserTypeDistribution() {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/user/distribution`)
    )
  },
  
  /**
   * 获取用户信用分分布
   */
  async getCreditScoreDistribution() {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/user/credit`)
    )
  },
  
  /**
   * 获取用户预约行为分析
   */
  async getUserReservationBehavior(params?: IStatisticsQueryRequest) {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/user/behavior`, { params })
    )
  },
  
  /**
   * 获取用户违规情况统计
   */
  async getUserViolationStats(params?: IStatisticsQueryRequest) {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/user/violation`, { params })
    )
  },
  
  /**
   * 获取用户平均使用时长
   */
  async getUserAverageUsageTime(params?: IStatisticsQueryRequest) {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/user/average-time`, { params })
    )
  },
  
  /**
   * 获取用户留存率分析
   */
  async getUserRetentionRate(startDate: string, endDate: string) {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/user/retention`, {
        params: { startDate, endDate }
      })
    )
  },
  
  /**
   * 获取用户画像分析
   */
  async getUserProfileAnalysis() {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/user/profile`)
    )
  },
  
  /**
   * 获取时间段使用统计
   */
  async getTimeSlotStats(params?: IStatisticsQueryRequest) {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/time-slot`, { params })
    )
  },
  
  /**
   * 获取每日统计快照
   */
  async getDailySnapshots(startDate: string, endDate: string) {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`admin/statistics/snapshots`, {
        params: { startDate, endDate }
      })
    )
  },
  
  /**
   * 生成统计快照
   */
  async generateStatisticsSnapshot() {
    return handleApiResponse<IApiResponse<void>>(
      http.post(`admin/statistics/snapshot/generate`)
    )
  },
  
  /**
   * 导出统计数据
   */
  async exportStatistics(exportType: string, queryRequest?: IStatisticsQueryRequest) {
    return handleApiResponse<IApiResponse<any>>(
      http.post(`admin/statistics/export`, {
        exportType,
        queryRequest
      }, {
        responseType: 'blob'
      })
    )
  }
}