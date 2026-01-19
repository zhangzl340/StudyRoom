// 统计数据
import { ref, computed } from 'vue'
import { useStatisticsStore } from '@/stores/statistics.store'

export const useStatistics = () => {
  const statisticsStore = useStatisticsStore()

  const loading = computed(() => statisticsStore.loading)
  const error = computed(() => statisticsStore.error)
  const systemStats = computed(() => statisticsStore.systemStats)
  const roomUsageStats = computed(() => statisticsStore.roomUsageStats)
  const seatHeatmap = computed(() => statisticsStore.seatHeatmap)
  const userActivityStats = computed(() => statisticsStore.userActivityStats)
  const timeSlotStats = computed(() => statisticsStore.timeSlotStats)
  const collegeDistribution = computed(() => statisticsStore.collegeDistribution)

  // 格式化数据
  const formattedRoomUsage = computed(() => statisticsStore.formattedRoomUsage)
  const formattedCollegeDistribution = computed(() => statisticsStore.formattedCollegeDistribution)
  const formattedTimeSlotStats = computed(() => statisticsStore.formattedTimeSlotStats)

  // 获取系统统计
  const fetchSystemStats = async () => {
    await statisticsStore.fetchSystemStats()
  }

  // 获取自习室使用统计
  const fetchRoomUsageStats = async (params?: any) => {
    await statisticsStore.fetchRoomUsageStats(params)
  }

  // 获取座位热度图
  const fetchSeatHeatmap = async (roomId: string, date?: string) => {
    await statisticsStore.fetchSeatHeatmap(roomId, date)
  }

  // 获取用户活跃度统计
  const fetchUserActivityStats = async (params?: any) => {
    await statisticsStore.fetchUserActivityStats(params)
  }

  // 获取时间段统计
  const fetchTimeSlotStats = async (roomId?: string, date?: string) => {
    await statisticsStore.fetchTimeSlotStats(roomId, date)
  }

  // 获取学院分布统计
  const fetchCollegeDistribution = async (date?: string) => {
    await statisticsStore.fetchCollegeDistribution(date)
  }

  // 刷新所有统计
  const refreshAllStats = async () => {
    await statisticsStore.refreshAllStats()
  }

  return {
    // 状态
    loading,
    error,
    systemStats,
    roomUsageStats,
    seatHeatmap,
    userActivityStats,
    timeSlotStats,
    collegeDistribution,
    
    // 格式化数据
    formattedRoomUsage,
    formattedCollegeDistribution,
    formattedTimeSlotStats,
    
    // 操作方法
    fetchSystemStats,
    fetchRoomUsageStats,
    fetchSeatHeatmap,
    fetchUserActivityStats,
    fetchTimeSlotStats,
    fetchCollegeDistribution,
    refreshAllStats
  }
}