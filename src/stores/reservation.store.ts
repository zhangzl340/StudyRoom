// 预约状态
import { defineStore } from 'pinia'
import  { 
  IReservation, 
  IReservationQueryParams, 
  IReservationListResponse,
  ICreateReservationRequest,
  ReservationStatus,
  CheckInMethod
} from '@/types/reservation.types'



import { reservationApi } from '@/api/reservation'
import { formatDateTime, getDurationMinutes } from '@/utils/date'

export const useReservationStore = defineStore('reservation', {
  state: () => ({
    reservations: [] as IReservation[],
    currentReservation: null as IReservation | null,
    upcomingReservations: [] as IReservation[],
    reservationLoading: false,
    totalReservations: 0,
    reservationError: null as string | null
  }),

  getters: {
    // 获取进行中的预约
    activeReservations: (state) => {
      return state.reservations.filter(reservation => 
        reservation.status === ReservationStatus.CHECKED_IN ||
        reservation.status === ReservationStatus.PENDING
      )
    },

    // 获取今天的预约
    todayReservations: (state) => {
      const today = new Date().toISOString().split('T')[0]
      return state.reservations.filter(reservation => 
        reservation.startTime.startsWith(today)
      )
    },

    // 获取历史预约
    historyReservations: (state) => {
      return state.reservations.filter(reservation => 
        reservation.status === ReservationStatus.CHECKED_OUT ||
        reservation.status === ReservationStatus.CANCELLED ||
        reservation.status === ReservationStatus.EXPIRED
      ).sort((a, b) => 
        new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
      )
    },

    // 格式化预约信息
    formattedReservations: (state) => {
      return state.reservations.map(reservation => ({
        ...reservation,
        formattedDate: formatDateTime(reservation.startTime, 'YYYY-MM-DD'),
        formattedTime: `${formatDateTime(reservation.startTime, 'HH:mm')} - ${formatDateTime(reservation.endTime, 'HH:mm')}`,
        durationMinutes: getDurationMinutes(reservation.startTime, reservation.endTime)
      }))
    }
  },

  actions: {
    // 设置当前预约
    setCurrentReservation(reservation: IReservation) {
      this.currentReservation = reservation
      this.reservationError = null
    },

    // 清除当前预约
    clearCurrentReservation() {
      this.currentReservation = null
    },

    // 获取预约列表
    async fetchReservations(params?: IReservationQueryParams) {
      this.reservationLoading = true
      this.reservationError = null
      
      try {
        const { data, error } = await reservationApi.getReservations(params)
        if (error) throw error
        this.reservations = data.list
        this.totalReservations = data.total
        
        // 获取即将开始的预约
        const { data: upcomingData } = await reservationApi.getUpcomingReservations()
        this.upcomingReservations = upcomingData
      } catch (error: any) {
        this.reservationError = error.message || '获取预约列表失败'
        console.error('获取预约列表失败:', error)
      } finally {
        this.reservationLoading = false
      }
    },

    // 获取我的预约
    async fetchMyReservations(userId: string, params?: any) {
      this.reservationLoading = true
      this.reservationError = null
      
      try {
        console.log('获取我的预约:', userId)
        
        // 调用通用的fetchReservations方法，传入userId参数
        await this.fetchReservations({ ...params, userId })
      } catch (error: any) {
        this.reservationError = error.message || '获取我的预约失败'
        console.error('获取我的预约失败:', error)
      } finally {
        this.reservationLoading = false
      }
    },

    // 创建预约
    async createReservation(data: ICreateReservationRequest) {
      this.reservationLoading = true
      this.reservationError = null
      
      try {
        const { data: reservation, error } = await reservationApi.createReservation(data)
        if (error) throw error
        this.reservations.unshift(reservation)
        this.totalReservations++
        this.setCurrentReservation(reservation)
        
        return reservation
      } catch (error: any) {
        this.reservationError = error.message || '创建预约失败'
        console.error('创建预约失败:', error)
        throw error
      } finally {
        this.reservationLoading = false
      }
    },

    // 取消预约
    async cancelReservation(reservationId: string) {
      this.reservationLoading = true
      this.reservationError = null
      
      try {
        const { data, error } = await reservationApi.cancelReservation(reservationId)
        if (error) throw error
        
        // 更新本地数据
        const reservationIndex = this.reservations.findIndex(r => r.id === reservationId)
        if (reservationIndex !== -1) {
          this.reservations[reservationIndex] = {
            ...this.reservations[reservationIndex],
            status: ReservationStatus.CANCELLED,
            updatedAt: new Date().toISOString()
          }
        }
        
        if (this.currentReservation?.id === reservationId) {
          this.clearCurrentReservation()
        }
      } catch (error: any) {
        this.reservationError = error.message || '取消预约失败'
        console.error('取消预约失败:', error)
        throw error
      } finally {
        this.reservationLoading = false
      }
    },

    // 签到
    async checkIn(reservationId: string, method: CheckInMethod) {
      this.reservationLoading = true
      this.reservationError = null
      
      try {
        const { data, error } = await reservationApi.checkIn({ reservationId, checkInMethod: method })
        if (error) throw error
        
        // 更新本地数据
        const reservationIndex = this.reservations.findIndex(r => r.id === reservationId)
        if (reservationIndex !== -1) {
          this.reservations[reservationIndex] = {
            ...this.reservations[reservationIndex],
            status: ReservationStatus.CHECKED_IN,
            checkInTime: new Date().toISOString(),
            checkInMethod: method,
            actualStartTime: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      } catch (error: any) {
        this.reservationError = error.message || '签到失败'
        console.error('签到失败:', error)
        throw error
      } finally {
        this.reservationLoading = false
      }
    },

    // 签退
    async checkOut(reservationId: string) {
      this.reservationLoading = true
      this.reservationError = null
      
      try {
        const { data, error } = await reservationApi.checkOut({ reservationId })
        if (error) throw error
        
        // 更新本地数据
        const reservationIndex = this.reservations.findIndex(r => r.id === reservationId)
        if (reservationIndex !== -1) {
          const reservation = this.reservations[reservationIndex]
          const checkOutTime = new Date()
          const actualEndTime = checkOutTime.toISOString()
          const actualDuration = getDurationMinutes(
            reservation.actualStartTime || reservation.startTime,
            actualEndTime
          )
          
          this.reservations[reservationIndex] = {
            ...reservation,
            status: ReservationStatus.CHECKED_OUT,
            checkOutTime: checkOutTime.toISOString(),
            actualEndTime,
            actualDuration,
            updatedAt: checkOutTime.toISOString()
          }
        }
      } catch (error: any) {
        this.reservationError = error.message || '签退失败'
        console.error('签退失败:', error)
        throw error
      } finally {
        this.reservationLoading = false
      }
    },

    // 检查预约冲突
    async checkReservationConflict(seatId: string, startTime: string, endTime: string) {
      try {
        console.log('检查预约冲突:', { seatId, startTime, endTime })
        
        // 模拟检查
        const conflictingReservations = this.reservations.filter(reservation => 
          reservation.seatId === seatId &&
          reservation.status !== ReservationStatus.CANCELLED &&
          reservation.status !== ReservationStatus.CHECKED_OUT &&
          reservation.status !== ReservationStatus.EXPIRED &&
          (
            (new Date(startTime) < new Date(reservation.endTime) && 
             new Date(endTime) > new Date(reservation.startTime))
          )
        )
        
        return {
          hasConflict: conflictingReservations.length > 0,
          conflictingReservations,
          availableTimeSlots: [] // 简化处理
        }
      } catch (error: any) {
        console.error('检查预约冲突失败:', error)
        throw error
      }
    },

    // 刷新预约数据
    async refreshReservations() {
      await this.fetchReservations()
    }
  }
})