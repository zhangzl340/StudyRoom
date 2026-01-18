//自习室相关类型
/**
 * 自习室状态枚举
 */
export enum RoomStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  MAINTENANCE = 'maintenance'
}

/**
 * 座位状态枚举
 */
export enum SeatStatus {
  AVAILABLE = 'available',      // 可用
  OCCUPIED = 'occupied',        // 占用中
  RESERVED = 'reserved',        // 已预约
  TEMP_LEAVE = 'temp_leave',    // 暂时离开
  MAINTENANCE = 'maintenance',  // 维修中
  DISABLED = 'disabled'         // 已禁用
}

/**
 * 座位类型枚举
 */
export enum SeatType {
  STANDARD = 'standard',    // 标准座位
  WINDOW = 'window',        // 靠窗座位
  POWER = 'power',          // 有电源座位
  LARGE = 'large',          // 宽敞座位
  SILENT = 'silent',        // 静音区座位
  GROUP = 'group'           // 小组讨论座位
}

/**
 * 自习室基本信息接口
 */
export interface IRoomBase {
  id: string
  name: string
  code: string
  building: string
  floor: string
  description?: string
  capacity: number
  availableSeats: number
  openTime: string
  closeTime: string
}

/**
 * 自习室详细信息接口
 */
export interface IRoom extends IRoomBase {
  status: RoomStatus
  features: string[]  // 特性：如['wifi', 'air_conditioner', 'printer']
  imageUrl?: string
  layoutType: 'grid' | 'custom'
  adminIds: string[]
  createdAt: string
  updatedAt: string
}

/**
 * 座位位置信息接口
 */
export interface ISeatPosition {
  row: number
  column: number
  x: number  // 在布局中的x坐标
  y: number  // 在布局中的y坐标
}

/**
 * 座位信息接口
 */
export interface ISeat {
  id: string
  roomId: string
  seatNumber: string
  name?: string
  type: SeatType
  status: SeatStatus
  position: ISeatPosition
  features: string[]  // 座位特性：如['power', 'table_lamp']
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * 自习室布局配置接口
 */
export interface IRoomLayout {
  roomId: string
  rows: number
  columns: number
  cellWidth: number
  cellHeight: number
  gridGap: number
  seats: ISeat[]
}

/**
 * 自习室实时状态接口
 */
export interface IRoomRealTimeStatus {
  roomId: string
  totalSeats: number
  availableSeats: number
  occupiedSeats: number
  reservedSeats: number
  tempLeaveSeats: number
  lastUpdateTime: string
}

/**
 * 自习室查询参数接口
 */
export interface IRoomQueryParams {
  page?: number
  pageSize?: number
  building?: string
  floor?: string
  status?: RoomStatus
  minCapacity?: number
  maxCapacity?: number
  hasFeatures?: string[]  // 需要包含的特性
  searchKey?: string
}

/**
 * 自习室列表响应接口
 */
export interface IRoomListResponse {
  list: IRoom[]
  total: number
  page: number
  pageSize: number
}

/**
 * 创建自习室请求参数
 */
export interface ICreateRoomRequest {
  name: string
  code: string
  building: string
  floor: string
  description?: string
  capacity: number
  openTime: string
  closeTime: string
  features: string[]
  layoutType: 'grid' | 'custom'
}

/**
 * 更新自习室请求参数
 */
export interface IUpdateRoomRequest {
  name?: string
  code?: string
  building?: string
  floor?: string
  description?: string
  capacity?: number
  openTime?: string
  closeTime?: string
  features?: string[]
  status?: RoomStatus
  layoutType?: 'grid' | 'custom'
}