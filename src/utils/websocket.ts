// WebSocket工具
import { ISeatStatusMessage, IWebSocketMessage } from '@/types/api.types'
// import { BUSINESS_RULES } from './constants'

/**
 * WebSocket服务类
 */
export class WebSocketService {
  private socket: WebSocket | null = null
  private url: string
  private reconnectInterval: number
  private maxReconnectAttempts: number
  private reconnectAttempts: number = 0
  private isConnected: boolean = false
  private messageHandlers: Map<string, Function[]> = new Map()
  private heartbeatInterval: NodeJS.Timeout | null = null
  
  constructor(
    url: string,
    reconnectInterval: number = 3000,  // 重连时间
    maxReconnectAttempts: number = 5
  ) {
    this.url = url
    this.reconnectInterval = reconnectInterval
    this.maxReconnectAttempts = maxReconnectAttempts
  }
  
  /**
   * 连接到WebSocket服务器
   */
  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // 构建连接URL
        let wsUrl = this.url
        if (token) {
          wsUrl += `?token=${encodeURIComponent(token)}`
        }
        
        this.socket = new WebSocket(wsUrl)
        
        this.socket.onopen = () => {
          console.log('WebSocket连接成功')
          this.isConnected = true
          this.reconnectAttempts = 0
          this.startHeartbeat()
          resolve()
        }
        
        this.socket.onmessage = (event) => {
          this.handleMessage(event.data)
        }
        
        this.socket.onclose = (event) => {
          console.log('WebSocket连接关闭', event)
          this.isConnected = false
          this.stopHeartbeat()
          
          // 非正常关闭时尝试重连
          if (event.code !== 1000) {
            this.reconnect()
          }
        }
        
        this.socket.onerror = (error) => {
          console.error('WebSocket连接错误', error)
          this.isConnected = false
          reject(error)
        }
      } catch (error) {
        console.error('WebSocket连接异常', error)
        reject(error)
      }
    })
  }
  
  /**
   * 断开WebSocket连接
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.close(1000, '正常关闭')
      this.socket = null
    }
    this.stopHeartbeat()
    this.isConnected = false
  }
  
  /**
   * 重新连接
   */
  private reconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('达到最大重连次数，停止重连')
      return
    }
    
    this.reconnectAttempts++
    console.log(`尝试重新连接 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
    
    setTimeout(() => {
      this.connect()
        .catch(() => {
          console.error('重连失败')
        })
    }, this.reconnectInterval)
  }
  
  /**
   * 发送消息
   */
  send(message: any): void {
    if (this.socket && this.isConnected) {
      const data = typeof message === 'string' ? message : JSON.stringify(message)
      this.socket.send(data)
    } else {
      console.error('WebSocket未连接，无法发送消息')
    }
  }
  
  /**
   * 处理接收到的消息
   */
  private handleMessage(data: string): void {
    try {
      const message: IWebSocketMessage = JSON.parse(data)
      const { type } = message
      
      // 调用对应的消息处理器
      const handlers = this.messageHandlers.get(type)
      if (handlers) {
        handlers.forEach(handler => handler(message.data))
      }
      
      // 默认处理心跳响应
      if (type === 'pong') {
        console.log('收到心跳响应')
      }
    } catch (error) {
      console.error('解析WebSocket消息失败', error, data)
    }
  }
  
  /**
   * 注册消息处理器
   */
  on(type: string, handler: Function): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, [])
    }
    this.messageHandlers.get(type)!.push(handler)
  }
  
  /**
   * 移除消息处理器
   */
  off(type: string, handler?: Function): void {
    if (!this.messageHandlers.has(type)) return
    
    if (handler) {
      const handlers = this.messageHandlers.get(type)!
      const index = handlers.indexOf(handler)
      if (index !== -1) {
        handlers.splice(index, 1)
      }
    } else {
      this.messageHandlers.delete(type)
    }
  }
  
  /**
   * 开始心跳检测
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected) {
        this.send({ type: 'ping', timestamp: Date.now() })
      }
    }, 30000) // 每30秒发送一次心跳
  }
  
  /**
   * 停止心跳检测
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }
  
  /**
   * 获取连接状态
   */
  getConnectionStatus(): boolean {
    return this.isConnected
  }
  
  /**
   * 订阅座位状态更新
   */
  subscribeSeatStatus(handler: (message: ISeatStatusMessage) => void): void {
    this.on('seat_status_update', handler)
  }
  
  /**
   * 取消订阅座位状态更新
   */
  unsubscribeSeatStatus(handler?: (message: ISeatStatusMessage) => void): void {
    this.off('seat_status_update', handler)
  }
  
  /**
   * 订阅系统通知
   */
  subscribeNotification(handler: (data: any) => void): void {
    this.on('notification', handler)
  }
  
  /**
   * 取消订阅系统通知
   */
  unsubscribeNotification(handler?: (data: any) => void): void {
    this.off('notification', handler)
  }
}

/**
 * 创建WebSocket服务实例
 */
export const createWebSocketService = (): WebSocketService => {
  const wsBaseUrl = import.meta.env.VITE_WS_BASE_URL || '/ws'
  const wsUrl = wsBaseUrl.startsWith('ws://') || wsBaseUrl.startsWith('wss://')
    ? wsBaseUrl
    : `${window.location.protocol === 'https:' ? 'wss://' : 'ws://'}${window.location.host}${wsBaseUrl}`
  
  return new WebSocketService(wsUrl)
}