// 学生端路由
import type { RouteRecordRaw } from 'vue-router'

const studentRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/student/Home.vue'),
    meta: {
      title: '首页',
      requiresAuth: true,
      layout: 'DefaultLayout'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/student/Login.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
      layout: 'AuthLayout'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/student/Register.vue'),
    meta: {
      title: '注册',
      requiresAuth: false,
      layout: 'AuthLayout'
    }
  },
  {
    path: '/room/:id',
    name: 'RoomDetail',
    component: () => import('@/views/student/RoomDetail.vue'),
    meta: {
      title: '自习室详情',
      requiresAuth: true,
      layout: 'DefaultLayout'
    }
  },
  {
    path: '/my-reservations',
    name: 'MyReservations',
    component: () => import('@/views/student/MyReservations.vue'),
    meta: {
      title: '我的预约',
      requiresAuth: true,
      layout: 'DefaultLayout'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/student/Profile.vue'),
    meta: {
      title: '个人中心',
      requiresAuth: true,
      layout: 'DefaultLayout'
    }
  },
  {
    path: '/check-in',
    name: 'CheckIn',
    component: () => import('@/views/student/CheckIn.vue'),
    meta: {
      title: '签到',
      requiresAuth: true,
      layout: 'DefaultLayout'
    }
  }
]

export default studentRoutes