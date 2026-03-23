<template>
  <div class="demand-content">
    <div class="page-search">
      <div class="jus-bet-center">
        <section class="flex">
          <div class="title-1">需求进度追踪</div>
          <div class="sel-global-project">当前项目：{{ globalProjectName }} - {{ globalProjectStatus }}</div>
        </section>
      </div>

      <div class="search-content flex bg-color-1 border-radius-4">
        <el-form ref="demandFormRef" :model="demandForm" label-position="left">
          <div class="search-form-row">
            <el-form-item label="关键词" prop="keyword">
              <el-input v-model="demandForm.keyword" clearable maxlength="20" placeholder="标题或详情关键词"></el-input>
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
      <el-table v-loading="loading" :data="tableData" :default-expand-all="false" :header-cell-style="TableRowStyle3"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" fit
                height="calc(100vh - 240px)" row-key="id"
                scrollbar-always-on stripe
                style="width: 100%">
        <el-table-column :formatter="formatEmpty" align="left" fixed label="需求编号" min-width="100"
                         prop="requirementCode"
                         show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="formatEmpty" align="left" fixed label="标题" min-width="200" prop="title"
                         show-overflow-tooltip></el-table-column>
        <el-table-column v-for="(item,index) in tableColums" :key="index" :fixed="item.fixed"
                         :label="item.label" :min-width="item.prop === 'des' ? 400 : item.prop === 'type' ? 100 : 150" :prop="item.prop"
                         align="left" show-overflow-tooltip>
          <template #default="scope">
            <span v-if="item.prop==='stageName'"
                  :class="{'stage-tag':true,'stage0': scope.row.stageName === '需求阶段','stage1': scope.row.stageName === '用户故事','stage2': scope.row.stageName === 'UI设计','stage3': scope.row.stageName === '数据开发','stage4': scope.row.stageName === '前端开发','stage5': scope.row.stageName === '后端开发','stage6': scope.row.stageName === '测试阶段','stage7': scope.row.stageName === '验收阶段'}">{{
                scope.row[item.prop] ?? '-'
              }}</span>
            <span v-else-if="item.prop==='type'"
                  :class="{'stage-tag':true,'type0': scope.row.type === '需求','type1': scope.row.type === '故事','type2': scope.row.type === '执行',}">{{
                scope.row[item.prop] ?? '-'
              }}</span>
            <span v-else-if="item.prop === 'priority'"
                  :class="{ 'p0': scope.row.priority === 'P0', 'p1': scope.row.priority === 'P1', 'p2': scope.row.priority === 'P2', 'p3': scope.row.priority === 'P3', 'p4': scope.row.priority === 'P4', 'p5': scope.row.priority === 'P5' }"
                  class="tags1 ">
                                {{
                scope.row.priority ?? '-'
              }}</span>

            <span v-else-if="item.prop==='stageStatus'" class="status-wrapper">
              {{ formatValue(scope.row[item.prop]) }}
              <el-popover v-if="scope.row[item.prop]" :width="240" placement="right"
                          popper-class="status-timeline-popover"
                          trigger="hover">
                <template #reference>
                  <el-icon class="info-icon-blue" @mouseenter="fetchStatusHistory(scope.row)">
                    <i class="icon-info"/>
                  </el-icon>
                </template>
                <div v-loading="scope.row.historyLoading" class="timeline-container">
                  <div v-for="(log, idx) in scope.row.statusHistory || []" :key="idx" class="timeline-item">
                    <div class="timeline-node">
                      <div class="node-dot"></div>
                      <div v-if="idx !== (scope.row.statusHistory.length - 1)" class="node-line"></div>
                    </div>
                    <div class="timeline-content">
                      <div class="status-title">{{ formatValue(log.meetingName) || '-' }}</div>
                      <div class="status-desc">
                        {{ log.operator || '-' }} <span class="divider">|</span> {{ log.updateTime || '-' }}
                      </div>
                    </div>
                  </div>
                  <div v-if="!scope.row.statusHistory || scope.row.statusHistory.length === 0" class="empty-text">
                    暂无状态变更记录
                  </div>
                </div>
              </el-popover>
            </span>
            <span v-else-if="item.prop==='reviewDate'" class="status-wrapper">
              {{ scope.row[item.prop] ?? '-' }}
              <el-popover v-if="scope.row[item.prop]" :width="300" placement="right"
                          popper-class="review-timeline-popover"
                          trigger="hover">
                <template #reference>
                  <el-icon class="info-icon-blue" @mouseenter="fetchReviewHistory(scope.row)">
                    <i class="icon-info"/>
                  </el-icon>
                </template>
                <div v-loading="scope.row.reviewLoading" class="timeline-container review-timeline">
                  <div v-for="(log, idx) in scope.row.reviewHistory || []" :key="idx" class="timeline-item">
                    <div class="timeline-node">
                      <div class="node-dot-hollow"></div>
                      <div v-if="idx !== (scope.row.reviewHistory.length - 1)" class="node-line"></div>
                    </div>
                    <div class="timeline-content">
                      <div class="status-title">{{ log.reviewDate || '-' }}</div>
                      <div class="status-title">{{
                          scope.row.type === '需求' ? formatValue(log.meetingName) : log.meetingName || '-'
                        }}</div>
                      <div class="status-desc">
                        操作人：{{ log.operator || '-' }} <span
                          class="divider">|</span> 操作时间：{{ log.updateTime || '-' }}
                      </div>
                    </div>
                  </div>
                  <div
                      v-if="(!scope.row.reviewHistory || scope.row.reviewHistory.length === 0) && !scope.row.reviewLoading"
                      class="empty-text">
                    暂无评审历史
                  </div>
                </div>
              </el-popover>
            </span>
            <span v-else-if="item.prop==='status'">{{ formatStatusValue(scope.row[item.prop]) ?? '-' }}</span>

            <span v-else>{{ scope.row[item.prop] ?? '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column align="left" fixed="right" label="操作" width="80">
          <template #default="scope">
            <el-button v-if="canEdit(scope.row)" class="btn-text-primary text-btn" type="text"
                       @click="handleEditFn(scope.row)">
              <el-tooltip content="编辑" effect="light" popper-class="fix-tooltip" placement="top">
                <img :src="editIcon" alt="编辑" class="table-icon"/>
              </el-tooltip>
            </el-button>
            <span v-else class="text-gray">
              <el-tooltip content="编辑" effect="light" popper-class="fix-tooltip" placement="top">
                <img :src="editGrayIcon" alt="编辑" class="table-icon"/>
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationg-box">
        <pagination :currentPage="demandForm.current" :pageSize="demandForm.size" :total="total"
                    @currentPageCurrent="currentPageCurrent" @currentPageSize="currentPageSize">
        </pagination>
      </div>
    </div>
    <ProgressEdit v-if="editDetailShow" :detailInfo="detailInfo" :isShow="editDetailShow" @closeDiaFn="handleCloseEdit"
                  @confirmFn="handleEditDia"></ProgressEdit>
  </div>
</template>

<script setup>
import {onBeforeMount, reactive, ref, watch} from 'vue';
import {TableRowStyle3} from '@/utils';
import pagination from '@/components/pagination.vue';
import {demandProgressList, demandUpdateProgressList, stageLog, stageStatusLog} from '@/api/demand.js';
import {useDicStore} from '@/stores/dic.js';
// 引入图标
import {RefreshLeft, Search} from '@element-plus/icons-vue';
import ProgressEdit from "@/views/DemandManagement/components/ProgressEdit.vue";
import editIcon from "@/assets/webp/edit.webp";
import editGrayIcon from "@/assets/webp/edit_gray.webp";

const dicStore = useDicStore()
const demandForm = reactive({
  projectId: '',
  progress: '',
  status: '',
  priority: '',
  customerOwner: '',
  analyst: '',
  keyword: '',
  size: 10,
  current: 1,
});
const globalProjectName = ref(localStorage.getItem('global_ProjectName'))
const globalProjectStatus = ref(localStorage.getItem('global_ProjectStatus'))
const total = ref(100);
const demandFormRef = ref(null);
const loading = ref(false);
const statusList = ref(dicStore.statusList ?? [])
const yxjList = ref(dicStore.priorityList ?? [])
const progressList = ref(dicStore.progressList ?? [])
const tableColums = ref([
  {label: "分类", prop: "type", fixed: true},
  {label: "详情", prop: "des"},
  {label: "优先级", prop: "priority"},
  {label: "执行进度", prop: "progress"},
  {label: "需求状态", prop: "status"},
  {label: "阶段", prop: "stageName"},
  {label: "阶段状态", prop: "stageStatus"},
  {label: "负责人", prop: "leaderName"},
  {label: "计划开始", prop: "planStart"},
  {label: "计划结束", prop: "planEnd"},
  {label: "计划用时", prop: "planHour"},
  {label: "实际开始", prop: "actualStart"},
  {label: "实际结束", prop: "actualEnd"},
  {label: "实际用时", prop: "actualHour"},
  {label: "用时偏差", prop: "deviation"},
  {label: "评审日期", prop: "reviewDate"},
  {label: "备注", prop: "remarks"},
])
const tableData = ref([]);
const editDetailShow = ref(false)
const detailInfo = ref(null)
const operateDetailShow = ref(false)
const detailType = ref('')

// 角色定义
const ROLE_BRA = 'BRA'
const ROLE_SM = 'SM'
const ROLE_ADMIN = 'admin'

// BRA角色可维护阶段
const BRA_STAGES = ['需求阶段', '用户故事', 'UI设计', '验收阶段']

// SM角色可维护阶段
const SM_STAGES = ['数据开发', '前端开发', '后端开发', '测试阶段']

/**
 * 获取当前用户信息
 */
function getCurrentUser() {
  try {
    const userStr = localStorage.getItem('agiles_user')
    if (userStr) {
      return JSON.parse(userStr)
    }
  } catch (e) {
    console.error('解析用户信息失败:', e)
  }
  return null
}

/**
 * 获取当前用户的角色编码数组
 */
function getUserRoleCodes() {
  const user = getCurrentUser()
  if (user && user.rolesCode) {
    return Array.isArray(user.rolesCode) ? user.rolesCode : [user.rolesCode]
  }
  return []
}

/**
 * 检查当前行是否可编辑
 * @param {Object} row - 表格行数据
 * @returns {boolean} - 是否可编辑
 */
function canEdit(row) {
  if (row.reqStatus === 'completed') {
    return false
  }
  const roleCodes = getUserRoleCodes()
  const stageName = row.stageName

  // 如果没有角色信息，默认不显示编辑按钮
  if (roleCodes.length === 0) {
    return false
  }

  // admin 角色可以编辑所有阶段
  if (roleCodes.includes(ROLE_ADMIN)) {
    return true
  }

  // 如果同时有多个角色，只要满足任一角色的条件就可以编辑（OR关系）
  const canEditByBRA = roleCodes.includes(ROLE_BRA) && BRA_STAGES.includes(stageName)
  const canEditBySM = roleCodes.includes(ROLE_SM) && SM_STAGES.includes(stageName)

  return canEditByBRA || canEditBySM
}

watch(() => dicStore.globalProjectCode, (newVal) => {
  globalProjectName.value = localStorage.getItem('global_ProjectName')
  globalProjectStatus.value = localStorage.getItem('global_ProjectStatus')
  demandForm.projectId = newVal
  demandForm.current = 1;
  getList()
})
watch(() => dicStore.statusList, (newName) => {
  if (newName) statusList.value = newName
}, {immediate: true});
watch(() => dicStore.priorityList, (newName) => {
  if (newName) yxjList.value = newName
}, {immediate: true});
watch(() => dicStore.progressList, (newName) => {
  if (newName) progressList.value = newName
}, {immediate: true});

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

const formatEmpty = (row, column, cellValue) => {
  return (cellValue === '' || cellValue === null) ? '-' : cellValue
}

function getList() {
  loading.value = true
  demandProgressList(demandForm).then(res => {
    tableData.value = res.data.records;
    total.value = res.data.total;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  })
}

const handleEditFn = (data) => {
  detailInfo.value = data
  editDetailShow.value = true
}
const handleCloseEdit = () => {
  editDetailShow.value = false
  detailInfo.value = null
}
const handleEditDia = (data) => {
  demandUpdateProgressList(data).then(res => {
    if (res.success) {
      editDetailShow.value = false
      detailInfo.value = null
      demandForm.size = 10;
      demandForm.current = 1;
      getList()
    }
  })
}

const formatValue = (str) => {
  console.log('111111', dicStore.stageList.find(item => item.value === str)?.name ?? '-')
  return dicStore.stageList.find(item => item.value === str)?.name ?? '-'
}

const formatStatusValue = (str) => {
  return dicStore.statusList.find(item => item.value === str)?.name ?? '-'
}

/**
 * 核心逻辑：获取评审历史
 * 当鼠标移入感叹号时触发
 */
const fetchReviewHistory = async (row) => {
  // 如果已经获取过且有数据，不再重复请求
  if (row.reviewHistory && row.reviewHistory.length > 0) return;
  row.reviewLoading = true;
  const result = await stageLog(row.id)
  row.reviewHistory = result.data
  row.reviewLoading = false;
}

const fetchStatusHistory = async (row) => {
  // 如果已经获取过且有数据，不再重复请求
  if (row.statusHistory && row.statusHistory.length > 0) return;
  row.historyLoading = true;
  const result = await stageStatusLog(row.id)
  row.statusHistory = result.data
  row.historyLoading = false;
}

onBeforeMount(() => {
  demandForm.projectId = localStorage.getItem('global_ProjectCode')
  getList()
})
</script>

<style lang="scss" scoped>
.demand-content {
  .page-search {
    .search-content {
      margin-top: 12px;
      padding: 12px 12px 0;
      background: #fff;

      .search-form-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 16px;
        width: 100%;

        .el-form-item {
          margin-bottom: 0;
        }

        .el-select {
          width: 120px;
        }

        .el-input {
          width: 180px;
        }
      }

      .search-btn {
      }
    }
  }

  :deep(.el-input) {
    --el-input-height: 28px;
    width: 260px;
  }
}

.page-table {
  background: #fff;
  padding: 12px 16px 0;

  .btn-text-primary {
    color: #2173F7 !important;
  }

  .text-btn:hover {
    opacity: 0.8 !important;
  }

  .text-gray {
    color: #C0C4CC;
    cursor: not-allowed;
  }
}

/* 状态样式包裹器 */
.status-wrapper {
  display: inline-flex;
  align-items: center;

  .info-icon-blue {
    margin-left: 5px;
    color: #409EFF;
    cursor: pointer;
    font-size: 14px;
  }
}

/* 时间轴弹窗容器样式 */
.timeline-container {
  padding: 5px;

  .timeline-item {
    display: flex;
    gap: 12px;
    padding-bottom: 12px;

    &:last-child {
      padding-bottom: 0;
    }

    .timeline-node {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;

      .node-dot {
        width: 8px;
        height: 8px;
        background-color: #DCDFE6;
        border-radius: 50%;
        z-index: 2;
        margin-top: 4px;
      }

      .node-dot-hollow {
        width: 8px;
        height: 8px;
        box-sizing: border-box;
        border: 2px solid #B3ccf5;
        border-radius: 50%;
        z-index: 2;
        margin-top: 4px;
      }

      .node-line {
        position: absolute;
        top: 12px;
        width: 1px;
        height: calc(100% + 4px);
        background-color: #DCDFE6;
        z-index: 1;
      }
    }

    .timeline-content {
      .status-title {
        font-size: 14px;
        color: #333;
        font-weight: 500;
        margin-bottom: 2px;
      }

      .status-desc {
        font-size: 12px;
        color: #727682;

        .divider {
          margin: 0 4px;
          color: #EEE;
        }
      }
    }
  }

  .empty-text {
    font-size: 12px;
    color: #999;
    text-align: center;
  }
}

/* 标签通用样式 */
.stage-tag {
  font-size: 14px;
  display: inline-block;
  height: 22px;
  line-height: 22px;
  padding: 0 8px;
  border-radius: 3px;

  &.stage0 {
    background: #E8F1FE;
  }

  &.stage1 {
    background: #FDF0E4;
  }

  &.stage2 {
    background: #E4FCF9;
  }

  &.stage3 {
    background: #EAF3FE;
  }

  &.stage4 {
    background: #DEE4FD;
  }

  &.stage5 {
    background: #E6F5D8;
  }

  &.stage6 {
    background: #F8EBFE;
  }

  &.stage7 {
    background: #FAE0E0;
  }

  &.type0 {
    background: #E8F1FE;
  }

  &.type1 {
    background: #FDF0E4;
  }

  &.type2 {
    background: #DEF3ED;
  }
}

.btn-primary, .btn-circle-fix {
  width: 64px;
  height: 28px;
  border-radius: 3px;
}

.icon-info {
  display: inline-block;
  width: 12px;
  height: 12px;
  background: url(@/assets/images/ui/info.png) no-repeat;
  background-size: 100%;
}

:deep(.el-table .el-table__cell) {
  height: 37px;
  padding: 0;
}
</style>