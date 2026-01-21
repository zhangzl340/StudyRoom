<template>
  <div class="announcement-editor">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="公告标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入公告标题"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="公告类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择公告类型">
          <el-option label="普通通知" value="info" />
          <el-option label="重要通知" value="important" />
          <el-option label="警告通知" value="warning" />
        </el-select>
      </el-form-item>

      <el-form-item label="发布时间" prop="publishTime">
        <el-date-picker
          v-model="formData.publishTime"
          type="datetime"
          placeholder="选择发布时间"
          :disabled="mode === 'edit'"
        />
      </el-form-item>

      <el-form-item label="公告内容" prop="content">
        <div class="editor-container">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="10"
            placeholder="请输入公告内容"
            maxlength="5000"
            show-word-limit
          />
          <div class="editor-toolbar">
            <el-button-group>
              <el-button size="small" @click="insertText('【重要】')">插入强调</el-button>
              <el-button size="small" @click="insertText('【链接】')">插入链接</el-button>
              <el-button size="small" @click="insertText('【时间】')">插入时间</el-button>
            </el-button-group>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="状态" prop="isActive">
        <el-switch
          v-model="formData.isActive"
          active-text="发布"
          inactive-text="草稿"
        />
      </el-form-item>

      <el-form-item>
        <div class="form-actions">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button v-if="mode === 'edit'" type="success" @click="handlePreview">预览</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  announcement?: any
  mode: 'add' | 'edit'
}>()

const emit = defineEmits<{
  submit: [data: any]
  cancel: []
  preview: [data: any]
}>()

const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  title: '',
  type: 'info',
  content: '',
  publishTime: new Date(),
  isActive: true
})

// 表单验证规则
const formRules: FormRules = {
  title: [
    { required: true, message: '请输入公告标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择公告类型', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入公告内容', trigger: 'blur' },
    { min: 10, max: 5000, message: '内容长度在 10 到 5000 个字符', trigger: 'blur' }
  ],
  publishTime: [
    { required: true, message: '请选择发布时间', trigger: 'change' }
  ]
}

// 监听公告数据变化
watch(() => props.announcement, (newAnnouncement) => {
  if (newAnnouncement) {
    Object.assign(formData, {
      title: newAnnouncement.title,
      type: newAnnouncement.type,
      content: newAnnouncement.content,
      publishTime: new Date(newAnnouncement.publishTime),
      isActive: newAnnouncement.isActive
    })
  } else if (props.mode === 'add') {
    // 重置表单数据
    Object.keys(formData).forEach(key => {
      if (key === 'type') {
        formData.type = 'info'
      } else if (key === 'publishTime') {
        formData.publishTime = new Date()
      } else if (key === 'isActive') {
        formData.isActive = true
      } else {
        (formData as any)[key] = ''
      }
    })
  }
}, { immediate: true })

// 处理方法
const insertText = (text: string) => {
  const textarea = document.querySelector('.editor-container textarea')
  if (textarea) {
    const start = (textarea as HTMLTextAreaElement).selectionStart
    const end = (textarea as HTMLTextAreaElement).selectionEnd
    const currentValue = formData.content
    formData.content = currentValue.substring(0, start) + text + currentValue.substring(end)
    
    // 聚焦并移动光标到插入文本后
    nextTick(() => {
      (textarea as HTMLTextAreaElement).focus()
      const newCursorPos = start + text.length
      ;(textarea as HTMLTextAreaElement).setSelectionRange(newCursorPos, newCursorPos)
    })
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate()
  if (!valid) return

  // 准备提交数据
  const submitData = {
    ...formData,
    publishTime: formData.publishTime.toISOString()
  }

  emit('submit', submitData)
}

const handleCancel = () => {
  emit('cancel')
}

const handlePreview = () => {
  emit('preview', formData)
}
</script>

<style scoped>
.announcement-editor {
  padding: 20px;
}

.editor-container {
  position: relative;
}

.editor-toolbar {
  margin-top: 10px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 12px;
}
</style>