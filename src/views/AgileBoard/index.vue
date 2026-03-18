<template>
  <div v-if="isShowPage" class="main-content">
    <div class="page-search">
      <div class="title-1">
        <div class="jus-start-center">
          <div class="title">敏捷看板</div>
          <div class="sel-global-project">当前项目：{{ globalProjectName }} - {{ globalProjectStatus }}</div>
        </div>
        <div class="jus-bet-center">
          <div class="cond-label">所属迭代</div>
          
          <el-select 
            v-model="sprintId" 
            style="width: 260px" 
            placeholder="请选择迭代"
            @change="handleChangeSprintId"
            popper-class="custom-iteration-popper"
          >
            <template v-for="group in dicStore.userIterationList" :key="group.state">
              
              <el-option disabled class="group-title-option" :value="`group-${group.state}`">
                <div class="group-header-content" :class="getGroupClass(group.state)">
                  <el-icon class="status-icon">
                    <img v-if="group.state === '进行中'" class="status-icon-img" src="@/assets/webp/select_todo.webp" alt="">
                    <img v-else-if="group.state === '未开始'" class="status-icon-img" src="@/assets/webp/select_nostart.webp" alt="">
                    <img v-else class="status-icon-img" src="@/assets/webp/select_com.webp" alt="">
                  </el-icon>
                  <span>{{ group.state }}</span>
                </div>
              </el-option>

              <el-option 
                v-for="item in group.list" 
                :key="item.code" 
                :label="item.name"
                :value="item.code"
                class="iteration-item-option"
              />
            </template>
          </el-select>
        </div>
      </div>
    </div>

    <el-tabs v-model="selectTab" class="custom-tabs" @tab-change="handleTabFn">
      <el-tab-pane label="概览" name="1">
        <Overview v-if="selectTab == '1'" :curSprintId="sprintId"/>
      </el-tab-pane>
      <el-tab-pane label="敏捷看板" name="2">
        <Board v-if="selectTab == '2'" :curSprintId="sprintId" :iterUserStoryList="iterUserStoryList"/>
      </el-tab-pane>
      <el-tab-pane label="缺陷列表" name="3">
        <DefectList v-if="selectTab == '3'" :curSprintId="sprintId"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import { VideoPlay, CircleCheck, Clock } from '@element-plus/icons-vue'
import Overview from './components/OverView.vue'
import Board from './components/Board.vue'
import DefectList from './components/DefectList.vue'
import {
  getAllUserList, getDicList, getIterMembers, getIterUserStoryList,
  getUserProjectIterationList, getUserProjectList
} from '@/api/api';
import { useDicStore } from '@/stores/dic.js';
import { getDicDefaultVal } from '@/utils';

const dicStore = useDicStore()
let isShowPage = ref(false)
const selectTab = ref('1')
const sprintId = ref('')
const iterUserStoryList = ref([])
const globalProjectName = ref(localStorage.getItem('global_ProjectName'))
const globalProjectStatus = ref(localStorage.getItem('global_ProjectStatus'))

// 状态对应的样式类
const getGroupClass = (state) => {
  if (state === '进行中') return 'is-ongoing';
  if (state === '已完成') return 'is-completed';
  return 'is-default';
}

const handleTabFn = () => {}

// 数据获取逻辑（保持不变）
const getUserIterationListFn = () => {
  getUserProjectIterationList({ projectId: localStorage.getItem('global_ProjectCode') || undefined }).then(res => {
    if (res.success) {
      dicStore.userIterationList = res?.data ?? []
      const cached = localStorage.getItem('agileBoard_sprintId')
      if (cached && isIncludeSprint(cached)) {
        sprintId.value = cached
      } else {
        sprintId.value = res?.data[0]?.list[0]?.code || ''
      }
      isShowPage.value = true
      handleChangeSprintId()
    }
  })
}

const isIncludeSprint = (cacheSprint) => {
  let result = false
  dicStore.userIterationList.forEach(group => {
    group.list.forEach(item => { if (item.code == cacheSprint) result = true });
  })
  return result
}

const getIterUserStoryListFn = () => {
  getIterUserStoryList({ sprintId: sprintId.value }).then(res => {
    if (res.success) iterUserStoryList.value = res?.data ?? []
  })
}

