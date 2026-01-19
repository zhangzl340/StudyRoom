<!-- 使用率柱状图 -->
<template>
  <div class="usage-bar-chart" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsType, EChartsOption } from 'echarts'

interface Props {
  // 数据
  data: Array<{
    date: string
    usageHours: number
    reservationCount: number
    occupancyRate?: number
  }>
  // 标题
  title?: string
  // 图表高度
  height?: string
  // 是否显示工具栏
  showToolbox?: boolean
  // 数据名称映射
  nameMap?: Record<string, string>
  // 颜色
  colors?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
  showToolbox: true,
  nameMap: () => ({
    usageHours: '使用时长',
    reservationCount: '预约次数',
    occupancyRate: '占用率'
  }),
  colors: () => ['#5470c6', '#91cc75', '#fac858']
})

const chartRef = ref<HTMLDivElement>()
let chartInstance: EChartsType | null = null

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
  
  const dates = props.data.map(item => item.date)
  const usageHours = props.data.map(item => item.usageHours)
  const reservationCount = props.data.map(item => item.reservationCount)
  const occupancyRate = props.data.map(item => item.occupancyRate || 0)
  
  const option: EChartsOption = {
    title: {
      text: props.title || '自习室使用情况',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const date = params[0].axisValue
        const dataItem = props.data.find(item => item.date === date)
        if (!dataItem) return ''
        
        return `
          <div style="font-weight: bold; margin-bottom: 8px;">${date}</div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span>${props.nameMap.usageHours}:</span>
              <span style="font-weight: bold; color: ${params[0].color}">${dataItem.usageHours}小时</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span>${props.nameMap.reservationCount}:</span>
              <span style="font-weight: bold; color: ${params[1].color}">${dataItem.reservationCount}次</span>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span>${props.nameMap.occupancyRate}:</span>
              <span style="font-weight: bold; color: ${params[2].color}">${dataItem.occupancyRate || 0}%</span>
            </div>
          </div>
        `
      }
    },
    legend: {
      data: [
        props.nameMap.usageHours,
        props.nameMap.reservationCount,
        props.nameMap.occupancyRate
      ],
      top: 30,
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        rotate: 45,
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#dcdfe6'
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '时长/次数',
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#dcdfe6'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#f0f2f5',
            type: 'dashed'
          }
        }
      },
      {
        type: 'value',
        name: '占用率(%)',
        position: 'right',
        max: 100,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#dcdfe6'
          }
        },
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: props.nameMap.usageHours,
        type: 'bar',
        data: usageHours,
        barWidth: '30%',
        itemStyle: {
          color: props.colors[0],
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: props.nameMap.reservationCount,
        type: 'bar',
        data: reservationCount,
        barWidth: '30%',
        itemStyle: {
          color: props.colors[1],
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: props.nameMap.occupancyRate,
        type: 'line',
        yAxisIndex: 1,
        data: occupancyRate,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: props.colors[2]
        },
        lineStyle: {
          width: 3,
          type: 'solid'
        },
        emphasis: {
          focus: 'series'
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
          readOnly: true,
          lang: ['数据视图', '关闭', '刷新']
        },
        magicType: {
          type: ['line', 'bar', 'stack']
        },
        restore: {
          title: '还原'
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
.usage-bar-chart {
  width: 100%;
  height: v-bind(height);
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
</style>