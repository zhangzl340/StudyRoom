<!-- 用户管理 -->
<template>
  <div class="user-manager">
    <!-- 搜索和筛选区域 -->
    <div class="filter-section">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索用户名/姓名/学号"
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
            v-model="filterRole"
            placeholder="用户角色"
            clearable
            size="large"
            style="width: 100%"
            @change="handleFilter"
          >
            <el-option label="学生" value="student" />
            <el-option label="自习室管理员" value="room_admin" />
            <el-option label="教务处管理员" value="academic_admin" />
          </el-select>
        </el-col>
        
        <el-col :xs="24" :sm="12" :md="4">
          <el-select
            v-model="filterStatus"
            placeholder="用户状态"
            clearable
            size="large"
            style="width: 100%"
            @change="handleFilter"
          >
            <el-option label="活跃" value="active" />
            <el-option label="已停用" value="inactive" />
            <el-option label="已封禁" value="suspended" />
          </el-select>
        </el-col>
        
        <el-col :xs="24" :sm="12" :md="6">
          <el-input
            v-model="filterCollege"
            placeholder="学院筛选"
            clearable
            size="large"
            @input="handleFilter"
            @clear="handleFilter"
          />
        </el-col>
        
        <el-col :xs="24" :sm="12" :md="4">
          <el-button
            type="primary"
            size="large"
            @click="handleAddUser"
            style="width: 100%"
          >
            <el-icon><Plus /></el-icon>
            添加用户
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 用户表格 -->
    <div class="table-section">
      <el-table
        :data="filteredUsers"
        v-loading="loading"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        
        <el-table-column label="用户信息" min-width="250">
          <template #default="scope">
            <div class="user-info-cell">
              <div class="avatar-container">
                <el-avatar :size="40" :src="scope.row.avatar">
                  {{ scope.row.realName?.charAt(0) || 'U' }}
                </el-avatar>
              </div>
              <div class="user-details">
                <div class="user-name">
                  <span class="real-name">{{ scope.row.realName }}</span>
                  <span class="username">@{{ scope.row.username }}</span>
                </div>
                <div class="user-meta">
                  <el-tag 
                    size="small" 
                    :type="getRoleTagType(scope.row.role)"
                  >
                    {{ formatRole(scope.row.role) }}
                  </el-tag>
                  <el-tag 
                    size="small" 
                    :type="getStatusTagType(scope.row.status)"
                    class="status-tag"
                  >
                    {{ formatStatus(scope.row.status) }}
                  </el-tag>
                </div>
                <div class="user-contact">
                  <span v-if="scope.row.email" class="contact-item">
                    <el-icon><Message /></el-icon> {{ scope.row.email }}
                  </span>
                  <span v-if="scope.row.phone" class="contact-item">
                    <el-icon><Phone /></el-icon> {{ scope.row.phone }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="studentId" label="学号/工号" width="120">
          <template #default="scope">
            {{ scope.row.studentId || '-' }}
          </template>
        </el-table-column>
        
        <el-table-column label="学院/专业" min-width="180">
          <template #default="scope">
            <div v-if="scope.row.college">
              <div>{{ scope.row.college }}</div>
              <div class="text-muted" v-if="scope.row.major">
                {{ scope.row.major }}
              </div>
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        
        <el-table-column label="使用统计" width="150">
          <template #default="scope">
            <div class="usage-stats">
              <div class="stat-item">
                <span class="stat-label">预约:</span>
                <span class="stat-value">{{ scope.row.reservationCount || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">信用分:</span>
                <el-tag 
                  size="small" 
                  :type="getCreditScoreType(scope.row.creditScore)"
                >
                  {{ scope.row.creditScore || 100 }}
                </el-tag>
              </div>
              <div class="stat-item">
                <span class="stat-label">用时:</span>
                <span class="stat-value">{{ scope.row.totalUsageHours || 0 }}h</span>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="lastLoginTime" label="最后登录" width="160">
          <template #default="scope">
            <div v-if="scope.row.lastLoginTime">
              <div>{{ formatDate(scope.row.lastLoginTime, 'MM-DD') }}</div>
              <div class="text-muted">{{ formatDate(scope.row.lastLoginTime, 'HH:mm') }}</div>
            </div>
            <span v-else>从未登录</span>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" fixed="right" width="180">
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
                v-if="scope.row.status === 'inactive'"
                @click="handleToggleStatus(scope.row, 'active')"
              >
                <el-icon><Check /></el-icon>
                启用
              </el-button>
              
              <el-button
                type="warning"
                link
                size="small"
                v-else
                @click="handleToggleStatus(scope.row, 'inactive')"
              >
                <el-icon><Remove /></el-icon>
                停用
              </el-button>
              
              <el-dropdown trigger="click" @command="(command) => handleCommand(command, scope.row)">
                <el-button type="info" link size="small">
                  <el-icon><More /></el-icon>
                  更多
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="resetPassword">
                      <el-icon><Refresh /></el-icon>
                      重置密码
                    </el-dropdown-item>
                    <el-dropdown-item command="adjustCredit">
                      <el-icon><Star /></el-icon>
                      调整信用分
                    </el-dropdown-item>
                    <el-dropdown-item command="viewDetails">
                      <el-icon><View /></el-icon>
                      查看详情
                    </el-dropdown-item>
                    <el-dropdown-item divided command="delete" class="danger-item">
                      <el-icon><Delete /></el-icon>
                      删除用户
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-section">
      <div class="batch-actions" v-if="selectedUsers.length > 0">
        <el-button type="danger" size="small" @click="batchDelete">
          批量删除 ({{ selectedUsers.length }})
        </el-button>
        <el-button type="warning" size="small" @click="batchDisable">
          批量停用
        </el-button>
        <el-button type="success" size="small" @click="batchEnable">
          批量启用
        </el-button>
      </div>
      
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="totalUsers"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 用户详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="currentUser?.realName + ' - 用户详情'"
      width="700px"
    >
      <user-detail-panel v-if="currentUser" :user="currentUser" />
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="isEditMode ? '编辑用户信息' : '添加新用户'"
      width="600px"
    >
      <user-edit-form
        :user="currentUser"
        :mode="isEditMode ? 'edit' : 'add'"
        @submit="handleEditSubmit"
        @cancel="editDialogVisible = false"
      />
    </el-dialog>

    <!-- 重置密码对话框 -->
    <el-dialog
      v-model="resetPasswordDialogVisible"
      title="重置用户密码"
      width="400px"
    >
      <reset-password-form
        :user="currentUser"
        @submit="handleResetPasswordSubmit"
        @cancel="resetPasswordDialogVisible = false"
      />
    </el-dialog>

    <!-- 调整信用分对话框 -->
    <el-dialog
      v-model="adjustCreditDialogVisible"
      :title="'调整信用分 - ' + currentUser?.realName"
      width="500px"
    >
      <adjust-credit-form
        :user="currentUser"
        @submit="handleAdjustCreditSubmit"
        @cancel="adjustCreditDialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox, ElTable } from 'element-plus'
import {
  Search,
  Plus,
  Edit,
  Delete,
  Check,
  Remove,
  More,
  Refresh,
  Star,
  View,
  Message,
  Phone
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user.store'
import type { IUser, UserRole, UserStatus } from '@/types/user.types'

// 导入子组件（需要先创建这些组件）
// import UserDetailPanel from './UserDetailPanel.vue'
// import UserEditForm from './UserEditForm.vue'
// import ResetPasswordForm from './ResetPasswordForm.vue'
// import AdjustCreditForm from './AdjustCreditForm.vue'

// 为了演示，我们先使用占位组件
const UserDetailPanel = { template: '<div>用户详情组件</div>' }
const UserEditForm = { 
  props: ['user', 'mode'],
  emits: ['submit', 'cancel'],
  template: '<div>用户编辑表单组件</div>' 
}
const ResetPasswordForm = {
  props: ['user'],
  emits: ['submit', 'cancel'],
  template: '<div>重置密码表单组件</div>'
}
const AdjustCreditForm = {
  props: ['user'],
  emits: ['submit', 'cancel'],
  template: '<div>调整信用分表单组件</div>'
}

const userStore = useUserStore()

// 状态
const searchKeyword = ref('')
const filterRole = ref<UserRole | ''>('')
const filterStatus = ref<UserStatus | ''>('')
const filterCollege = ref('')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(20)
const selectedUsers = ref<IUser[]>([])

// 对话框状态
const detailDialogVisible = ref(false)
const editDialogVisible = ref(false)
const resetPasswordDialogVisible = ref(false)
const adjustCreditDialogVisible = ref(false)
const currentUser = ref<IUser | null>(null)
const isEditMode = ref(false)

// 计算属性
const filteredUsers = computed(() => {
  let users = userStore.userList
  
  // 搜索关键词过滤
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase().trim()
    users = users.filter(user => 
      user.username.toLowerCase().includes(keyword) ||
      user.realName.toLowerCase().includes(keyword) ||
      (user.studentId && user.studentId.toLowerCase().includes(keyword)) ||
      user.email.toLowerCase().includes(keyword)
    )
  }
  
  // 角色过滤
  if (filterRole.value) {
    users = users.filter(user => user.role === filterRole.value)
  }
  
  // 状态过滤
  if (filterStatus.value) {
    users = users.filter(user => user.status === filterStatus.value)
  }
  
  // 学院过滤
  if (filterCollege.value.trim()) {
    const college = filterCollege.value.toLowerCase().trim()
    users = users.filter(user => 
      user.college && user.college.toLowerCase().includes(college)
    )
  }
  
  return users
})

const totalUsers = computed(() => filteredUsers.value.length)

// 格式化函数
const formatRole = (role: UserRole) => {
  const roleMap: Record<UserRole, string> = {
    student: '学生',
    room_admin: '自习室管理员',
    academic_admin: '教务处管理员'
  }
  return roleMap[role] || role
}

const formatStatus = (status: UserStatus) => {
  const statusMap: Record<UserStatus, string> = {
    active: '活跃',
    inactive: '已停用',
    suspended: '已封禁'
  }
  return statusMap[status] || status
}

const formatDate = (dateString: string, format: string = 'YYYY-MM-DD HH:mm') => {
  const date = new Date(dateString)
  if (format === 'MM-DD') {
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  }
  if (format === 'HH:mm') {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
  return dateString
}

// 标签类型
const getRoleTagType = (role: UserRole) => {
  switch (role) {
    case 'student': return ''
    case 'room_admin': return 'warning'
    case 'academic_admin': return 'danger'
    default: return 'info'
  }
}

const getStatusTagType = (status: UserStatus) => {
  switch (status) {
    case 'active': return 'success'
    case 'inactive': return 'warning'
    case 'suspended': return 'danger'
    default: return 'info'
  }
}

const getCreditScoreType = (score: number) => {
  if (score >= 90) return 'success'
  if (score >= 70) return 'warning'
  return 'danger'
}

// 表格行类名
const tableRowClassName = ({ row }: { row: IUser }) => {
  if (row.status === 'inactive') return 'row-inactive'
  if (row.status === 'suspended') return 'row-suspended'
  return ''
}

// 处理方法
const handleSearch = () => {
  currentPage.value = 1
}

const handleFilter = () => {
  currentPage.value = 1
}

const handleAddUser = () => {
  currentUser.value = null
  isEditMode.value = false
  editDialogVisible.value = true
}

const handleEdit = (user: IUser) => {
  currentUser.value = { ...user }
  isEditMode.value = true
  editDialogVisible.value = true
}

const handleToggleStatus = async (user: IUser, newStatus: UserStatus) => {
  try {
    const action = newStatus === 'active' ? '启用' : '停用'
    
    await ElMessageBox.confirm(
      `确定要${action}用户 "${user.realName}" 吗？`,
      `${action}确认`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await userStore.updateUser(user.id, { status: newStatus })
    
    ElMessage.success(`${action}成功`)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`操作失败: ${error}`)
    }
  }
}

const handleCommand = (command: string, user: IUser) => {
  currentUser.value = user
  
  switch (command) {
    case 'resetPassword':
      resetPasswordDialogVisible.value = true
      break
    case 'adjustCredit':
      adjustCreditDialogVisible.value = true
      break
    case 'viewDetails':
      detailDialogVisible.value = true
      break
    case 'delete':
      handleDeleteUser(user)
      break
  }
}

const handleDeleteUser = async (user: IUser) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${user.realName}" 吗？此操作不可恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    await userStore.deleteUser(user.id)
    
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`删除失败: ${error}`)
    }
  }
}

