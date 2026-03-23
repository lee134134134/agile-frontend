<template>
  <div class="main-content">
    <div class="page-search">
      <div class="jus-bet-center">
        <div class="jus-start-center">
          <div class="title-1">测试用例管理</div>
          <div class="sel-global-project">当前项目：{{ globalProjectName }} - {{ globalProjectStatus }}</div>
        </div>
        <div class="btn-list jus-start-center gap12">
          <div class="opt-btn" @click="manageElement"><img :src="manageIcon" alt="导出" class="btn-icon"/>管理元素</div>
          <div class="opt-btn" @click="viewGuide"><img :src="guideIcon" alt="导出" class="btn-icon"/>查看指南</div>
          <div class="opt-btn" @click="goDashBoard">dashboard面板</div>
        </div>
      </div>
      <div class="search-content jus-bet-start bg-color-1 border-radius-8">
        <el-form class="flex flex-content" ref="searchFormRef" :model="searchForm" label-position="left">
          <el-form-item label="标题编号" prop="title">
            <el-input v-model="searchForm.title" clearable placeholder="请输入用例编号或标题"
                      style="width: 160px;"></el-input>
          </el-form-item>

          <el-form-item label="迭代" prop="sprintId">
            <el-select v-model="searchForm.sprintId" clearable placeholder="全部迭代" style="width: 260px;">
              <el-option-group v-for="group in curUserProjectIterationList" :key="group.state"
                               :label="group.state">
                <el-option v-for="item in group.list" :key="item.code" :label="item.name"
                           :value="item.code"/>
              </el-option-group>
            </el-select>
          </el-form-item>

          <el-form-item label="执行状态" prop="executionStatus">
            <el-select v-model="searchForm.executionStatus" clearable placeholder="全部状态"
                       style="width: 100px;">
              <el-option v-for="item in dicStore.executeStatusList" :key="item.value"
                         :label="item.name" :value="item.value"/>
            </el-select>
          </el-form-item>

          <el-form-item label="测试结果" prop="testResult">
            <el-select v-model="searchForm.testResult" clearable placeholder="全部结果"
                       style="width: 100px;">
              <el-option v-for="item in dicStore.testResultList" :key="item.value"
                         :label="item.name" :value="item.value"/>
            </el-select>
          </el-form-item>

          <div style="display: flex; align-items: center;">
            <el-form-item :style="{ marginRight: searchForm.isAuto ? '24px' : '0' }" label="是否自动化" prop="isAuto">
              <el-radio-group v-model="searchForm.isAuto">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <template v-if="searchForm.isAuto">
              <el-form-item label="" prop="type" style="margin-right: 24px;width: 100px;">
                <el-select v-model="searchForm.type" clearable placeholder="用例类型"
                           style="width: 260px;">
                  <el-option v-for="item in dicStore.autoCaseTypeList" :key="item.value"
                             :label="item.name" :value="item.value"/>
                </el-select>
              </el-form-item>
              <el-form-item label="" prop="tags" style="margin-right: 0;width: 200px;">
                <el-input v-model="searchForm.tags" clearable maxlength="20" placeholder="请输入标签"
                          style="width: 260px;"></el-input>
              </el-form-item>
            </template>
            <div style="display: flex; gap: 12px; margin-left: 16px;">
              <div class="btn-primary" @click="handleSerach">
                <el-icon class="mr-3">
                  <Search/>
                </el-icon>
                筛选
              </div>
              <div class="btn-circle btn-circle-fix" @click="handleReset">
                <el-icon class="mr-3">
                  <RefreshLeft/>
                </el-icon>
                重置
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>

    <div class="page-table">
      <div class="option-content jus-bet-center mb12">
        <div class="option-left jus-start-center gap12">
          <div v-if="canEditCase" class="opt-btn opt-btn-mini opt-btn-mini-gray" @click="operModifyStatusDialog"><img
              :src="fixIcon" alt="导出" class="btn-icon"/>批量修改执行信息
          </div>
          <div class="opt-btn opt-btn-mini opt-btn-mini-gray" @click="handleBatchExecute"><img :src="fixIcon" alt="导出"
                                                                                               class="btn-icon"/>批量立即执行
          </div>
          <div v-if="canAddCase" class="opt-btn opt-btn-mini" @click="operaAddDialog()"><img :src="addIcon" alt="添加"
                                                                                             class="btn-icon"/>添加测试用例
          </div>
          <el-upload :auto-upload="false" :before-upload="beforeFileUpload" :show-file-list="false" action="#"
                     multiple @change="uploadFileChange">
            <div v-if="canAddCase" class="opt-btn opt-btn-mini"><img :src="importIcon" alt="导出" class="btn-icon"/>导入测试用例
            </div>
          </el-upload>
          <div v-if="canEditCase" class="opt-btn opt-btn-mini" @click="handleExport"><img :src="exportIcon" alt="导出"
                                                                                          class="btn-icon"/>导出测试用例
          </div>
        </div>
      </div>

      <el-table v-loading="loading" :data="tableData" :header-cell-style="TableRowStyleFixed"
                :style="{ 'width': '100%' }" fit
                height="calc(100vh - 390px)" scrollbar-always-on
                stripe @select="handleSelect" @select-all="handleSelect">
        <el-table-column fixed type="selection" width="50"/>
        <el-table-column v-for="(item, index) in tableColums.filter(item => item.isSelect == true)"
                         :key="item.prop + index" :fixed="item.prop == 'title' ? 'left' : item.prop == 'isAutomated' ? 'right' : false" :label="item.label"
                         :min-width="item.width" :width="fixedWidthColumns.includes(item.prop) ? item.width: ''"
                         align="left">
          <template #default="{ row, column, $index }">

            <el-text v-if="item.prop == 'title'"
                     style="color:#2173f7;text-decoration: underline;cursor: pointer;"
                     truncated
                     @click="handleEditFn(row, 'view')">{{ row[`${item.prop}`] }}
            </el-text>

            <el-select v-else-if="item.prop == 'editStatus'" v-model="row[`${item.prop}`]" :disabled="!canEditCase"
                       filterable placeholder="请选择" size="small" @change="handleChangeEditStatus($event, row)">
              <el-option v-for="item in dicStore.editStatusList" :key="item.value" :label="item.name"
                         :value="item.value"/>
            </el-select>
            <el-select v-else-if="item.prop == 'executionStatus'" v-model="row[`${item.prop}`]"
                       :disabled="!canEditCase" size="small" filterable placeholder="请选择"
                       @change="handleChangeExeStatus($event, row)">
              <el-option v-for="item in dicStore.executeStatusList" :key="item.value" :label="item.name"
                         :value="item.value"/>
            </el-select>
            <el-select v-else-if="item.prop == 'testResult'" v-model="row[`${item.prop}`]" :disabled="!canEditCase"
                       filterable placeholder="请选择" size="small" @change="handleChangeTestResult($event, row)">
              <el-option v-for="item in dicStore.testResultList" :key="item.value" :label="item.name"
                         :value="item.value"/>
            </el-select>
            <el-select v-else-if="item.prop == 'priority'" v-model="row[`${item.prop}`]" :disabled="!canEditCase"
                       filterable placeholder="请选择" size="small" @change="handleChangePriority($event, row)">
              <el-option v-for="item in dicStore.priorityList" :key="item.value" :label="item.name"
                         :value="item.value"/>
            </el-select>

            <div v-else-if="item.prop == 'isAutomated'" class="jus-start-center gap16">
              <span>{{ row[`${item.prop}`] ? '是' : '否' }}</span>
              <div v-if="row[`${item.prop}`]" class="auto-icon-box jus-start-center">
                <img alt="" src="../../assets/images/testCase/edit.png" title='编辑'
                     @click="handleOpenAutoCaseDia(row)">
                <img alt="" src="../../assets/images/testCase/clear.png" title='清除'
                     @click="handleClearCase(row)">
                <div class="execute-box jus-start-center">
                  <img v-if="row.execStatus != 'pending' && row.execStatus != 'queued' && row.execStatus != 'running'"
                       alt=""
                       src="../../assets/images/testCase/execute.png" title='立即执行' @click="handleExecute(row)">
                  <img v-else alt="" class="rotate-loading"
                       src="../../assets/images/testCase/loading.png" title='用例执行中'>
                  <img v-show="row.execStatus == 'passed'" alt="" src="../../assets/images/testCase/success.png"
                       title='最后一次执行详情' @click="getAutoRes(row)">
                  <img v-show="row.execStatus == 'failed'" alt="" src="../../assets/images/testCase/fail.png"
                       title="最后一次执行详情" @click="getAutoRes(row)">
                </div>
                <img v-if="row.execStatus" alt="" src="../../assets/images/testCase/history.png" title="历史执行记录"
                     @click="handleOpenAutoHistoryDia(row)">
              </div>
            </div>

            <el-text v-else truncated>
              {{ row[`${item.prop}`] !== null && row[`${item.prop}`] !== '' ? row[`${item.prop}`] : '-' }}
            </el-text>

          </template>
        </el-table-column>

        <el-table-column align="center" fixed="right" label="操作" width="100">
          <template #default="scope">
            <el-button :class="{ 'disabled-btn': !canEditCase }" :disabled="!canEditCase"
                       class="btn-text-primary text-btn"
                       type="text" @click="handleEditFn(scope.row, 'edit')">
              <el-tooltip content="编辑" effect="light" popper-class="fix-tooltip" placement="top">
                <img :src="editIcon" alt="编辑" class="table-icon"/>
              </el-tooltip>
            </el-button>
            <el-button :class="{ 'disabled-btn': !canDeleteCase }" :disabled="!canDeleteCase"
                       class="btn-text-danger text-btn"
                       type="text" @click="handleDelete(scope.row)">
              <el-tooltip content="删除" effect="light" popper-class="fix-tooltip" placement="top">
                <img :src="deleteIcon" alt="删除" class="table-icon"/>
              </el-tooltip>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="paginationg-box">
        <pagination :currentPage="searchForm.current" :pageSize="searchForm.size" :total="total"
                    @currentPageCurrent="currentPageCurrent" @currentPageSize="currentPageSize">
        </pagination>
      </div>
    </div>

    <AddCase v-if="isOperateAddDia" :isShow="isOperateAddDia" @closeDiaFn="handleCloseAddDia"
             @confirmFn="handleAddCase"/>
    <EditCase v-if="isOperateEditDia" :detailInfo="detailInfo" :isShow="isOperateEditDia" :type="operateType"
              @closeDiaFn="handleCloseEditDia" @editConfirmFn="handleEditCase"/>
    <ModifyStatus v-if="isShowModifyDia" isShow="isShowModifyDia" @closeDiaFn="handleCloseModifyDia"
                  @confirmFn="handleConfirmModify"/>

    <!-- 自动化测试用例编辑 -->
    <EditAutoCase v-if="isShowAutoCaseDia" :detailInfo="autoCaseInfo" :isShow="isShowAutoCaseDia"
                  @closeDiaFn="handleCloseAutoCaseDia" @confirmFn="handleSaveAutoCase"
                  @refreshFn="handleAutoCaseRefresh"/>
    <!-- 自动化测试历史执行记录 -->
    <AutoHistory v-if="isShowAutoHistoryDia" :historyList="historyList" :isShow="isShowAutoHistoryDia"
                 @closeDiaFn="handleCloseAutoHistoryDia"/>
    <!-- 测试用例执行结果弹窗 -->
    <!-- <ExecuteResult v-if="isShowResultDia" :isShow="isShowResultDia" @closeDiaFn="handleCloseResultDia" :resultInfo="resultInfo" /> -->
    <!-- 管理元素弹窗 -->
    <ManageElement v-if="isShowManageEleDia" :isShow="isShowManageEleDia" @closeDiaFn="handleCloseManageEle"/>
    <!-- dashboard弹窗 -->
    <DashboardDia v-if="isShowDashboardDia" :isShow="isShowDashboardDia" type="dashboard"
                  @closeDiaFn="closeDashboardDia" @confirmFn="handleConfirmGenerate"/>
    <RptSelectRangeDia v-if="isShowSelectedRange" :detailInfo="dashboardRptRangeData" :isShow="isShowSelectedRange"
                       :tip="tipText" type="dashboard" @cancelFn="handleCancelLaunchRpt"
                       @closeDiaFn="closeSelectedRangeDia"
                       @confirmFn="handleViewRpt"/>
  </div>
