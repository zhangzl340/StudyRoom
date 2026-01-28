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
  username: string
  realName: string
  nickname?: string
  email: string
  phone?: string
  studentId?: string
  avatar?: string
  college?: string
  major?: string
  grade?: string
  className?: string
  gender?: number
}

/**
 * 用户详细信息接口
 */
export interface IUser extends IUserBase {
  id: number
  role: string
  roleType: string
  status: number
  creditScore: number
  identityStatus: number
  lastLoginIp?: string
  lastLoginTime?: string
  createTime?: string
  createdAt: string
  updatedAt: string
}

/**
 * 登录请求参数接口
 */
export interface ILoginRequest {
  username: string
  password: string
  captchaCode: string
  captchaKey: string
}

/**
 * 登录响应数据接口
 */
export interface ILoginResponse {
  token: string
  tokenType: string
  refreshToken: string
  expiresIn: number
  userInfo: IUser
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