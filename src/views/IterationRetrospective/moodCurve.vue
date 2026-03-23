<template>
  <div class="page-detail">
    <MenuBreadCom :page="pageName"></MenuBreadCom>
    <div class="jus-bet-center">
      <div class="title-1">心情曲线</div>
      <div v-show="!showTeam" class="opt-btn" @click="showTeam = true">查看团队心情曲线</div>
      <div v-show="showTeam" class="opt-btn" @click="showTeam = false">查看个人心情</div>
    </div>
    <div v-if="!showTeam" class="mymood-content">
      <div class="base-content jus-bet-start">
        <div class="content-left bg-color-1">
          <div class="jus-bet-center">
            <div class="title-2">我的心情曲线录入</div>
            <!-- <div class="btn-content jus-start-center" v-if="sprintStatus == 'done'">
                <div class="btn-submit btn-disabled">编辑</div>
            </div> -->
            <!-- <div class="btn-content jus-start-center" v-else>
                <div class="btn-submit" v-show="!isEdit" @click="isEdit = !isEdit">编辑</div>
                <div class="btn-submit btn-margin-right" v-show="isEdit" @click="handleSave">保存</div>
                <div class="btn-cancel" v-show="isEdit" @click="isEdit = !isEdit">取消</div>
            </div> -->
          </div>
          <el-table v-loading="modeLoading" :data="moodTable" :header-cell-style="TableRowStyle2" border
                    fit max-height="calc(100vh - 300px)"
                    scrollbar-always-on style="width: 100%;margin-top: 10px;" @row-click="handleRowClick">
            <el-table-column align="left" label="日期" min-width="150" prop="dtDate"></el-table-column>
            <el-table-column align="center" label="心情指数" min-width="130">
              <template #default="scope">
                <div>
                  <!-- <el-input-number v-show="isEdit" :step="1" :min="-5" :max="5" preision="0" :value-on-clear="null"
                      v-model="scope.row.moodIndex" size="small"></el-input-number>
                  <span v-show="!isEdit">{{ scope.row.moodIndex == null ? '-' : scope.row.moodIndex }}</span> -->
                  {{ scope.row.moodIndex == null ? '-' : scope.row.moodIndex }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="心情描述" min-width="180" show-overflow-tooltip>
              <template #default="scope">
                <div>
                  <!-- <el-input v-show="isEdit" v-model="scope.row.moodDesc" placeholder="请输心情描述" maxlength="20"
                      clearable></el-input>
                  <span v-show="!isEdit">{{ scope.row.moodDesc ?? '-' }}</span> -->
                  {{ scope.row.moodDesc || '-' }}
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="roleStrName" label="授权角色" min-width="180" align="left"></el-table-column> -->

          </el-table>
        </div>
        <div v-if="isEcharts" class="content-right bg-color-1">
          <div class="title-2">我的心情曲线</div>
          <MoodInfo></MoodInfo>
          <div class="title-3 jus-start-center"><span class="title-icon"></span>心情曲线图</div>
          <div class="chart-content">
            <LineChart :data="lineChartData" height="100%" width="100%"/>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showTeam" class="teammood-content ">
      <div class="team-card">
        <div class="team-card-name title-2 jus-start-center"><span class="title-icon"></span> 团队心情统计</div>
        <div class="team-card-main jus-bet-center">
          <div class="info-item jus-start-center">
            <div class="info-label">迭代天数：</div>
            <div class="info-val">{{ teamStaticsData.dtDateAll || '-' }}天</div>
          </div>
          <div class="info-item jus-start-center">
            <div class="info-label">最高心情指数：</div>
            <div class="info-val">
              {{
                teamStaticsData.teamMaxIndex !== null && teamStaticsData.teamMaxIndex !== '' ? teamStaticsData.teamMaxIndex : '-'
              }}
            </div>
          </div>
          <div class="info-item jus-start-center">
            <div class="info-label">团队平均心情指数：</div>
            <div class="info-val">
              {{
                teamStaticsData.teamAvgIndex !== null && teamStaticsData.teamAvgIndex !== '' ? Number(teamStaticsData.teamAvgIndex).toFixed(2) : '-'
              }}
            </div>
          </div>
          <div class="info-item jus-start-center">
            <div class="info-label">参与成员：</div>
            <div class="info-val">
              {{
                teamStaticsData.teamMembers !== null && teamStaticsData.teamMembers !== '' ? teamStaticsData.teamMembers : '-'
              }}
              人
            </div>
          </div>
          <div class="info-item jus-start-center">
            <div class="info-label">最低心情指数：</div>
            <div class="info-val">
              {{
                teamStaticsData.teamMinIndex !== null && teamStaticsData.teamMinIndex !== '' ? teamStaticsData.teamMinIndex : '-'
              }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="isTeamEcharts" class="team-card">
        <div class="team-card-name title-2 jus-start-center"><span class="title-icon"></span> 团队心情曲线</div>
        <MoodInfo></MoodInfo>
        <div class="chart-content">
          <LineChart :data="lineChartTeamData" height="100%" width="100%"/>
        </div>
      </div>
    </div>

    <el-dialog v-if="isShowEditDia" v-model="isShowEditDia" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"
               class="edit-dia" width="500px" @close="handleClose">
      <template #header="{ close }">
        <div class="dia-header">
          <div class="dia-header-title">
            <div class="title-icon"></div>
            <div class="title-text">填写心情指数</div>
          </div>
          <el-icon class="dia-header-close" size="16px" @click="handleCloseDia">
            <Close/>
          </el-icon>
        </div>
      </template>
      <div class="dia-main">
        <el-form :model="editMoodInfo" class="dia-main-content" label-position="top">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="日期" prop="dtDate">
                <el-input v-model="editMoodInfo.dtDate" disabled style="height: 32px;"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="心情指数（-5 ~ 5）" prop="moodIndex">
                <el-input-number v-model="editMoodInfo.moodIndex" :max="5" :min="-5" :step="1" :value-on-clear="null"
                                 preision="0" style="width: 100%; height: 32px;"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="心情描述" prop="moodDesc">
                <el-input v-model="editMoodInfo.moodDesc" clearable maxlength="20" placeholder="请输心情描述"
                          style="height: 32px;"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="dia-footer jus-bet-end">
          <el-checkbox v-model="checkedValue" label="同步至全部进行中的迭代"/>
          <section class="jus-flex-end">
            <div class="btn-cancel" @click="handleCloseDia">取消</div>
            <el-popover popper-style="width:130px;min-width:130px" content="仅更新当前迭代">
              <template #reference>
                <div class="btn-submit mr12" @click="handleSubmitMood()">保存</div>
              </template>
            </el-popover>
          </section>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import {nextTick, onBeforeMount, ref} from 'vue';
import {TableRowStyle2} from '@/utils';
import MoodInfo from './components/MoodInfo.vue'
import LineChart from './components/LineChart.vue'
import {ElMessage} from 'element-plus';
import MenuBreadCom from './components/MenuBreadCom.vue';
import {useRoute} from 'vue-router'
import {getCycle, getMoodData, getTeamMoodData, getTeamStaticsData, saveMood} from '@/api/iterationReviewApi';

const props = defineProps(['page']);
const route = useRoute();

const curSprintId = ref('')
const pageName = ref(route.query.name ?? '心情曲线')
const sprintStatus = ref()
const isEdit = ref(false)
const cycleList = ref([])
const modeLoading = ref(false)
const checkedValue = ref(true)
const moodTable = ref([])
const editMoodInfo = ref() // 要编辑的心情信息
const editMoodInfoTmp = ref() // 要编辑的心情信息
const isShowEditDia = ref(false) // 编辑弹窗
const lineChartData = ref({
  legendDataList: null,
  xdata: null,
  ydata: null,
})
const showTeam = ref(false)
const teamStaticsData = ref()
const lineChartTeamData = ref({
  fillTimeList: null,
  modifyTimeList: null,
  moodMsList: null,
  legendDataList: null,
  xdata: null,
  ydata: null,
})
const isEcharts = ref(false)
const isTeamEcharts = ref(false)

const handleRowClick = (row) => {
  if (sprintStatus.value == 'done') return
  editMoodInfo.value = JSON.parse(JSON.stringify(row))
  editMoodInfoTmp.value = JSON.parse(JSON.stringify(row))
  checkedValue.value = true
  isShowEditDia.value = true
}

// 保存心情
const handleSubmitMood = () => {
  let params = {
    sprintId: curSprintId.value,
    useAll: checkedValue.value ? 1 : 0,
    moodList: [editMoodInfo.value]
  }
  let _str = editMoodInfoTmp?.value?.moodIndex ? '已在当前迭代更新成功' : '已在当前迭代保存成功'
  saveMood(params).then(res => {
    if (res.success) {
      isShowEditDia.value = false
      editMoodInfo.value = null
      ElMessage.success(res.msg || _str)
      getMoodDataFn() // 刷新
      getTeamStaticsDataFn()
      getTeamMoodDataFn()
    }
  })
}

const handleCloseDia = () => {
  isShowEditDia.value = false
  editMoodInfo.value = null
}

// 获取周期
const getCycleFn = () => {
  getCycle(curSprintId.value).then(res => {
    if (res.success) {
      cycleList.value = res.data
      getMoodDataFn()
    }
  })
}

// 获取个人心情数据
const getMoodDataFn = () => {
  getMoodData(curSprintId.value).then(res => {
    if (res.success) {
      moodTable.value = []
      if (res.data.length == 0) {
        cycleList.value.forEach(item => {
          moodTable.value.push({
            dtDate: item,
            moodIndex: null,
            moodDesc: '',
          })
        })
      } else {
        cycleList.value.forEach(ele => {
          let flag = res.data.some(item => item.dtDate == ele)
          if (flag) {
            res.data.forEach(item => {
              if (ele == item.dtDate) {
                moodTable.value.push({
                  ...item
                })
              }
            })
          } else {
            moodTable.value.push({
              dtDate: ele,
              moodIndex: null,
              moodDesc: '',
            })
          }

        })

      }
      nextTick(() => {
        getMoodLineDataFn()
      })
    }
  })
}

const getMoodLineDataFn = () => {
  let data = {
    xdata: [],
    ydata: [[]],
    legendDataList: ['我的曲线'],
    moodMsList: []
  }
  moodTable.value.forEach(item => {
    data.xdata.push(item.dtDate)
    data.ydata[0].push(item.moodIndex)
    data.moodMsList.push(item.moodDesc)
  });
  lineChartData.value = data
  isEcharts.value = true
}

// 保存心情
const handleSave = () => {
  let params = {
    sprintId: curSprintId.value,
    moodList: moodTable.value
  }
  saveMood(params).then(res => {
    if (res.success) {
      isEdit.value = false
      ElMessage.success(res.msg || '已在当前迭代保存成功')
      getMoodDataFn() // 刷新
      getTeamStaticsDataFn()
      getTeamMoodDataFn()
    }
  })
}

// 获取团队统计数据
const getTeamStaticsDataFn = () => {
  getTeamStaticsData(curSprintId.value).then(res => {
    if (res.success) {
      teamStaticsData.value = res.data
    }
  })
}

// 获取团队心情数据
const getTeamMoodDataFn = () => {
  let params = {
    sprintId: curSprintId.value,
    type: '1'
  }
  getTeamMoodData(params).then(res => {
    if (res.success) {
      lineChartTeamData.value.fillTimeList = res.data.fillTimeList
      lineChartTeamData.value.modifyTimeList = res.data.modifyTimeList
      lineChartTeamData.value.moodMsList = res.data.moodMsList
      lineChartTeamData.value.legendDataList = res.data.legendDataList
      lineChartTeamData.value.xdata = res.data.xData
      lineChartTeamData.value.ydata = res.data.yData
      isTeamEcharts.value = true
    }
  })
}

onBeforeMount(() => {
  // console.log(route, '--ere')
  // let data = {
  //     xdata: [],
  //     ydata: [[]],
  //     legendDataList: ['我的曲线']
  // }
  // moodTable.value.forEach(item => {
  //     data.xdata.push(item.dtDate)
  //     data.ydata[0].push(item.moodIndex)
  // });
  // lineChartData.value = data
  // console.log(lineChartData.value, '--lineChartData')
  // lineChartTeamData.value = {
  //     xdata: data.xdata,
  //     ydata: [[1, -1, 1, 3, 2, -3, -5],
  //     [1, -1, 0, 3, -2, -3, 0],
  //     [3, 1, 0, -3, -2, 3, 5],
  //     [2, -1, 0, 3, 1, 2, 0],
  //     [0, -1, -4, -3, 2, 3, 4],
  //     [1, 2, 3, 4, 5, 3, 1]],
  //     legendDataList: ['刘梦如', '赵如月', '罗婷', '吕艳鹏', '高健', '王林']
  // }
  // isEcharts.value = true


  curSprintId.value = route.query.id
  sprintStatus.value = route.query.status
  getCycleFn()
  getTeamStaticsDataFn()
  getTeamMoodDataFn()

})

</script>
<style lang="scss" scoped>
.page-detail {
  padding: 20px;

  .title-1 {
    margin: 20px 0;
  }

  .base-content {
    column-gap: 20px;

    .content-left {
      width: 550px;
      padding: 20px;
      height: calc(100vh - 215px);
      border-radius: 10px;

      .btn-content {
        .btn-submit {
          height: 28px;
          line-height: 28px;
          font-size: 13px;
          width: 60px;
          user-select: none;
        }

        .btn-cancel {
          height: 28px;
          line-height: 28px;
          font-size: 13px;
          width: 60px;
          user-select: none;
        }

        .btn-disabled {
          background-color: #DDD;
          color: #5C5C5C;
          cursor: default;
        }
      }

      :deep(.el-input) {
        --el-input-height: 28px;
        --el-input-border-color: #DBDDE3;
        --el-input-border-radius: 4px;
        --el-input-padding-left: 10px;
        --el-input-padding-right: 10px;
      }
    }

    .content-right {
      padding: 20px;
      width: calc(100% - 580px);
      height: calc(100vh - 215px);
      overflow-y: auto;
      border-radius: 10px;

      .title-3 {
        margin-top: 20px;
      }

      .chart-content {
        width: 100%;
        height: calc(100% - 200px);
        background-color: #fff;
        border-radius: 8px;
        margin-top: 20px;
      }
    }
  }

  .teammood-content {
    padding: 20px;
    height: calc(100vh - 215px);
    border-radius: 10px;

    .team-card {
      // margin-bottom: 20px;
      border-radius: 8px;
      background: #fff;
      padding: 20px;

      .team-card-name {
        margin-bottom: 15px;
      }

      .team-card-main {
        flex-wrap: wrap;
        gap: 20px;
      }

      .info-item {
        width: fit-content;
        color: #1d1d1d;

        .info-label {
          font-weight: 600;
        }
      }

      .info-tip {
        background: #cee1ff63;
      }

      .chart-content {
        margin-top: 10px;
        height: 500px;
      }
    }
  }

  .dia-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 15px 10px;

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

  .dia-footer {
    // margin-top: 30px;
    .btn-cancel {
      margin-right: 12px;
    }

    .btn-submit-fix{
      width: 92px;
    }

    .mr12{
      margin-right: 12px;
    }
  }
}
</style>