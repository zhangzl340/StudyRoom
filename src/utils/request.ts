import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError
} from 'axios'
import { useAuthStore } from '@/stores/auth.store'
import router from '@/router'

// 环境变量
const isDev = import.meta.env.DEV
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const REQUEST_TIMEOUT = parseInt(import.meta.env.VITE_REQUEST_TIMEOUT || '10000')

// 定义请求取消的Map
const cancelTokenMap = new Map<string, AbortController>()

// 定义缓存的Map
const cacheMap = new Map<string, { data: any; timestamp: number }>()

// 缓存过期时间（毫秒）
const CACHE_EXPIRY = 5 * 60 * 1000 // 5分钟

// 重试次数
const MAX_RETRY_COUNT = 3

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 生成请求key
const generateRequestKey = (config: InternalAxiosRequestConfig): string => {
  const { url, method, params, data } = config
  return `${method || 'GET'}_${url}_${JSON.stringify(params || {})}_${JSON.stringify(data || {})}`
}

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()
    
    // 生成请求key
    const requestKey = generateRequestKey(config)
    
    // 取消之前的相同请求
    if (cancelTokenMap.has(requestKey)) {
      const controller = cancelTokenMap.get(requestKey)
      controller?.abort()
      cancelTokenMap.delete(requestKey)
    }
    
    // 创建新的AbortController
    const controller = new AbortController()
    config.signal = controller.signal
    cancelTokenMap.set(requestKey, controller)
    
    // 添加认证token
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    
    // 添加请求时间戳，防止缓存
    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    // 开发环境打印请求信息
    if (isDev) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`)
      if (config.params) {
        console.log('📋 Params:', config.params)
      }
      if (config.data) {
        console.log('📦 Data:', config.data)
      }
    }
    
    return config
  },
  (error: AxiosError) => {
    if (isDev) {
      console.error('❌ 请求发送失败:', error)
    }
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { config, data } = response
    
    // 生成请求key
    const requestKey = generateRequestKey(config as InternalAxiosRequestConfig)
    
    // 从取消token map中删除
    cancelTokenMap.delete(requestKey)
    
    // 开发环境打印响应信息
    if (isDev) {
      console.log(`✅ ${config.method?.toUpperCase()} ${config.url} 响应成功`)
      console.log('📬 Response:', data)
    }
    
    // 如果返回的是API响应格式
    if (data && typeof data === 'object' && 'code' in data) {
      const { code, message } = data
      
      // 处理成功响应
      if (code === 200) {
        return data
      }
      
      // 处理认证错误
      if (code === 401) {
        const authStore = useAuthStore()
        authStore.logout()
        
        // 跳转到登录页
        router.push({
          name: 'Login',
          query: { redirect: router.currentRoute.value.fullPath }
        })
        
        return Promise.reject(new Error('认证已过期，请重新登录'))
      }
      
      // 处理其他业务错误
      return Promise.reject(new Error(message || '请求失败'))
    }
    
    // 如果不是标准格式，直接返回原始数据
    return data
  },
  async (error: AxiosError) => {
    // 生成请求key
    if (error.config) {
      const requestKey = generateRequestKey(error.config as InternalAxiosRequestConfig)
      cancelTokenMap.delete(requestKey)
    }
    
    // 开发环境打印错误信息
    if (isDev) {
      console.error('❌ 响应错误:', error)
    }
    
    // 处理请求取消
    if (error.name === 'AbortError') {
      return Promise.reject(new Error('请求已取消'))
    }
    
    // 处理重试逻辑
    if (error.config && error.config.headers) {
      const retryCount = (error.config.headers['X-Retry-Count'] as number) || 0
      
      if (retryCount < MAX_RETRY_COUNT && 
          (error.code === 'ECONNABORTED' || 
           error.code === 'ETIMEDOUT' || 
           error.code === 'ENETUNREACH')) {
        
        error.config.headers['X-Retry-Count'] = retryCount + 1
        
        if (isDev) {
          console.log(`🔄 重试请求 (${retryCount + 1}/${MAX_RETRY_COUNT}): ${error.config.url}`)
        }
        
        // 延迟重试
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)))
        return service(error.config)
      }
    }
    
    // 处理HTTP错误
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          error.message = '请求参数错误'
          break
        case 401:
          error.message = '认证已过期，请重新登录'
          
          const authStore = useAuthStore()
          authStore.logout()
          
          // 跳转到登录页
          router.push({
            name: 'Login',
            query: { redirect: router.currentRoute.value.fullPath }
          })
          break
        case 403:
          error.message = '没有操作权限'
          break
        case 404:
          error.message = '请求的资源不存在'
          break
        case 500:
          error.message = '服务器内部错误'
          break
        case 502:
          error.message = '网关错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网关超时'
          break
        default:
          error.message = `连接错误 ${status}`
      }
      
      // 如果有业务错误消息，使用业务消息
      if (data && typeof data === 'object' && data.message) {
        error.message = data.message
      }
    } else if (error.request) {
      error.message = '网络连接异常，请检查网络'
    } else {
      error.message = '请求发送失败'
    }
    
    return Promise.reject(error)
  }
)

// 定义请求方法
export const http = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },
  
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config)
  },
  
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config)
  },
  
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  },
  
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.patch(url, data, config)
  },
  
  // 取消请求
  cancelRequest(url: string): void {
    for (const [key, controller] of cancelTokenMap.entries()) {
      if (key.includes(url)) {
        controller.abort()
        cancelTokenMap.delete(key)
      }
    }
  },
  
  // 取消所有请求
  cancelAllRequests(): void {
    for (const controller of cancelTokenMap.values()) {
      controller.abort()
    }
    cancelTokenMap.clear()
    if (isDev) {
      console.log('🧹 已取消所有请求')
    }
  },
  
  // 清除缓存
  clearCache(): void {
    cacheMap.clear()
    if (isDev) {
      console.log('🧹 已清除所有缓存')
    }
  }
}

// 导出service
export default service