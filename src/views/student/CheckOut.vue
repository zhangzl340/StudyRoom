<template>
  <div class="check-in-out">
    <!-- 状态提示 -->
    <div class="status-tip" :class="statusTipType">
      <el-icon :icon="statusIcon" class="status-icon" />
      <span>{{ statusTipText }}</span>
    </div>

    <!-- 扫码签到区域 -->
    <div class="scan-area" v-if="showScan">
      <div class="scan-title">扫码/人脸识别签到</div>
      
      <!-- 扫码组件（基于 vue-qrcode-reader） -->
      <div class="qrcode-reader" v-if="!useFaceRecognition">
        <el-button
          type="primary"
          @click="startScan"
          v-if="!scanning"
          icon="Scan"
        >
          打开扫码器
        </el-button>
        <div class="scan-container" v-else>
          <qrcode-stream
            @detect="onDetect"
            @error="onScanError"
            :paused="!scanning"
            style="width: 100%"
          />
          <el-button
            type="danger"
            @click="stopScan"
            class="stop-scan-btn"
            icon="Close"
          >
            关闭扫码器
          </el-button>
        </div>
      </div>

      <!-- 人脸识别区域 -->
      <div class="face-recognition" v-else>
        <el-button
          type="primary"
          @click="startFaceRecognition"
          v-if="!recognizing"
          icon="UserFilled"
        >
          人脸识别签到
        </el-button>
        <div class="face-container" v-else>
          <div class="camera-view">
            <video ref="videoRef" autoplay playsinline style="width: 100%" />
          </div>
          <el-button
            type="danger"
            @click="stopFaceRecognition"
            class="stop-face-btn"
            icon="Close"
          >
            停止识别
          </el-button>
        </div>
      </div>

      <!-- 切换扫码/人脸识别 -->
      <el-switch
        v-model="useFaceRecognition"
        active-text="人脸识别"
        inactive-text="扫码签到"
        class="switch-mode"
        @change="resetScanState"
      />
    </div>

    <!-- 操作按钮组（签到后） -->
    <div class="action-buttons" v-if="showActionButtons">
      <el-button
        type="info"
        @click="handleTemporaryLeave"
        v-if="currentStatus === 'checked_in'"
        icon="Leave"
      >
        暂离
      </el-button>
      <el-button
        type="success"
        @click="handleBackFromLeave"
        v-if="currentStatus === 'temporary_leave'"
        icon="UserFilled"
      >
        返回
      </el-button>
      <el-button
        type="primary"
        @click="handleCheckOut"
        v-if="['checked_in', 'temporary_leave'].includes(currentStatus)"
        icon="CircleClose"
      >
        签退
      </el-button>
    </div>

    <!-- 不可操作提示 -->
    <div class="disabled-tip" v-if="showDisabledTip">
      <el-icon icon="Warning" class="warning-icon" />
      <span>{{ disabledTipText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { ElButton, ElIcon, ElSwitch, ElMessageBox } from 'element-plus';
import { Scan, UserFilled, Leave, Warning, CircleClose, CircleCheck } from '@element-plus/icons-vue';
import { checkInApi } from '@/api'; // 项目中需补充签到相关API

// Props
const props = defineProps({
  reservationId: {
    type: String,
    required: true
  },
  currentStatus: {
    type: String,
    required: true,
    validator: (val: string) => ['pending', 'confirmed', 'checked_in', 'temporary_leave', 'completed', 'cancelled'].includes(val)
  }
});

// Emits
const emit = defineEmits<{
  (e: 'status-change', newStatus: string): void;
  (e: 'error', message: string): void;
}>();

// 状态控制
const useFaceRecognition = ref(false); // 扫码/人脸识别切换
const scanning = ref(false); // 扫码中
const recognizing = ref(false); // 人脸识别中
const videoRef = ref<HTMLVideoElement | null>(null); // 视频流ref
let mediaStream: MediaStream | null = null; // 媒体流

// 计算属性：显示状态控制
const showScan = computed(() => {
  // 仅待确认/已确认状态显示扫码/人脸识别
  return ['pending', 'confirmed'].includes(props.currentStatus);
});
const showActionButtons = computed(() => {
  // 已签到/暂离状态显示操作按钮
  return ['checked_in', 'temporary_leave'].includes(props.currentStatus);
});
const showDisabledTip = computed(() => {
  // 已完成/已取消状态显示不可操作提示
  return ['completed', 'cancelled'].includes(props.currentStatus);
});

// 状态提示文本/样式
const statusTipType = computed(() => {
  const map = {
    pending: 'warning',
    confirmed: 'success',
    checked_in: 'primary',
    temporary_leave: 'info',
    completed: 'info',
    cancelled: 'danger'
  };
  return map[props.currentStatus as keyof typeof map] || 'default';
});
const statusIcon = computed(() => {
  const map = {
    pending: Warning,
    confirmed: CircleCheck,
    checked_in: CircleCheck,
    temporary_leave: Leave,
    completed: CircleCheck,
    cancelled: Warning
  };
  return map[props.currentStatus as keyof typeof map] || Warning;
});
const statusTipText = computed(() => {
  const map = {
    pending: '请完成签到以确认预约',
    confirmed: '请扫码/人脸识别完成签到',
    checked_in: '已签到，可进行暂离/签退操作',
    temporary_leave: '暂离中，请按时返回',
    completed: '预约已完成，无需操作',
    cancelled: '预约已取消，无法操作'
  };
  return map[props.currentStatus as keyof typeof map] || '未知状态';
});
const disabledTipText = computed(() => {
  return props.currentStatus === 'completed' 
    ? '该预约已完成，无法进行签到/签退操作' 
    : '该预约已取消，无法进行任何操作';
});

// 扫码相关
const startScan = () => {
  scanning.value = true;
};
const stopScan = () => {
  scanning.value = false;
};
const onDetect = (detectedCodes: any[]) => {
  // 扫码成功，获取二维码内容
  if (detectedCodes.length > 0) {
    const qrCodeContent = detectedCodes[0].rawValue;
    handleCheckIn(qrCodeContent);
  }
};
const onScanError = (error: any) => {
  emit('error', `扫码失败：${error.message || '未知错误'}`);
  stopScan();
};

// 人脸识别相关
const startFaceRecognition = async () => {
  try {
    recognizing.value = true;
    // 获取摄像头流
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: false
    });
    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream;
    }
    // 模拟人脸识别（实际项目中调用后端接口）
    setTimeout(() => {
      handleCheckIn('face_recognition_success');
    }, 3000);
  } catch (error: any) {
    emit('error', `人脸识别初始化失败：${error.message || '请允许摄像头权限'}`);
    stopFaceRecognition();
  }
};
const stopFaceRecognition = () => {
  recognizing.value = false;
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop());
    mediaStream = null;
  }
  if (videoRef.value) {
    videoRef.value.srcObject = null;
  }
};

