<template>
  <div class="basic-settings">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="150px"
      label-position="left"
    >
      <el-form-item label="系统名称" prop="systemName">
        <el-input v-model="formData.systemName" placeholder="请输入系统名称" />
      </el-form-item>

      <el-form-item label="系统Logo" prop="logo">
        <el-upload
          class="logo-upload"
          action="/api/upload"
          :show-file-list="false"
          :on-success="handleLogoSuccess"
          :before-upload="beforeLogoUpload"
        >
          <img v-if="formData.logo" :src="formData.logo" class="logo" />
          <el-icon v-else class="logo-upload-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="网站备案号" prop="icp">
        <el-input v-model="formData.icp" placeholder="请输入ICP备案号" />
      </el-form-item>

      <el-form-item label="客服邮箱" prop="supportEmail">
        <el-input v-model="formData.supportEmail" placeholder="请输入客服邮箱" />
      </el-form-item>

      <el-form-item label="客服电话" prop="supportPhone">
        <el-input v-model="formData.supportPhone" placeholder="请输入客服电话" />
      </el-form-item>

      <el-form-item label="系统公告" prop="announcement">
        <el-input
          v-model="formData.announcement"
          type="textarea"
          :rows="3"
          placeholder="请输入系统公告"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="维护模式" prop="maintenanceMode">
        <el-switch v-model="formData.maintenanceMode" />
        <span class="switch-label">{{ formData.maintenanceMode ? '开启' : '关闭' }}</span>
      </el-form-item>

      <el-form-item label="维护提示" prop="maintenanceMessage" v-if="formData.maintenanceMode">
        <el-input
          v-model="formData.maintenanceMessage"
          type="textarea"
          :rows="2"
          placeholder="请输入维护提示信息"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  systemName: '自习室预约管理系统',
  logo: '',
  icp: '京ICP备12345678号',
  supportEmail: 'support@studyroom.com',
  supportPhone: '400-123-4567',
  announcement: '欢迎使用自习室预约管理系统！',
  maintenanceMode: false,
  maintenanceMessage: '系统维护中，请稍后访问...'
})

// 表单验证规则
const formRules: FormRules = {
  systemName: [
    { required: true, message: '请输入系统名称', trigger: 'blur' }
  ],
  supportEmail: [
    { required: true, message: '请输入客服邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

// 处理方法
const handleLogoSuccess = (response: any) => {
  formData.logo = response.url
}

const beforeLogoUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB！')
  }

  return isImage && isLt2M
}

// 暴露给父组件的方法
const getSettingsData = () => {
  return { ...formData }
}

const reset = () => {
  Object.assign(formData, {
    systemName: '自习室预约管理系统',
    logo: '',
    icp: '京ICP备12345678号',
    supportEmail: 'support@studyroom.com',
    supportPhone: '400-123-4567',
    announcement: '欢迎使用自习室预约管理系统！',
    maintenanceMode: false,
    maintenanceMessage: '系统维护中，请稍后访问...'
  })
}

defineExpose({
  getSettingsData,
  reset
})
</script>

<style scoped>
.basic-settings {
  padding: 20px;
}

.logo-upload {
  width: 120px;
  height: 120px;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: border-color 0.3s;
}

.logo-upload:hover {
  border-color: #409eff;
}

.logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-upload-icon {
  font-size: 28px;
  color: #8c939d;
}

.switch-label {
  margin-left: 10px;
  color: #606266;
}
</style>