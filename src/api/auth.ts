// 认证相关API
import { http } from '@/utils/request'
import { handleApiResponse, API_CONFIG } from './config'
import type {
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
  IUser,
  IUpdateUserRequest,
  IChangePasswordRequest
} from '@/types/user.types'
import type { IApiResponse } from '@/types/api.types'

/**
 * 认证相关API
 */
export const authApi = {
  /**
   * 用户登录
   */
  async login(data: ILoginRequest) {
    return handleApiResponse<IApiResponse<ILoginResponse>>(
      http.post(`auth/login`, data)
    )
  },
  
  /**
   * 用户注册
   */
  async register(data: IRegisterRequest) {
    return handleApiResponse<IApiResponse<IUser>>(
      http.post(`auth/register`, data)
    )
  },
  
  /**
   * 用户登出
   */
  async logout() {
    return handleApiResponse<IApiResponse<void>>(
      http.post(`auth/logout`)
    )
  },
  
  /**
   * 获取当前用户信息
   */
  async getCurrentUser() {
    return handleApiResponse<IApiResponse<IUser>>(
      http.get(`auth/me`)
    )
  },
  
  /**
   * 刷新Token
   */
  async refreshToken(refreshToken: string) {
    return handleApiResponse<IApiResponse<ILoginResponse>>(
      http.post(`auth/refresh`, { refreshToken })
    )
  },
  
  /**
   * 修改用户信息
   */
  async updateUserInfo(data: IUpdateUserRequest) {
    return handleApiResponse<IApiResponse<IUser>>(
      http.put(`auth/profile`, data)
    )
  },
  
  /**
   * 修改密码
   */
  async changePassword(data: IChangePasswordRequest) {
    return handleApiResponse<IApiResponse<void>>(
      http.post(`auth/change-password`, data)
    )
  },
  
  /**
   * 获取验证码
   */
  async getCaptcha() {
    return handleApiResponse<IApiResponse<{ captchaKey: string; captchaImage: string }>>(
      http.get(`auth/captcha`)
    )
  },
  
  /**
   * 重置密码请求
   */
  async requestResetPassword(email: string) {
    return handleApiResponse<IApiResponse<void>>(
      http.post(`auth/reset-password/request`, null, {
        params: { email }
      })
    )
  },
  
  /**
   * 重置密码
   */
  async resetPassword(token: string, newPassword: string) {
    return handleApiResponse<IApiResponse<void>>(
      http.post(`auth/reset-password`, null, {
        params: { token, newPassword }
      })
    )
  },
  
  /**
   * 实名认证
   */
  async verifyIdentity(data: any) {
    return handleApiResponse<IApiResponse<any>>(
      http.post(`auth/verify-identity`, data)
    )
  }
}