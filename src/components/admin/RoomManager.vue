<!-- 自习室管理 -->
<template>
  <div class="room-manager">
    <!-- 搜索和筛选区域 -->
    <div class="filter-section">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索自习室名称/编号/楼栋"
            clearable
            size="large"
            @input="handleSearch"
            @clear="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        
        <el-col :xs="24" :sm="12" :md="4">
          <el-select
            v-model="filterBuilding"
            placeholder="楼栋筛选"
            clearable
            size="large"
            style="width: 100%"
            @change="handleFilter"
          >
            <el-option label="图书馆" value="library" />
            <el-option label="信息楼" value="info_building" />
            <el-option label="实验楼" value="lab_building" />
            <el-option label="教学楼" value="teaching_building" />
          </el-select>
        </el-col>
        
        <el-col :xs="24" :sm="12" :md="4">
          <el-select
            v-model="filterStatus"
            placeholder="状态筛选"
            clearable
            size="large"
            style="width: 100%"
            @change="handleFilter"
          >
            <el-option label="开放中" value="open" />
            <el-option label="已关闭" value="closed" />
            <el-option label="维护中" value="maintenance" />
          </el-select>
        </el-col>
        
        <el-col :xs="24" :sm="12" :md="4">
          <el-input
            v-model="filterFloor"
            placeholder="楼层筛选"
            clearable
            size="large"
            @input="handleFilter"
            @clear="handleFilter"
          />
        </el-col>
        
        <el-col :xs="24" :sm="12" :md="6">
          <el-button
            type="primary"
            size="large"
            @click="handleAddRoom"
            style="width: 100%"
          >
            <el-icon><Plus /></el-icon>
            添加自习室
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 自习室卡片列表 -->
    <div class="rooms-grid" v-if="viewMode === 'grid'">
      <el-row :gutter="20">
        <el-col
          v-for="room in paginatedRooms"
          :key="room.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <room-card
            :room="room"
            @edit="handleEditRoom"
            @delete="handleDeleteRoom"
            @manage-seats="handleManageSeats"
          />
        </el-col>
      </el-row>
    </div>

    <!-- 自习室表格列表 -->
    <div class="rooms-table" v-else>
      <el-table
        :data="paginatedRooms"
        v-loading="loading"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column label="自习室信息" min-width="250">
          <template #default="scope">
            <div class="room-info-cell">
              <div class="room-icon">
                <span class="icon">🏫</span>
              </div>
              <div class="room-details">
                <div class="room-name">
                  <span class="name">{{ scope.row.name }}</span>
                  <el-tag size="small" :type="getStatusTagType(scope.row.status)">
                    {{ formatStatus(scope.row.status) }}
                  </el-tag>
                </div>
                <div class="room-meta">
                  <span class="meta-item">
                    <el-icon><Location /></el-icon>
                    {{ scope.row.building }}-{{ scope.row.floor }}层
                  </span>
                  <span class="meta-item">
                    <el-icon><OfficeBuilding /></el-icon>
                    {{ scope.row.code }}
                  </span>
                </div>
                <div class="room-capacity">
                  <span class="capacity-item">
                    <el-icon><User /></el-icon>
                    容量: {{ scope.row.capacity }}人
                  </span>
                  <span class="capacity-item">
                    <el-icon><Box /></el-icon>
                    可用: {{ scope.row.availableSeats || scope.row.capacity }}座
                  </span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="开放时间" width="160">
          <template #default="scope">
            <div class="time-info">
              <div>{{ scope.row.openTime.slice(0, 5) }} - {{ scope.row.closeTime.slice(0, 5) }}</div>
              <div class="time-status" :class="getTimeStatusClass(scope.row)">
                {{ getTimeStatusText(scope.row) }}
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="使用统计" width="120">
          <template #default="scope">
            <div class="usage-stats">
              <div class="stat-item">
                <el-progress 
                  :percentage="getUsageRate(scope.row)" 
                  :show-text="false"
                  :color="getUsageColor(getUsageRate(scope.row))"
                  style="margin-bottom: 5px"
                />
                <span class="stat-text">使用率: {{ getUsageRate(scope.row) }}%</span>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="特性" width="180">
          <template #default="scope">
            <div class="features-list">
              <el-tag
                v-for="feature in getFeaturesDisplay(scope.row.features)"
                :key="feature"
                size="small"
                class="feature-tag"
              >
                {{ feature }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="scope">
            <div class="action-buttons">
              <el-button
                type="primary"
                link
                size="small"
                @click="handleEditRoom(scope.row)"
              >
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              
              <el-button
                type="success"
                link
                size="small"
                @click="handleManageSeats(scope.row)"
              >
                <el-icon><Grid /></el-icon>
                座位管理
              </el-button>
              
              <el-dropdown trigger="click" @command="(command) => handleCommand(command, scope.row)">
                <el-button type="info" link size="small">
                  <el-icon><More /></el-icon>
                  更多
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="toggleStatus">
                      <el-icon v-if="scope.row.status === 'open'"><Lock /></el-icon>
                      <el-icon v-else><Unlock /></el-icon>
                      {{ scope.row.status === 'open' ? '关闭自习室' : '开放自习室' }}
                    </el-dropdown-item>
                    <el-dropdown-item command="viewDetails">
                      <el-icon><View /></el-icon>
                      查看详情
                    </el-dropdown-item>
                    <el-dropdown-item command="statistics">
                      <el-icon><PieChart /></el-icon>
                      使用统计
                    </el-dropdown-item>
                    <el-dropdown-item divided command="delete" class="danger-item">
                      <el-icon><Delete /></el-icon>
                      删除
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 视图切换和分页 -->
    <div class="view-controls">
      <div class="view-toggle">
        <el-button-group>
          <el-button
            :type="viewMode === 'grid' ? 'primary' : 'default'"
            size="small"
            @click="viewMode = 'grid'"
          >
            <el-icon><Grid /></el-icon>
            卡片视图
          </el-button>
          <el-button
            :type="viewMode === 'table' ? 'primary' : 'default'"
            size="small"
            @click="viewMode = 'table'"
          >
            <el-icon><List /></el-icon>
            列表视图
          </el-button>
        </el-button-group>
      </div>
      
      <div class="pagination-section">
        <div class="batch-actions" v-if="selectedRooms.length > 0">
          <el-button type="danger" size="small" @click="batchDelete">
            批量删除 ({{ selectedRooms.length }})
          </el-button>
          <el-button type="warning" size="small" @click="batchClose">
            批量关闭
          </el-button>
          <el-button type="success" size="small" @click="batchOpen">
            批量开放
          </el-button>
        </div>
        
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[8, 16, 24, 32]"
          :total="filteredRooms.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 自习室详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="currentRoom?.name + ' - 详情'"
      width="800px"
    >
      <room-detail-panel v-if="currentRoom" :room="currentRoom" />
    </el-dialog>

    <!-- 编辑自习室对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="isEditMode ? '编辑自习室' : '添加自习室'"
      width="600px"
    >
      <room-edit-form
        :room="currentRoom"
        :mode="isEditMode ? 'edit' : 'add'"
        @submit="handleEditSubmit"
        @cancel="editDialogVisible = false"
      />
    </el-dialog>

    <!-- 座位管理对话框 -->
    <el-dialog
      v-model="seatManageDialogVisible"
      :title="currentRoom?.name + ' - 座位管理'"
      width="1200px"
      fullscreen
    >
      <seat-layout-editor
        v-if="currentRoom"
        :room="currentRoom"
        @save="handleSaveLayout"
        @cancel="seatManageDialogVisible = false"
      />
    </el-dialog>

    <!-- 使用统计对话框 -->
    <el-dialog
      v-model="statisticsDialogVisible"
      :title="currentRoom?.name + ' - 使用统计'"
      width="900px"
    >
      <room-statistics-panel v-if="currentRoom" :room-id="currentRoom.id" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Plus,
  Edit,
  Delete,
  More,
  Grid,
  List,
  Location,
  OfficeBuilding,
  User,
  Box,
  Lock,
  Unlock,
  View,
  PieChart
} from '@element-plus/icons-vue'
import type { IRoom, RoomStatus } from '@/types/room.types'

