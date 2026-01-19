<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'
import AdminLayout from './layouts/AdminLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'

const route = useRoute()

const layout = computed(() => {
  const layoutName = route.meta.layout as string || 'DefaultLayout'
  
  switch (layoutName) {
    case 'AdminLayout':
      return AdminLayout
    case 'AuthLayout':
      return AuthLayout
    default:
      return DefaultLayout
  }
})
</script>

<style>
/* 全局样式已经在style.css中导入 */
</style>