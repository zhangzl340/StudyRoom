import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import { useAuthStore } from '@/stores/auth.store'

// 由于router还没有完全创建，我们暂时移除router相关代码
// 在router完全创建后，可以取消注释以下行
// import router from '@/router'

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: parseInt(import.meta.env.VITE_REQUEST_TIMEOUT || '10000'),
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()
    
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
    
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器 - 暂时简化，等router完全创建后再添加跳转逻辑
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response
    
    // 如果返回的是API响应格式
    if (data && typeof data === 'object' && 'code' in data) {
      const { code, message } = data
      
      // 处理成功响应
      if (code === 200) {
        return data.data
      }
      
      // 处理认证错误 - 暂时先返回错误，等router完善后再处理跳转
      if (code === 401) {
        const authStore = useAuthStore()
        authStore.logout()
        
        // TODO: 在router完善后，取消注释以下代码
        // router.push({
        //   name: 'Login',
        //   query: { redirect: router.currentRoute.value.fullPath }
        // })
        
        return Promise.reject(new Error('认证已过期，请重新登录'))
      }
      
      // 处理其他业务错误
      return Promise.reject(new Error(message || '请求失败'))
    }
    
    // 如果不是标准格式，直接返回原始数据
    return data
  },
  (error) => {
    console.error('Response error:', error)
    
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
          
          // TODO: 在router完善后，取消注释以下代码
          // router.push({
          //   name: 'Login',
          //   query: { redirect: router.currentRoute.value.fullPath }
          // })
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
      if (data && data.message) {
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
    console.log(`GET ${url}`)
    return service.get(url, config)
  },
  
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    console.log(`POST ${url}`)
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
  }
}

export default service