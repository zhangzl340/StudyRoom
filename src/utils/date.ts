import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'

// 配置dayjs
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
dayjs.extend(duration)

/**
 * 格式化日期时间
 */
export const formatDateTime = (
  date: string | Date | number,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string => {
  return dayjs(date).format(format)
}

/**
 * 格式化日期
 */
export const formatDate = (
  date: string | Date | number,
  format: string = 'YYYY-MM-DD'
): string => {
  return dayjs(date).format(format)
}

/**
 * 格式化时间
 */
export const formatTime = (
  date: string | Date | number,
  format: string = 'HH:mm'
): string => {
  return dayjs(date).format(format)
}

/**
 * 获取相对时间（如：3分钟前）
 */
export const fromNow = (date: string | Date | number): string => {
  return dayjs(date).fromNow()
}

/**
 * 获取日期范围
 */
export const getDateRange = (
  startDate: string | Date,
  endDate: string | Date,
  format: string = 'YYYY-MM-DD'
): string => {
  const start = dayjs(startDate).format(format)
  const end = dayjs(endDate).format(format)
  return `${start} - ${end}`
}

/**
 * 计算时间间隔（小时）
 */
export const getDurationHours = (
  startTime: string | Date,
  endTime: string | Date
): number => {
  const start = dayjs(startTime)
  const end = dayjs(endTime)
  return end.diff(start, 'hour', true) // 保留小数
}

/**
 * 计算时间间隔（分钟）
 */
export const getDurationMinutes = (
  startTime: string | Date,
  endTime: string | Date
): number => {
  const start = dayjs(startTime)
  const end = dayjs(endTime)
  return end.diff(start, 'minute')
}

/**
 * 格式化持续时间
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (remainingMinutes === 0) {
    return `${hours}小时`
  }
  
  return `${hours}小时${remainingMinutes}分钟`
}

/**
 * 获取今天的日期（YYYY-MM-DD格式）
 */
export const getToday = (): string => {
  return dayjs().format('YYYY-MM-DD')
}

/**
 * 获取明天的日期
 */
export const getTomorrow = (): string => {
  return dayjs().add(1, 'day').format('YYYY-MM-DD')
}

/**
 * 获取一周后的日期
 */
export const getNextWeek = (): string => {
  return dayjs().add(7, 'day').format('YYYY-MM-DD')
}

/**
 * 检查日期是否是今天
 */
export const isToday = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs(), 'day')
}

/**
 * 检查日期是否是明天
 */
export const isTomorrow = (date: string | Date): boolean => {
  return dayjs(date).isSame(dayjs().add(1, 'day'), 'day')
}

/**
 * 获取时间段数组
 */
export const getTimeSlots = (
  startTime: string,  // 格式: "08:00"
  endTime: string,    // 格式: "22:00"
  interval: number = 30  // 分钟间隔
): string[] => {
  const slots: string[] = []
  let current = dayjs(`2000-01-01 ${startTime}`)
  const end = dayjs(`2000-01-01 ${endTime}`)
  
  while (current.isBefore(end)) {
    slots.push(current.format('HH:mm'))
    current = current.add(interval, 'minute')
  }
  
  return slots
}

/**
 * 合并日期和时间
 */
export const combineDateTime = (date: string, time: string): Date => {
  return dayjs(`${date} ${time}`).toDate()
}

export default dayjs