// API响应类型
/**
 * 基础API响应接口
 */
export interface IApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: string
}

/**
 * 分页数据接口
 */
export interface IPaginatedData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * 错误响应接口
 */
export interface IErrorResponse {
  code: number
  message: string
  details?: any
  timestamp: string
}

/**
 * 错误码枚举
 */
export enum ErrorCode {
  SUCCESS = 0,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  VALIDATION_ERROR = 422,
  INTERNAL_ERROR = 500,
  
  // 业务错误码
  USER_NOT_FOUND = 1001,
  USER_DISABLED = 1002,
  INVALID_CREDENTIALS = 1003,
  SEAT_UNAVAILABLE = 2001,
  RESERVATION_CONFLICT = 2002,
  RESERVATION_NOT_FOUND = 2003,
  CHECK_IN_EXPIRED = 2004,
  CHECK_OUT_EARLY = 2005,
  NO_PERMISSION = 3001,
  INVALID_PARAMETER = 3002,
  RATE_LIMIT_EXCEEDED = 3003
}

/**
 * 分页查询参数接口
 */
export interface IPaginationParams {
  page?: number
  pageSize?: number
  orderBy?: string
  order?: 'asc' | 'desc'
}

/**
 * 文件上传响应接口
 */
export interface IUploadResponse {
  url: string
  filename: string
  size: number
  mimeType: string
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
}

/**
 * WebSocket消息类型
 */
export interface IWebSocketMessage<T = any> {
  type: string
  data: T
  timestamp: string
}

/**
 * WebSocket连接状态
 */
export interface IWebSocketStatus {
  isConnected: boolean
  lastConnectedTime?: string
  lastDisconnectedTime?: string
  reconnectAttempts: number
}

export type {ISeatStatusMessage} from './reservation.types'