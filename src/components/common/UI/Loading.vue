<!-- 加载组件 -->
<template>
  <div class="loading-container" :class="{ fullscreen: fullscreen }">
    <div class="loading-content">
      <div class="spinner" :style="{ width: size + 'px', height: size + 'px' }">
        <div class="spinner-inner">
          <div class="spinner-circle"></div>
          <div class="spinner-circle"></div>
          <div class="spinner-circle"></div>
          <div class="spinner-circle"></div>
        </div>
      </div>
      <div class="loading-text" v-if="text">{{ text }}</div>
      <div class="loading-text" v-else-if="!hideDefaultText">加载中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  // 是否全屏显示
  fullscreen?: boolean
  // 加载文字
  text?: string
  // 是否隐藏默认文字
  hideDefaultText?: boolean
  // 加载器大小
  size?: number
}

withDefaults(defineProps<Props>(), {
  fullscreen: false,
  text: '',
  hideDefaultText: false,
  size: 50
})
</script>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.loading-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9999;
  padding: 0;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner {
  position: relative;
  margin: 0 auto;
}

.spinner-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform: rotate(-45deg);
}

.spinner-circle {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #409eff;
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-circle:nth-child(1) {
  animation-delay: -0.45s;
  border-top-color: #e6a23c;
}

.spinner-circle:nth-child(2) {
  animation-delay: -0.3s;
  border-top-color: #67c23a;
}

.spinner-circle:nth-child(3) {
  animation-delay: -0.15s;
  border-top-color: #f56c6c;
}

.spinner-circle:nth-child(4) {
  animation-delay: 0s;
  border-top-color: #409eff;
}

.loading-text {
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  margin-top: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>