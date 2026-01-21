<template>
  <div class="system-maintenance">
    <h3>系统维护</h3>
    <p>系统维护功能开发中...</p>
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
.system-maintenance {
  padding: 20px;
}
</style>