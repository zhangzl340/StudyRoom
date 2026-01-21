<template>
  <div class="room-import-form">
    <el-alert type="info" title="导入说明" show-icon style="margin-bottom: 20px">
      支持Excel文件导入，请按照模板格式准备数据。导入前请仔细核对数据格式。
    </el-alert>

    <div class="import-steps">
      <el-steps :active="activeStep" finish-status="success" simple>
        <el-step title="下载模板" />
        <el-step title="上传文件" />
        <el-step title="数据预览" />
        <el-step title="确认导入" />
      </el-steps>
    </div>

    <!-- 第一步：下载模板 -->
    <div v-if="activeStep === 1" class="step-content">
      <div class="template-download">
        <h3>下载导入模板</h3>
        <p>请下载模板文件，按照要求填写数据后上传。</p>
        
        <div class="template-preview">
          <el-descriptions title="模板字段说明" :column="2" border>
            <el-descriptions-item label="name">自习室名称(必填)</el-descriptions-item>
            <el-descriptions-item label="code">自习室编号(必填)</el-descriptions-item>
            <el-descriptions-item label="building">楼栋名称(必填)</el-descriptions-item>
            <el-descriptions-item label="floor">楼层(必填)</el-descriptions-item>
            <el-descriptions-item label="capacity">座位容量(必填)</el-descriptions-item>
            <el-descriptions-item label="openTime">开放时间(必填)</el-descriptions-item>
            <el-descriptions-item label="closeTime">关闭时间(必填)</el-descriptions-item>
            <el-descriptions-item label="features">特性(可选)</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="download-actions">
          <el-button type="primary" @click="downloadTemplate">
            <el-icon><Download /></el-icon>
            下载Excel模板
          </el-button>
          <el-button type="info" @click="showSampleData">
            <el-icon><View /></el-icon>
            查看示例数据
          </el-button>
        </div>
      </div>
    </div>

    <!-- 第二步：上传文件 -->
    <div v-else-if="activeStep === 2" class="step-content">
      <div class="file-upload">
        <h3>上传Excel文件</h3>
        <p>请上传已填写好的Excel文件，系统将自动验证数据格式。</p>
        
        <el-upload
          class="upload-area"
          drag
          :action="uploadUrl"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :before-upload="beforeUpload"
          :show-file-list="false"
          accept=".xlsx,.xls"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              只能上传xls/xlsx文件，且不超过5MB
            </div>
          </template>
        </el-upload>

        <div class="upload-hint">
          <h4>注意事项：</h4>
          <ul>
            <li>• 文件大小不超过5MB</li>
            <li>• 确保必填字段都已填写</li>
            <li>• 时间格式为HH:mm:ss，例如08:00:00</li>
            <li>• 特性字段用逗号分隔，如wifi,air_conditioner</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 第三步：数据预览 -->
    <div v-else-if="activeStep === 3" class="step-content">
      <div class="data-preview">
        <h3>数据预览</h3>
        <p>请确认导入数据是否正确，如有问题可返回修改。</p>
        
        <div class="summary-info">
          <el-alert type="success" show-icon>
            成功解析 {{ previewData.length }} 条自习室数据
          </el-alert>
        </div>

        <el-table
          :data="previewData"
          height="300"
          style="width: 100%"
          border
        >
          <el-table-column prop="name" label="自习室名称" width="150" />
          <el-table-column prop="code" label="编号" width="100" />
          <el-table-column prop="building" label="楼栋" width="120" />
          <el-table-column prop="floor" label="楼层" width="80" />
          <el-table-column prop="capacity" label="容量" width="80" />
          <el-table-column prop="openTime" label="开放时间" width="100" />
          <el-table-column prop="closeTime" label="关闭时间" width="100" />
          <el-table-column prop="features" label="特性">
            <template #default="scope">
              <el-tag
                v-for="feature in scope.row.features"
                :key="feature"
                size="small"
                style="margin-right: 5px; margin-bottom: 5px"
              >
                {{ feature }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>

        <div class="validation-result" v-if="validationErrors.length > 0">
          <h4>数据验证结果：</h4>
          <el-alert type="error" title="发现以下问题" show-icon>
            <ul>
              <li v-for="error in validationErrors" :key="error">
                {{ error }}
              </li>
            </ul>
          </el-alert>
        </div>
      </div>
    </div>

    <!-- 第四步：确认导入 -->
    <div v-else-if="activeStep === 4" class="step-content">
      <div class="confirm-import">
        <h3>确认导入</h3>
        <p>即将导入 {{ previewData.length }} 条自习室数据，请确认。</p>
        
        <div class="import-summary">
          <el-descriptions title="导入摘要" :column="2" border>
            <el-descriptions-item label="总记录数">{{ previewData.length }}</el-descriptions-item>
            <el-descriptions-item label="预计用时">约{{ previewData.length * 2 }}秒</el-descriptions-item>
            <el-descriptions-item label="重复检查">自动跳过已存在的自习室</el-descriptions-item>
            <el-descriptions-item label="错误处理">失败记录将生成错误报告</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="import-options">
          <h4>导入选项：</h4>
          <el-checkbox v-model="importOptions.skipDuplicates">
            跳过已存在的自习室（根据编号判断）
          </el-checkbox>
          <el-checkbox v-model="importOptions.createLayout" style="margin-left: 20px">
            自动创建默认座位布局
          </el-checkbox>
        </div>

        <div v-if="importResult" class="import-result">
          <el-alert :type="importResult.success ? 'success' : 'error'" show-icon>
            {{ importResult.message }}
          </el-alert>
          
          <div v-if="importResult.failedItems && importResult.failedItems.length > 0">
            <h5>失败记录：</h5>
            <el-table :data="importResult.failedItems" size="small">
              <el-table-column prop="row" label="行号" width="80" />
              <el-table-column prop="name" label="自习室名称" />
              <el-table-column prop="error" label="错误原因" />
            </el-table>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button v-if="activeStep > 1" @click="previousStep">上一步</el-button>
      <el-button
        v-if="activeStep < 4"
        type="primary"
        :disabled="!canProceed"
        @click="nextStep"
      >
        下一步
      </el-button>
      <el-button
        v-if="activeStep === 4"
        type="success"
        :loading="importing"
        @click="confirmImport"
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
import { Download, View, UploadFilled } from '@element-plus/icons-vue'

const emit = defineEmits<{
  success: []
  cancel: []
}>()

// 步骤控制
const activeStep = ref(1)

// 上传配置
const uploadUrl = '/api/admin/rooms/import'

// 预览数据
const previewData = ref<any[]>([
  {
    name: '图书馆101自习室',
    code: 'LIB101',
    building: '图书馆',
    floor: '1楼',
    capacity: 80,
    openTime: '08:00:00',
    closeTime: '22:00:00',
    features: ['wifi', 'air_conditioner']
  },
  {
    name: '信息楼201电子阅览室',
    code: 'INFO201',
    building: '信息楼',
    floor: '2楼',
    capacity: 60,
    openTime: '08:30:00',
    closeTime: '21:30:00',
    features: ['computer', 'power']
  }
])

// 验证错误
const validationErrors = ref<string[]>([
  '第3行：开放时间格式错误',
  '第5行：座位容量必须是数字'
])

// 导入选项
const importOptions = reactive({
  skipDuplicates: true,
  createLayout: true
})

// 导入结果
const importResult = ref<any>(null)
const importing = ref(false)

// 计算属性
const canProceed = computed(() => {
  switch (activeStep.value) {
    case 2:
      return previewData.value.length > 0
    case 3:
      return validationErrors.value.length === 0
    default:
      return true
  }
})

// 方法
const downloadTemplate = () => {
  ElMessage.success('模板下载开始')
  // 这里应该调用API下载模板文件
  // 模拟下载
  setTimeout(() => {
    ElMessage.success('模板下载成功')
  }, 1000)
}

const showSampleData = () => {
  ElMessage.info('示例数据：请参考预览表格中的数据格式')
}

const beforeUpload = (file: File) => {
  const isExcel = file.type.includes('spreadsheetml') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isExcel) {
    ElMessage.error('只能上传Excel文件！')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('文件大小不能超过5MB！')
    return false
  }
  
  return true
}

