<template>
  <div class="admin-statistics">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2>数据统计</h2>
        <p class="subtitle">系统数据分析和可视化报表</p>
      </div>
      <div class="header-right">
        <el-button-group>
          <el-button type="primary" @click="refreshData">
            <el-icon><Refresh /></el-icon>
            刷新数据
          </el-button>
          <el-button type="success" @click="exportReport">
            <el-icon><Download /></el-icon>
            导出报表
          </el-button>
          <el-button type="info" @click="printReport">
            <el-icon><Printer /></el-icon>
            打印
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 时间筛选 -->
    <div class="filter-section">
      <el-card>
        <template #header>
          <h3>筛选条件</h3>
        </template>
        <el-form :model="filterForm" label-width="80px">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="时间范围">
                <el-date-picker
                  v-model="filterForm.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="时间粒度">
                <el-select v-model="filterForm.interval" style="width: 100%">
                  <el-option label="按天" value="day" />
                  <el-option label="按周" value="week" />
                  <el-option label="按月" value="month" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="自习室">
                <el-select v-model="filterForm.roomId" clearable style="width: 100%">
                  <el-option label="全部自习室" value="" />
                  <el-option label="图书馆101" value="1" />
                  <el-option label="信息楼201" value="2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="学院">
                <el-select v-model="filterForm.college" clearable style="width: 100%">
                  <el-option label="全部学院" value="" />
                  <el-option label="计算机学院" value="computer" />
                  <el-option label="信息工程学院" value="info" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <div class="filter-actions">
                <el-button type="primary" @click="applyFilters">应用筛选</el-button>
                <el-button @click="resetFilters">重置</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>

    <!-- 统计图表 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <!-- 使用率趋势图 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <div class="chart-header">
                <h3>自习室使用率趋势</h3>
                <el-select v-model="usageChartType" size="small" style="width: 120px">
                  <el-option label="柱状图" value="bar" />
                  <el-option label="折线图" value="line" />
                </el-select>
              </div>
            </template>
            <div class="chart-container">
              <div v-if="usageData.length > 0" class="chart-placeholder">
                <div class="mock-chart">
                  <div class="chart-title">使用率趋势图</div>
                  <div class="chart-bars">
                    <div v-for="(item, index) in usageData" :key="index" class="chart-bar-item">
                      <div class="bar-label">{{ item.date }}</div>
                      <div class="bar-container">
                        <div class="bar" :style="{ height: item.rate * 100 + '%' }"></div>
                      </div>
                      <div class="bar-value">{{ Math.round(item.rate * 100) }}%</div>
                    </div>
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
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <h3>用户学院分布</h3>
            </template>
            <div class="chart-container">
              <div v-if="collegeData.length > 0" class="pie-chart-placeholder">
                <div class="pie-chart">
                  <div v-for="(item, index) in collegeData" :key="index" class="pie-item">
                    <div class="pie-color" :style="{ backgroundColor: getPieColor(index) }"></div>
                    <div class="pie-label">
                      <span>{{ item.college }}</span>
                      <span class="pie-value">{{ item.count }}人</span>
                    </div>
                    <div class="pie-percentage">{{ Math.round(item.percentage) }}%</div>
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

      <el-row :gutter="20" style="margin-top: 20px">
        <!-- 时间段热力图 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <h3>时间段使用热力图</h3>
            </template>
            <div class="chart-container">
              <div class="heatmap-placeholder">
                <div class="heatmap">
                  <div class="time-slots">
                    <div class="time-label" v-for="hour in 24" :key="hour">
                      {{ (hour - 1).toString().padStart(2, '0') }}:00
                    </div>
                  </div>
                  <div class="heatmap-grid">
                    <div v-for="row in 7" :key="row" class="heatmap-row">
                      <div
                        v-for="col in 24"
                        :key="col"
                        class="heatmap-cell"
                        :style="{
                          backgroundColor: getHeatmapColor(row, col)
                        }"
                        :title="`周${['日','一','二','三','四','五','六'][row-1]} ${col-1}:00 - 使用率: ${getHeatmapValue(row, col)}%`"
                      ></div>
                    </div>
                  </div>
                  <div class="day-labels">
                    <div class="day-label" v-for="day in ['周日','周一','周二','周三','周四','周五','周六']" :key="day">
                      {{ day }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 座位类型分布 -->
        <el-col :span="12">
          <el-card class="chart-card">
            <template #header>
              <h3>座位类型使用统计</h3>
            </template>
            <div class="chart-container">
              <div v-if="seatTypeData.length > 0" class="radar-chart-placeholder">
                <div class="radar-chart">
                  <div class="radar-grid">
                    <div class="grid-circle" v-for="i in 5" :key="i"></div>
                  </div>
                  <div class="radar-points">
                    <div
                      v-for="(item, index) in seatTypeData"
                      :key="index"
                      class="radar-point"
                      :style="{
                        left: 50 + 40 * Math.cos((index * 2 * Math.PI) / seatTypeData.length - Math.PI / 2) + '%',
                        top: 50 + 40 * Math.sin((index * 2 * Math.PI) / seatTypeData.length - Math.PI / 2) + '%'
                      }"
                    >
                      <div class="point-label">{{ item.type }}</div>
                      <div class="point-value">{{ item.value }}%</div>
                    </div>
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

    <!-- 数据表格 -->
    <div class="data-table-section">
      <el-card>
        <template #header>
          <div class="table-header">
            <h3>详细数据</h3>
            <el-button type="text" @click="toggleTableExpand">
              {{ tableExpanded ? '收起' : '展开' }}详细数据
            </el-button>
          </div>
        </template>
        
        <el-collapse-transition>
          <div v-show="tableExpanded">
            <el-table :data="tableData" v-loading="loading">
              <el-table-column prop="date" label="日期" width="120" />
              <el-table-column prop="roomName" label="自习室" width="150" />
              <el-table-column prop="totalReservations" label="总预约数" width="100" />
              <el-table-column prop="successfulReservations" label="成功预约" width="100" />
              <el-table-column prop="cancelledReservations" label="取消预约" width="100" />
              <el-table-column prop="avgOccupancyRate" label="平均使用率" width="120">
                <template #default="scope">
                  <el-progress
                    :percentage="Math.round(scope.row.avgOccupancyRate * 100)"
                    :show-text="false"
                    :color="getProgressColor(scope.row.avgOccupancyRate)"
                  />
                  <span style="margin-left: 10px">{{ Math.round(scope.row.avgOccupancyRate * 100) }}%</span>
                </template>
              </el-table-column>
              <el-table-column prop="avgUsageHours" label="平均使用时长" width="120">
                <template #default="scope">
                  {{ scope.row.avgUsageHours.toFixed(1) }} 小时
                </template>
              </el-table-column>
              <el-table-column prop="peakTime" label="高峰时段" width="120" />
            </el-table>
            
            <div class="table-pagination">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :total="totalItems"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
              />
            </div>
          </div>
        </el-collapse-transition>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Refresh, Download, Printer } from '@element-plus/icons-vue'