// 签到处理
const handleCheckIn = async (verifyCode: string) => {
  try {
    // 调用签到API
    const { error } = await checkInApi.checkIn({
      reservationId: props.reservationId,
      verifyType: useFaceRecognition.value ? 'face' : 'qrcode',
      verifyCode
    });
    if (!error) {
      emit('status-change', 'checked_in');
      stopScan();
      stopFaceRecognition();
    } else {
      emit('error', `签到失败：${error.message}`);
    }
  } catch (error: any) {
    emit('error', `签到异常：${error.message || '未知错误'}`);
  }
};

// 暂离处理
const handleTemporaryLeave = async () => {
  try {
    const { error } = await checkInApi.temporaryLeave({
      reservationId: props.reservationId
    });
    if (!error) {
      emit('status-change', 'temporary_leave');
    } else {
      emit('error', `暂离申请失败：${error.message}`);
    }
  } catch (error: any) {
    emit('error', `暂离申请异常：${error.message || '未知错误'}`);
  }
};

// 暂离返回处理
const handleBackFromLeave = async () => {
  ElMessageBox.confirm(
    '确定要返回座位吗？',
    '温馨提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }
  ).then(async () => {
    try {
      const { error } = await checkInApi.backFromLeave({
        reservationId: props.reservationId
      });
      if (!error) {
        emit('status-change', 'checked_in');
      } else {
        emit('error', `返回座位失败：${error.message}`);
      }
    } catch (error: any) {
      emit('error', `返回座位异常：${error.message || '未知错误'}`);
    }
  });
};

// 签退处理
const handleCheckOut = async () => {
  ElMessageBox.confirm(
    '确定要签退吗？签退后本次预约将结束',
    '温馨提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const { error } = await checkInApi.checkOut({
        reservationId: props.reservationId
      });
      if (!error) {
        emit('status-change', 'completed');
      } else {
        emit('error', `签退失败：${error.message}`);
      }
    } catch (error: any) {
      emit('error', `签退异常：${error.message || '未知错误'}`);
    }
  });
};

// 重置扫码/人脸识别状态
const resetScanState = () => {
  stopScan();
  stopFaceRecognition();
};

// 组件卸载时清理媒体流
onUnmounted(() => {
  stopFaceRecognition();
});
</script>

<style scoped>
.check-in-out {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}
.status-tip {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
}
.status-tip.warning {
  background-color: var(--color-warning);
}
.status-tip.success {
  background-color: var(--color-success);
}
.status-tip.primary {
  background-color: var(--color-primary);
}
.status-tip.info {
  background-color: var(--color-info);
}
.status-tip.danger {
  background-color: var(--color-danger);
}
.status-icon {
  font-size: 20px;
}

.scan-area {
  text-align: center;
}
.scan-title {
  margin-bottom: 15px;
  font-size: 16px;
  color: var(--color-text-primary);
}
.qrcode-reader, .face-recognition {
  margin-bottom: 15px;
}
.scan-container {
  position: relative;
  border: 1px solid var(--border-color-light);
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}
.stop-scan-btn, .stop-face-btn {
  margin-top: 10px;
}
.switch-mode {
  margin-top: 10px;
}
.camera-view {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.disabled-tip {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text-regular);
  padding: 15px;
  border: 1px solid var(--border-color-light);
  border-radius: 8px;
  background-color: var(--background-color-light);
}
.warning-icon {
  color: var(--color-warning);
}
</style>