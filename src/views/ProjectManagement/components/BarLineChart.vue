<template>
    <div class="bar-chart-content">
        <!-- <div class="header-title">
            <div class="title-icon"></div>
            <div class="title-text">{{ chartTitle }}</div>
        </div> -->
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
    height: { type: String, default: '700px' }, // 高度
    data: { type: Object, default: () => ({}) }, // 数据对象，需包含x轴类别与多系列数据
    // chartTitle: { type: String, default: '' },
    rotateDeg: { type: Boolean, default: false },
    bottomPos: { type: String, default: '70px' }
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
watch(() => props.data, (newData) => {
    if (chartRef.value) {
        const chart = echarts.getInstanceByDom(chartRef.value);
        chart.setOption(generateOption(newData));
    }
}, { immediate: true });



// 生成ECharts配置项（option）
function generateOption(data) {
    let lineSeries = {
        type: 'line',
        name: '缺陷率',
        yAxisIndex: 1,
        data: data.defectRate,
        itemStyle: { color: '#D45A5A' },
        // lineStyle: {
        //   width: '3'
        // },
        label: {
            formatter: function (params) {
                return `${params.data}%`
            },
            show: true,
            position: 'top',
        },
        smooth: true,
    }
    let seriesList = data.data.reduce((series, value, index) => {
        // if(value) {
        series.push({
            name: data.lagend[index],
            type: 'bar',
            data: data.data[index],
            itemStyle: { color: colorList[index % colorList.length] },
            label: { show: false, position: 'top' },
            // barWidth: 15,
            barGap: '0',
            barGategoryGap: '20%',
            barMaxWidth: '30px',
        })
        return series
    }, [])
    seriesList.push(lineSeries)
    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (params) {
                let str = ''
                if (params && params.length > 0) {
                    str = `<div >${params[0].name}</div><br/>`
                    params.forEach(item => {
                        str += `${item.marker} <span style="display:inline-block;width:90px;color:#666">${item.seriesName}：</span> <span style="font-weight:bold;color:#333">${item.value}${item.seriesType == 'line' ? '%' : ''}</span><br/>`
                    });
                }
                return str
            },
        },
        grid: {
            left: '6%',
            top: '25%',
            bottom: '50px',
            right: '6%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            axisLabel: { interval: 0, rotate: data.xaxis.length > 5 ? 50 : 0, margin: 30 },
            data: data.xaxis,
            axisTick: { show: false },
        }, {
            type: 'category',
            axisLine: { show: false },
            axisLabel: { show: false },
            data: [],
            axisTick: { show: false },
            splitLine: { show: false },
            splitArea: { show: false },
        },],
        yAxis: [
            {
                name: '数量',
                type: 'value',
                axisLabel: { formatter: '{value}' }, // y轴格式化为百分比
                axisLine: {
                    show: true,
                    lineStyle: {
                        type: 'solid'
                    }
                },
                splitLine: { show: false }
            },
            {
                name: '缺陷率',
                type: 'value',
                axisLabel: { formatter: '{value}%' },
                axisLine: {
                    show: true,
                    lineStyle: {
                        type: 'solid'
                    }
                },
                splitLine: { show: false }
            },
        ],
        legend: {
            //   data: data.legends, // 系列名称（对应数据中的key）
            top: '30px',
            left: 'center',
            //   、  orient: 'vertical',
            textStyle: {
                fontSize: 14,
            },
            itemWidth: 40,
            itemHeight: 20,
            itemGap: 15,
        },
        series: seriesList,
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
            font-size: 18px;
            color: #1D1D1D;
            line-height: 22px;
            text-align: left;
            font-style: normal;
            text-transform: none;
        }
    }
}
</style>