import { useStatistics } from '@/composables/useStatistics'
import { ElMessage } from 'element-plus'

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

// 筛选表单
const filterForm = reactive({
  dateRange: [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()],
  interval: 'day',
  roomId: '',
  college: ''
})

// 图表类型
const usageChartType = ref('bar')

// 模拟数据
const usageData = ref([
  { date: '01-01', rate: 0.65 },
  { date: '01-02', rate: 0.72 },
  { date: '01-03', rate: 0.58 },
  { date: '01-04', rate: 0.81 },
  { date: '01-05', rate: 0.69 },
  { date: '01-06', rate: 0.75 },
  { date: '01-07', rate: 0.88 }
])

const collegeData = ref([
  { college: '计算机学院', count: 320, percentage: 32 },
  { college: '信息工程学院', count: 280, percentage: 28 },
  { college: '机械工程学院', count: 180, percentage: 18 },
  { college: '电气工程学院', count: 120, percentage: 12 },
  { college: '其他学院', count: 100, percentage: 10 }
])

const seatTypeData = ref([
  { type: '标准座位', value: 85 },
  { type: '电源座位', value: 92 },
  { type: '靠窗座位', value: 95 },
  { type: '静音座位', value: 78 },
  { type: '宽敞座位', value: 88 },
  { type: '小组座位', value: 65 }
])

// 表格数据
const tableData = ref([
  { date: '2024-01-01', roomName: '图书馆101', totalReservations: 45, successfulReservations: 42, cancelledReservations: 3, avgOccupancyRate: 0.85, avgUsageHours: 3.2, peakTime: '14:00-16:00' },
  { date: '2024-01-01', roomName: '信息楼201', totalReservations: 38, successfulReservations: 35, cancelledReservations: 3, avgOccupancyRate: 0.78, avgUsageHours: 2.8, peakTime: '19:00-21:00' },
  { date: '2024-01-02', roomName: '图书馆101', totalReservations: 50, successfulReservations: 48, cancelledReservations: 2, avgOccupancyRate: 0.92, avgUsageHours: 3.5, peakTime: '15:00-17:00' }
])

// 状态
const loading = ref(false)
const tableExpanded = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(100)

// 颜色生成
const getPieColor = (index: number) => {
  const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#b37feb']
  return colors[index % colors.length]
}

const getHeatmapColor = (row: number, col: number) => {
  // 模拟数据：早上和晚上使用率高
  let value = 0.3
  if (col >= 8 && col <= 11) value = 0.7  // 上午
  if (col >= 14 && col <= 17) value = 0.6 // 下午
  if (col >= 19 && col <= 22) value = 0.8 // 晚上
  if (row >= 2 && row <= 5) value *= 1.2  // 工作日更高
  
  // 添加随机波动
  value += (Math.random() * 0.2 - 0.1)
  value = Math.max(0, Math.min(1, value))
  
  // 根据值返回颜色
  const hue = 120 - (value * 120) // 绿色到红色
  return `hsl(${hue}, 70%, 60%)`
}

