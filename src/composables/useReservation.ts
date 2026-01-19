// 预约逻辑
import { ref, computed } from 'vue'
import { useReservationStore } from '@/stores/reservation.store'
import { useAuthStore } from '@/stores/auth.store'
import { formatDateTime, getDurationMinutes } from '@/utils/date'
import type { ICreateReservationRequest } from '@/types/reservation.types'

export const useReservation = () => {
  const reservationStore = useReservationStore()
  const authStore = useAuthStore()

  const loading = computed(() => reservationStore.reservationLoading)
  const error = computed(() => reservationStore.reservationError)
  const reservations = computed(() => reservationStore.reservations)
  const upcomingReservations = computed(() => reservationStore.upcomingReservations)
  const activeReservations = computed(() => reservationStore.activeReservations)
  const todayReservations = computed(() => reservationStore.todayReservations)
  const historyReservations = computed(() => reservationStore.historyReservations)
  const formattedReservations = computed(() => reservationStore.formattedReservations)

  // 格式化预约时间
  const formatReservationTime = (reservation: any) => {
    return {
      date: formatDateTime(reservation.startTime, 'YYYY-MM-DD'),
      time: `${formatDateTime(reservation.startTime, 'HH:mm')} - ${formatDateTime(reservation.endTime, 'HH:mm')}`,
      duration: getDurationMinutes(reservation.startTime, reservation.endTime)
    }
  }

  // 创建预约
  const createReservation = async (data: ICreateReservationRequest) => {
    return await reservationStore.createReservation(data)
  }

  // 取消预约
  const cancelReservation = async (reservationId: string) => {
    return await reservationStore.cancelReservation(reservationId)
  }

  // 签到
  const checkIn = async (reservationId: string, method: any) => {
    return await reservationStore.checkIn(reservationId, method)
  }

  // 签退
  const checkOut = async (reservationId: string) => {
    return await reservationStore.checkOut(reservationId)
  }

  // 获取我的预约
  const fetchMyReservations = async (params?: any) => {
    const userId = authStore.user?.id
    if (!userId) {
      throw new Error('用户未登录')
    }
    return await reservationStore.fetchMyReservations(userId, params)
  }

  // 检查预约冲突
  const checkReservationConflict = async (seatId: string, startTime: string, endTime: string) => {
    return await reservationStore.checkReservationConflict(seatId, startTime, endTime)
  }

  // 刷新预约列表
  const refreshReservations = async (params?: any) => {
    await reservationStore.fetchReservations(params)
  }

  return {
    // 状态
    loading,
    error,
    reservations,
    upcomingReservations,
    activeReservations,
    todayReservations,
    historyReservations,
    formattedReservations,
    
    // 工具方法
    formatReservationTime,
    
    // 操作方法
    createReservation,
    cancelReservation,
    checkIn,
    checkOut,
    fetchMyReservations,
    checkReservationConflict,
    refreshReservations
  }
}