// 导入子组件
// import RoomCard from './RoomCard.vue'
// import RoomDetailPanel from './RoomDetailPanel.vue'
// import RoomEditForm from './RoomEditForm.vue'
// import SeatLayoutEditor from './SeatLayoutEditor.vue'
// import RoomStatisticsPanel from './RoomStatisticsPanel.vue'

// 为了演示，我们先使用占位组件
const RoomCard = {
  props: ['room'],
  emits: ['edit', 'delete', 'manage-seats'],
  template: `
    <div class="room-card">
      <h3>{{ room.name }}</h3>
      <p>{{ room.building }}-{{ room.floor }}层</p>
      <button @click="$emit('edit')">编辑</button>
      <button @click="$emit('manage-seats')">座位管理</button>
    </div>
  `
}

const RoomDetailPanel = {
  props: ['room'],
  template: '<div>自习室详情组件</div>'
}

const RoomEditForm = {
  props: ['room', 'mode'],
  emits: ['submit', 'cancel'],
  template: '<div>自习室编辑表单组件</div>'
}

const SeatLayoutEditor = {
  props: ['room'],
  emits: ['save', 'cancel'],
  template: '<div>座位布局编辑器组件</div>'
}

const RoomStatisticsPanel = {
  props: ['roomId'],
  template: '<div>自习室统计组件</div>'
}