const getHeatmapValue = (row: number, col: number) => {
  // 与getHeatmapColor相同的逻辑
  let value = 0.3
  if (col >= 8 && col <= 11) value = 0.7
  if (col >= 14 && col <= 17) value = 0.6
  if (col >= 19 && col <= 22) value = 0.8
  if (row >= 2 && row <= 5) value *= 1.2
  
  value += (Math.random() * 0.2 - 0.1)
  value = Math.max(0, Math.min(1, value))
  
  return Math.round(value * 100)
}

const getProgressColor = (rate: number) => {
  if (rate > 0.8) return '#f56c6c'
  if (rate > 0.6) return '#e6a23c'
  return '#67c23a'
}

// 方法
const applyFilters = () => {
  loading.value = true
  console.log('应用筛选:', filterForm)
  
  // 模拟API调用
  setTimeout(() => {
    ElMessage.success('筛选条件已应用')
    loading.value = false
  }, 1000)
}

const resetFilters = () => {
  Object.assign(filterForm, {
    dateRange: [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()],
    interval: 'day',
    roomId: '',
    college: ''
  })
  ElMessage.info('筛选条件已重置')
}

const refreshData = async () => {
  loading.value = true
  try {
    await refreshAllStats()
    ElMessage.success('数据刷新成功')
  } catch (error) {
    ElMessage.error('数据刷新失败')
  } finally {
    loading.value = false
  }
}

const exportReport = () => {
  ElMessage.success('报表导出开始，请稍候...')
  // 这里应该实现导出逻辑
}

const printReport = () => {
  window.print()
}

const toggleTableExpand = () => {
  tableExpanded.value = !tableExpanded.value
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchTableData()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchTableData()
}

const fetchTableData = () => {
  loading.value = true
  // 模拟API调用
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// 生命周期
onMounted(() => {
  fetchSystemStats()
  fetchRoomUsageStats()
  fetchCollegeDistribution()
})
</script>

<style scoped>
.admin-statistics {
  padding: 20px;
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
  margin: 0 0 8px 0;
}

.subtitle {
  color: #909399;
  font-size: 14px;
  margin: 0;
}

.filter-section {
  margin-bottom: 30px;
}

.filter-actions {
  padding-top: 28px;
  display: flex;
  gap: 10px;
}

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

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mock-chart {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.chart-title {
  text-align: center;
  margin-bottom: 20px;
  color: #606266;
  font-weight: 500;
}

.chart-bars {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: calc(100% - 40px);
}

.chart-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.bar-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 10px;
}

.bar-container {
  width: 30px;
  height: 80%;
  background: #f5f7fa;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, #409eff, #67c23a);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s;
}

.bar-value {
  font-size: 12px;
  color: #303133;
  margin-top: 5px;
  font-weight: 500;
}

.pie-chart-placeholder {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.pie-chart {
  max-width: 400px;
  margin: 0 auto;
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

.heatmap-placeholder {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.heatmap {
  display: flex;
  height: 100%;
}

.time-slots {
  width: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 20px 0;
}

.time-label {
  font-size: 10px;
  color: #909399;
  text-align: right;
  padding-right: 10px;
  height: calc(100% / 24);
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.heatmap-grid {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.heatmap-row {
  flex: 1;
  display: flex;
  margin-bottom: 2px;
}

.heatmap-cell {
  flex: 1;
  margin-right: 2px;
  border-radius: 2px;
  cursor: pointer;
  transition: transform 0.2s;
}

.heatmap-cell:hover {
  transform: scale(1.2);
  z-index: 1;
}

.day-labels {
  width: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 20px 0;
}

.day-label {
  font-size: 12px;
  color: #606266;
  height: calc(100% / 7);
  display: flex;
  align-items: center;
  padding-left: 10px;
}

.radar-chart-placeholder {
  width: 100%;
  height: 100%;
  padding: 20px;
  position: relative;
}

.radar-chart {
  width: 100%;
  height: 100%;
  position: relative;
}

.radar-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid-circle {
  position: absolute;
  border: 1px solid #dcdfe6;
  border-radius: 50%;
}

.grid-circle:nth-child(1) { width: 20%; height: 20%; }
.grid-circle:nth-child(2) { width: 40%; height: 40%; }
.grid-circle:nth-child(3) { width: 60%; height: 60%; }
.grid-circle:nth-child(4) { width: 80%; height: 80%; }
.grid-circle:nth-child(5) { width: 100%; height: 100%; }

.radar-points {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.radar-point {
  position: absolute;
  width: 60px;
  height: 60px;
  margin-left: -30px;
  margin-top: -30px;
  background: rgba(64, 158, 255, 0.1);
  border: 2px solid #409eff;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
}

.point-label {
  font-size: 10px;
  color: #303133;
  text-align: center;
}

.point-value {
  font-size: 12px;
  font-weight: 600;
  color: #409eff;
}

.empty-chart {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.data-table-section {
  margin-bottom: 30px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 打印样式 */
@media print {
  .page-header .header-right,
  .filter-section,
  .action-buttons {
    display: none;
  }
}
</style>