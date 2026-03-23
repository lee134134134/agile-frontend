<template>
    <div v-if="isShowChart" :id="chartId" :style="{ width, height }" ref="chartRef"></div>
    <div v-else :style="{ width, height }"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
    chartId: { type: String, default: 'chart' }, // 图表唯一标识
    width: { type: String, default: '100%' }, // 宽度
    height: { type: String, default: '300px' }, // 高度
    data: { type: Object, default: () => ([]) }, // 数据对象，需包含x轴类别与多系列数据
    chartTitle: { type: String, default: '' },
    rotateDeg: { type: Boolean, default: false },
})
const isShowChart = ref()
isShowChart.value = (props.data != {}) ? true : false

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
        console.log(newData)
        if (chartRef.value) {
            const chart = echarts.getInstanceByDom(chartRef.value);
            chart.setOption(generateOption(newData));
        }
    }
);

// 生成ECharts配置项（option）
function generateOption(data) {
    console.log(data, '--data')
    var seriesList = []
    for (var i = 0; i <= data.legendDataList.length; i++) {
        seriesList.push({
            name: data.legendDataList[i],
            type: "line",
            smooth: true,
            data: data.ydata[i],
        })
    }
    return {
        grid: {
            top: '70px',
            left: '10%',
            bottom: '70px',
            right: '12%',
        },
        tooltip: {
            trigger: 'axis',
            formatter: (params) => {
                let result = params[0].axisValue + '<br/>'
                if(params.length == 1) {
                    result += params[0].marker + '&nbsp;&nbsp;' + params[0].seriesName  + '&nbsp;&nbsp;' + (params[0].value != null ? params[0].value : '-')  + '&nbsp;&nbsp;描述：' + (data.moodMsList[0] || '-')   + '<br/>'
                }else {
                    for(let i=0; i < params.length; i++) {
                        let index = params[i].dataIndex
                        if(i != params.length - 1) {
                            result += `${params[i].marker}<span style="display:inline-block;width:90px;color:#666">${params[i].seriesName}： </span><span style="display:inline-block;width:50px;color:#333">${(params[i].value || '-')} </span>描述： ${(data.moodMsList[i][index] || '-')}<br/><span style="margin-left: 12px;">填写时间： ${(data.fillTimeList[i][index] || '-')}<span/> <br/>`
                            if(data.modifyTimeList[i][index] && data.fillTimeList[i][index] !== data.modifyTimeList[i][index]) {
                                result += `<span style="margin-left: 12px;">更新时间： ${(data.modifyTimeList[i][index] || '-')}<span/> <br/>`
                            }
                        }else {
                            result += `${params[i].marker}<span style="display:inline-block;width:90px;color:#666">${params[i].seriesName}： </span><span style="display:inline-block;width:50px;color:#333">${(params[i].value || '-')} </span><br/>`
                        }
                    }
                }
                return result
            }
        },
        legend: {
            top: '30px',
            data: data.legendDataList,
        },
        xAxis: {
            type: "category",
            name: '日期',
            boundaryGap: false,
            data: data.xdata,
            axisLine: {
                show: true,
                // lineStyle: {
                //     color: "#E4E4E4",
                // },
                // symbol: "none",
            },
            // axisTick: {
            //     inside: true,
            //     lineStyle: {
            //         color: "#E4E4E4",
            //     },
            // },
            // axisLabel: {
            //     color: "#999999",
            // },
        },
        yAxis: {
            type: 'value',
            name: '心情指数',
            nameLocation: 'center',
            nameGap: 40,
            axisLine: { show: true },
            splitLine: { show: true },
            min: -5,
            max: 5
        },
        series: seriesList
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