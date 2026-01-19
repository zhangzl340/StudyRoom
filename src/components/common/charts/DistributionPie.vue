<!-- 分布饼图 -->
<template>
  <div class="distribution-pie" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsType, EChartsOption } from 'echarts'

interface Props {
  // 数据
  data: Array<{
    name: string
    value: number
    percentage?: number
  }>
  // 标题
  title?: string
  // 图表高度
  height?: string
  // 是否显示图例
  showLegend?: boolean
  // 是否显示标签
  showLabel?: boolean
  // 饼图半径
  radius?: string | number
  // 颜色
  colors?: string[]
  // 格式化工具提示
  formatter?: (data: any) => string
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
  showLegend: true,
  showLabel: true,
  radius: ['40%', '70%'],
  colors: () => [
    '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
    '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
  ],
  formatter: undefined
})

const chartRef = ref<HTMLDivElement>()
let chartInstance: EChartsType | null = null

// 计算百分比
const calculatePercentages = (data: typeof props.data) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  return data.map(item => ({
    ...item,
    percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : 0
  }))
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  updateChart()
  
  // 响应窗口大小变化
  window.addEventListener('resize', handleResize)
}

// 更新图表
const updateChart = () => {
  if (!chartInstance || !props.data.length) return
  
  const dataWithPercentages = calculatePercentages(props.data)
  
  const option: EChartsOption = {
    title: {
      text: props.title || '数据分布',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: props.formatter || ((params: any) => {
        const { name, value, percent } = params
        return `
          <div style="font-weight: bold; margin-bottom: 4px;">${name}</div>
          <div style="display: flex; justify-content: space-between;">
            <span>数量:</span>
            <span style="font-weight: bold; margin-left: 20px;">${value}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>占比:</span>
            <span style="font-weight: bold; margin-left: 20px;">${percent}%</span>
          </div>
        `
      })
    },
    legend: props.showLegend ? {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 'middle',
      textStyle: {
        fontSize: 12
      },
      pageTextStyle: {
        color: '#606266'
      }
    } : undefined,
    series: [
      {
        name: props.title || '数据分布',
        type: 'pie',
        radius: props.radius,
        center: ['40%', '50%'],
        data: dataWithPercentages,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: props.showLabel ? {
          formatter: '{b}: {d}%',
          fontSize: 12
        } : {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        }
      }
    ],
    color: props.colors
  }
  
  chartInstance.setOption(option)
}

// 处理窗口大小变化
const handleResize = () => {
  chartInstance?.resize()
}

// 监听数据变化
watch(() => props.data, () => {
  updateChart()
}, { deep: true })

// 生命周期
onMounted(() => {
  initChart()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})

// 暴露方法
defineExpose({
  getInstance: () => chartInstance,
  resize: handleResize
})
</script>

<style scoped>
.distribution-pie {
  width: 100%;
  height: v-bind(height);
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
</style>