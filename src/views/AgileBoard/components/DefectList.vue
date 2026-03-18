<template>
  <div class="tab-content">
    <div class="page-table">
      <div class="option-content jus-event-center mb12 gap12">
        <div class="cond-label">缺陷状态</div>
        <el-select v-model="filterForm.defectStatusName" clearable placeholder="请选择"
                   style="width:140px">
          <el-option v-for="item in defectStatusOptions" :key="item" :label="item"
                     :value="item"/>
        </el-select>
        <div class="cond-label">处理人</div>
        <el-select v-model="filterForm.leaderName" clearable filterable
                   placeholder="请选择" style="width:140px">
          <el-option v-for="item in leaderOptions" :key="item" :label="item"
                     :value="item"/>
        </el-select>
        <div :class="{'disabled-opt-btn': tableData.length == 0}" class="opt-btn opt-btn-mini" @click="handleViewDefectRpt">
          查看缺陷报告
        </div>
      </div>

      <el-table v-loading="loading" :data="filteredTableData" :header-cell-style="TableRowStyle3" fit height="calc(100vh - 350px)"
                scrollbar-always-on stripe style="width: 100%;min-height: 200px;">
        <el-table-column v-for="(item, index) in tableColums.filter(item => item.isSelect == true)"
                         :key="item.prop + index" :fixed="item.prop == 'defectTitle' ? 'left' : false" :label="item.label" :min-width="item.width"
                         align="left">
          <template #default="{ row, column, $index }">
            <el-text v-if="item.prop == 'defectTitle'" style="color:#2173f7;font-weight: 400;cursor: pointer;"
                     truncated
                     @click="handleEditFn(row, 'view')">{{ row[`${item.prop}`] }}
            </el-text>
            <span v-else-if="item.prop == 'defectPriority'" :class="{ 'p0': row.defectPriority == 'P0', 'p1': row.defectPriority == 'P1', 'p2': row.defectPriority == 'P2', 'p3': row.defectPriority == 'P3', 'p4': row.defectPriority == 'P4', 'p5': row.defectPriority == 'P5' }"
                  class="tags1">
                            {{ row.defectPriorityName }}
                        </span>

            <span v-else-if="item.prop == 'severity'" :class="{ 'p0': row.severity == 'fatal', 'p2': row.severity == 'severe', 'p3': row.severity == 'general', 'p4': row.severity == 'hint', 'p5': row.severity == 'suggestion' }"
                  class="tags1">
                            {{ row.severityName || '-' }}
                        </span>

            <span v-else-if="item.prop == 'defectStatus'" :class="{ 'status-black': row.defectStatus == 'pending', 'status-blue': row.defectStatus == 'fixing', 'status-green': row.defectStatus == 'fixed' || row.defectStatus == 'verified' || row.defectStatus == 'closed', 'status-red': row.defectStatus == 'reopened' }"
                  class="progress-tag">
                            {{ row.defectStatusName || '-' }}
                        </span>

            <el-text v-else truncated>
              {{ row[`${item.prop}`] !== null && row[`${item.prop}`] !== '' ? row[`${item.prop}`] : '-' }}
            </el-text>
          </template>
        </el-table-column>

      </el-table>

<!--      <div class="paginationg-box">-->
<!--        <pagination :currentPage="searchForm.current" :pageSize="searchForm.size" :total="total"-->
<!--                    @currentPageCurrent="currentPageCurrent" @currentPageSize="currentPageSize">-->
<!--        </pagination>-->
<!--      </div>-->
    </div>

    <AddDefect v-if="isOperateAddDia" :detailInfo="detailInfo" :isShow="isOperateAddDia" :type="operateType"
               :userInfo="userInfo" @closeDiaFn="handleCloseAddDefect" @confirmFn="handleConfirmAddDefect"
               @editConfirmFn="handleConfirmEditDefect"/>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref, watch, computed} from 'vue';
import {TableRowStyle3} from '@/utils';
import pagination from '@/components/pagination.vue';
import AddDefect from '@/views/DefectManagement/components/AddDefect.vue';
// import ChooseIterationDia from './components/ChooseIterationDia.vue';
import {useRouter} from "vue-router"
import {useDicStore} from '@/stores/dic.js';
import {addDefect, editDefect, getDefectInfo} from '@/api/defectApi';
import {getDefectList} from '@/api/agileBoardApi';

