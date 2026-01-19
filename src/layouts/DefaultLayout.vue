<template>
  <div class="default-layout">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="container">
        <div class="logo">
          <router-link to="/">
            <h1>{{ appTitle }}</h1>
          </router-link>
        </div>
        <nav class="nav">
          <router-link to="/" class="nav-link" :class="{ active: currentRoute === 'Home' }">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </router-link>
          <router-link to="/my-reservations" class="nav-link" :class="{ active: currentRoute === 'MyReservations' }">
            <el-icon><Calendar /></el-icon>
            <span>我的预约</span>
          </router-link>
          <router-link to="/profile" class="nav-link" :class="{ active: currentRoute === 'Profile' }">
            <el-icon><User /></el-icon>
            <span>个人中心</span>
          </router-link>
          <div class="user-info" v-if="currentUser">
            <span class="username">{{ currentUser.realName || currentUser.username }}</span>
            <span class="credit">信用分: {{ currentUser.creditScore }}</span>
          </div>
          <button v-if="isLoggedIn" @click="handleLogout" class="logout-btn">
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </button>
          <router-link v-else to="/login" class="login-btn">
            <el-icon><UserFilled /></el-icon>
            登录
          </router-link>
        </nav>
      </div>
    </header>

    <!-- 系统通知条 -->
    <div class="announcement-bar" v-if="showAnnouncement">
      <div class="container">
        <el-icon><Bell /></el-icon>
        <span>{{ announcementText }}</span>
        <button @click="showAnnouncement = false" class="close-btn">
          <el-icon><Close /></el-icon>
        </button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <main class="main">
      <div class="container">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- 底部信息 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>联系我们</h3>
            <p><el-icon><Phone /></el-icon> 联系电话: 13800138000</p>
            <p><el-icon><Message /></el-icon> 邮箱: support@studyroom.com</p>
            <p><el-icon><Location /></el-icon> 地址: 西南科技大学计算机学院</p>
          </div>
          <div class="footer-section">
            <h3>快速链接</h3>
            <router-link to="/">首页</router-link>
            <router-link to="/my-reservations">我的预约</router-link>
            <router-link to="/profile">个人中心</router-link>
            <router-link to="/login">登录/注册</router-link>
          </div>
          <div class="footer-section">
            <h3>关于我们</h3>
            <p>高校自习室智能预约平台</p>
            <p>© 2024 林正旭 毕业设计</p>
            <p>版本: {{ appVersion }}</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2024 高校自习室智能预约平台 - 林正旭 毕业设计 | 本系统仅用于毕业设计展示</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { APP_CONFIG } from '@/utils/constants'
import {
  House,
  Calendar,
  User,
  SwitchButton,
  UserFilled,
  Bell,
  Close,
  Phone,
  Message,
  Location
} from '@element-plus/icons-vue'

const route = useRoute()
const authStore = useAuthStore()

const appTitle = APP_CONFIG.TITLE
const appVersion = APP_CONFIG.VERSION
const showAnnouncement = ref(true)
const announcementText = '系统将于今晚00:00-02:00进行维护升级，请提前安排好您的学习计划。'

const currentRoute = computed(() => route.name)
const isLoggedIn = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.user)

const handleLogout = () => {
  authStore.logout()
}

// 组件挂载时检查是否有新公告
onMounted(() => {
  // 这里可以调用API获取最新公告
  console.log('布局组件已加载')
})
</script>

<style scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo a {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo h1 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.25);
  font-weight: 600;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 10px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
}

.username {
  font-weight: 500;
}

.credit {
  font-size: 12px;
  background: #67c23a;
  padding: 2px 8px;
  border-radius: 10px;
}

.login-btn,
.logout-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.login-btn {
  background-color: white;
  color: #667eea;
  text-decoration: none;
}

.logout-btn {
  background-color: #f56c6c;
  color: white;
}

.login-btn:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.logout-btn:hover {
  background-color: #f78989;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
}

.announcement-bar {
  background: linear-gradient(90deg, #ff6b6b, #ff8e53);
  color: white;
  padding: 10px 0;
  font-size: 14px;
}

.announcement-bar .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.announcement-bar .el-icon {
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.main {
  flex: 1;
  padding: 30px 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 160px);
}

.footer {
  background: #304156;
  color: white;
  padding: 40px 0 20px;
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 30px;
}

.footer-section h3 {
  color: white;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

.footer-section p {
  color: #a8b3c5;
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-section a {
  display: block;
  color: #a8b3c5;
  text-decoration: none;
  margin: 8px 0;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: #409eff;
}

.footer-bottom {
  border-top: 1px solid #3a4a5f;
  padding-top: 20px;
  text-align: center;
  color: #8a94a6;
  font-size: 14px;
}

/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    gap: 15px;
    padding: 10px;
  }
  
  .nav {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .logo h1 {
    font-size: 20px;
  }
  
  .user-info {
    margin-left: 0;
    flex-direction: column;
    gap: 5px;
    text-align: center;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .announcement-bar {
    font-size: 12px;
    padding: 8px 0;
  }
}

@media (max-width: 480px) {
  .nav-link span {
    display: none;
  }
  
  .nav-link .el-icon {
    font-size: 18px;
  }
  
  .login-btn span,
  .logout-btn span {
    display: none;
  }
}
</style>