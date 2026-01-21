<!-- 座位布局编辑器 -->
<template>
  <div class="seat-layout-editor">
    <!-- 编辑器头部 -->
    <div class="editor-header">
      <div class="header-left">
        <h3>{{ room?.name }} - 座位布局编辑器</h3>
        <p class="subtitle">拖动座位调整位置，右键点击座位进行更多操作</p>
      </div>
      <div class="header-right">
        <el-button-group>
          <el-button type="primary" @click="saveLayout">
            <el-icon><Check /></el-icon>
            保存布局
          </el-button>
          <el-button type="success" @click="autoLayout">
            <el-icon><MagicStick /></el-icon>
            自动布局
          </el-button>
          <el-button type="warning" @click="resetLayout">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
          <el-button type="info" @click="showHelp">
            <el-icon><QuestionFilled /></el-icon>
            帮助
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 编辑区域 -->
    <div class="editor-container">
      <!-- 左侧工具栏 -->
      <div class="toolbar">
        <div class="toolbar-section">
          <h4>座位类型</h4>
          <div class="seat-types">
            <div
              v-for="type in seatTypes"
              :key="type.value"
              class="seat-type-item"
              :class="{ active: selectedSeatType === type.value }"
              @click="selectSeatType(type.value)"
            >
              <div class="seat-preview" :style="{ backgroundColor: type.color }"></div>
              <span>{{ type.label }}</span>
            </div>
          </div>
        </div>

        <div class="toolbar-section">
          <h4>座位操作</h4>
          <div class="seat-actions">
            <el-button type="primary" @click="addSeat" size="small" style="margin-bottom: 8px">
              <el-icon><Plus /></el-icon>
              添加座位
            </el-button>
            <el-button type="success" @click="addRow" size="small" style="margin-bottom: 8px">
              <el-icon><Sort /></el-icon>
              添加整行
            </el-button>
            <el-button type="warning" @click="clearSelection" size="small" style="margin-bottom: 8px">
              <el-icon><CloseBold /></el-icon>
              清除选择
            </el-button>
            <el-button type="danger" @click="deleteSelected" size="small">
              <el-icon><Delete /></el-icon>
              删除选中
            </el-button>
          </div>
        </div>

        <div class="toolbar-section">
          <h4>布局设置</h4>
          <div class="layout-settings">
            <div class="setting-item">
              <span>行数:</span>
              <el-input-number
                v-model="layoutConfig.rows"
                :min="1"
                :max="20"
                size="small"
                @change="updateLayout"
              />
            </div>
            <div class="setting-item">
              <span>列数:</span>
              <el-input-number
                v-model="layoutConfig.columns"
                :min="1"
                :max="20"
                size="small"
                @change="updateLayout"
              />
            </div>
            <div class="setting-item">
              <span>座位宽度:</span>
              <el-input-number
                v-model="layoutConfig.cellWidth"
                :min="30"
                :max="100"
                size="small"
                @change="updateLayout"
              />
            </div>
            <div class="setting-item">
              <span>座位高度:</span>
              <el-input-number
                v-model="layoutConfig.cellHeight"
                :min="30"
                :max="100"
                size="small"
                @change="updateLayout"
              />
            </div>
            <div class="setting-item">
              <span>间距:</span>
              <el-input-number
                v-model="layoutConfig.gridGap"
                :min="0"
                :max="20"
                size="small"
                @change="updateLayout"
              />
            </div>
          </div>
        </div>

        <div class="toolbar-section">
          <h4>座位属性</h4>
          <div class="seat-properties" v-if="selectedSeat">
            <el-form label-width="80px" size="small">
              <el-form-item label="座位编号">
                <el-input v-model="selectedSeat.seatNumber" />
              </el-form-item>
              <el-form-item label="座位名称">
                <el-input v-model="selectedSeat.name" />
              </el-form-item>
              <el-form-item label="座位类型">
                <el-select v-model="selectedSeat.type" style="width: 100%">
                  <el-option
                    v-for="type in seatTypes"
                    :key="type.value"
                    :label="type.label"
                    :value="type.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="座位状态">
                <el-select v-model="selectedSeat.status" style="width: 100%">
                  <el-option label="可用" value="available" />
                  <el-option label="维修中" value="maintenance" />
                  <el-option label="已禁用" value="disabled" />
                </el-select>
              </el-form-item>
              <el-form-item label="特性">
                <el-select
                  v-model="selectedSeat.features"
                  multiple
                  style="width: 100%"
                >
                  <el-option label="有电源" value="power" />
                  <el-option label="靠窗" value="window" />
                  <el-option label="宽敞" value="large" />
                  <el-option label="静音区" value="silent" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div v-else class="no-selection">
            <el-empty description="请选择一个座位以编辑属性" :image-size="60" />
          </div>
        </div>
      </div>

      <!-- 右侧画布 -->
      <div class="canvas-container">
        <div class="canvas-controls">
          <div class="zoom-controls">
            <el-button-group>
              <el-button @click="zoomOut" size="small">
                <el-icon><Minus /></el-icon>
              </el-button>
              <el-button @click="zoomReset" size="small">
                {{ Math.round(zoom * 100) }}%
              </el-button>
              <el-button @click="zoomIn" size="small">
                <el-icon><Plus /></el-icon>
              </el-button>
            </el-button-group>
          </div>
          <div class="grid-controls">
            <el-checkbox v-model="showGrid">显示网格</el-checkbox>
            <el-checkbox v-model="snapToGrid">对齐网格</el-checkbox>
          </div>
        </div>

        <div
          class="canvas-wrapper"
          @dragover.prevent
          @drop="handleDrop"
          ref="canvasWrapperRef"
        >
          <div
            class="canvas"
            :style="{
              width: canvasWidth + 'px',
              height: canvasHeight + 'px',
              transform: `scale(${zoom})`,
              'transform-origin': 'top left'
            }"
          >
            <!-- 网格背景 -->
            <div
              v-if="showGrid"
              class="grid-background"
              :style="{
                backgroundSize: `${layoutConfig.cellWidth + layoutConfig.gridGap}px ${layoutConfig.cellHeight + layoutConfig.gridGap}px`,
                backgroundImage: `linear-gradient(to right, #e0e0e0 1px, transparent 1px),
                                 linear-gradient(to bottom, #e0e0e0 1px, transparent 1px)`
              }"
            ></div>

            <!-- 座位元素 -->
            <div
              v-for="seat in seats"
              :key="seat.id"
              class="seat-element"
              :style="{
                left: seat.x + 'px',
                top: seat.y + 'px',
                width: layoutConfig.cellWidth + 'px',
                height: layoutConfig.cellHeight + 'px',
                backgroundColor: getSeatColor(seat),
                borderColor: getSeatBorderColor(seat)
              }"
              :class="{
                selected: seat.id === selectedSeatId,
                [seat.status]: true,
                [seat.type]: true
              }"
              draggable="true"
              @dragstart="handleDragStart(seat, $event)"
              @dragend="handleDragEnd"
              @click="selectSeat(seat)"
              @contextmenu.prevent="showSeatContextMenu(seat, $event)"
            >
              <div class="seat-content">
                <div class="seat-number">{{ seat.seatNumber }}</div>
                <div class="seat-status-icon">
                  <el-icon v-if="seat.status === 'maintenance'"><Tools /></el-icon>
                  <el-icon v-else-if="seat.status === 'disabled'"><CloseBold /></el-icon>
                  <el-icon v-else-if="seat.type === 'power'"><Lightning /></el-icon>
                  <el-icon v-else-if="seat.type === 'window'"><Sunny /></el-icon>
                </div>
              </div>
            </div>

            <!-- 坐标轴标签 -->
            <div class="row-labels">
              <div
                v-for="row in layoutConfig.rows"
                :key="row"
                class="row-label"
                :style="{ top: (row - 1) * (layoutConfig.cellHeight + layoutConfig.gridGap) + 'px' }"
              >
                {{ row }}行
              </div>
            </div>
            <div class="column-labels">
              <div
                v-for="col in layoutConfig.columns"
                :key="col"
                class="column-label"
                :style="{ left: (col - 1) * (layoutConfig.cellWidth + layoutConfig.gridGap) + 'px' }"
              >
                {{ col }}列
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="status-bar">
      <div class="status-info">
        <span>座位总数: {{ seats.length }}</span>
        <span>选中: {{ selectedSeatId ? 1 : 0 }}</span>
        <span>当前位置: {{ currentPosition.x }}, {{ currentPosition.y }}</span>
      </div>
      <div class="status-actions">
        <el-button type="text" @click="emit('cancel')">取消</el-button>
        <el-button type="primary" @click="saveLayout">保存并退出</el-button>
      </div>
    </div>

    <!-- 上下文菜单 -->
    <div
      v-if="contextMenu.visible"
      class="context-menu"
      :style="{
        left: contextMenu.x + 'px',
        top: contextMenu.y + 'px'
      }"
      @click="contextMenu.visible = false"
    >
      <div class="context-menu-item" @click="duplicateSeat(contextMenu.seat)">
        <el-icon><DocumentCopy /></el-icon>
        复制座位
      </div>
      <div class="context-menu-item" @click="changeSeatType(contextMenu.seat, 'standard')">
        <el-icon><Refresh /></el-icon>
        设为标准座位
      </div>
      <div class="context-menu-item" @click="changeSeatType(contextMenu.seat, 'power')">
        <el-icon><Lightning /></el-icon>
        设为电源座位
      </div>
      <div class="context-menu-item" @click="changeSeatType(contextMenu.seat, 'window')">
        <el-icon><Sunny /></el-icon>
        设为靠窗座位
      </div>
      <div class="context-menu-item danger" @click="deleteSeat(contextMenu.seat)">
        <el-icon><Delete /></el-icon>
        删除座位
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import type { IRoom, ISeat, SeatType, SeatStatus } from '@/types/room.types'
import {
  Check,
  MagicStick,
  Refresh,
  QuestionFilled,
  Plus,
  Sort,
  CloseBold,
  Delete,
  Minus,
  Tools,
  Lightning,
  Sunny,
  DocumentCopy
} from '@element-plus/icons-vue'