</template>

<script setup>
import {onBeforeMount, onMounted, reactive, ref, watch} from 'vue';
import {getDicDefaultVal, TableRowStyleFixed} from '@/utils';
import pagination from '@/components/pagination.vue';
import AddCase from './components/AddCase.vue';
import EditCase from './components/EditCase.vue';
import ModifyStatus from './components/ModifyStatus.vue';
import EditAutoCase from './components/EditAutoCase.vue';
import AutoHistory from './components/AutoHistory.vue';
import ManageElement from './components/ManageElement.vue';
import DashboardDia from '../DefectManagement/components/LaunchRptDia.vue';
import RptSelectRangeDia from '../DefectManagement/components/RptSelectRangeDia.vue';
import {
  addTestCase,
  ChangeCaseStatus,
  clearAutoCase,
  deleteTestCase,
  editTestCase,
  executeAutoCase,
  exportTestCase,
  getAutoCaseHistory,
  getAutoCaseInfo,
  getDashboardRpt,
  getExeAutoCaseResult,
  getSign,
  getTestCaseList,
  importTestCase,
  releaseResource,
  submitDashboardRpt,
  updateAutoCase
} from '@/api/testCaseApi';
import {
  getAllUserList,
  getDicList,
  getProjectModuleList,
  getUserProjectIterationList,
  getUserProjectList
} from '@/api/api';
import {useDicStore} from '@/stores/dic.js';
import {btnAuthFileter} from "@/utils/index.js";
import {ElMessage, ElMessageBox} from 'element-plus';
import {getAutoCaseResultText} from '@/utils/autocaseResult.js'
import addIcon from "@/assets/webp/add.webp";
import exportIcon from "@/assets/webp/export.webp";
import importIcon from "@/assets/webp/import.webp";
import manageIcon from "@/assets/images/ui/manage.png";
import fixIcon from "@/assets/images/ui/fix.png";
import guideIcon from "@/assets/images/ui/guide.png";
import editIcon from "@/assets/webp/edit.webp";
import deleteIcon from "@/assets/webp/delete.webp";

