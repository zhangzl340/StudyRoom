<!-- 默认布局（学生端） -->
<template>
  <div class="default-layout">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="container">
        <div class="logo">
          <router-link to="/">
            <h1>自习室预约平台</h1>
          </router-link>
        </div>
        <nav class="nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/my-reservations" class="nav-link">我的预约</router-link>
          <router-link to="/profile" class="nav-link">个人中心</router-link>
          <button v-if="isLoggedIn" @click="handleLogout" class="logout-btn">退出登录</button>
          <router-link v-else to="/login" class="login-btn">登录</router-link>
        </nav>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main">
      <router-view />
    </main>

    <!-- 底部信息 -->
    <footer class="footer">
      <div class="container">
        <p>© 2024 高校自习室智能预约平台 - 林正旭 毕业设计</p>
        <p class="contact">联系电话: 13800138000 | 邮箱: support@studyroom.com</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

const isLoggedIn = computed(() => authStore.isAuthenticated)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
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
  background-color: #409eff;
  color: white;
  padding: 15px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo a {
  color: white;
  text-decoration: none;
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
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
  font-size: 16px;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
  font-weight: bold;
}

.login-btn,
.logout-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  font-weight: 500;
}

.login-btn {
  background-color: white;
  color: #409eff;
  text-decoration: none;
}

.logout-btn {
  background-color: #f56c6c;
  color: white;
}

.login-btn:hover {
  background-color: #f5f5f5;
}

.logout-btn:hover {
  background-color: #f78989;
}

.main {
  flex: 1;
  padding: 20px 0;
  background-color: #f5f7fa;
}

.footer {
  background-color: #304156;
  color: white;
  padding: 30px 0;
  text-align: center;
  border-top: 1px solid #e0e0e0;
}

.footer p {
  margin: 5px 0;
  color: #a8b3c5;
}

.footer .contact {
  font-size: 14px;
  margin-top: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header .container {
    flex-direction: column;
    gap: 15px;
  }
  
  .nav {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .logo h1 {
    font-size: 20px;
  }
}
</style>