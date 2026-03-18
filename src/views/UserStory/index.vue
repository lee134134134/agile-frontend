<template>
  <div class="main-content">
    <div class="jus-start-center">
      <div class="title-1">用户故事管理</div>
      <div class="sel-global-project">当前项目：{{ globalProjectName }} - {{ globalProjectStatus }}</div>
    </div>
    <div class="dic-manage-containe jus-bet-start">
      <div class="dic-manage-left bg-color-1 border-radius-8">
        <div class="card-header">
          <div class="title-2">需求筛选</div>
        </div>
        <div class="card-search">
          <el-row :gutter="24">
            <!-- <el-col :span="12">
                <el-form-item label="所属项目" label-position="top" required>
                    <el-select v-model="searchForm.projectId" placeholder="请选择" clearable
                        @change="handleSelectFn">
                        <el-option v-for="item in projectList" :key="item.projectId" :label="item.name"
                            :value="item.projectId" />
                    </el-select>
                </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="标题" label-position="left">
                <el-input v-model="searchForm.title" placeholder="请输入" @change="handleSelectFn"
                          @keydown.enter.native="handleSelectFn"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态" label-position="left">
                <el-select v-model="searchForm.status" clearable placeholder="请选择" @change="handleSelectFn">
                  <el-option v-for="item in statusList" :key="item.value" :label="item.name"
                             :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="优先级" label-position="left">
                <el-select v-model="searchForm.priority" clearable placeholder="请选择"
                           @change="handleSelectFn">
                  <el-option v-for="item in priorityList" :key="item.value" :label="item.name"
                             :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-if="taskList.length > 0" class="card-body">
          <div v-for="info in taskList" :key="info.requirementCode"
               :class="info.requirementCode == currentId ? 'group-item-checked' : ''"
               class="group-item"
               @click="handleSelectLeft(info)">
            <div class="item-top jus-bet-center">
              <div class="item-title">
                <div
                    :class="{ 'p0': info.priority == 'P0', 'p1': info.priority == 'P1', 'p2': info.priority == 'P2', 'p3': info.priority == 'P3', 'p4': info.priority == 'P4', 'p5': info.priority == 'P5' }"
                    class="tags1-fix">
                  {{ info.priority }}
                </div>
                <span>{{ info.title }}</span>
              </div>
              <div class="item-top-right jus-center">
                <div
                    :class="{ 'status-black': info.status === 'pending_discussion', 'status-blue': info.status === 'clarified', 'status-green': info.status === 'completed', 'status-yellow': info.status === 'sprint_included' }"
                    class="project-tag">
                  {{ info.statusName }}
                </div>
              </div>
            </div>
            <div class="item-bottom jus-bet-center">
              <div class="item-bottom-right jus-center">
                <div v-if="info.total == '0'" class="story-tags tags-gray">暂无用户故事</div>
                <div v-else class="jus-center story-tags tags-blue">
                  <div class="tags-blue-text">{{ info.total }}个用户故事</div>
                  <div class="tags-blue-text space-left-10">|</div>
                  <div class="tags-blue-text space-left-10">有任务-{{ info.withTasks }}</div>
                  <div class="tags-blue-text space-left-10">无任务-{{ info.withoutTasks }}</div>
                </div>
              </div>
              <el-text class="gray-text" truncated>{{ info.requirementCode }}</el-text>
            </div>
          </div>
        </div>
        <div v-if="taskList.length <= 0" class="card-body">
          <EmptyDia :type="'zwsj'"></EmptyDia>
        </div>
      </div>
      <div class="dic-manage-right bg-color-1 border-radius-8">
        <div class="card-header jus-bet-center">
          <div class="title-2">用户故事列表</div>
          <div v-if="currentId != undefined && (leftStatus && leftStatus != 'completed')" class="opt-btn"
               @click="handleOptFn(1)">
            添加用户故事
          </div>
        </div>
        <div v-if="currentId != undefined && tableData.length > 0" class="table-content">
          <el-table v-loading="loading" :data="tableData" :header-cell-style="TableRowStyleFixed" fit
                    height="calc(100vh - 210px)" scrollbar-always-on
                    stripe style="width: 100%">
            <el-table-column align="left" label="故事标题" show-overflow-tooltip width="150">
              <template #default="scope">
                                <span class="link-text" @click="handleOptFn(3, scope.row)">{{
                                    scope.row.title ?? '-'
                                  }}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" label="故事描述" min-width="350" prop="description"
                             show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="验收标准" min-width="150" prop="acceptanceCriteria"
                             show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="优先级" show-overflow-tooltip width="100">
              <template #default="scope">
                <div>
                                    <span
                                        :class="{ 'p0': scope.row.priority == 'P0', 'p1': scope.row.priority == 'P1', 'p2': scope.row.priority == 'P2', 'p3': scope.row.priority == 'P3', 'p4': scope.row.priority == 'P4', 'p5': scope.row.priority == 'P5' }"
                                        class="tags1">
                                        {{ scope.row.priority }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="工作量（人/天）" min-width="150" prop="effort"></el-table-column>
            <el-table-column align="center" label="创建时间" min-width="180" prop="createdAt"></el-table-column>
            <el-table-column align="center" label="创建人" min-width="150" prop="createdByName"></el-table-column>
            <el-table-column align="center" fixed="right" label="操作" width="120">
              <template #default="scope">
                <el-button class="btn-text-primary text-btn" type="text"
                           @click="handleOptFn(2, scope.row)">
                  <el-tooltip content="编辑" effect="light"  placement="top">
                    <img :src="editIcon" alt="编辑" class="table-icon"/>
                  </el-tooltip>
                </el-button>
                <el-button class="btn-text-danger text-btn" type="text"
                           @click="handleDelete(scope.row)">
                  <el-tooltip content="删除" effect="light"  placement="top">
                    <img :src="deleteIcon" alt="删除" class="table-icon"/>
                  </el-tooltip>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <EmptyDia v-if="currentId != undefined && tableData.length <= 0" :type="'zwsj'"></EmptyDia>
        <div v-if="currentId == undefined" class="empty-text">
          <div class="empty-img"></div>
          请选择一个需求查看用户故事
        </div>
      </div>
    </div>
    <OperateStory v-if="isOperateDia" :defaultStatus="defaultPriority" :demandId="currentId" :detailInfo="detailInfo"
                  :isShow="isOperateDia" :statusList="priorityList" :type="operateType"
                  @closeDiaFn="handleCloseDia"
                  @confirmFn="handleAddData" @editConfirmFn="handleEditSubFn"></OperateStory>
  </div>
</template>
<script setup>
import {h, onBeforeMount, reactive, ref, watch} from 'vue';
import {ElMessageBox} from 'element-plus';
import EmptyDia from '../../components/EmptyDia.vue'
import {getDicDefaultVal, TableRowStyle2, TableRowStyleFixed, TableRowStyleHide} from '@/utils';
import {getDicList} from '@/api/api.js';
import {getAllProjectList} from '@/api/demand.js';
import {
  addStoryFn,
  deleStoryCheckFn,
  deleStoryFn,
  getDemandList,
  getStoryList,
  updateStoryFn
} from '@/api/userStoryApi.js';
import OperateStory from './components/OperateStory.vue';
import {useDicStore} from '@/stores/dic.js';
import {WarningFilled} from "@element-plus/icons-vue";
import editIcon from "@/assets/webp/edit.webp";
import deleteIcon from "@/assets/webp/delete.webp";

const dicStore = useDicStore()
const searchForm = reactive({
  title: '',
  projectId: '',
  status: '',
  priority: '',
});

const taskList = ref([])
const currentId = ref(undefined)//左侧选中的id
const priorityList = ref([])//需求优先级下拉列表
const defaultPriority = ref('')///需求默认优先级
const statusList = ref([])//需求状态下拉列表
const defaultStatus = ref('')//默认需求状态
const projectList = ref([])//所属项目下拉列表
const tableData = ref([])//用户故事列表
const isOperateDia = ref(false)
const operateType = ref('')
const detailInfo = ref(null)
const leftStatus = ref(undefined)//左侧选中状态
const globalProjectName = ref(localStorage.getItem('global_ProjectName'))
const globalProjectStatus = ref(localStorage.getItem('global_ProjectStatus'))
//左侧查询接口
const handleSelectFn = async () => {
  currentId.value = undefined
  leftStatus.value = undefined
  tableData.value = []
  taskList.value = []
  await getDemondListFn()
}

async function getDemondListFn() {
  await getDemandList(searchForm).then(res => {
    if (res.success) {
      taskList.value = res?.data ?? []
    }
  })
}

const handleSelectLeft = (data) => {
  currentId.value = data.requirementCode
  leftStatus.value = data.status
  getStoryListFn()
}

function getStoryListFn() {
  tableData.value = []
  let params = {
    requirementCode: currentId.value
  }
  getStoryList(params).then(res => {
    if (res.success) {
      tableData.value = res?.data ?? []
    }
  })
}

const handleOptFn = (type, data) => {
  if (type == 1) {
    isOperateDia.value = true
    operateType.value = '添加'
    detailInfo.value = null
  } else if (type == 2) {
    detailInfo.value = data
    isOperateDia.value = true
    operateType.value = '编辑'
  } else {
    detailInfo.value = data
    isOperateDia.value = true
    operateType.value = '查看'
  }

}

const handleCloseDia = () => {
  isOperateDia.value = false
  operateType.value = ''
  detailInfo.value = null
}
const handleAddData = async (form) => {
  addStoryFn(form).then(res => {
    if (res.success) {
      isOperateDia.value = false
      operateType.value = ''
      detailInfo.value = null
      handleReFlash()
    }
  })
}
const handleEditSubFn = (form) => {
  updateStoryFn(form).then(res => {
    if (res.success) {
      operateType.value = ''
      detailInfo.value = null
      isOperateDia.value = false
      handleReFlash()
    }
  })
}
const handleDelete = (data) => {
  deleStoryCheckFn({storyCode: data.storyCode}).then(res => {
    if (res.data) {
      if (res.data == '1') {
        ElMessageBox.confirm(`该故事将实时移出，请确认是否删除？`, '', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          center: false,
          closeOnClickModal: false,
          autofocus: false,
          type: 'warning',
        }).then(() => {
          deleStoryFn({storyCode: data.storyCode}).then(res => {
            if (res.success) {
              handleReFlash()
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
    }

  })

}

async function handleReFlash() {
  await getDemondListFn()
  getStoryListFn()
}

const getDicListFn = async (code) => {
  await getDicList(code).then(res => {
    if (res.success) {
      switch (code) {
        case 'PRIORITY':
          priorityList.value = res?.data ?? []
          defaultPriority.value = getDicDefaultVal(res.data)
          break;
        case 'REQ_STATUS':
          statusList.value = res?.data ?? []
          defaultStatus.value = getDicDefaultVal(res.data)
          break;
      }
    }
  })
}
const getAllProjectListFn = async () => {
  await getAllProjectList().then(res => {
    if (res.success) {
      projectList.value = res?.data ?? []
    }
  })
}

watch(() => dicStore.globalProjectCode, (newVal) => {
  globalProjectName.value = localStorage.getItem('global_ProjectName')
  globalProjectStatus.value = localStorage.getItem('global_ProjectStatus')
  searchForm.projectId = newVal
  handleSelectFn()
})

onBeforeMount(async () => {
  // dicStore.userName = JSON.parse(localStorage.getItem("agiles_user")).name
  searchForm.projectId = localStorage.getItem('global_ProjectCode') // 初始赋值：从缓存中取
  await getAllProjectListFn()
  await getDicListFn('PRIORITY')
  await getDicListFn('REQ_STATUS')
  getDemondListFn()
})
</script>
<style src="@/assets/css/dicManage.scss"></style>
<style lang="scss" scoped>
.main-content {
  .dic-manage-containe {
    width: 100%;
    margin-top: 12px;
    gap: 16px;
    height: 100%;

    .dic-manage-left {
      width: 564px;
      padding: 16px;
      background: #fff;

      .card-search {
        margin-top: 8px;
      }

      :deep(.el-input) {
        --el-input-height: 28px;
        --el-input-border-color: #DBDDE3;
        --el-input-border-radius: 4px;
        --el-input-padding-left: 10px;
        --el-input-padding-right: 10px;
      }

      :deep(.el-select__wrapper) {
        min-height: 28px;
        border-radius: 4px;
      }

      :deep(.el-form-item__label) {
        font-weight: normal !important;
        font-size: 12px !important;
        color: #666 !important;
      }

      .card-body {
        height: calc(100vh - 228px);
        padding-right: 13px;
        margin-right: -13px;
        overflow-y: auto;
      }

      .item-title {
        width: calc(100% - 150px);
      }

    }

    .dic-manage-right {
      flex: 1;
      flex-shrink: 0;
      height: calc(100vh - 122px);
      padding: 16px;
      overflow-y: auto;
      background: #fff;

      .card-body {
        margin-top: 15px;
      }
    }

    .card-header {
      .head-opt {
        width: 205px;
      }
    }

    .opt-item {
      width: 32px;
      height: 32px;
      margin-left: 5px;
      text-align: center;
      background: #fff;
      border-radius: 6px 6px 6px 6px;
      cursor: pointer;

      .el-icon {
        font-size: 22px;
        color: #606266;

        svg {
          width: 3em;
          height: 3em;
          margin-bottom: -7px;
        }
      }

      &:hover {
        background: #2173F7;

        .el-icon {
          color: #fff;
        }
      }
    }

    .item-top-right {
      .tags1 {
        margin-right: 10px;
      }
    }

    .item-bottom-right {
      .task-tags {
        padding: 2px 6px;
        border-radius: 6px;
      }

      .story-tags {
        padding: 2px 12px;
        border-radius: 8px;
      }

      .tags-blue {
        background: transparent;
      }

      .tags-blue-text {
        color: #2173f7;
        font-family: 'Helvetica';
        font-weight: normal;
        font-size: 14px;
      }

      .tags-gray {
        background: transparent;
        color: #979797;
        font-family: 'Helvetica';
        font-weight: normal;
        font-size: 14px;
      }
    }

    .table-content {
      margin-top: 16px;
    }
  }

  .no-wrap {
    flex-wrap: nowrap;
    align-items: start;
  }

  .val-length {
    width: calc(100% - 60px);
  }

  :deep(.el-popper) {
    max-width: 400px;
  }

  :deep(.el-table .cell.el-tooltip) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal !important;
  }
}

.empty-img {
  width: 120px;
  height: 120px;
  background: url(@/assets/webp/no_result.webp) no-repeat;
  display: block;
  margin: 0 auto;
}

.title-2 {
  font-size: 14px;
  color: #333;
}
</style>