const dicStore = useDicStore()

const loading = ref(false)
const searchFormRef = ref(null)
const searchForm = reactive({
  title: '',
  projectCode: '',
  projectModuleCode: '',
  sprintId: '',
  executionStatus: undefined,
  size: 10,
  current: 1,
  // status: '1',
  isAuto: false,
  type: undefined,
  tags: undefined,
  testResult: undefined,
})
const projectList = ref([
  {projectId: '1', name: '项目一选项'},
  {projectId: '2', name: '项目二'},
  {projectId: '3', name: '项目三'},
])

const defaultProps = ref({
  children: 'children',
  label: 'name',
  value: 'moduleCode',
  // multiple: true,
  emitPath: false,
  checkStrictly: true,
})

const projectModuleList = ref()
const curUserProjectIterationList = ref([])

const tableColums = ref([
  {
    label: '标题',
    prop: 'title',
    isSelect: true,
    width: '400',
    showTooltip: true,
  },
  {
    label: '所属项目',
    prop: 'projectName',
    isSelect: true,
    width: '150',
    showTooltip: true
  },
  {
    label: '所属模块',
    prop: 'projectModuleName',
    isSelect: true,
    width: '150',
    showTooltip: true
  },
  {
    label: '所属迭代',
    prop: 'sprintName',
    isSelect: true,
    width: '150',
    showTooltip: true
  },
  {
    label: '用户故事',
    prop: 'storyTitle',
    isSelect: true,
    width: '100',
    showTooltip: true
  },
  {
    label: '编辑状态',
    prop: 'editStatus',
    isSelect: true,
    width: '100',
    showTooltip: true
  },
  {
    label: '执行状态',
    prop: 'executionStatus',
    isSelect: true,
    width: '100',
    showTooltip: true
  },
  {
    label: '测试结果',
    prop: 'testResult',
    isSelect: true,
    width: '100',
    showTooltip: true
  },
  {
    label: '优先级',
    prop: 'priority',
    isSelect: true,
    width: '100',
    showTooltip: true
  },
  {
    label: '是否自动化',
    prop: 'isAutomated',
    isSelect: true,
    width: '180',
    showTooltip: true
  },
])
const total = ref(100)
// 固定宽度的列
const fixedWidthColumns = ref(['title', 'editStatus', 'executionStatus', 'testResult', 'priority'])
const tableData = ref([])
const isOperateAddDia = ref(false)
const isOperateEditDia = ref(false)
const operateType = ref('')
const detailInfo = ref(null)
const isShowModifyDia = ref(false)
const selectedList = ref([])
const autoCaseInfo = ref()
const isShowAutoCaseDia = ref(false)
const isShowAutoHistoryDia = ref(false)
const historyList = ref([])
const isShowResultDia = ref(false)
const resultInfo = ref({
  name: '执行名称信息',
  startTime: '2025-12-08 13:12:27',
  endTime: '2025-12-24 09:12:27',
  status: '成功',
  resultText: 'STDOUT',
  reportFile: '',
  logFile: '',
}) // 执行结果信息
const batchCaseList = ref([]) // 当前正在执行的：批量执行的自动化用例
const singleCaseList = ref([]) // 当前正在执行的：单条执行的自动化用例
let timer // 获取自动化测试执行结果的定时器
let isFirst = ref(true)
let resPopText = ref('')

