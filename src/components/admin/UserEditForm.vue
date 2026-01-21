<template>
  <div class="user-edit-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" placeholder="请输入用户名" />
      </el-form-item>

      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="formData.realName" placeholder="请输入真实姓名" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱" />
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入手机号" />
      </el-form-item>

      <el-form-item label="学号/工号" prop="studentId">
        <el-input v-model="formData.studentId" placeholder="请输入学号或工号" />
      </el-form-item>

      <el-form-item label="用户角色" prop="role">
        <el-select v-model="formData.role" placeholder="请选择用户角色" style="width: 100%">
          <el-option label="学生" value="student" />
          <el-option label="自习室管理员" value="room_admin" />
          <el-option label="教务处管理员" value="academic_admin" />
        </el-select>
      </el-form-item>

      <el-form-item label="账号状态" prop="status">
        <el-select v-model="formData.status" placeholder="请选择账号状态" style="width: 100%">
          <el-option label="活跃" value="active" />
          <el-option label="已停用" value="inactive" />
          <el-option label="已封禁" value="suspended" />
        </el-select>
      </el-form-item>

      <el-form-item label="学院" prop="college">
        <el-input v-model="formData.college" placeholder="请输入学院" />
      </el-form-item>

      <el-form-item label="专业" prop="major">
        <el-input v-model="formData.major" placeholder="请输入专业" />
      </el-form-item>

      <el-form-item label="年级" prop="grade">
        <el-input v-model="formData.grade" placeholder="请输入年级" />
      </el-form-item>

      <el-form-item label="班级" prop="className">
        <el-input v-model="formData.className" placeholder="请输入班级" />
      </el-form-item>

      <div v-if="mode === 'add'" class="password-section">
        <el-form-item label="初始密码" prop="password">
          <el-input v-model="formData.password" type="password" placeholder="请输入初始密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="formData.confirmPassword" type="password" placeholder="请确认密码" />
        </el-form-item>
      </div>

      <el-form-item>
        <div class="form-actions">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { IUser, UserRole, UserStatus } from '@/types/user.types'

const props = defineProps<{
  user: IUser | null
  mode: 'add' | 'edit'
}>()

const emit = defineEmits<{
  submit: [data: Partial<IUser>]
  cancel: []
}>()

const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  username: '',
  realName: '',
  email: '',
  phone: '',
  studentId: '',
  role: 'student' as UserRole,
  status: 'active' as UserStatus,
  college: '',
  major: '',
  grade: '',
  className: '',
  password: '',
  confirmPassword: ''
})

// 表单验证规则
const formRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在2-20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择用户角色', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择账号状态', trigger: 'change' }
  ],
  password: [
    { required: props.mode === 'add', message: '请输入初始密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: props.mode === 'add', message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== formData.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 监听用户数据变化
watch(() => props.user, (newUser) => {
  if (newUser && props.mode === 'edit') {
    Object.assign(formData, {
      username: newUser.username,
      realName: newUser.realName,
      email: newUser.email,
      phone: newUser.phone || '',
      studentId: newUser.studentId || '',
      role: newUser.role,
      status: newUser.status,
      college: newUser.college || '',
      major: newUser.major || '',
      grade: newUser.grade || '',
      className: newUser.className || '',
      password: '',
      confirmPassword: ''
    })
  } else if (props.mode === 'add') {
    // 重置表单数据
    Object.keys(formData).forEach(key => {
      if (key === 'role') {
        formData.role = 'student'
      } else if (key === 'status') {
        formData.status = 'active'
      } else {
        (formData as any)[key] = ''
      }
    })
  }
}, { immediate: true })

// 处理方法
const handleSubmit = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate()
  if (!valid) return

  // 准备提交数据
  const submitData: Partial<IUser> = {
    username: formData.username,
    realName: formData.realName,
    email: formData.email,
    role: formData.role,
    status: formData.status
  }

  // 可选字段
  if (formData.phone) submitData.phone = formData.phone
  if (formData.studentId) submitData.studentId = formData.studentId
  if (formData.college) submitData.college = formData.college
  if (formData.major) submitData.major = formData.major
  if (formData.grade) submitData.grade = formData.grade
  if (formData.className) submitData.className = formData.className

  // 如果是添加模式，添加密码
  if (props.mode === 'add') {
    (submitData as any).password = formData.password
  }

  emit('submit', submitData)
}

const handleCancel = () => {
  emit('cancel')
}

// 生命周期
onMounted(() => {
  if (!props.user && props.mode === 'edit') {
    console.warn('编辑模式下未提供用户数据')
  }
})
</script>

<style scoped>
.user-edit-form {
  padding: 10px;
}

.password-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>