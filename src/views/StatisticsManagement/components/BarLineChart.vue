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
    chartId: { type: String, default: 'chart' },
    width: { type: String, default: '100%' },
    height: { type: String, default: '700px' },
    data: { type: Object, default: () => ({}) },
    rotateDeg: { type: Boolean, default: false },
    bottomPos: { type: String, default: '70px' }
})

const isShowChart = ref(false)

watch(() => props.data, (val) => {
    isShowChart.value = !!(val && val.data && val.data.length > 0);
}, { immediate: true });

const colorList = ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE', '#3BA272', '#FC8452', '#9A60B4', '#3796FA', '#FFD33C', '#FC8B93']

const chartRef = ref(null);
let myChart = null;

onMounted(() => {
    initChart();
    window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    if (myChart) {
        myChart.dispose();
        myChart = null;
    }
});

const handleResize = () => {
    myChart && myChart.resize();
};

watch(() => props.data, (newData) => {
    if (myChart) {
        myChart.setOption(generateOption(newData), true);
    } else {
        initChart();
    }
}, { deep: true });

function initChart() {
    if (!chartRef.value || !isShowChart.value) return;
    myChart = echarts.init(chartRef.value);
    myChart.setOption(generateOption(props.data));
}

function generateOption(data) {
    if (!data || !data.xaxis) return {};

    let lineSeries = {
        type: 'line',
        name: '预估工时',
        yAxisIndex: 1,
        data: data.totalEstimatedHours,
        itemStyle: { color: '#D45A5A' },
        label: {
            show: true,
            position: 'top',
            formatter: (params) => params.data > 0 ? params.data : ''
        },
        smooth: true,
    }

    let seriesList = (data.data || []).map((val, index) => {
        return {
            name: data.legend[index],
            type: 'bar',
            data: data.data[index],
            barWidth: 20, 
            itemStyle: { color: colorList[index % colorList.length] },
            label: { show: false },
            barGap: '0%', 
        }
    })
    
    seriesList.push(lineSeries);

    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: function (params) {
                let str = `<div >${params[0].name}</div><br/>`
                params.forEach(item => {
                    str += `${item.marker} <span style="display:inline-block;width:90px;color:#666">${item.seriesName}：</span> <span style="font-weight:bold;color:#333">${item.value}${item.seriesType == 'line' ? '小时' : ''}</span><br/>`
                });
                return str
            },
        },
        grid: {
            left: '50px',
            top: '80px',
            bottom: '80px', 
            right: '50px',
            containLabel: true
        },
        dataZoom: [
            {
                // --- 修改点 1: 确保默认显示全部数据范围 ---
                show: data.xaxis.length > 10,
                type: "slider",
                bottom: '10px',
                start: 0,
                end: 100, // 设为100，初始加载直接显示全部日期范围
                height: 20,
                handleSize: '80%',
            },
            {
                type: 'inside'
            }
        ],
        xAxis: [{
            type: 'category',
            data: data.xaxis,
            // --- 修改点 2: 自动隐藏重叠标签 ---
            axisLabel: { 
                interval: 'auto', // 关键：ECharts 会根据宽度自动选择隐藏哪些标签以防重叠
                rotate: 0,        // 标签较少或隐藏后通常不需要旋转，保持水平易读
                fontSize: 12,
                margin: 15,
                color: '#666',
                // 如果标签内容太长，尝试换行显示（比如在名字和日期之间）
                formatter: function (value) {
                    return value.includes('-202') ? value.replace('-202', '\n202') : value;
                }
            },
            axisTick: { 
                alignWithLabel: true,
                interval: 'auto' 
            },
            axisLine: { lineStyle: { color: '#CCC' } }
        }],
        yAxis: [
            {
                name: '数量',
                type: 'value',
                splitLine: { show: true, lineStyle: { type: 'dashed' } },
                axisLine: { show: false }
            },
            {
                name: '预估工时（小时）',
                type: 'value',
                axisLabel: { formatter: '{value}h' },
                splitLine: { show: false },
                axisLine: { show: false }
            },
        ],
        legend: {
            top: '20px',
            left: 'center',
            itemWidth: 25,
            itemHeight: 14,
        },
        series: seriesList,
    };
}
</script>

<style lang="scss" scoped>
.bar-chart-content {
    background-color: #FFF;
    border-radius: 20px;
    width: 100%;
}
</style>