<template>
  <div class="main-content">
    <MenuBreadCom :type="2"></MenuBreadCom>
    <div class="container-view">
      <div class="title-1">{{ projectName }}</div>
      <div class="view-card jus-bet-center">
        <div v-for="(item, index) in projectInfo" :key="index" class="view-container">
          <div class="container-title-1">{{ item.title ?? '-' }}</div>
          <div class="container-title-2">{{ (item.previousNum ?? '0') + '/' + (item.nextNum ?? '0') }}</div>
          <div class="container-title-3">{{ (item.previousName ?? '-') + '/' + (item.nextName ?? '-') }}</div>
        </div>
      </div>
      <div class="view-card">
        <div class="title-2 jus-start-center"><span class="title-icon"></span> 项目迭代概览</div>
        <div class="border-radius-8 card-main">
          <BarLineChart v-if="chart1" :data="chart1"/>
        </div>
      </div>
      <div class="view-card">
        <div class="title-2 jus-start-center"><span class="title-icon"></span> 项目迭代甘特图</div>
        <div class="border-radius-8 card-main">
          <!-- <CustomEcharts v-if="chart2 && chart2.length > 0" :data="chart2" /> -->
          <GanttChart v-if="chart2 && chart2.length > 0" :data="chart2"/>
        </div>
      </div>
      <div class="view-card">
        <div class="title-2 jus-start-center"><span class="title-icon"></span> 项目迭代详情</div>
        <div class="border-radius-8 card-main2">
          <el-table :data="tableData" :header-cell-style="TableRowStyle" fit scrollbar-always-on stripe
                    style="width: 100%">
            <el-table-column align="left" label="迭代名称" min-width="300">
              <template #default="scope">
                <span class="link-text" @click="goDetail(scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="时间范围" min-width="200">
              <template #default="scope">
                <span>{{ scope.row.startDate + '至' + scope.row.endDate }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="迭代天数" min-width="100" prop="period"></el-table-column>
            <el-table-column align="center" label="团队人数" min-width="100">
              <template #default="scope">
                <span>{{ scope.row.memberNum }}人</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="关联需求数" min-width="100"
                             prop="requirementNum"></el-table-column>
            <el-table-column align="center" label="用户故事数" min-width="100" prop="storyNum"></el-table-column>
            <el-table-column align="center" label="总故事点" min-width="100" prop="storyPointNum"></el-table-column>
            <el-table-column align="center" label="任务数" min-width="100" prop="taskNum"></el-table-column>
            <el-table-column align="center" label="测试案例数" min-width="100" prop="testcaseNum"></el-table-column>
            <el-table-column align="center" label="缺陷数" min-width="100" prop="defectNum"></el-table-column>
            <el-table-column align="center" label="已解决缺陷数" min-width="120"
                             prop="resolvedDefectNum"></el-table-column>
            <el-table-column align="center" label="迭代状态" min-width="100">
              <template #default="scope">
                <div>
                                    <span :class="{ 'status-black': scope.row.status === 'not_started', 'status-blue': scope.row.status === 'in_progress', 'status-green': scope.row.status === 'done' }"
                                          class="project-tag-fix">
                                        {{ scope.row.sprintStatus ?? '-' }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <TimeLineDetail v-if="isShowTimeLine" :detailName="detailName" :isShow="isShowTimeLine" :sprintId="sprintId"
                    @closeDiaFn="handleCloseTimeLine"/>
  </div>
</template>
<script setup>
import {onBeforeMount, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {TableRowStyle} from '@/utils';
import MenuBreadCom from './components/MenuBreadCom.vue';
import BarLineChart from './components/BarLineChart.vue';
import GanttChart from './components/GanttChart.vue';
import TimeLineDetail from './components/TimeLineDetail.vue';
import {projectSummary} from '@/api/projectApi.js';

const route = useRoute();
const proId = ref(route.query.proId || '')
const projectName = ref(route.query.name || '')
const router = useRouter()
const chart2 = ref([])
const colorList = ref(['#2173f7', 'gray', 'green', 'blue'])
const projectInfo = ref([{
  id: 1,
  modelName: '功能模块',
  persent1: '4',
  persent2: '9',
  name1: '菜单',
  name2: '页面',
}, {
  id: 2,
  modelName: '需求',
  persent1: '4',
  persent2: '9',
  name1: '已完成',
  name2: '总数',
}, {
  id: 3,
  modelName: '故事',
  persent1: '4',
  persent2: '9',
  name1: '已完成',
  name2: '总数',
}, {
  id: 4,
  modelName: '迭代',
  persent1: '4',
  persent2: '9',
  name1: '已完成',
  name2: '总数',
}])
const chart1 = ref(null)

const tableData = ref([])
const isShowTimeLine = ref(false)
const sprintId = ref('')
const detailName = ref('')


const goDetail = (data) => {
  // router.push({ path: '/project/timeLine/detail', query: { proId: proId.value, sprintId: data.sprintId, detailName: data.name } })
  sprintId.value = data.sprintId
  detailName.value = data.name
  isShowTimeLine.value = true
}

const handleCloseTimeLine = () => {
  isShowTimeLine.value = false
}

async function getInfo() {
  projectSummary({projectId: route.query.proId}).then(res => {
    if (res.success) {
      projectInfo.value = res?.data?.summaryList ?? []
      chart1.value = res?.data?.sprintOverviewInfo ?? null
      chart2.value = res?.data?.gantInfoList ?? []
      chart2.value.forEach(item => {
        item.progress = 100
        item.start = item.startDate
        item.end = item.endDate
      })
      tableData.value = res?.data?.sprintInfoList ?? []
    }
  })
}

onBeforeMount(async () => {
  await getInfo()
})
</script>
<style lang="scss" scoped>
.main-content {
  height: 100%;
  width: 100%;
  padding-left: 20px;
  padding-right: 0;
  margin-right: -30px;
}

.container-view {
  // width: 100%;
  width: calc(100% - 10px);
  margin-top: 20px;
  padding-right: 10px;
  height: calc(100vh - 120px);
  overflow-y: auto;

  .view-card {
    margin: 20px 0;
    column-gap: 20px;

    .view-container {
      width: 24%;
      padding: 20px;
      padding-left: 45px;
      border-radius: 8px;
      background: #fff;

      .container-title-1 {
        color: #8e8e8e;
        font-size: 20px;
        font-weight: 400;
      }

      .container-title-2 {
        margin: 10px 0;
        color: #1d1d1d;
        font-size: 24px;
        font-weight: bolder;
      }

      .container-title-3 {
        color: #8e8e8e;
        font-size: 14px;
        font-weight: 400;
      }
    }

    .card-main {
      margin: 10px 0;
      padding: 20px 0;
    }

    .card-main2 {
      margin-top: 10px;
      padding: 10px;
      background: #fff;
    }
  }

  .link-text {
    font-family: 'Microsoft YaHei', 'PingFang SC';;
    font-size: 14px;
    color: #2173F7;
    text-decoration-line: underline;
    cursor: pointer;
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

:deep(.el-dialog) {
  --el-dialog-border-radius: 0 !important;
  border-radius: 0 !important;
  margin: 0 !important;
}
</style>