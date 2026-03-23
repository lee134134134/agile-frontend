<template>
  <div class="demand-content">
    <div class="page-search">
      <div class="jus-bet-center">
        <section class="flex">
          <div class="title-1">需求管理</div>
          <div class="sel-global-project">当前项目：{{ globalProjectName }} - {{ globalProjectStatus }}</div>
        </section>
        <div class="btn-list jus-start-center">
          <div v-role-code="['admin','PO','BRA']" class="opt-btn" @click="handleAddFn">
            <img :src="addIcon" alt="添加" class="btn-icon"/>
            <span>添加需求</span>
          </div>
          <ImportDemand v-role-code="['admin','PO','BRA']" @reloadFn="handleReset"></ImportDemand>
          <div v-role-code="['admin','PO','BRA']" class="opt-btn" @click="handleExport">
            <img :src="exportIcon" alt="导出" class="btn-icon"/>
            <span>导出需求</span>
          </div>
          <el-button class="opt-btn opt-btn-fix" @click="handleTempExport">
            <el-icon class="btn-icon">
              <Files/>
            </el-icon>
            <span>下载模板</span>
          </el-button>
        </div>
      </div>
      <div class="search-content flex bg-color-1 border-radius-4">
        <el-form ref="demandFormRef" :model="demandForm" label-position="left">
          <div class="search-form-row">
            <el-form-item label="关键词" prop="keyword">
              <el-input v-model="demandForm.keyword" clearable maxlength="20" placeholder="标题或描述关键词"></el-input>
            </el-form-item>
            <el-form-item label="优先级" prop="priority">
              <el-select v-model="demandForm.priority" clearable placeholder="全部优先级">
                <el-option v-for="item in yxjList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="需求状态" prop="status">
              <el-select v-model="demandForm.status" clearable placeholder="全部状态">
                <el-option v-for="item in statusList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="执行进度" prop="progress">
              <el-select v-model="demandForm.progress" clearable placeholder="全部进度">
                <el-option v-for="item in progressList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="需求分析人" prop="analyst">
              <el-input v-model="demandForm.analyst" clearable maxlength="10" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="业务负责人" prop="customerOwner">
              <el-input v-model="demandForm.customerOwner" clearable maxlength="10"
                        placeholder=""></el-input>
            </el-form-item>
            <div class="search-btn flex">
              <el-button class="btn-primary" type="primary" @click="handleSerach">
                <el-icon class="mr-3">
                  <Search/>
                </el-icon>
                筛选
              </el-button>
              <el-button class="btn-circle-fix" @click="handleReset">
                <el-icon class="mr-3">
                  <RefreshLeft/>
                </el-icon>
                重置
              </el-button>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="page-table">
      <div class="jus-bet-center">
        <!--        <div class="title-2">需求列表</div>-->
        <div style="margin-right:5px">
          <!--          <div id="draggerCon_btn" class="option-btn jus-bet-center" @click="handleShowDrag">-->
          <!--            <img alt="" src="@/assets/images/demand/sort.png"> 表格列设置-->
          <!--          </div>-->
          <draggerCom id="draggerCon" :fixedDataList="fixedDataList"
                      :initList="initColumns.filter(item => item.prop != 'requirementCode' && item.prop != 'projectName' && item.prop != 'projectModuleName')"
                      :isShow="isShowDrag"
                      @handleSaveDrag="handleSaveDrag" @resetFn="resetFn" @upDataFn="upColumnsData"></draggerCom>
        </div>
      </div>
      <el-table v-loading="loading" :data="tableData" :header-cell-style="TableRowStyleFixed" fit
                height="calc(100vh - 290px)" scrollbar-always-on
                stripe style="width: 100%;">

        <el-table-column v-for="(item, index) in tableColums.filter(item => item.isSelect == true)"
                         :key="item.prop + index"
                         :fixed="item.prop == 'requirementCode' || item.prop == 'projectName' || item.prop == 'projectModuleName' || item.prop == 'title' ? 'left' : false"
                         :label="item.label" :show-overflow-tooltip="item.showTooltip + '' == 'true'"
                         :width="item.width"
                         align="left">
          <template #default="scope">
            <span v-if="item.prop === 'devSupport'">{{ formatLabel(scope.row[item.prop]) ?? '-' }}</span>
            <span
                v-else-if="item.prop != 'statusName' && item.prop != 'priorityName' && item.prop != 'progressName' && item.prop != 'createdAt'">{{
                scope.row[item.prop] ?? '-'
              }}</span>
            <div v-else style="display:inline-block">
              <span v-if="item.prop == 'createdAt'">{{ DateFormat(scope.row[item.prop]) }}</span>
              <span v-if="item.prop == 'priorityName'"
                    :class="{ 'p0': scope.row.priority == 'P0', 'p1': scope.row.priority == 'P1', 'p2': scope.row.priority == 'P2', 'p3': scope.row.priority == 'P3', 'p4': scope.row.priority == 'P4', 'p5': scope.row.priority == 'P5' }"
                    class="tags1 ">
                                {{
                  scope.row.priority ?? '-'
                }}</span>
              <span v-if="item.prop == 'progressName'"
                    :class="{ 'bg-gray': scope.row.progress == 'unprocessed','bg-no': scope.row.progress == 'not_involve', 'bg-yellow': scope.row.progress == 'analyzing', 'bg-green': scope.row.progress == 'confirmed', 'bg-purple': scope.row.progress == 'online', 'bg-blue': scope.row.progress == 'developing',  'bg-testing': scope.row.progress == 'testing',  'bg-accepting': scope.row.progress == 'accepting' }"
                    class="progress-tag">
                                {{
                  scope.row.progressName ?? '-'
                }}</span>
              <span v-if="item.prop == 'statusName'"
                    :class="{ 'status-black': scope.row.status === 'pending_discussion', 'status-blue': scope.row.status === 'clarified', 'status-yellow': scope.row.status === 'sprint_included', 'status-green': scope.row.status === 'completed' }"
                    class="project-tag">
                                {{
                  scope.row.statusName ?? '-'
                }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="160">
          <template #default="scope">
            <el-button v-role-code="['admin','PO','BRA']" class="btn-text-primary text-edit"
                       type="text" @click="handleEditFn(scope.row)">
              <el-tooltip content="编辑" effect="light" placement="top" popper-class="fix-tooltip">
                <img v-if="scope.row.statusName==='已完成'" :src="editGrayIcon" alt="编辑" class="table-icon"/>
                <img v-else :src="editIcon" alt="编辑" class="table-icon"/>
              </el-tooltip>
            </el-button>
            <el-button v-role-code="['admin','PO','BRA']" class="btn-text-primary text-delete"
                       type="text" @click="handleDelete(scope.row)">
              <el-tooltip content="删除" effect="light" placement="top" popper-class="fix-tooltip">
                <img v-if="scope.row.statusName==='已完成'" :src="deleteGrayIcon" alt="删除" class="table-icon"/>
                <img v-else :src="deleteIcon" alt="删除" class="table-icon"/>
              </el-tooltip>
            </el-button>
            <el-button class="btn-text-primary text-btn" type="text"
                       @click="handleUIFn(scope.row)">
              <el-tooltip content="跳转至UI管理" effect="light" placement="top" popper-class="fix-tooltip">UI
              </el-tooltip>
            </el-button>
            <el-button class="btn-text-primary text-btn" type="text"
                       @click="handleDocFn(scope.row)">
              <el-tooltip content="跳转至项目文档" effect="light" placement="top" popper-class="fix-tooltip">Doc
              </el-tooltip>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationg-box">
        <pagination :currentPage="demandForm.current" :pageSize="demandForm.size" :total="total"
                    @currentPageCurrent="currentPageCurrent" @currentPageSize="currentPageSize">
        </pagination>
      </div>
    </div>
    <DemandAdd v-if="operateDetailShow" :detailInfo="detailInfo" :isShow="operateDetailShow" :type="detailType"
               @closeDiaFn="handleClose" @confirmFn="handleAddRole" @editConfirmFn="handleEditRole">
    </DemandAdd>
  </div>
</template>
<script lang="ts" setup>
/**
 * 组件名称：DemandList
 * @description 需求列表组件，提供需求管理功能
 * @module DemandList
 * @version 1.0.0
 */
import {h, nextTick, onBeforeMount, onMounted, reactive, ref, watch} from 'vue';
import {TableRowStyleFixed} from '@/utils';
import pagination from '@/components/pagination.vue';
import {ElMessageBox} from 'element-plus';
import draggerCom from '@/components/draggerCom.vue';
import DemandAdd from "./DemandAdd.vue";
import {DateFormat} from "@/utils/date.js";
import {useRouter} from 'vue-router';
import {
  demandAddList,
  demandCheck,
  demandDele,
  demandList,
  demandUpdateList,
  exportDemandList,
  exportDemandListTemp,
  reportOrderList,
  reportOrderSave
} from '@/api/demand.js';
import ImportDemand from './ImportDemand.vue';
import {useDicStore} from '@/stores/dic.js';
import vRoleCode from '@/directives/v-role-code.js';
import {getDicList} from '@/api/api.js';

/** 导入图标资源 */
import exportIcon from '@/assets/webp/export.webp';
import editIcon from '@/assets/webp/edit.webp';
import editGrayIcon from '@/assets/webp/edit_gray.webp';
import addIcon from '@/assets/webp/add.webp';
import deleteIcon from '@/assets/webp/delete.webp';
import deleteGrayIcon from '@/assets/webp/delete_gray.webp';
import {Files, WarningFilled} from "@element-plus/icons-vue";

const dicStore = useDicStore()
const demandForm = reactive({
  projectId: '',
  status: '',
  priority: '',
  progress: '',
  customerOwner: '',
  analyst: '',
  keyword: '',
  size: 10,
  current: 1,
});
const router = useRouter()
const total = ref(100);
const demandFormRef = ref(null);
const loading = ref(false);
const isShowDrag = ref(false)
const operateDetailShow = ref(false)
const detailType = ref('')
const detailInfo = ref(null)
const projectList = ref([])
const statusList = ref([])
const yxjList = ref([])
const progressList = ref([])
const globalProjectName = ref(localStorage.getItem('global_ProjectName'))
const globalProjectStatus = ref(localStorage.getItem('global_ProjectStatus'))
const defaultColumns = ref([
  {
    label: '需求编号',
    prop: 'requirementCode',
    isSelect: true,
    width: '100',
    showTooltip: true,
  },
  {
    label: '功能模块',
    prop: 'projectModuleName',
    isSelect: true,
    width: '200',
    showTooltip: true
  },
  {
    label: '需求标题',
    prop: 'title',
    isSelect: true,
    width: '200',
    showTooltip: true
  },
  // {
  //   label: '所属项目',
  //   prop: 'projectName',
  //   isSelect: true,
  //   width: '150',
  //   showTooltip: true
  // },
  {
    label: '排序',
    prop: 'orderNum',
    isSelect: true,
    width: '100',
    showTooltip: true
  },
  {
    label: '需求描述',
    prop: 'description',
    isSelect: true,
    width: '250',
    showTooltip: true
  },
  {
    label: '需求类型',
    prop: 'requirementTypeName',
    isSelect: true,
    width: '100',
    showTooltip: true
  },
  {
    label: '业务负责人',
    prop: 'customerOwnerId',
    isSelect: true,
    width: '150',
    showTooltip: true
  },
  {
    label: '需求分析人',
    prop: 'analystName',
    isSelect: true,
    width: '150',
    showTooltip: true
  },
  {
    label: '优先级',
    prop: 'priorityName',
    isSelect: true,
    width: '100',
    showTooltip: false
  },
  {
    label: '需求状态',
    prop: 'statusName',
    isSelect: true,
    width: '150',
    showTooltip: false
  },
  {
    label: '执行进度',
    prop: 'progressName',
    isSelect: true,
    width: '100',
    showTooltip: false
  },
  {
    label: '开发支持',
    prop: 'devSupport',
    isSelect: true,
    width: '150',
    showTooltip: true
  },
  {
    label: '采集日期',
    prop: 'collectionDate',
    isSelect: true,
    width: '150',
    showTooltip: true
  },
  {
    label: '确认日期',
    prop: 'confirmedDate',
    isSelect: true,
    width: '150',
    showTooltip: true
  },
  {
    label: '上线日期',
    prop: 'launchDate',
    isSelect: true,
    width: '150',
    showTooltip: true
  },
  {
    label: '标签',
    prop: 'tags',
    isSelect: true,
    width: '150',
    showTooltip: true
  },
  {
    label: '创建时间',
    prop: 'createdAt',
    isSelect: true,
    width: '200',
    showTooltip: true
  }])
const initColumns = ref([])
const tableColums = ref([])
const fixedDataList = ref([])
const tableData = ref([]);
const developerOptions = ref([]);
watch(() => dicStore.globalProjectCode, (newVal) => {
  globalProjectName.value = localStorage.getItem('global_ProjectName')
  globalProjectStatus.value = localStorage.getItem('global_ProjectStatus')
  demandForm.projectId = newVal
  handleSerach()
})
watch(() => dicStore.projectList, (newName) => {
  if (newName) {
    projectList.value = dicStore.projectList ?? []
  }
}, {immediate: true});
watch(() => dicStore.statusList, (newName) => {
  if (newName) {
    statusList.value = dicStore.statusList ?? []
  }
}, {immediate: true});
watch(() => dicStore.priorityList, (newName) => {
  if (newName) {
    yxjList.value = dicStore.priorityList ?? []
  }
}, {immediate: true});
watch(() => dicStore.progressList, (newName) => {
  if (newName) {
    progressList.value = dicStore.progressList ?? []
  }
}, {immediate: true});
const handleShowDrag = () => {
  isShowDrag.value = !isShowDrag.value
  initColumns.value = JSON.parse(JSON.stringify(tableColums.value))
}
const handleUIFn = (data) => {
  window.open(router.resolve({
    path: '/uiManagement/uiDetail',
    query: {proCode: data.projectId, modelName: data.projectModuleName, model: data.projectModuleId}
  }).href, '_blank')
}
const handleDocFn = (data) => {
  window.open(router.resolve({
    path: '/docManagement',
    query: {proCode: data.projectId, modelName: data.projectModuleName, model: data.projectModuleId}
  }).href, '_blank')
}
/*查询相关功能: 
 * 查询操作 @handleSerach
 * 重置操作 @handleReset
 * 分页功能 @currentPageCurrent @currentPageSize
 * 获取list 
*/

const handleSerach = () => {
  demandForm.current = 1;
  getList()
};

const handleReset = () => {
  demandFormRef.value.resetFields();
  demandForm.current = 1;
  getList()
};
const currentPageCurrent = (val) => {
  demandForm.current = val
  getList()
}
const currentPageSize = (val) => {
  demandForm.size = val
  demandForm.current = 1
  getList()
}

function getList() {
  loading.value = true
  demandList(demandForm).then(res => {
    tableData.value = res.data.records;
    total.value = res.data.total;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  })
}

const handleDelete = (data) => {
  if (data.statusName === '已完成') {
    return false
  }
  demandCheck(data.id).then(res => {
    if (res?.data?.canDelete) {
      ElMessageBox.confirm(`该需求将实时移出，请确认是否删除？`, '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        center: false,
        closeOnClickModal: false,
        autofocus: false,
        type: 'warning',
      }).then(() => {
        demandDele(data.id).then(res => {
          if (res.success) {
            getList()
          }
        })
      }).catch(() => {
        console.log('catch')
      })
    } else {
      ElMessageBox.confirm(
          h('div', {class: 'msg-with-icon'}, [
            h('div', {class: 'msg-with-icon-title'}, [
              h('span', {class: 'icon'}, h(WarningFilled)),
              h('span', {class: 'text'}, `提示`),
            ]),
            h('div', {class: 'msg-with-icon-text'}, '该项目下存在关联数据，不允许删除！')
          ]),
          {
            showCancelButton: false,
            confirmButtonText: '确认',
            closeOnClickModal: false,
            customClass: 'msg-with-icon-box',
          }
      ).then(() => {
        return
      }).catch(() => {
        console.log('catch')
      })
    }
  })

}
//详情新增等
const handleClose = () => {
  operateDetailShow.value = false
  detailInfo.value = null
}
const handleAddFn = () => {
  operateDetailShow.value = true
  detailInfo.value = null
  detailType.value = '新增'
}
const handleAddRole = (data) => {
  demandAddList(data).then(res => {
    if (res.success) {
      operateDetailShow.value = false
      detailInfo.value = null
      demandForm.size = 10;
      demandForm.current = 1;
      getList()
    }
  })

}
const handleEditRole = (data) => {
  demandUpdateList(data).then(res => {
    if (res.success) {
      operateDetailShow.value = false
      detailInfo.value = null
      demandForm.size = 10;
      demandForm.current = 1;
      getList()
    }
  })
}
const handleEditFn = (data) => {
  if (data.statusName === '已完成') {
    return false
  }
  operateDetailShow.value = true
  detailType.value = '编辑'
  detailInfo.value = data
}

