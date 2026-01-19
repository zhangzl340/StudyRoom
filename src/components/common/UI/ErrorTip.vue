<template>
  <div class="error-tip" :class="[type, size, { closable: closable && !closed }]">
    <div class="error-content">
      <div class="error-icon">
        <el-icon v-if="type === 'error'"><CircleCloseFilled /></el-icon>
        <el-icon v-if="type === 'warning'"><WarningFilled /></el-icon>
        <el-icon v-if="type === 'info'"><InfoFilled /></el-icon>
      </div>
      <div class="error-message">
        <div class="error-title" v-if="title">{{ title }}</div>
        <div class="error-description">{{ message }}</div>
        <div class="error-details" v-if="details">
          <details>
            <summary>查看详细信息</summary>
            <pre>{{ details }}</pre>
          </details>
        </div>
        <div class="error-actions" v-if="showRetry || showAction">
          <el-button 
            v-if="showRetry" 
            :size="buttonSize" 
            :loading="retryLoading"
            @click="handleRetry"
          >
            {{ retryText }}
          </el-button>
          <slot name="actions"></slot>
        </div>
      </div>
      <button 
        v-if="closable" 
        class="error-close" 
        @click="handleClose"
        :aria-label="closeAriaLabel"
      >
        <el-icon><Close /></el-icon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  CircleCloseFilled,
  WarningFilled,
  InfoFilled,
  Close
} from '@element-plus/icons-vue'

interface Props {
  // 错误类型
  type?: 'error' | 'warning' | 'info'
  // 标题
  title?: string
  // 错误消息
  message: string
  // 详细信息
  details?: string
  // 是否可关闭
  closable?: boolean
  // 关闭按钮的aria标签
  closeAriaLabel?: string
  // 大小
  size?: 'small' | 'medium' | 'large'
  // 是否显示重试按钮
  showRetry?: boolean
  // 重试按钮文本
  retryText?: string
  // 重试按钮加载状态
  retryLoading?: boolean
  // 是否显示操作按钮区域
  showAction?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'retry'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'error',
  closable: true,
  closeAriaLabel: '关闭错误提示',
  size: 'medium',
  showRetry: false,
  retryText: '重试',
  retryLoading: false,
  showAction: false
})

const emit = defineEmits<Emits>()
const closed = ref(false)

const buttonSize = computed(() => {
  const sizeMap = {
    small: 'small',
    medium: 'default',
    large: 'large'
  }
  return sizeMap[props.size] || 'default'
})

const handleClose = () => {
  closed.value = true
  emit('close')
}

const handleRetry = () => {
  emit('retry')
}
</script>

<style scoped>
.error-tip {
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  transition: all 0.3s ease;
}

.error-tip.error {
  background-color: #fef0f0;
  border: 1px solid #fde2e2;
  color: #f56c6c;
}

.error-tip.warning {
  background-color: #fdf6ec;
  border: 1px solid #faecd8;
  color: #e6a23c;
}

.error-tip.info {
  background-color: #f0f9ff;
  border: 1px solid #d9ecff;
  color: #409eff;
}

.error-tip.small {
  padding: 12px;
  font-size: 13px;
}

.error-tip.medium {
  padding: 16px;
  font-size: 14px;
}

.error-tip.large {
  padding: 20px;
  font-size: 15px;
}

.error-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.error-icon {
  flex-shrink: 0;
  font-size: 20px;
  line-height: 1;
}

.error-icon .el-icon {
  font-size: inherit;
}

.error-message {
  flex: 1;
  min-width: 0;
}

.error-title {
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 15px;
}

.error-description {
  line-height: 1.5;
  margin-bottom: 12px;
}

.error-details {
  margin-top: 12px;
}

.error-details summary {
  cursor: pointer;
  color: inherit;
  font-size: 13px;
  user-select: none;
  margin-bottom: 8px;
}

.error-details pre {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  overflow-x: auto;
  margin: 0;
  line-height: 1.4;
}

.error-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.error-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: 0.7;
  transition: opacity 0.3s, background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-close:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.05);
}

.error-tip.closable {
  padding-right: 40px;
  position: relative;
}

.error-tip.closable .error-close {
  position: absolute;
  top: 16px;
  right: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .error-icon {
    align-self: flex-start;
  }
  
  .error-tip.closable .error-close {
    position: relative;
    top: 0;
    right: 0;
    align-self: flex-end;
  }
  
  .error-tip.closable {
    padding-right: 16px;
  }
}
</style>