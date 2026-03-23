<template>
    <div :id="chartId" :style="{ width, height }" ref="chartRef"></div>
</template>

<script setup>
import * as echarts from 'echarts'; 
import 'echarts-wordcloud'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  chartId: { type: String, default: 'chart' }, // 图表唯一标识
  width: { type: String, default: '75vw' }, // 宽度
  height: { type: String, default: 'calc(100vh - 414px)' }, // 高度
  data: { type: Array, default: () => ([]) }, // 数据对象，需包含x轴类别与多系列数据
})
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

// 生成ECharts配置项（option）
function generateOption(data) {
  return {
    series: [
        {
            type: "wordCloud",
            // 网格大小，各项之间间距
            gridSize: 30,
            // 形状 circle 圆，cardioid  心， diamond 菱形，
            // triangle-forward 、triangle 三角，star五角星
            shape: 'circle',
            // 字体大小范围
            sizeRange: [20, 50],
            // 文字旋转角度范围
            rotationRange: [0, 0],
            // 旋转步值
            rotationStep: 90,
            // 自定义图形
            // maskImage: maskImage,
            left: 'center',
            top: 'center',
            right: null,
            bottom: null,
            // 画布宽
            width: '100%',
            // 画布高
            height: '100%',
            // 是否渲染超出画布的文字
            drawOutOfBound: false,
            textStyle: {
                color: function () {
                const colors = ['#165DFF', '#6aca37',
                    '#05a4b6', '#f93920', '#f0b114']
                return colors[parseInt(Math.random() * (colors.length))];
                },
                emphasis: {
                shadowBlur: 10,
                shadowColor: '#2ac'
                }
            },
            data: data,
        }
    ]
  };
}

</script>

<style lang="scss" scoped>
// .bar-chart-content {
//     background-color: #FFF;
//     border-radius: 20px;

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
// }
</style>