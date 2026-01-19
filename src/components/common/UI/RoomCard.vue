<!-- 自习室卡片 -->
<template>
  <div class="room-card" :class="{ selected, disabled: !room.isActive }">
    <div class="room-image" :style="{ backgroundImage: `url(${roomImage})` }">
      <div class="room-status" :class="room.status">
        {{ roomStatusText }}
      </div>
      <div class="room-overlay" v-if="showOverlay">
        <slot name="overlay"></slot>
      </div>
    </div>
    
    <div class="room-content">
      <div class="room-header">
        <h3 class="room-name">{{ room.name }}</h3>
        <div class="room-code">{{ room.code }}</div>
      </div>
      
      <div class="room-info">
        <div class="info-item">
          <el-icon><Location /></el-icon>
          <span>{{ room.building }} {{ room.floor }}</span>
        </div>
        <div class="info-item">
          <el-icon><User /></el-icon>
          <span>容量: {{ room.capacity }}人</span>
        </div>
        <div class="info-item">
          <el-icon><Clock /></el-icon>
          <span>{{ room.openTime }} - {{ room.closeTime }}</span>
        </div>
      </div>
      
      <div class="room-stats">
        <div class="stat-item">
          <div class="stat-value">{{ room.availableSeats }}</div>
          <div class="stat-label">可用座位</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ occupancyRate }}%</div>
          <div class="stat-label">占用率</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ room.availableSeats }}</div>
          <div class="stat-label">剩余座位</div>
        </div>
      </div>
      
      <div class="room-features" v-if="room.features?.length">
        <el-tag
          v-for="feature in limitedFeatures"
          :key="feature"
          size="small"
          :type="getFeatureTagType(feature)"
        >
          {{ featureLabels[feature] || feature }}
        </el-tag>
        <el-tooltip 
          v-if="room.features.length > 3" 
          :content="additionalFeaturesText"
          placement="top"
        >
          <el-tag size="small" type="info">+{{ room.features.length - 3 }}</el-tag>
        </el-tooltip>
      </div>
      
      <div class="room-actions">
        <slot name="actions">
          <el-button 
            type="primary" 
            size="small" 
            :disabled="!room.isActive || room.availableSeats === 0"
            @click="handleViewDetail"
          >
            查看详情
          </el-button>
          <el-button 
            v-if="showReserveButton"
            type="success" 
            size="small"
            :disabled="!room.isActive || room.availableSeats === 0"
            @click="handleReserve"
          >
            立即预约
          </el-button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { IRoom, RoomStatus } from '@/types/room.types'
import { Location, User, Clock } from '@element-plus/icons-vue'

interface Props {
  // 自习室数据
  room: IRoom
  // 是否显示预约按钮
  showReserveButton?: boolean
  // 是否被选中
  selected?: boolean
  // 是否显示覆盖层
  showOverlay?: boolean
  // 显示的特性数量限制
  featuresLimit?: number
}

interface Emits {
  (e: 'view-detail', room: IRoom): void
  (e: 'reserve', room: IRoom): void
  (e: 'click', room: IRoom): void
}

const props = withDefaults(defineProps<Props>(), {
  showReserveButton: true,
  selected: false,
  showOverlay: false,
  featuresLimit: 3
})

const emit = defineEmits<Emits>()
const router = useRouter()

// 自习室图片
const roomImage = computed(() => {
  return props.room.imageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
})

// 自习室状态文本
const roomStatusText = computed(() => {
  const statusMap: Record<RoomStatus, string> = {
    open: '开放中',
    closed: '已关闭',
    maintenance: '维护中'
  }
  return statusMap[props.room.status] || props.room.status
})

// 占用率
const occupancyRate = computed(() => {
  if (props.room.capacity === 0) return 0
  const used = props.room.capacity - props.room.availableSeats
  return Math.round((used / props.room.capacity) * 100)
})

// 特性标签
const featureLabels = computed(() => ({
  wifi: 'WiFi',
  air_conditioner: '空调',
  power_sockets: '电源插座',
  printing: '打印服务',
  computers: '电脑设备',
  quiet_zone: '静音区',
  group_study: '小组学习'
}))

// 限制显示的特性数量
const limitedFeatures = computed(() => {
  return props.room.features?.slice(0, props.featuresLimit) || []
})

// 额外的特性文本
const additionalFeaturesText = computed(() => {
  const additional = props.room.features?.slice(props.featuresLimit) || []
  return additional.map(f => featureLabels.value[f] || f).join(', ')
})

// 获取特性标签类型
const getFeatureTagType = (feature: string) => {
  const typeMap: Record<string, any> = {
    wifi: 'success',
    air_conditioner: 'info',
    power_sockets: 'warning',
    printing: '',
    computers: 'danger'
  }
  return typeMap[feature] || 'info'
}

// 事件处理
const handleViewDetail = () => {
  emit('view-detail', props.room)
  router.push(`/room/${props.room.id}`)
}

const handleReserve = () => {
  emit('reserve', props.room)
}
</script>

<style scoped>
.room-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.room-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.room-card.selected {
  border: 2px solid #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.2);
}

.room-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.room-card.disabled:hover {
  transform: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.room-image {
  height: 180px;
  background-size: cover;
  background-position: center;
  background-color: #f5f7fa;
  position: relative;
}

.room-status {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.room-status.open {
  background-color: #67c23a;
}

.room-status.closed {
  background-color: #909399;
}

.room-status.maintenance {
  background-color: #e6a23c;
}

.room-overlay {
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

.room-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.room-header {
  margin-bottom: 16px;
}

.room-name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.room-code {
  font-size: 13px;
  color: #909399;
  font-weight: 500;
}

.room-info {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}

.info-item .el-icon {
  color: #909399;
  font-size: 16px;
}

.room-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #409eff;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.room-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.room-actions {
  margin-top: auto;
  display: flex;
  gap: 10px;
}

.room-actions .el-button {
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .room-card {
    margin-bottom: 20px;
  }
  
  .room-image {
    height: 150px;
  }
  
  .room-stats {
    padding: 12px;
    gap: 8px;
  }
  
  .stat-value {
    font-size: 18px;
  }
  
  .room-actions {
    flex-direction: column;
  }
  
  .room-actions .el-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .room-features {
    display: none;
  }
  
  .room-stats {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>