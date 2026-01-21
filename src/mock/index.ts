import MockAdapter from 'axios-mock-adapter';
import request from '@/utils/request';
import { mockUser, mockRooms, mockSeats, mockReservations, mockCaptcha, mockCheckInReservation } from './student.mock';
import Mock from 'mockjs';

// 创建 Mock 适配器实例
const mock = new MockAdapter(request);

// ====================== 通用接口拦截 ======================
// 登录接口（学生）
mock.onPost('/api/auth/login').reply((config) => {
  const { username, password, captchaCode } = JSON.parse(config.data);
  // 模拟登录验证（任意账号密码+验证码1234即可登录）
  if (captchaCode === '1234') {
    return [200, {
      code: 200,
      message: '登录成功',
      data: {
        token: Mock.mock('@guid'), // 模拟token
        userInfo: mockUser
      }
    }];
  } else {
    return [200, {
      code: 400,
      message: '验证码错误',
      data: null
    }];
  }
});

// 获取验证码接口
mock.onGet('/auth/captcha').reply(() => {
  return [200, {
    data: mockCaptcha
  }];
});

// ====================== 自习室/座位接口拦截 ======================
// 获取自习室列表
mock.onGet('/rooms1').reply(() => {
  return [200, {
    code: 200,
    message: 'success',
    data: mockRooms
  }];
});

// 获取自习室座位
mock.onGet(/\/student\/rooms\/\d+\/seats/).reply(() => {
  return [200, {
    code: 200,
    message: 'success',
    data: mockSeats
  }];
});

// ====================== 预约接口拦截 ======================
// 创建预约
mock.onPost('/student/reservations').reply((config) => {
  const reservationData = JSON.parse(config.data);
  const newReservation = {
    id: Mock.mock('@id'),
    userId: mockUser.id,
    ...reservationData,
    status: 'pending',
    roomName: mockRooms.find(r => r.id === reservationData.roomId)?.name || '未知自习室',
    seatNumber: mockSeats.find(s => s.id === reservationData.seatId)?.seatNumber || '未知座位'
  };
  return [200, {
    code: 200,
    message: '预约创建成功',
    data: newReservation
  }];
});

// 获取我的预约列表（支持分页/筛选）
mock.onGet('/student/reservations/my').reply((config) => {
  return [200, {
    code: 200,
    message: 'success',
    data: {
      list: mockReservations,
      total: mockReservations.length,
      pageNum: 1,
      pageSize: 10
    }
  }];
});

// 获取预约详情
mock.onGet(/\/student\/reservations\/\w+/).reply(() => {
  return [200, {
    code: 200,
    message: 'success',
    data: mockCheckInReservation
  }];
});

// 取消预约
mock.onPost(/\/student\/reservations\/\w+\/cancel/).reply(() => {
  return [200, {
    code: 200,
    message: '取消预约成功',
    data: null
  }];
});

// ====================== 签到接口拦截 ======================
// 签到
mock.onPost('/student/check-in').reply(() => {
  return [200, {
    code: 200,
    message: '签到成功',
    data: { status: 'checked_in' }
  }];
});

// 暂离
mock.onPost('/student/check-in/temporary-leave').reply(() => {
  return [200, {
    code: 200,
    message: '暂离申请成功',
    data: { status: 'temporary_leave' }
  }];
});

// 暂离返回
mock.onPost('/student/check-in/back').reply(() => {
  return [200, {
    code: 200,
    message: '返回座位成功',
    data: { status: 'checked_in' }
  }];
});

// 签退
mock.onPost('/student/check-in/out').reply(() => {
  return [200, {
    code: 200,
    message: '签退成功',
    data: { status: 'completed' }
  }];
});

export default mock;