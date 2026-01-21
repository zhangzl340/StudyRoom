<template>
  <div class="batch-generate-tab">
    <h3>批量生成用户</h3>
    <p>根据规则批量生成用户账户，适合新生入学等场景</p>
    
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="150px"
      label-position="left"
    >
      <el-form-item label="生成数量" prop="count">
        <el-input-number v-model="formData.count" :min="1" :max="1000" />
        <span class="unit">个用户</span>
      </el-form-item>

      <el-form-item label="用户名前缀" prop="usernamePrefix">
        <el-input v-model="formData.usernamePrefix" placeholder="例如：student" />
      </el-form-item>

      <el-form-item label="用户名起始编号" prop="startNumber">
        <el-input-number v-model="formData.startNumber" :min="1" :max="9999" />
      </el-form-item>

      <el-form-item label="初始密码" prop="password">
        <el-input v-model="formData.password" type="password" placeholder="所有用户使用相同初始密码" show-password />
      </el-form-item>

      <el-form-item label="学号前缀" prop="studentIdPrefix">
        <el-input v-model="formData.studentIdPrefix" placeholder="例如：2024" />
      </el-form-item>

      <el-form-item label="邮箱域名" prop="emailDomain">
        <el-input v-model="formData.emailDomain" placeholder="例如：@edu.cn" />
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

      <el-form-item label="用户角色" prop="role">
        <el-select v-model="formData.role" placeholder="请选择用户角色">
          <el-option label="学生" value="student" />
          <el-option label="自习室管理员" value="room_admin" />
        </el-select>
      </el-form-item>

      <el-form-item label="生成选项">
        <el-checkbox v-model="formData.sendWelcomeEmail">发送欢迎邮件</el-checkbox>
        <el-checkbox v-model="formData.autoActivate">自动激活账户</el-checkbox>
      </el-form-item>

      <!-- 预览 -->
      <el-form-item label="预览示例">
        <div class="preview-example">
          <p>用户名：{{ formData.usernamePrefix }}{{ formData.startNumber }}</p>
          <p>学号：{{ formData.studentIdPrefix }}{{ formData.startNumber.toString().padStart(4, '0') }}</p>
          <p>邮箱：{{ formData.usernamePrefix }}{{ formData.startNumber }}{{ formData.emailDomain }}</p>
        </div>
      </el-form-item>

      <el-form-item>
        <div class="form-actions">
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="previewGeneration">预览生成</el-button>
          <el-button type="success" @click="generateUsers" :loading="generating">
            {{ generating ? '生成中...' : '确认生成' }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>

    <!-- 预览结果 -->
    <div v-if="previewResult.length > 0" class="preview-result">
      <h4>生成预览（{{ previewResult.length }}个用户）</h4>
      
      <el-alert type="info" show-icon style="margin-bottom: 15px">
        即将生成以下用户，请确认无误
      </el-alert>
      
      <el-table :data="previewResult.slice(0, 10)" height="200" border>
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="studentId" label="学号" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="password" label="密码" />
        <el-table-column prop="college" label="学院" />
      </el-table>
      
      <div v-if="previewResult.length > 10" class="preview-note">
        还有 {{ previewResult.length - 10 }} 个用户未显示...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const formRef = ref<FormInstance>()
const generating = ref(false)

// 表单数据
const formData = reactive({
  count: 50,
  usernamePrefix: 'student',
  startNumber: 1,
  password: '123456',
  studentIdPrefix: '2024',
  emailDomain: '@edu.cn',
  college: '计算机学院',
  major: '计算机科学与技术',
  grade: '2024级',
  role: 'student',
  sendWelcomeEmail: true,
  autoActivate: true
})

// 表单验证规则
const formRules: FormRules = {
  count: [
    { required: true, message: '请输入生成数量', trigger: 'blur' }
  ],
  usernamePrefix: [
    { required: true, message: '请输入用户名前缀', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入初始密码', trigger: 'blur' }
  ]
}

// 预览结果
const previewResult = ref<any[]>([])

// 计算属性
const previewData = computed(() => {
  if (previewResult.value.length === 0) {
    return []
  }
  return previewResult.value.slice(0, 5)
})

// 方法
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  previewResult.value = []
}

const previewGeneration = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate()
  if (!valid) return

  // 生成预览数据
  previewResult.value = []
  for (let i = 0; i < Math.min(formData.count, 20); i++) {
    const number = formData.startNumber + i
    previewResult.value.push({
      username: `${formData.usernamePrefix}${number}`,
      realName: `学生${number}`,
      studentId: `${formData.studentIdPrefix}${number.toString().padStart(4, '0')}`,
      email: `${formData.usernamePrefix}${number}${formData.emailDomain}`,
      password: formData.password,
      college: formData.college,
      major: formData.major,
      grade: formData.grade,
      role: formData.role
    })
  }
  
  ElMessage.success(`已生成${Math.min(formData.count, 20)}个预览用户`)
}

const generateUsers = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate()
  if (!valid) return

  if (previewResult.value.length === 0) {
    ElMessage.warning('请先预览生成结果')
    return
  }

  generating.value = true
  
  try {
    // 模拟批量生成
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success(`成功生成 ${formData.count} 个用户`)
    
    // 重置表单并通知父组件
    resetForm()
    emit('success')
  } catch (error) {
    ElMessage.error('生成失败：' + (error as Error).message)
  } finally {
    generating.value = false
  }
}
</script>

<style scoped>
.batch-generate-tab {
  padding: 20px;
}

.batch-generate-tab h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #303133;
}

.batch-generate-tab p {
  color: #606266;
  margin-bottom: 20px;
}

.unit {
  margin-left: 10px;
  color: #606266;
}

.preview-example {
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.preview-example p {
  margin: 5px 0;
  color: #606266;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 15px;
}

.preview-result {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.preview-result h4 {
  margin: 0 0 15px 0;
  color: #303133;
}

.preview-note {
  text-align: center;
  padding: 10px;
  color: #909399;
  font-size: 14px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-top: 10px;
}
</style>