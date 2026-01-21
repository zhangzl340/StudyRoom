<template>
  <div class="login-page">
    <h2>学生端统一身份认证</h2>
    <p class="subtitle">请使用学号和密码登录</p>
    
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      label-width="100px"
      class="login-form"
    >
      <el-form-item label="学号" prop="username">
        <el-input
          v-model="loginForm.username"
          placeholder="请输入学号"
          clearable
        />
      </el-form-item>
      
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          show-password
          clearable
        />
      </el-form-item>
      
      <el-form-item label="验证码" prop="captcha">
        <el-input
          v-model="loginForm.captcha"
          placeholder="请输入验证码"
          clearable
        />
        <div class="captcha-container">
          <img 
            :src="captchaImage" 
            alt="验证码" 
            class="captcha-img"
            @click="refreshCaptcha"
            @error="refreshCaptcha"
          />
          <el-button 
            type="text" 
            @click="refreshCaptcha"
            class="captcha-refresh"
          >
            换一张
          </el-button>
        </div>
      </el-form-item>
      
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleLogin"
          class="login-btn"
        >
          登录
        </el-button>
        <el-button @click="goToRegister">注册账号</el-button>
      </el-form-item>
    </el-form>
    
    <div class="register-link">
      没有账户？<router-link to="/student/register">立即注册</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElForm, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { authApi } from '@/api';
import type { ILoginRequest } from '@/types/user.types';

// 状态管理 & 路由
const authStore = useAuthStore();
const router = useRouter();

// 表单（严格遵循 ILoginRequest 类型）
const loginFormRef = ref<InstanceType<typeof ElForm>>();
const loginForm = reactive<ILoginRequest>({
  username: '',
  password: '',
  captcha: ''
});

const loading = ref(false);

const loginRules = reactive({
  username: [
    { required: true, message: '请输入学号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
});

// 验证码相关
const captchaImage = ref('');
const refreshCaptcha = async () => {
  try {
    const { data } = await authApi.getCaptcha();
    if (data) {
      loginForm.captcha = data.captcha;
      captchaImage.value = data.captchaImage;
    }
  } catch (error) {
    ElMessage.error('获取验证码失败');
  }
};

// 登录处理（调用已有 authApi 和 Store）
const handleLogin = async () => {
  if (!loginFormRef.value) return;
  
  try {
    await loginFormRef.value.validate();
    loading.value = true;
    
    const { error } = await authStore.login(loginForm);
    if (!error) {
      ElMessage.success('登录成功');
      router.push('/student');
    } else {
      ElMessage.error(error.message || '登录失败');
      refreshCaptcha();
    }
  } catch (error) {
    // 验证失败，不做处理
  } finally {
    loading.value = false;
  }
};

// 跳转到注册页
const goToRegister = () => router.push('/student/register');

// 初始化验证码
onMounted(() => refreshCaptcha());
</script>

<style scoped>
.login-page {
  /* max-width: 500px;
  margin: 50px auto;
  padding: 20px; */
  width: 100%;
}

.login-page h2 {
  text-align: center;
  margin-bottom: 10px;
  color: #303133;
  font-size: 24px;
  font-weight: bold;
}

.subtitle {
  text-align: center;
  color: #909399;
  margin-bottom: 30px;
  font-size: 14px;
}

/* .login-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
} */

.login-form :deep(.el-form-item) {
  margin-bottom: 22px;
}

.login-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #606266;
}

.captcha-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
}

.captcha-img {
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
}

.captcha-refresh {
  padding: 0;
  color: #409eff;
  font-size: 14px;
}

.captcha-refresh:hover {
  color: #66b1ff;
}

.login-btn {
  width: 120px;
}

.register-link {
  text-align: center;
  margin-top: 30px;
  color: #606266;
  font-size: 14px;
}

.register-link a {
  color: #409eff;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-page {
    margin: 20px auto;
    padding: 15px;
  }
  
  .login-form {
    margin-top: 20px;
  }
}
</style>