let isShowManageEleDia = ref(false) // 管理元素弹窗

const isShowDashboardDia = ref(false)
const isShowSelectedRange = ref(false) // dashboard报告生成范围弹窗
const dashboardRptRangeData = ref() // 生成dashboard报告数据对象
const tipText = ref('')
const dashboardTaskId = ref('')
let timerDashboardRpt
const globalProjectName = ref(localStorage.getItem('global_ProjectName'))
const globalProjectStatus = ref(localStorage.getItem('global_ProjectStatus'))


const canAddCase = ref() // 添加用例权限
const canEditCase = ref() // 编辑用例权限
const canImportCase = ref() // 导入用例权限
const canExportCase = ref() // 导出用例权限
const canDeleteCase = ref() // 删除用例权限
canAddCase.value = btnAuthFileter('test_case_add')
canEditCase.value = btnAuthFileter('test_case_edit')
canImportCase.value = btnAuthFileter('test_case_import')
canExportCase.value = btnAuthFileter('test_case_export')
canDeleteCase.value = btnAuthFileter('test_case_delete')


// 管理元素
const manageElement = () => {
  isShowManageEleDia.value = true
}

const handleCloseManageEle = () => {
  isShowManageEleDia.value = false
}

// 查看指南
const viewGuide = () => {
  window.open('http://10.6.250.79:9000/static/docs/RobotFrameworkUserGuide.html#getting-started', '_blank')
}

// 面板
const goDashBoard = () => {
  isShowDashboardDia.value = true
}

const closeDashboardDia = () => {
  isShowDashboardDia.value = false
}

const handleConfirmGenerate = (form, selectedInfo) => {
  // console.log('form==12==', form)
  dashboardRptRangeData.value = selectedInfo
  // 调用提交报告接口
  submitDashboardRpt(form).then(res => {
    if (res.success) {
      dashboardTaskId.value = res.data
      closeDashboardDia()
      isShowSelectedRange.value = true
      getDashboardRptFn()
    }
  })
}

const getDashboardRptFn = () => {
  getDashboardRpt(dashboardTaskId.value).then(res => {
    dashboardRptRangeData.value.filePath = ''
    if (res.success) {
      if (res.data) {
        dashboardRptRangeData.value.filePath = res.data
        clearInterval(timerDashboardRpt)
      } else {
        timerDashboardRpt = setInterval(() => {
          getDashboardRptFn()
        }, 3000)
      }
    }
  })
}

// 关闭已选报告生成范围弹窗
const closeSelectedRangeDia = () => {
  isShowSelectedRange.value = false

}

// 查看dashboard报告
const handleViewRpt = (info) => {
  window.open(info.filePath, '_blank')
}


const operaAddDialog = () => {
  isOperateAddDia.value = true
}

const handleCloseAddDia = () => {
  isOperateAddDia.value = false
}

// 新增测试用例
const handleAddCase = (form) => {
  addTestCase(form).then(res => {
    if (res.success) {
      handleCloseAddDia()
      getList()
    }
  })
}

const handleEditFn = (row, type) => {
  // 调用接口查详情
  if (type == 'edit') {
    operateType.value = '编辑'
  } else {
    operateType.value = '查看'
  }

  detailInfo.value = row
  isOperateEditDia.value = true
}

// 编辑测试用例
const handleEditCase = (form) => {
  editTestCase(form).then(res => {
    if (res.success) {
      handleCloseEditDia()
      getList()
    }
  })
}


const handleCloseEditDia = () => {
  isOperateEditDia.value = false
}

const handleDelete = (row) => {
  ElMessageBox.confirm('该用例将实时移除，请确认是否删除', '', {
    cancelButtonText: '取消',
    confirmButtonText: '确认',
    center: false,
    closeOnClickModal: false,
    autofocus: false,
    type: 'warning',
  }).then(() => {
    let params = {
      caseCode: row.caseCode,
    }
    deleteTestCase(params).then(res => {
      if (res.success) {
        //   ElMessage.success('删除成功')
        getList()
      } else {
        //   ElMessage.error(res.msg)
      }
    })
  }).catch(() => {
    console.log('已取消')
  })
}

const handleReset = () => {
  searchFormRef.value.resetFields();
  searchForm.current = 1;
  getList()
};

// 修改编辑状态
const handleChangeEditStatus = (event, row) => {
  let params = {
    testCaseIds: [row.caseCode],
    editStatus: event || '',
  }
  handleChangeStatus(params)
}

// 修改执行状态
const handleChangeExeStatus = (event, row) => {
  let params = {
    testCaseIds: [row.caseCode],
    executionStatus: event || '',
  }
  handleChangeStatus(params)
}

// 修改测试结果
const handleChangeTestResult = (event, row) => {
  let params = {
    testCaseIds: [row.caseCode],
    testResult: event || '',
  }
  handleChangeStatus(params)
}

// 修改优先级
const handleChangePriority = (event, row) => {
  let params = {
    testCaseIds: [row.caseCode],
    priority: event || '',
  }
  handleChangeStatus(params)
}

const handleChangeStatus = (params) => {
  ChangeCaseStatus(params).then(res => {
    if (res.success) {
      handleCloseModifyDia()
      getList()
      // 清空选中状态
      selectedList.value = []
    }
  })
}

// 批量修改执行信息
const handleConfirmModify = (form) => {
  let caseCodes = []
  selectedList.value.forEach(item => {
    caseCodes.push(item.caseCode)
  })
  let params = {
    testCaseIds: caseCodes,
    executionStatus: form.executionStatus || undefined,
    testResult: form.testResult || undefined,
  }
  handleChangeStatus(params)
}

const handleSelect = (selection) => {
  selectedList.value = selection
}

