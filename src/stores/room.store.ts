// 自习室状态
import { defineStore } from 'pinia'
import  { IRoom, ISeat, IRoomQueryParams, IRoomListResponse, SeatStatus } from '@/types/room.types'
import { roomApi } from '@/api/room'

export const useRoomStore = defineStore('room', {
  state: () => ({
    rooms: [] as IRoom[],
    currentRoom: null as IRoom | null,
    roomSeats: [] as ISeat[],
    roomLoading: false,
    totalRooms: 0,
    roomError: null as string | null,
    // 实时状态
    seatStatusCache: new Map<string, SeatStatus>()
  }),

  getters: {
    // 获取可用座位数
    availableSeats: (state) => {
      return state.roomSeats.filter(seat => seat.status === 'available').length
    },

    // 获取座位状态统计
    seatStatusStats: (state) => {
      const stats = {
        available: 0,
        occupied: 0,
        reserved: 0,
        temp_leave: 0,
        maintenance: 0,
        disabled: 0
      }
      
      state.roomSeats.forEach(seat => {
        const status = state.seatStatusCache.get(seat.id) || seat.status
        if (status in stats) {
          stats[status as keyof typeof stats]++
        }
      })
      return stats
    },

    // 获取自习室实时状态
    roomRealTimeStatus: (state) => {
      if (!state.currentRoom) return null
      
      const stats = {
        roomId: state.currentRoom.id,
        totalSeats: state.roomSeats.length,
        availableSeats: 0,
        occupiedSeats: 0,
        reservedSeats: 0,
        tempLeaveSeats: 0,
        lastUpdateTime: new Date().toISOString()
      }
      
      state.roomSeats.forEach(seat => {
        const status = state.seatStatusCache.get(seat.id) || seat.status
        switch (status) {
          case 'available':
            stats.availableSeats++
            break
          case 'occupied':
            stats.occupiedSeats++
            break
          case 'reserved':
            stats.reservedSeats++
            break
          case 'temp_leave':
            stats.tempLeaveSeats++
            break
        }
      })
      
      return stats
    }
  },

  actions: {
    // 设置当前自习室
    setCurrentRoom(room: IRoom) {
      this.currentRoom = room
      this.roomError = null
    },

    // 清除当前自习室
    clearCurrentRoom() {
      this.currentRoom = null
      this.roomSeats = []
      this.seatStatusCache.clear()
    },

    // 获取自习室列表
    async fetchRooms(params?: IRoomQueryParams) {
      this.roomLoading = true
      this.roomError = null
      
      try {
        const { data, error } = await roomApi.getRooms(params)
        if (error) throw error
        this.rooms = data.list
        this.totalRooms = data.total
      } catch (error: any) {
        this.roomError = error.message || '获取自习室列表失败'
        console.error('获取自习室列表失败:', error)
      } finally {
        this.roomLoading = false
      }
    },

    // 获取自习室详情
    async fetchRoomDetail(roomId: string) {
      this.roomLoading = true
      this.roomError = null
      
      try {
        const { data, error } = await roomApi.getRoom(roomId)
        if (error) throw error
        this.currentRoom = data
        
        // 同时获取座位数据
        await this.fetchRoomSeats(roomId)
      } catch (error: any) {
        this.roomError = error.message || '获取自习室详情失败'
        console.error('获取自习室详情失败:', error)
      } finally {
        this.roomLoading = false
      }
    },

    // 获取自习室座位
    async fetchRoomSeats(roomId: string) {
      this.roomLoading = true
      this.roomError = null
      
      try {
        const { data, error } = await roomApi.getRoomSeats(roomId)
        if (error) throw error
        this.roomSeats = data
      } catch (error: any) {
        this.roomError = error.message || '获取自习室座位失败'
        console.error('获取自习室座位失败:', error)
      } finally {
        this.roomLoading = false
      }
    },

    // 更新座位状态（用于WebSocket实时更新）
    updateSeatStatus(seatId: string, status: SeatStatus) {
      this.seatStatusCache.set(seatId, status)
      
      // 同时更新roomSeats中的状态
      const seatIndex = this.roomSeats.findIndex(seat => seat.id === seatId)
      if (seatIndex !== -1) {
        this.roomSeats[seatIndex].status = status
      }
    },

    // 清除座位状态缓存
    clearSeatStatusCache() {
      this.seatStatusCache.clear()
    },

    // 创建自习室
    async createRoom(data: any) {
      this.roomLoading = true
      this.roomError = null
      
      try {
        const { data: room, error } = await roomApi.createRoom(data)
        if (error) throw error
        this.rooms.push(room)
        this.totalRooms++
      } catch (error: any) {
        this.roomError = error.message || '创建自习室失败'
        console.error('创建自习室失败:', error)
        throw error
      } finally {
        this.roomLoading = false
      }
    },

    // 更新自习室
    async updateRoom(id: string, data: any) {
      this.roomLoading = true
      this.roomError = null
      
      try {
        const { data: room, error } = await roomApi.updateRoom(id, data)
        if (error) throw error
        
        // 更新本地数据
        const roomIndex = this.rooms.findIndex(room => room.id === id)
        if (roomIndex !== -1) {
          this.rooms[roomIndex] = { ...this.rooms[roomIndex], ...room }
        }
        
        if (this.currentRoom?.id === id) {
          this.currentRoom = { ...this.currentRoom, ...room }
        }
      } catch (error: any) {
        this.roomError = error.message || '更新自习室失败'
        console.error('更新自习室失败:', error)
        throw error
      } finally {
        this.roomLoading = false
      }
    },

    // 删除自习室
    async deleteRoom(id: string) {
      this.roomLoading = true
      this.roomError = null
      
      try {
        const { error } = await roomApi.deleteRoom(id)
        if (error) throw error
        
        // 更新本地数据
        this.rooms = this.rooms.filter(room => room.id !== id)
        this.totalRooms = this.rooms.length
        
        if (this.currentRoom?.id === id) {
          this.clearCurrentRoom()
        }
      } catch (error: any) {
        this.roomError = error.message || '删除自习室失败'
        console.error('删除自习室失败:', error)
        throw error
      } finally {
        this.roomLoading = false
      }
    },

    // 获取可用的自习室
    async fetchAvailableRooms(startTime: string, endTime: string) {
      this.roomLoading = true
      this.roomError = null
      
      try {
        console.log('获取可用自习室:', { startTime, endTime })
        
        // 模拟筛选
        const availableRooms = this.rooms.filter(room => 
          room.status === 'open' && room.availableSeats > 0
        )
        
        return availableRooms
      } catch (error: any) {
        this.roomError = error.message || '获取可用自习室失败'
        console.error('获取可用自习室失败:', error)
        return []
      } finally {
        this.roomLoading = false
      }
    }
  }
})