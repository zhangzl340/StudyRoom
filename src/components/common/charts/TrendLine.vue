<!-- 趋势线图 -->
<template>
  <div class="trend-line-chart" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsType, EChartsOption } from 'echarts'

interface TrendData {
  date: string
  value: number
  name?: string
}

interface Props {
  // 数据系列
  series: Array<{
    name: string
    data: TrendData[]
    color?: string
    type?: 'line' | 'bar'
    smooth?: boolean
  }>
  // 标题
  title?: string
  // 图表高度
  height?: string
  // X轴类型
  xAxisType?: 'time' | 'category'
  // Y轴名称
  yAxisName?: string
  // 是否显示面积
  showArea?: boolean
  // 是否显示标记点
  showSymbol?: boolean
  // 是否显示工具栏
  showToolbox?: boolean
  // 是否平滑显示
  smooth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
  xAxisType: 'category',
  yAxisName: '数值',
  showArea: false,
  showSymbol: true,
  showToolbox: true,
  smooth: true
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
  if (!chartInstance || !props.series.length) return
  
  // 获取所有日期
  const allDates = Array.from(
    new Set(props.series.flatMap(s => s.data.map(d => d.date)))
  ).sort()
  
  const option: EChartsOption = {
    title: {
      text: props.title || '趋势分析',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      formatter: (params: any) => {
        const date = params[0].axisValue
        let html = `<div style="font-weight: bold; margin-bottom: 8px;">${date}</div>`
        
        params.forEach((param: any) => {
          const dataItem = param.data
          const value = typeof dataItem === 'object' ? dataItem.value : dataItem
          html += `
            <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ${param.color};"></span>
              <span>${param.seriesName}:</span>
              <span style="font-weight: bold; color: ${param.color}">${value}</span>
            </div>
          `
        })
        
        return html
      }
    },
    legend: {
      data: props.series.map(s => s.name),
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
      type: props.xAxisType,
      data: allDates,
      axisLabel: {
        rotate: props.xAxisType === 'time' ? 45 : 0,
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#dcdfe6'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: props.yAxisName,
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
    series: props.series.map(s => {
      const baseSeries: any = {
        name: s.name,
        type: s.type || 'line',
        data: s.data.map(d => ({
          name: d.name || d.date,
          value: d.value
        })),
        smooth: s.smooth !== undefined ? s.smooth : props.smooth,
        showSymbol: props.showSymbol,
        symbolSize: 6,
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: s.color
        },
        emphasis: {
          focus: 'series'
        }
      }
      
      if (s.type === 'line' && props.showArea) {
        baseSeries.areaStyle = {
          opacity: 0.1
        }
      }
      
      return baseSeries
    }),
    toolbox: props.showToolbox ? {
      feature: {
        saveAsImage: {
          title: '保存为图片',
          pixelRatio: 2
        },
        dataView: {
          title: '数据视图',
          readOnly: true
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
watch(() => props.series, () => {
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
.trend-line-chart {
  width: 100%;
  height: v-bind(height);
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
</style>