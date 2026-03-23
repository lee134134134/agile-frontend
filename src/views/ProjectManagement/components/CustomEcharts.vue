<template>
    <div class="bar-chart-content">
        <div v-if="isShowChart" :id="chartId" :style="{ width, height }" ref="chart2Ref"></div>
        <div v-else :style="{ width, height }"></div>
    </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
    chartId: { type: String, default: 'customChart' }, // 图表唯一标识
    width: { type: String, default: '100%' }, // 宽度
    height: { type: String, default: '600px' }, // 高度
    data: { type: Array, default: () => ([]) }, // 数据对象，需包含x轴类别与多系列数据
    rotateDeg: { type: Boolean, default: false },
    bottomPos: { type: String, default: '70px' }
})
const isShowChart = ref()
isShowChart.value = (props.data != [] && props.data.length > 0) ? true : false
// 图表实例引用
const chart2Ref = ref(null);
const units = ref([])
// 监听数据变化，动态更新图表
onMounted(() => {
    if (!chart2Ref.value) return;
    const chart = echarts.init(chart2Ref.value);
    const option = generateOption(props.data);
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize()); // 监听窗口缩放，自适应图表
});

// 生命周期钩子：组件销毁时销毁图表实例
onBeforeUnmount(() => {
    if (chart2Ref.value) {
        echarts.dispose(chart2Ref.value);
    }
    window.removeEventListener('resize', () => chart2Ref.value?.resize());
});
watch(() => props.data, (newData) => {
    if (chart2Ref.value) {
        const chart = echarts.getInstanceByDom(chart2Ref.value);
        chart.setOption(generateOption(newData));
    }
}, { immediate: true });
const colorList = ['#2173f7']
// 生成ECharts配置项（option）
function generateOption(data) {
    console.log(data)
    let unitData = data;
    let series = [];
    units.value = [...new Set(unitData.map(item => item.name))]; // 获取所有单位名称
    let legendData = ['迭代天数']; // 图例数据（所有状态类型）
    let minDate = Infinity;
    let maxDate = -Infinity;
    data.forEach(item => {
        // 跳过无效日期（如 "文本"）
        if (item.startDate !== "" && item.endDate !== "") {
            const start = new Date(item.startDate).getTime();
            const end = new Date(item.endDate).getTime();

            // 补全结束时间为当天的 23:59:59（如果原数据只有日期部分）
            const endFull = new Date(item.endDate);
            endFull.setHours(23, 59, 59, 999);
            const endFullTime = endFull.getTime();

            // 更新最小和最大日期
            if (start < minDate) minDate = start;
            if (endFullTime > maxDate) maxDate = endFullTime;
        }
    });

    let minDateObj = new Date(minDate);
    let maxDateObj = new Date(maxDate);
    let now = new Date();
    let isoString = now.toISOString(); // "2024-05-15T14:30:00.000Z"
    let currentDateTime = isoString.replace('T', ' ').split('.')[0]; // "2024-05-15 14:30:00"
    // 为每个单位创建系列
    legendData.forEach(status => {
        var statusDataItems = unitData;
        var seriesData = statusDataItems.map(item => {
            return {
                name: item.name, // 单位名称
                value: [
                    item.startDate,
                    item.endDate,
                    item.name,
                    item.period
                ],
                itemStyle: {
                    color: '#2173f7'
                }
            };
        });
        series.push({
            type: 'custom',
            name: status, // 使用状态类型作为系列名称
            renderItem: renderItem,
            data: seriesData,
            encode: {
                x: [0, 1],
                y: 2,
                tooltip: [0, 1, 3],
                itemName: 3
            },
        });
    });

    return {
        legend: {
            left: 'center',
            top: 30,
            show: true,
            data: legendData.map(item => {
                return {
                    name: item, // 单位名称
                    itemStyle: {
                        color: '#2173f7'
                    }
                };
            })
        },

        title: {
            text: '',
            left: 'center',
            top: 10,
            textStyle: {
                fontSize: 16,
                fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                var data = params.data.value;
                return `
<div style="font-weight:bold;color:#666">${data[2]}</div>
<div style="margin:5px 0;color:#666">时间: <span style="color:#666">${data[0]} 至 ${data[1]}</span></div>
`;
            },
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderColor: '#ddd',
            borderWidth: 1,
            padding: 8,
            textStyle: {
                fontSize: 12
            }
        },
        grid: {
            left: '2%',
            bottom: '50px',
            right: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'time',
            min: new Date(minDateObj.toISOString().split('.')[0]).getTime(),
            max: new Date(maxDateObj.toISOString().split('.')[0]).getTime(),
            axisLine: {
                show: true
            },
            axisLabel: {
                show: true,
                formatter: function (value) {
                    var date = new Date(value);
                    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                },
                color: '#666',
                fontSize: 10,
                rotate: 70,
                interval: function (index, value) {
                    return 0
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#eee',
                    type: 'dashed'
                }
            },
            axisTick: {
                show: true,
                alignWithLabel: true
            }
        },
        yAxis: {
            type: 'category',
            data: units.value,
            inverse: true, // 让yAxis逆序显示
            axisLine: {
                lineStyle: {
                    color: '#999'
                }
            },
            axisLabel: {
                color: function (value) {
                    return '#333';
                },
                // fontSize: 12,
                interval: 0,
            },
            axisTick: {
                // show: false,
                alignWithLabel: false
            }
        },
        series: series,
        animationDuration: 500
    }
}
// 自定义渲染函数 - 优化了柱子高度和位置
function renderItem(params, api) {
    var categoryIndex = api.value(2);
    var start = api.coord([api.value(0), categoryIndex]);
    var end = api.coord([api.value(1), categoryIndex]);

    // 获取y轴的单个类别高度
    var coordSys = params.coordSys;
    var categoryHeight = coordSys.height / units.value.length;

    // 设置柱子高度为类别高度的60%，并添加一些间距
    var height = categoryHeight * 0.2;
    // 计算y轴位置，使柱子居中
    var y = coordSys.y + (categoryIndex + 0.5) * categoryHeight - height / 2;

    // 添加圆角效果
    var style = api.style();
    style.borderRadius = [height / 2, height / 2, height / 2, height / 2];
    const labelText = `${api.value(3)}天`; // name + processWorkTime

    return {
        type: 'group',
        children: [
            {
                type: 'rect',
                shape: {
                    x: start[0],
                    y: y,
                    width: Math.max(end[0] - start[0], 1), // 确保最小宽度
                    height: height
                },
                style
            },
            {
                type: 'text',
                style: {
                    text: labelText,
                    x: end[0] + 20,
                    y: y + height, // 上方显示，略微靠近矩形
                    textAlign: 'center',
                    textVerticalAlign: 'bottom',
                    fill: '#333',
                    fontSize: 12,
                    fontWeight: 500,
                }
            }
        ]
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