const props = defineProps<{
  room: IRoom
}>()

const emit = defineEmits<{
  save: [layout: any]
  cancel: []
}>()

// 座位类型定义
const seatTypes = [
  { value: 'standard', label: '标准座位', color: '#67c23a' },
  { value: 'window', label: '靠窗座位', color: '#409eff' },
  { value: 'power', label: '电源座位', color: '#e6a23c' },
  { value: 'large', label: '宽敞座位', color: '#f56c6c' },
  { value: 'silent', label: '静音座位', color: '#909399' },
  { value: 'group', label: '小组座位', color: '#b37feb' }
]

// 布局配置
const layoutConfig = reactive({
  rows: 8,
  columns: 10,
  cellWidth: 60,
  cellHeight: 60,
  gridGap: 10
})

// 座位数据
const seats = ref<ISeat[]>([
  {
    id: '1',
    roomId: props.room.id,
    seatNumber: 'A01',
    name: '靠窗电源位',
    type: 'power',
    status: 'available',
    position: { row: 1, column: 1, x: 0, y: 0 },
    features: ['power', 'window'],
    isActive: true,
    createdAt: '',
    updatedAt: ''
  },
  {
    id: '2',
    roomId: props.room.id,
    seatNumber: 'A02',
    name: '',
    type: 'standard',
    status: 'available',
    position: { row: 1, column: 2, x: 70, y: 0 },
    features: [],
    isActive: true,
    createdAt: '',
    updatedAt: ''
  },
  // 更多座位数据...
])

