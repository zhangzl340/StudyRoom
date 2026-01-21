<template>
  <div class="admin-login">
    <div class="login-container">
      <!-- 左侧Logo和标题 -->
      <div class="login-left">
        <div class="logo">
          <h1>自习室预约管理系统</h1>
          <p>管理员登录</p>
        </div>
        <div class="features">
          <div class="feature-item">
            <span class="icon">🏫</span>
            <h3>自习室管理</h3>
            <p>管理所有自习室信息，配置座位布局</p>
          </div>
          <div class="feature-item">
            <span class="icon">👥</span>
            <h3>用户管理</h3>
            <p>查看和管理系统用户，调整信用分</p>
          </div>
          <div class="feature-item">
            <span class="icon">📊</span>
            <h3>数据统计</h3>
            <p>可视化数据报表，系统运行监控</p>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-right">
        <div class="login-form">
          <h2>管理员登录</h2>
          <p class="subtitle">请输入您的管理员账号和密码</p>

          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            label-position="top"
            @submit.prevent="handleLogin"
          >
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入管理员用户名"
                size="large"
                :prefix-icon="User"
              />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                size="large"
                show-password
                :prefix-icon="Lock"
                @keyup.enter="handleLogin"
              />
            </el-form-item>

            <el-form-item v-if="showCaptcha" label="验证码" prop="captcha">
              <div class="captcha-container">
                <el-input
                  v-model="loginForm.captcha"
                  placeholder="请输入验证码"
                  size="large"
                  style="flex: 1"
                />
                <div class="captcha-image" @click="refreshCaptcha">
                  <img v-if="captchaImage" :src="captchaImage" alt="验证码" />
                  <span v-else>点击刷新</span>
                </div>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                size="large"
                :loading="loading"
                @click="handleLogin"
                class="login-button"
              >
                {{ loading ? '登录中...' : '登录' }}
              </el-button>
            </el-form-item>

            <div class="login-footer">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <a href="/login" class="switch-login">切换学生登录</a>
            </div>
          </el-form>

          <div v-if="errorMessage" class="error-message">
            <el-alert :title="errorMessage" type="error" show-icon />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

// 表单引用
const loginFormRef = ref<FormInstance>()

// 表单数据
const loginForm = reactive({
  username: '',
  password: '',
  captcha: ''
})

// 表单验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 6, message: '验证码长度在 4 到 6 个字符', trigger: 'blur' }
  ]
}

// 状态
const loading = ref(false)
const errorMessage = ref('')
const showCaptcha = ref(false)
const captchaImage = ref('')
const rememberMe = ref(false)

// 初始化
onMounted(() => {
  // 从本地存储恢复记住的用户名
  const savedUsername = localStorage.getItem('admin_username')
  if (savedUsername) {
    loginForm.username = savedUsername
    rememberMe.value = true
  }
})

// 刷新验证码
const refreshCaptcha = () => {
  // 这里应该调用获取验证码的API
  console.log('刷新验证码')
  // captchaImage.value = '/api/captcha?' + Date.now()
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    // 验证表单
    const valid = await loginFormRef.value.validate()
    if (!valid) return

    loading.value = true
    errorMessage.value = ''

    // 模拟管理员登录
    console.log('管理员登录:', loginForm)

    // 这里应该调用管理员专用的登录API
    // 为了演示，我们暂时使用学生登录接口，但设置管理员角色
    const mockAdminUser = {
      id: 'admin-1',
      username: loginForm.username,
      realName: '系统管理员',
      email: `${loginForm.username}@admin.edu.cn`,
      phone: '13800138000',
      studentId: 'ADMIN001',
      avatar: '',
      college: '教务处',
      major: '',
      grade: '',
      className: '',
      role: 'academic_admin', // 管理员角色
      status: 'active',
      creditScore: 100,
      reservationCount: 0,
      totalUsageHours: 0,
      lastLoginTime: new Date().toISOString(),
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString()
    }

    // 保存用户信息
    authStore.setUser(mockAdminUser)
    authStore.setToken('admin-token-' + Date.now())

    // 如果选择了记住我，保存用户名
    if (rememberMe.value) {
      localStorage.setItem('admin_username', loginForm.username)
    } else {
      localStorage.removeItem('admin_username')
    }

    // 显示成功消息
    ElMessage.success('登录成功')

    // 跳转到管理仪表板
    router.push('/admin/dashboard')
  } catch (error: any) {
    console.error('登录失败:', error)
    errorMessage.value = error.message || '登录失败，请检查用户名和密码'
    
    // 登录失败时显示验证码
    if (!showCaptcha.value) {
      showCaptcha.value = true
      refreshCaptcha()
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  display: flex;
  max-width: 1000px;
  width: 100%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-left {
  flex: 1;
  background: linear-gradient(135deg, #304156 0%, #1a2530 100%);
  color: white;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
}

.logo h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(to right, #409eff, #67c23a);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.logo p {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
}

.features {
  margin-top: auto;
}

.feature-item {
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
}

.feature-item .icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.feature-item h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.feature-item p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.5;
}

.login-right {
  flex: 1;
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-form {
  max-width: 400px;
  width: 100%;
}

.login-form h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #304156;
}

.subtitle {
  color: #909399;
  margin-bottom: 40px;
  font-size: 14px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  margin-bottom: 8px;
  color: #606266;
}

.captcha-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.captcha-image {
  width: 120px;
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.3s;
}

.captcha-image:hover {
  border-color: #409eff;
}

.captcha-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-button {
  width: 100%;
  margin-top: 10px;
  font-weight: 500;
}

.login-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  font-size: 14px;
}

.switch-login {
  color: #409eff;
  text-decoration: none;
  transition: color 0.3s;
}

.switch-login:hover {
  color: #67c23a;
  text-decoration: underline;
}

.error-message {
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }
  
  .login-left {
    padding: 40px 20px;
  }
  
  .login-right {
    padding: 40px 20px;
  }
  
  .features {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    padding-bottom: 20px;
  }
  
  .feature-item {
    min-width: 200px;
  }
}
</style>