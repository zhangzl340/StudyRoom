// 预约相关API
import { http } from '@/utils/request'
import { handleApiResponse, buildPaginationParams, API_CONFIG } from './config'
import type {
  IReservation,
  IReservationListResponse,
  IReservationQueryParams,
  ICreateReservationRequest,
  IUpdateReservationRequest,
  IReservationConflictCheck
} from '@/types/reservation.types'
import type { IApiResponse } from '@/types/api.types'

/**
 * 预约相关API
 */
export const reservationApi = {
  /**
   * 获取预约列表
   */
  async getReservations(params?: IReservationQueryParams) {
    return handleApiResponse<IApiResponse<IReservationListResponse>>(
      http.get(`student/reservation/list`, { params })
    )
  },
  
  /**
   * 获取预约详情
   */
  async getReservation(id: string) {
    return handleApiResponse<IApiResponse<IReservation>>(
      http.get(`student/reservation/detail/${id}`)
    )
  },
  
  /**
   * 创建预约
   */
  async createReservation(data: ICreateReservationRequest) {
    return handleApiResponse<IApiResponse<void>>(
      http.post(`student/reservation/create`, data)
    )
  },
  
  /**
   * 取消预约
   */
  async cancelReservation(reservationId: string) {
    return handleApiResponse<IApiResponse<void>>(
      http.post(`student/reservation/cancel`, { reservationId })
    )
  },
  
  /**
   * 确认预约
   */
  async checkReservation(reservationId: string) {
    return handleApiResponse<IApiResponse<void>>(
      http.post(`student/reservation/check`, { reservationId })
    )
  },
  
  /**
   * 修改预约
   */
  async updateReservation(id: string, data: IUpdateReservationRequest) {
    return handleApiResponse<IApiResponse<void>>(
      http.put(`student/reservation/update/${id}`, data)
    )
  },
  
  /**
   * 计算预约费用
   */
  async calculateReservationFee(data: ICreateReservationRequest) {
    return handleApiResponse<IApiResponse<number>>(
      http.post(`student/reservation/fee`, data)
    )
  },
  

  
  /**
   * 获取当前用户的预约
   */
  async getMyReservations(params?: Omit<IReservationQueryParams, 'userId'>) {
    return handleApiResponse<IApiResponse<IReservationListResponse>>(
      http.get(`student/reservation/list`, { params })
    )
  },
  
  /**
   * 获取即将开始的预约
   */
  async getUpcomingReservations() {
    return handleApiResponse<IApiResponse<IReservation[]>>(
      http.get(`student/reservation/upcoming`)
    )
  },
  
  /**
   * 检查预约冲突
   */
  async checkReservationConflict(
    roomId: string,
    seatId: string,
    startTime: string,
    endTime: string
  ) {
    const params: Record<string, any> = { roomId, seatId, startTime, endTime }
    
    return handleApiResponse<IApiResponse<IReservationConflictCheck>>(
      http.get(`student/reservation/availability`, { params })
    )
  },
  
  /**
   * 获取座位的可用时间段
   */
  async getSeatAvailability(seatId: string, date: string) {
    return handleApiResponse<IApiResponse<Array<{ startTime: string; endTime: string }>>>(
      http.get(`student/reservation/availability`, { params: { seatId, date } })
    )
  },
  
  /**
   * 获取今日预约统计
   */
  async getTodayStats() {
    return handleApiResponse<IApiResponse<{
      total: number
      completed: number
      upcoming: number
      cancelled: number
    }>>(
      http.get(`student/reservation/statistics`)
    )
  }
}