//用户相关类型
/**
 * 用户角色枚举
 */
export enum UserRole {
  STUDENT = 'student',
  ROOM_ADMIN = 'room_admin',
  ACADEMIC_ADMIN = 'academic_admin'
}

/**
 * 用户状态枚举
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

/**
 * 用户基本信息接口
 */
export interface IUserBase {
  id: string
  username: string
  realName: string
  email: string
  phone?: string
  studentId?: string
  avatar?: string
  college?: string
  major?: string
  grade?: string
  className?: string
}

/**
 * 用户详细信息接口
 */
export interface IUser extends IUserBase {
  role: UserRole
  status: UserStatus
  creditScore: number
  reservationCount: number
  totalUsageHours: number
  lastLoginTime?: string
  createdAt: string
  updatedAt: string
}

/**
 * 登录请求参数接口
 */
export interface ILoginRequest {
  username: string
  password: string
  captcha?: string
}

/**
 * 登录响应数据接口
 */
export interface ILoginResponse {
  token: string
  tokenType: string
  expiresIn: number
  user: IUser
}

/**
 * 注册请求参数接口
 */
export interface IRegisterRequest {
  username: string
  password: string
  realName: string
  email: string
  phone?: string
  studentId: string
  college: string
}

/**
 * 修改用户信息请求参数
 */
export interface IUpdateUserRequest {
  realName?: string
  email?: string
  phone?: string
  avatar?: string
  college?: string
  major?: string
  grade?: string
}

/**
 * 修改密码请求参数
 */
export interface IChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

/**
 * 用户查询参数接口
 */
export interface IUserQueryParams {
  page?: number
  pageSize?: number
  username?: string
  realName?: string
  studentId?: string
  college?: string
  role?: UserRole
  status?: UserStatus
  startDate?: string
  endDate?: string
}

/**
 * 用户列表响应接口
 */
export interface IUserListResponse {
  list: IUser[]
  total: number
  page: number
  pageSize: number
}