<template>
  <div class="admin-dashboard">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>系统仪表板</h2>
      <div class="header-actions">
        <el-button type="primary" :icon="Refresh" @click="refreshData">
          刷新数据
        </el-button>
        <el-button type="success" :icon="Download" @click="exportData">
          导出报表
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-card">
            <div class="stat-icon primary">
              <span>👥</span>
            </div>
            <div class="stat-info">
              <h3>总用户数</h3>
              <div class="stat-value">{{ systemStats?.totalUsers || 0 }}</div>
              <div class="stat-change" :class="{ positive: userChange >= 0 }">
                <span v-if="userChange !== 0">
                  {{ userChange >= 0 ? '+' : '' }}{{ userChange }}%
                </span>
                <span v-else>0%</span>
                较上月
              </div>
            </div>
          </div>
        </el-col>

        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-card">
            <div class="stat-icon success">
              <span>🏫</span>
            </div>
            <div class="stat-info">
              <h3>自习室总数</h3>
              <div class="stat-value">{{ systemStats?.totalRooms || 0 }}</div>
              <div class="stat-sub">可用座位: {{ systemStats?.totalSeats || 0 }}</div>
            </div>
          </div>
        </el-col>

        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-card">
            <div class="stat-icon warning">
              <span>📅</span>
            </div>
            <div class="stat-info">
              <h3>今日预约</h3>
              <div class="stat-value">{{ systemStats?.todayReservations || 0 }}</div>
              <div class="stat-sub">活跃用户: {{ systemStats?.activeUsers || 0 }}</div>
            </div>
          </div>
        </el-col>

        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-card">
            <div class="stat-icon danger">
              <span>📈</span>
            </div>
            <div class="stat-info">
              <h3>系统负载</h3>
              <div class="stat-value">{{ systemStats?.systemLoad || 0 }}%</div>
              <div class="stat-progress">
                <el-progress 
                  :percentage="systemStats?.systemLoad || 0" 
                  :color="getLoadColor(systemStats?.systemLoad || 0)"
                  :show-text="false"
                />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <!-- 使用率趋势图 -->
        <el-col :xs="24" :lg="16">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <h3>自习室使用率趋势</h3>
                <div class="chart-actions">
                  <el-select v-model="trendInterval" size="small" style="width: 120px">
                    <el-option label="最近7天" value="7days" />
                    <el-option label="最近30天" value="30days" />
                    <el-option label="本月" value="month" />
                  </el-select>
                </div>
              </div>
            </template>
            <div class="chart-container">
              <!-- 这里将放置ECharts图表 -->
              <div v-if="roomUsageStats.length > 0" class="chart-placeholder">
                <div class="mock-chart">
                  <div v-for="(stat, index) in formattedRoomUsage.slice(-7)" :key="index" 
                       class="chart-bar">
                    <div 
                      class="bar" 
                      :style="{ height: stat.occupancyRate * 100 + '%' }"
                    ></div>
                    <div class="bar-label">{{ stat.date.slice(5) }}</div>
                    <div class="bar-value">{{ Math.round(stat.occupancyRate * 100) }}%</div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-chart">
                <el-empty description="暂无数据" />
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 学院分布图 -->
        <el-col :xs="24" :lg="8">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <h3>用户学院分布</h3>
                <div class="date-selector">
                  <el-date-picker
                    v-model="collegeDate"
                    type="date"
                    placeholder="选择日期"
                    size="small"
                    style="width: 140px"
                  />
                </div>
              </div>
            </template>
            <div class="chart-container">
              <div v-if="formattedCollegeDistribution.length > 0" class="pie-chart-placeholder">
                <div class="pie-chart">
                  <div 
                    v-for="(item, index) in formattedCollegeDistribution.slice(0, 5)" 
                    :key="index"
                    class="pie-item"
                  >
                    <div class="pie-color" :style="{ backgroundColor: getPieColor(index) }"></div>
                    <div class="pie-label">
                      <span>{{ item.name }}</span>
                      <span class="pie-value">{{ item.value }}人</span>
                    </div>
                    <div class="pie-percentage">{{ Math.round(item.value / totalCollegeUsers * 100) }}%</div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-chart">
                <el-empty description="暂无数据" />
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 实时数据 -->
    <div class="realtime-section">
      <el-card>
        <template #header>
          <div class="realtime-header">
            <h3>实时监控</h3>
            <div class="update-time">
              最后更新: {{ lastUpdateTime }}
            </div>
          </div>
        </template>
        
        <el-row :gutter="20">
          <el-col :xs="12" :sm="8" :md="4" v-for="room in realtimeRooms" :key="room.id">
            <div class="room-status">
              <div class="room-name">{{ room.name }}</div>
              <div class="room-stats">
                <div class="stat-item">
                  <span class="stat-label">使用率</span>
                  <span class="stat-value" :class="getUsageClass(room.usageRate)">
                    {{ room.usageRate }}%
                  </span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">空闲座位</span>
                  <span class="stat-value">{{ room.availableSeats }}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 最近活动 -->
    <div class="recent-activity">
      <el-card>
        <template #header>
          <h3>最近活动</h3>
        </template>
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in recentActivities"
            :key="index"
            :timestamp="activity.time"
            :type="activity.type"
          >
            <div class="activity-item">
              <div class="activity-content">
                <span class="activity-user">{{ activity.user }}</span>
                <span>{{ activity.action }}</span>
                <span class="activity-detail">{{ activity.detail }}</span>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Refresh, Download } from '@element-plus/icons-vue'
import { useStatistics } from '@/composables/useStatistics'

const { 
  systemStats,
  roomUsageStats,
  collegeDistribution,
  formattedRoomUsage,
  formattedCollegeDistribution,
  fetchSystemStats,
  fetchRoomUsageStats,
  fetchCollegeDistribution,
  refreshAllStats
} = useStatistics()

