<template>
    <div class="main-content">
        <MenuBreadCom :type="3"></MenuBreadCom>
        <div class="jus-bet-center">
            <div class="title-1">{{ detailName }}</div>
            <div class="jus-bet-center gap4">
                <div class="mode-btn" :class="{'mode-btn-active': modeVal == 1}" @click="changeMode(1)">统计模式</div>
                <div class="mode-btn" :class="{'mode-btn-active': modeVal == 2}" @click="changeMode(2)">详情模式</div>
            </div>
        </div>
        <div class="card-1 border-radius-8 bg-color-1 jus-start-center">
            <div class="title-2">图例：</div>
            <div class="legend-item jus-start-center" v-for="(item, index) in legendList" :key="index"
                :style="{ opacity: item.isShow == true ? '1' : '0.3' }">
                <div class="item-icon" :style="{ background: filterColor(item.name, 1) }">
                </div>
                <div class="item-val">{{ item.name }}</div>
            </div>
        </div>
        <div class="time-line-mian">
            <div class="time-line-sport" v-show="dataList && dataList.length > 0" v-for="item in dataList" :key="item"
                :style="{ width: baseWidth + '%' }">
                <div class="item-line" v-for="items in list" :key="items.date">
                    <div v-if="items.date == item"
                        :class="items.content == '迭代开始' ? 'item-bet-content' : 'item-bet-content-end'">
                        <div class="content-time">{{ items.content + '：' + items.date }}</div>
                    </div>
                </div>
                <div class="point-content" v-for="pointArr in list2" :key="pointArr.date"
                    v-show="list2 && list2.length > 0">
                    <div class="point-content-main" v-if="pointArr.date == item">
                        <el-popover placement="right" :width="300" v-for="(pointItem, indexs) in pointArr.child"
                            :key="indexs">
                            <template #reference>
                                <div class="point-item" :style="{ background: filterColor(pointItem.name, 1) }"></div>
                            </template>
                            <template #default>
                                <div style="display: flex; gap: 16px; flex-direction: column">
                                    <div class="title-name" style="font-weight:bold">
                                        {{ pointItem.name }}
                                        <span style="padding-left:5px">{{ pointItem.num == 0 ? '' : ('[' + pointItem.num +
                                            ']')
                                        }}</span>
                                    </div>
                                    <div class="title-name">{{ pointItem.time }}</div>
                                    <div class="title-name" v-if="modeVal == 1">
                                        <div v-for="info in pointItem.content" :key="info" v-html="info"></div>
                                    </div>
                                </div>
                            </template>
                        </el-popover>

                    </div>
                </div>
            </div>
            <div class="space-bar" :style="{ left: spaceLeft * baseWidth + '%' }" v-if="sq && sq.length > 0">
                <div class="space-bar-main">
                    <div class="space-item" v-for="(spaceItem, index) in sq" :key="spaceItem.startDate"
                        :style="{ width: baseWidth * spaceItem.spaceTime + '%', background: filterColor(spaceItem.content, 2) }">
                        <div class="space-name">{{ spaceItem.content }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, onBeforeMount, nextTick, onMounted } from 'vue';
import moment from "moment";
import { useRoute } from 'vue-router';
import MenuBreadCom from './components/MenuBreadCom.vue';
import { getTimeLineInfo } from '@/api/projectApi.js';

const route = useRoute();
const sprintId = ref(route.query.sprintId || '')
const detailName = ref(route.query.detailName || '')
const dataList = ref([])
const baseWidth = ref(0)
const spaceLeft = ref(0)

function getDatesBetween(startDate, endDate) {
    let dates = [];
    let current = moment(startDate);
    while (current <= endDate) {
        dates.push(current.format('YYYY-MM-DD'));
        current.add(1, 'day');
    }
    return dates;
}
const list = ref([])
const list2 = ref([])
const sq = ref([])
const colorList = ref([
    {
        name: '迭代创建',
        color: '#ff4757'
    }, {
        name: '迭代开始',
        color: '#ff6b35'
    }, {
        name: '需求评审',
        color: '#ff9f43'
    }, {
        name: '迭代会议',
        color: '#ffd23f'
    }, {
        name: '用户故事状态',
        color: '#f9f871'
    }, {
        name: '任务创建',
        color: '#a3e635'
    }, {
        name: '设计评审',
        color: '#4ade80'
    }, {
        name: '测试用例评审',
        color: '#2dd4bf'
    }, {
        name: '任务开始',
        color: '#22d3ee'
    }, {
        name: '任务完成',
        color: '#38bdf8'
    }, {
        name: '测试执行',
        color: '#60a5fa'
    }, {
        name: '缺陷创建',
        color: '#818cf8'
    }, {
        name: '缺陷修复',
        color: '#a78bfa'
    }, {
        name: '迭代评审',
        color: '#c084fc'
    }, {
        name: '迭代回顾',
        color: '#d946ef'
    }, {
        name: '迭代总结',
        color: '#f472b6'
    }, {
        name: '迭代完成',
        color: '#fb7185'
    }
])
const legendList = ref([])
const bestLegend = ref([
    {
        name: '迭代创建',
        isShow: 'true'
    }, {
        name: '迭代开始',
        isShow: 'true'
    }, {
        name: '需求评审',
        isShow: 'true'
    }, {
        name: '迭代会议',
        isShow: 'true'
    }, {
        name: '用户故事状态',
        isShow: 'true'
    }, {
        name: '任务创建',
        isShow: 'true'
    }, {
        name: '设计评审',
        isShow: 'true'
    }, {
        name: '测试用例评审',
        isShow: 'true'
    }, {
        name: '任务开始',
        isShow: 'true'
    }, {
        name: '任务完成',
        isShow: 'true'
    }, {
        name: '测试执行',
        isShow: 'true'
    }, {
        name: '缺陷创建',
        isShow: 'true'
    }, {
        name: '缺陷修复',
        isShow: 'true'
    }, {
        name: '迭代评审',
        isShow: 'true'
    }, {
        name: '迭代回顾',
        isShow: 'true'
    }, {
        name: '迭代总结',
        isShow: 'true'
    }, {
        name: '迭代完成',
        isShow: 'true'
    }
])
const sqColorList = ref([{
    name: '迭代规划阶段',
    color: '#17a2b81a'
}, {
    name: '迭代初期阶段',
    color: '#28a7451a'
}, {
    name: '迭代中期阶段',
    color: '#fd7e141a'
}, {
    name: '迭代后期阶段',
    color: '#6610f21a'
},])
const modeVal = ref(1) // 默认统计模式

