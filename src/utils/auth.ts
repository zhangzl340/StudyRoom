// 认证工具
import { IUser, UserRole } from '@/types/user.types'

/**
 * 保存Token到localStorage
 */
export const saveToken = (token: string): void => {
  localStorage.setItem('access_token', token)
}

/**
 * 获取Token
 */
export const getToken = (): string | null => {
  return localStorage.getItem('access_token')
}

/**
 * 删除Token
 */
export const removeToken = (): void => {
  localStorage.removeItem('access_token')
}

/**
 * 保存用户信息到localStorage
 */
export const saveUserInfo = (user: IUser): void => {
  localStorage.setItem('user_info', JSON.stringify(user))
}

/**
 * 获取用户信息
 */
export const getUserInfo = (): IUser | null => {
  const userStr = localStorage.getItem('user_info')
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch (error) {
      console.error('Failed to parse user info:', error)
      return null
    }
  }
  return null
}

/**
 * 删除用户信息
 */
export const removeUserInfo = (): void => {
  localStorage.removeItem('user_info')
}

/**
 * 清除所有认证信息
 */
export const clearAuth = (): void => {
  removeToken()
  removeUserInfo()
}

/**
 * 检查用户是否登录
 */
export const isLoggedIn = (): boolean => {
  return !!getToken()
}

/**
 * 检查用户是否有指定角色
 */
export const hasRole = (user: IUser | null, roles: UserRole | UserRole[]): boolean => {
  if (!user) return false
  
  if (Array.isArray(roles)) {
    return roles.includes(user.role)
  }
  
  return user.role === roles
}

/**
 * 检查用户是否有管理权限
 */
export const isAdmin = (user: IUser | null): boolean => {
  if (!user) return false
  return user.role === UserRole.ROOM_ADMIN || user.role === UserRole.ACADEMIC_ADMIN
}

/**
 * 检查用户是否是超级管理员
 */
export const isSuperAdmin = (user: IUser | null): boolean => {
  if (!user) return false
  return user.role === UserRole.ACADEMIC_ADMIN
}

/**
 * 从JWT Token中解析Payload
 */
export const parseJwt = (token: string): any => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to parse JWT:', error)
    return null
  }
}

/**
 * 检查Token是否过期
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = parseJwt(token)
  if (!payload || !payload.exp) return true
  
  const currentTime = Math.floor(Date.now() / 1000)
  return payload.exp < currentTime
}