<template>
  <div class="admin-announcements">
    <!-- 页面标题和操作 -->
    <div class="page-header">
      <div class="header-left">
        <h2>公告管理</h2>
        <p class="subtitle">管理系统公告，发布重要通知和活动信息</p>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          发布公告
        </el-button>
        <el-button type="success" @click="refreshList">
          <el-icon><Refresh /></el-icon>
          刷新列表
        </el-button>
      </div>
    </div>

    <!-- 公告列表 -->
    <div class="announcements-list">
      <el-table
        :data="announcements"
        v-loading="loading"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column label="公告信息" min-width="300">
          <template #default="scope">
            <div class="announcement-info">
              <div class="announcement-title">
                <span class="title-text">{{ scope.row.title }}</span>
                <el-tag
                  size="small"
                  :type="getTypeTagType(scope.row.type)"
                  class="type-tag"
                >
                  {{ getTypeText(scope.row.type) }}
                </el-tag>
                <el-tag
                  size="small"
                  :type="scope.row.isActive ? 'success' : 'info'"
                  class="status-tag"
                >
                  {{ scope.row.isActive ? '已发布' : '草稿' }}
                </el-tag>
              </div>
              <div class="announcement-content">
                {{ getContentPreview(scope.row.content) }}
              </div>
              <div class="announcement-meta">
                <span class="meta-item">
                  <el-icon><User /></el-icon>
                  {{ scope.row.publisher }}
                </span>
                <span class="meta-item">
                  <el-icon><Calendar /></el-icon>
                  {{ formatTime(scope.row.publishTime) }}
                </span>
                <span class="meta-item">
                  <el-icon><View /></el-icon>
                  浏览: {{ scope.row.viewCount || 0 }}
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="发布时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.publishTime) }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <div class="action-buttons">
              <el-button
                type="primary"
                link
                size="small"
                @click="handleEdit(scope.row)"
              >
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button
                type="success"
                link
                size="small"
                @click="handleToggleStatus(scope.row)"
              >
                <el-icon v-if="scope.row.isActive"><Hide /></el-icon>
                <el-icon v-else><Watch /></el-icon>
                {{ scope.row.isActive ? '下架' : '发布' }}
              </el-button>
              <el-button
                type="danger"
                link
                size="small"
                @click="handleDelete(scope.row)"
              >
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-section">
      <div class="batch-actions" v-if="selectedAnnouncements.length > 0">
        <el-button type="danger" size="small" @click="batchDelete">
          批量删除 ({{ selectedAnnouncements.length }})
        </el-button>
        <el-button type="warning" size="small" @click="batchUnpublish">
          批量下架
        </el-button>
        <el-button type="success" size="small" @click="batchPublish">
          批量发布
        </el-button>
      </div>
      
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 编辑公告对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="isEditMode ? '编辑公告' : '发布公告'"
      width="800px"
    >
      <announcement-editor
        v-if="editDialogVisible"
        :announcement="currentAnnouncement"
        :mode="isEditMode ? 'edit' : 'add'"
        @submit="handleEditSubmit"
        @cancel="editDialogVisible = false"
        @preview="handlePreview"
      />
    </el-dialog>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      title="公告预览"
      width="800px"
    >
      <announcement-preview
        v-if="previewDialogVisible"
        :announcement="previewData"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Refresh,
  Edit,
  Delete,
  User,
  Calendar,
  View,
  Hide,
  Watch,
  
} from '@element-plus/icons-vue'
import AnnouncementEditor from '@/components/admin/AnnouncementEditor.vue'

// 为了演示，我们先使用占位组件
const AnnouncementPreview = {
  props: ['announcement'],
  template: '<div class="announcement-preview"><h3>公告预览</h3><div style="padding: 20px; border: 1px solid #e4e7ed; border-radius: 4px; background: white;">{{ announcement.content }}</div></div>'
}

// 状态
const loading = ref(false)
const announcements = ref<any[]>([])
const selectedAnnouncements = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 对话框状态
const editDialogVisible = ref(false)
const previewDialogVisible = ref(false)
const currentAnnouncement = ref<any>(null)
const previewData = ref<any>(null)
const isEditMode = ref(false)

// 模拟数据
const mockAnnouncements = [
  {
    id: '1',
    title: '关于新学期自习室开放时间的通知',
    type: 'important',
    content: '各位同学：新学期自习室开放时间有所调整，请同学们注意查看。',
    publishTime: '2024-02-20T09:00:00Z',
    publisher: '教务处',
    isActive: true,
    viewCount: 1250
  },
  {
    id: '2',
    title: '自习室预约系统升级维护通知',
    type: 'warning',
    content: '系统将于本周六凌晨进行升级维护，期间无法预约，请提前安排。',
    publishTime: '2024-02-18T14:30:00Z',
    publisher: '信息中心',
    isActive: true,
    viewCount: 980
  },
  {
    id: '3',
    title: '图书馆自习室新增电源插座',
    type: 'info',
    content: '为方便同学们使用电子设备，图书馆自习室新增了一批电源插座。',
    publishTime: '2024-02-15T10:00:00Z',
    publisher: '后勤部',
    isActive: true,
    viewCount: 750
  },
  {
    id: '4',
    title: '关于规范自习室使用的倡议',
    type: 'info',
    content: '请同学们遵守自习室使用规范，保持安静，爱护公共设施。',
    publishTime: '2024-02-10T16:00:00Z',
    publisher: '学生会',
    isActive: false,
    viewCount: 320
  }
]

