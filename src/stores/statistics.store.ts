// 统计数据
import { defineStore } from 'pinia'
import type { ISystemStats } from '@/types/api.types'
// import { statisticsApi } from '@/api/statistics'

export const useStatisticsStore = defineStore('statistics', {
  state: () => ({
    systemStats: null as ISystemStats | null,
    roomUsageStats: [] as any[],
    seatHeatmap: [] as any[],
    userActivityStats: [] as any[],
    timeSlotStats: [] as any[],
    collegeDistribution: [] as any[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    // 系统统计信息的getters
    totalUsers: (state) => state.systemStats?.totalUsers || 0,
    totalRooms: (state) => state.systemStats?.totalRooms || 0,
    totalSeats: (state) => state.systemStats?.totalSeats || 0,
    todayReservations: (state) => state.systemStats?.todayReservations || 0,
    activeUsers: (state) => state.systemStats?.activeUsers || 0,

    // 格式化数据用于图表
    formattedRoomUsage: (state) => {
      return state.roomUsageStats.map(item => ({
        date: item.date,
        usageHours: item.usageHours,
        reservationCount: item.reservationCount,
        occupancyRate: item.avgOccupancyRate
      }))
    },

    formattedCollegeDistribution: (state) => {
      return state.collegeDistribution.map(item => ({
        name: item.college,
        value: item.userCount
      }))
    },

    formattedTimeSlotStats: (state) => {
      return state.timeSlotStats.map(item => ({
        time: item.timeSlot,
        occupancyRate: item.occupancyRate,
        reservationCount: item.reservationCount
      }))
    }
  },

  actions: {
    // 获取系统统计
    async fetchSystemStats() {
      this.loading = true
      this.error = null
      
      try {
        console.log('获取系统统计')
        
        // 模拟数据
        const mockSystemStats: ISystemStats = {
          totalUsers: 1560,
          totalRooms: 12,
          totalSeats: 850,
          totalReservations: 23450,
          todayReservations: 245,
          activeUsers: 320,
          systemLoad: 65
        }
        
        this.systemStats = mockSystemStats
        
        // 实际使用时取消注释以下代码
        /*
        const { data, error } = await statisticsApi.getSystemStats()
        if (error) throw error
        this.systemStats = data
        */
      } catch (error: any) {
        this.error = error.message || '获取系统统计失败'
        console.error('获取系统统计失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 获取自习室使用统计
    async fetchRoomUsageStats(params?: any) {
      this.loading = true
      this.error = null
      
      try {
        console.log('获取自习室使用统计，参数:', params)
        
        // 模拟数据 - 过去7天的数据
        const mockRoomUsageStats = Array.from({ length: 7 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (6 - i))
          const dateStr = date.toISOString().split('T')[0]
          
          return {
            date: dateStr,
            usageHours: Math.floor(Math.random() * 200) + 100,
            reservationCount: Math.floor(Math.random() * 50) + 30,
            avgOccupancyRate: Math.random() * 0.4 + 0.5 // 50%-90%
          }
        })
        
        this.roomUsageStats = mockRoomUsageStats
        
        // 实际使用时取消注释以下代码
        /*
        const { data, error } = await statisticsApi.getRoomUsageStats(params)
        if (error) throw error
        this.roomUsageStats = data
        */
      } catch (error: any) {
        this.error = error.message || '获取自习室使用统计失败'
        console.error('获取自习室使用统计失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 获取座位热度图
    async fetchSeatHeatmap(roomId: string, date?: string) {
      this.loading = true
      this.error = null
      
      try {
        console.log('获取座位热度图:', { roomId, date })
        
        // 模拟数据
        const mockSeatHeatmap = Array.from({ length: 50 }, (_, i) => ({
          seatId: `seat-${roomId}-${i + 1}`,
          seatNumber: `${Math.floor(i / 10) + 1}排${(i % 10) + 1}号`,
          usageHours: Math.floor(Math.random() * 8),
          reservationCount: Math.floor(Math.random() * 5),
          popularityScore: Math.random()
        }))
        
        this.seatHeatmap = mockSeatHeatmap
        
        // 实际使用时取消注释以下代码
        /*
        const { data, error } = await statisticsApi.getSeatHeatmap(roomId, date)
        if (error) throw error
        this.seatHeatmap = data
        */
      } catch (error: any) {
        this.error = error.message || '获取座位热度图失败'
        console.error('获取座位热度图失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 获取用户活跃度统计
    async fetchUserActivityStats(params?: any) {
      this.loading = true
      this.error = null
      
      try {
        console.log('获取用户活跃度统计，参数:', params)
        
        // 模拟数据 - 过去30天的数据
        const mockUserActivityStats = Array.from({ length: 30 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (29 - i))
          const dateStr = date.toISOString().split('T')[0]
          
          return {
            date: dateStr,
            activeUsers: Math.floor(Math.random() * 100) + 200,
            newUsers: Math.floor(Math.random() * 10) + 5,
            avgUsageHours: Math.random() * 2 + 1.5
          }
        })
        
        this.userActivityStats = mockUserActivityStats
        
        // 实际使用时取消注释以下代码
        /*
        const { data, error } = await statisticsApi.getUserActivityStats(params)
        if (error) throw error
        this.userActivityStats = data
        */
      } catch (error: any) {
        this.error = error.message || '获取用户活跃度统计失败'
        console.error('获取用户活跃度统计失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 获取时间段使用统计
    async fetchTimeSlotStats(roomId?: string, date?: string) {
      this.loading = true
      this.error = null
      
      try {
        console.log('获取时间段使用统计:', { roomId, date })
        
        // 模拟数据 - 一天24小时
        const mockTimeSlotStats = Array.from({ length: 24 }, (_, i) => {
          const timeSlot = `${i.toString().padStart(2, '0')}:00`
          
          // 模拟使用率：早上和晚上高，中午低
          let occupancyRate = 0.3
          if (i >= 8 && i <= 11) occupancyRate = 0.7 // 上午
          else if (i >= 14 && i <= 17) occupancyRate = 0.6 // 下午
          else if (i >= 19 && i <= 22) occupancyRate = 0.8 // 晚上
          
          return {
            timeSlot,
            occupancyRate: occupancyRate + (Math.random() * 0.2 - 0.1), // 添加随机波动
            reservationCount: Math.floor(occupancyRate * 20) + Math.floor(Math.random() * 5)
          }
        })
        
        this.timeSlotStats = mockTimeSlotStats
        
        // 实际使用时取消注释以下代码
        /*
        const { data, error } = await statisticsApi.getTimeSlotStats(roomId, date)
        if (error) throw error
        this.timeSlotStats = data
        */
      } catch (error: any) {
        this.error = error.message || '获取时间段使用统计失败'
        console.error('获取时间段使用统计失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 获取学院分布统计
    async fetchCollegeDistribution(date?: string) {
      this.loading = true
      this.error = null
      
      try {
        console.log('获取学院分布统计，日期:', date)
        
        // 模拟数据
        const mockCollegeDistribution = [
          { college: '计算机学院', userCount: 320, reservationCount: 1250, totalUsageHours: 4500 },
          { college: '信息工程学院', userCount: 280, reservationCount: 1100, totalUsageHours: 4200 },
          { college: '机械工程学院', userCount: 240, reservationCount: 900, totalUsageHours: 3500 },
          { college: '电气工程学院', userCount: 210, reservationCount: 850, totalUsageHours: 3200 },
          { college: '理学院', userCount: 180, reservationCount: 700, totalUsageHours: 2800 },
          { college: '文学院', userCount: 160, reservationCount: 600, totalUsageHours: 2500 },
          { college: '经济管理学院', userCount: 140, reservationCount: 550, totalUsageHours: 2200 },
          { college: '其他', userCount: 30, reservationCount: 100, totalUsageHours: 500 }
        ]
        
        this.collegeDistribution = mockCollegeDistribution
        
        // 实际使用时取消注释以下代码
        /*
        const { data, error } = await statisticsApi.getCollegeDistribution(date)
        if (error) throw error
        this.collegeDistribution = data
        */
      } catch (error: any) {
        this.error = error.message || '获取学院分布统计失败'
        console.error('获取学院分布统计失败:', error)
      } finally {
        this.loading = false
      }
    },

    // 刷新所有统计
    async refreshAllStats() {
      this.loading = true
      this.error = null
      
      try {
        await Promise.all([
          this.fetchSystemStats(),
          this.fetchRoomUsageStats(),
          this.fetchCollegeDistribution()
        ])
      } catch (error: any) {
        this.error = error.message || '刷新统计数据失败'
        console.error('刷新统计数据失败:', error)
      } finally {
        this.loading = false
      }
    }
  }
})