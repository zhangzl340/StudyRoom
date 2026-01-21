<template>
  <el-form
    ref="reservationFormRef"
    :model="reservationForm"
    :rules="reservationRules"
    label-width="80px"
    class="reservation-form"
  >
    <el-form-item label="座位号" prop="seatNumber">
      <el-input v-model="reservationForm.seatNumber" disabled />
    </el-form-item>
    <el-form-item label="预约日期" prop="date">
      <el-date-picker
        v-model="reservationForm.date"
        type="date"
        placeholder="选择日期"
        :disabled-date="disabledPastDate"
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item label="开始时间" prop="startTime">
      <el-time-picker
        v-model="reservationForm.startTime"
        format="HH:mm"
        placeholder="选择开始时间"
        :disabled="!reservationForm.date"
        :picker-options="{
          start: '06:00',
          end: '22:00',
          step: '00:30'
        }"
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item label="结束时间" prop="endTime">
      <el-time-picker
        v-model="reservationForm.endTime"
        format="HH:mm"
        placeholder="选择结束时间"
        :disabled="!reservationForm.startTime"
        :picker-options="{
          start: reservationForm.startTime || '06:30',
          end: '22:30',
          step: '00:30'
        }"
        style="width: 100%"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="handleSubmit"
        :loading="submitting"
        class="submit-btn"
      >
        提交预约
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { ElForm, ElFormItem, ElInput, ElDatePicker, ElTimePicker, ElButton, ElMessage } from 'element-plus';
import type { ICreateReservationRequest } from '@/types/reservation.types';

// Props
const props = defineProps({
  roomId: { type: String, required: true },
  seatId: { type: String, required: true },
  seatNumber: { type: String, required: true }
});

// Emits
const emit = defineEmits<{ (e: 'submit-reservation', form: ICreateReservationRequest): void }>();

// 表单（严格遵循 ICreateReservationRequest 类型）
const reservationFormRef = ref<InstanceType<typeof ElForm>>();
const submitting = ref(false);
const reservationForm = reactive<ICreateReservationRequest>({
  roomId: props.roomId,
  seatId: props.seatId,
  date: '',
  startTime: '',
  endTime: '',
  seatNumber: props.seatNumber // 冗余字段，仅用于展示
});

// 表单规则
const reservationRules = reactive({
  date: [{ required: true, message: '请选择预约日期', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' },
    {
      validator: (_, value: string, callback: any) => {
        if (!value || !reservationForm.startTime) return callback();
        const start = new Date(`2000-01-01 ${reservationForm.startTime}`);
        const end = new Date(`2000-01-01 ${value}`);
        if (end <= start) {
          callback(new Error('结束时间必须晚于开始时间'));
        } else if (end.getTime() - start.getTime() > 8 * 3600 * 1000) {
          callback(new Error('单次预约最长8小时'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ]
});

// 禁用过去的日期
const disabledPastDate = (date: Date) => {
  return date < new Date(new Date().setHours(0, 0, 0, 0));
};

// 监听 props 变化，同步更新表单
watch([() => props.roomId, () => props.seatId, () => props.seatNumber], () => {
  reservationForm.roomId = props.roomId;
  reservationForm.seatId = props.seatId;
  reservationForm.seatNumber = props.seatNumber;
});

// 提交表单
const handleSubmit = async () => {
  if (!reservationFormRef.value) return;
  try {
    submitting.value = true;
    const valid = await reservationFormRef.value.validate();
    if (valid) {
      emit('submit-reservation', { ...reservationForm });
    }
  } catch (error) {
    ElMessage.error('表单验证失败，请检查输入');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.reservation-form {
  margin-top: 10px;
}
.submit-btn {
  width: 100%;
  margin-top: 10px;
}
</style>