// 统计相关类型定义
/**
 * 统计查询参数接口
 */
export interface IStatisticsQueryParams {
  startDate?: string
  endDate?: string
  interval?: 'day' | 'week' | 'month'
  roomId?: string
  groupBy?: string
}

/**
 * 系统统计信息接口
 */
export interface ISystemStats {
  totalUsers: number
  totalRooms: number
  totalSeats: number
  totalReservations: number
  todayReservations: number
  activeUsers: number
  systemLoad: number
  totalUsageHours: number
  avgDailyUsers: number
  avgDailyReservations: number
  peakUsageTime?: string
  lowUsageTime?: string
}

/**
 * 自习室使用统计接口
 */
export interface IRoomUsageStat {
  date: string
  roomId: string
  roomName: string
  usageHours: number
  reservationCount: number
  avgOccupancyRate: number
  peakOccupancyRate: number
  lowOccupancyRate: number
}

/**
 * 座位热度数据接口
 */
export interface ISeatHeatmapData {
  seatId: string
  seatNumber: string
  roomId: string
  roomName: string
  usageHours: number
  reservationCount: number
  popularityScore: number
  x: number
  y: number
  status: string
}

/**
 * 用户活跃度统计接口
 */
export interface IUserActivityStat {
  date: string
  activeUsers: number
  newUsers: number
  avgUsageHours: number
  totalUsageHours: number
  reservationCount: number
  checkInRate: number
}

/**
 * 时间段使用统计接口
 */
export interface ITimeSlotStat {
  timeSlot: string
  hour: number
  occupancyRate: number
  reservationCount: number
  totalUsers: number
  peakRate: number
}

/**
 * 学院分布统计接口
 */
export interface ICollegeDistribution {
  college: string
  userCount: number
  reservationCount: number
  totalUsageHours: number
  avgUsageHours: number
  userPercentage: number
}

/**
 * 座位类型分布接口
 */
export interface ISeatTypeDistribution {
  seatType: string
  count: number
  usageHours: number
  occupancyRate: number
  popularityRate: number
}

/**
 * 违规统计接口
 */
export interface IViolationStats {
  totalViolations: number
  byType: Record<string, number>
  byUser: Array<{
    userId: string
    username: string
    realName: string
    violationCount: number
    violationTypes: string[]
  }>
  byDate: Record<string, number>
}

/**
 * 预约趋势接口
 */
export interface IReservationTrend {
  period: string
  reservationCount: number
  cancelCount: number
  noShowCount: number
  successRate: number
}

/**
 * 设备使用统计接口
 */
export interface IDeviceUsageStats {
  deviceType: 'web' | 'mobile' | 'wechat'
  userCount: number
  sessionCount: number
  avgSessionDuration: number
  usagePercentage: number
}

/**
 * 导出数据格式接口
 */
export interface IExportData {
  type: 'room-usage' | 'user-activity' | 'violations' | 'time-slot' | 'college-distribution'
  format: 'csv' | 'excel' | 'json'
  startDate: string
  endDate: string
  fileName: string
  data: any[]
}

/**
 * 图表数据格式接口
 */
export interface IChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
    fill?: boolean
    tension?: number
  }>
}

/**
 * 仪表板卡片数据接口
 */
export interface IDashboardCard {
  title: string
  value: number | string
  icon: string
  color: string
  change?: {
    value: number
    isPositive: boolean
  }
  unit?: string
}