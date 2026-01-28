// src/api/checkIn.api.ts
import { http } from '@/utils/request';
import { handleApiResponse, API_CONFIG } from './config';
import type { IApiResponse } from '@/types/api.types';

// 签到请求参数
export interface ICheckInRequest {
  reservationId: number;
  seatId?: number;
  roomId?: number;
  checkInMethod: 'qr_code' | 'face_recognition' | 'manual'; // 签到方式：二维码/人脸识别/手动
  deviceInfo?: string;
  ipAddress?: string;
}

// 暂离/返回请求参数
export interface ILeaveRequest {
  reservationId: number;
}

// 签退请求参数
export interface ICheckOutRequest {
  checkInId: number;
  remarks?: string;
}

// 签到相关API
export const checkInApi = {
  /**
   * 签到
   */
  async checkIn(data: ICheckInRequest) {
    return handleApiResponse<IApiResponse<any>>(
      http.post(`student/checkin/in`, data)
    );
  },

  /**
   * 签退
   */
  async checkOut(data: ICheckOutRequest) {
    return handleApiResponse<IApiResponse<void>>(
      http.post(`student/checkin/out`, data)
    );
  },

  /**
   * 暂离
   */
  async temporaryLeave(data: ILeaveRequest) {
    return handleApiResponse<IApiResponse<void>>(
      http.post(`student/checkin/leave`, data)
    );
  },

  /**
   * 暂离返回
   */
  async backFromLeave(data: ILeaveRequest) {
    return handleApiResponse<IApiResponse<void>>(
      http.post(`student/checkin/return`, data)
    );
  },

  /**
   * 获取签到记录详情
   */
  async getCheckInRecordDetail(id: number) {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`student/checkin/detail/${id}`)
    );
  },

  /**
   * 获取用户签到记录
   */
  async getUserCheckInRecords() {
    return handleApiResponse<IApiResponse<any[]>>(
      http.get(`student/checkin/list`)
    );
  },

  /**
   * 获取当前签到信息
   */
  async getCurrentCheckIn() {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`student/checkin/current`)
    );
  },

  /**
   * 生成签到二维码
   */
  async generateCheckInQRCode(reservationId: number) {
    return handleApiResponse<IApiResponse<any>>(
      http.get(`student/checkin/qrcode`, {
        params: { reservationId }
      })
    );
  },

  /**
   * 验证签到二维码
   */
  async verifyCheckInQRCode(qrCode: string) {
    return handleApiResponse<IApiResponse<boolean>>(
      http.post(`student/checkin/verify-qrcode`, null, {
        params: { qrCode }
      })
    );
  }
};

export default checkInApi;