const operModifyStatusDialog = () => {
  if (selectedList.value.length == 0) {
    ElMessage.warning('请选择要修改的测试用例')
    return
  }
  isShowModifyDia.value = true
}
const handleCloseModifyDia = () => {
  isShowModifyDia.value = false
}

// 打开自动化测试用例编辑弹窗
const handleOpenAutoCaseDia = (row) => {
  // console.log('row==', row)
  getAutoCaseInfo(row.autoCaseId).then(res => {
    if (res.success) {
      autoCaseInfo.value = res.data
    }
  })
  isShowAutoCaseDia.value = true

}

// 刷新自动化测试用例信息
const handleAutoCaseRefresh = (row) => {
  getAutoCaseInfo(row.id).then(res => {
    if (res.success) {
      autoCaseInfo.value = res.data
    }
  })
}

// 关闭自动化测试用例编辑弹窗
const handleCloseAutoCaseDia = (id) => {
  isShowAutoCaseDia.value = false
  // 释放资源
  let params = {
    autoCaseId: id
  }
  releaseResource(params).then(res => {

  })
}

// 自动化测试用例保存
const handleSaveAutoCase = (form) => {
  let params = {
    id: form.id,
    projectCode: form.projectCode,
    content: form.content,
  }
  updateAutoCase(params).then(res => {
    if (res.success) {
      if (res.data) {
        isShowAutoCaseDia.value = false
        getList()
      } else {
        // 手动确认保存
        ElMessageBox.confirm('该自动化用例尚未检查，请确认是否保存', '', {
          cancelButtonText: '取消',
          confirmButtonText: '确认',
          center: false,
          closeOnClickModal: false,
          autofocus: false,
          type: 'warning',
        }).then(() => {
          handleConfirmSaveFn(params)
        }).catch(() => {
          console.log('已取消')
        })
      }
    }
  })
}

// 手动确认保存
const handleConfirmSaveFn = (params) => {
  params.confirm = true
  updateAutoCase(params).then(res => {
    if (res.data) {
      ElMessage.success('保存成功')
      isShowAutoCaseDia.value = false
      getList()
    }
  })
}


// 打开自动化测试历史执行记录
const handleOpenAutoHistoryDia = (row) => {
  let params = {
    reqPageNum: 1,
    reqPageSize: 9999,
    autoCaseId: row.autoCaseId,
    execFileFlag: true,
  }
  getAutoCaseHistory(params).then(res => {
    if (res.success) {
      historyList.value = res.data.list
    }
  })
  isShowAutoHistoryDia.value = true
}

const handleCloseAutoHistoryDia = () => {
  isShowAutoHistoryDia.value = false
}

// 打开自动化测试用例执行结果弹窗
const handleOpenResultDia = () => {
  isShowResultDia.value = true
}

const handleCloseResultDia = () => {
  isShowResultDia.value = false
}

// 清除用例信息
const handleClearCase = (row) => {
  ElMessageBox.confirm('该自动化测试用例内容即将初始化，请确认是否清除', '', {
    cancelButtonText: '取消',
    confirmButtonText: '确认',
    center: false,
    closeOnClickModal: false,
    autofocus: false,
    type: 'warning',
  }).then(() => {
    let params = {
      id: row.autoCaseId,
      projectCode: row.projectCode,
    }
    clearAutoCase(params).then(res => {
      if (res.success) {
        ElMessage.success('清除成功')
      } else {
        ElMessage.error(res.msg)
      }
    })
  }).catch(() => {
    console.log('已取消')
  })
}

// 执行自动化测试用例
const handleExecute = (row) => {
  ElMessageBox.confirm('即将触发用例运行，请确保环境与测试目标已准备完毕', '', {
    cancelButtonText: '取消',
    confirmButtonText: '确认',
    center: false,
    closeOnClickModal: false,
    autofocus: false,
    type: 'warning',
  }).then(() => {
    let params = {
      autoCaseIds: [row.autoCaseId],
      triggerType: "manual",
      batch: false
    }
    executeAutoCase(params).then(res => {
      if (res.success) {
        row.execStatus = 'pending' // 状态修改为执行中
        singleCaseList.value.push(row.autoCaseId)
      }
    })

  }).catch(() => {
    console.log('已取消')
  })
}

// 批量执行自动化测试用例
const handleBatchExecute = () => {
  if (selectedList.value.length == 0) {
    ElMessage.warning('请选择要执行的用例')
    return
  }
  console.log('selectedList.value===', selectedList.value)
  // 若选择的包含非自动化测试用例，给提示，不执行
  // let hasNoAutoCase = selectedList.value.some(item => item.isAutomated == 0)
  // if(hasNoAutoCase) {
  //     ElMessage.warning('当前选择包含非自动化测试用例，请重新选择')
  //     return
  // }

  // 若选择的包含非自动化测试用例，过滤掉，只保留自动化测试的执行
  let arr = selectedList.value.filter(item => item.isAutomated == 1)
  if (arr.length == 0) {
    ElMessage.closeAll()
    ElMessage.warning('请选择自动化测试用例')
    return
  }

  ElMessageBox.confirm('即将触发用例运行，请确保环境与测试目标已准备完毕', '', {
    cancelButtonText: '取消',
    confirmButtonText: '确认',
    center: false,
    closeOnClickModal: false,
    autofocus: false,
    type: 'warning',
  }).then(() => {
    let arrIds = []
    arr.forEach(item => {
      arrIds.push(item.autoCaseId)
    })
    let params = {
      autoCaseIds: arrIds,
      triggerType: "manual",
      batch: true
    }
    executeAutoCase(params).then(res => {
      if (res.success) {
        // 状态修改为执行中
        arr.forEach(ele => {
          tableData.value.forEach(item => {
            if (item.autoCaseId == ele.autoCaseId) {
              ele.execStatus = 'pending'
            }
          })
        });
        batchCaseList.value.push(...arrIds)
      }
    })

  }).catch(() => {
    console.log('已取消')
  })
}


