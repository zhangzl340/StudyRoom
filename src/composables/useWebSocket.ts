// WebSocket实时通信
import { ref, onUnmounted } from 'vue'
import { createWebSocketService } from '@/utils/websocket'
import type { ISeatStatusMessage } from '@/types/reservation.types'

export const useWebSocket = () => {
  const websocketService = ref(createWebSocketService())
  const isConnected = ref(false)
  const connectionError = ref<string | null>(null)

  // 连接WebSocket
  const connect = async (token?: string) => {
    connectionError.value = null
    try {
      await websocketService.value.connect(token)
      isConnected.value = true
      console.log('WebSocket连接成功')
    } catch (error: any) {
      connectionError.value = error.message || 'WebSocket连接失败'
      isConnected.value = false
      console.error('WebSocket连接失败:', error)
    }
  }

  // 断开连接
  const disconnect = () => {
    websocketService.value.disconnect()
    isConnected.value = false
    connectionError.value = null
    console.log('WebSocket断开连接')
  }

  // 订阅座位状态更新
  const subscribeSeatStatus = (callback: (message: ISeatStatusMessage) => void) => {
    websocketService.value.subscribeSeatStatus(callback)
  }

  // 取消订阅座位状态更新
  const unsubscribeSeatStatus = (callback?: (message: ISeatStatusMessage) => void) => {
    websocketService.value.unsubscribeSeatStatus(callback)
  }

  // 订阅系统通知
  const subscribeNotification = (callback: (data: any) => void) => {
    websocketService.value.subscribeNotification(callback)
  }

  // 取消订阅系统通知
  const unsubscribeNotification = (callback?: (data: any) => void) => {
    websocketService.value.unsubscribeNotification(callback)
  }

  // 发送消息
  const send = (message: any) => {
    websocketService.value.send(message)
  }

  // 重新连接
  const reconnect = async (token?: string) => {
    console.log('尝试重新连接WebSocket...')
    await connect(token)
  }

  // 组件卸载时断开连接
  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected,
    connectionError,
    connect,
    disconnect,
    subscribeSeatStatus,
    unsubscribeSeatStatus,
    subscribeNotification,
    unsubscribeNotification,
    send,
    reconnect
  }
}