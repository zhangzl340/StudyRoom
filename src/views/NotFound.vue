<template>
  <div class="not-found">
    <h1>404 - 页面未找到</h1>
    <p>抱歉，您访问的页面不存在。</p>
    <router-link to="/" class="back-home">返回首页</router-link>
  </div>
</template>

<script setup lang="ts">
// 404页面组件
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
}

.not-found h1 {
  font-size: 48px;
  color: #f56c6c;
  margin-bottom: 20px;
}

.not-found p {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
}

.back-home {
  padding: 12px 24px;
  background-color: #409eff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px;
  transition: background-color 0.3s;
}

.back-home:hover {
  background-color: #66b1ff;
}
</style>