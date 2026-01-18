import type { 
  IUser, 
  IRoom, 
  IReservation,
  UserRole,
  SeatStatus,
  ReservationStatus 
} from '@/types'

// 类型兼容性测试
export const typeTest = {
  user: () => {
    const user: IUser = {
      id: '1',
      username: 'test',
      realName: '测试',
      email: 'test@example.com',
      role: UserRole.STUDENT,
      status: 'active',
      creditScore: 100,
      reservationCount: 0,
      totalUsageHours: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    console.log('用户类型测试通过:', user)
    return user
  },
  
  room: () => {
    const room: IRoom = {
      id: 'room-1',
      name: '101自习室',
      code: 'ROOM-101',
      building: '第一教学楼',
      floor: '1楼',
      capacity: 50,
      availableSeats: 45,
      openTime: '08:00',
      closeTime: '22:00',
      status: 'open',
      features: ['wifi', 'air_conditioner'],
      layoutType: 'grid',
      adminIds: ['admin-1'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    console.log('自习室类型测试通过:', room)
    return room
  },
  
  reservation: () => {
    const reservation: IReservation = {
      id: 'res-1',
      userId: 'user-1',
      roomId: 'room-1',
      seatId: 'seat-1',
      startTime: '2024-10-01T10:00:00Z',
      endTime: '2024-10-01T12:00:00Z',
      status: ReservationStatus.PENDING,
      totalDuration: 120,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    console.log('预约类型测试通过:', reservation)
    return reservation
  }
}

// 在控制台可用
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.$typeTest = typeTest
}