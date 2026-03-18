<template>
  <div v-if="isShowPage" class="tab-content jus-bet-center">
    <div class="view-left">
      <div class="title-overview">项目与迭代信息</div>
      <div class="module-title mt28">项目信息</div>
      <div class="jus-bet-center">
        <div class="basic-label">项目名称</div>
        <el-tooltip :content="basicInfo.projectName" effect="dark" placement="top">
          <div class="basic-value tooltip-column">{{ basicInfo.projectName }}</div>
        </el-tooltip>
      </div>
      <div class="jus-bet-center mt20">
        <div class="basic-label">项目简称</div>
        <div class="basic-value tooltip-column">{{ basicInfo.shortName }}</div>
      </div>
      <div class="jus-bet-center mt20">
        <div class="basic-label">项目负责人</div>
        <div class="basic-value tooltip-column">{{ basicInfo.projectOwner ?? '-' }}</div>
      </div>
      <div class="jus-bet-center mt20">
        <div class="basic-label">产品负责人</div>
        <div class="basic-value tooltip-column">{{ basicInfo.productOwner ?? '-' }}</div>
      </div>

      <div class="module-title mt28">迭代信息</div>
      <div class="jus-bet-center">
        <div class="basic-label">迭代名称</div>
        <el-tooltip :content="basicInfo.name" effect="dark" placement="top">
          <div class="basic-value tooltip-column">{{ basicInfo.name }}</div>
        </el-tooltip>
      </div>
      <div class="jus-bet-center mt20">
        <div class="basic-label">开始日期</div>
        <div class="basic-value">{{ basicInfo.startDate }}</div>
      </div>
      <div class="jus-bet-center mt20">
        <div class="basic-label">结束日期</div>
        <div class="basic-value">{{ basicInfo.endDate }}</div>
      </div>
      <div class="jus-bet-center mt20">
        <div class="basic-label">需求分析人</div>
        <div class="basic-value">{{ basicInfo.productOwnerName ?? '-' }}</div>
      </div>
      <div class="jus-bet-center mt20">
        <div class="basic-label">Scrum Master</div>
        <div class="basic-value value-long">{{ basicInfo.scrumMasterName ?? '-' }}</div>
      </div>
    </div>
    <div class="view-right">
      <div class="jus-bet-center">
        <div class="title-overview">燃尽迭代图</div>
        <div class="jus-end-center gap28">
          <div class="outExport" @mouseenter="showExportBox" @mouseleave="closeExportBox">
            <div v-if="burndownData.differenceFlag" class="option jus-bet-center">
              <el-icon>
                <WarningFilled/>
              </el-icon>
              差异分析
            </div>
            <div v-if="isShowExportBox" class="exportBox">
              <VariAnalysis :tableData="diffTableData"/>
            </div>
          </div>

          <div class="jus-bet-center">
            <div class="cond-label">展示方式</div>
            <el-select v-model="showWay" :style="{width: '140px'}">
              <el-option v-for="item in showWayOption" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </div>
        </div>
      </div>
      <div class="chart-content">
        <LineChart :data="showWay == 1 ? lineChartData : lineChartData1" :showWay="showWay" height="100%" width="100%"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onBeforeMount, ref, watch} from 'vue'
import VariAnalysis from './VariAnalysis.vue'
import LineChart from './LineChart.vue'
import {getBurndownData, getOverviewInfo} from '@/api/agileBoardApi.js'

const props = defineProps(['curSprintId'])
const isShowPage = ref(false)
const basicInfo = ref({})
const lineChartData = ref([])
const lineChartData1 = ref([])
const burndownData = ref()

const showWay = ref(1)
const showWayOption = ref([
  {id: 1, name: '基于故事点'},
  {id: 2, name: '基于任务数'},
])
let isShowExportBox = ref(false)
let diffTableData = ref([])


// 展示导出选项窗口
const showExportBox = () => {
  isShowExportBox.value = true
}
// 隐藏导出选项窗口
const closeExportBox = () => {
  isShowExportBox.value = false
}

const getOverviewInfoFn = () => {
  let params = {
    sprintId: props.curSprintId
  }
  getOverviewInfo(params).then(res => {
    if (res.success) {
      basicInfo.value = res.data
    }
  })
}

const getBurndownDataFn = () => {
  let params = {
    sprintId: props.curSprintId
  }
  getBurndownData(params).then(res => {
    if (res.success) {
      burndownData.value = res.data
      lineChartData.value = res.data.storyPointsData
      lineChartData1.value = res.data.taskCountData
      diffTableData.value = []
      if (burndownData.value.differenceFlag) {
        diffTableData.value.push({type: '故事点', ...res.data.differenceAnalysis.storyPoints})
        diffTableData.value.push({type: '任务数', ...res.data.differenceAnalysis.taskCount})
      }
      console.log('diffTableData.value===', diffTableData.value)
      setTimeout(() => {
        isShowPage.value = true
      }, 500)
    }
  })
}

watch(() => props.curSprintId, (nval) => {
  getOverviewInfoFn()
  getBurndownDataFn()
}, {immediate: true, deep: true})

onBeforeMount(() => {
  // getOverviewInfoFn()
  // getBurndownDataFn()
})

</script>

<style lang="scss" scoped>
.tab-content {
  padding: 20px;
  box-sizing: border-box;
  background-color: #F0F5FC;
  height: calc(100vh - 231px);
  border-radius: 8px;
  gap: 10px;
  align-items: start;

  .mt20 {
    margin-top: 12px;
  }

  .mt28 {
    margin-top: 20px;
  }

  .gap28 {
    gap: 20px;
  }

  .view-left, .view-right {
    height: 516px;
    background-color: #FFF;
    border-radius: 8px;

    .title-overview {
      font-size: 14px;
      color: #1D1D1D;
      font-weight: 600;
    }
  }

  .view-left {
    width: 450px;
    padding: 24px 24px 28px;
    box-sizing: border-box;

    .module-title {
      width: 100%;
      height: 32px;
      padding-left: 10px;
      box-sizing: border-box;
      line-height: 32px;
      background-color: #EFF7FF;
      font-size: 14px;
      color: #2173F7;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .basic-label {
      font-size: 14px;
      color: #747474;
      padding-left: 12px;
    }

    .basic-value {
      width: calc(100% - 100px);
      text-align: end;
      font-size: 14px;
      color: #333;
    }

    .value-long {
      width: calc(100% - 200px);
    }
  }

  .view-right {
    width: calc(100% - 460px);
    padding: 24px 24px 28px;
    box-sizing: border-box;

    .cond-label {
      margin-right: 12px;
      color: #4D4D4D;
      font-size: 12px;
    }

    .outExport {
      position: relative;

      .option {
        color: #2173f7;
        gap: 2px;
        cursor: pointer;
      }

      .exportBox {
        position: absolute;
        top: 25px;
        right: 0;
        z-index: 20;
        display: flex;
        flex-direction: column;
        gap: 2px;
        background-color: #FFF;
        border-radius: 8px;
        box-shadow: 0px 0px 8px 8px #DCECFF;


      }
    }

    .chart-content {
      width: 100%;
      height: calc(100% - 32px);
    }

  }

  .tooltip-column {
    width: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>