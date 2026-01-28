import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/styles/global.scss'
import '@/assets/styles/element-plus.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import App from './App.vue'


// 创建Vue应用实例
const app = createApp(App)

// 使用Pinia状态管理
const pinia = createPinia()
app.use(pinia)

// 使用Vue Router
app.use(router)

// 使用Element Plus
app.use(ElementPlus)

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 添加路由调试
if (import.meta.env.DEV) {
  // 在开发模式下暴露router到全局，方便调试
  // @ts-ignore
  window.$router = router
  
  // 监听路由变化
  router.afterEach((to, from) => {
    console.log('✅ 路由切换成功:')
    console.log('   从:', from.path, from.name)
    console.log('   到:', to.path, to.name)
    console.log('   布局:', to.meta.layout)
  })
}

// 挂载应用
app.mount('#app')

console.log('🎉 Vue应用已启动')
console.log('🔗 可用路由:', router.getRoutes())