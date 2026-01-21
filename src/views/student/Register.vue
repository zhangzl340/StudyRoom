<template>
  <div class="register-page">
    <h2>用户注册</h2>
    <p class="subtitle">创建您的自习室预约账户</p>
    
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="register-form"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="form.username"
          placeholder="请输入用户名"
          clearable
        />
      </el-form-item>
      
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          show-password
          clearable
        />
      </el-form-item>
      
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          show-password
          clearable
        />
      </el-form-item>
      
      <el-form-item label="真实姓名" prop="realName">
        <el-input
          v-model="form.realName"
          placeholder="请输入真实姓名"
          clearable
        />
      </el-form-item>
      
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="form.email"
          placeholder="请输入邮箱"
          clearable
        />
      </el-form-item>
      
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="form.phone"
          placeholder="请输入手机号"
          clearable
        />
      </el-form-item>
      
      <el-form-item label="学号" prop="studentId">
        <el-input
          v-model="form.studentId"
          placeholder="请输入学号"
          clearable
        />
      </el-form-item>
      
      <el-form-item label="学院" prop="college">
        <el-input
          v-model="form.college"
          placeholder="请输入学院"
          clearable
        />
      </el-form-item>
      
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleRegister"
          class="register-btn"
        >
          注册
        </el-button>
        <el-button @click="handleBack">返回登录</el-button>
      </el-form-item>
    </el-form>
    
    <div class="login-link">
      已有账户？<router-link to="/student/login">立即登录</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { validateEmail, validatePhone, validateStudentId } from '@/utils/validation'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  realName: '',
  email: '',
  phone: '',
  studentId: '',
  college: ''
})

const validateUsername = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入用户名'))
  } else if (value.length < 4 || value.length > 20) {
    callback(new Error('用户名长度应为4-20个字符'))
  } else {
    callback()
  }
}

const validatePassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入密码'))
  } else if (value.length < 8 || value.length > 20) {
    callback(new Error('密码长度应为8-20个字符'))
  } else {
    callback()
  }
}

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules: FormRules = {
  username: [
    { required: true, validator: validateUsername, trigger: 'blur' }
  ],
  password: [
    { required: true, validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (value && !validateEmail(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (value && !validatePhone(value)) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ],
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (value && !validateStudentId(value)) {
        callback(new Error('学号格式不正确'))
      } else {
        callback()
      }
    }, trigger: 'blur' }
  ],
  college: [
    { required: true, message: '请输入学院', trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 模拟注册过程
    console.log('注册信息:', form)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 注册成功后跳转到登录页面
    ElMessage.success('注册成功，请登录')
    router.push('/student/login')
  } catch (error) {
    console.error('注册失败:', error)
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  router.push('/student/login')
}
</script>

<style scoped>
.register-page {
  width: 100%;
}

.register-page h2 {
  text-align: center;
  margin-bottom: 10px;
  color: #303133;
}

.subtitle {
  text-align: center;
  color: #909399;
  margin-bottom: 30px;
  font-size: 14px;
}

.register-form {
  margin-top: 20px;
}

.register-btn {
  width: 120px;
}

.login-link {
  text-align: center;
  margin-top: 30px;
  color: #606266;
  font-size: 14px;
}

.login-link a {
  color: #409eff;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>