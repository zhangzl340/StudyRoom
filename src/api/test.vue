
import { http } from '@/utils/request'

// 简单的API测试函数
export const testApi = {
  // 测试GET请求
  async testGet() {
    try {
      // 这里可以替换为实际的API端点
      const response = await http.get('/test/endpoint')
      console.log('GET测试成功:', response)
      return response
    } catch (error) {
      console.error('GET测试失败:', error)
      return null
    }
  },
  
  // 测试POST请求
  async testPost(data: any) {
    try {
      const response = await http.post('/test/endpoint', data)
      console.log('POST测试成功:', response)
      return response
    } catch (error) {
      console.error('POST测试失败:', error)
      return null
    }
  },
  
  // 测试错误处理
  async testError() {
    try {
      // 故意请求一个不存在的端点
      await http.get('/non-existent-endpoint')
    } catch (error) {
      console.log('错误处理测试 - 预期中的错误:', error.message)
      return error.message
    }
  }
}

// 在浏览器控制台测试API
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.$api = testApi
  console.log('API测试工具已加载，可以在控制台使用 $api 进行测试')
  console.log('可用方法:')
  console.log('  $api.testGet() - 测试GET请求')
  console.log('  $api.testPost(data) - 测试POST请求')
  console.log('  $api.testError() - 测试错误处理')
}