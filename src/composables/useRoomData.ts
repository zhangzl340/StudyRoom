// 自习室数据
import { ref, computed } from 'vue'
import { useRoomStore } from '@/stores/room.store'
import type { IRoom, SeatStatus } from '@/types/room.types'

export const useRoomData = () => {
  const roomStore = useRoomStore()

  const loading = computed(() => roomStore.roomLoading)
  const error = computed(() => roomStore.roomError)
  const rooms = computed(() => roomStore.rooms)
  const currentRoom = computed(() => roomStore.currentRoom)
  const roomSeats = computed(() => roomStore.roomSeats)
  const seatStatusStats = computed(() => roomStore.seatStatusStats)
  const roomRealTimeStatus = computed(() => roomStore.roomRealTimeStatus)
  const totalRooms = computed(() => roomStore.totalRooms)
  const availableSeats = computed(() => roomStore.availableSeats)

  // 获取自习室列表
  const fetchRooms = async (params?: any) => {
    await roomStore.fetchRooms(params)
  }

  // 获取自习室详情
  const fetchRoomDetail = async (roomId: string) => {
    await roomStore.fetchRoomDetail(roomId)
  }

  // 获取自习室座位
  const fetchRoomSeats = async (roomId: string) => {
    await roomStore.fetchRoomSeats(roomId)
  }

  // 选择自习室
  const selectRoom = (room: IRoom) => {
    roomStore.setCurrentRoom(room)
  }

  // 清除当前自习室
  const clearCurrentRoom = () => {
    roomStore.clearCurrentRoom()
  }

  // 获取座位状态数量
  const getSeatStatusCount = (status: SeatStatus) => {
    return roomSeats.value.filter(seat => seat.status === status).length
  }

  // 更新座位状态（用于WebSocket）
  const updateSeatStatus = (seatId: string, status: SeatStatus) => {
    roomStore.updateSeatStatus(seatId, status)
  }

  // 获取可用自习室
  const fetchAvailableRooms = async (startTime: string, endTime: string) => {
    return await roomStore.fetchAvailableRooms(startTime, endTime)
  }

  // 创建自习室
  const createRoom = async (data: any) => {
    return await roomStore.createRoom(data)
  }

  // 更新自习室
  const updateRoom = async (id: string, data: any) => {
    return await roomStore.updateRoom(id, data)
  }

  // 删除自习室
  const deleteRoom = async (id: string) => {
    return await roomStore.deleteRoom(id)
  }

  return {
    // 状态
    loading,
    error,
    rooms,
    currentRoom,
    roomSeats,
    seatStatusStats,
    roomRealTimeStatus,
    totalRooms,
    availableSeats,
    
    // 操作方法
    fetchRooms,
    fetchRoomDetail,
    fetchRoomSeats,
    selectRoom,
    clearCurrentRoom,
    getSeatStatusCount,
    updateSeatStatus,
    fetchAvailableRooms,
    createRoom,
    updateRoom,
    deleteRoom
  }
}