// src/api/checkIn.api.ts
import request from '@/utils/request';

// 签到请求参数
export interface ICheckInRequest {
  reservationId: string;
  verifyType: 'qrcode' | 'face'; // 验证类型：扫码/人脸识别
  verifyCode: string; // 二维码内容/人脸识别标识
}

// 暂离/返回请求参数
export interface ILeaveRequest {
  reservationId: string;
}

// 签到
export const checkIn = (data: ICheckInRequest) => {
  return request({
    url: '/student/check-in',
    method: 'post',
    data
  });
};

// 暂离
export const temporaryLeave = (data: ILeaveRequest) => {
  return request({
    url: '/student/check-in/temporary-leave',
    method: 'post',
    data
  });
};

// 暂离返回
export const backFromLeave = (data: ILeaveRequest) => {
  return request({
    url: '/student/check-in/back',
    method: 'post',
    data
  });
};

// 签退
export const checkOut = (data: ILeaveRequest) => {
  return request({
    url: '/student/check-in/out',
    method: 'post',
    data
  });
};