//获取表格
function getColumnList() {
  let params = {
    usrname: dicStore.userName,
    module: 'demand_list'
  }
  reportOrderList(params).then(res => {
    if (res.data.length > 0) {
      res.data.forEach(item => {
        item.isSelect = item.isSelect == 'true' ? true : false
      })
      initColumns.value = JSON.parse(JSON.stringify(res.data))
      tableColums.value = JSON.parse(JSON.stringify(res.data))
    } else {
      // 没有保存过，初始化
      defaultColumns.value.forEach((item, index) => {
        item.username = dicStore.userName
        item.moduleName = 'demand_list'
        item.sorts = index + 1
      })
      initColumns.value = JSON.parse(JSON.stringify(defaultColumns.value))
      tableColums.value = JSON.parse(JSON.stringify(defaultColumns.value))
    }
  })
  getList()
}

// 表格列设置
function upColumnsData(data) {
  nextTick(() => {
    tableColums.value = JSON.parse(JSON.stringify(data))
    tableColums.value.unshift(...fixedDataList.value)
    console.log('tableColums.value==', tableColums.value)
  })
}

// 重置表格列
function resetFn() {
  nextTick(() => {
    tableColums.value = JSON.parse(JSON.stringify(initColumns.value))
  })
}

// 保存表格列表设置
function handleSaveDrag() {
  console.log('保存拖动')
  isShowDrag.value = false
  saveColumnList()
}

