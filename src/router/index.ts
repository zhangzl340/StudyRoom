import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { UserRole } from '@/types/user.types'
import studentRoutes from './student.routes'
import adminRoutes from './admin.routes'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...studentRoutes,
    ...adminRoutes,
    // 404页面
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
      meta: {
        title: '页面未找到'
      }
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const user = authStore.user
  // 设置页面标题
  const title = to.meta.title as string || '高校自习室预约平台'
  document.title = title

  // 检查是否需要认证
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // 检查是否需要管理员权限
  if (to.meta.requiresAdmin) {
    if (!user) {
      next({ name: 'Login' })
      return
    }
    
    const isAdmin = user.role === UserRole.ROOM_ADMIN || user.role === UserRole.ACADEMIC_ADMIN
    if (!isAdmin) {
      next({ name: 'Home' })
      return
    }
  }

  // 如果已经登录，禁止访问登录/注册页面
  if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated) {
    next({ name: 'Home' })
    return
  }

  next()
})

// 全局错误处理
router.onError((error) => {
  console.error('路由错误:', error)
})

export default router