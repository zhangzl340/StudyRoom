// 统计数据
import { defineStore } from 'pinia'
import type { ISystemStats } from '@/types/api.types'
import { statisticsApi } from '@/api/statistics'

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
        const { data, error } = await statisticsApi.getSystemStats()
        if (error) throw error
        this.systemStats = data
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
        const { data, error } = await statisticsApi.getRoomUsageStats(params)
        if (error) throw error
        this.roomUsageStats = data
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
        const { data, error } = await statisticsApi.getSeatHeatmap(roomId, date)
        if (error) throw error
        this.seatHeatmap = data
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
        const { data, error } = await statisticsApi.getUserActivityStats(params)
        if (error) throw error
        this.userActivityStats = data
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
        const { data, error } = await statisticsApi.getTimeSlotStats(roomId, date)
        if (error) throw error
        this.timeSlotStats = data
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
        const { data, error } = await statisticsApi.getCollegeDistribution(date)
        if (error) throw error
        this.collegeDistribution = data
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