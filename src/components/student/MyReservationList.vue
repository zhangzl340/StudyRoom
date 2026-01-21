<template>
  <el-table 
    :data="reservationList" 
    border 
    style="width: 100%" 
    v-loading="loading"
    :empty-text="loading ? '' : '暂无符合条件的预约记录'"
  >
    <!-- 序号 -->
    <el-table-column type="index" label="序号" width="60" />
    
    <!-- 自习室信息 -->
    <el-table-column prop="roomName" label="自习室" min-width="120">
      <template #default="scope">
        <div>
          <span class="room-name">{{ scope.row.roomName || '未知自习室' }}</span>
          <span class="room-code">({{ scope.row.roomCode || '' }})</span>
        </div>
      </template>
    </el-table-column>
    
    <!-- 座位信息 -->
    <el-table-column prop="seatNumber" label="座位号" width="100" />
    
    <!-- 预约时间 -->
    <el-table-column label="预约时间" min-width="200">
      <template #default="scope">
        <div>
          <span>{{ scope.row.date }}</span>
          <span class="time-separator"> | </span>
          <span>{{ scope.row.startTime }} - {{ scope.row.endTime }}</span>
        </div>
      </template>
    </el-table-column>
    
    <!-- 预约状态 -->
    <el-table-column prop="status" label="状态" width="120">
      <template #default="scope">
        <el-tag
          :type="statusTypeMap[scope.row.status]"
          size="small"
        >
          {{ statusTextMap[scope.row.status] }}
        </el-tag>
      </template>
    </el-table-column>
    
    <!-- 操作列 -->
    <el-table-column label="操作" width="200">
      <template #default="scope">
        <!-- 签到按钮（仅待确认/已确认状态） -->
        <el-button
          type="primary"
          size="small"
          @click="emit('check-in', scope.row.id)"
          v-if="['pending', 'confirmed'].includes(scope.row.status)"
          icon="CircleCheck"
        >
          签到
        </el-button>
        
        <!-- 取消预约按钮（仅待确认/已确认状态） -->
        <el-button
          type="danger"
          size="small"
          @click="handleCancelConfirm(scope.row.id)"
          v-if="['pending', 'confirmed'].includes(scope.row.status)"
          icon="Delete"
        >
          取消预约
        </el-button>
        
        <!-- 已完成/已取消状态无操作 -->
        <span v-else class="no-operation">无操作</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { ElTable, ElTableColumn, ElTag, ElButton, ElMessageBox } from 'element-plus';
import type { IReservation } from '@/types/reservation.types';

// Props
const props = defineProps({
  reservationList: {
    type: Array as () => IReservation[],
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits<{
  (e: 'cancel-reservation', reservationId: string): void;
  (e: 'check-in', reservationId: string): void;
}>();

// 状态映射
const statusTypeMap = {
  pending: 'warning',
  confirmed: 'success',
  completed: 'info',
  cancelled: 'danger'
};
const statusTextMap = {
  pending: '待确认',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消'
};

// 取消预约确认弹窗
const handleCancelConfirm = (reservationId: string) => {
  ElMessageBox.confirm(
    '确定要取消该预约吗？取消后将无法恢复',
    '温馨提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    emit('cancel-reservation', reservationId);
  }).catch(() => {
    // 取消操作，不做处理
  });
};
</script>

<style scoped>
.room-name {
  font-weight: bold;
  color: var(--color-text-primary);
}
.room-code {
  color: var(--color-text-regular);
  font-size: 12px;
}
.time-separator {
  color: var(--color-text-placeholder);
  margin: 0 5px;
}
.no-operation {
  color: var(--color-text-placeholder);
  font-size: 12px;
}
</style>