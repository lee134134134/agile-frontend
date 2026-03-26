<template>
  <div class="bar-chart-content">
    <div class="header-title">
      <div class="title-icon"></div>
      <div class="title-text">{{ chartTitle }}</div>
    </div>
    <div v-if="isShowChart" :id="chartId" ref="chartRef" :style="{ width, height }"></div>
    <div v-else :style="{ width, height }"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import {onBeforeUnmount, onMounted, ref, watch} from 'vue';

const props = defineProps({
  chartId: {type: String, default: 'chart'}, // 图表唯一标识
  width: {type: String, default: '100%'}, // 宽度
  height: {type: String, default: '240px'}, // 高度
  data: {type: Object, default: () => ({})}, // 数据对象，需包含x轴类别与多系列数据
  chartTitle: {type: String, default: ''},
  rotateDeg: {type: Boolean, default: false},
  bottomPos: {type: String, default: '70px'}
})
const isShowChart = ref()
isShowChart.value = (props.data != {} && props.data.data && props.data.data.length > 0) ? true : false

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
    }
);

let lineSeries = {
  type: 'line',
  yAxisIndex: 1,
  data: props.data.defectRate,
  itemStyle: {color: '#D45A5A'},
  label: {
    formatter: function (params) {
      return `${params.data}%(${props.data.data[params.dataIndex]}个)`
    },
    show: true,
    position: 'top',
  },
  smooth: true,
}

let seriesList = props.data.data.reduce((series, value, index) => {
  // if(value) {
  series.push({
    name: props.data.xaxis[index],
    type: 'bar',
    data: props.data.data.map((v, i) => i == index ? v : ''),
    itemStyle: {color: colorList[index % colorList.length]},
    label: {show: false, position: 'top'},
    barWidth: props.data.data[index] == 0 ? 0 : 30,
    barGap: '-100%',
    barGategoryGap: '20%',
  })
  // }
  return series
}, [])

seriesList.push(lineSeries)

// 生成ECharts配置项（option）
function generateOption(data) {
  return {
    tooltip: {},
    grid: {
      left: '20%',
      bottom: props.bottomPos,
      right: '30%',
    },
    xAxis: {
      type: 'category',
      axisLabel: {rotate: props.rotateDeg ? 45 : 0, margin: 20, fontSize: 12},
      data: data.xaxis, // x轴类别（如“上证指数、深证成指”等）
      axisTick: {inside: true},
    },
    yAxis: [
      {
        name: '缺陷数量',
        type: 'value',
        axisLabel: {formatter: '{value}', fontSize: 12}, // y轴格式化为百分比
        axisLine: {
          show: true,
          lineStyle: {
            type: 'solid'
          }
        },
        splitLine: {show: false}
      },
      {
        name: '缺陷率',
        type: 'value',
        axisLabel: {formatter: '{value}%'},
        axisLine: {
          show: true,
          lineStyle: {
            type: 'solid'
          }
        },
        splitLine: {show: false}
      },
    ],
    legend: {
      //   data: data.legends, // 系列名称（对应数据中的key）
      top: '5%',
      left: '80%',
      orient: 'vertical',
      textStyle: {
        fontSize: 12,
      },
      itemWidth: 20,
      itemHeight: 10,
      itemGap: 15,
    },
    series: seriesList,
  };
}

</script>

<style lang="scss" scoped>
.bar-chart-content {
  background-color: #FFF;
  border-radius: 8px;

  .header-title {
    display: flex;
    align-items: center;
    padding: 12px;

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
      font-size: 14px;
      color: #333;
      line-height: 22px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }
}
</style>