<template>
  <el-dialog v-model="addShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" height="100vh" top="0vh"
             width="100vw" @close="handleClose" class="full-el-dialog">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">迭代时间线</div>
        </div>
        <el-icon class="dia-header-close" size="16px" @click="close">
          <Close/>
        </el-icon>
      </div>
    </template>

    <div class="main-content">
      <!-- <MenuBreadCom :type="3"></MenuBreadCom> -->
      <div class="jus-bet-center">
        <div class="title-1">{{ detailName }}</div>
        <div class="jus-bet-center gap4">
          <div :class="{'mode-btn-active': modeVal == 1}" class="mode-btn" @click="changeMode(1)">统计模式</div>
          <div :class="{'mode-btn-active': modeVal == 2}" class="mode-btn" @click="changeMode(2)">详情模式</div>
        </div>
      </div>
      <div class="card-1 border-radius-8 bg-color-1 jus-start-center">
        <div class="title-2">图例：</div>
        <div v-for="(item, index) in legendList" :key="index" :style="{ opacity: item.isShow == true ? '1' : '0.3' }"
             class="legend-item jus-start-center">
          <div :style="{ background: filterColor(item.name, 1) }" class="item-icon">
          </div>
          <div class="item-val">{{ item.name }}</div>
        </div>
      </div>
      <div class="time-line-mian">
        <div v-for="item in dataList" v-show="dataList && dataList.length > 0" :key="item" :style="{ width: baseWidth + '%' }"
             class="time-line-sport">
          <div v-for="items in list" :key="items.date" class="item-line">
            <div v-if="items.date == item"
                 :class="items.content == '迭代开始' ? 'item-bet-content' : 'item-bet-content-end'">
              <div class="content-time">{{ items.content + '：' + items.date }}</div>
            </div>
          </div>
          <div v-for="pointArr in list2" v-show="list2 && list2.length > 0" :key="pointArr.date"
               class="point-content">
            <div v-if="pointArr.date == item" class="point-content-main">
              <el-popover v-for="(pointItem, indexs) in pointArr.child" :key="indexs"
                          :width="modeVal == 1 ? 300 : 600" trigger="click"
                          placement="right" popper-class="popoverClass-dict">
                <template #reference>
                  <div :style="{ background: filterColor(pointItem.name, 1) }" class="point-item"></div>
                </template>
                <template #default>
                  <div style="display: flex; flex-direction: column">
                    <div class="title-name-fix-title" style="font-weight:bold">
                      <i class="title-name-fix-icon"></i>
                      {{ pointItem.name }}
                      <span style="padding-left:5px;font-weight:bold">{{
                          pointItem.num == 0 ? '' : ('(' + pointItem.num +
                              ')')
                        }}</span>
                    </div>
                    <div class="title-name-fix-time">{{ pointItem.time }}</div>
                    <div class="title-name-fix-item fix-top" style="max-height: 80vh; overflow: auto;padding-right: 3px;">
                      <div class="title-name-fix-tip" v-for="info in pointItem.contentList" :key="info">
                        <span class="black" v-html="info.content"></span>
                        <div v-for="detail in info.detailList" v-if="modeVal == 2" :key="detail"
                             style="margin-top: 8px;">
                          <div style="color: #666;" v-html="detail"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </el-popover>

            </div>
          </div>
        </div>
        <div v-if="sq && sq.length > 0" :style="{ left: spaceLeft * baseWidth + '%' }" class="space-bar">
          <div class="space-bar-main">
            <div v-for="(spaceItem, index) in sq" :key="spaceItem.startDate" :style="{ width: baseWidth * spaceItem.spaceTime + '%', background: filterColor(spaceItem.content, 2) }"
                 class="space-item">
              <div class="space-name">{{ spaceItem.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>

</template>
<script setup>
import {onBeforeMount, ref} from 'vue';
import moment from "moment";
import {getTimeLineInfo} from '@/api/projectApi.js';

const props = defineProps(['isShow', 'sprintId', 'detailName']);
const emits = defineEmits(['closeDiaFn'])

const addShow = ref(props.isShow ?? false)
const dataList = ref([])
const baseWidth = ref(0)
const spaceLeft = ref(0)

const handleClose = () => {
  emits('closeDiaFn')
}

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
  if (val == modeVal.value) return
  modeVal.value = val
}

const filterColor = (name, type) => {
  let data = type == 1 ? colorList.value.filter(item => item.name == name) : sqColorList.value.filter(item => item.name == name)
  let color = data.length > 0 ? data[0].color : '#fff'
  return color
}

function getInfo() {
  getTimeLineInfo({sprintId: props.sprintId}).then(res => {
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
  height: calc(100vh - 115px);
  overflow-y: auto;
  padding: 0 20px;
}

.dia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 15px;

  .dia-header-title {
    display: flex;
    align-items: center;

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

  .dia-header-close {
    cursor: pointer;

    svg {
      width: 1.5em;
      height: 1.5em;
    }
  }
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
  border-radius: 4px;
  background-color: #F0F5FC;
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
  position: relative;
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
        position: relative;
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

.title-name-fix-item{
  .title-name-fix-tip{
    padding: 12px 0;
    border-bottom: 1px solid #e2e4e8;

    &:last-child{
      border-bottom: none;
    }
  }
}

.fix-top{
  padding-top: 0;
}
</style>