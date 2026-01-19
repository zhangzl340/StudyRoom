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
        console.log('获取预约列表，参数:', params)
        
        // 模拟数据
        const mockReservations: IReservation[] = [
          {
            id: 'res-1',
            userId: '1',
            roomId: '1',
            seatId: 'seat-1-1',
            startTime: '2024-01-15T10:00:00Z',
            endTime: '2024-01-15T12:00:00Z',
            status: ReservationStatus.CHECKED_OUT,
            checkInTime: '2024-01-15T10:05:00Z',
            checkOutTime: '2024-01-15T11:55:00Z',
            checkInMethod: CheckInMethod.QR_CODE,
            actualStartTime: '2024-01-15T10:05:00Z',
            actualEndTime: '2024-01-15T11:55:00Z',
            totalDuration: 120,
            actualDuration: 110,
            notes: '完成学习任务',
            createdAt: '2024-01-14T15:30:00Z',
            updatedAt: '2024-01-15T11:55:00Z',
            user: {
              id: '1',
              username: 'zhangsan',
              realName: '张三',
              studentId: '20240001'
            },
            room: {
              id: '1',
              name: '第一教学楼101',
              building: '第一教学楼',
              floor: '1楼'
            },
            seat: {
              id: 'seat-1-1',
              seatNumber: '1排1号',
              type: 'standard'
            }
          },
          {
            id: 'res-2',
            userId: '1',
            roomId: '2',
            seatId: 'seat-2-15',
            startTime: '2024-01-16T14:00:00Z',
            endTime: '2024-01-16T16:00:00Z',
            status: ReservationStatus.PENDING,
            totalDuration: 120,
            notes: '',
            createdAt: '2024-01-15T16:20:00Z',
            updatedAt: '2024-01-15T16:20:00Z',
            user: {
              id: '1',
              username: 'zhangsan',
              realName: '张三',
              studentId: '20240001'
            },
            room: {
              id: '2',
              name: '图书馆201',
              building: '图书馆',
              floor: '2楼'
            },
            seat: {
              id: 'seat-2-15',
              seatNumber: '2排15号',
              type: 'window'
            }
          },
          {
            id: 'res-3',
            userId: '2',
            roomId: '3',
            seatId: 'seat-3-8',
            startTime: '2024-01-15T09:00:00Z',
            endTime: '2024-01-15T11:00:00Z',
            status: ReservationStatus.CHECKED_IN,
            checkInTime: '2024-01-15T08:55:00Z',
            checkInMethod: CheckInMethod.FACE_RECOGNITION,
            actualStartTime: '2024-01-15T08:55:00Z',
            totalDuration: 120,
            actualDuration: 65,
            notes: '',
            createdAt: '2024-01-14T20:15:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
            user: {
              id: '2',
              username: 'lisi',
              realName: '李四',
              studentId: '20240002'
            },
            room: {
              id: '3',
              name: '计算机中心301',
              building: '计算机中心',
              floor: '3楼'
            },
            seat: {
              id: 'seat-3-8',
              seatNumber: '3排8号',
              type: 'power'
            }
          }
        ]
        
        // 模拟筛选
        let filteredReservations = [...mockReservations]
        
        if (params?.status) {
          const statusArray = Array.isArray(params.status) ? params.status : [params.status]
          filteredReservations = filteredReservations.filter(reservation => 
            statusArray.includes(reservation.status)
          )
        }
        
        if (params?.userId) {
          filteredReservations = filteredReservations.filter(reservation => 
            reservation.userId === params.userId
          )
        }
        
        if (params?.roomId) {
          filteredReservations = filteredReservations.filter(reservation => 
            reservation.roomId === params.roomId
          )
        }
        
        if (params?.date) {
          filteredReservations = filteredReservations.filter(reservation => 
            reservation.startTime.startsWith(params.date!)
          )
        }
        
        this.reservations = filteredReservations
        this.totalReservations = filteredReservations.length
        
        // 获取即将开始的预约
        this.upcomingReservations = filteredReservations
          .filter(reservation => 
            reservation.status === ReservationStatus.PENDING &&
            new Date(reservation.startTime) > new Date()
          )
          .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        
        // 实际使用时取消注释以下代码
        /*
        const { data, error } = await reservationApi.getReservations(params)
        if (error) throw error
        this.reservations = data.list
        this.totalReservations = data.total
        
        // 获取即将开始的预约
        const { data: upcomingData } = await reservationApi.getUpcomingReservations()
        this.upcomingReservations = upcomingData
        */
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
        console.log('创建预约:', data)
        
        // 模拟创建
        const newReservation: IReservation = {
          id: `res-${Date.now()}`,
          userId: '1', // 模拟当前用户
          roomId: '1', // 模拟数据
          seatId: data.seatId,
          startTime: data.startTime,
          endTime: data.endTime,
          status: ReservationStatus.PENDING,
          totalDuration: getDurationMinutes(data.startTime, data.endTime),
          notes: data.notes || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        this.reservations.unshift(newReservation)
        this.totalReservations++
        this.setCurrentReservation(newReservation)
        
        // 实际使用时取消注释以下代码
        /*
        const { data: reservation, error } = await reservationApi.createReservation(data)
        if (error) throw error
        this.reservations.unshift(reservation)
        this.totalReservations++
        this.setCurrentReservation(reservation)
        */
        
        return newReservation
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
        console.log('取消预约:', reservationId)
        
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
        
        // 实际使用时取消注释以下代码
        /*
        const { data, error } = await reservationApi.cancelReservation(reservationId)
        if (error) throw error
        */
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
        console.log('签到:', { reservationId, method })
        
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
        
        // 实际使用时取消注释以下代码
        /*
        const { data, error } = await reservationApi.checkIn({ reservationId, checkInMethod: method })
        if (error) throw error
        */
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
        console.log('签退:', reservationId)
        
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
        
        // 实际使用时取消注释以下代码
        /*
        const { data, error } = await reservationApi.checkOut({ reservationId })
        if (error) throw error
        */
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