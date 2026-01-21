<template>
  <div class="import-users-form">
    <el-alert type="info" title="用户导入说明" show-icon style="margin-bottom: 20px">
      支持Excel文件导入用户数据。请确保学号、邮箱等字段的唯一性。
    </el-alert>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="Excel导入" name="excel">
        <excel-import-tab @success="$emit('success')" @cancel="$emit('cancel')" />
      </el-tab-pane>
      <el-tab-pane label="手动添加" name="manual">
        <manual-add-tab @success="$emit('success')" @cancel="$emit('cancel')" />
      </el-tab-pane>
      <el-tab-pane label="批量生成" name="batch">
        <batch-generate-tab @success="$emit('success')" @cancel="$emit('cancel')" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ExcelImportTab from './ImportUsersForm/ExcelImportTab.vue'
import ManualAddTab from './ImportUsersForm/ManualAddTab.vue'
import BatchGenerateTab from './ImportUsersForm/BatchGenerateTab.vue'

const emit = defineEmits<{
  success: []
  cancel: []
}>()

const activeTab = ref('excel')

// 如果没有子组件，先创建占位
// const ExcelImportTab = {
//   template: `
//     <div class="excel-import-tab">
//       <h3>Excel导入用户</h3>
//       <p>功能开发中...</p>
//       <el-button @click="$emit('cancel')">取消</el-button>
//     </div>
//   `,
//   emits: ['success', 'cancel']
// }

// const ManualAddTab = {
//   template: `
//     <div class="manual-add-tab">
//       <h3>手动添加用户</h3>
//       <p>功能开发中...</p>
//       <el-button @click="$emit('cancel')">取消</el-button>
//     </div>
//   `,
//   emits: ['success', 'cancel']
// }

// const BatchGenerateTab = {
//   template: `
//     <div class="batch-generate-tab">
//       <h3>批量生成用户</h3>
//       <p>功能开发中...</p>
//       <el-button @click="$emit('cancel')">取消</el-button>
//     </div>
//   `,
//   emits: ['success', 'cancel']
// }
</script>

<style scoped>
.import-users-form {
  padding: 20px;
}
</style>