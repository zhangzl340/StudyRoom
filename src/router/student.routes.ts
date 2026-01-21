// 学生端路由
import type { RouteRecordRaw } from 'vue-router'

const studentRoutes: RouteRecordRaw[] = [
  {
    path: '/student',
    name: 'Home',
    component: () => import('@/views/student/Home.vue'),
    meta: {
      title: '首页',
      requiresAuth: true,
      layout: 'DefaultLayout'
    }
  },
    {
    path: '/',
    component: () => import('@/views/student/Home.vue'),
    meta: {
      title: '首页',
      requiresAuth: true,
      layout: 'DefaultLayout'
    }
  },
  {
    path: '/student/login',
    name: 'Login',
    component: () => import('@/views/student/Login.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
      layout: 'AuthLayout'
    }
  },
  {
    path: '/student/register',
    name: 'Register',
    component: () => import('@/views/student/Register.vue'),
    meta: {
      title: '注册',
      requiresAuth: false,
      layout: 'AuthLayout'
    }
  },
  {
    path: '/student/room/:id',
    name: 'RoomDetail',
    component: () => import('@/views/student/RoomDetail.vue'),
    meta: {
      title: '自习室详情',
      requiresAuth: true,
      layout: 'DefaultLayout'
    }
  },
  {
    path: '/student/my-reservations',
    name: 'MyReservations',
    component: () => import('@/views/student/MyReservations.vue'),
    meta: {
      title: '我的预约',
      requiresAuth: true,
      layout: 'DefaultLayout'
    }
  },
  {
    path: '/student/profile',
    name: 'Profile',
    component: () => import('@/views/student/Profile.vue'),
    meta: {
      title: '个人中心',
      requiresAuth: true,
      layout: 'DefaultLayout'
    }
  },
  {
    path: '/student/check-in',
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