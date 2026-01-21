<template>
  <div class="test-access">
    <h1>管理端测试页面</h1>
    <p>这个页面不需要登录即可访问，用于测试管理端组件</p>
    
    <div class="test-actions">
      <el-button type="primary" @click="simulateAdminLogin">
        模拟管理员登录
      </el-button>
      <el-button type="success" @click="goToDashboard">
        跳转到仪表板
      </el-button>
    </div>
    
    <div class="test-info">
      <h3>当前登录状态：</h3>
      <p>已登录：{{ isLoggedIn }}</p>
      <p v-if="user">用户角色：{{ user.role }}</p>
      <p v-if="user">用户名：{{ user.username }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const isLoggedIn = authStore.isAuthenticated
const user = authStore.user

const simulateAdminLogin = () => {
  const mockAdminUser = {
    id: 'admin-1',
    username: 'admin',
    realName: '测试管理员',
    email: 'admin@test.edu.cn',
    phone: '13800138000',
    studentId: 'ADMIN001',
    avatar: '',
    college: '教务处',
    major: '',
    grade: '',
    className: '',
    role: 'academic_admin',
    status: 'active',
    creditScore: 100,
    reservationCount: 0,
    totalUsageHours: 0,
    lastLoginTime: new Date().toISOString(),
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: new Date().toISOString()
  }
  
  authStore.setUser(mockAdminUser)
  authStore.setToken('test-admin-token')
  
  ElMessage.success('已模拟管理员登录')
  
  // 刷新页面以更新状态
  setTimeout(() => {
    window.location.reload()
  }, 500)
}

const goToDashboard = () => {
  router.push('/admin/dashboard')
}
</script>

<style scoped>
.test-access {
  padding: 40px;
  text-align: center;
}

.test-access h1 {
  margin-bottom: 20px;
  color: #303133;
}

.test-access p {
  margin-bottom: 30px;
  color: #606266;
}

.test-actions {
  margin-bottom: 40px;
}

.test-info {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  margin: 0 auto;
  text-align: left;
}

.test-info h3 {
  margin-bottom: 10px;
  color: #303133;
}

.test-info p {
  margin-bottom: 5px;
}
</style>