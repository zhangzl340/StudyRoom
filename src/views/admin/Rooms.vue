<template>
  <div class="admin-rooms">
    <!-- 页面标题和操作 -->
    <div class="page-header">
      <div class="header-left">
        <h2>自习室管理</h2>
        <p class="subtitle">管理系统所有自习室，支持配置座位布局和管理开放时间</p>
      </div>
      <div class="header-right">
        <el-button-group>
          <el-button type="primary" @click="exportRooms">
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
          <el-button type="success" @click="generateReport">
            <el-icon><PieChart /></el-icon>
            生成报告
          </el-button>
          <el-button type="info" @click="showQuickGuide">
            <el-icon><QuestionFilled /></el-icon>
            使用指南
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="stats-overview">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="6" v-for="stat in roomStats" :key="stat.label">
          <el-card class="stat-card" shadow="hover" @click="handleStatClick(stat.filter)">
            <div class="stat-content">
              <div class="stat-icon" :style="{ backgroundColor: stat.color + '20', color: stat.color }">
                <el-icon v-if="stat.icon === 'office-building'"><OfficeBuilding /></el-icon>
                <el-icon v-else-if="stat.icon === 'user'"><User /></el-icon>
                <el-icon v-else-if="stat.icon === 'clock'"><Clock /></el-icon>
                <el-icon v-else><TrendCharts /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 快速操作 -->
    <div class="quick-actions">
      <el-card>
        <template #header>
          <h3>快速操作</h3>
        </template>
        <div class="actions-grid">
          <div class="action-item" @click="handleQuickAction('bulk_import')">
            <div class="action-icon">
              <el-icon><Upload /></el-icon>
            </div>
            <div class="action-text">批量导入</div>
          </div>
          <div class="action-item" @click="handleQuickAction('room_template')">
            <div class="action-icon">
              <el-icon><Files /></el-icon>
            </div>
            <div class="action-text">模板下载</div>
          </div>
          <div class="action-item" @click="handleQuickAction('maintenance')">
            <div class="action-icon">
              <el-icon><Tools /></el-icon>
            </div>
            <div class="action-text">维护模式</div>
          </div>
          <div class="action-item" @click="handleQuickAction('schedule')">
            <div class="action-icon">
              <el-icon><Calendar /></el-icon>
            </div>
            <div class="action-text">时段管理</div>
          </div>
          <div class="action-item" @click="handleQuickAction('backup')">
            <div class="action-icon">
              <el-icon><DataBoard /></el-icon>
            </div>
            <div class="action-text">数据备份</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 自习室管理组件 -->
    <div class="room-manager-container">
      <room-manager ref="roomManagerRef" />
    </div>

    <!-- 使用指南对话框 -->
    <el-dialog
      v-model="guideDialogVisible"
      title="自习室管理使用指南"
      width="800px"
    >
      <room-management-guide @close="guideDialogVisible = false" />
    </el-dialog>

    <!-- 批量导入对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="批量导入自习室"
      width="600px"
    >
      <room-import-form @success="handleImportSuccess" @cancel="importDialogVisible = false" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Download,
  PieChart,
  QuestionFilled,
  OfficeBuilding,
  User,
  Clock,
  TrendCharts,
  Upload,
  Files,
  Tools,
  Calendar,
  DataBoard
} from '@element-plus/icons-vue'
import RoomManager from '@/components/admin/RoomManager.vue'
import RoomManagementGuide from '@/components/admin/RoomManagementGuide.vue'
import RoomImportForm from '@/components/admin/RoomImportForm.vue'

const router = useRouter()

const roomManagerRef = ref()
const guideDialogVisible = ref(false)
const importDialogVisible = ref(false)

// 统计概览数据
const roomStats = computed(() => [
  {
    label: '自习室总数',
    value: 12,
    icon: 'office-building',
    color: '#409EFF',
    filter: 'all'
  },
  {
    label: '开放中',
    value: 9,
    icon: 'user',
    color: '#67C23A',
    filter: 'open'
  },
  {
    label: '维护中',
    value: 2,
    icon: 'clock',
    color: '#E6A23C',
    filter: 'maintenance'
  },
  {
    label: '平均使用率',
    value: '68%',
    icon: 'trend',
    color: '#F56C6C',
    filter: 'usage'
  }
])

// 方法
const exportRooms = () => {
  console.log('导出自习室数据')
  // 实现导出逻辑
}

const generateReport = () => {
  console.log('生成报告')
  router.push('/admin/statistics?type=rooms')
}

const showQuickGuide = () => {
  guideDialogVisible.value = true
}

const handleStatClick = (filter: string) => {
  if (roomManagerRef.value) {
    // 调用RoomManager组件的方法进行筛选
    console.log('筛选:', filter)
    // 这里可以实现根据filter设置筛选条件
  }
}

const handleQuickAction = (action: string) => {
  switch (action) {
    case 'bulk_import':
      importDialogVisible.value = true
      break
    case 'room_template':
      downloadTemplate()
      break
    case 'maintenance':
      setMaintenanceMode()
      break
    case 'schedule':
      manageSchedule()
      break
    case 'backup':
      backupData()
      break
  }
}

const handleImportSuccess = () => {
  importDialogVisible.value = false
  // 刷新数据
  if (roomManagerRef.value) {
    // 这里可以调用RoomManager的刷新方法
    console.log('导入成功，刷新数据')
  }
}

const downloadTemplate = () => {
  console.log('下载模板')
  // 实现模板下载
}

const setMaintenanceMode = () => {
  console.log('设置维护模式')
  // 实现维护模式设置
}

const manageSchedule = () => {
  console.log('管理时段')
  // 跳转到时段管理
}

const backupData = () => {
  console.log('数据备份')
  // 实现数据备份
}
</script>

<style scoped>
.admin-rooms {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.header-left h2 {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #909399;
  font-size: 14px;
  margin: 0;
}

.stats-overview {
  margin-bottom: 30px;
}

.stat-card {
  height: 100%;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.quick-actions {
  margin-bottom: 30px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
  padding: 10px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 10px;
  border-radius: 8px;
  background: #f5f7fa;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.action-item:hover {
  background: #ebf5ff;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  font-size: 20px;
  color: #409eff;
}

.action-text {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.room-manager-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }
  
  .header-right {
    width: 100%;
  }
  
  .el-button-group {
    width: 100%;
    display: flex;
  }
  
  .el-button-group .el-button {
    flex: 1;
  }
  
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .stat-content {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
}
</style>