// 主路由配置
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'NavTest',
      component: () => import('@/views/NavTest.vue')
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/student/Home.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/student/Login.vue')
    },
    {
      path: '/test',
      name: 'Test',
      component: () => import('@/views/Test.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue')
    }
  ]
})
// 路由导航守卫
router.beforeEach((to, from, next) => {
  console.log(`路由切换：从 ${from.path} 到 ${to.path}`)
  console.log('路由对象:', to)
  next()
})

// 全局错误处理
router.onError((error) => {
  console.error('路由错误:', error)
})
export default router