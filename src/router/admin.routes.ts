// 管理端路由
import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/Dashboard.vue'),
    meta: {
      title: '管理仪表板',
      requiresAuth: true,
      requiresAdmin: true,
      layout: 'AdminLayout'
    }
  },
  {
    path: '/admin/rooms',
    name: 'AdminRooms',
    component: () => import('@/views/admin/Rooms.vue'),
    meta: {
      title: '自习室管理',
      requiresAuth: true,
      requiresAdmin: true,
      layout: 'AdminLayout'
    }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('@/views/admin/Users.vue'),
    meta: {
      title: '用户管理',
      requiresAuth: true,
      requiresAdmin: true,
      layout: 'AdminLayout'
    }
  },
  {
    path: '/admin/statistics',
    name: 'AdminStatistics',
    component: () => import('@/views/admin/Statistics.vue'),
    meta: {
      title: '数据统计',
      requiresAuth: true,
      requiresAdmin: true,
      layout: 'AdminLayout'
    }
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: () => import('@/views/admin/Settings.vue'),
    meta: {
      title: '系统设置',
      requiresAuth: true,
      requiresAdmin: true,
      layout: 'AdminLayout'
    }
  },
  {
    path: '/admin/announcements',
    name: 'AdminAnnouncements',
    component: () => import('@/views/admin/Announcements.vue'),
    meta: {
      title: '公告管理',
      requiresAuth: true,
      requiresAdmin: true,
      layout: 'AdminLayout'
    }
  }
]

export default adminRoutes