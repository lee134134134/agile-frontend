<template>
  <div class="main-content">
    <div class="page-search">
      <div class="jus-bet-center">
        <div class="jus-start-center">
          <div class="title-1">缺陷管理</div>
          <div class="sel-global-project">当前项目：{{ globalProjectName }} - {{ globalProjectStatus }}</div>
        </div>
        <div class="btn-list jus-start-center gap12">
          <div class="opt-btn" @click="openDefectRptDia">
            <el-icon class="mr-3 btn-icon">
              <Tickets/>
            </el-icon>
            生成缺陷报告
          </div>
          <div v-if="canGeneLaunchRpt" class="opt-btn" @click="openLaunchRptDia">
            <el-icon class="mr-3 btn-icon">
              <Tickets/>
            </el-icon>
            生成上线报告
          </div>
        </div>
      </div>
      <div class="search-content bg-color-1 border-radius-8">
        <el-form ref="searchFormRef" :model="searchForm" label-position="left">
          <el-row :gutter="24" style="margin-bottom: 10px;">
            <el-col :span="7">
              <el-form-item label="标题" prop="defectTitle">
                <el-input v-model="searchForm.defectTitle" clearable placeholder="请输入"
                          style="width: 100%"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
                <el-form-item label="所属项目" prop="projectId">
                    <el-select v-model="searchForm.projectId" placeholder="请选择" clearable style="width: 260px;">
                        <el-option v-for="item in dicStore.curUserProjectList" :key="item.projectId"
                            :label="item.name" :value="item.projectId" />
                    </el-select>
                </el-form-item>
            </el-col> -->
            <el-col :span="5">
              <el-form-item label="所属迭代" prop="sprintId">
                <el-select v-model="searchForm.sprintId" clearable placeholder="请选择" style="width: 100%;">
                  <el-option-group v-for="group in curUserProjectIterationList" :key="group.state"
                                   :label="group.state">
                    <el-option v-for="item in group.list" :key="item.code" :label="item.name"
                               :value="item.code"/>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="用户故事" prop="storyId">
                <el-select v-model="searchForm.storyId" clearable placeholder="请选择" style="width: 100%;">
                  <el-option v-for="item in iterUserStoryList" :key="item.storyId" :label="item.name"
                             :value="item.storyId"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="缺陷状态" prop="defectStatus">
                <el-select v-model="searchForm.defectStatus" clearable placeholder="请选择"
                           style="width: 160px;">
                  <el-option v-for="item in dicStore.defectStatusList" :key="item.value"
                             :label="item.name" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="display: flex; align-items: center; gap: 12px;">
            <el-form-item label="优先级" prop="defectPriority">
              <el-select v-model="searchForm.defectPriority" clearable placeholder="请选择"
                         style="width: 160px;">
                <el-option v-for="item in dicStore.priorityList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="负责人" prop="leaderAccount">
              <el-select v-model="searchForm.leaderAccount" clearable filterable placeholder="请选择"
                         style="width: 160px;">
                <el-option v-for="item in dicStore.allUserList" :key="item.username" :label="item.nickname"
                           :value="item.username"/>
              </el-select>
            </el-form-item>
            <el-form-item label="处理人" prop="headlerAccount">
              <el-select v-model="searchForm.headlerAccount" clearable filterable placeholder="请选择"
                         style="width: 160px;">
                <el-option v-for="item in dicStore.allUserList" :key="item.username" :label="item.nickname"
                           :value="item.username"/>
              </el-select>
            </el-form-item>
            <div class="search-btn jus-flex-end">
              <div class="btn-primary btn-margin-right" @click="handleSerach">
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
          <div v-if="canAddDefect" class="opt-btn opt-btn-mini" @click="operaAddDialog()">新增缺陷</div>
          <div v-if="canExportDefect" class="opt-btn opt-btn-mini" @click="handleExport">导出缺陷</div>
        </div>
      </div>

      <el-table v-loading="loading" :data="tableData" :header-cell-style="TableRowStyle3" fit
                height="calc(100vh - 397px)"
                scrollbar-always-on stripe
                style="width: 100%;">
        <el-table-column v-for="(item, index) in tableColums.filter(item => item.isSelect == true)"
                         :key="item.prop + index" :fixed="item.prop == 'defectTitle' ? 'left' : false"
                         :label="item.label"
                         :min-width="item.width" :width="fixedWidthColumns.includes(item.prop) ? item.width: ''"
                         align="left">
          <template #default="{ row, column, $index }">
            <el-text v-if="item.prop == 'defectTitle'"
                     style="color:#2173f7;font-weight: 400;cursor: pointer;text-decoration: underline;"
                     truncated
                     @click="handleEditFn(row, 'view')">{{ row[`${item.prop}`] }}
            </el-text>
            <el-select v-else-if="item.prop == 'defectPriority'" v-model="row[`${item.prop}`]"
                       :disabled="!canEditDefect || !row.editFlag"
                       filterable placeholder="请选择"
                       size="small"
                       @change="handleChangePriority($event, row)">
              <el-option v-for="item in dicStore.priorityList" :key="item.value" :label="item.name"
                         :value="item.value"/>
            </el-select>
            <el-select v-else-if="item.prop == 'defectStatus'" v-model="row[`${item.prop}`]"
                       :disabled="!canEditDefect || !row.editFlag"
                       filterable placeholder="请选择"
                       size="small"
                       @change="handleChangeDefectStatus($event, row)">
              <el-option v-for="item in dicStore.defectStatusList" :key="item.value" :label="item.name"
                         :value="item.value"/>
            </el-select>

            <el-text v-else truncated>
              {{ row[`${item.prop}`] !== null && row[`${item.prop}`] !== '' ? row[`${item.prop}`] : '-' }}
            </el-text>
            <!-- <el-tooltip v-else effect="dark" :content="row[`${item.prop}`]" placement="top">
                <div class="tooltip-column"> -->

            <!-- </div>
            </el-tooltip> -->
          </template>
        </el-table-column>

        <el-table-column align="center" fixed="right" label="操作" width="140">
          <template #default="scope">
            <el-button :class="{ 'disabled-btn': scope.row.fileInfo.length == 0 }"
                       :disabled="scope.row.fileInfo.length == 0"
                       class="btn-text-primary text-btn"
                       type="text" @click="handleDownload(scope.row)">
              <el-tooltip content="下载附件" effect="light"  placement="top">
                <img v-if="scope.row.fileInfo.length == 0" :src="annexGrayIcon" alt="下载附件" class="table-icon table-icon-gray"/>
                <img v-else :src="annexIcon" alt="下载附件" class="table-icon"/>
              </el-tooltip>
            </el-button>
            <el-button :class="{ 'disabled-btn': !canEditDefect || !scope.row.editFlag }"
                       :disabled="!canEditDefect || !scope.row.editFlag"
                       class="btn-text-primary text-btn"
                       type="text" @click="handleEditFn(scope.row, 'edit')">
              <el-tooltip content="编辑" effect="light"  placement="top">
                <img v-if="!canEditDefect || !scope.row.editFlag" :src="editGrayIcon" alt="编辑" class="table-icon"/>
                <img v-else :src="editIcon" alt="编辑" class="table-icon"/>
              </el-tooltip>
            </el-button>
            <el-button :class="{ 'disabled-btn': !canDeleteDefect || !scope.row.editFlag }"
                       :disabled="!canDeleteDefect || !scope.row.editFlag"
                       class="btn-text-danger text-btn"
                       type="text" @click="handleDelete(scope.row)">
              <el-tooltip content="删除" effect="light"  placement="top">
                <img v-if="!canDeleteDefect || !scope.row.editFlag" :src="deleteGrayIcon" alt="删除" class="table-icon"/>
                <img v-else :src="deleteIcon" alt="删除" class="table-icon"/>
              </el-tooltip>
            </el-button>
            <el-button :class="{ 'disabled-btn': !canDeleteDefect }" :disabled="!canDeleteDefect"
                       class="btn-text-primary text-btn"
                       type="text" @click="handleLink(scope.row)">
              <el-tooltip content="关联" effect="light"  placement="top">
                <img v-if="!canDeleteDefect" :src="linkedGrayIcon" alt="关联" class="table-icon"/>
                <img v-else :src="linkedIcon" alt="关联" class="table-icon"/>
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

    <AddDefect v-if="isOperateAddDia" :detailInfo="detailInfo" :isShow="isOperateAddDia" :type="operateType"
               :userInfo="userInfo" @cancelRelateFn="cancelRelateFn" @closeDiaFn="handleCloseAddDefect"
               @confirmFn="handleConfirmAddDefect" @editConfirmFn="handleConfirmEditDefect"
               @viewLinkDefectFn="handleViewLinkDefect"/>
    <ChooseIterationDia v-if="isShowDefectRptDia" :current-data="curUserProjectIterationList" :isShow="isShowDefectRptDia" @closeDiaFn="closeDefectRptDia"
                        @confirmFn="goDetailRpt"/>
    <LaunchRptDia v-if="isShowLaunchRptDia" :isShow="isShowLaunchRptDia" @closeDiaFn="closeLaunchRptDia"
                  @confirmFn="handleAppointDownload"/>
    <RptSelectRangeDia v-if="isShowSelectedRange" :detailInfo="LaunchRptRangeData" :isShow="isShowSelectedRange"
                       :tip="tipText" @cancelFn="handleCancelLaunchRpt" @closeDiaFn="closeSelectedRangeDia"
                       @confirmFn="handleDownloadLaunch"/>
    <LinkChooseOptDia v-if="isShowLinkChooseDia" :defectId="defectLinkId" :current-data="curUserProjectIterationList" :isShow="isShowLinkChooseDia"
                      @closeDiaFn="closeLinkChooseDia"
                      @confirmFn="saveLinkDefectFn"/>
    <LinkDefectInfo v-if="isShowLinkDefectDia" :detailInfo="linkDetailInfo" :isShow="isShowLinkDefectDia"
                    :userInfo="userInfo"
                    type="查看" @closeDiaFn="handleCloseLinkDefectDia"/>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref, watch} from 'vue';
