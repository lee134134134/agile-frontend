<template>
  <div class="bar-chart-content">
    <div v-if="isShowChart" :id="chartId" :style="{ width, height }" ref="chartRef"></div>
    <div v-else :style="{ width, height }"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  chartId: { type: String, default: 'chart' }, // 图表唯一标识
  width: { type: String, default: '100%' }, // 宽度
  height: { type: String, default: '270px' }, // 高度
  data: { type: Object, default: () => ([]) }, // 数据对象，需包含x轴类别与多系列数据
  chartTitle: { type: String, default: '' },
  rotateDeg: { type: Boolean, default: false },
  bottomPos: { type: String, default: '70px' }
})
const isShowChart = ref()
isShowChart.value = (props.data != [] && props.data.length > 0) ? true : false
const colorList = ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE', '#3BA272', '#FC8452', '#9A60B4', '#3796FA', '#FFD33C', '#FC8B93']

// 图表实例引用
const chartRef = ref(null);

// 生命周期钩子：组件挂载时初始化图表
onMounted(() => {
  if (!chartRef.value) return;
  const chart = echarts.init(chartRef.value);
  const option = generateOption(props.data);
  chart.setOption(option);
  window.addEventListener('resize', () => chart.resize()); // 监听窗口缩放，自适应图表
});

// 生命周期钩子：组件销毁时销毁图表实例
onBeforeUnmount(() => {
  if (chartRef.value) {
    echarts.dispose(chartRef.value);
  }
  window.removeEventListener('resize', () => chartRef.value?.resize());
});

// 监听数据变化，动态更新图表
watch(
  () => props.data,
  (newData) => {
    if (chartRef.value) {
      const chart = echarts.getInstanceByDom(chartRef.value);
      chart.setOption(generateOption(newData));
    }
  }, { immediate: true });

// 生成ECharts配置项（option）
function generateOption(data) {
  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        // console.log('params===', params)
        return `${params.marker} ${params.name} :${params.data.value}人&nbsp;&nbsp;${params.percent}%`
      }
    },
    legend: {
      show: false,
      // data: data.xAxis, 
      formatter: function (name) {
        let obj = props.data.filter(item => item.name == name)
        return `${name}  ${obj[0].rate}%`
      },
      top: 'center',
      right: '5%',
      orient: 'vertical',
      textStyle: {
        fontSize: 14,
      },
      itemWidth: 40,
      itemHeight: 20,
      itemGap: 10,
    },
    grid: {
      containLabel: true
    },
    series: [
      {
        type: 'pie',
        radius: ['0', '45%'],
        // center: ['30%', '50%'],
        label: {
          padding: [10, -70, 10, -70],
          formatter: (v) => {
            return (
              '{name|' + v.name + '}\n{value|' + v.value + '人' + '}{rate|' + v.percent + '%}'
            )
          },
          rich: {
            name: {
              fontsize: '16px',
              color: '#333',
              fontWeight: 'bold'
            },
            value: {
              fontsize: '14px',
              color: '#333',
              fontWeight: 'bold',
              padding: [10, 10, 0, 0]
            },
            rate: {
              fontsize: '14px',
              fontWeight: 'bold',
              padding: [10, 0, 0, 0],
              color: 'inherit'
            }
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        labelLine: {
          show: true,
          length: 25,
          length2: 80,
        },
        data: data.map(item => ({ name: item.name, value: item.value, count: item.value })),
        color: colorList
      }
    ],
  };
}

</script>

<style lang="scss" scoped>
.bar-chart-content {
  background-color: #FFF;
  border-radius: 20px;

  .header-title {
    display: flex;
    align-items: center;
    padding: 16px 22px;

    .title-icon {
      margin-right: 10px;
      width: 4px;
      height: 20px;
      background: #2173F7;
      border-radius: 2px 2px 2px 2px;
    }

    .title-text {
      font-family: PingFang SC;
      font-weight: 600;
      font-size: 16px;
      color: #1D1D1D;
      line-height: 22px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }
}
</style>