<template>
  <div class="check-in-page">
    <el-card class="page-card">
      <!-- 预约信息展示 -->
      <div class="reservation-info" v-if="reservationInfo">
        <h3 class="info-title">预约信息</h3>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="自习室">
            {{ reservationInfo.roomName }}（{{ reservationInfo.roomCode }}）
          </el-descriptions-item>
          <el-descriptions-item label="座位号">
            {{ reservationInfo.seatNumber }}
          </el-descriptions-item>
          <el-descriptions-item label="预约日期">
            {{ reservationInfo.date }}
          </el-descriptions-item>
          <el-descriptions-item label="预约时段">
            {{ reservationInfo.startTime }} - {{ reservationInfo.endTime }}
          </el-descriptions-item>
          <el-descriptions-item label="预约状态" :span="2">
            <el-tag :type="statusTypeMap[reservationInfo.status]">
              {{ statusTextMap[reservationInfo.status] }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 签到签退组件 -->
      <div class="check-in-out-container" v-if="reservationInfo">
        <CheckInOut
          :reservation-id="reservationId"
          :current-status="reservationInfo.status"
          @status-change="handleStatusChange"
          @error="handleError"
        />
      </div>

      <!-- 加载/空状态 -->
      <EmptyState
        v-if="!reservationInfo && !loading"
        title="预约信息不存在"
        description="该预约记录可能已被删除或不存在，请检查预约ID"
        icon-type="error"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElCard, ElDescriptions, ElDescriptionsItem, ElTag, ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { reservationApi } from '@/api';
import CheckInOut from '@/components/student/CheckInOut.vue';
import EmptyState from '@/components/common/UI/EmptyState.vue';
import type { IReservation } from '@/types/reservation.types';

// 状态管理 & 路由
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// 路由参数
const reservationId = ref<string>(route.params.id as string);

// 数据
const loading = ref(true);
const reservationInfo = ref<IReservation | null>(null);

// 状态映射
const statusTypeMap = {
  pending: 'warning',
  confirmed: 'success',
  checked_in: 'primary', // 新增签到状态
  temporary_leave: 'info', // 暂离状态
  completed: 'info',
  cancelled: 'danger'
};
const statusTextMap = {
  pending: '待确认',
  confirmed: '已确认',
  checked_in: '已签到',
  temporary_leave: '暂离中',
  completed: '已完成',
  cancelled: '已取消'
};

// 初始化数据
const initData = async () => {
  // 校验登录态
  if (!authStore.token) {
    router.push('/student/login');
    return;
  }
  // 获取预约详情
  await fetchReservationDetail();
};

// 获取预约详情
const fetchReservationDetail = async () => {
  loading.value = true;
  const { data, error } = await reservationApi.getReservationDetail(reservationId.value);
  if (data) {
    reservationInfo.value = data;
  } else {
    ElMessage.error(error?.message || '预约信息加载失败');
  }
  loading.value = false;
};

// 处理状态变更（签到/暂离/返回/签退）
const handleStatusChange = (newStatus: string) => {
  if (reservationInfo.value) {
    reservationInfo.value.status = newStatus as any;
  }
  ElMessage.success(`操作成功！当前状态：${statusTextMap[newStatus as keyof typeof statusTextMap] || newStatus}`);
};

// 处理错误
const handleError = (message: string) => {
  ElMessage.error(message);
};

// 页面挂载初始化
onMounted(() => initData());
</script>

<style scoped>
.check-in-page {
  padding: 20px;
  background-color: var(--background-color-base);
  min-height: 100vh;
}
.page-card {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  box-shadow: var(--box-shadow-light);
}
.reservation-info {
  margin-bottom: 30px;
}
.info-title {
  margin-bottom: 15px;
  color: var(--color-primary);
  border-bottom: 1px solid var(--border-color-light);
  padding-bottom: 10px;
}
.check-in-out-container {
  margin-top: 20px;
}
</style>