const getIterMembersFn = () => {
  getIterMembers({ sprintId: sprintId.value }).then(res => {
    if (res.success) dicStore.boardSprintUserList = res?.data ?? []
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

// 获取当前用户的所属项目下拉列表
const getUserProjectListFn = () => {
  getUserProjectList().then(res => {
    if (res.success) {
      dicStore.curUserProjectList = res?.data ?? []
    }
  })
}


const getDicListFn = async (code) => {
  getDicList(code).then(res => {
    if (res.success) {
      switch (code) {
        case 'TASK_PRIORITY':
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
        case 'DEFECT_STATUS':
          dicStore.defectStatusList = res?.data ?? []
          break;
        case 'PRIORITY':
          dicStore.priorityList = res?.data ?? []
          dicStore.defaultPriority = getDicDefaultVal(res.data)
          break;
        case 'DEFECT_TYPE':
          dicStore.defectTypeList = res?.data ?? []
          break;
        case 'DEFECT_SEVERITY':
          dicStore.severityList = res?.data ?? []
          break;
        case 'DEFECT_ENVIRONMENT':
          dicStore.defectEnvList = res?.data ?? []
          break;
        case 'DEFECT_RESOLUTION':
          dicStore.handleResultList = res?.data ?? []
          break;
        case 'BLOCKING_ISSUE_CATEGORY':
          dicStore.problemTypeList = res?.data ?? []
          dicStore.defaultProblemType = getDicDefaultVal(res.data)
          break;
        case 'BLOCKING_ISSUE_STATUS':
          dicStore.problemStatusList = res?.data ?? []
          dicStore.defaultProblemStatus = getDicDefaultVal(res.data)
          break;
        case 'BLOCKING_ISSUE_SOURCE':
          dicStore.problemSourceList = res?.data ?? []
          dicStore.defaultProblemSource = getDicDefaultVal(res.data)
          break;
      }
    }
  })
}

const handleChangeSprintId = () => {
  localStorage.setItem('agileBoard_sprintId', sprintId.value)
}

watch(() => sprintId.value, () => {
  getIterUserStoryListFn()
  getIterMembersFn()
})

watch(() => dicStore.globalProjectCode, (newVal) => {
  globalProjectName.value = localStorage.getItem('global_ProjectName')
  globalProjectStatus.value = localStorage.getItem('global_ProjectStatus')
  getUserIterationListFn()
})


onBeforeMount(() => {
  selectTab.value = localStorage.getItem('boardSelectTab') ?? '1'
  localStorage.removeItem('boardSelectTab')
  getUserIterationListFn()

  getAllUserListFn() // 用户下拉
  getUserProjectListFn()

  getDicListFn('TASK_PRIORITY')
  getDicListFn('TASK_STATUS')
  getDicListFn('TASK_TYPE')
  getDicListFn('DEFECT_STATUS') // 缺陷状态
  getDicListFn('PRIORITY') // 优先级
  getDicListFn('DEFECT_TYPE') // 缺陷类型
  getDicListFn('DEFECT_SEVERITY') // 严重程度
  getDicListFn('DEFECT_ENVIRONMENT') // 缺陷环境
  getDicListFn('DEFECT_RESOLUTION') // 处理结果

  getDicListFn('BLOCKING_ISSUE_CATEGORY') // 问题类型
  getDicListFn('BLOCKING_ISSUE_STATUS') // 问题状态
  getDicListFn('BLOCKING_ISSUE_SOURCE') // 问题来源

})
</script>

<style lang="scss" scoped>
.main-content {
  padding-bottom: 0;
  height: 100%;
  background: #fff;
}

/* 关键：伪装标题的容器样式 */
.group-header-content {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 12px;
  margin: 0 -20px; /* 填满整行 */
  font-weight: bold;
  font-size: 13px;

  .status-icon {
    margin-right: 6px;
    font-size: 14px;
  }

  &.is-ongoing {
    background-color: #f5faff;
    width: 130%;
    color: #409eff;
    font-size: 12px;
    line-height: 28px;
    height: 28px;
  }

  &.is-completed {
    background-color: #eefaf9;
    width: 130%;
    color: #67c23a;
    font-size: 12px;
    line-height: 28px;
    height: 28px;
  }

  &.is-default {
    background-color: #f6f8fa;
    width: 130%;
    color: #333333;
    font-size: 12px;
    line-height: 28px;
    height: 28px;
  }
}

/* 强制清除 el-option 作为标题时的默认样式 */
:deep(.custom-iteration-popper) {
  .el-select-dropdown__item.is-disabled.group-title-option {
    cursor: default;
    opacity: 1; /* 防止置灰透明度 */
    height: 34px;
    line-height: 34px;
    padding: 0 20px;
    color: inherit;
    
    &:hover {
      background-color: transparent; /* 禁止标题行 hover 变色 */
    }
  }

  /* 正常的选项稍微缩进，模拟分组感 */
  .iteration-item-option {
    padding-left: 30px;
  }
}

/* Tab 样式 */
.custom-tabs {
  :deep(.el-tabs__nav-wrap::after) { display: none; }
  :deep(.el-tabs__active-bar) { display: none; }
  :deep(.el-tabs__item) {
    font-size: 14px;
    height: 38px;
    line-height: 38px;
    color: #333;
    margin-right: 36px;
    padding: 0;
    position: relative;
    &.is-active {
      font-weight: 600;
      color: #2173f7;
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 32px;
        height: 2px;
        background-color: #2173f7;
      }
    }
  }
}

.status-icon-img{
  width: 14px;
  height: 14px;
}
</style>