<template>
  <div class="main-content">
    <div class="jus-start-center">
      <div class="title-1">任务管理</div>
      <div class="sel-global-project">当前项目：{{ globalProjectName }} - {{ globalProjectStatus }}</div>
    </div>
    <div class="dic-manage-containe jus-bet-start">
      <div class="dic-manage-left bg-color-1 border-radius-8">
        <div class="card-search">
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="迭代" label-position="left" required>
                <el-select v-model="searchForm.sprintCode" placeholder="请选择"
                           @change="handleIterationChange">
                  <el-option-group v-for="group in iterationList" :key="group.state" :label="group.state">
                    <el-option v-for="item in group.list" :key="item.code" :label="item.name"
                               :value="item.code"/>
                  </el-option-group>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="模块" label-position="left">
                <el-cascader v-model="searchForm.moduleCode" :disabled="!searchForm.sprintCode" :loading="modelListLoad"
                             :options="moduleList" :props="defaultProps" :reserve-keyword="false" clearable filterable
                             placeholder="请选择" style="width:100%"
                             @change="handleSearchStory"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="优先级" label-position="left">
                <el-select v-model="searchForm.priority" clearable placeholder="请选择"
                           @change="handleSearchStory">
                  <el-option v-for="item in priorityList" :key="item.value" :label="item.name"
                             :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="title-2" style="margin-bottom:12px;font-size: 14px;">用户故事列表</div>
        <div class="card-body">
          <div v-for="info in storyList" :key="info.storyCode"
               :class="info.storyCode == currentId ? 'group-item-checked' : ''"
               class="group-item" @click="handleSelectStory(info)">
            <div class="story-top jus-bet-center">
              <div class="story-top-left jus-center">
                <div
                    :class="{ 'p0': info.priority == 'P0', 'p1': info.priority == 'P1', 'p2': info.priority == 'P2', 'p3': info.priority == 'P3', 'p4': info.priority == 'P4', 'p5': info.priority == 'P5' }"
                    class="tags1-fix">
                  {{ info.priority }}
                </div>
                <div class="item-title space-left-10">{{ info.title }}</div>
              </div>

              <div class="story-top-right jus-center">
                <div
                    :class="{ 'bg-no': info.status === 'todo', 'status-black': info.status === 'in_progress' || info.status === 'testing', 'status-green': info.status === 'done' }"
                    class="project-tag space-left-10">
                  {{ info.statusName }}
                </div>
              </div>
            </div>
            <div class="item-description" style="margin:10px 0">{{ info.description }}</div>
            <div class="item-bottom jus-bet-center">
              <div class="jus-center">
                <el-text class="gray-text" truncated>{{ info.storyCode }}</el-text>
              </div>
              <div class="item-bottom-right jus-center">
                <div class="task-text">共<b>{{ info.total }}</b>个任务</div>
                <div class="story-tags tags-gray">未开始-{{ info.notStart }}</div>
                <div class="story-tags tags-blue space-left-10">进行中-{{ info.start }}</div>
                <div class="story-tags tags-green space-left-10">已完成-{{ info.complete }}</div>
              </div>
            </div>
          </div>
          <EmptyDia v-if="storyList.length <= 0" :type="'zwsj'"></EmptyDia>
        </div>
      </div>
      <div class="dic-manage-right bg-color-1 border-radius-8">
        <div class="task-right-header jus-bet-center">
          <div class="title-2">任务管理</div>
          <div v-show="currentId != undefined" class="jus-end-center">
            <!-- <el-form-item label="负责人">
                <el-select v-model="searchTaskForm.userAccount" placeholder="请选择" @change="handleSearchTask"
                    clearable style="width:108px">
                    <el-option v-for="item in leaderList" :key="item.userAccount" :label="item.userName"
                        :value="item.userAccount" />
                </el-select>
            </el-form-item>
            <el-form-item label="优先级">
                <el-select v-model="searchTaskForm.taskPriority" placeholder="请选择" @change="handleSearchTask"
                    clearable style="width:108px">
                    <el-option v-for="item in taskPriorityList" :key="item.value" :label="item.name"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="任务状态">
                <el-select v-model="searchTaskForm.taskStatus" placeholder="请选择" @change="handleSearchTask"
                    clearable style="width:108px">
                    <el-option v-for="item in dicStore.taskStatusList" :key="item.value" :label="item.name"
                        :value="item.value" />
                </el-select>
            </el-form-item> -->
            <el-form-item label="负责人">
              <el-select v-model="searchTaskForm.userAccount" clearable placeholder="请选择"
                         style="width:108px" @change="handleSearchTask">
                <el-option v-for="item in curLeaderList" :key="item.code" :label="item.name"
                           :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item label="优先级">
              <el-select v-model="searchTaskForm.taskPriority" clearable placeholder="请选择"
                         style="width:108px" @change="handleSearchTask">
                <el-option v-for="item in curTaskPriorityList" :key="item.code" :label="item.name"
                           :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item label="任务状态">
              <el-select v-model="searchTaskForm.taskStatus" clearable placeholder="请选择"
                         style="width:108px" @change="handleSearchTask">
                <el-option v-for="item in curTaskStatusList" :key="item.code" :label="item.name"
                           :value="item.code"/>
              </el-select>
            </el-form-item>
            <div v-show="currentId != undefined && currentStoryStatus != 'done' && currentStoryStatus != ''"
                 class="opt-btn"
                 @click="handleOptFn(1)">添加任务
            </div>
          </div>
        </div>
        <div v-if="currentId != undefined && taskList.length > 0" class="card-body">
          <div v-for="(items, index) in taskList" :key="items.id" class="task-content">
            <div class="content-header jus-bet-center">
              <div class="header-left jus-flex-start">
                <div
                    :class="{ 'high': items.taskPriority == 'high', 'middle': items.taskPriority == 'medium', 'low': items.taskPriority == 'low' }"
                    class="tags1-fix">
                  {{ items.taskPriorityName }}
                </div>
                <div class="space-left-10 title-width">
                  <el-text class="item-title" style="line-height: 24px;" truncated>{{
                      items.taskName
                    }}
                  </el-text>
                </div>
              </div>
              <div class="header-right jus-center">
                <div class="name-text">{{ items.leader }}</div>
                <div
                    :class="{ 'status-black': items.taskStatus === 'not_started', 'status-blue': items.taskStatus === 'in_progress', 'status-green': items.taskStatus === 'completed' }"
                    class="project-tag space-left-10">
                  {{ items.taskStatusName }}
                </div>
              </div>
            </div>
            <div class="task-dec">{{ items.taskDesc }}</div>
            <div class="task-form-content jus-start-center">
              <div class="form-item-content jus-start-center">
                <div class="form-item-name">任务类型：</div>
                <div class="form-item-val">{{ items.taskTypeName }}</div>
              </div>
              <div class="form-item-content jus-start-center">
                <div class="form-item-name">开始日期：</div>
                <div class="form-item-val">{{ items.startDate }}</div>
              </div>
              <div class="form-item-content jus-start-center">
                <div class="form-item-name ">结束日期：</div>
                <div class="form-item-val">{{ items.endDate }}</div>
              </div>
            </div>
            <div class="task-bottom jus-bet-center">
              <div class="jus-start-center">
                <div class="bottom-text" style="margin-right:20px">预估工时:&nbsp;&nbsp;{{
                    items.estimatedHours ?? '-'
                  }}
                </div>
                <div class="bottom-text">创建于:&nbsp;&nbsp;{{ items.createdAt }}</div>
              </div>

              <div v-show="currentId != undefined && currentStoryStatus != 'done' && currentStoryStatus != ''"
                   class="opt-content">
                <el-icon class="btn-icon" color="#888" @click="handleOptFn(2, items)">
                  <Edit/>
                </el-icon>
                <el-icon v-show="items.userAccount == userName" class="btn-icon" color="#888"
                         @click="handleDelete(items)">
                  <Delete/>
                </el-icon>
              </div>
            </div>
          </div>
        </div>
        <EmptyDia v-if="currentId != undefined && taskList.length <= 0" :type="'zwsj'"></EmptyDia>
        <div v-if="currentId == undefined" class="empty-text">
          <div class="empty-img"></div>
          请选择一个用户故事查看和管理任务
        </div>
      </div>
    </div>
    <OperateTask v-if="isOperateDia" :demandId="currentId" :demandObj="currentObj" :detailInfo="detailInfo" :isShow="isOperateDia"
                 :leaderList="leaderList" :type="operateType" @closeDiaFn="handleCloseDia" @confirmFn="handleAddData"
                 @editConfirmFn="handleEditSubFn"></OperateTask>
  </div>
