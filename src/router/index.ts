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
  document.title = `${title} - 自习室预约系统`

  console.log('路由守卫: ', {
    to: to.path,
    requiresAuth: to.meta.requiresAuth,
    requiresAdmin: to.meta.requiresAdmin,
    isAuthenticated,
    userRole: user?.role
  })

  // 检查是否需要认证
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('需要认证但未登录，重定向到登录页')
    
    // 如果是管理端路由，重定向到管理员登录页
    if (to.path.startsWith('/admin')) {
      next({
        name: 'AdminLogin',
        query: { redirect: to.fullPath }
      })
    } else {
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
    }
    return
  }

  // 检查是否需要管理员权限
  if (to.meta.requiresAdmin) {
    console.log('检查管理员权限')
    
    if (!user) {
      console.log('用户信息不存在，重定向到登录')
      next({ 
        name: 'AdminLogin',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    const isAdmin = user.role === UserRole.ROOM_ADMIN || user.role === UserRole.ACADEMIC_ADMIN
    console.log('用户角色:', user.role, '是管理员吗?', isAdmin)
    
    if (!isAdmin) {
      console.log('非管理员用户尝试访问管理端，重定向到首页')
      
      // 如果不是管理员，根据用户角色重定向
      if (user.role === UserRole.STUDENT) {
        next({ name: 'Home' })
      } else {
        next({ name: 'Login' })
      }
      return
    }
  }

  // 如果已经登录，禁止访问登录页面（根据用户角色重定向）
  if ((to.name === 'Login' || to.name === 'AdminLogin') && isAuthenticated) {
    console.log('已登录，禁止访问登录页')
    
    if (user) {
      if (user.role === UserRole.STUDENT) {
        next({ name: 'Home' })
      } else if (user.role === UserRole.ROOM_ADMIN || user.role === UserRole.ACADEMIC_ADMIN) {
        next({ name: 'AdminDashboard' })
      } else {
        next({ name: 'Home' })
      }
    } else {
      next({ name: 'Home' })
    }
    return
  }

  console.log('路由守卫通过，允许访问')
  next()
})

// 全局错误处理
router.onError((error) => {
  console.error('路由错误:', error)
})

export default router