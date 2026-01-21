<template>
  <div class="excel-import-tab">
    <el-alert type="info" show-icon style="margin-bottom: 20px">
      支持通过Excel文件批量导入用户数据，请下载模板并按照要求填写
    </el-alert>

    <div class="import-steps">
      <el-steps :active="currentStep" finish-status="success" simple>
        <el-step title="下载模板" />
        <el-step title="上传文件" />
        <el-step title="数据预览" />
        <el-step title="确认导入" />
      </el-steps>
    </div>

    <!-- 步骤1：下载模板 -->
    <div v-if="currentStep === 1" class="step-content">
      <h3>第一步：下载模板文件</h3>
      <p>请下载Excel模板文件，按照模板格式填写用户数据</p>
      
      <div class="template-info">
        <el-descriptions title="模板字段说明" :column="2" border>
          <el-descriptions-item label="username">用户名(必填)</el-descriptions-item>
          <el-descriptions-item label="password">初始密码(必填)</el-descriptions-item>
          <el-descriptions-item label="realName">真实姓名(必填)</el-descriptions-item>
          <el-descriptions-item label="studentId">学号(必填)</el-descriptions-item>
          <el-descriptions-item label="email">邮箱(必填)</el-descriptions-item>
          <el-descriptions-item label="phone">手机号(可选)</el-descriptions-item>
          <el-descriptions-item label="college">学院(必填)</el-descriptions-item>
          <el-descriptions-item label="major">专业(可选)</el-descriptions-item>
          <el-descriptions-item label="grade">年级(可选)</el-descriptions-item>
          <el-descriptions-item label="role">角色(可选)</el-descriptions-item>
        </el-descriptions>
        
        <div class="template-example">
          <h4>示例数据：</h4>
          <el-table :data="sampleData" style="width: 100%; margin-top: 10px">
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="password" label="密码" />
            <el-table-column prop="realName" label="姓名" />
            <el-table-column prop="studentId" label="学号" />
            <el-table-column prop="email" label="邮箱" />
          </el-table>
        </div>
      </div>
    </div>

    <!-- 步骤2：上传文件 -->
    <div v-else-if="currentStep === 2" class="step-content">
      <h3>第二步：上传Excel文件</h3>
      <p>请上传已填写好的Excel文件</p>
      
      <el-upload
        class="upload-demo"
        drag
        :action="uploadUrl"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :before-upload="beforeUpload"
        :show-file-list="false"
        accept=".xlsx,.xls"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽文件到此处或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 xls/xlsx 格式文件，文件大小不超过10MB
          </div>
        </template>
      </el-upload>
      
      <div class="upload-hint">
        <h4>注意事项：</h4>
        <ul>
          <li>• 用户名、学号、邮箱必须唯一</li>
          <li>• 密码长度至少6位</li>
          <li>• 邮箱格式必须正确</li>
          <li>• 角色默认为"student"，可选"room_admin"</li>
        </ul>
      </div>
    </div>

    <!-- 步骤3：数据预览 -->
    <div v-else-if="currentStep === 3" class="step-content">
      <h3>第三步：数据预览</h3>
      <p>请检查导入数据是否正确</p>
      
      <div class="preview-info">
        <el-alert :type="validationErrors.length > 0 ? 'error' : 'success'" show-icon>
          {{ validationErrors.length > 0 ? `发现${validationErrors.length}个问题` : '数据验证通过' }}
        </el-alert>
      </div>
      
      <el-table
        :data="previewData"
        style="width: 100%; margin: 20px 0"
        height="300"
        border
      >
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="realName" label="姓名" width="100" />
        <el-table-column prop="studentId" label="学号" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="college" label="学院" width="150" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="scope">
            <el-tag size="small">{{ getRoleText(scope.row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag size="small" :type="scope.row.status === 'valid' ? 'success' : 'error'">
              {{ scope.row.status === 'valid' ? '有效' : '无效' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      
      <div v-if="validationErrors.length > 0" class="validation-errors">
        <h4>错误信息：</h4>
        <el-alert type="error">
          <ul>
            <li v-for="error in validationErrors" :key="error">
              {{ error }}
            </li>
          </ul>
        </el-alert>
      </div>
    </div>

    <!-- 步骤4：确认导入 -->
    <div v-else-if="currentStep === 4" class="step-content">
      <h3>第四步：确认导入</h3>
      
      <div class="import-summary">
        <el-descriptions title="导入摘要" :column="2" border>
          <el-descriptions-item label="总记录数">{{ previewData.length }}</el-descriptions-item>
          <el-descriptions-item label="有效记录">{{ validCount }}</el-descriptions-item>
          <el-descriptions-item label="失败记录">{{ previewData.length - validCount }}</el-descriptions-item>
          <el-descriptions-item label="导入方式">批量创建</el-descriptions-item>
        </el-descriptions>
      </div>
      
      <div class="import-options">
        <el-checkbox v-model="importOptions.skipDuplicates">跳过重复用户（根据用户名/学号/邮箱）</el-checkbox>
        <el-checkbox v-model="importOptions.sendWelcomeEmail" style="margin-left: 20px">
          发送欢迎邮件（包含初始密码）
        </el-checkbox>
      </div>
      
      <div v-if="importResult" class="import-result">
        <el-alert :type="importResult.success ? 'success' : 'error'" show-icon>
          {{ importResult.message }}
        </el-alert>
        
        <div v-if="importResult.failedItems && importResult.failedItems.length > 0">
          <h4 style="margin-top: 20px">失败记录详情：</h4>
          <el-table :data="importResult.failedItems" size="small">
            <el-table-column prop="row" label="行号" width="80" />
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="error" label="错误原因" />
          </el-table>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button @click="prevStep" v-if="currentStep > 1">上一步</el-button>
      <el-button
        v-if="currentStep < 4"
        type="primary"
        @click="nextStep"
        :disabled="!canProceed"
      >
        下一步
      </el-button>
      <el-button
        v-if="currentStep === 4"
        type="success"
        @click="confirmImport"
        :loading="importing"
      >
        {{ importing ? '导入中...' : '确认导入' }}
      </el-button>
      <el-button @click="$emit('cancel')">取消</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const currentStep = ref(1)
const uploadUrl = '/api/admin/users/import'
const importing = ref(false)

// 示例数据
const sampleData = ref([
  { username: 'zhangsan', password: '123456', realName: '张三', studentId: '20240001', email: 'zhangsan@edu.cn' },
  { username: 'lisi', password: '123456', realName: '李四', studentId: '20240002', email: 'lisi@edu.cn' }
])

// 预览数据
const previewData = ref([
  { username: 'zhangsan', realName: '张三', studentId: '20240001', email: 'zhangsan@edu.cn', college: '计算机学院', role: 'student', status: 'valid' },
  { username: 'lisi', realName: '李四', studentId: '20240002', email: 'lisi@edu.cn', college: '信息工程学院', role: 'student', status: 'valid' },
  { username: 'wangwu', realName: '王五', studentId: '20240003', email: 'invalid-email', college: '机械学院', role: 'student', status: 'invalid' }
])

// 验证错误
const validationErrors = ref<string[]>([
  '第3行：邮箱格式不正确',
  '第5行：学号已存在'
])

// 导入选项
const importOptions = reactive({
  skipDuplicates: true,
  sendWelcomeEmail: true
})

// 导入结果
const importResult = ref<any>(null)

// 计算属性
const validCount = computed(() => {
  return previewData.value.filter(item => item.status === 'valid').length
})

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 2:
      return previewData.value.length > 0
    case 3:
      return validationErrors.value.length === 0
    default:
      return true
  }
})

// 方法
const getRoleText = (role: string) => {
  return role === 'room_admin' ? '自习室管理员' : '学生'
}

const beforeUpload = (file: File) => {
  const isExcel = file.type.includes('spreadsheetml') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isExcel) {
    ElMessage.error('只能上传Excel文件！')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过10MB！')
    return false
  }
  
  return true
}

const handleUploadSuccess = (response: any) => {
  ElMessage.success('文件上传成功')
  previewData.value = response.data || previewData.value
  validationErrors.value = response.errors || []
  nextStep()
}

const handleUploadError = (error: any) => {
  ElMessage.error('文件上传失败：' + error.message)
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
    
    // 如果进入第三步，模拟数据验证
    if (currentStep.value === 3) {
      // 这里可以调用API验证数据
      console.log('验证导入数据')
    }
  }
}

