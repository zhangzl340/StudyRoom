<!-- 座位项组件 -->
<template>
  <div 
    class="seat-item" 
    :class="[seatStatus, seatType, { selectable, selected, disabled: !seat.isActive }]"
    :style="seatStyle"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="seat-content">
      <div class="seat-icon">
        <slot name="icon">
          <div class="default-icon">
            {{ seatIcon }}
          </div>
        </slot>
      </div>
      <div class="seat-info">
        <div class="seat-number">{{ seat.seatNumber }}</div>
        <div class="seat-name" v-if="seat.name">{{ seat.name }}</div>
        <div class="seat-status-text">{{ statusText }}</div>
        <div class="seat-features" v-if="showFeatures && seat.features?.length">
          <span class="feature-tag" v-for="feature in seat.features" :key="feature">
            {{ featureLabels[feature] || feature }}
          </span>
        </div>
      </div>
    </div>
    <div class="seat-overlay" v-if="showOverlay">
      <slot name="overlay"></slot>
    </div>
    <div class="seat-badge" v-if="showBadge">
      <slot name="badge"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ISeat, SeatStatus, SeatType } from '@/types/room.types'
import { SEAT_CONSTANTS } from '@/utils/constants'

interface Props {
  // 座位数据
  seat: ISeat
  // 是否可选择
  selectable?: boolean
  // 是否被选中
  selected?: boolean
  // 是否显示特性标签
  showFeatures?: boolean
  // 是否显示徽章
  showBadge?: boolean
  // 是否显示覆盖层
  showOverlay?: boolean
  // 自定义样式
  customStyle?: Record<string, any>
  // 座位大小
  size?: 'small' | 'medium' | 'large'
}

interface Emits {
  (e: 'click', seat: ISeat): void
  (e: 'mouseenter', seat: ISeat): void
  (e: 'mouseleave', seat: ISeat): void
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  selected: false,
  showFeatures: true,
  showBadge: false,
  showOverlay: false,
  size: 'medium'
})

const emit = defineEmits<Emits>()

// 座位状态
const seatStatus = computed(() => props.seat.status)
const seatType = computed(() => props.seat.type)

// 状态文本
const statusText = computed(() => {
  return SEAT_CONSTANTS.STATUS_TEXTS[props.seat.status] || props.seat.status
})

// 座位图标
const seatIcon = computed(() => {
  const icons = {
    standard: '💺',
    window: '🪟',
    power: '🔌',
    large: '🪑',
    silent: '🤫',
    group: '👥'
  }
  return icons[props.seat.type] || '💺'
})

// 特性标签
const featureLabels = computed(() => ({
  power: '电源',
  wifi: 'WiFi',
  lamp: '台灯',
  usb: 'USB',
  air_conditioner: '空调',
  quiet_zone: '静音区'
}))

// 座位样式
const seatStyle = computed(() => {
  const baseStyle = {
    cursor: props.selectable ? 'pointer' : 'default',
    backgroundColor: SEAT_CONSTANTS.STATUS_COLORS[props.seat.status] || '#dcdfe6',
    ...props.customStyle
  }
  
  // 根据大小调整样式
  const sizeStyles = {
    small: {
      padding: '8px',
      fontSize: '12px'
    },
    medium: {
      padding: '12px',
      fontSize: '14px'
    },
    large: {
      padding: '16px',
      fontSize: '16px'
    }
  }
  
  return { ...baseStyle, ...sizeStyles[props.size] }
})

// 事件处理
const handleClick = () => {
  if (props.selectable && props.seat.isActive) {
    emit('click', props.seat)
  }
}

const handleMouseEnter = () => {
  emit('mouseenter', props.seat)
}

const handleMouseLeave = () => {
  emit('mouseleave', props.seat)
}
</script>

<style scoped>
.seat-item {
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.seat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.seat-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.seat-info {
  text-align: center;
  color: white;
}

.seat-number {
  font-weight: 600;
  font-size: 1.1em;
  margin-bottom: 4px;
}

.seat-name {
  font-size: 0.9em;
  opacity: 0.9;
  margin-bottom: 2px;
}

.seat-status-text {
  font-size: 0.8em;
  opacity: 0.8;
  margin-top: 4px;
}

.seat-features {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
  justify-content: center;
}

.feature-tag {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7em;
}

/* 状态样式 */
.seat-item.available {
  background-color: #67c23a !important;
}

.seat-item.occupied {
  background-color: #f56c6c !important;
}

.seat-item.reserved {
  background-color: #e6a23c !important;
}

.seat-item.temp_leave {
  background-color: #409eff !important;
}

.seat-item.maintenance {
  background-color: #909399 !important;
}

.seat-item.disabled {
  background-color: #dcdfe6 !important;
  opacity: 0.5;
}

/* 交互样式 */
.seat-item.selectable:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.seat-item.selected {
  border-color: white;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.5);
}

.seat-item.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 覆盖层 */
.seat-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

/* 徽章 */
.seat-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #f56c6c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .seat-item {
    padding: 8px !important;
    font-size: 12px !important;
  }
  
  .seat-icon {
    font-size: 20px;
    margin-bottom: 6px;
  }
  
  .seat-features {
    display: none;
  }
}
</style>