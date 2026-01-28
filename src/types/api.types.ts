// API响应类型
/**
 * 基础API响应接口
 */
export interface IApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
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
  timestamp: number
}

/**
 * 错误码枚举
 */
export enum ErrorCode {
  // ================== 通用错误码 ==================
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,

  // ================== 认证相关错误码 ==================
  LOGIN_FAILED = 10001,
  ACCOUNT_DISABLED = 10002,
  ACCOUNT_LOCKED = 10003,
  ACCOUNT_EXPIRED = 10004,
  CREDENTIALS_EXPIRED = 10005,
  TOKEN_EXPIRED = 10006,
  TOKEN_INVALID = 10007,
  CAPTCHA_ERROR = 10008,
  CAPTCHA_EXPIRED = 10009,
  USER_NOT_EXIST = 10010,
  PASSWORD_ERROR = 10011,
  OLD_PASSWORD_ERROR = 10012,
  USER_EXISTS = 10013,
  USER_NOT_FOUND = 10015,
  USERNAME_ALREADY_EXISTS = 10016,
  STUDENT_ID_ALREADY_EXISTS = 10017,
  EMAIL_ALREADY_EXISTS = 10018,
  PHONE_ALREADY_EXISTS = 10019,
  PASSWORD_SAME = 10020,
  IDENTITY_NOT_VERIFIED = 10014,
  ADMIN_INSERT_ERROR = 10015,
  USER_INSERT_ERROR = 10015,
  ADMIN_UPDATE_ERROR = 10016,

  // ================== 业务相关错误码 ==================
  ROOM_NOT_FOUND = 20001,
  ROOM_DISABLED = 20002,
  SEAT_NOT_FOUND = 20003,
  SEAT_UNAVAILABLE = 20004,
  RESERVATION_NOT_FOUND = 20005,
  RESERVATION_CONFLICT = 20006,
  RESERVATION_CANNOT_CANCEL = 20007,
  RESERVATION_EXPIRED = 20008,
  CHECK_IN_FAILED = 20009,
  CHECK_IN_ALREADY = 20010,
  CHECK_OUT_ALREADY = 20011,
  NOT_CHECK_IN = 20012,
  TEMP_LEAVE_NOT_ALLOWED = 20013,
  TEMP_LEAVE_ALREADY = 20014,
  NOT_TEMP_LEAVE = 20015,
  CHECK_IN_TIME_EXPIRED = 20016,
  CREDIT_NOT_ENOUGH = 20017,
  VIOLATION_NOT_FOUND = 20018,

  // ================== 系统相关错误码 ==================
  SYSTEM_ERROR = 30001,
  DATABASE_ERROR = 30002,
  REDIS_ERROR = 30003,
  FILE_UPLOAD_ERROR = 30004,
  FILE_DOWNLOAD_ERROR = 30005,
  EXCEL_EXPORT_ERROR = 30006,
  EXCEL_IMPORT_ERROR = 30007,
  WEBSOCKET_ERROR = 30008,
  EMAIL_SEND_ERROR = 30009,
  SMS_SEND_ERROR = 30010,

  // ================== 参数校验错误码 ==================
  PARAM_VALIDATION_ERROR = 40001,
  PARAM_REQUIRED = 40002,
  PARAM_INVALID = 40003,
  PARAM_OUT_OF_RANGE = 40004,

  // ================== 外部服务错误码 ==================
  EXTERNAL_SERVICE_ERROR = 50001,
  FACE_RECOGNITION_ERROR = 50002,
  QRCODE_GENERATE_ERROR = 50003,
  SMS_SERVICE_ERROR = 50004,

  // ================== 未知错误码 ==================
  UNKNOWN_ERROR = 99999
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