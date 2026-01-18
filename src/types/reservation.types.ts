// 预约相关类型
/**
 * 预约状态枚举
 */
import { SeatStatus } from "./room.types"

export enum ReservationStatus {
  PENDING = 'pending',        // 待开始
  CHECKED_IN = 'checked_in',  // 已签到
  CHECKED_OUT = 'checked_out', // 已签退
  CANCELLED = 'cancelled',    // 已取消
  EXPIRED = 'expired',        // 已过期
  VIOLATED = 'violated'       // 违规
}

/**
 * 签到方式枚举
 */
export enum CheckInMethod {
  QR_CODE = 'qr_code',
  FACE_RECOGNITION = 'face_recognition',
  MANUAL = 'manual'
}

/**
 * 违规类型枚举
 */
export enum ViolationType {
  NO_SHOW = 'no_show',              // 预约未到
  LATE_CHECK_IN = 'late_check_in',  // 迟到
  LATE_CHECK_OUT = 'late_check_out', // 晚退
  EARLY_CHECK_OUT = 'early_check_out', // 早退
  EXCEED_TIME = 'exceed_time',      // 超时使用
  ILLEGAL_OCCUPY = 'illegal_occupy' // 非法占用
}

/**
 * 预约基本信息接口
 */
export interface IReservationBase {
  id: string
  userId: string
  roomId: string
  seatId: string
  startTime: string
  endTime: string
}

/**
 * 预约详细信息接口
 */
export interface IReservation extends IReservationBase {
  status: ReservationStatus
  checkInTime?: string
  checkOutTime?: string
  checkInMethod?: CheckInMethod
  actualStartTime?: string
  actualEndTime?: string
  totalDuration: number
  actualDuration?: number
  violationType?: ViolationType
  violationPenalty?: number
  notes?: string
  createdAt: string
  updatedAt: string
  
  // 关联信息（可选，通常由后端返回）
  user?: {
    id: string
    username: string
    realName: string
    studentId?: string
  }
  room?: {
    id: string
    name: string
    building: string
    floor: string
  }
  seat?: {
    id: string
    seatNumber: string
    type: string
  }
}

/**
 * 创建预约请求参数
 */
export interface ICreateReservationRequest {
  seatId: string
  startTime: string
  endTime: string
  notes?: string
}

/**
 * 修改预约请求参数
 */
export interface IUpdateReservationRequest {
  startTime?: string
  endTime?: string
  notes?: string
}

/**
 * 预约查询参数接口
 */
export interface IReservationQueryParams {
  page?: number
  pageSize?: number
  userId?: string
  roomId?: string
  seatId?: string
  status?: ReservationStatus | ReservationStatus[]
  date?: string  // 查询指定日期的预约
  startDate?: string
  endDate?: string
  withDetails?: boolean  // 是否包含关联信息
  orderBy?: 'createdAt' | 'startTime' | 'endTime'
  order?: 'asc' | 'desc'
}

/**
 * 预约列表响应接口
 */
export interface IReservationListResponse {
  list: IReservation[]
  total: number
  page: number
  pageSize: number
}

/**
 * 签到请求参数
 */
export interface ICheckInRequest {
  reservationId: string
  checkInMethod: CheckInMethod
  location?: {
    latitude: number
    longitude: number
  }
}

/**
 * 签退请求参数
 */
export interface ICheckOutRequest {
  reservationId: string
  location?: {
    latitude: number
    longitude: number
  }
}

/**
 * 暂时离开请求参数
 */
export interface ITempLeaveRequest {
  reservationId: string
  duration: number  // 离开时长（分钟）
}

/**
 * 返回座位请求参数
 */
export interface IReturnSeatRequest {
  reservationId: string
}

/**
 * 座位状态变更消息（用于WebSocket推送）
 */
export interface ISeatStatusMessage {
  type: 'seat_status_update'
  seatId: string
  roomId: string
  status: SeatStatus
  reservationId?: string
  userId?: string
  timestamp: string
}

/**
 * 预约冲突检查响应
 */
export interface IReservationConflictCheck {
  hasConflict: boolean
  conflictingReservations?: IReservation[]
  availableTimeSlots?: Array<{
    startTime: string
    endTime: string
  }>
}