import {getDicDefaultVal, TableRowStyle, TableRowStyle3} from '@/utils';
import pagination from '@/components/pagination.vue';
import AddDefect from './components/AddDefect.vue';
import ChooseIterationDia from './components/ChooseIterationDia.vue';
import LaunchRptDia from './components/LaunchRptDia.vue';
import RptSelectRangeDia from './components/RptSelectRangeDia.vue';
import LinkChooseOptDia from './components/LinkChooseOptDia.vue';
import LinkDefectInfo from './components/LinkDefectInfo.vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {useRouter} from "vue-router"
import {useDicStore} from '@/stores/dic.js';
import {
  getAllUserList,
  getDicList,
  getIterUserStoryList,
  getUserProjectIterationList,
  getUserProjectList
} from '@/api/api';
import {
  addDefect,
  cancelRelate,
  deleteDefect,
  downloadAttach,
  downloadLaunchRpt,
  editDefect,
  exportDefect,
  geneLaunchRpt,
  getDefectInfo,
  getDefectList,
  getLaunchRangeStatus,
  relateDefect,
  updateLaunchRptStatus
} from '@/api/defectApi';
import {btnAuthFileter} from "@/utils/index.js";
import editIcon from "@/assets/webp/edit.webp";
import editGrayIcon from "@/assets/webp/edit_gray.webp";
import deleteIcon from "@/assets/webp/delete.webp";
import deleteGrayIcon from "@/assets/webp/delete_gray.webp";
import linkedIcon from "@/assets/webp/linked.webp";
import linkedGrayIcon from "@/assets/webp/linked_gray.webp";
import annexIcon from "@/assets/webp/annex.webp";
import annexGrayIcon from "@/assets/webp/annex-gray.webp";

