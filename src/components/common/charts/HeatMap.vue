<!-- 热力图组件 -->
<template>
  <div class="heatmap-chart" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsType, EChartsOption } from 'echarts'

interface HeatMapData {
  day: string | number
  hour: string | number
  value: number
}

interface Props {
  // 数据
  data: HeatMapData[]
  // 标题
  title?: string
  // 图表高度
  height?: string
  // 日期范围
  dateRange?: string[]
  // 小时范围
  hourRange?: number[]
  // 最大值
  maxValue?: number
  // 最小值
  minValue?: number
  // 颜色渐变
  visualMapColors?: string[]
  // 是否显示工具栏
  showToolbox?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
  dateRange: () => ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  hourRange: () => Array.from({ length: 24 }, (_, i) => i),
  maxValue: undefined,
  minValue: 0,
  visualMapColors: () => ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
  showToolbox: true
})

const chartRef = ref<HTMLDivElement>()
let chartInstance: EChartsType | null = null

// 转换数据格式
const transformData = (data: HeatMapData[]) => {
  return data.map(item => [item.day, item.hour, item.value || 0])
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
  
  const transformedData = transformData(props.data)
  
  // 计算最大值
  const dataMax = props.maxValue || Math.max(...props.data.map(d => d.value))
  
  const option: EChartsOption = {
    title: {
      text: props.title || '24小时使用热力图',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        const [day, hour, value] = params.data
        return `
          <div style="font-weight: bold; margin-bottom: 4px;">${props.dateRange[day]}</div>
          <div>时间: ${hour}:00 - ${hour + 1}:00</div>
          <div>使用量: <span style="font-weight: bold; color: ${params.color}">${value}</span></div>
        `
      }
    },
    grid: {
      height: '60%',
      top: '15%',
      left: '10%',
      right: '10%'
    },
    xAxis: {
      type: 'category',
      data: props.hourRange.map(h => `${h}:00`),
      splitArea: {
        show: true
      },
      axisLabel: {
        fontSize: 11,
        color: '#666'
      }
    },
    yAxis: {
      type: 'category',
      data: props.dateRange,
      splitArea: {
        show: true
      },
      axisLabel: {
        fontSize: 12,
        color: '#666'
      }
    },
    visualMap: {
      min: props.minValue,
      max: dataMax,
      calculable: true,
      orient: 'vertical',
      left: 'left',
      top: 'center',
      textStyle: {
        fontSize: 11
      },
      inRange: {
        color: props.visualMapColors
      }
    },
    series: [
      {
        name: '使用量',
        type: 'heatmap',
        data: transformedData,
        label: {
          show: false
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ],
    toolbox: props.showToolbox ? {
      feature: {
        saveAsImage: {
          title: '保存为图片',
          pixelRatio: 2
        },
        dataView: {
          title: '数据视图',
          readOnly: true
        }
      },
      right: 20,
      top: 20
    } : undefined
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
.heatmap-chart {
  width: 100%;
  height: v-bind(height);
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
</style>