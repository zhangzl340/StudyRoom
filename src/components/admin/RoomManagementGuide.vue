<template>
  <div class="room-management-guide">
    <h2>自习室管理使用指南</h2>
    
    <div class="guide-section">
      <h3>📚 主要功能</h3>
      <el-steps :active="6" finish-status="success" simple>
        <el-step title="自习室列表" description="查看所有自习室的基本信息" />
        <el-step title="添加自习室" description="创建新的自习室" />
        <el-step title="编辑自习室" description="修改自习室信息" />
        <el-step title="座位布局" description="编辑座位布局和属性" />
        <el-step title="开放时间" description="设置自习室开放时间" />
        <el-step title="状态管理" description="管理自习室开放状态" />
      </el-steps>
    </div>

    <div class="guide-section">
      <h3>🏫 自习室基本信息</h3>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="guide-item">
            <div class="guide-icon">🏢</div>
            <div class="guide-content">
              <h4>楼栋和楼层</h4>
              <p>正确设置自习室所在的楼栋和楼层，方便学生查找</p>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="guide-item">
            <div class="guide-icon">👥</div>
            <div class="guide-content">
              <h4>容量设置</h4>
              <p>根据实际座位数设置容量，系统会自动计算可用座位</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="guide-section">
      <h3>💺 座位布局编辑</h3>
      <div class="layout-guide">
        <div class="guide-step">
          <span class="step-number">1</span>
          <div class="step-content">
            <h4>选择座位类型</h4>
            <p>在左侧工具栏选择不同的座位类型：标准、靠窗、有电源等</p>
          </div>
        </div>
        <div class="guide-step">
          <span class="step-number">2</span>
          <div class="step-content">
            <h4>拖拽放置座位</h4>
            <p>将座位拖拽到画布上，支持对齐网格功能</p>
          </div>
        </div>
        <div class="guide-step">
          <span class="step-number">3</span>
          <div class="step-content">
            <h4>设置座位属性</h4>
            <p>选中座位后，在右侧属性面板设置编号、状态等</p>
          </div>
        </div>
      </div>
    </div>

    <div class="guide-section">
      <h3>⏰ 开放时间管理</h3>
      <el-alert type="info" show-icon>
        建议开放时间：工作日 8:00-22:00，周末 8:00-23:00
      </el-alert>
      <ul class="tips-list">
        <li>• 开放时间应至少提前30分钟公布变更</li>
        <li>• 维护期间请将自习室状态设为"维护中"</li>
        <li>• 节假日开放时间需提前设置</li>
      </ul>
    </div>

    <div class="guide-section">
      <h3>📊 使用统计说明</h3>
      <p>系统提供以下统计数据：</p>
      <div class="stat-cards">
        <div class="stat-card">
          <div class="stat-title">使用率</div>
          <div class="stat-desc">反映座位利用效率</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">热门时间段</div>
          <div class="stat-desc">帮助优化开放时间</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">座位热度</div>
          <div class="stat-desc">识别受欢迎的座位类型</div>
        </div>
      </div>
    </div>

    <div class="guide-section">
      <h3>⚠️ 注意事项</h3>
      <el-alert type="warning" show-icon>
        删除自习室将同时删除所有相关预约记录，请谨慎操作！
      </el-alert>
      <el-alert type="success" show-icon style="margin-top: 10px">
        建议定期检查座位设备状况，及时更新维修状态
      </el-alert>
    </div>

    <div class="guide-actions">
      <el-button type="primary" @click="$emit('close')">我知道了</el-button>
      <el-button type="info" @click="printGuide">打印指南</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  close: []
}>()

const printGuide = () => {
  window.print()
}
</script>

<style scoped>
.room-management-guide {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.guide-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.guide-section h3 {
  color: #303133;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 600;
}

.guide-section h4 {
  color: #606266;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 500;
}

.guide-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
}

.guide-icon {
  font-size: 24px;
  margin-right: 15px;
  margin-top: 5px;
}

.guide-content h4 {
  margin: 0 0 5px 0;
}

.guide-content p {
  margin: 0;
  color: #909399;
  font-size: 14px;
  line-height: 1.5;
}

.layout-guide {
  margin-top: 20px;
}

.guide-step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 6px;
}

.step-number {
  width: 24px;
  height: 24px;
  background: #409eff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-weight: 600;
  font-size: 12px;
}

.step-content h4 {
  margin: 0 0 5px 0;
}

.step-content p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.tips-list {
  margin: 15px 0 0 20px;
  color: #606266;
  line-height: 1.8;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-top: 15px;
}

.stat-card {
  padding: 15px;
  background: #f5f7fa;
  border-radius: 6px;
  text-align: center;
}

.stat-title {
  font-weight: 600;
  color: #303133;
  margin-bottom: 5px;
}

.stat-desc {
  font-size: 12px;
  color: #909399;
}

.guide-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

/* 打印样式 */
@media print {
  .guide-actions {
    display: none;
  }
  
  .room-management-guide {
    max-width: none;
  }
}
</style>