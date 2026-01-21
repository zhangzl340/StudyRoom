<template>
  <div class="my-reservations">
    <el-card class="page-card">
      <div class="page-header">
        <h2 class="page-title">我的预约管理</h2>
        <div class="filter-group">
          <el-select v-model="statusFilter" placeholder="筛选状态" @change="fetchReservations">
            <el-option label="全部" value="" />
            <el-option label="待确认" value="pending" />
            <el-option label="已确认" value="confirmed" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
          <el-date-picker
            v-model="dateFilter"
            type="date"
            placeholder="筛选日期"
            @change="fetchReservations"
            style="width: 200px; margin-left: 10px"
          />
        </div>
      </div>

      <!-- 预约记录列表组件 -->
      <MyReservationList
        :reservation-list="reservationList"
        :loading="loading"
        @cancel-reservation="handleCancelReservation"
        @check-in="handleGoToCheckIn"
      />

      <!-- 分页 -->
      <el-pagination
        v-if="total > 0"
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />

      <!-- 空状态 -->
      <EmptyState
        v-if="reservationList.length === 0 && !loading"
        title="暂无预约记录"
        description="你还没有预约过自习室，快去预约吧~"
        icon-type="search"
        action-text="去预约"
        @action="goToHome"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElCard, ElSelect, ElOption, ElDatePicker, ElPagination, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { reservationApi } from '@/api';
import MyReservationList from '@/components/student/MyReservationList.vue';
import EmptyState from '@/components/common/UI/EmptyState.vue';
import type { IReservation } from '@/types/reservation.types';

// 状态管理 & 路由
const authStore = useAuthStore();
const router = useRouter();

// 筛选条件
const statusFilter = ref<string>('');
const dateFilter = ref<string>('');

// 分页参数
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 数据
const loading = ref(true);
const reservationList = ref<IReservation[]>([]);

// 初始化数据
const initData = async () => {
  // 校验登录态
  if (!authStore.token) {
    router.push('/student/login');
    return;
  }
  // 获取预约列表
  await fetchReservations();
};

// 获取预约列表（支持筛选+分页）
const fetchReservations = async () => {
  loading.value = true;
  const { data, error } = await reservationApi.getMyReservations({
    status: statusFilter.value,
    date: dateFilter.value,
    pageNum: pageNum.value,
    pageSize: pageSize.value
  });
  if (data) {
    reservationList.value = data.list;
    total.value = data.total;
  } else {
    ElMessage.error(error?.message || '预约记录加载失败');
  }
  loading.value = false;
};

// 处理取消预约
const handleCancelReservation = async (reservationId: string) => {
  const { error } = await reservationApi.cancelReservation(reservationId);
  if (!error) {
    ElMessage.success('取消预约成功');
    fetchReservations(); // 刷新列表
  } else {
    ElMessage.error(error.message || '取消预约失败');
  }
};

// 跳转到签到页面
const handleGoToCheckIn = (reservationId: string) => {
  router.push(`/student/check-in/${reservationId}`);
};

// 分页事件处理
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  fetchReservations();
};
const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  fetchReservations();
};

// 跳转到主页
const goToHome = () => {
  router.push('/student/home');
};

// 页面挂载初始化
onMounted(() => initData());
</script>

<style scoped>
.my-reservations {
  padding: 20px;
  background-color: var(--background-color-base);
  min-height: 100vh;
}
.page-card {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  box-shadow: var(--box-shadow-light);
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.page-title {
  color: var(--color-primary);
  margin: 0;
}
.filter-group {
  display: flex;
  align-items: center;
}
.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>