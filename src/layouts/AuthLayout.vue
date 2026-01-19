<!-- 认证页面布局 -->
<template>
  <div class="auth-layout">
    <div class="container">
      <!-- 左侧品牌信息 -->
      <div class="brand-section">
        <div class="brand-content">
          <h1>高校自习室智能预约平台</h1>
          <p class="slogan">智慧学习，高效管理</p>
          <div class="features">
            <div class="feature-item">
              <span class="icon">🎯</span>
              <div class="feature-text">
                <div class="title">智能预约</div>
                <div class="desc">随时随地预约自习座位</div>
              </div>
            </div>
            <div class="feature-item">
              <span class="icon">📊</span>
              <div class="feature-text">
                <div class="title">数据可视</div>
                <div class="desc">实时查看座位使用情况</div>
              </div>
            </div>
            <div class="feature-item">
              <span class="icon">🔒</span>
              <div class="feature-text">
                <div class="title">安全可靠</div>
                <div class="desc">保障个人信息安全</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧表单区域 -->
      <div class="form-section">
        <div class="form-container">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 认证布局组件
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.container {
  width: 100%;
  max-width: 1200px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  min-height: 600px;
}

.brand-section {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-content {
  max-width: 400px;
}

.brand-content h1 {
  font-size: 32px;
  margin-bottom: 20px;
  font-weight: bold;
  line-height: 1.3;
}

.slogan {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 40px;
  color: rgba(255, 255, 255, 0.9);
}

.features {
  margin-top: 50px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 30px;
}

.feature-item .icon {
  font-size: 32px;
  margin-right: 15px;
  flex-shrink: 0;
}

.feature-text .title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
}

.feature-text .desc {
  font-size: 14px;
  opacity: 0.8;
  color: rgba(255, 255, 255, 0.9);
}

.form-section {
  flex: 1;
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.form-container {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .container {
    flex-direction: column;
    max-width: 500px;
  }
  
  .brand-section {
    padding: 40px 20px;
  }
  
  .form-section {
    padding: 40px 20px;
  }
  
  .form-container {
    padding: 30px 20px;
  }
  
  .brand-content h1 {
    font-size: 28px;
  }
}

@media (max-width: 576px) {
  .container {
    border-radius: 10px;
  }
  
  .brand-content h1 {
    font-size: 24px;
  }
  
  .slogan {
    font-size: 16px;
  }
  
  .feature-item .icon {
    font-size: 28px;
  }
  
  .feature-text .title {
    font-size: 16px;
  }
}
</style>