function saveColumnList() {
  let arr = JSON.parse(JSON.stringify(tableColums.value))
  reportOrderSave(arr).then(res => {
    console.log('保存列返回结果：', res)
    initColumns.value = JSON.parse(JSON.stringify(tableColums.value))
  })
}

function initFixedDataList() {
  fixedDataList.value = [{
    label: '需求编号',
    prop: 'requirementCode',
    isSelect: true,
    width: '150',
    showTooltip: true,
    username: dicStore.userName,
    moduleName: 'demand_list',
    sort: 1,
  },
    {
      label: '所属项目',
      prop: 'projectName',
      isSelect: true,
      width: '150',
      showTooltip: true,
      username: dicStore.userName,
      moduleName: 'demand_list',
      sort: 2,
    },
    {
      label: '功能模块',
      prop: 'projectModuleName',
      isSelect: true,
      width: '150',
      showTooltip: true,
      username: dicStore.userName,
      moduleName: 'demand_list',
      sort: 3,
    }]
}

function setEventListener() {
  document.addEventListener('mouseup', e => {
    var con = document.getElementById('draggerCon')
    var con_btn = document.getElementById('draggerCon_btn')
    if (con && con_btn) {
      if (!con.contains(e.target) && !con_btn.contains(e.target)) {
        isShowDrag.value = false
      }
    }
  })
}

