<template>
  <div class="user-detail-panel">
    <div v-if="user" class="detail-content">
      <!-- 基本信息 -->
      <el-descriptions title="基本信息" :column="2" border>
        <el-descriptions-item label="用户ID">{{ user.id }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ user.username }}</el-descriptions-item>
        <el-descriptions-item label="真实姓名">{{ user.realName }}</el-descriptions-item>
        <el-descriptions-item label="学号/工号">{{ user.studentId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ user.email }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ user.phone || '-' }}</el-descriptions-item>
      </el-descriptions>

      <!-- 学院信息 -->
      <el-descriptions title="学院信息" :column="2" border style="margin-top: 20px">
        <el-descriptions-item label="学院">{{ user.college || '-' }}</el-descriptions-item>
        <el-descriptions-item label="专业">{{ user.major || '-' }}</el-descriptions-item>
        <el-descriptions-item label="年级">{{ user.grade || '-' }}</el-descriptions-item>
        <el-descriptions-item label="班级">{{ user.className || '-' }}</el-descriptions-item>
      </el-descriptions>

      <!-- 账号信息 -->
      <el-descriptions title="账号信息" :column="2" border style="margin-top: 20px">
        <el-descriptions-item label="用户角色">
          <el-tag :type="getRoleTagType(user.role)">{{ formatRole(user.role) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="账号状态">
          <el-tag :type="getStatusTagType(user.status)">{{ formatStatus(user.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="信用分">
          <el-tag :type="getCreditScoreType(user.creditScore)">{{ user.creditScore }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDate(user.createdAt) }}</el-descriptions-item>
        <el-descriptions-item label="最后登录">{{ user.lastLoginTime ? formatDate(user.lastLoginTime) : '从未登录' }}</el-descriptions-item>
        <el-descriptions-item label="最后更新">{{ formatDate(user.updatedAt) }}</el-descriptions-item>
      </el-descriptions>

      <!-- 使用统计 -->
      <el-descriptions title="使用统计" :column="2" border style="margin-top: 20px">
        <el-descriptions-item label="总预约次数">{{ user.reservationCount || 0 }}</el-descriptions-item>
        <el-descriptions-item label="总使用时长">{{ user.totalUsageHours || 0 }} 小时</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IUser, UserRole, UserStatus } from '@/types/user.types'

const props = defineProps<{
  user: IUser
}>()

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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

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
</script>

<style scoped>
.user-detail-panel {
  padding: 10px;
}
</style>