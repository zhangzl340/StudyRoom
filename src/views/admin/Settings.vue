<template>
  <div class="admin-settings">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>系统设置</h2>
      <p class="subtitle">配置系统参数和管理系统功能</p>
    </div>

    <!-- 设置内容 -->
    <div class="settings-container">
      <el-tabs v-model="activeTab" type="border-card" class="settings-tabs">
        <!-- 基本设置 -->
        <el-tab-pane label="基本设置" name="basic">
          <basic-settings ref="basicSettingsRef" />
        </el-tab-pane>

        <!-- 预约规则 -->
        <el-tab-pane label="预约规则" name="reservation">
          <reservation-rules ref="reservationRulesRef" />
        </el-tab-pane>

        <!-- 系统维护 -->
        <el-tab-pane label="系统维护" name="maintenance">
          <system-maintenance ref="maintenanceRef" />
        </el-tab-pane>

        <!-- 权限管理 -->
        <el-tab-pane label="权限管理" name="permission">
          <permission-settings ref="permissionSettingsRef" />
        </el-tab-pane>

        <!-- 数据管理 -->
        <el-tab-pane label="数据管理" name="data">
          <data-management ref="dataManagementRef" />
        </el-tab-pane>
      </el-tabs>

      <!-- 操作按钮 -->
      <div class="settings-actions">
        <el-button type="primary" @click="saveAllSettings" :loading="saving">
          <el-icon><Check /></el-icon>
          保存所有设置
        </el-button>
        <el-button @click="resetSettings">
          <el-icon><Refresh /></el-icon>
          恢复默认
        </el-button>
        <el-button type="info" @click="exportSettings">
          <el-icon><Download /></el-icon>
          导出设置
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, Refresh, Download } from '@element-plus/icons-vue'

// 导入设置组件
// 这些组件需要创建在 src/components/admin/settings/ 目录下
// import BasicSettings from '@/components/admin/settings/BasicSettings.vue'
// import ReservationRules from '@/components/admin/settings/ReservationRules.vue'
// import SystemMaintenance from '@/components/admin/settings/SystemMaintenance.vue'
// import PermissionSettings from '@/components/admin/settings/PermissionSettings.vue'
// import DataManagement from '@/components/admin/settings/DataManagement.vue'

// 为了演示，我们先使用占位组件
const BasicSettings = { template: '<div>基本设置组件</div>' }
const ReservationRules = { template: '<div>预约规则组件</div>' }
const SystemMaintenance = { template: '<div>系统维护组件</div>' }
const PermissionSettings = { template: '<div>权限管理组件</div>' }
const DataManagement = { template: '<div>数据管理组件</div>' }

// 状态
const activeTab = ref('basic')
const saving = ref(false)

// 组件引用
const basicSettingsRef = ref()
const reservationRulesRef = ref()
const maintenanceRef = ref()
const permissionSettingsRef = ref()
const dataManagementRef = ref()

// 保存所有设置
const saveAllSettings = async () => {
  saving.value = true
  
  try {
    // 收集所有设置数据
    const settings = {
      basic: basicSettingsRef.value?.getSettingsData?.(),
      reservation: reservationRulesRef.value?.getSettingsData?.(),
      maintenance: maintenanceRef.value?.getSettingsData?.(),
      permission: permissionSettingsRef.value?.getSettingsData?.(),
      data: dataManagementRef.value?.getSettingsData?.()
    }
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('保存设置:', settings)
    ElMessage.success('设置保存成功')
  } catch (error) {
    ElMessage.error('保存设置失败')
  } finally {
    saving.value = false
  }
}

// 重置设置
const resetSettings = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要恢复默认设置吗？当前所有修改将丢失。',
      '恢复确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 调用各子组件的重置方法
    basicSettingsRef.value?.reset?.()
    reservationRulesRef.value?.reset?.()
    maintenanceRef.value?.reset?.()
    permissionSettingsRef.value?.reset?.()
    dataManagementRef.value?.reset?.()
    
    ElMessage.success('已恢复默认设置')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('重置失败')
    }
  }
}

// 导出设置
const exportSettings = () => {
  console.log('导出设置')
  // 实现导出逻辑
}
</script>

<style scoped>
.admin-settings {
  padding: 20px;
}

.page-header {
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

.settings-container {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.settings-tabs {
  margin-bottom: 30px;
}

.settings-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 30px;
  border-top: 1px solid #f0f0f0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .settings-actions .el-button {
    width: 100%;
  }
}
</style>