function handleTempExport() {
  exportDemandListTemp('需求模板')
}

function handleExport() {
  exportDemandList(demandForm)
}

/**
 * 加载开发支持列表（用户故事阶段专用）
 */
async function loadDeveloperOptions() {
  try {
    const res = await getDicList('REQ_DEVELOP_STATUs')
    // 格式化数据：value对应value，label对应name
    if (res.data && Array.isArray(res.data)) {
      developerOptions.value = res.data.map(item => ({
        label: item.name,
        value: item.value
      }))
    } else {
      developerOptions.value = []
    }
  } catch (e) {
    developerOptions.value = []
  } finally {
  }
}

function formatLabel(str) {
  if (str) {
    const map = Object.fromEntries(developerOptions.value.map(item => [item.value, item.label]))
    return str.split(',').map(v => map[v] ?? v).join(',')
  } else {
    return str
  }
}

onBeforeMount(() => {
  initFixedDataList()
  loadDeveloperOptions()
})
onMounted(() => {
  demandForm.projectId = localStorage.getItem('global_ProjectCode')
  getColumnList()
  setEventListener()
})
</script>
<style lang="scss" scoped>
.demand-content {

  .page-search {
    .btn-list {
      display: flex;
      align-items: center;

      .opt-btn {
        display: flex;
        align-items: center;
        padding: 5px 12px 5px 12px;
        margin-left: 12px;
        cursor: pointer;
        border-radius: 4px;
        transition: opacity 0.2s;

        &:first-child {
          margin-right: 12px;
        }

        /**
         * 操作按钮图标样式
         * @description 设置按钮图标尺寸为12x12像素，支持img和Element Plus图标
         * @type {string}
         */
        .btn-icon {
          width: 12px;
          height: 12px;
          /**
           * 图标与文字间距
           * @description 使用margin-right实现图标与文字间距4px
           */
          margin-right: 4px;
          flex-shrink: 0;

          /**
           * Element Plus 图标样式适配
           * @description Element Plus图标的font-size设置为12px
           */
          &.el-icon {
            font-size: 12px;
          }
        }

        /**
         * 操作按钮悬停效果
         * @description 鼠标悬停时背景色变深，保持原有颜色不变
         */
        &:hover {
          background-color: rgba(33, 115, 247, 0.9);
        }
      }
    }

    .search-content {
      margin-top: 12px;
      padding: 12px;
      background: #fff;

      .search-form-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 16px;
        width: 100%;

        .el-form-item {
          margin-bottom: 0;
          margin-right: 0;
          display: flex;
          align-items: center;
        }

        .el-form-item__label {
          flex-shrink: 0;
          padding-right: 8px;
          font-size: 12px;
        }

        .el-select {
          width: 120px;
        }

        .el-input {
          width: 180px;
        }
      }

      .search-btn {
        flex-shrink: 0;
        display: flex;
        align-items: center;
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
      height: 28px;
      line-height: 28px;
      border-radius: 3px;
      font-size: 12px !important;
    }

    :deep(.el-input__wrapper) {
      border-radius: 3px;
      font-size: 12px !important;
      --el-input-inner-height: 28px;
    }
  }

  .page-table {
    background: #fff;
    padding: 0 16px;

    .title-2 {
      margin-bottom: 12px;
    }

    .option-btn {
      cursor: pointer;

      img {
        display: block;
        width: 20px;
        height: 20px;
      }
    }

    /**
     * 表格操作列图标样式
     * @description 表格中的编辑、删除等操作图标样式，尺寸16x16
     */
    .table-icon {
      width: 16px;
      height: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: opacity 0.2s;

      /**
       * 表格图标悬停效果
       */
      &:hover {
        opacity: 0.7;
      }
    }

    .option-btn:hover {
      opacity: 0.8;
    }

    .status-content {
      text-align: center;
    }

    .current-user {
      margin-left: 5px;
      width: 80px;
      height: 24px;
      background: #E0EEFF;
      border-radius: 8px 8px 8px 8px;
      border: 1px solid #2173F7;
      color: #2173F7;
      font-size: 14px;
      font-weight: bold;
      line-height: 24px;
      text-align: center;
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
  }

  .info-content {
    text-align: left;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #555555;
    line-height: 28px;

    .color-blue {
      color: #2173F7;
    }

    svg {
      width: 1.5em;
      height: 1.5em;
    }
  }

  :deep(.el-table .el-table__cell) {
    height: 37px;
    padding: 0;
  }

  .btn-primary {
    width: 64px;
    height: 28px;
    line-height: 28px;
    border-radius: 3px;
  }

  .btn-circle-fix {
    width: 64px;
    height: 28px;
    line-height: 28px;
    border-radius: 3px;
  }
}
</style>