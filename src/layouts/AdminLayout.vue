<!-- 管理后台布局 -->
<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <aside class="sidebar">
      <div class="logo">
        <h2>管理后台</h2>
      </div>
      <nav class="nav">
        <router-link to="/admin/dashboard" class="nav-item">
          <span class="icon">📊</span>
          <span class="text">仪表板</span>
        </router-link>
        <router-link to="/admin/rooms" class="nav-item">
          <span class="icon">🏫</span>
          <span class="text">自习室管理</span>
        </router-link>
        <router-link to="/admin/users" class="nav-item">
          <span class="icon">👥</span>
          <span class="text">用户管理</span>
        </router-link>
        <router-link to="/admin/statistics" class="nav-item">
          <span class="icon">📈</span>
          <span class="text">数据统计</span>
        </router-link>
        <router-link to="/admin/announcements" class="nav-item">
          <span class="icon">📢</span>
          <span class="text">公告管理</span>
        </router-link>
        <router-link to="/admin/settings" class="nav-item">
          <span class="icon">⚙️</span>
          <span class="text">系统设置</span>
        </router-link>
        <div class="nav-item logout" @click="handleLogout">
          <span class="icon">🚪</span>
          <span class="text">退出登录</span>
        </div>
      </nav>
    </aside>

    <!-- 主要内容区域 -->
    <div class="main">
      <!-- 顶部栏 -->
      <header class="header">
        <div class="header-left">
          <h3>{{ currentRouteTitle }}</h3>
        </div>
        <div class="header-right">
          <span class="user-info">{{ user?.realName || user?.username }}</span>
          <span class="user-role">{{ roleText }}</span>
        </div>
      </header>

      <!-- 内容区域 -->
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { UserRole } from '@/types/user.types'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const user = computed(() => authStore.user)

const currentRouteTitle = computed(() => {
  return route.meta.title as string || '管理后台'
})

const roleText = computed(() => {
  switch (user.value?.role) {
    case UserRole.ACADEMIC_ADMIN:
      return '教务处管理员'
    case UserRole.ROOM_ADMIN:
      return '自习室管理员'
    default:
      return '管理员'
  }
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.sidebar {
  width: 250px;
  background-color: #304156;
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.logo {
  padding: 20px;
  border-bottom: 1px solid #263445;
  text-align: center;
}

.logo h2 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

.nav {
  flex: 1;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  color: #bfcbd9;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 15px;
}

.nav-item:hover {
  background-color: #263445;
  color: white;
}

.nav-item.router-link-active {
  background-color: #409eff;
  color: white;
  font-weight: 500;
}

.nav-item .icon {
  margin-right: 12px;
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.nav-item .text {
  font-size: 15px;
}

.nav-item.logout {
  margin-top: auto;
  border-top: 1px solid #263445;
  color: #f56c6c;
}

.nav-item.logout:hover {
  background-color: #f56c6c;
  color: white;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  background-color: white;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.header-left h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  font-weight: 500;
  color: #303133;
}

.user-role {
  background-color: #409eff;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.content {
  flex: 1;
  padding: 24px;
  overflow: auto;
  background-color: #f0f2f5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
  }
  
  .nav {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    padding: 10px;
  }
  
  .nav-item {
    padding: 10px 15px;
  }
  
  .nav-item.logout {
    margin-top: 0;
    border-top: none;
  }
  
  .header {
    padding: 0 15px;
    height: 50px;
  }
  
  .content {
    padding: 15px;
  }
}
</style>