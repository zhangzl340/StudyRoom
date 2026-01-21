<template>
  <div class="seat-map">
    <!-- 图例 -->
    <div class="seat-legend">
      <div class="legend-item">
        <div class="seat-demo available"></div>
        <span>可预约</span>
      </div>
      <div class="legend-item">
        <div class="seat-demo occupied"></div>
        <span>已占用</span>
      </div>
      <div class="legend-item">
        <div class="seat-demo broken"></div>
        <span>故障</span>
      </div>
      <div class="legend-item">
        <div class="seat-demo selected"></div>
        <span>已选中</span>
      </div>
    </div>

    <!-- 座位区域（按 positionX/Y 定位） -->
    <div class="seat-area" :style="{ width: `${maxX + 80}px`, height: `${maxY + 80}px` }">
      <div
        class="seat-item"
        :class="[seat.status, { selected: seat.id === selectedSeatId }]"
        v-for="seat in seatList"
        :key="seat.id"
        :style="{ left: `${seat.positionX}px`, top: `${seat.positionY}px` }"
        @click="handleSeatClick(seat)"
      >
        <div class="seat-number">{{ seat.seatNumber }}</div>
        <div class="seat-type" v-if="seat.type !== 'normal'">
          {{ seat.type === 'vip' ? 'VIP' : '无障碍' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { ISeat } from '@/types/room.types';

// Props（严格遵循 ISeat 类型）
const props = defineProps({
  roomId: { type: String, required: true },
  seatList: { type: Array as () => ISeat[], required: true },
  loading: { type: Boolean, default: false }
});

// Emits
const emit = defineEmits<{ (e: 'select-seat', seat: ISeat): void }>();

// 状态
const selectedSeatId = ref<string | null>(null);
const maxX = computed(() => {
  return props.seatList.length ? Math.max(...props.seatList.map(s => s.positionX)) : 0;
});
const maxY = computed(() => {
  return props.seatList.length ? Math.max(...props.seatList.map(s => s.positionY)) : 0;
});

// 处理座位点击
const handleSeatClick = (seat: ISeat) => {
  if (props.loading) return;
  selectedSeatId.value = seat.id;
  emit('select-seat', seat);
};

// 监听座位列表变化，重置选中状态
watch(() => props.seatList, () => {
  selectedSeatId.value = null;
}, { deep: true });
</script>

<style scoped>
.seat-map {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 20px;
}
.seat-legend {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--color-text-regular);
}
.seat-demo {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}
.available { background-color: var(--color-success); }
.occupied { background-color: var(--color-danger); cursor: not-allowed; }
.broken { background-color: var(--color-info); cursor: not-allowed; }
.selected { background-color: var(--color-primary); }

.seat-area {
  position: relative;
  margin: 0 auto;
  border: 1px dashed var(--border-color-light);
  background-color: rgba(255, 255, 255, 0.8);
}
.seat-item {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--box-shadow-light);
}
.seat-item.available:hover { transform: scale(1.05); }
.seat-item.selected { transform: scale(1.1); }
.seat-item.occupied, .seat-item.broken { cursor: not-allowed; opacity: 0.7; }
.seat-number { font-size: 16px; font-weight: bold; }
.seat-type { font-size: 12px; opacity: 0.8; }
</style>