const confirmImport = async () => {
  importing.value = true
  
  try {
    // 模拟导入过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    importResult.value = {
      success: true,
      message: `成功导入 ${validCount.value} 个用户`,
      total: previewData.value.length,
      successCount: validCount.value,
      failedItems: previewData.value
        .filter(item => item.status === 'invalid')
        .map((item, index) => ({
          row: index + 1,
          username: item.username,
          error: '数据验证失败'
        }))
    }
    
    ElMessage.success('用户导入成功')
    
    // 2秒后自动关闭并刷新列表
    setTimeout(() => {
      emit('success')
    }, 2000)
  } catch (error) {
    importResult.value = {
      success: false,
      message: '导入失败：' + (error as Error).message
    }
    ElMessage.error('导入失败')
  } finally {
    importing.value = false
  }
}
</script>

<style scoped>
.excel-import-tab {
  padding: 20px;
}

.import-steps {
  margin-bottom: 30px;
}

.step-content {
  min-height: 300px;
}

.step-content h3 {
  margin-top: 0;
  color: #303133;
  margin-bottom: 10px;
}

.step-content p {
  color: #606266;
  margin-bottom: 20px;
}

.template-info {
  margin: 20px 0;
}

.template-example {
  margin-top: 20px;
}

.upload-demo {
  margin: 20px 0;
}

.upload-hint {
  margin-top: 20px;
  padding: 15px;
  background: #f0f9ff;
  border-radius: 6px;
}

.upload-hint h4 {
  margin: 0 0 10px 0;
  color: #409eff;
}

.upload-hint ul {
  margin: 0;
  padding-left: 20px;
  color: #606266;
}

.upload-hint li {
  margin-bottom: 5px;
}

.preview-info {
  margin-bottom: 20px;
}

.validation-errors {
  margin-top: 20px;
}

.validation-errors ul {
  margin: 10px 0 0 20px;
  color: #f56c6c;
}

.import-summary {
  margin: 20px 0;
}

.import-options {
  margin: 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
}

.import-result {
  margin-top: 20px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}
</style>