const handleSelectionChange = (selection: IUser[]) => {
  selectedUsers.value = selection
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

const handleEditSubmit = async (userData: Partial<IUser>) => {
  try {
    if (isEditMode.value && currentUser.value) {
      await userStore.updateUser(currentUser.value.id, userData)
      ElMessage.success('更新成功')
    } else {
      // 添加用户逻辑
      console.log('添加用户:', userData)
      ElMessage.success('添加成功')
    }
    
    editDialogVisible.value = false
  } catch (error) {
    ElMessage.error(`操作失败: ${error}`)
  }
}

const handleResetPasswordSubmit = async (newPassword: string) => {
  try {
    // 调用API重置密码
    console.log('重置密码:', currentUser.value?.id, newPassword)
    ElMessage.success('密码重置成功')
    resetPasswordDialogVisible.value = false
  } catch (error) {
    ElMessage.error(`重置失败: ${error}`)
  }
}

const handleAdjustCreditSubmit = async (data: { amount: number; reason: string }) => {
  try {
    if (currentUser.value) {
      await userStore.adjustUserCredit(currentUser.value.id, data.amount, data.reason)
      ElMessage.success('信用分调整成功')
      adjustCreditDialogVisible.value = false
    }
  } catch (error) {
    ElMessage.error(`调整失败: ${error}`)
  }
}

// 批量操作
const batchDelete = async () => {
  if (selectedUsers.value.length === 0) return
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedUsers.value.length} 个用户吗？此操作不可恢复。`,
      '批量删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error'
      }
    )
    
    for (const user of selectedUsers.value) {
      await userStore.deleteUser(user.id)
    }
    
    selectedUsers.value = []
    ElMessage.success('批量删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`批量删除失败: ${error}`)
    }
  }
}

const batchDisable = async () => {
  if (selectedUsers.value.length === 0) return
  
  try {
    for (const user of selectedUsers.value) {
      await userStore.updateUser(user.id, { status: 'inactive' })
    }
    
    selectedUsers.value = []
    ElMessage.success('批量停用成功')
  } catch (error) {
    ElMessage.error(`批量停用失败: ${error}`)
  }
}

const batchEnable = async () => {
  if (selectedUsers.value.length === 0) return
  
  try {
    for (const user of selectedUsers.value) {
      await userStore.updateUser(user.id, { status: 'active' })
    }
    
    selectedUsers.value = []
    ElMessage.success('批量启用成功')
  } catch (error) {
    ElMessage.error(`批量启用失败: ${error}`)
  }
}

// 生命周期
onMounted(async () => {
  loading.value = true
  try {
    await userStore.fetchUsers()
  } catch (error) {
    ElMessage.error('加载用户列表失败')
  } finally {
    loading.value = false
  }
})

// 监听
watch(() => userStore.userError, (error) => {
  if (error) {
    ElMessage.error(error)
  }
})
</script>

<style scoped>
.user-manager {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.filter-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.table-section {
  margin-bottom: 20px;
}

.user-info-cell {
  display: flex;
  align-items: center;
}

.avatar-container {
  margin-right: 12px;
}

.user-details {
  flex: 1;
}

.user-name {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.real-name {
  font-weight: 600;
  font-size: 14px;
  margin-right: 8px;
}

.username {
  color: #909399;
  font-size: 12px;
}

.user-meta {
  display: flex;
  gap: 4px;
  margin-bottom: 6px;
}

.status-tag {
  margin-left: 4px;
}

.user-contact {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #606266;
}

.contact-item .el-icon {
  font-size: 12px;
}

.usage-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.stat-label {
  color: #909399;
}

.stat-value {
  font-weight: 500;
}

.text-muted {
  color: #909399;
  font-size: 12px;
}

.action-buttons {
  display: flex;
  align-items: center;
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

/* 表格行样式 */
:deep(.el-table .row-inactive) {
  background-color: rgba(255, 251, 230, 0.3);
}

:deep(.el-table .row-suspended) {
  background-color: rgba(255, 240, 240, 0.3);
}

/* 下拉菜单危险项 */
.danger-item {
  color: #f56c6c;
}

.danger-item:hover {
  background-color: #fef0f0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-info-cell {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .avatar-container {
    margin-right: 0;
    margin-bottom: 8px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: flex-start;
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