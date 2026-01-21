<template>
  <div class="manual-add-tab">
    <h3>手动添加用户</h3>
    <p>手动输入用户信息并添加</p>
    
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      label-position="left"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="formData.username" placeholder="请输入用户名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="初始密码" prop="password">
            <el-input v-model="formData.password" type="password" placeholder="请输入初始密码" show-password />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="formData.realName" placeholder="请输入真实姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学号" prop="studentId">
            <el-input v-model="formData.studentId" placeholder="请输入学号" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="formData.phone" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="学院" prop="college">
            <el-input v-model="formData.college" placeholder="请输入学院" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="专业" prop="major">
            <el-input v-model="formData.major" placeholder="请输入专业" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="年级" prop="grade">
            <el-input v-model="formData.grade" placeholder="请输入年级" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户角色" prop="role">
            <el-select v-model="formData.role" placeholder="请选择用户角色" style="width: 100%">
              <el-option label="学生" value="student" />
              <el-option label="自习室管理员" value="room_admin" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <div class="form-actions">
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="addUser">添加用户</el-button>
          <el-button type="success" @click="addAndContinue">添加并继续</el-button>
        </div>
      </el-form-item>
    </el-form>

    <!-- 已添加用户列表 -->
    <div v-if="addedUsers.length > 0" class="added-users">
      <h4>已添加的用户（{{ addedUsers.length }}个）</h4>
      <el-table :data="addedUsers" size="small" style="width: 100%">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="realName" label="姓名" />
        <el-table-column prop="studentId" label="学号" />
        <el-table-column prop="role" label="角色">
          <template #default="scope">
            <el-tag size="small">{{ scope.row.role === 'room_admin' ? '管理员' : '学生' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="scope">
            <el-button type="text" size="small" @click="removeUser(scope.$index)">
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 批量操作 -->
    <div class="batch-actions" v-if="addedUsers.length > 0">
      <el-button type="primary" @click="batchAddUsers" :loading="adding">
        {{ adding ? '添加中...' : `批量添加(${addedUsers.length}个)` }}
      </el-button>
      <el-button @click="clearAddedUsers">清空列表</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const formRef = ref<FormInstance>()
const adding = ref(false)

// 表单数据
const formData = reactive({
  username: '',
  password: '',
  realName: '',
  studentId: '',
  email: '',
  phone: '',
  college: '',
  major: '',
  grade: '',
  role: 'student'
})

// 表单验证规则
const formRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入初始密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  college: [
    { required: true, message: '请输入学院', trigger: 'blur' }
  ]
}

// 已添加的用户列表
const addedUsers = ref<any[]>([])

// 方法
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

const addUser = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate()
  if (!valid) return

  // 添加到列表
  addedUsers.value.push({ ...formData })
  
  ElMessage.success('用户已添加到列表')
  resetForm()
}

const addAndContinue = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate()
  if (!valid) return

  // 添加到列表
  addedUsers.value.push({ ...formData })
  
  // 重置表单但不显示消息
  resetForm()
}

const removeUser = (index: number) => {
  addedUsers.value.splice(index, 1)
  ElMessage.success('已移除用户')
}

const clearAddedUsers = () => {
  addedUsers.value = []
  ElMessage.info('已清空用户列表')
}

const batchAddUsers = async () => {
  if (addedUsers.value.length === 0) {
    ElMessage.warning('请先添加用户到列表')
    return
  }

  adding.value = true
  
  try {
    // 模拟批量添加
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success(`成功添加 ${addedUsers.value.length} 个用户`)
    
    // 清空列表并刷新
    addedUsers.value = []
    emit('success')
  } catch (error) {
    ElMessage.error('批量添加失败：' + (error as Error).message)
  } finally {
    adding.value = false
  }
}
</script>

<style scoped>
.manual-add-tab {
  padding: 20px;
}

.manual-add-tab h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #303133;
}

.manual-add-tab p {
  color: #606266;
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  gap: 15px;
}

.added-users {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.added-users h4 {
  margin: 0 0 15px 0;
  color: #303133;
}

.batch-actions {
  margin-top: 20px;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}
</style>