const dicStore = useDicStore()
const router = useRouter();

const userInfo = JSON.parse(localStorage.getItem("agiles_user"))
const loading = ref(false)
const searchFormRef = ref(null)
const searchForm = reactive({
  defectTitle: '',
  projectId: '',
  storyId: '',
  sprintId: '',
  defectStatus: '',
  defectPriority: '',
  leaderAccount: '',
  headlerAccount: '',
  size: 10,
  current: 1,
})
const projectList = ref([
  {projectId: '1', name: '项目一选项'},
  {projectId: '2', name: '项目二'},
  {projectId: '3', name: '项目三'},
])
const curUserProjectIterationList = ref([])
const iterUserStoryList = ref([])

const tableColums = ref([
  {
    label: '标题',
    prop: 'defectTitle',
    isSelect: true,
    width: '400',
    showTooltip: true,
  },
  {
    label: '所属项目',
    prop: 'projectName',
    isSelect: true,
    width: '180',
    showTooltip: true
  },
  {
    label: '所属迭代',
    prop: 'sprintName',
    isSelect: true,
    width: '180',
    showTooltip: true
  },
  {
    label: '用户故事',
    prop: 'storyName',
    isSelect: true,
    width: '240',
    showTooltip: true
  },
  {
    label: '优先级',
    prop: 'defectPriority',
    isSelect: true,
    width: '120',
    showTooltip: true
  },
  {
    label: '缺陷状态',
    prop: 'defectStatus',
    isSelect: true,
    width: '140',
    showTooltip: true
  },
  {
    label: '负责人',
    prop: 'leaderName',
    isSelect: true,
    width: '120',
    showTooltip: true
  },
  {
    label: '处理人',
    prop: 'headlerName',
    isSelect: true,
    width: '130',
    showTooltip: true
  },
  {
    label: '创建时间',
    prop: 'createdAt',
    isSelect: true,
    width: '180',
    showTooltip: true
  }
])
const total = ref(0)
// 固定宽度的列
const fixedWidthColumns = ref(['defectTitle', 'defectPriority', 'defectStatus', 'leaderName', 'headlerName', 'createdAt'])
const tableData = ref([])
const isOperateAddDia = ref(false)
const isOperateEditDia = ref(false)
const operateType = ref('')
const detailInfo = ref(null)
const isShowDefectRptDia = ref(false) // 生成缺陷报告弹窗
const isShowLaunchRptDia = ref(false) // 生成上线报告弹窗
const isShowSelectedRange = ref(false) // 上线报告生成范围弹窗
const launchRptStatus = ref('1')
const LaunchRptRangeData = ref() // 生成线上报告数据对象
let timer
const tipText = ref('')
const linkRow = ref() // 点击要关联的数据
const isShowLinkChooseDia = ref(false) // 关联缺陷选择弹窗
const isShowLinkDefectDia = ref(false) // 查看关联缺陷详情弹窗
const linkDetailInfo = ref()
const defectLinkId = ref()
const globalProjectName = ref(localStorage.getItem('global_ProjectName'))
const globalProjectStatus = ref(localStorage.getItem('global_ProjectStatus'))


