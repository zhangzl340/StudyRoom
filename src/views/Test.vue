<template>
  <div class="test-page">
    <h1>工具函数测试页面</h1>
    
    <div class="test-section">
      <h2>1. 日期工具测试</h2>
      <p>当前时间: {{ currentTime }}</p>
      <p>格式化日期: {{ formattedDate }}</p>
      <p>相对时间: {{ relativeTime }}</p>
      <button @click="testDateFunctions">测试日期函数</button>
    </div>
    
    <div class="test-section">
      <h2>2. 验证工具测试</h2>
      <div>
        <input v-model="testEmail" placeholder="输入邮箱测试" />
        <span :class="['result', emailValid ? 'valid' : 'invalid']">
          {{ emailValid ? '✓ 有效' : '✗ 无效' }}
        </span>
      </div>
      <div>
        <input v-model="testPhone" placeholder="输入手机号测试" />
        <span :class="['result', phoneValid ? 'valid' : 'invalid']">
          {{ phoneValid ? '✓ 有效' : '✗ 无效' }}
        </span>
      </div>
    </div>
    
    <div class="test-section">
      <h2>3. 常量测试</h2>
      <p>应用标题: {{ appTitle }}</p>
      <p>API基础URL: {{ apiBaseUrl }}</p>
    </div>
    
    <div class="test-section">
      <h2>4. 状态管理测试</h2>
      <p>当前认证状态: {{ isLoggedIn ? '已登录' : '未登录' }}</p>
      <button @click="toggleAuth">切换登录状态</button>
    </div>
    
    <div class="test-section">
      <h2>5. 类型定义测试</h2>
      <pre>{{ sampleUser }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  formatDateTime, 
  fromNow, 
  getToday
} from '@/utils/date'
import { validateEmail, validatePhone } from '@/utils/validation'  // 修正导入路径
import { APP_CONFIG } from '@/utils/constants'
import { useAuthStore } from '@/stores/auth.store'
// 导入类型，同时导入枚举值
import type { IUser } from '@/types/user.types'
import { UserRole, UserStatus } from '@/types/user.types'  // 直接导入枚举，而不是类型

// 日期测试
const currentTime = ref(new Date())
const formattedDate = computed(() => formatDateTime(currentTime.value))
const relativeTime = computed(() => fromNow(currentTime.value))

const testDateFunctions = () => {
  console.log('今天的日期:', getToday())
  console.log('格式化测试:', formatDateTime(new Date(), 'YYYY年MM月DD日 HH:mm:ss'))
  currentTime.value = new Date() // 更新时间
}

// 验证测试
const testEmail = ref('test@example.com')
const testPhone = ref('13800138000')
const emailValid = computed(() => validateEmail(testEmail.value))
const phoneValid = computed(() => validatePhone(testPhone.value))

// 常量测试
const appTitle = ref(APP_CONFIG.TITLE)
const apiBaseUrl = ref(APP_CONFIG.API_BASE_URL)

// 状态管理测试
const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isAuthenticated)

const toggleAuth = () => {
  if (isLoggedIn.value) {
    authStore.logout()
  } else {
    // 模拟登录
    const mockUser: IUser = {
      id: 'test-123',
      username: 'testuser',
      realName: '测试用户',
      email: 'test@example.com',
      phone: '13800138000',
      studentId: '20230001',
      avatar: '',
      college: '计算机学院',
      major: '软件工程',
      grade: '2023级',
      className: '软件2401',
      role: UserRole.STUDENT,  // 使用枚举值
      status: UserStatus.ACTIVE,  // 使用枚举值
      creditScore: 95,
      reservationCount: 10,
      totalUsageHours: 45,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    authStore.setUser(mockUser)
    authStore.setToken('mock-jwt-token-123456')
  }
}

// 类型定义测试
const sampleUser: IUser = {
  id: 'sample-001',
  username: 'zhangsan',
  realName: '张三',
  email: 'zhangsan@university.edu.cn',
  phone: '13912345678',
  studentId: '20241001',
  avatar: 'https://example.com/avatar.jpg',
  college: '信息工程学院',
  major: '计算机科学与技术',
  grade: '2024级',
  className: '计科2401',
  role: UserRole.STUDENT,  // 使用枚举值
  status: UserStatus.ACTIVE,  // 使用枚举值
  creditScore: 100,
  reservationCount: 5,
  totalUsageHours: 25,
  createdAt: '2024-09-01T08:00:00Z',
  updatedAt: '2024-10-01T10:30:00Z'
}

// 组件挂载时输出一些测试信息
onMounted(() => {
  console.log('测试页面已加载')
  console.log('应用配置:', APP_CONFIG)
  console.log('认证状态:', isLoggedIn.value)
})
</script>

<style scoped>
.test-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.test-section {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #f9f9f9;
}

.test-section h2 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #409eff;
  padding-bottom: 10px;
}

input {
  margin: 10px;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  width: 200px;
}

.result {
  margin-left: 10px;
  font-weight: bold;
}

.result.valid {
  color: #67c23a;
}

.result.invalid {
  color: #f56c6c;
}

button {
  margin: 10px;
  padding: 10px 20px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #66b1ff;
}

pre {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  overflow: auto;
  font-size: 14px;
}
</style>