</template>
<script setup>
import {onBeforeMount, reactive, ref, watch} from 'vue';
import {ElMessageBox} from 'element-plus';
import {getDicDefaultVal} from '@/utils';
import EmptyDia from '../../components/EmptyDia.vue';
import OperateTask from "./components/OperateTask.vue"
import {getDicList, getPersonBySprint, getUserProjectIterationList} from '@/api/api.js';
import {
  addTaskList,
  deleTaskList,
  getSprintModuleList,
  getSprintStoryList,
  getStoryTaskList,
  updateTaskList
} from '@/api/taskApi.js';
import {useDicStore} from '@/stores/dic.js';

const dicStore = useDicStore()
const searchForm = reactive({
  sprintCode: '',
  moduleCode: '',
  priority: '',
});
const defaultProps = ref({
  checkStrictly: true,
  children: 'children',
  label: 'name',
  value: 'moduleCode',
  emitPath: false
})
const storyList = ref([])
const iterationList = ref([])//迭代下拉列表
const priorityList = ref([])//故事优先级下拉列表
const modelListLoad = ref(false)
const moduleList = ref([])
const currentId = ref(undefined)//选中的故事
const currentObj = ref({})
const currentStoryStatus = ref('')// 选中的故事状态
const isOperateDia = ref(false)
const operateType = ref('')
const detailInfo = ref(null)
const searchTaskForm = reactive({
  storyCode: '',
  userAccount: '',
  taskPriority: '',
  taskStatus: '',
});
const allTaskList = ref([]) // 存储完整的任务列表用于前端筛选
const filteredTaskList = ref([]) // 筛选后的任务列表
const taskList = ref([]) // 任务列表（使用filteredTaskList）
const taskPriorityList = ref([])//任务优先级下拉
const userName = ref('')
const leaderList = ref([])//负责人下拉列表
const curLeaderList = ref([]) // 当前列表中包含的负责人下拉列表
const curTaskPriorityList = ref([]) // 当前列表中包含的优先级下拉列表
const curTaskStatusList = ref([]) // 当前列表中包含的任务状态下拉列表
const globalProjectName = ref(localStorage.getItem('global_ProjectName'))
const globalProjectStatus = ref(localStorage.getItem('global_ProjectStatus'))
const handleIterationChange = async () => {
  localStorage.setItem('agileBoard_sprintId', searchForm.sprintCode)
  searchForm.moduleCode = ''
  modelListLoad.value = true
  handleSearchStory()
  await getModelListFn()
}
const getModelListFn = async () => {
  let params = {
    sprintCode: searchForm.sprintCode
  }
  await getSprintModuleList(params).then(res => {
    moduleList.value = res?.data ?? []
  })
}
const handleSearchStory = () => {
  storyList.value = []
  leaderList.value = []
  currentId.value = undefined
  currentStoryStatus.value = ''
  searchTaskForm.storyCode = ''
  searchTaskForm.userAccount = ''
  searchTaskForm.taskPriority = ''
  searchTaskForm.taskStatus = ''
  taskList.value = []
  allTaskList.value = []
  filteredTaskList.value = []
  storyListFn()
}

