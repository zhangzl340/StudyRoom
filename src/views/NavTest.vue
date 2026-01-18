<template>
  <div class="nav-test">
    <h1>路由导航测试</h1>
    
    <div class="nav-links">
      <router-link to="/" class="nav-link">首页</router-link>
      <router-link to="/login" class="nav-link">登录页</router-link>
      <router-link to="/test" class="nav-link">测试页</router-link>
      <router-link to="/not-found" class="nav-link">404页面</router-link>
    </div>
    
    <div class="programmatic-nav">
      <h3>编程式导航测试</h3>
      <button @click="goToHome">去首页</button>
      <button @click="goToLogin">去登录页</button>
      <button @click="goToTest">去测试页</button>
      <button @click="goBack">后退</button>
      <button @click="goForward">前进</button>
    </div>
    
    <div class="route-info">
      <h3>当前路由信息</h3>
      <pre>{{ routeInfo }}</pre>
    </div>
    
    <!-- 显示当前路由对应的组件 -->
    <div class="router-view-container">
      <h3>路由视图内容</h3>
      <div class="view-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

// 路由信息
const routeInfo = computed(() => ({
  path: route.path,
  name: route.name,
  params: route.params,
  query: route.query,
  fullPath: route.fullPath
}))

// 编程式导航方法
const goToHome = () => {
  router.push('/')
}

const goToLogin = () => {
  router.push('/login')
}

const goToTest = () => {
  router.push('/test')
}

const goBack = () => {
  router.back()
}

const goForward = () => {
  router.forward()
}
</script>

<style scoped>
.nav-test {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.nav-links {
  display: flex;
  gap: 15px;
  margin: 20px 0;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.nav-link {
  padding: 10px 20px;
  background: #409eff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-link:hover {
  background: #66b1ff;
}

.nav-link.router-link-active {
  background: #67c23a;
  font-weight: bold;
}

.programmatic-nav {
  margin: 20px 0;
  padding: 20px;
  background: #f0f9ff;
  border-radius: 8px;
}

.programmatic-nav h3 {
  margin-top: 0;
  margin-bottom: 15px;
}

.programmatic-nav button {
  margin: 5px;
  padding: 10px 20px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.programmatic-nav button:hover {
  background: #66b1ff;
}

.route-info {
  margin: 20px 0;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
}

.route-info pre {
  background: #fff;
  padding: 15px;
  border-radius: 4px;
  overflow: auto;
}

.router-view-container {
  margin: 20px 0;
  padding: 20px;
  background: #f0f0f0;
  border-radius: 8px;
}

.view-content {
  padding: 20px;
  background: white;
  border-radius: 4px;
  border: 1px solid #ddd;
  min-height: 200px;
}
</style>