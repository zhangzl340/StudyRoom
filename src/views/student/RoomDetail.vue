<template>
  <div class="room-detail">
    <!-- 自习室基本信息 -->
    <el-card class="room-info-card">
      <div class="room-header">
        <h2>{{ roomInfo.name }}（{{ roomInfo.code }}）</h2>
        <el-tag :type="roomStatusType">{{ roomStatusText }}</el-tag>
      </div>
      <div class="room-meta">
        <div class="meta-item">
          <el-icon><Location /></el-icon>
          <span>{{ roomInfo.building }} {{ roomInfo.floor }}层</span>
        </div>
        <div class="meta-item">
          <el-icon><User /></el-icon>
          <span>总容量：{{ roomInfo.capacity }}人 | 剩余座位：{{ roomInfo.availableSeats }}个</span>
        </div>
        <div class="meta-item">
          <el-icon><Clock /></el-icon>
          <span>开放时间：{{ roomInfo.openTime }} - {{ roomInfo.closeTime }}</span>
        </div>
        <div class="meta-item">
          <el-icon><Tag /></el-icon>
          <el-tag v-for="feature in roomInfo.features" :key="feature" size="small">
            {{ featureLabels[feature] || feature }}
          </el-tag>
        </div>
      </div>
    </el-card>

    <!-- 座位图 + 预约表单 -->
    <el-row :gutter="20" class="detail-content">
      <!-- 座位图组件 -->
      <el-col :span="16">
        <el-card class="seat-map-card">
          <h3 class="card-title">座位选择</h3>
          <div class="seat-map-container">
            <SeatMap
              :seat-list="seatList"
              :room-id="roomId"
              @select-seat="handleSelectSeat"
              :loading="loading"
            />
          </div>
        </el-card>
      </el-col>

      <!-- 预约表单 -->
      <el-col :span="8">
        <el-card class="reservation-form-card">
          <h3 class="card-title">预约信息</h3>
          <div v-if="selectedSeat">
            <ReservationForm
              :room-id="roomId"
              :seat-id="selectedSeat.id"
              :seat-number="selectedSeat.seatNumber"
              @submit-reservation="handleSubmitReservation"
            />
          </div>
          <div v-else class="no-seat-tip">
            <EmptyState
              title="请选择座位"
              description="点击座位图中的可用座位（绿色）进行预约"
              icon-type="search"
              compact
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElCard, ElRow, ElCol, ElTag, ElMessage } from 'element-plus';
import { Location, User, Clock, Tag } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { roomApi, reservationApi } from '@/api';
import SeatMap from '@/components/student/SeatMap.vue';
import ReservationForm from '@/components/student/ReservationForm.vue';
import EmptyState from '@/components/common/UI/EmptyState.vue';
import type { IRoom, ISeat } from '@/types/room.types';
import type { ICreateReservationRequest } from '@/types/reservation.types';

// 状态管理 & 路由
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// 路由参数
const roomId = ref<string>(route.params.id as string);

// 数据
const loading = ref(true);
const roomInfo = ref<IRoom>({} as IRoom);
const seatList = ref<ISeat[]>([]);
const selectedSeat = ref<ISeat | null>(null);
const featureLabels = computed(() => ({
  wifi: 'WiFi',
  air_conditioner: '空调',
  power_sockets: '电源插座',
  quiet_zone: '静音区'
}));
const roomStatusType = computed(() => {
  return roomInfo.value.status === 'open' ? 'success' : roomInfo.value.status === 'maintenance' ? 'warning' : 'danger';
});
const roomStatusText = computed(() => {
  return roomInfo.value.status === 'open' ? '开放中' : roomInfo.value.status === 'maintenance' ? '维护中' : '已关闭';
});

// 初始化数据
const initData = async () => {
  // 校验登录态
  if (!authStore.token) {
    router.push('/student/login');
    return;
  }
  // 加载自习室详情和座位
  await Promise.all([fetchRoomDetail(), fetchSeatList()]);
  loading.value = false;
};

// 获取自习室详情（调用 roomApi）
const fetchRoomDetail = async () => {
  const { data, error } = await roomApi.getRoom(roomId.value);
  if (data) {
    roomInfo.value = data;
  } else {
    ElMessage.error(error?.message || '自习室详情加载失败');
    router.back();
  }
};

// 获取座位列表（调用 roomApi）
const fetchSeatList = async () => {
  const { data, error } = await roomApi.getRoomSeats(roomId.value);
  if (data) {
    seatList.value = data;
  } else {
    ElMessage.error(error?.message || '座位信息加载失败');
  }
};

// 处理座位选择
const handleSelectSeat = (seat: ISeat) => {
  if (seat.status !== 'available') {
    ElMessage.warning('该座位不可预约');
    return;
  }
  selectedSeat.value = seat;
};

// 处理预约提交（调用 reservationApi）
const handleSubmitReservation = async (form: ICreateReservationRequest) => {
  // 检查预约冲突
  const { data: conflictData } = await reservationApi.checkReservationConflict(
    form.seatId,
    `${form.date} ${form.startTime}`,
    `${form.date} ${form.endTime}`
  );
  if (conflictData?.hasConflict) {
    ElMessage.error('该时间段已被预约，请选择其他时间');
    return;
  }

  // 提交预约
  const { error } = await reservationApi.createReservation(form);
  if (!error) {
    ElMessage.success(`预约成功！座位号：${selectedSeat.value?.seatNumber}`);
    setTimeout(() => router.push('/student/profile?tab=reservation'), 1500);
  } else {
    ElMessage.error(error.message || '预约失败');
  }
};

// 页面挂载初始化
onMounted(() => initData());
</script>

<style scoped>
.room-detail {
  padding: 20px;
  background-color: var(--background-color-base);
  min-height: 100vh;
}
.room-info-card {
  margin-bottom: 20px;
  padding: 20px;
}
.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.room-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  color: var(--color-text-regular);
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
}
.detail-content {
  height: calc(100vh - 220px);
}
.seat-map-card, .reservation-form-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.card-title {
  margin-bottom: 15px;
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--border-color-light);
  padding-bottom: 10px;
}
.seat-map-container {
  flex: 1;
  overflow: auto;
  padding: 10px;
}
.no-seat-tip {
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>