// 状态
const searchKeyword = ref('')
const filterBuilding = ref('')
const filterStatus = ref<RoomStatus | ''>('')
const filterFloor = ref('')
const viewMode = ref<'grid' | 'table'>('table')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(16)
const selectedRooms = ref<IRoom[]>([])

// 对话框状态
const detailDialogVisible = ref(false)
const editDialogVisible = ref(false)
const seatManageDialogVisible = ref(false)
const statisticsDialogVisible = ref(false)
const currentRoom = ref<IRoom | null>(null)
const isEditMode = ref(false)

// 模拟数据
const mockRooms = ref<IRoom[]>([
  {
    id: '1',
    name: '图书馆101自习室',
    code: 'LIB101',
    building: '图书馆',
    floor: '1楼',
    description: '安静学习区，提供电源和WiFi',
    capacity: 80,
    availableSeats: 65,
    openTime: '08:00:00',
    closeTime: '22:00:00',
    status: 'open',
    features: ['wifi', 'air_conditioner', 'power', 'printer'],
    imageUrl: '',
    layoutType: 'grid',
    adminIds: ['admin1'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: '信息楼201电子阅览室',
    code: 'INFO201',
    building: '信息楼',
    floor: '2楼',
    description: '配备高性能电脑，适合编程学习',
    capacity: 60,
    availableSeats: 40,
    openTime: '08:30:00',
    closeTime: '21:30:00',
    status: 'open',
    features: ['wifi', 'computer', 'air_conditioner', 'power'],
    imageUrl: '',
    layoutType: 'grid',
    adminIds: ['admin1'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T11:20:00Z'
  },
  {
    id: '3',
    name: '实验楼301静音区',
    code: 'LAB301',
    building: '实验楼',
    floor: '3楼',
    description: '完全静音环境，禁止任何交流',
    capacity: 50,
    availableSeats: 50,
    openTime: '09:00:00',
    closeTime: '22:00:00',
    status: 'open',
    features: ['wifi', 'air_conditioner', 'silent_zone'],
    imageUrl: '',
    layoutType: 'custom',
    adminIds: ['admin1'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-14T15:45:00Z'
  },
  {
    id: '4',
    name: '教学楼401小组讨论室',
    code: 'TEACH401',
    building: '教学楼',
    floor: '4楼',
    description: '适合小组讨论和团队项目',
    capacity: 30,
    availableSeats: 30,
    openTime: '08:00:00',
    closeTime: '20:00:00',
    status: 'closed',
    features: ['wifi', 'whiteboard', 'projector'],
    imageUrl: '',
    layoutType: 'custom',
    adminIds: ['admin1'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '5',
    name: '图书馆202自习室',
    code: 'LIB202',
    building: '图书馆',
    floor: '2楼',
    description: '靠窗座位，自然光线充足',
    capacity: 100,
    availableSeats: 85,
    openTime: '08:00:00',
    closeTime: '22:30:00',
    status: 'maintenance',
    features: ['wifi', 'window_seats', 'air_conditioner'],
    imageUrl: '',
    layoutType: 'grid',
    adminIds: ['admin1'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T14:10:00Z'
  }
])

// 计算属性
const filteredRooms = computed(() => {
  let rooms = mockRooms.value
  
  // 搜索关键词过滤
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase().trim()
    rooms = rooms.filter(room => 
      room.name.toLowerCase().includes(keyword) ||
      room.code.toLowerCase().includes(keyword) ||
      room.building.toLowerCase().includes(keyword) ||
      room.floor.toLowerCase().includes(keyword) ||
      (room.description && room.description.toLowerCase().includes(keyword))
    )
  }
  
  // 楼栋过滤
  if (filterBuilding.value) {
    rooms = rooms.filter(room => 
      room.building.toLowerCase() === filterBuilding.value.toLowerCase()
    )
  }
  
  // 状态过滤
  if (filterStatus.value) {
    rooms = rooms.filter(room => room.status === filterStatus.value)
  }
  
  // 楼层过滤
  if (filterFloor.value.trim()) {
    const floor = filterFloor.value.toLowerCase().trim()
    rooms = rooms.filter(room => 
      room.floor.toLowerCase().includes(floor)
    )
  }
  
  return rooms
})

const paginatedRooms = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredRooms.value.slice(start, end)
})

// 格式化函数
const formatStatus = (status: RoomStatus) => {
  const statusMap: Record<RoomStatus, string> = {
    open: '开放中',
    closed: '已关闭',
    maintenance: '维护中'
  }
  return statusMap[status] || status
}

const getStatusTagType = (status: RoomStatus) => {
  switch (status) {
    case 'open': return 'success'
    case 'closed': return 'warning'
    case 'maintenance': return 'danger'
    default: return 'info'
  }
}

const getFeaturesDisplay = (features: string[]) => {
  const featureMap: Record<string, string> = {
    wifi: 'WiFi',
    air_conditioner: '空调',
    power: '电源',
    printer: '打印机',
    computer: '电脑',
    silent_zone: '静音区',
    window_seats: '靠窗',
    whiteboard: '白板',
    projector: '投影仪'
  }
  
  return features.map(feature => featureMap[feature] || feature)
}

const getUsageRate = (room: IRoom) => {
  const available = room.availableSeats || room.capacity
  return Math.round(((room.capacity - available) / room.capacity) * 100)
}

const getUsageColor = (rate: number) => {
  if (rate < 60) return '#67c23a'
  if (rate < 85) return '#e6a23c'
  return '#f56c6c'
}

const getTimeStatusClass = (room: IRoom) => {
  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  return currentTime >= room.openTime.slice(0, 5) && currentTime <= room.closeTime.slice(0, 5) ? 'open' : 'closed'
}

const getTimeStatusText = (room: IRoom) => {
  const now = new Date()
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  return currentTime >= room.openTime.slice(0, 5) && currentTime <= room.closeTime.slice(0, 5) ? '开放中' : '已关闭'
}

// 处理方法
const handleSearch = () => {
  currentPage.value = 1
}

const handleFilter = () => {
  currentPage.value = 1
}

const handleAddRoom = () => {
  currentRoom.value = null
  isEditMode.value = false
  editDialogVisible.value = true
}

const handleEditRoom = (room: IRoom) => {
  currentRoom.value = { ...room }
  isEditMode.value = true
  editDialogVisible.value = true
}

const handleManageSeats = (room: IRoom) => {
  currentRoom.value = room
  seatManageDialogVisible.value = true
}

const handleCommand = (command: string, room: IRoom) => {
  currentRoom.value = room
  
  switch (command) {
    case 'toggleStatus':
      handleToggleStatus(room)
      break
    case 'viewDetails':
      detailDialogVisible.value = true
      break
    case 'statistics':
      statisticsDialogVisible.value = true
      break
    case 'delete':
      handleDeleteRoom(room)
      break
  }
}

const handleToggleStatus = async (room: IRoom) => {
  try {
    const newStatus = room.status === 'open' ? 'closed' : 'open'
    const action = newStatus === 'open' ? '开放' : '关闭'
    
    await ElMessageBox.confirm(
      `确定要${action}自习室 "${room.name}" 吗？`,
      `${action}确认`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 更新本地数据
    const index = mockRooms.value.findIndex(r => r.id === room.id)
    if (index !== -1) {
      mockRooms.value[index] = {
        ...mockRooms.value[index],
        status: newStatus,
        updatedAt: new Date().toISOString()
      }
    }
    
    ElMessage.success(`${action}成功`)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`操作失败: ${error}`)
    }
  }
}

const handleDeleteRoom = async (room: IRoom) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除自习室 "${room.name}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    // 删除本地数据
    mockRooms.value = mockRooms.value.filter(r => r.id !== room.id)
    selectedRooms.value = selectedRooms.value.filter(r => r.id !== room.id)
    
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`删除失败: ${error}`)
    }
  }
}

