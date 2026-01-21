<template>
  <div class="reservation-rules">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="200px"
      label-position="left"
    >
      <el-form-item label="每人每天最大预约次数" prop="maxReservationPerDay">
        <el-input-number
          v-model="formData.maxReservationPerDay"
          :min="1"
          :max="10"
        />
        <span class="unit">次</span>
      </el-form-item>

      <el-form-item label="最多可预约未来天数" prop="maxFutureDays">
        <el-input-number
          v-model="formData.maxFutureDays"
          :min="1"
          :max="30"
        />
        <span class="unit">天</span>
      </el-form-item>

      <el-form-item label="最短预约时长" prop="minReservationMinutes">
        <el-input-number
          v-model="formData.minReservationMinutes"
          :min="30"
          :max="120"
          :step="30"
        />
        <span class="unit">分钟</span>
      </el-form-item>

      <el-form-item label="最长预约时长" prop="maxReservationMinutes">
        <el-input-number
          v-model="formData.maxReservationMinutes"
          :min="60"
          :max="480"
          :step="30"
        />
        <span class="unit">分钟</span>
      </el-form-item>

      <el-form-item label="允许提前签到时间" prop="checkInEarlyMinutes">
        <el-input-number
          v-model="formData.checkInEarlyMinutes"
          :min="0"
          :max="60"
        />
        <span class="unit">分钟</span>
      </el-form-item>

      <el-form-item label="允许迟到签到时间" prop="checkInLateMinutes">
        <el-input-number
          v-model="formData.checkInLateMinutes"
          :min="0"
          :max="60"
        />
        <span class="unit">分钟</span>
      </el-form-item>

      <el-form-item label="未签到自动取消时间" prop="autoCancelMinutes">
        <el-input-number
          v-model="formData.autoCancelMinutes"
          :min="10"
          :max="60"
        />
        <span class="unit">分钟</span>
      </el-form-item>

      <el-form-item label="暂时离开最长时间" prop="tempLeaveMaxMinutes">
        <el-input-number
          v-model="formData.tempLeaveMaxMinutes"
          :min="10"
          :max="120"
        />
        <span class="unit">分钟</span>
      </el-form-item>

      <el-form-item label="预约冲突处理" prop="conflictResolution">
        <el-select v-model="formData.conflictResolution" style="width: 300px">
          <el-option label="禁止冲突预约" value="reject" />
          <el-option label="自动调整时间" value="adjust" />
          <el-option label="提示用户选择" value="prompt" />
        </el-select>
      </el-form-item>

      <el-form-item label="信用分扣分规则" prop="creditDeduction">
        <el-table :data="creditRules" style="width: 600px">
          <el-table-column prop="type" label="违规类型" width="150" />
          <el-table-column prop="description" label="描述" width="250" />
          <el-table-column label="扣分值" width="100">
            <template #default="scope">
              <el-input-number
                v-model="scope.row.deduction"
                :min="0"
                :max="20"
                size="small"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  maxReservationPerDay: 3,
  maxFutureDays: 7,
  minReservationMinutes: 30,
  maxReservationMinutes: 240,
  checkInEarlyMinutes: 15,
  checkInLateMinutes: 30,
  autoCancelMinutes: 30,
  tempLeaveMaxMinutes: 30,
  conflictResolution: 'reject'
})

// 信用分扣分规则
const creditRules = reactive([
  { type: '预约未到', description: '预约成功后未在指定时间内签到', deduction: 10 },
  { type: '迟到签到', description: '超过允许迟到时间后签到', deduction: 5 },
  { type: '早退', description: '提前离开且未签退', deduction: 5 },
  { type: '超时使用', description: '超过预约时间未离开', deduction: 5 },
  { type: '违规占用', description: '未预约占用座位', deduction: 15 }
])

// 表单验证规则
const formRules: FormRules = {
  maxReservationPerDay: [
    { required: true, message: '请输入最大预约次数', trigger: 'blur' }
  ],
  maxFutureDays: [
    { required: true, message: '请输入最多可预约未来天数', trigger: 'blur' }
  ]
}

// 暴露给父组件的方法
const getSettingsData = () => {
  return {
    ...formData,
    creditRules: [...creditRules]
  }
}

const reset = () => {
  Object.assign(formData, {
    maxReservationPerDay: 3,
    maxFutureDays: 7,
    minReservationMinutes: 30,
    maxReservationMinutes: 240,
    checkInEarlyMinutes: 15,
    checkInLateMinutes: 30,
    autoCancelMinutes: 30,
    tempLeaveMaxMinutes: 30,
    conflictResolution: 'reject'
  })
  
  creditRules.forEach(rule => {
    if (rule.type === '预约未到') rule.deduction = 10
    else if (rule.type === '迟到签到') rule.deduction = 5
    else if (rule.type === '早退') rule.deduction = 5
    else if (rule.type === '超时使用') rule.deduction = 5
    else if (rule.type === '违规占用') rule.deduction = 15
  })
}

defineExpose({
  getSettingsData,
  reset
})
</script>

<style scoped>
.reservation-rules {
  padding: 20px;
}

.unit {
  margin-left: 8px;
  color: #606266;
}
</style>