const canAddDefect = ref() // 添加缺陷权限
const canEditDefect = ref() // 编辑缺陷权限
const canDeleteDefect = ref() // 删除缺陷权限
const canExportDefect = ref() // 导出缺陷权限
// const canDownAttach = ref() // 下载附件权限
// const canGeneDefectRpt = ref() // 生成缺陷报告权限
const canGeneLaunchRpt = ref() // 生成缺陷报告权限
canAddDefect.value = btnAuthFileter('defect_add')
canEditDefect.value = btnAuthFileter('defect_edit')
canDeleteDefect.value = btnAuthFileter('defect_delete')
canExportDefect.value = btnAuthFileter('defect_export')
// canDownAttach.value = btnAuthFileter('defect_down_attach')
// canGeneDefectRpt.value = btnAuthFileter('generate_defect_rpt')
canGeneLaunchRpt.value = btnAuthFileter('generate_launch_rpt')

const operaAddDialog = () => {
  detailInfo.value = null
  operateType.value = '新增'
  isOperateAddDia.value = true
}

const handleEditFn = (row, type) => {
  // 调用接口查详情
  if (type == 'edit') {
    operateType.value = '编辑'
  } else {
    operateType.value = '查看'
  }

  // 调用接口查询缺陷详情
  let params = {
    defectId: row.defectId
  }

  getDefectInfo(params).then(res => {
    if (res.success) {
      detailInfo.value = res.data
      isOperateAddDia.value = true
    }
  })

}

