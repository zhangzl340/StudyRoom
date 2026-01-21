// store统一导出
// Pinia状态管理统一导出
import { createPinia } from 'pinia'

// 创建Pinia实例
const pinia = createPinia()

// 统一导出所有store
export * from './auth.store'
export * from './user.store'
export * from './room.store'
export * from './reservation.store'
export * from './statistics.store'

// 导出Pinia实例
export default pinia

/**
 * Pinia插件：持久化存储
 * 可以选择性地持久化某些store的状态
 */
pinia.use(({ store }) => {
  // 从localStorage恢复状态
  const storageKey = `pinia_${store.$id}`
  const savedState = localStorage.getItem(storageKey)
  
  if (savedState) {
    try {
      const parsedState = JSON.parse(savedState)
      store.$patch(parsedState)
    } catch (error) {
      console.error(`Failed to restore state for ${store.$id}:`, error)
      localStorage.removeItem(storageKey)
    }
  }
  
  // 监听状态变化并保存
  store.$subscribe((mutation, state) => {
    // 只保存需要持久化的store
    const persistStores = ['auth', 'user']
    
    if (persistStores.includes(store.$id)) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state))
      } catch (error) {
        console.error(`Failed to persist state for ${store.$id}:`, error)
      }
    }
  })
})

/**
 * 重置所有store状态（开发环境使用）
 */
export const resetAllStores = () => {
  if (process.env.NODE_ENV === 'development') {
    const stores = ['auth', 'user', 'room', 'reservation', 'statistics']
    
    stores.forEach(storeName => {
      const storageKey = `pinia_${storeName}`
      localStorage.removeItem(storageKey)
    })
    
    console.log('All stores have been reset')
  }
}

/**
 * 初始化store
 */
export const initializeStores = () => {
  // 这里可以添加store初始化逻辑
  console.log('Stores initialized')
}

/**
 * 获取store实例的辅助函数
 */
export const useStore = {
  auth: () => import('./auth.store').then(m => m.useAuthStore()),
  user: () => import('./user.store').then(m => m.useUserStore()),
  room: () => import('./room.store').then(m => m.useRoomStore()),
  reservation: () => import('./reservation.store').then(m => m.useReservationStore()),
  statistics: () => import('./statistics.store').then(m => m.useStatisticsStore()),
}