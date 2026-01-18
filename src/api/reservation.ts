// 预约相关API
import { http } from '@/utils/request'
import { handleApiResponse, buildPaginationParams } from './config'
import type {
  IReservation,
  IReservationListResponse,
  IReservationQueryParams,
  ICreateReservationRequest,
  IUpdateReservationRequest,
  ICheckInRequest,
  ICheckOutRequest,
  ITempLeaveRequest,
  IReturnSeatRequest,
  IReservationConflictCheck
} from '@/types/reservation.types'

/**
 * 预约相关API
 */
export const reservationApi = {
  /**
   * 获取预约列表
   */
  async getReservations(params?: IReservationQueryParams) {
    const queryParams = buildPaginationParams(params)
    return handleApiResponse<IReservationListResponse>(
      http.get(`/reservations${queryParams}`)
    )
  },
  
  /**
   * 获取预约详情
   */
  async getReservation(id: string) {
    return handleApiResponse<IReservation>(
      http.get(`/reservations/${id}`)
    )
  },
  
  /**
   * 创建预约
   */
  async createReservation(data: ICreateReservationRequest) {
    return handleApiResponse<IReservation>(
      http.post('/reservations', data)
    )
  },
  
  /**
   * 取消预约
   */
  async cancelReservation(id: string) {
    return handleApiResponse<IReservation>(
      http.post(`/reservations/${id}/cancel`)
    )
  },
  
  /**
   * 修改预约
   */
  async updateReservation(id: string, data: IUpdateReservationRequest) {
    return handleApiResponse<IReservation>(
      http.put(`/reservations/${id}`, data)
    )
  },
  
  /**
   * 签到
   */
  async checkIn(data: ICheckInRequest) {
    return handleApiResponse<IReservation>(
      http.post('/reservations/check-in', data)
    )
  },
  
  /**
   * 签退
   */
  async checkOut(data: ICheckOutRequest) {
    return handleApiResponse<IReservation>(
      http.post('/reservations/check-out', data)
    )
  },
  
  /**
   * 暂时离开
   */
  async tempLeave(data: ITempLeaveRequest) {
    return handleApiResponse<IReservation>(
      http.post('/reservations/temp-leave', data)
    )
  },
  
  /**
   * 返回座位
   */
  async returnSeat(data: IReturnSeatRequest) {
    return handleApiResponse<IReservation>(
      http.post('/reservations/return-seat', data)
    )
  },
  
  /**
   * 获取当前用户的预约
   */
  async getMyReservations(params?: Omit<IReservationQueryParams, 'userId'>) {
    const queryParams = buildPaginationParams(params)
    return handleApiResponse<IReservationListResponse>(
      http.get(`/reservations/my${queryParams}`)
    )
  },
  
  /**
   * 获取即将开始的预约
   */
  async getUpcomingReservations() {
    return handleApiResponse<IReservation[]>(
      http.get('/reservations/upcoming')
    )
  },
  
  /**
   * 检查预约冲突
   */
  async checkReservationConflict(
    seatId: string,
    startTime: string,
    endTime: string,
    excludeReservationId?: string
  ) {
    const params: Record<string, any> = { seatId, startTime, endTime }
    if (excludeReservationId) {
      params.excludeReservationId = excludeReservationId
    }
    
    return handleApiResponse<IReservationConflictCheck>(
      http.get('/reservations/check-conflict', { params })
    )
  },
  
  /**
   * 获取座位的可用时间段
   */
  async getSeatAvailability(seatId: string, date: string) {
    return handleApiResponse<Array<{ startTime: string; endTime: string }>>(
      http.get(`/reservations/seat/${seatId}/availability`, { params: { date } })
    )
  },
  
  /**
   * 获取今日预约统计
   */
  async getTodayStats() {
    return handleApiResponse<{
      total: number
      completed: number
      upcoming: number
      cancelled: number
    }>(
      http.get('/reservations/stats/today')
    )
  }
}