const handleSelectionChange = (selection: IRoom[]) => {
  selectedRooms.value = selection
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

const handleEditSubmit = async (roomData: Partial<IRoom>) => {
  try {
    if (isEditMode.value && currentRoom.value) {
      // 更新自习室
      const index = mockRooms.value.findIndex(r => r.id === currentRoom.value!.id)
      if (index !== -1) {
        mockRooms.value[index] = {
          ...mockRooms.value[index],
          ...roomData,
          updatedAt: new Date().toISOString()
        }
      }
      ElMessage.success('更新成功')
    } else {
      // 添加自习室
      const newRoom: IRoom = {
        id: Date.now().toString(),
        name: roomData.name || '新自习室',
        code: roomData.code || '',
        building: roomData.building || '',
        floor: roomData.floor || '',
        description: roomData.description || '',
        capacity: roomData.capacity || 50,
        availableSeats: roomData.capacity || 50,
        openTime: roomData.openTime || '08:00:00',
        closeTime: roomData.closeTime || '22:00:00',
        status: roomData.status || 'open',
        features: roomData.features || [],
        imageUrl: roomData.imageUrl || '',
        layoutType: roomData.layoutType || 'grid',
        adminIds: roomData.adminIds || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      mockRooms.value.unshift(newRoom)
      ElMessage.success('添加成功')
    }
    
    editDialogVisible.value = false
  } catch (error) {
    ElMessage.error(`操作失败: ${error}`)
  }
}

const handleSaveLayout = (layoutData: any) => {
  console.log('保存座位布局:', layoutData)
  ElMessage.success('座位布局保存成功')
  seatManageDialogVisible.value = false
}

// 批量操作
const batchDelete = async () => {
  if (selectedRooms.value.length === 0) return
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRooms.value.length} 个自习室吗？此操作不可恢复。`,
      '批量删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error'
      }
    )
    
    const idsToDelete = selectedRooms.value.map(room => room.id)
    mockRooms.value = mockRooms.value.filter(room => !idsToDelete.includes(room.id))
    selectedRooms.value = []
    
    ElMessage.success('批量删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`批量删除失败: ${error}`)
    }
  }
}

const batchClose = async () => {
  if (selectedRooms.value.length === 0) return
  
  try {
    const idsToClose = selectedRooms.value.map(room => room.id)
    mockRooms.value = mockRooms.value.map(room => {
      if (idsToClose.includes(room.id)) {
        return {
          ...room,
          status: 'closed',
          updatedAt: new Date().toISOString()
        }
      }
      return room
    })
    
    selectedRooms.value = []
    ElMessage.success('批量关闭成功')
  } catch (error) {
    ElMessage.error(`批量关闭失败: ${error}`)
  }
}

const batchOpen = async () => {
  if (selectedRooms.value.length === 0) return
  
  try {
    const idsToOpen = selectedRooms.value.map(room => room.id)
    mockRooms.value = mockRooms.value.map(room => {
      if (idsToOpen.includes(room.id)) {
        return {
          ...room,
          status: 'open',
          updatedAt: new Date().toISOString()
        }
      }
      return room
    })
    
    selectedRooms.value = []
    ElMessage.success('批量开放成功')
  } catch (error) {
    ElMessage.error(`批量开放失败: ${error}`)
  }
}

// 生命周期
onMounted(() => {
  loading.value = false
})
</script>

<style scoped>
.room-manager {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}

.filter-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.rooms-grid {
  margin-bottom: 20px;
}

.rooms-table {
  margin-bottom: 20px;
}

.room-info-cell {
  display: flex;
  align-items: center;
}

.room-icon {
  margin-right: 12px;
  font-size: 24px;
}

.room-details {
  flex: 1;
}

.room-name {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.room-name .name {
  font-weight: 600;
  font-size: 14px;
}

.room-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 6px;
  font-size: 12px;
  color: #606266;
}

.room-meta .meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.room-capacity {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #606266;
}

.room-capacity .capacity-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.time-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.time-status {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  display: inline-block;
  width: fit-content;
}

.time-status.open {
  background-color: #f0f9eb;
  color: #67c23a;
}

.time-status.closed {
  background-color: #fef0f0;
  color: #f56c6c;
}

.usage-stats {
  display: flex;
  flex-direction: column;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-text {
  font-size: 12px;
  color: #909399;
}

.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.feature-tag {
  margin: 2px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.view-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.pagination-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.batch-actions {
  display: flex;
  gap: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .view-controls {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .pagination-section {
    width: 100%;
    align-items: flex-start;
  }
  
  .room-meta,
  .room-capacity {
    flex-direction: column;
    gap: 4px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>