const changeMode = (val) => {
    if(val == modeVal.value) return
    modeVal.value = val
}

const filterColor = (name, type) => {
    let data = type == 1 ? colorList.value.filter(item => item.name == name) : sqColorList.value.filter(item => item.name == name)
    let color = data.length > 0 ? data[0].color : '#fff'
    return color
}
function getInfo() {
    getTimeLineInfo({ sprintId: sprintId.value }).then(res => {
        if (res.success) {
            let startDate = moment(res.data.minDate);
            let endDate = moment(res.data.maxDate);
            // let startDate = moment('2025-10-19');
            // let endDate = moment('2025-11-01');
            dataList.value = getDatesBetween(startDate, endDate);
            baseWidth.value = 100 / dataList.value.length;
            sq.value = res?.data?.sprintStageList ?? []
            list.value = res?.data?.sprintPeriodList ?? []
            list2.value = res?.data?.sprintEventList ?? []
            legendList.value = res?.data?.eventItemList ?? bestLegend.value
            if (sq.value.length > 0) {
                spaceLeft.value = dataList.value.findIndex(item => item == sq.value[0].startDate)
            }
        }
    })
}
onBeforeMount(() => {
    getInfo()

})
</script>
<style lang="scss" scoped>
.main-content {
    overflow-x: clip;
}

.title-1 {
    margin: 20px 0;
}

.gap4 {
    gap: 4px;
}

.mode-btn {
    height: 32px;
    line-height: 32px;
    padding: 0 16px;
    border-radius: 8px;
    background-color: #E0E7F2;
    cursor: pointer;
}
.mode-btn-active {
    background-color: #2173f7;
    color: #FFF;
}

.card-1 {
    // height: 45px;
    // line-height: 45px;
    padding: 15px;
    // padding-left: 15px;
    overflow-x: auto;

    .title-2 {
        flex-shrink: 0;
        margin-left: 12px;
    }

    .legend-item {
        margin-left: 12px;
        // width: 180px;
        flex-shrink: 0;

        .item-icon {
            margin-right: 5px;
            width: 8px;
            height: 8px;
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
        }

        .item-val {
            font-size: 12px;
            color: #333;
            font-weight: 400;
            // width: 120px;
        }
    }
}

.time-line-mian {
    margin-top: 100px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;


    .time-line-sport {
        height: 2px;
        background: #2173f7;
        position: relative;

        .item-line {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background: #2173f7;

            .item-bet-content {
                position: absolute;
                top: -60px;
                left: 0;
                // width: 160px;
                height: 60px;
                border-left: 2px solid #2173f7;

                .content-time {
                    position: absolute;
                    left: -63px;
                    top: -24px;
                    width: 160px;
                    color: #2173f7;
                    font-size: 14px;
                    font-weight: bold;
                    text-align: center;

                }

            }

            .item-bet-content-end {
                position: absolute;
                top: -60px;
                right: 0;
                // width: 150px;
                height: 60px;
                border-right: 2px solid #2173f7;

                .content-time {
                    position: absolute;
                    right: -63px;
                    top: -24px;
                    width: 160px;
                    color: #2173f7;
                    font-size: 14px;
                    font-weight: bold;
                    text-align: center;
                }
            }
        }

        .point-content {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            // background: #b01a10;
            z-index: 999;

            .point-content-main {
                width: 10px;
                margin-left: -5px;
                padding: 10px 0;
                // background: #f0e5ed;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;

                .point-item {
                    margin: 10px 0;
                    width: 20px;
                    height: 20px;
                    border: 2px solid #f9f9fa92;
                    border-radius: 50%;
                }
            }
        }
    }

    .space-bar {
        position: absolute;
        width: 100%;
        top: 2px;

        .space-bar-main {

            display: flex;
            justify-content: flex-start;
            align-items: center;

            .space-item {
                height: 25px;
                border-left: 1px dotted #2173f7;
                box-sizing: border-box;

                .space-name {
                    position: absolute;
                    top: -30px;
                    left: 10px;
                    font-size: 14px;
                    color: #635e5e;
                    font-weight: 500;
                }
            }

            .space-item:nth-last-of-type(1) {
                border-right: 1px dotted #2173f7;
            }
        }

    }

    .point-bar {
        width: 500px;
        height: 300px;
        position: absolute;
        top: 0;
        left: 0;
        background: #e67709;
        z-index: 9;
    }
}

/* 整个滚动条 */
::-webkit-scrollbar {
    width: 8px;
    /* 宽度 */
    height: 8px;
    /* 高度 */
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
    background: none;
    /* 颜色 */
}

/* 滚动条的滑块 */
::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    /* 颜色 */
    border-radius: 4px;
}

/* 滚动条的滑块：鼠标悬停时 */
::-webkit-scrollbar-thumb:hover {
    background: #e9e9e9;
    /* 颜色 */
}
</style>