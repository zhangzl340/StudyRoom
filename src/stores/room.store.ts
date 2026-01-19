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
        console.log('获取自习室列表，参数:', params)
        
        // 模拟数据
        const mockRooms: IRoom[] = [
          {
            id: '1',
            name: '第一教学楼101',
            code: 'T1-101',
            building: '第一教学楼',
            floor: '1楼',
            description: '安静舒适的自习室，配备空调和WiFi',
            capacity: 50,
            availableSeats: 45,
            openTime: '08:00',
            closeTime: '22:00',
            status: 'open',
            features: ['wifi', 'air_conditioner', 'power_sockets'],
            imageUrl: '',
            layoutType: 'grid',
            adminIds: ['3'],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
          },
          {
            id: '2',
            name: '图书馆201',
            code: 'LIB-201',
            building: '图书馆',
            floor: '2楼',
            description: '图书馆内的安静自习区',
            capacity: 80,
            availableSeats: 72,
            openTime: '08:00',
            closeTime: '22:00',
            status: 'open',
            features: ['wifi', 'air_conditioner', 'quiet_zone'],
            imageUrl: '',
            layoutType: 'grid',
            adminIds: ['3'],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
          },
          {
            id: '3',
            name: '计算机中心301',
            code: 'CC-301',
            building: '计算机中心',
            floor: '3楼',
            description: '计算机专业自习室，配备高性能电脑',
            capacity: 40,
            availableSeats: 30,
            openTime: '09:00',
            closeTime: '21:00',
            status: 'open',
            features: ['wifi', 'computers', 'printing'],
            imageUrl: '',
            layoutType: 'custom',
            adminIds: ['3'],
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
          }
        ]
        
        this.rooms = mockRooms
        this.totalRooms = mockRooms.length
        
        // 实际使用时取消注释以下代码
        /*
        const { data, error } = await roomApi.getRooms(params)
        if (error) throw error
        this.rooms = data.list
        this.totalRooms = data.total
        */
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
        console.log('获取自习室详情:', roomId)
        
        // 模拟数据
        const mockRoom: IRoom = {
          id: roomId,
          name: '第一教学楼101',
          code: 'T1-101',
          building: '第一教学楼',
          floor: '1楼',
          description: '安静舒适的自习室，配备空调和WiFi',
          capacity: 50,
          availableSeats: 45,
          openTime: '08:00',
          closeTime: '22:00',
          status: 'open',
          features: ['wifi', 'air_conditioner', 'power_sockets'],
          imageUrl: '',
          layoutType: 'grid',
          adminIds: ['3'],
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        }
        
        this.currentRoom = mockRoom
        
        // 同时获取座位数据
        await this.fetchRoomSeats(roomId)
        
        // 实际使用时取消注释以下代码
        /*
        const { data, error } = await roomApi.getRoom(roomId)
        if (error) throw error
        this.currentRoom = data
        */
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
        console.log('获取自习室座位:', roomId)
        
        // 模拟数据 - 生成50个座位
        const mockSeats: ISeat[] = Array.from({ length: 50 }, (_, index) => {
          const row = Math.floor(index / 10) + 1
          const col = (index % 10) + 1
          
          // 随机生成座位状态
          const statuses: SeatStatus[] = ['available', 'occupied', 'reserved', 'available', 'available']
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
          
          // 随机生成座位类型
          const types = ['standard', 'window', 'power', 'standard', 'standard']
          const randomType = types[Math.floor(Math.random() * types.length)] as any
          
          return {
            id: `seat-${roomId}-${index + 1}`,
            roomId,
            seatNumber: `${row}排${col}号`,
            name: `座位 ${index + 1}`,
            type: randomType,
            status: randomStatus,
            position: {
              row,
              column: col,
              x: col * 60,
              y: row * 60
            },
            features: randomType === 'power' ? ['power'] : [],
            isActive: true,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
          }
        })
        
        this.roomSeats = mockSeats
        
        // 实际使用时取消注释以下代码
        /*
        const { data, error } = await roomApi.getRoomSeats(roomId)
        if (error) throw error
        this.roomSeats = data
        */
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
        console.log('创建自习室:', data)
        
        // 模拟创建
        const newRoom: IRoom = {
          id: Date.now().toString(),
          ...data,
          status: 'open',
          availableSeats: data.capacity || 0,
          adminIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        this.rooms.push(newRoom)
        this.totalRooms++
        
        // 实际使用时取消注释以下代码
        /*
        const { data: room, error } = await roomApi.createRoom(data)
        if (error) throw error
        this.rooms.push(room)
        this.totalRooms++
        */
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
        console.log('更新自习室:', { id, data })
        
        // 更新本地数据
        const roomIndex = this.rooms.findIndex(room => room.id === id)
        if (roomIndex !== -1) {
          this.rooms[roomIndex] = { ...this.rooms[roomIndex], ...data }
        }
        
        if (this.currentRoom?.id === id) {
          this.currentRoom = { ...this.currentRoom, ...data }
        }
        
        // 实际使用时取消注释以下代码
        /*
        const { data: room, error } = await roomApi.updateRoom(id, data)
        if (error) throw error
        */
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
        console.log('删除自习室:', id)
        
        // 更新本地数据
        this.rooms = this.rooms.filter(room => room.id !== id)
        this.totalRooms = this.rooms.length
        
        if (this.currentRoom?.id === id) {
          this.clearCurrentRoom()
        }
        
        // 实际使用时取消注释以下代码
        /*
        const { error } = await roomApi.deleteRoom(id)
        if (error) throw error
        */
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