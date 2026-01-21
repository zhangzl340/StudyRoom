<template>
  <div class="data-management">
    <h3>数据管理</h3>
    <p>数据管理功能开发中...</p>
  </div>
</template>

<script setup lang="ts">
// 占位组件
const getSettingsData = () => ({})
const reset = () => {}

defineExpose({
  getSettingsData,
  reset
})
</script>

<style scoped>
.data-management {
  padding: 20px;
}
</style>