<!-- 空状态 -->
<template>
  <div class="empty-state" :class="{ compact }">
    <div class="empty-icon">
      <slot name="icon">
        <div class="default-icon" :style="{ fontSize: iconSize + 'px' }">
          {{ defaultIcon }}
        </div>
      </slot>
    </div>
    <div class="empty-content">
      <h3 class="empty-title" v-if="title">{{ title }}</h3>
      <p class="empty-description" v-if="description">{{ description }}</p>
      <slot name="default" v-if="$slots.default"></slot>
      <div class="empty-action" v-if="showAction && actionText">
        <el-button 
          :type="actionType" 
          :size="actionSize"
          :loading="actionLoading"
          @click="$emit('action')"
        >
          {{ actionText }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  // 标题
  title?: string
  // 描述
  description?: string
  // 图标类型
  iconType?: 'data' | 'search' | 'error' | 'success' | 'warning' | 'custom'
  // 图标大小
  iconSize?: number
  // 是否紧凑显示
  compact?: boolean
  // 操作按钮文本
  actionText?: string
  // 操作按钮类型
  actionType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  // 操作按钮大小
  actionSize?: 'large' | 'default' | 'small'
  // 操作按钮加载状态
  actionLoading?: boolean
  // 是否显示操作按钮
  showAction?: boolean
}

interface Emits {
  (e: 'action'): void
}

const props = withDefaults(defineProps<Props>(), {
  iconType: 'data',
  iconSize: 64,
  compact: false,
  actionType: 'primary',
  actionSize: 'default',
  actionLoading: false,
  showAction: false
})

const emit = defineEmits<Emits>()

// 根据类型选择默认图标
const defaultIcon = computed(() => {
  const icons = {
    data: '📊',
    search: '🔍',
    error: '❌',
    success: '✅',
    warning: '⚠️',
    custom: '📝'
  }
  return icons[props.iconType] || '📊'
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 12px;
  border: 1px dashed #dcdfe6;
}

.empty-state.compact {
  padding: 30px 20px;
}

.empty-icon {
  margin-bottom: 24px;
}

.default-icon {
  opacity: 0.6;
}

.empty-content {
  max-width: 500px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  line-height: 1.4;
}

.empty-description {
  font-size: 15px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 24px;
}

.empty-action {
  margin-top: 20px;
}

/* 特定类型的样式 */
.empty-state[data-type="search"] {
  background-color: #f0f9ff;
  border-color: #c6e2ff;
}

.empty-state[data-type="error"] {
  background-color: #fef0f0;
  border-color: #fbc4c4;
}

.empty-state[data-type="success"] {
  background-color: #f0f9eb;
  border-color: #c2e7b0;
}

.empty-state[data-type="warning"] {
  background-color: #fdf6ec;
  border-color: #f5dab1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .empty-state {
    padding: 40px 15px;
  }
  
  .empty-title {
    font-size: 18px;
  }
  
  .empty-description {
    font-size: 14px;
  }
}
</style>