async function storyListFn() {
  await getSprintStoryList(searchForm).then(res => {
    if (res.success) {
      storyList.value = res?.data ?? []
    }
  })
}

const handleSelectStory = (data) => {
  currentId.value = data.storyCode
  currentObj.value = data
  currentStoryStatus.value = data.status
  leaderList.value = []
  searchTaskForm.storyCode = data.storyCode
  searchTaskForm.userAccount = ''
  searchTaskForm.taskPriority = ''
  searchTaskForm.taskStatus = ''
  handleSearchTask1()
  getTaskLeaderListFn()
}

const handleSearchTask = () => {
  // 前端筛选
  filteredTaskList.value = allTaskList.value.filter(item => {
    // 负责人筛选 - 使用leader字段，支持null值筛选
    const matchLeader = !searchTaskForm.userAccount || 
      (searchTaskForm.userAccount === 'null' ? !item.leader : item.leader === searchTaskForm.userAccount)
    // 优先级筛选 - 使用taskPriorityName字段
    const matchPriority = !searchTaskForm.taskPriority || item.taskPriorityName === searchTaskForm.taskPriority
    // 任务状态筛选 - 使用taskStatusName字段
    const matchStatus = !searchTaskForm.taskStatus || item.taskStatusName === searchTaskForm.taskStatus
    return matchLeader && matchPriority && matchStatus
  })
  taskList.value = filteredTaskList.value
}