// 选中状态
const selectedSeatType = ref<SeatType>('standard')
const selectedSeatId = ref<string | null>(null)
const selectedSeat = computed(() => {
  return seats.value.find(seat => seat.id === selectedSeatId.value) || null
})

// 视图状态
const zoom = ref(1)
const showGrid = ref(true)
const snapToGrid = ref(true)
const draggingSeat = ref<ISeat | null>(null)

// 上下文菜单
const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  seat: null as ISeat | null
})

// 当前鼠标位置
const currentPosition = reactive({ x: 0, y: 0 })

// 计算属性
const canvasWrapperRef = ref<HTMLDivElement>()
const canvasWidth = computed(() => {
  return layoutConfig.columns * (layoutConfig.cellWidth + layoutConfig.gridGap) - layoutConfig.gridGap
})
const canvasHeight = computed(() => {
  return layoutConfig.rows * (layoutConfig.cellHeight + layoutConfig.gridGap) - layoutConfig.gridGap
})

// 座位颜色
const getSeatColor = (seat: ISeat) => {
  const type = seatTypes.find(t => t.value === seat.type)
  if (!type) return '#67c23a'
  
  // 根据状态调整颜色
  if (seat.status === 'maintenance') return '#909399'
  if (seat.status === 'disabled') return '#dcdfe6'
  
  return type.color
}