const handleUploadSuccess = (response: any) => {
  console.log('上传成功:', response)
  ElMessage.success('文件上传成功')
  // 模拟解析数据
  previewData.value = response.data || previewData.value
  validationErrors.value = response.errors || []
  nextStep()
}

const handleUploadError = (error: any) => {
  console.error('上传失败:', error)
  ElMessage.error('文件上传失败：' + error.message)
}

const previousStep = () => {
  if (activeStep.value > 1) {
    activeStep.value--
  }
}

const nextStep = () => {
  if (activeStep.value < 4) {
    activeStep.value++
  }
}

const confirmImport = async () => {
  importing.value = true
  
  try {
    // 模拟导入过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    importResult.value = {
      success: true,
      message: `成功导入 ${previewData.value.length} 条自习室数据`,
      total: previewData.value.length,
      successCount: previewData.value.length,
      failedItems: []
    }
    
    ElMessage.success('导入成功')
    
    // 2秒后自动关闭并刷新列表
    setTimeout(() => {
      emit('success')
    }, 2000)
  } catch (error) {
    importResult.value = {
      success: false,
      message: '导入失败：' + (error as Error).message,
      failedItems: [
        { row: 3, name: '测试自习室', error: '自习室编号已存在' }
      ]
    }
    ElMessage.error('导入失败')
  } finally {
    importing.value = false
  }
}
</script>

<style scoped>
.room-import-form {
  padding: 20px;
}

.import-steps {
  margin-bottom: 30px;
}

.step-content {
  min-height: 300px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.step-content h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #303133;
}

.step-content p {
  color: #606266;
  margin-bottom: 20px;
}

.template-preview {
  margin: 20px 0;
}

.download-actions {
  margin-top: 20px;
  display: flex;
  gap: 15px;
}

.upload-area {
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

.summary-info {
  margin-bottom: 20px;
}

.validation-result {
  margin-top: 20px;
}

.validation-result ul {
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

.import-options h4 {
  margin: 0 0 10px 0;
}

.import-result {
  margin-top: 20px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}
</style>