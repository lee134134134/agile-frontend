<template>
  <div class="page-container">
    <el-form :inline="true" class="date-form">
      <el-form-item label="统计日期">
        <el-date-picker v-model="searchDate" :clearable="true" :disabled-date="disabledPastDate" :teleported="false"
                        clearable="false"
                        end-placeholder="结束日期" format="YYYY-MM-DD" range-separator="——"
                        start-placeholder="开始日期"
                        type="daterange" unlink-panels value-format="YYYY-MM-DD"
                        @change="getList"></el-date-picker>
      </el-form-item>
    </el-form>
  </div>
  <div class="page-container fix-height">
    <div class="card-header jus-start-center">
      <div class="title-icon"></div>
      <div class="title-1">任务统计</div>
    </div>
    <div class="card-container">
      <el-form>
        <el-row :gutter='24'>
          <el-col :span="6">
            <el-form-item label="项目">
              <el-select v-model="searchData.projectCode" clearable placeholder="项目"
                         @change="getStatisticsList">
                <el-option v-for="item in projectList" :key="item.code" :label="item.name"
                           :value="item.code"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="岗位">
              <el-select v-model="searchData.position" clearable placeholder="岗位" @change="getStatisticsList">
                <el-option v-for="item in workList1" :key="item.code" :label="item.name"
                           :value="item.code"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="负责人">
              <el-select v-model="searchData.assigneeAccount" clearable placeholder="负责人"
                         @change="getStatisticsList">
                <el-option v-for="item in chargeList1" :key="item.code" :label="item.name"
                           :value="item.code"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table v-loading="tableLoading1" :data="tableData" :header-cell-style="TableRowStyleFixed"
                :summary-method="getSummaries"
                fit
                max-height="400px" scrollbar-always-on show-summary stripe>
        <el-table-column align="center" label="负责人" min-width="120" prop="assigneeName">
          <template #default="scope">
            <span>{{ scope.row.assigneeName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="岗位" min-width="150" prop="positionName">
          <template #default="scope">
            <span>{{ scope.row.positionName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="项目名称" min-width="180" prop="projectName"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="需求名称" min-width="200" prop="requirementTitle"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="用户故事" min-width="180" prop="storyTitle"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="任务总数" min-width="100" prop="taskTotal"></el-table-column>
        <el-table-column align="center" label="总预估工时" min-width="120" prop="totalEstimatedHours"></el-table-column>
        <el-table-column align="center" label="完成任务数" min-width="120" prop="taskFinished"></el-table-column>
      </el-table>
    </div>
    <div :class="{'fix-h':tableData.length < 1}" class="card-container" style="margin-top:20px">
      <BarLineChart v-if="chartData && tableData.length > 1" :data="chartData"/>
      <div class="empty-text-tip">暂无数据</div>
    </div>
    <div class="card-header jus-start-center">
      <div class="title-icon"></div>
      <div class="title-1">任务详情</div>
    </div>
    <div class="card-container">
      <el-form>
        <el-row :gutter='24'>
          <el-col :span="3">
            <el-form-item label="岗位">
              <el-select v-model="searchInfoData.position" clearable placeholder="岗位"
                         @change="getTaskInfoList">
                <el-option v-for="item in workList2" :key="item.code" :label="item.name"
                           :value="item.code"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="负责人">
              <el-select v-model="searchInfoData.assigneeAccount" clearable placeholder="负责人"
                         @change="getTaskInfoList">
                <el-option v-for="item in chargeList2" :key="item.code" :label="item.name"
                           :value="item.code"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table v-loading="tableLoading2" :data="detailTabelData" :header-cell-style="TableRowStyleFixed" fit
                max-height="400px"
                scrollbar-always-on stripe>
        <el-table-column align="center" label="负责人" min-width="120" prop="assigneeName">
          <template #default="scope">
            <span>{{ scope.row.assigneeName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="岗位" min-width="150" prop="positionName">
          <template #default="scope">
            <span>{{ scope.row.positionName || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="项目名称" min-width="180" prop="projectName"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="需求名称" min-width="200" prop="requirementTitle"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="所属迭代" min-width="200" prop="sprintName"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="用户故事" min-width="180" prop="storyTitle"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="任务名称" min-width="180" prop="taskName"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="任务类型" min-width="150" prop="taskTypeName"></el-table-column>
        <el-table-column align="center" label="预估工时" min-width="100" prop="estimatedHours"></el-table-column>
        <el-table-column align="center" label="任务状态" min-width="150" prop="taskStatusName"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script setup>
import {onBeforeMount, reactive, ref} from 'vue';
import {TableRowStyleFixed} from '@/utils';
import {ElMessage} from 'element-plus';
import BarLineChart from './components/BarLineChart.vue'
import {$boforeOneDay} from '@/utils/date.js';
import {personTaskReportDetail, personTaskReportList} from '@/api/statisticsManagementApi';
import {useDicStore} from '@/stores/dic.js';

const dicStore = useDicStore()
const searchDate = ref([$boforeOneDay, $boforeOneDay])
const searchData = reactive({
  projectCode: '',
  position: '',
  assigneeAccount: ''
})
const searchInfoData = reactive({
  position: '',
  assigneeAccount: ''
})
const projectList = ref([])
const chargeList1 = ref([])
const workList1 = ref([])
const tableData = ref([])
const chargeList2 = ref([])
const workList2 = ref([])
const tableLoading1 = ref(false)
const detailTabelData = ref([])
const tableLoading2 = ref(false)
const chartData = ref(null)

function disabledPastDate(time) {
  return time.getTime() > Date.now();
}

function getList() {
  if (searchDate.value && searchDate.value.length > 0) {
    getStatisticsList(1)
    getTaskInfoList(1)
  } else {
    ElMessage.warning('请选择统计日期！')
  }

}

//任务统计查询
function getStatisticsList(type) {
  let params = {
    startDate: searchDate.value && searchDate.value.length > 0 ? searchDate.value[0] : '',
    endDate: searchDate.value && searchDate.value.length > 0 ? searchDate.value[1] : '',
    projectCode: searchData.projectCode,
    position: searchData.position,
    assigneeAccount: searchData.assigneeAccount,
  }
  tableLoading1.value = true
  chartData.value = null
  personTaskReportList(params).then(res => {
    tableLoading1.value = false
    if (res.success) {
      if (res.data.list.length > 0) {
        let fzrList = []
        let gwList = []
        let xmList = []
        chargeList1.value = []
        workList1.value = []
        projectList.value = []
        res.data.list.forEach(item => {
          if (item.assigneeAccount) {
            fzrList.push({
              'name': item.assigneeName,
              'code': item.assigneeAccount,
            })
          }
          if (item.position) {
            gwList.push({
              'name': item.positionName,
              'code': item.position,
            })

          }
          if (item.projectCode) {
            xmList.push({
              'name': item.projectName,
              'code': item.projectCode,
            })

          }
        })
        chargeList1.value = [...new Set(fzrList.map(JSON.stringify))].map(JSON.parse)
        workList1.value = [...new Set(gwList.map(JSON.stringify))].map(JSON.parse)
        projectList.value = [...new Set(xmList.map(JSON.stringify))].map(JSON.parse)
      }
      tableData.value = res?.data?.list ?? []
      chartData.value = res?.data?.chartData ?? {}
      if(tableData.value.length < 1){
        chargeList1.value = []
        workList1.value = []
        projectList.value = []
      }
    } else {
      chargeList1.value = []
      workList1.value = []
      projectList.value = []
      tableData.value = []
    }
  })

}

//任务详情查询
function getTaskInfoList(type) {
  let params = {
    startDate: searchDate.value && searchDate.value.length > 0 ? searchDate.value[0] : '',
    endDate: searchDate.value && searchDate.value.length > 0 ? searchDate.value[1] : '',
    position: searchInfoData.position,
    assigneeAccount: searchInfoData.assigneeAccount,
  }

  tableLoading2.value = true
  personTaskReportDetail(params).then(res => {
    tableLoading2.value = false
    if (res.success) {
      if (type == 1 && res.data.length > 0) {
        chargeList2.value = []
        workList2.value = []
        let gwList = []
        let fzrList = []
        res.data.forEach(item => {
          if (item.assigneeAccount) {
            fzrList.push({
              'name': item.assigneeName,
              'code': item.assigneeAccount,
            })
          }
          if (item.position) {
            gwList.push({
              'name': item.positionName,
              'code': item.position,
            })

          }
        })
        chargeList2.value = [...new Set(fzrList.map(JSON.stringify))].map(JSON.parse)
        workList2.value = [...new Set(gwList.map(JSON.stringify))].map(JSON.parse)
      }
      detailTabelData.value = res?.data ?? []
    } else {
      detailTabelData.value = []
    }
  })
}

// 自定义合计逻辑
const getSummaries = (param) => {
  const {columns, data} = param
  const sums = []

  columns.forEach((column, index) => {
    // 1. 第一列显示 "合计"
    if (index === 0) {
      sums[index] = '合计'
      return
    }

    // ---------------------------------------------------------
    // 2. 【核心代码】在这里拦截不需要求和的字段
    // 如果当前列的 prop 是 'positionName'，直接赋空值或 '--'
    // ---------------------------------------------------------
    if (column.property === 'positionName') {
      sums[index] = ''
      return
    }

    // 3. 其他列的默认求和逻辑 (Element Plus 官方文档的默认写法)
    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => Number.isNaN(value))) {
      sums[index] = values.reduce((prev, curr) => {
        const value = Number(curr)
        if (!Number.isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)
    } else {
      sums[index] = '' // 非数值列显示为空
    }
  })
  return sums
}

onBeforeMount(() => {
  getList()
})
</script>
<style lang="scss" scoped>
.page-container {
  padding: 0 20px;

  &.fix-height {
    height: calc(100vh - 190px);
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }

  :deep(.el-form-item__label) {
    font-size: 12px !important;
    color: #666666;
    font-weight: 400;
  }

  .card-header {
    margin: 20px 0;
  }

  .date-form {
    padding: 12px 16px;
    background: #fff;

    :deep(.el-form-item) {
      margin-bottom: 0px !important;
    }

    :deep(.el-date-editor) {
      height: 32px;
      line-height: 32px;
      --el-input-border-radius: 4px !important;
      --el-input-border-color: #e2e4e8 !important;
    }
  }


  :deep(.el-textarea__inner) {
    min-height: 73px !important;
    max-height: 200px !important;
    border-radius: 4px !important;
    --el-input-border-color: #e2e4e8 !important;
  }

  :deep(.el-input) {
    height: 32px;
    line-height: 32px;
    --el-input-border-radius: 4px !important;
    --el-input-border-color: #e2e4e8 !important;
  }

  :deep(.el-select__wrapper) {
    height: 28px;
    line-height: 28px;
    border-radius: 4px !important;
    --el-input-border-color: #e2e4e8 !important;
    box-shadow: 0 0 0 1px #e2e4e8 inset !important;
  }

  .card-container {
    padding: 20px;
    background: #fff;
    border-radius: 4px;
  }

  .title-1 {
    font-size: 16px;
  }

  :deep(.el-table .el-table__cell) {
    height: 36px;
    padding: 0;
  }
}

.fix-h{
  height: 100px;
}

.empty-text-tip{
  font-size: 14px;
  color: #999;
  text-align: center;
  line-height: 80px;
}
</style>