const getSeatBorderColor = (seat: ISeat) => {
  if (seat.status === 'maintenance') return '#909399'
  if (seat.status === 'disabled') return '#dcdfe6'
  if (seat.features.includes('power')) return '#e6a23c'
  if (seat.features.includes('window')) return '#409eff'
  return '#dcdfe6'
}

// 事件处理
const handleDragStart = (seat: ISeat, event: DragEvent) => {
  draggingSeat.value = seat
  event.dataTransfer?.setData('text/plain', seat.id)
}

const handleDragEnd = () => {
  draggingSeat.value = null
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  if (!draggingSeat.value || !canvasWrapperRef.value) return
  
  const rect = canvasWrapperRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left - layoutConfig.cellWidth / 2
  const y = event.clientY - rect.top - layoutConfig.cellHeight / 2
  
  // 对齐网格
  let newX = x
  let newY = y
  
  if (snapToGrid.value) {
    const cellWidth = layoutConfig.cellWidth + layoutConfig.gridGap
    const cellHeight = layoutConfig.cellHeight + layoutConfig.gridGap
    
    newX = Math.round(x / cellWidth) * cellWidth
    newY = Math.round(y / cellHeight) * cellHeight
    
    // 确保不超出边界
    newX = Math.max(0, Math.min(newX, canvasWidth.value - layoutConfig.cellWidth))
    newY = Math.max(0, Math.min(newY, canvasHeight.value - layoutConfig.cellHeight))
  }
  
  // 更新座位位置
  const index = seats.value.findIndex(s => s.id === draggingSeat.value!.id)
  if (index !== -1) {
    seats.value[index] = {
      ...seats.value[index],
      x: newX,
      y: newY,
      position: {
        row: Math.floor(newY / (layoutConfig.cellHeight + layoutConfig.gridGap)) + 1,
        column: Math.floor(newX / (layoutConfig.cellWidth + layoutConfig.gridGap)) + 1,
        x: newX,
        y: newY
      }
    }
  }
}

const selectSeatType = (type: SeatType) => {
  selectedSeatType.value = type
}

const selectSeat = (seat: ISeat) => {
  selectedSeatId.value = seat.id
  contextMenu.visible = false
}

const clearSelection = () => {
  selectedSeatId.value = null
}