// 导出测试用例
const handleExport = () => {
  let params = JSON.parse(JSON.stringify(searchForm))
  delete params.current
  delete params.size
  exportTestCase(params).then(res => {
    // if(res.code && res.code == '99999') {
    //     ElMessage.warning(res.msg)
    //     return
    // }
    // const blob = new Blob([res], {
    //   type: "application/vnd.ms-excel",
    // });
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = `测试用例${$today}.xlsx`; // 根据实际情况设置下载文件名
    // a.click();
    // window.URL.revokeObjectURL(url);
  })
}

// 校验文件
function beforeFileUpload(file) {
  if (file.name.slice(-5) !== '.xlsx' && file.name.slice(-4) !== '.xls') {
    ElMessage.error("仅支持导入excel文件!")
    return false
  }
  return true
}


// 导入测试用例
function uploadFileChange(file) {
  console.log('file===', file)
  let isValid = beforeFileUpload(file)
  if (!isValid) return
  let obj = new FormData()
  let newfile = file.raw
  newfile = new File([file.raw], `${encodeURIComponent(newfile.name)}`, {type: file.raw.type})
  newfile.uid = file.raw.uid
  obj.append("file", newfile);

  importTestCase(obj).then(res => {
    console.log('上传文件返回参数：', res)
    if (res.success) {
      getList()
    }
  })
}

const handleSerach = () => {
  searchForm.current = 1;
  getList()
};


const currentPageCurrent = (val) => {
  searchForm.current = val
  getList()
}

const currentPageSize = (val) => {
  searchForm.size = val
  searchForm.current = 1
  getList()
}

