import Mock from 'mockjs';
import type { IUser, ILoginRequest, IRegisterRequest } from '@/types/user.types';
import type { IRoom, ISeat } from '@/types/room.types';
import type { IReservation, ICreateReservationRequest } from '@/types/reservation.types';

// 模拟用户数据
export const mockUser: IUser = {
  id: '1001',
  username: '20230001', // 学号
  name: '张三',
  email: 'zhangsan@test.com',
  phone: '13800138000',
  role: 'student'
};

// 模拟自习室数据
export const mockRooms: IRoom[] = [
  {
    id: '1',
    name: '第一自习室',
    code: 'A01',
    building: '图书馆',
    floor: '3',
    capacity: 50,
    availableSeats: 32,
    status: 'open',
    openTime: '08:00',
    closeTime: '22:00',
    features: ['wifi', 'air_conditioner', 'power_sockets'],
    isActive: true
  },
  {
    id: '2',
    name: '第二自习室',
    code: 'B01',
    building: '教学楼A栋',
    floor: '5',
    capacity: 30,
    availableSeats: 8,
    status: 'open',
    openTime: '07:00',
    closeTime: '23:00',
    features: ['wifi', 'quiet_zone'],
    isActive: true
  },
  {
    id: '3',
    name: '第三自习室',
    code: 'C01',
    building: '综合楼',
    floor: '2',
    capacity: 20,
    availableSeats: 0,
    status: 'maintenance',
    openTime: '08:00',
    closeTime: '22:00',
    features: ['power_sockets'],
    isActive: false
  }
];

// 模拟座位数据（对应第一自习室）
export const mockSeats: ISeat[] = Mock.mock({
  'list|20': [
    {
      id: '@id',
      roomId: '1',
      seatNumber: function() {
        const row = String.fromCharCode(65 + Math.floor(this.id % 5)); // A-E行
        const col = Math.floor(this.id / 5) + 1; // 1-4列
        return `${row}${col}`;
      },
      status: function() {
        // 随机状态：70% available，20% occupied，10% broken
        const rand = Math.random();
        return rand < 0.7 ? 'available' : rand < 0.9 ? 'occupied' : 'broken';
      },
      positionX: function() { return Math.floor(this.id % 5) * 80 + 40; },
      positionY: function() { return Math.floor(this.id / 5) * 80 + 40; },
      type: function() {
        return this.id % 10 === 0 ? 'vip' : this.id % 15 === 0 ? 'disabled' : 'normal';
      }
    }
  ]
}).list;

// 模拟预约数据
export const mockReservations: IReservation[] = [
  {
    id: '10001',
    userId: mockUser.id,
    roomId: '1',
    seatId: mockSeats[0].id,
    date: Mock.mock('@date("yyyy-MM-dd")'),
    startTime: '09:00',
    endTime: '12:00',
    status: 'confirmed',
    roomName: '第一自习室',
    seatNumber: mockSeats[0].seatNumber
  },
  {
    id: '10002',
    userId: mockUser.id,
    roomId: '2',
    seatId: mockSeats[5].id,
    date: Mock.mock('@date("yyyy-MM-dd")'),
    startTime: '14:00',
    endTime: '18:00',
    status: 'pending',
    roomName: '第二自习室',
    seatNumber: mockSeats[5].seatNumber
  },
  {
    id: '10003',
    userId: mockUser.id,
    roomId: '1',
    seatId: mockSeats[10].id,
    date: Mock.mock('@date("yyyy-MM-dd")'),
    startTime: '08:00',
    endTime: '10:00',
    status: 'completed',
    roomName: '第一自习室',
    seatNumber: mockSeats[10].seatNumber
  },
  {
    id: '10004',
    userId: mockUser.id,
    roomId: '1',
    seatId: mockSeats[3].id,
    date: Mock.mock('@date("yyyy-MM-dd")'),
    startTime: '15:00',
    endTime: '17:00',
    status: 'cancelled',
    roomName: '第一自习室',
    seatNumber: mockSeats[3].seatNumber
  }
];

// 模拟验证码数据（替换截断的base64，用极简占位）
export const mockCaptcha = {
  captcha: "6500",
  captchaImage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIj4gPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0id2hpdGUiLz4gPHRleHQgeD0iMTAwIiB5PSI1NSIgZm9udC1zaXplPSIyOCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIj42NTAwPC90ZXh0PiA8L3N2Zz4='
};

// 模拟签到相关的预约详情（带签到状态）
export const mockCheckInReservation = {
  ...mockReservations[0],
  status: 'confirmed', // 可切换为 checked_in/temporary_leave 测试不同状态
  checkInTime: '',
  checkOutTime: ''
};