const handleCloseAddDefect = () => {
  isOperateAddDia.value = false
}

const handleConfirmAddDefect = (form) => {
  delete form.fileInfo
  addDefect(form).then(res => {
    if (res.success) {
      handleCloseAddDefect()
      getList()
    }
  })
}

const handleConfirmEditDefect = (form) => {
  delete form.fileInfo
  editDefect(form).then(res => {
    if (res.success) {
      handleCloseAddDefect()
      getList()
    }
  })
}

// 查看关联缺陷详情
const handleViewLinkDefect = (id) => {
  console.log('查看缺陷详情')
  // isShowLinkDefectDia.value = true
  // linkDetailInfo.value = tableData.value[2]
  let params = {
    defectId: id
  }

  getDefectInfo(params).then(res => {
    if (res.success) {
      linkDetailInfo.value = res.data
      isShowLinkDefectDia.value = true
    }
  })
}

const handleCloseLinkDefectDia = () => {
  isShowLinkDefectDia.value = false
}

const handleDelete = (row) => {
  ElMessageBox.confirm('该缺陷将实时移除，请确认是否删除', '', {
    cancelButtonText: '取消',
    confirmButtonText: '确认',
    center: false,
    closeOnClickModal: false,
    autofocus: false,
    type: 'warning',
  }).then(() => {
    let params = {
      defectId: row.defectId,
    }
    deleteDefect(params).then(res => {
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

// 导出缺陷列表
const handleExport = () => {
  let params = JSON.parse(JSON.stringify(searchForm))
  delete params.current
  delete params.size
  exportDefect(params).then(res => {
    // if(res.code && res.code == '99999') {
    //     ElMessage.warning(res.msg)
    //     return
    // }
    // const blob = new Blob([res]);
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = `缺陷管理${$today}.xls`; // 根据实际情况设置下载文件名
    // a.click();
    // window.URL.revokeObjectURL(url);
  })
}

const handleReset = () => {
  searchFormRef.value.resetFields();
  searchForm.current = 1;
  getList()
};

const handleChangePriority = (event, row) => {
  let params = {
    defectId: row.defectId,
    defectPriority: row.defectPriority
  }
  changeStatus(params)
}

const handleChangeDefectStatus = (event, row) => {
  let params = {
    defectId: row.defectId,
    defectStatus: row.defectStatus
  }
  changeStatus(params)
}

const changeStatus = (params) => {
  editDefect(params).then(res => {
    if (res.success) {
      // ElMessage.success('修改成功')
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
  // console.log('searchForm===', searchForm)
  getDefectList(searchForm).then(res => {
    tableData.value = res.data.records
    total.value = res.data.total
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

const handleDownload = (row) => {
  if (!row.fileInfo || row.fileInfo.length == 0) {
    ElMessage.warning('附件为空！')
    return
  }
  let params = {
    defectId: row.defectId,
  }
  downloadAttach(params).then(res => {
    if (res.code && res.code == '99999') {
      ElMessage.warning(res.msg)
      return
    }
    const blob = new Blob([res]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '附件.zip'; // 根据实际情况设置下载文件名
    a.click();
    window.URL.revokeObjectURL(url);
  }).catch(err => {
    ElMessage.err(err)
  })

}

const openDefectRptDia = () => {
  isShowDefectRptDia.value = true
}

const closeDefectRptDia = () => {
  isShowDefectRptDia.value = false
}

const goDetailRpt = (id) => {
  router.push({name: 'defectRpt', query: {id, from: 'defectManage'}})
}

const openLaunchRptDia = () => {
  // 调用接口判断进入那个页面
  getLaunchRangeStatus().then(res => {
    if (res.success) {
      LaunchRptRangeData.value = res.data
      if (res.data.status == 0) {
        isShowLaunchRptDia.value = true
      } else if (res.data.status == 1) {
        isShowSelectedRange.value = true
        if (!res.data.filePath) {
          timer = setInterval(() => {
            getLaunchRangeStatusFn()
          }, 3000)
        }
      } else if (res.data.status == 2) {
        // 预约生成报告失败
        tipText.value = '生成上线报告失败...'
        isShowSelectedRange.value = true
      }
    }
  })
}

// 如未生成报告定时调用接口获取报告是否生成信息
const getLaunchRangeStatusFn = () => {
  getLaunchRangeStatus().then(res => {
    if (res.success) {
      LaunchRptRangeData.value.filePath = res.data.filePath
      if (res.data.filePath) {
        clearInterval(timer)
      }
    }

  })
}

const closeLaunchRptDia = () => {
  isShowLaunchRptDia.value = false
}

// 预约下载
const handleAppointDownload = (form) => {
  // console.log('form===', form)
  // 调用生成上线报告接口
  geneLaunchRpt(form).then(res => {
    if (res.success) {
      // 查询范围及流数据
      openLaunchRptDia()
      closeLaunchRptDia()
    }
  })

}

// 已选报告生成范围
const closeSelectedRangeDia = () => {
  isShowSelectedRange.value = false
}

const handleDownloadLaunch = (id) => {
  let params = {
    id: id,
  }
  // 调用下载接口
  downloadLaunchRpt(params).then(res => {
    if (res.code && res.code == '99999') {
      ElMessage.warning(res.msg)
      return
    }
    const blob = new Blob([res]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '上线报告.doc'; // 根据实际情况设置下载文件名
    a.click();
    window.URL.revokeObjectURL(url);
  }).catch(err => {
    console.log(err)
  })
}

const handleCancelLaunchRpt = (id) => {
  ElMessageBox.confirm('您将取消本次报告生成，此操作不可撤销，请谨慎操作！', '', {
    cancelButtonText: '取消',
    confirmButtonText: '确认',
    center: false,
    closeOnClickModal: false,
    autofocus: false,
    type: 'warning',
  }).then(() => {
    let params = {
      id: id,
      status: 0,
    }
    updateLaunchRptStatus(params).then(res => {
      if (res.success) {
        // 已取消，关闭弹窗
        ElMessage.success('已取消')
        closeSelectedRangeDia()
      }
    })
  }).catch(() => {
    console.log('已取消')
  })

  // closeSelectedRangeDia()
  // 调用修改状态接口，成功后

}

// 关联
const handleLink = (row) => {
  defectLinkId.value = row.defectId
  isShowLinkChooseDia.value = true
}

const saveLinkDefectFn = (linkInfo, defectId) => {
  let params = {
    defectId: defectId,
    sprintId: linkInfo.sprintId,
    storyId: linkInfo.storyId,
  }
  relateDefect(params).then(res => {
    if (res.success) {
      closeLinkChooseDia()
      getList()
    }
  })
}

const cancelRelateFn = (form) => {
  cancelRelate(form).then(res => {
    if (res.success) {
      let params = {
        defectId: form.sourceId
      }
      getDefectInfo(params).then(result => {
        if (result.success) {
          detailInfo.value = result.data
        }
      })
    }
  })
}

const closeLinkChooseDia = () => {
  isShowLinkChooseDia.value = false
}


// 获取字典
const getDicListFn = (type) => {
  getDicList(type).then(res => {
    if (res.success) {
      if (type == 'DEFECT_STATUS') {
        dicStore.defectStatusList = res?.data ?? []
        dicStore.defaultDefectStatus = getDicDefaultVal(res.data)
      } else if (type == 'PRIORITY') {
        dicStore.priorityList = res?.data ?? []
        dicStore.defaultPriority = getDicDefaultVal(res.data)
      } else if (type == 'DEFECT_TYPE') {
        dicStore.defectTypeList = res?.data ?? []
      } else if (type == 'DEFECT_SEVERITY') {
        dicStore.severityList = res?.data ?? []
        dicStore.defaultSeverity = getDicDefaultVal(res.data)
      } else if (type == 'DEFECT_ENVIRONMENT') {
        dicStore.defectEnvList = res?.data ?? []
        dicStore.defaultDefectEnv = getDicDefaultVal(res.data)
      } else if (type == 'DEFECT_RESOLUTION') {
        dicStore.handleResultList = res?.data ?? []
        dicStore.defaultHandleResult = getDicDefaultVal(res.data)
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

// 获取项目下的迭代
const getProjectIterationListFn = () => {
  let params = {
    projectId: searchForm.projectId || undefined
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

// 获取迭代下的用户故事
const getIterUserStoryListFn = () => {
  let params = {
    sprintId: searchForm.sprintId || undefined
  }
  getIterUserStoryList(params).then(res => {
    if (res.success) {
      iterUserStoryList.value = res?.data ?? []
      if (!iterUserStoryList.value.some(item => item.storyId == searchForm.storyId)) {
        searchForm.storyId = ''
      }
    }
  })
}

// 获取所有迭代
const getIterationListFn = () => {
  let params = {}
  getUserProjectIterationList(params).then(res => {
    if (res.success) {
      dicStore.iterationList = res?.data ?? []
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


// 所属项目 -->  迭代  
watch(() => searchForm.projectId, (newvalue, oldvalue) => {
  getProjectIterationListFn()
}, {deep: true})

// 所属迭代 -->  用户故事  
watch(() => searchForm.sprintId, (newvalue, oldvalue) => {
  getIterUserStoryListFn()
}, {deep: true})

watch(() => dicStore.globalProjectCode, (newVal) => {
  globalProjectName.value = localStorage.getItem('global_ProjectName')
  globalProjectStatus.value = localStorage.getItem('global_ProjectStatus')
  searchForm.projectId = newVal
  getList()
})

onMounted(() => {
  searchForm.projectId = localStorage.getItem('global_ProjectCode') // 初始赋值：从缓存中取
  getDicListFn('DEFECT_STATUS') // 缺陷状态
  getDicListFn('PRIORITY') // 优先级
  getDicListFn('DEFECT_TYPE') // 缺陷类型
  getDicListFn('DEFECT_SEVERITY') // 严重程度
  getDicListFn('DEFECT_ENVIRONMENT') // 缺陷环境
  getDicListFn('DEFECT_RESOLUTION') // 处理结果
  getAllUserListFn() // 用户
  getUserProjectListFn() // 当前用户的所属项目
  getProjectIterationListFn() // 项目下的迭代
  getIterUserStoryListFn() // 迭代下的用户故事
  getIterationListFn() // 获取所有迭代
  getList()
})

</script>

<style lang="scss" scoped>
.main-content {
  height: 100%;

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
        font-size: 18px;
        font-weight: bold;
      }
    }

    .search-content {
      margin-top: 14px;
      padding: 12px;
      background-color: #FFF;

      .search-btn {
        padding-right: 20px;
      }

    }

    :deep(.el-form-item) {
      margin-bottom: 0;
    }

    :deep(.el-input) {
      --el-input-height: 28px;
      --el-input-border-color: #DBDDE3;
      --el-input-border-radius: 4px;
      --el-input-padding-left: 10px;
      --el-input-padding-right: 10px;
      width: 260px;
    }

    :deep(.el-select__wrapper) {
      min-height: 28px;
      height: 28px;
      line-height: 28px;
      border-radius: 3px;
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
  height: 28px;
}

:deep(.el-select--small) {
  height: 24px !important;
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
    margin-right: 3px;
    vertical-align: -2px;
  }

  &.opt-btn-mini {
    height: 28px;
    line-height: 28px;
    padding: 0 12px;

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
    vertical-align: -1px;
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
    vertical-align: -1px;
  }
}

.page-table {
  background: #fff;
  padding: 12px 16px;
}

:deep(.el-table .el-table__cell) {
  height: 37px;
  padding: 0;

  & > .cell{
    line-height: inherit;
  }
}

.disabled-btn{
  .table-icon{
    opacity: 0.4;
  }
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
</style>