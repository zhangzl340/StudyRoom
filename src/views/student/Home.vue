<template>
  <div class="student-home">
    <!-- 顶部导航 -->
    <el-header class="home-header">
      <div class="header-left">
        <el-icon class="logo-icon"><Notebook /></el-icon>
        <span>自习室预约系统-学生端</span>
      </div>
      <div class="header-right">
        <el-dropdown @command="handleDropdown">
          <span class="user-info">
            <el-icon><User /></el-icon>
            {{ authStore.user?.name || '未登录' }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- 自习室概览（复用 RoomCard 组件） -->
    <el-main class="home-main">
      <div class="home-search">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索自习室名称/编号"
          prefix="🔍"
          @change="fetchRoomList"
        />
      </div>
      <h3 class="section-title">自习室概览</h3>
      <el-row :gutter="20" class="room-list">
        <el-col :span="8" v-for="room in roomList" :key="room.id">
          <RoomCard
            :room="room"
            @view-detail="goToRoomDetail(room.id)"
            @reserve="goToRoomDetail(room.id)"
          />
        </el-col>
        <el-col :span="8" v-if="roomList.length === 0 && !loading">
          <EmptyState title="暂无自习室" description="当前没有可用的自习室" icon-type="data" />
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElHeader, ElMain, ElRow, ElCol, ElMessage, ElInput } from 'element-plus';
import { Notebook, User } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { roomApi } from '@/api';
import RoomCard from '@/components/common/UI/RoomCard.vue';
import EmptyState from '@/components/common/UI/EmptyState.vue';
import type { IRoom } from '@/types/room.types';

// 状态管理 & 路由
const authStore = useAuthStore();
const router = useRouter();

// 数据
const roomList = ref<IRoom[]>([]);
const loading = ref(true);
const searchKeyword = ref('');

// 初始化数据
const initData = async () => {
  // 校验登录态
  if (!authStore.token) {
    router.push('/student/login');
    return;
  }
  // 刷新用户信息
  await authStore.getCurrentUser();
  // 获取自习室列表
  await fetchRoomList();
};

// 获取自习室列表（调用已有 roomApi）
const fetchRoomList = async () => {
  loading.value = true;
  const { data, error } = await roomApi.getRooms({ keyword: searchKeyword.value });
  if (data) {
    roomList.value = data.list;
  } else {
    ElMessage.error(error?.message || '自习室数据加载失败');
  }
  loading.value = false;
};

// 跳转到自习室详情页
const goToRoomDetail = (roomId: string) => {
  router.push(`/student/room/${roomId}`);
};

// 下拉菜单处理
const handleDropdown = (command: string) => {
  if (command === 'profile') {
    router.push('/student/profile');
  } else if (command === 'logout') {
    authStore.logout();
    ElMessage.success('退出成功');
    router.push('/student/login');
  }
};

// 页面挂载初始化
onMounted(() => initData());
</script>

<style scoped>
.student-home {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.home-header {
  background-color: var(--color-primary);
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
}
.logo-icon {
  margin-right: 8px;
}
.user-info {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}
.home-main {
  flex: 1;
  padding: 20px;
  background-color: var(--background-color-base);
}
.home-search {
  margin-bottom: 20px;
}
.section-title {
  margin-bottom: 15px;
  color: var(--color-text-primary);
}
.room-list {
  margin-top: 10px;
}
</style>