// 图表选项
const trendInterval = ref('7days')
const collegeDate = ref(new Date())

// 实时数据
const realtimeRooms = ref([
  { id: 1, name: '图书馆101', usageRate: 85, availableSeats: 15 },
  { id: 2, name: '信息楼201', usageRate: 62, availableSeats: 38 },
  { id: 3, name: '实验楼301', usageRate: 45, availableSeats: 55 },
  { id: 4, name: '教学楼401', usageRate: 78, availableSeats: 22 },
  { id: 5, name: '自习中心', usageRate: 92, availableSeats: 8 },
  { id: 6, name: '电子阅览室', usageRate: 35, availableSeats: 65 },
])

// 最近活动
const recentActivities = ref([
  { 
    time: '10:30', 
    user: '张三', 
    action: '预约了', 
    detail: '图书馆101-A01座位',
    type: 'primary'
  },
  { 
    time: '10:15', 
    user: '李四', 
    action: '签退了', 
    detail: '信息楼201-B03座位',
    type: 'success'
  },
  { 
    time: '09:45', 
    user: '王五', 
    action: '暂时离开', 
    detail: '实验楼301-C12座位',
    type: 'warning'
  },
  { 
    time: '09:20', 
    user: '赵六', 
    action: '取消了预约', 
    detail: '教学楼401-D05座位',
    type: 'danger'
  },
  { 
    time: '08:55', 
    user: '管理员', 
    action: '修改了', 
    detail: '自习中心座位布局',
    type: 'info'
  },
])

// 计算属性
const lastUpdateTime = computed(() => {
  return new Date().toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
})

const userChange = computed(() => {
  // 模拟用户增长数据
  return 5.2
})

const totalCollegeUsers = computed(() => {
  return formattedCollegeDistribution.value.reduce((sum, item) => sum + item.value, 0)
})

// 方法
const getLoadColor = (percentage: number) => {
  if (percentage < 60) return '#67c23a'
  if (percentage < 85) return '#e6a23c'
  return '#f56c6c'
}

const getUsageClass = (usageRate: number) => {
  if (usageRate < 60) return 'low-usage'
  if (usageRate < 85) return 'medium-usage'
  return 'high-usage'
}

const getPieColor = (index: number) => {
  const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399']
  return colors[index % colors.length]
}

const refreshData = async () => {
  await refreshAllStats()
}

const exportData = () => {
  console.log('导出报表')
  // 这里实现导出逻辑
}

// 生命周期
onMounted(async () => {
  await fetchSystemStats()
  await fetchRoomUsageStats()
  await fetchCollegeDistribution()
})
</script>

<style scoped>
.admin-dashboard {
  padding-bottom: 40px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* 统计卡片样式 */
.stats-cards {
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  height: 120px;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 30px;
}

.stat-icon.primary {
  background: rgba(64, 158, 255, 0.1);
  color: #409eff;
}

.stat-icon.success {
  background: rgba(103, 194, 58, 0.1);
  color: #67c23a;
}

.stat-icon.warning {
  background: rgba(230, 162, 60, 0.1);
  color: #e6a23c;
}

.stat-icon.danger {
  background: rgba(245, 108, 108, 0.1);
  color: #f56c6c;
}

.stat-info {
  flex: 1;
}

.stat-info h3 {
  font-size: 14px;
  color: #909399;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.stat-sub {
  font-size: 12px;
  color: #909399;
}

.stat-change {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-change.positive {
  color: #67c23a;
}

.stat-change:not(.positive) {
  color: #f56c6c;
}

.stat-progress {
  margin-top: 8px;
}

/* 图表区域 */
.charts-section {
  margin-bottom: 30px;
}

.chart-card {
  height: 100%;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.chart-container {
  height: 300px;
}

/* 模拟图表样式 */
.mock-chart {
  display: flex;
  height: 100%;
  align-items: flex-end;
  gap: 10px;
  padding: 20px 0;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

.bar {
  width: 30px;
  background: linear-gradient(to top, #409eff, #67c23a);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s;
}

.bar-label {
  margin-top: 10px;
  font-size: 12px;
  color: #909399;
}

.bar-value {
  font-size: 11px;
  color: #303133;
  font-weight: 500;
}

/* 饼图样式 */
.pie-chart-placeholder {
  padding: 20px;
}

.pie-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 8px 0;
}

.pie-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 12px;
}

.pie-label {
  flex: 1;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.pie-value {
  color: #909399;
}

.pie-percentage {
  width: 40px;
  text-align: right;
  font-weight: 600;
  color: #303133;
}

.empty-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* 实时数据样式 */
.realtime-section {
  margin-bottom: 30px;
}

.realtime-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.update-time {
  font-size: 12px;
  color: #909399;
}

.room-status {
  background: #f5f7fa;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
  transition: all 0.3s;
}

.room-status:hover {
  background: #ebf5ff;
}

.room-name {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #303133;
}

.room-stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.stat-label {
  color: #909399;
}

.stat-value {
  font-weight: 500;
}

.stat-value.low-usage {
  color: #67c23a;
}

.stat-value.medium-usage {
  color: #e6a23c;
}

.stat-value.high-usage {
  color: #f56c6c;
}

/* 最近活动样式 */
.activity-item {
  padding: 5px 0;
}

.activity-content {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.activity-user {
  font-weight: 600;
  color: #409eff;
}

.activity-detail {
  color: #303133;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .stat-card {
    height: auto;
    margin-bottom: 15px;
  }
  
  .mock-chart {
    flex-wrap: wrap;
    height: auto;
  }
  
  .chart-bar {
    width: 40px;
  }
}
</style>