const dicStore = useDicStore()
const router = useRouter();
const props = defineProps(['curSprintId'])

const userInfo = JSON.parse(localStorage.getItem("agiles_user"))
const loading = ref(false)
const searchFormRef = ref(null)
const searchForm = reactive({
  sprintId: '',
  size: 1000,
  current: 1,
})
// 前端筛选表单
const filterForm = reactive({
  defectStatusName: '',
  leaderName: ''
})

const iterUserStoryList = ref([])

const defectStatusOptions = computed(() => {
  const values = tableData.value.map(item => item.defectStatusName).filter(val => val)
  return [...new Set(values)]
})

const leaderOptions = computed(() => {
  const values = tableData.value.map(item => item.headlerName).filter(val => val)
  return [...new Set(values)]
})

const filteredTableData = computed(() => {
  return tableData.value.filter(item => {
    const matchStatus = !filterForm.defectStatusName || item.defectStatusName === filterForm.defectStatusName
    const matchLeader = !filterForm.leaderName || item.headlerName === filterForm.leaderName
    return matchStatus && matchLeader
  })
})

const tableColums = ref([
  {
    label: '标题',
    prop: 'defectTitle',
    isSelect: true,
    width: '300',
    showTooltip: true,
  },
  {
    label: '所属用户故事',
    prop: 'storyName',
    isSelect: true,
    width: '180',
    showTooltip: true
  },
  {
    label: '优先级',
    prop: 'defectPriority',
    isSelect: true,
    width: '100',
    showTooltip: true
  },
  {
    label: '严重程度',
    prop: 'severityName',
    isSelect: true,
    width: '100',
    showTooltip: true
  },
  {
    label: '缺陷状态',
    prop: 'defectStatus',
    isSelect: true,
    width: '100',
    showTooltip: true
  },
  {
    label: '负责人',
    prop: 'leaderName',
    isSelect: true,
    width: '100',
    showTooltip: true
  },
  {
    label: '处理人',
    prop: 'headlerName',
    isSelect: true,
    width: '100',
    showTooltip: true
  },
  {
    label: '创建时间',
    prop: 'createdAt',
    isSelect: true,
    width: '200',
    showTooltip: true
  }
])
const total = ref(0)
const tableData = ref([])
const isOperateAddDia = ref(false)
const isOperateEditDia = ref(false)
const operateType = ref('')
const detailInfo = ref(null)
const isShowDefectRptDia = ref(false) // 生成缺陷报告弹窗


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


// 查看缺陷报告
const handleViewDefectRpt = () => {
  if (tableData.value.length == 0) return
  router.push({name: 'defectRpt', query: {id: props.curSprintId, from: 'agileBoard'}})
}

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
  searchForm.sprintId = props.curSprintId
  getDefectList(searchForm).then(res => {
    tableData.value = res.data.records
    total.value = res.data.total
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

watch(() => props.curSprintId, (nval) => {
  filterForm.defectStatusName = ''
  filterForm.leaderName = ''
  getList()
}, {immediate: false, deep: true})

onMounted(() => {
  getList()
})


</script>

<style lang="scss" scoped>
.tab-content {
  padding: 20px;
  box-sizing: border-box;
  // background-color: #F0F5FC;
  height: calc(100vh - 231px);
  border-radius: 8px;

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

  .disabled-opt-btn {
    background-color: #B2B2B2;
    cursor: default;
  }

  .disabled-opt-btn:hover {
    opacity: 1;
  }

  .page-search {
    margin-bottom: 40px;

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
      margin-top: 25px;
      padding: 20px;

      .search-btn {
        margin-left: 20px;
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
      height: 28px;
      border-radius: 4px;
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

:deep(.el-table .el-table__cell) {
  height: 37px;
  padding: 0;

  & > .cell{
    line-height: inherit;
  }
}

.el-text.is-truncated{
  display: inline;
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

.cond-label{
  font-size: 12px;
}
</style>