// 计算属性
const getTypeTagType = (type: string) => {
  switch (type) {
    case 'important': return 'danger'
    case 'warning': return 'warning'
    default: return 'info'
  }
}

const getTypeText = (type: string) => {
  switch (type) {
    case 'important': return '重要'
    case 'warning': return '警告'
    default: return '通知'
  }
}

const getContentPreview = (content: string) => {
  if (content.length > 100) {
    return content.substring(0, 100) + '...'
  }
  return content
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 处理方法
const fetchAnnouncements = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    announcements.value = mockAnnouncements
    total.value = mockAnnouncements.length
  } catch (error) {
    ElMessage.error('加载公告列表失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  currentAnnouncement.value = null
  isEditMode.value = false
  editDialogVisible.value = true
}

const handleEdit = (announcement: any) => {
  currentAnnouncement.value = { ...announcement }
  isEditMode.value = true
  editDialogVisible.value = true
}

const handleDelete = async (announcement: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除公告 "${announcement.title}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error'
      }
    )
    
    // 模拟删除
    announcements.value = announcements.value.filter(a => a.id !== announcement.id)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleToggleStatus = async (announcement: any) => {
  try {
    const action = announcement.isActive ? '下架' : '发布'
    
    await ElMessageBox.confirm(
      `确定要${action}公告 "${announcement.title}" 吗？`,
      `${action}确认`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 更新状态
    announcement.isActive = !announcement.isActive
    ElMessage.success(`${action}成功`)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const handleSelectionChange = (selection: any[]) => {
  selectedAnnouncements.value = selection
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

const handleEditSubmit = async (data: any) => {
  try {
    if (isEditMode.value && currentAnnouncement.value) {
      // 更新公告
      const index = announcements.value.findIndex(a => a.id === currentAnnouncement.value.id)
      if (index !== -1) {
        announcements.value[index] = {
          ...announcements.value[index],
          ...data
        }
      }
      ElMessage.success('更新成功')
    } else {
      // 添加公告
      const newAnnouncement = {
        id: Date.now().toString(),
        ...data,
        publisher: '管理员',
        viewCount: 0
      }
      announcements.value.unshift(newAnnouncement)
      ElMessage.success('发布成功')
    }
    
    editDialogVisible.value = false
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handlePreview = (data: any) => {
  previewData.value = data
  previewDialogVisible.value = true
}

const refreshList = () => {
  fetchAnnouncements()
}

// 批量操作
const batchDelete = async () => {
  if (selectedAnnouncements.value.length === 0) return
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedAnnouncements.value.length} 条公告吗？`,
      '批量删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error'
      }
    )
    
    const idsToDelete = selectedAnnouncements.value.map(a => a.id)
    announcements.value = announcements.value.filter(a => !idsToDelete.includes(a.id))
    selectedAnnouncements.value = []
    
    ElMessage.success('批量删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}

const batchUnpublish = async () => {
  if (selectedAnnouncements.value.length === 0) return
  
  try {
    const idsToUnpublish = selectedAnnouncements.value.map(a => a.id)
    announcements.value = announcements.value.map(a => {
      if (idsToUnpublish.includes(a.id)) {
        return { ...a, isActive: false }
      }
      return a
    })
    
    selectedAnnouncements.value = []
    ElMessage.success('批量下架成功')
  } catch (error) {
    ElMessage.error('批量下架失败')
  }
}

const batchPublish = async () => {
  if (selectedAnnouncements.value.length === 0) return
  
  try {
    const idsToPublish = selectedAnnouncements.value.map(a => a.id)
    announcements.value = announcements.value.map(a => {
      if (idsToPublish.includes(a.id)) {
        return { ...a, isActive: true }
      }
      return a
    })
    
    selectedAnnouncements.value = []
    ElMessage.success('批量发布成功')
  } catch (error) {
    ElMessage.error('批量发布失败')
  }
}

// 生命周期
onMounted(() => {
  fetchAnnouncements()
})
</script>

<style scoped>
.admin-announcements {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
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

.announcements-list {
  margin-bottom: 20px;
}

.announcement-info {
  padding: 8px 0;
}

.announcement-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.title-text {
  font-weight: 600;
  font-size: 14px;
}

.type-tag,
.status-tag {
  font-size: 10px;
  padding: 0 6px;
  height: 20px;
  line-height: 18px;
}

.announcement-content {
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
  margin-bottom: 8px;
}

.announcement-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #909399;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.batch-actions {
  display: flex;
  gap: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .announcement-title {
    flex-wrap: wrap;
  }
  
  .announcement-meta {
    flex-direction: column;
    gap: 4px;
  }
  
  .pagination-section {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .batch-actions {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>