const getList = () => {
  loading.value = true
  let params = {...searchForm}
  if (params.tags) {
    params.tags = params.tags.split(',')
  } else {
    params.tags = undefined
  }
  getTestCaseList(params).then(res => {
    if (res.success) {
      tableData.value = res.data.records
      total.value = res.data.total

      // if(isFirst.value) {
      tableData.value.forEach(item => {
        if (item.isAutomated == 1 && (item.execStatus == 'pending' || item.execStatus == 'queued' || item.execStatus == 'running')) {
          if (!batchCaseList.value.includes(item.autoCaseId)) {
            batchCaseList.value.push(item.autoCaseId)
          }
        }
      })
      //     isFirst.value = false
      // }

    }
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}


const getDicListFn = (type) => {
  getDicList(type).then(res => {
    if (res.success) {
      if (type == 'CASE_EXEC_STATUS') {
        dicStore.executeStatusList = res?.data ?? []
        dicStore.defaultExecuteStatus = getDicDefaultVal(res.data)
      } else if (type == 'CASE_TYPE') {
        dicStore.caseTypeList = res?.data ?? []
      } else if (type == 'CASE_FUNCTION_POINT') {
        dicStore.functionPointList = res?.data ?? []
      } else if (type == 'PRIORITY') {
        dicStore.priorityList = res?.data ?? []
        dicStore.defaultPriority = getDicDefaultVal(res.data)
      } else if (type == 'CASE_EDIT_STATUS') {
        dicStore.editStatusList = res?.data ?? []
        dicStore.defaultEditStatus = getDicDefaultVal(res.data)
      } else if (type == 'TEST_RESULT') {
        dicStore.testResultList = res?.data ?? []
      } else if (type == 'AUTO_CASE_TYPE') {
        dicStore.autoCaseTypeList = res?.data ?? []
      } else if (type == 'AUTO_CASE_ELEMENT_SCOPE') {
        dicStore.autoEleVariScopeList = res?.data ?? []
      }
    }
  })
}

// 获取当前用户的所属项目下拉列表
const getUserProjectListFn = () => {
  getUserProjectList().then(res => {
    if (res.success) {
      dicStore.curUserProjectList = res?.data ?? []
    }
  })
}

// 获取所属项目下模块下拉列表
const getProjectModuleListFn = () => {
  let params = {
    projectCode: searchForm.projectCode || undefined
  }
  getProjectModuleList(params).then(res => {
    if (res.success) {
      projectModuleList.value = res?.data ?? []
    }
  })
}

// 获取项目下的迭代
const getProjectIterationListFn = () => {
  let params = {
    projectId: searchForm.projectCode || undefined
  }
  getUserProjectIterationList(params).then(res => {
    if (res.success) {
      curUserProjectIterationList.value = res?.data ?? []
      if (!curUserProjectIterationList.value.some(item => item.code == searchForm.sprintId)) {
        searchForm.sprintId = ''
      }
    }
  })
}

// 获取人员下拉
const getAllUserListFn = () => {
  getAllUserList().then(res => {
    if (res.success) {
      dicStore.allUserList = res?.data ?? []
    }
  })
}


// 所属项目 -->  模块 、 迭代 
watch(() => searchForm.projectCode, (newvalue, oldvalue) => {
  if (!searchForm.projectCode) {
    projectModuleList.value = []
    searchForm.projectModuleCode = ''
  } else {
    getProjectModuleListFn()
  }
  getProjectIterationListFn()
}, {deep: true})

let customStyle = {
  '--el-messagebox-width': '1000px',
  'background': 'linear-gradient(180deg, #dde7ff 0%, #f7f9fe 25%, #ffffff 100%)',
  'box-shadow': '0px 2px 15px 5px rgba(0, 0, 0, 0.1)',
  'border-radius': '8px',
}

window.handleRefresh = () => {
  // console.log('测试按钮是否可以触发点击事件')
}

const testResultPop = (type, result) => {
  resPopText.value = getAutoCaseResultText(type, result)

  ElMessageBox.alert(
      resPopText.value,
      '', {
        dangerouslyUseHTMLString: true,
        dangerouslyInsertHtml: true,
        showConfirmButton: false,
        customClass: 'exe-feedback-pop',
        customStyle: customStyle,
      }).then(() => {

  }).catch(() => {
    console.log('已取消')
  })
}

// 页面初始化获取是否有正在执行的自动化测试用例，开启定时器
const initAutoCaseTimer = () => {
  timer = setInterval(() => {
    // 调用获执行结果的接口
    if (batchCaseList.value.length > 0) {
      getExeBatchAutoResFn()
    }
    if (singleCaseList.value.length > 0) {
      getExeSingleAutoResFn()
    }
  }, 5000);
}

// 批量执行结果
const getExeBatchAutoResFn = () => {
  let params = {
    autoCaseIds: batchCaseList.value,
    newExceFlag: true,
    execFileFlag: false,
  }
  getExeAutoCaseResult(params).then(res => {
    if (res.success) {
      // 执行后结果成功： 修改列表数据、不弹窗、从数组移除
      let resultArr = []
      res.data.forEach(item => {
        if (item.status == 'passed' || item.status == 'failed') {
          resultArr.push(item.autoCaseId)
        }
        // 修改列表数据
        tableData.value.forEach(ele => {
          if (item.autoCaseId == ele.autoCaseId) {
            ele.execStatus = item.status
          }
        })
      })
      // 从数组中移除
      batchCaseList.value = batchCaseList.value.filter(item => !resultArr.includes(item))
    } else {
      ElMessage.error(res.msg)
    }
  })

}

// 单条执行结果
const getExeSingleAutoResFn = () => {
  let params = {
    autoCaseIds: singleCaseList.value,
    newExceFlag: true,
    execFileFlag: true,
  }
  getExeAutoCaseResult(params).then(res => {
    if (res.success) {
      // 执行后结果成功： 修改列表数据、弹窗、从数组移除
      if (res.data.length > 0) {
        // 弹窗
        let resultArr = []
        res.data.forEach(item => {
          if (item.status == 'passed') {
            testResultPop('success', item)
            resultArr.push(item.autoCaseId)
          } else if (item.status == 'failed') {
            testResultPop('fail', item)
            resultArr.push(item.autoCaseId)
          }
          // 修改列表数据
          tableData.value.forEach(ele => {
            if (item.autoCaseId == ele.autoCaseId) {
              ele.execStatus = item.status
            }
          })
        })
        // 从数组中移除
        singleCaseList.value = singleCaseList.value.filter(item => !resultArr.includes(item))
      }
    } else {
      ElMessage.error(res.msg)
    }
  })

}

// 获取某条用例的执行结果
const getAutoRes = (row) => {
  let params = {
    autoCaseIds: [row.autoCaseId],
    newExceFlag: true,
    execFileFlag: true,
  }
  getExeAutoCaseResult(params).then(res => {
    if (res.success) {
      if (res.data && res.data.length > 0) {
        if (res.data[0].status == 'passed') {
          testResultPop('success', res.data[0])
        } else if (res.data[0].status == 'failed') {
          testResultPop('fail', res.data[0])
        }
      }
    }
  })
}

// 刷新状态
window.refreshStatus = (id) => {
  // console.log('刷新状态333==', id)
  let params = {
    autoCaseIds: [id],
    newExceFlag: true,
    execFileFlag: true,
  }
  getExeAutoCaseResult(params).then(res => {
    if (res.success) {
      if (res.data && res.data.length > 0) {
        let dataInfo = res.data[0]
        if (dataInfo.status == 'passed') {
          ElMessageBox.close()
          testResultPop('success', dataInfo)
        } else if (dataInfo.status == 'failed') {
          ElMessageBox.close()
          testResultPop('fail', dataInfo)
        }
      }
    }
  })
}

// 查看报告
window.viewReport = (url) => {
  getSign(url).then(res => {
    if (res.success) {
      window.open(res.data, '_blank')
    }
  })
}

watch(() => dicStore.globalProjectCode, (newVal) => {
  globalProjectName.value = localStorage.getItem('global_ProjectName')
  globalProjectStatus.value = localStorage.getItem('global_ProjectStatus')
  searchForm.projectCode = newVal
  getList()
})

onBeforeMount(() => {
  clearInterval(timer)
})

onMounted(() => {
  searchForm.projectCode = localStorage.getItem('global_ProjectCode') // 初始赋值：从缓存中取
  getDicListFn('CASE_EXEC_STATUS') // 执行状态
  getDicListFn('CASE_TYPE') // 测试用例类型
  getDicListFn('CASE_FUNCTION_POINT') // 具体功能点
  getDicListFn('PRIORITY') // 优先级
  getDicListFn('CASE_EDIT_STATUS') // 编辑状态
  getDicListFn('TEST_RESULT') // 测试结果
  getDicListFn('AUTO_CASE_TYPE') // 自动化测试用例类型
  getDicListFn('AUTO_CASE_ELEMENT_SCOPE') // 自动化测试变量作用域
  getAllUserListFn() // 用户
  getUserProjectListFn() // 当前用户的所属项目
  getProjectIterationListFn() // 项目下的迭代

  getList()
  initAutoCaseTimer()
})

</script>
<style lang="scss">
.exe-feedback-pop {
  padding: 24px 20px 10px;
}

.dia-main-execute {
  .status-tag {
    width: 32px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    color: #FFF;
    border-radius: 3px;
    font-size: 11px;
    margin-top: 2px;
  }

  .success-tag {
    background-color: #04B42A;
  }

  .fail-tag {
    background-color: #E94738;
  }

  .disabled-btn {
    color: #B2B2B2 !important;
    cursor: default;
  }

  .header-line {
    position: relative;
    left: 0;
    width: calc(100% - 100px);

    .header-title {
      font-size: 16px;
      font-weight: bold;
      color: #333;
    }

    .refresh-btn {
      margin-left: 12px;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #2173F7;
      color: #2173F7;
      font-size: 12px;
      cursor: pointer;

      span{
        font-size: 12px;
      }

      img {
        width: 12px;
      }
    }
  }

  .dia-main-content-execute {
    .gap30 {
      gap: 30px;
    }

    .gap12 {
      gap: 12px;
    }

    .case-basic-info {
      padding-bottom: 7px;
      border-bottom: 1px solid #E2E4E8;

      .info-item {
        margin-top: 10px;
        display: flex;
        justify-content: start;
        align-items: start;
        gap: 12px;
        margin-bottom: 0px;
      }

      .info-title {
        color: #666;
      }

      .info-value {
        color: #333;
      }

    }

    .area-title {
      margin: 16px 0 8px 0;
      color: #666;
    }

    .result-content {
      width: 960px;
      min-height: 160px;
      max-height: 500px;
      border: 1px solid #E2E4E8;
      border-radius: 8px;
      padding: 12px;
      overflow: auto;
    }

    .opt-disabled-btn {
      background-color: #E2E4E8;
      color: #666;
      cursor: default;
    }
  }


}
</style>
<style lang="scss" scoped>
.main-content {
  height: calc(100vh - 56px);
  padding: 12px 20px 0 20px;

  .gap12 {
    gap: 12px;
  }

  .mb12 {
    margin-bottom: 12px;
  }

  .disabled-btn {
    color: #B2B2B2 !important;
    cursor: default;
  }

  .page-search {
    margin-bottom: 12px;

    .title-1 {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        font-size: 16px;
        font-weight: bold;
      }
    }

    .search-content {
      margin-top: 12px;
      padding: 12px;
      background-color: #FFF;

      .search-btn {
        margin-left: 20px;
        padding-right: 20px;
      }

    }

    :deep(.el-form-item) {
      margin-bottom: 0;
      align-items: flex-start;
    }

    :deep(.el-input) {
      --el-input-height: 28px;
      --el-input-border-color: #DBDDE3;
      --el-input-border-radius: 4px;
      --el-input-padding-left: 10px;
      --el-input-padding-right: 10px;
      // width: 260px;
    }

    :deep(.el-select__wrapper) {
      min-height: 28px;
      border-radius: 3px;
    }
  }

  .gap12 {
    gap: 12px;
  }

  .gap16 {
    gap: 16px;
  }

  .auto-icon-box {
    gap: 12px;

    img {
      width: 14px;
      cursor: pointer;
    }

    @keyframes rotateAnimation {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(36deg);
      }
    }

    .execute-box {
      // width: 40px;
      gap: 12px;
      margin-right: 4px;

      .rotate-loading {
        animation: rotateAnimation 2s linear infinite;
      }
    }
  }

  .btn-text-primary {
    color: #2173F7 !important;
  }

  .btn-text-danger {
    color: #F53F3F !important;
  }

  .disabled-btn {
    color: #B2B2B2 !important;
    cursor: default;
  }

  .text-btn:hover {
    opacity: 0.8 !important;
  }

  .disable-text {
    width: 175px;
    margin: 0 auto;
    font-size: 14px;
    color: #B2B2B2;
    font-weight: 600;
    font-family: PingFang SC;
    text-align: left;
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

// 下拉框被表格遮挡
:deep(.el-table__cell) {
  position: static !important;
}

:deep(.el-table__cell .cell) {
  overflow: inherit !important;
}

// 下拉框最小宽度及高度
:deep(.el-select) {
  // min-width: 100px!important;
  height: 32px;
}

:deep(.el-select--small) {
  height: 24px !important;
}

:deep(.el-select--small .el-select__wrapper){
  padding: 0 12px!important;
  height: 24px !important;
  min-height: 24px !important;
  margin-top: -2px;
}

:deep(.el-table__body-wrapper) {
  min-height: 140px !important;
}

:deep(.el-table__body-wrapper .el-scrollbar) {
  min-height: 140px !important;
}

:deep(.el-scrollbar__wrap--hidden-default) {
  min-height: 140px !important;
}


:deep(.el-select__popper .el-select-dropdown .el-scrollbar) {
  min-height: 0 !important;
  max-height: 274px !important;
}

:deep(.el-select__popper .el-select-dropdown) {
  min-height: 0 !important;
  max-height: 274px !important;
}

:deep(.el-select__popper .el-select-dropdown__wrap) {
  min-height: 0 !important;
  max-height: 274px !important;
}

.opt-btn {
  height: 32px;
  line-height: 32px;
  padding: 0 12px;

  .btn-icon {
    width: 14px;
    margin-right: 6px;
    vertical-align: -2px;
  }

  &.opt-btn-mini {
    height: 28px;
    line-height: 28px;
    padding: 0 12px;
    font-size: 12px;

    .btn-icon {
      width: 12px;
      margin-right: 4px;
      flex-shrink: 0;
      vertical-align: 0;

      &.el-icon {
        font-size: 12px;
      }
    }

    &.opt-btn-mini-gray {
      color: #2173f7;
      border: 1px solid #2173f7;
      background: #fff;
    }
  }
}

.btn-primary {
  width: 64px;
  height: 28px;
  line-height: 28px;
  border-radius: 3px;

  .mr-3 {
    vertical-align: -2px;
  }
}

.btn-circle-fix {
  width: 64px;
  height: 28px;
  line-height: 28px;
  border-radius: 3px;
  color: #666;
  border: 1px solid #e2e4e8;

  &:hover {
    background: #fff;
  }

  .mr-3 {
    vertical-align: -2px;
  }
}

.page-table {
  background: #fff;
  padding: 12px;
}

:deep(.el-table .el-table__cell) {
  height: 37px;
  padding: 0;

  .cell{
    height: 37px;
    line-height: 37px;
  }
}

:deep(.el-input__wrapper) {
  padding-right: 30px !important;
}

:deep(.el-input__suffix) {
  right: 12px;
  position: absolute;
}

.flex-content{
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

:deep( .el-select){
  height: 27px;
}

:deep(.el-form-item__content){
  line-height: 27px;
  height: 27px;
}
</style>