const handleSearchTask1 = () => {
  taskList.value = []
  allTaskList.value = []
  getStoryTaskList(searchTaskForm).then(res => {
    if (res.success) {
      // 存储完整列表用于前端筛选
      allTaskList.value = res?.data ?? []
      // 初始化筛选列表
      filteredTaskList.value = [...allTaskList.value]
      taskList.value = filteredTaskList.value
      
      // 筛选条件下拉选项赋值
      if (allTaskList.value.length > 0) {
        // 负责人下拉 - 使用leader字段，支持null值
        // 检查是否有leader为null的数据
        const hasNullLeader = allTaskList.value.some(item => !item.leader)
        
        // 先获取非null的leader列表
        let list1 = Array.from(new Set(allTaskList.value.map(item => item.leader).filter(Boolean)))
        curLeaderList.value = list1.map(name => {
          let obj = allTaskList.value.find(item => item.leader === name)
          return {code: obj.leader, name: obj.leader}
        })
        
        // 如果有null的leader，添加"无负责人"选项
        if (hasNullLeader) {
          curLeaderList.value.unshift({code: 'null', name: '无负责人'})
        }

        // 优先级下拉 - 使用taskPriorityName字段
        let list2 = Array.from(new Set(allTaskList.value.map(item => item.taskPriorityName).filter(Boolean)))
        curTaskPriorityList.value = list2.map(name => {
          let obj = allTaskList.value.find(item => item.taskPriorityName === name)
          return {code: obj.taskPriorityName, name: obj.taskPriorityName}
        })

        // 任务状态下拉 - 使用taskStatusName字段
        let list3 = Array.from(new Set(allTaskList.value.map(item => item.taskStatusName).filter(Boolean)))
        curTaskStatusList.value = list3.map(name => {
          let obj = allTaskList.value.find(item => item.taskStatusName === name)
          return {code: obj.taskStatusName, name: obj.taskStatusName}
        })
      }
      else{
        curLeaderList.value = []
        curTaskPriorityList.value = []
        curTaskStatusList.value = []
      }
    }
  })

}
const getTaskLeaderListFn = () => {
  let params = {
    sprintId: searchForm.sprintCode
  }
  getPersonBySprint(params).then(res => {
    if (res.success) {
      leaderList.value = res?.data ?? []
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
  }

}
const handleCloseDia = () => {
  isOperateDia.value = false
  operateType.value = ''
  detailInfo.value = null
}
const handleAddData = (form) => {
  addTaskList(form).then(res => {
    if (res.success) {
      isOperateDia.value = false
      operateType.value = ''
      detailInfo.value = null
      handleFlash()
    }
  })
}
const handleEditSubFn = (form) => {
  updateTaskList(form).then(res => {
    if (res.success) {
      operateType.value = ''
      detailInfo.value = null
      isOperateDia.value = false
      handleFlash()
    }
  })
}

//保存更新后重新加载新数据
async function handleFlash() {
  await storyListFn()
  searchTaskForm.storyCode = currentId.value
  searchTaskForm.userAccount = ''
  searchTaskForm.taskPriority = ''
  searchTaskForm.taskStatus = ''
  handleSearchTask1()
}

const handleDelete = (data) => {
  ElMessageBox.confirm(`该任务将实时移出，请确认是否删除？`, '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    center: false,
    closeOnClickModal: false,
    autofocus: false,
    type: 'warning',
  }).then(() => {
    deleTaskList({id: data.id}).then(res => {
      if (res.success) {
        handleFlash()
      }
    })
  }).catch(() => {
    console.log('catch')
  })
}
const getDicListFn = async (code) => {
  getDicList(code).then(res => {
    if (res.success) {
      switch (code) {
        case 'PRIORITY':
          priorityList.value = res?.data ?? []
          // defaultPriority.value = getDicDefaultVal(res.data)
          break;
        case 'TASK_PRIORITY':
          taskPriorityList.value = res?.data ?? []
          dicStore.taskPriorityList = res?.data ?? []
          dicStore.defaultTaskPriority = getDicDefaultVal(res.data)
          break;
        case 'TASK_STATUS':
          dicStore.taskStatusList = res?.data ?? []
          dicStore.defaultTaskStatus = getDicDefaultVal(res.data)
          break;
        case 'TASK_TYPE':
          dicStore.taskTypeList = res?.data ?? []
          dicStore.defaultTaskType = getDicDefaultVal(res.data)
          break;
      }
    }
  })
}
const getIterationList = async () => {
  let params = {
    projectId: localStorage.getItem('global_ProjectCode') || undefined
  }
  await getUserProjectIterationList(params).then(res => {
    if (res.success) {
      // searchForm.sprintCode = res?.data[0]?.list[0]?.code ?? ''
      iterationList.value = res?.data ?? []
      if (localStorage.getItem('agileBoard_sprintId')) {
        let includeFlag = isIncludeSprint(localStorage.getItem('agileBoard_sprintId'))
        if (includeFlag) {
          searchForm.sprintCode = localStorage.getItem('agileBoard_sprintId')
        } else {
          searchForm.sprintCode = res?.data[0]?.list[0]?.code || ''
        }
      } else if (res?.data[0]?.list[0]?.code) {
        searchForm.sprintCode = res?.data[0]?.list[0]?.code
      } else {
        searchForm.sprintCode = ''
      }
      handleIterationChange()
    }
  })
}

// 判断迭代下拉列表中是否包含该迭代
const isIncludeSprint = (cacheSprint) => {
  let result = false
  if (iterationList.value.length > 0) {
    iterationList.value.forEach(group => {
      group.list.forEach(item => {
        if (item.code == cacheSprint) result = true
      });
    })
  }
  return result
}

watch(() => dicStore.globalProjectCode, (newVal) => {
  globalProjectName.value = localStorage.getItem('global_ProjectName')
  globalProjectStatus.value = localStorage.getItem('global_ProjectStatus')
  getIterationList()
})

onBeforeMount(async () => {
  userName.value = JSON.parse(localStorage.getItem("agiles_user")).name
  getDicListFn('PRIORITY')
  getDicListFn('TASK_PRIORITY')
  getDicListFn('TASK_PRIORITY')
  getDicListFn('TASK_STATUS')
  getDicListFn('TASK_TYPE')
  await getIterationList()
})
</script>
<style src="@/assets/css/dicManage.scss"></style>
<style lang="scss" scoped>
.main-content {
  .dic-manage-containe {
    width: 100%;
    margin-top: 25px;
    gap: 16px;

    .dic-manage-left {
      width: 564px;
      padding: 16px;
      background: #fff;

      .card-search {
        margin-top: 8px;
      }


      .card-body {
        height: calc(100vh - 248px);
        padding-right: 13px;
        margin-right: -13px;
        overflow-y: auto;
      }
    }

    .dic-manage-right {
      flex: 1;
      height: calc(100vh - 130px);
      padding: 16px;
      background: #fff;

      .card-body {
        margin-top: 15px;
        height: calc(100vh - 202px);
        overflow-y: auto;
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

    .task-tags {
      padding: 2px 12px;
      border-radius: 8px;
      background: #e0eeff;
      color: #2173f7;
      font-family: 'Helvetica';
      font-weight: bold;
      font-size: 14px;
    }

    .story-tags {
      padding: 2px 7px;
      border-radius: 4px;
      color: #fff;
      font-family: 'Helvetica';
      font-weight: 400;
      font-size: 12px;
    }
  }

  .task-right-header {
    height: 35px;

    :deep(.el-form-item) {
      margin-bottom: 0 !important;
      margin-right: 10px;
    }
  }

  .task-content {
    padding: 16px 16px 0;
    background: #f6f8fc;
    border-radius: 8px;
    margin-bottom: 12px;

    .content-header {
      margin-bottom: 10px;

      .header-left {
        width: calc(100% - 200px);
        align-items: center;
      }

      .item-title {
        font-family: "Source Sans 3";
        font-weight: bold;
        font-size: 16px;
        color: #1d1d1d;
      }

      .name-text {
        font-family: "Source Sans 3";
        font-weight: bold;
        font-size: 14px;
        color: #333;
      }
    }

    .task-dec {
      margin-bottom: 10px;
      font-family: "Source Sans 3";
      font-weight: 400;
      font-size: 14px;
      color: #666;
      text-align: justify;
    }

    .task-form-content {
      padding-bottom: 10px;
      border-bottom: 1px solid #e7e7e7;

      .form-item-content {
        width: 240px;

        .form-item-name {
          color: #888;
          font-family: 'Helvetica';
          font-weight: 400;
          font-size: 14px;
        }

        .form-item-val {
          font-family: "Source Sans 3";
          font-weight: 400;
          font-size: 14px;
          color: #2173f7;
        }
      }

    }

    .task-bottom {
      padding: 10px 0;

      .bottom-text {
        font-family: "Source Sans 3";
        font-weight: 400;
        font-size: 12px;
        color: #888888;
      }

      .btn-icon {
        cursor: pointer;
        margin-left: 10px;
        font-size: 16px !important;

        svg {
          width: 1.5em !important;
          height: 1.5em !important;
        }
      }
    }
  }

  .no-wrap {
    flex-wrap: nowrap;
    align-items: start;
  }

  .title-width {
    width: calc(100% - 60px);
    height: 24px;
  }

  :deep(.el-input) {
    --el-input-height: 28px;
    --el-input-border-color: #DBDDE3;
    --el-input-border-radius: 4px;
    --el-input-padding-left: 10px;
    --el-input-padding-right: 10px;
  }

  :deep(.el-select__wrapper) {
    border-radius: 4px;
    height: 28px;
  }

  :deep(.el-form-item__label) {
    font-weight: normal !important;
    font-size: 12px !important;
    color: #333 !important;
  }
}

.empty-img {
  width: 120px;
  height: 120px;
  background: url(@/assets/webp/no-result.webp) no-repeat;
  display: block;
  margin: 0 auto 8px;
}

.item-title{
  font-weight: bold;
  font-size: 16px;
}

.card-body .group-item .gray-text{
  font-size: 12px;
}

.task-text{
  font-size: 12px;
  color: #999;
  margin-right: 8px;

  b{
    font-size: 12px;
    color: #2173f4;
  }
}

.opt-btn{
  height: 28px;
  line-height: 26px;
  padding: 0 16px;
}

.title-2{
  font-size: 14px;
}
</style>