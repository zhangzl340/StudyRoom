<template>
  <div class="student-profile">
    <el-card class="profile-card">
      <h2 class="profile-title">个人中心</h2>
      <el-tabs v-model="activeTab" class="profile-tabs">
        <!-- 个人信息 -->
        <el-tab-pane label="个人信息" name="info">
          <el-form
            ref="profileFormRef"
            :model="profileForm"
            :rules="profileRules"
            label-width="100px"
            class="profile-form"
          >
            <el-form-item label="学号" prop="username">
              <el-input v-model="profileForm.username" disabled />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="profileForm.name" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="profileForm.email" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="profileForm.phone" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateProfile">保存修改</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 预约记录 -->
        <el-tab-pane label="预约记录" name="reservation">
          <el-table :data="reservationList" border style="width: 100%" v-loading="loading">
            <el-table-column prop="roomName" label="自习室" />
            <el-table-column prop="seatNumber" label="座位号" />
            <el-table-column prop="date" label="预约日期" />
            <el-table-column prop="startTime" label="开始时间" />
            <el-table-column prop="endTime" label="结束时间" />
            <el-table-column prop="status" label="状态">
              <template #default="scope">
                <el-tag
                  :type="
                    scope.row.status === 'pending' ? 'warning' :
                    scope.row.status === 'confirmed' ? 'success' :
                    scope.row.status === 'completed' ? 'info' : 'danger'
                  "
                >
                  {{ statusMap[scope.row.status] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  type="text"
                  @click="cancelReservation(scope.row.id)"
                  v-if="['pending', 'confirmed'].includes(scope.row.status)"
                  color="var(--color-danger)"
                >
                  取消预约
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <EmptyState
            v-if="reservationList.length === 0 && !loading"
            title="暂无预约记录"
            description="你还没有预约过自习室，快去预约吧~"
            icon-type="search"
            action-text="去预约"
            @action="goToHome"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElCard, ElTabs, ElTabPane, ElForm, ElFormItem, ElInput, ElButton, ElTable, ElTableColumn, ElTag, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { authApi, reservationApi } from '@/api';
import EmptyState from '@/components/common/UI/EmptyState.vue';
import type { IUser } from '@/types/user.types';
import type { IReservation } from '@/types/reservation.types';

// 状态管理 & 路由
const authStore = useAuthStore();
const router = useRouter();

// 数据
const activeTab = ref('info');
const loading = ref(false);
const reservationList = ref<IReservation[]>([]);
const profileForm = reactive<Partial<IUser>>({
  username: '',
  name: '',
  email: '',
  phone: ''
});
const profileRules = reactive({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '邮箱格式错误', trigger: 'blur' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }]
});
const statusMap = {
  pending: '待确认',
  confirmed: '已确认',
  cancelled: '已取消',
  completed: '已完成'
};

// 初始化数据
const initData = async () => {
  // 校验登录态
  if (!authStore.token) {
    router.push('/student/login');
    return;
  }
  // 加载个人信息
  await fetchProfile();
  // 加载预约记录
  await fetchReservations();
};

// 获取个人信息（调用 authApi）
const fetchProfile = async () => {
  const { data, error } = await authApi.getCurrentUser();
  if (data) {
    Object.assign(profileForm, data);
  } else {
    ElMessage.error(error?.message || '个人信息加载失败');
  }
};

// 获取预约记录（调用 reservationApi）
const fetchReservations = async () => {
  loading.value = true;
  const { data, error } = await reservationApi.getMyReservations();
  if (data) {
    reservationList.value = data.list;
  } else {
    ElMessage.error(error?.message || '预约记录加载失败');
  }
  loading.value = false;
};

// 更新个人信息（调用 authApi）
const updateProfile = async () => {
  if (!authStore.user) return;
  const { error } = await authApi.updateUserInfo(profileForm);
  if (!error) {
    ElMessage.success('修改成功');
    // 同步更新 Store
    authStore.user = { ...authStore.user, ...profileForm };
  } else {
    ElMessage.error(error.message || '修改失败');
  }
};

// 取消预约（调用 reservationApi）
const cancelReservation = async (reservationId: string) => {
  const { error } = await reservationApi.cancelReservation(reservationId);
  if (!error) {
    ElMessage.success('取消预约成功');
    fetchReservations(); // 刷新列表
  } else {
    ElMessage.error(error.message || '取消失败');
  }
};

// 跳转到主页
const goToHome = () => router.push('/student/home');

// 页面挂载初始化
onMounted(() => initData());
</script>

<style scoped>
.student-profile {
  padding: 20px;
  background-color: var(--background-color-base);
  min-height: 100vh;
}
.profile-card {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  box-shadow: var(--box-shadow-light);
}
.profile-title {
  margin-bottom: 20px;
  color: var(--color-primary);
}
.profile-tabs {
  margin-top: 10px;
}
.profile-form {
  margin-top: 20px;
  max-width: 600px;
}
</style>