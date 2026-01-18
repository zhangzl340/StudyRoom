// 自习室相关API
import { http } from '@/utils/request'
import { handleApiResponse, buildPaginationParams } from './config'
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
    const queryParams = buildPaginationParams(params)
    return handleApiResponse<IRoomListResponse>(
      http.get(`/rooms${queryParams}`)
    )
  },
  
  /**
   * 获取自习室详情
   */
  async getRoom(id: string) {
    return handleApiResponse<IRoom>(
      http.get(`/rooms/${id}`)
    )
  },
  
  /**
   * 创建自习室
   */
  async createRoom(data: ICreateRoomRequest) {
    return handleApiResponse<IRoom>(
      http.post('/rooms', data)
    )
  },
  
  /**
   * 更新自习室
   */
  async updateRoom(id: string, data: IUpdateRoomRequest) {
    return handleApiResponse<IRoom>(
      http.put(`/rooms/${id}`, data)
    )
  },
  
  /**
   * 删除自习室
   */
  async deleteRoom(id: string) {
    return handleApiResponse<void>(
      http.delete(`/rooms/${id}`)
    )
  },
  
  /**
   * 获取自习室座位列表
   */
  async getRoomSeats(roomId: string) {
    return handleApiResponse<ISeat[]>(
      http.get(`/rooms/${roomId}/seats`)
    )
  },
  
  /**
   * 获取自习室布局
   */
  async getRoomLayout(roomId: string) {
    return handleApiResponse<IRoomLayout>(
      http.get(`/rooms/${roomId}/layout`)
    )
  },
  
  /**
   * 更新自习室布局
   */
  async updateRoomLayout(roomId: string, data: IRoomLayout) {
    return handleApiResponse<IRoomLayout>(
      http.put(`/rooms/${roomId}/layout`, data)
    )
  },
  
  /**
   * 获取自习室实时状态
   */
  async getRoomRealTimeStatus(roomId: string) {
    return handleApiResponse<IRoomRealTimeStatus>(
      http.get(`/rooms/${roomId}/status`)
    )
  },
  
  /**
   * 获取所有自习室实时状态
   */
  async getAllRoomsRealTimeStatus() {
    return handleApiResponse<IRoomRealTimeStatus[]>(
      http.get('/rooms/status/all')
    )
  },
  
  /**
   * 批量导入座位
   */
  async importSeats(roomId: string, seats: Partial<ISeat>[]) {
    return handleApiResponse<ISeat[]>(
      http.post(`/rooms/${roomId}/seats/import`, { seats })
    )
  },
  
  /**
   * 获取可用的自习室
   */
  async getAvailableRooms(startTime: string, endTime: string) {
    return handleApiResponse<IRoom[]>(
      http.get('/rooms/available', { params: { startTime, endTime } })
    )
  },
  
  /**
   * 搜索自习室
   */
  async searchRooms(keyword: string) {
    return handleApiResponse<IRoom[]>(
      http.get('/rooms/search', { params: { keyword } })
    )
  }
}