const addSeat = () => {
  const newSeat: ISeat = {
    id: Date.now().toString(),
    roomId: props.room.id,
    seatNumber: `S${seats.value.length + 1}`,
    name: '',
    type: selectedSeatType.value,
    status: 'available',
    position: { row: 1, column: 1, x: 0, y: 0 },
    features: [],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  seats.value.push(newSeat)
  selectedSeatId.value = newSeat.id
}

const addRow = () => {
  const newRow = layoutConfig.rows + 1
  const rowSeats = []
  
  for (let col = 1; col <= layoutConfig.columns; col++) {
    rowSeats.push({
      id: Date.now().toString() + col,
      roomId: props.room.id,
      seatNumber: `${String.fromCharCode(64 + newRow)}${col.toString().padStart(2, '0')}`,
      name: '',
      type: 'standard',
      status: 'available',
      position: {
        row: newRow,
        column: col,
        x: (col - 1) * (layoutConfig.cellWidth + layoutConfig.gridGap),
        y: (newRow - 1) * (layoutConfig.cellHeight + layoutConfig.gridGap)
      },
      features: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
  
  seats.value.push(...rowSeats)
  layoutConfig.rows = newRow
}

const deleteSelected = () => {
  if (selectedSeatId.value) {
    seats.value = seats.value.filter(seat => seat.id !== selectedSeatId.value)
    selectedSeatId.value = null
  }
}

const updateLayout = () => {
  // 重新计算座位位置
  seats.value.forEach(seat => {
    seat.x = (seat.position.column - 1) * (layoutConfig.cellWidth + layoutConfig.gridGap)
    seat.y = (seat.position.row - 1) * (layoutConfig.cellHeight + layoutConfig.gridGap)
  })
}

const showSeatContextMenu = (seat: ISeat, event: MouseEvent) => {
  event.preventDefault()
  contextMenu.seat = seat
  contextMenu.x = event.clientX
  contextMenu.y = event.clientY
  contextMenu.visible = true
  selectedSeatId.value = seat.id
}

const duplicateSeat = (seat: ISeat) => {
  const newSeat = {
    ...seat,
    id: Date.now().toString(),
    seatNumber: `${seat.seatNumber}-copy`,
    x: seat.x + layoutConfig.cellWidth + layoutConfig.gridGap,
    y: seat.y,
    position: {
      ...seat.position,
      column: seat.position.column + 1,
      x: seat.x + layoutConfig.cellWidth + layoutConfig.gridGap,
      y: seat.y
    }
  }
  seats.value.push(newSeat)
  contextMenu.visible = false
}

const changeSeatType = (seat: ISeat, type: SeatType) => {
  const index = seats.value.findIndex(s => s.id === seat.id)
  if (index !== -1) {
    seats.value[index].type = type
  }
  contextMenu.visible = false
}

const deleteSeat = (seat: ISeat) => {
  seats.value = seats.value.filter(s => s.id !== seat.id)
  if (selectedSeatId.value === seat.id) {
    selectedSeatId.value = null
  }
  contextMenu.visible = false
}

// 视图控制
const zoomIn = () => {
  zoom.value = Math.min(zoom.value + 0.1, 2)
}

const zoomOut = () => {
  zoom.value = Math.max(zoom.value - 0.1, 0.5)
}

const zoomReset = () => {
  zoom.value = 1
}

// 布局操作
const autoLayout = () => {
  // 生成标准网格布局
  seats.value = []
  for (let row = 1; row <= layoutConfig.rows; row++) {
    for (let col = 1; col <= layoutConfig.columns; col++) {
      seats.value.push({
        id: `${row}-${col}`,
        roomId: props.room.id,
        seatNumber: `${String.fromCharCode(64 + row)}${col.toString().padStart(2, '0')}`,
        name: '',
        type: 'standard',
        status: 'available',
        position: {
          row,
          column: col,
          x: (col - 1) * (layoutConfig.cellWidth + layoutConfig.gridGap),
          y: (row - 1) * (layoutConfig.cellHeight + layoutConfig.gridGap)
        },
        features: [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }
  }
}

const resetLayout = () => {
  if (confirm('确定要重置布局吗？所有未保存的更改将丢失。')) {
    seats.value = []
    layoutConfig.rows = 8
    layoutConfig.columns = 10
    selectedSeatId.value = null
  }
}

const saveLayout = () => {
  const layoutData = {
    roomId: props.room.id,
    layout: layoutConfig,
    seats: seats.value.map(seat => ({
      ...seat,
      position: {
        row: Math.floor(seat.y / (layoutConfig.cellHeight + layoutConfig.gridGap)) + 1,
        column: Math.floor(seat.x / (layoutConfig.cellWidth + layoutConfig.gridGap)) + 1,
        x: seat.x,
        y: seat.y
      }
    }))
  }
  
  emit('save', layoutData)
}

const showHelp = () => {
  alert(`
座位布局编辑器使用指南：
1. 点击左侧座位类型选择要添加的座位
2. 点击"添加座位"按钮在画布上添加座位
3. 拖动座位可以调整位置
4. 点击座位可以选中并编辑属性
5. 右键点击座位可以查看更多操作
6. 使用布局设置调整网格大小
  `)
}

// 鼠标移动追踪
const handleMouseMove = (event: MouseEvent) => {
  if (!canvasWrapperRef.value) return
  
  const rect = canvasWrapperRef.value.getBoundingClientRect()
  currentPosition.x = event.clientX - rect.left
  currentPosition.y = event.clientY - rect.top
}

// 点击外部关闭上下文菜单
const handleClickOutside = (event: MouseEvent) => {
  if (contextMenu.visible) {
    contextMenu.visible = false
  }
}

// 生命周期
onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('click', handleClickOutside)
  
  // 初始化画布大小
  if (props.room.layoutType === 'custom') {
    // 如果有自定义布局，加载它
    console.log('加载自定义布局')
  } else {
    // 生成默认网格布局
    autoLayout()
  }
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.seat-layout-editor {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.editor-header {
  background: white;
  padding: 16px 24px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
}

.subtitle {
  margin: 0;
  color: #909399;
  font-size: 12px;
}

.editor-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.toolbar {
  width: 280px;
  background: white;
  border-right: 1px solid #e4e7ed;
  padding: 20px;
  overflow-y: auto;
}

.toolbar-section {
  margin-bottom: 24px;
}

.toolbar-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.seat-types {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.seat-type-item {
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s;
}

.seat-type-item:hover {
  border-color: #409eff;
}

.seat-type-item.active {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.seat-preview {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-bottom: 4px;
  border: 2px solid #dcdfe6;
}

.seat-actions {
  display: flex;
  flex-direction: column;
}

.layout-settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-item span {
  font-size: 13px;
  color: #606266;
}

.seat-properties {
  padding: 12px;
  background: #fafafa;
  border-radius: 4px;
}

.no-selection {
  padding: 20px;
  text-align: center;
}

.canvas-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.canvas-controls {
  padding: 12px 24px;
  background: white;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.zoom-controls,
.grid-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.canvas-wrapper {
  flex: 1;
  overflow: auto;
  padding: 24px;
  background: #f0f2f5;
}

.canvas {
  position: relative;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
}

.seat-element {
  position: absolute;
  border: 2px solid;
  border-radius: 4px;
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  user-select: none;
}

.seat-element:hover {
  transform: scale(1.05);
  z-index: 10;
}

.seat-element.selected {
  box-shadow: 0 0 0 2px #409eff;
  z-index: 20;
}

.seat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.seat-number {
  font-size: 12px;
  font-weight: 600;
  color: #303133;
}

.seat-status-icon {
  font-size: 10px;
  margin-top: 2px;
}

.row-labels,
.column-labels {
  position: absolute;
}

.row-labels {
  left: -60px;
  top: 0;
}

.column-labels {
  top: -30px;
  left: 0;
}

.row-label,
.column-label {
  position: absolute;
  font-size: 12px;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
}

.row-label {
  width: 50px;
  height: v-bind('layoutConfig.cellHeight + "px"');
}

.column-label {
  width: v-bind('layoutConfig.cellWidth + "px"');
  height: 25px;
}

.status-bar {
  background: white;
  padding: 12px 24px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-info {
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: #606266;
}

.status-actions {
  display: flex;
  gap: 12px;
}

.context-menu {
  position: fixed;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 160px;
}

.context-menu-item {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  transition: background-color 0.3s;
}

.context-menu-item:hover {
  background-color: #f5f7fa;
}

.context-menu-item.danger {
  color: #f56c6c;
}

.context-menu-item.danger:hover {
  background-color: #fef0f0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .editor-container {
    flex-direction: column;
  }
  
  .toolbar {
    width: 100%;
    height: 300px;
    border-right: none;
    border-bottom: 1px solid #e4e7ed;
    overflow-x: auto;
    display: flex;
    gap: 24px;
  }
  
  .toolbar-section {
    min-width: 200px;
    margin-bottom: 0;
  }
}
</style>