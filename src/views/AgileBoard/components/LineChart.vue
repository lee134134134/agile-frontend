<template>
    <div class="fix-1" v-if="isShowChart" :id="chartId" :style="{ width, height }" ref="chartRef"></div>
    <div class="fix-2" v-else :style="{ width, height }"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
    chartId: { type: String, default: 'chart' }, // 图表唯一标识
    width: { type: String, default: '100%' }, // 宽度
    height: { type: String, default: '400px' }, // 高度
    data: { type: Object, default: () => ([]) }, // 数据对象，需包含x轴类别与多系列数据
    chartTitle: { type: String, default: '' },
    rotateDeg: { type: Boolean, default: false },
    showWay: { type: Number }, // 1. 故事 2. 任务
})
const isShowChart = ref()
isShowChart.value = (props.data != [] && props.data.length > 0) ? true : false

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
        grid: {
            top: '70px',
            left: '70px',
            bottom: '70px',
            right: '50px',
        },
        tooltip: {
            trigger: 'axis',
            // formatter: (params) => {
            //     let result
            //     if(params.seriesName == '剩余故事点' || params.seriesName == '剩余任务数'){
            //        result = params.seriesName + '<br/>' + params.marker + '&nbsp;&nbsp;' + params.name + '&nbsp;&nbsp;&nbsp;&nbsp;' + params.value 
            //     }else {
            //         result = (props.showWay == 1 ? '理想剩余故事点' : '理想剩余任务数') + '<br/>' + params.marker + '&nbsp;&nbsp;' + params.name + '&nbsp;&nbsp;&nbsp;&nbsp;' + params.value 
            //     }
            //     return result
            // }
        },
        legend: {
            top: '30px',
            data: [
                { icon: 'rect', name: props.showWay == 1 ? '剩余故事点' : '剩余任务数', itemStyle: { color: '#FFE0E6', borderColor: '#FF6384', borderWidth: 2, } },
                { icon: 'rect', name: '理想燃尽线', itemStyle: { color: '#E5E5E5', borderColor: '#36A2EB', borderWidth: 2, borderType: 'dashed' } }
            ],
            selectedMode: true,
            itemWidth: 40,
            itemHeight: 15,
        },
        xAxis: {
            type: 'category',
            name: '日期',
            nameLocation: 'center',
            nameGap: 40,
            boundaryGap: false,
            data: data.map(item => item.date),
            axisLine: { show: true },
            splitLine: { show: true },
            axisTick: {
                show: false,
                inside: false,
            },
        },
        yAxis: {
            type: 'value',
            name: props.showWay == 1 ? '故事点' : '任务数',
            nameLocation: 'center',
            nameGap: 40,
            axisLine: { show: true },
            splitLine: { show: true }
        },
        series: [
            {
                name: props.showWay == 1 ? '剩余故事点' : '剩余任务数',
                type: 'line',
                smooth: false,
                itemStyle: {
                    color: '#FF6384',
                },
                data: data.map(item => item.remaining),
            },
            {
                name: '理想燃尽线',
                type: 'line',
                smooth: true,
                data: data.map(item => item.ideal),
                // symbol: 'none',
                lineStyle: {
                    type: 'dashed',
                    color: '#36A2EB',
                }
            },
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