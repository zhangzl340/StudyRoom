// 自习室相关API
import { http } from '@/utils/request'
import { handleApiResponse, buildPaginationParams, API_CONFIG } from './config'
import type {
  IRoom,
  IRoomListResponse,
  IRoomQueryParams,
  ISeat,
  IRoomLayout,
  IRoomRealTimeStatus,
  ICreateRoomRequest,
  IUpdateRoomRequest
} from '@/types/room.types'

/**
 * 自习室相关API
 */
export const roomApi = {
  /**
   * 获取自习室列表
   */
  async getRooms(params?: IRoomQueryParams) {
    return handleApiResponse<IRoomListResponse>(
      http.get(`room/list`, { params })
    )
  },
  
  /**
   * 获取自习室详情
   */
  async getRoom(id: string) {
    return handleApiResponse<IRoom>(
      http.get(`room/detail/${id}`)
    )
  },
  
  /**
   * 创建自习室
   */
  async createRoom(data: ICreateRoomRequest) {
    return handleApiResponse<void>(
      http.post(`admin/room/create`, data)
    )
  },
  
  /**
   * 更新自习室
   */
  async updateRoom(id: string, data: IUpdateRoomRequest) {
    return handleApiResponse<void>(
      http.put(`admin/room/update/${id}`, data)
    )
  },
  
  /**
   * 删除自习室
   */
  async deleteRoom(id: string) {
    return handleApiResponse<void>(
      http.delete(`admin/room/delete/${id}`)
    )
  },
  
  /**
   * 更新自习室状态
   */
  async updateRoomStatus(id: string, status: number) {
    return handleApiResponse<void>(
      http.put(`admin/room/status/${id}`, null, {
        params: { status }
      })
    )
  },
  
  /**
   * 获取自习室座位列表
   */
  async getRoomSeats(roomId: string) {
    return handleApiResponse<ISeat[]>(
      http.get(`room/${roomId}/seats`)
    )
  },
  
  /**
   * 获取自习室可用座位
   */
  async getAvailableSeats(roomId: string) {
    return handleApiResponse<ISeat[]>(
      http.get(`room/${roomId}/available-seats`)
    )
  },
  
  /**
   * 获取自习室统计信息
   */
  async getSeatStatistics(roomId: string) {
    return handleApiResponse<Record<string, any>>(
      http.get(`room/${roomId}/seat-statistics`)
    )
  },
  
  /**
   * 获取自习室布局
   */
  async getRoomLayout(roomId: string) {
    return handleApiResponse<IRoomLayout>(
      http.get(`admin/seat/layout/${roomId}`)
    )
  },
  
  /**
   * 更新自习室布局
   */
  async updateRoomLayout(roomId: string, data: IRoomLayout) {
    return handleApiResponse<IRoomLayout>(
      http.put(`admin/seat/layout`, { roomId, ...data })
    )
  },
  
  /**
   * 获取自习室实时状态
   */
  async getRoomRealTimeStatus(roomId: string) {
    return handleApiResponse<IRoomRealTimeStatus>(
      http.get(`room/status/${roomId}`)
    )
  },
  
  /**
   * 获取所有自习室实时状态
   */
  async getAllRoomsRealTimeStatus() {
    return handleApiResponse<IRoomRealTimeStatus[]>(
      http.get(`room/list`)
    )
  },
  
  /**
   * 批量导入座位
   */
  async importSeats(roomId: string, seats: Partial<ISeat>[]) {
    return handleApiResponse<ISeat[]>(
      http.post(`admin/seat/import`, { roomId, seats })
    )
  },
  
  /**
   * 获取可用的自习室
   */
  async getAvailableRooms() {
    return handleApiResponse<IRoom[]>(
      http.get(`room/available`)
    )
  },
  
  /**
   * 搜索自习室
   */
  async searchRooms(keyword: string) {
    return handleApiResponse<IRoom[]>(
      http.get(`room/list`, { params: { keyword } })
    )
  }
}