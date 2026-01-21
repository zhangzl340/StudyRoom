<template>
  <div class="admin-users">
    <!-- 页面标题和操作 -->
    <div class="page-header">
      <div class="header-left">
        <h2>用户管理</h2>
        <p class="subtitle">管理系统所有用户，支持搜索、筛选、编辑和删除</p>
      </div>
      <div class="header-right">
        <el-button-group>
          <el-button type="primary" @click="exportUsers">
            <el-icon><Download /></el-icon>
            导出用户
          </el-button>
          <el-button type="success" @click="importUsers">
            <el-icon><Upload /></el-icon>
            导入用户
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-overview">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="6" v-for="stat in userStats" :key="stat.label">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon" :style="{ backgroundColor: stat.color + '20', color: stat.color }">
                <span>{{ stat.icon }}</span>
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

    <!-- 用户管理组件 -->
    <div class="user-manager-container">
      <user-manager ref="userManagerRef" />
    </div>

    <!-- 导入用户对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入用户"
      width="500px"
    >
      <import-users-form
        @success="handleImportSuccess"
        @cancel="importDialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Download, Upload } from '@element-plus/icons-vue'
import UserManager from '@/components/admin/UserManager.vue'
import ImportUsersForm from '@/components/admin/ImportUsersForm.vue'
import { useUserStore } from '@/stores/user.store'
import { useStatistics } from '@/composables/useStatistics'

const userStore = useUserStore()
const { systemStats } = useStatistics()

const userManagerRef = ref()
const importDialogVisible = ref(false)

// 用户统计
const userStats = computed(() => [
  {
    label: '总用户数',
    value: systemStats.value?.totalUsers || 0,
    icon: '👥',
    color: '#409EFF'
  },
  {
    label: '今日活跃',
    value: systemStats.value?.activeUsers || 0,
    icon: '🟢',
    color: '#67C23A'
  },
  {
    label: '学生用户',
    value: getStudentCount(),
    icon: '🎓',
    color: '#E6A23C'
  },
  {
    label: '管理员',
    value: getAdminCount(),
    icon: '👨‍💼',
    color: '#F56C6C'
  }
])

// 方法
const getStudentCount = () => {
  return userStore.userList.filter(user => user.role === 'student').length
}

const getAdminCount = () => {
  return userStore.userList.filter(user => user.role === 'room_admin' || user.role === 'academic_admin').length
}

const exportUsers = () => {
  console.log('导出用户数据')
  // 实现导出逻辑
  // 这里可以调用API导出数据或生成CSV文件
}

const importUsers = () => {
  importDialogVisible.value = true
}

const handleImportSuccess = () => {
  importDialogVisible.value = false
  // 重新加载用户列表
  userStore.fetchUsers()
}

// 生命周期
onMounted(async () => {
  // 确保用户数据已加载
  if (userStore.userList.length === 0) {
    await userStore.fetchUsers()
  }
})
</script>

<style scoped>
.admin-users {
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

.user-manager-container {
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
  
  .stat-content {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
}
</style>