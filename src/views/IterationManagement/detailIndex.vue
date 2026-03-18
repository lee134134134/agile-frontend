<template>
  <div class="main-content">
    <MenuBreadCom :name="detailObj.name"></MenuBreadCom>
    <div class="header">
      <div class="header-left">
        <div>{{ detailObj.name }}</div>
        <div :class="{'no': detailObj.status === '未开始', 'completed': detailObj.status === '已完成'}"
             class="btn-primary btn-margin-right tips">
          {{ detailObj.status || '-' }}
        </div>
        <div>{{ detailObj.periodDate }}</div>
      </div>
      <div class="jus-end-center">
        <div v-if="canAddIteraStory && detailObj.status !== '已完成'" class="btn-primary btn-margin-right addBtn"
             @click="operateFnAdd"><img :src="addIcon" alt="添加" class="btn-icon"/>添加用户故事
        </div>
        <div class="btn-primary btn-margin-right addBtn" @click="goMeetingManage"><img :src="manageIcon" alt="导出"
                                                                                       class="btn-icon"/>迭代会议管理
        </div>
      </div>
    </div>
    <div class="content">
      <div class="content-left">
        <div class="content-left-item">
          <img alt="" src="@/assets/webp/team.webp">
          <div class="content-left-item-title">
            <h4>{{ detailObj.teamName || '-' }}</h4>
            <p>所属项目：{{ detailObj.projectName || '-' }}</p>
          </div>
        </div>
        <div class="content-left-item-content">
          <div class="item-content flex">
            <div class="text flex">
              <span>项目负责人：</span>
              <p>{{ detailObj.projectLeaderName || '-' }}</p>
            </div>
            <div class="text flex">
              <span>需求分析人：</span>
              <p>{{ detailObj.productOwner || '-' }}</p>
            </div>
          </div>
          <div class="item-content flex">
            <div class="text flex">
              <span>产品负责人：</span>
              <p>{{ detailObj.productLeaderName || '-' }}</p>
            </div>
            <div class="text flex">
              <span>Scrum Master：</span>
              <p>{{ detailObj.scrumMaster || '-' }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="content-right">
        <div class="content-right-item">
          <p class="item-title">总故事数</p>
          <div class="item-number">{{ detailObj?.storyTotal ?? '-' }}</div>
          <p class="item-title">已完成故事数</p>
          <div class="item-number">{{ detailObj?.completedStories ?? '-' }}</div>
        </div>
        <div class="content-right-item">
          <p class="item-title">总故事点</p>
          <div class="item-number">{{ detailObj?.totalStoryPoints ?? '-' }}</div>
          <p class="item-title">完成率
            <el-popover width="310" content="完成率 = 已完成故事数 / 全部故事数 * 100%">
              <template #reference>
                <el-icon style="vertical-align: -1px;">
                  <Warning/>
                </el-icon>
              </template>
            </el-popover>
          </p>
          <div class="item-number">{{ (detailObj?.completionRate ?? 0) * 100 + '%' }}</div>
        </div>
        <div class="content-right-item">
          <p class="item-title">可用工作日</p>
          <div class="item-number">{{ detailObj?.period ?? '-' }}</div>
        </div>
      </div>
      <div class="content-item">
        <div class="content-item-title">团队成员</div>
        <UserTable :teamMembers="detailObj.teamMembers"></UserTable>
      </div>
    </div>
    <el-tabs class="list-tabs" v-model="selectTab">
      <el-tab-pane :label="`待处理（${todoCount}）`" name="1">
        <ListDetailTable v-if="selectTab == '1'" :list="todoList" :detail="detailObj" :type="1" @operateFnEdit="operateFnEdit"
                         @operateFnRemove="operateFnRemove"></ListDetailTable>
      </el-tab-pane>
      <el-tab-pane :label="`开发中（${inProgressCount}）`" name="2">
        <ListDetailTable v-if="selectTab == '2'" :list="inProgressList" :detail="detailObj" :type="2" @operateFnEdit="operateFnEdit"
                         @operateFnRemove="operateFnRemove"></ListDetailTable>
      </el-tab-pane>
      <el-tab-pane :label="`测试中（${testingCount}）`" name="3">
        <ListDetailTable v-if="selectTab == '3'" :list="testList" :detail="detailObj" :type="3" @operateFnEdit="operateFnEdit"
                         @operateFnRemove="operateFnRemove"></ListDetailTable>
      </el-tab-pane>
      <el-tab-pane :label="`已完成（${doneCount}）`" name="4">
        <ListDetailTable v-if="selectTab == '4'" :list="doneList" :detail="detailObj" :type="4" @operateFnEdit="operateFnEdit"
                         @operateFnRemove="operateFnRemove"></ListDetailTable>
      </el-tab-pane>
      <el-tab-pane :label="`全部（${allNum}）`" name="5">
        <ListDetailTable v-if="selectTab == '5'" :list="totalList" :detail="detailObj" :type="5" @operateFnEdit="operateFnEdit"
                         @operateFnRemove="operateFnRemove"></ListDetailTable>
      </el-tab-pane>

    </el-tabs>
  </div>
  <EditDetail v-if="isOperateDia" :isShow="isOperateDia" :storyInfo="storyInfo" :userOptions="userOptions"
              @closeDiaFn="handleCloseDia"
              @editConfirmFn="handleEditFn"></EditDetail>
  <AddDetail v-if="isOperateDiaAdd" :isShow="isOperateDiaAdd" :iterProjectList="iterProjectList"
             :projectCode="detailObj.projectCode" @closeDiaFn="handleCloseDiaAdd"
             @confirmFn="handleAddStoryToInteration"></AddDetail>
</template>
<script setup>
import {onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus';
import MenuBreadCom from './components/MenuBreadCom.vue';
import UserTable from './components/UserTable.vue'
import ListDetailTable from './components/ListDetailTable.vue';
import EditDetail from './components/EditDetail.vue';
import AddDetail from './components/AddDetail.vue';
import {
  addStoryToIteration,
  editIterationStory,
  getIterationInfo,
  getIterationProjectList,
  getIterationStoryList,
  getIterMembers,
  removeIterationStory
} from '@/api/iterationApi.js'
import {getDicList} from '@/api/api';
import {useDicStore} from '@/stores/dic.js';
import {getDicDefaultVal} from '@/utils';
import addIcon from "@/assets/webp/add.webp";
import manageIcon from "@/assets/images/ui/manage.png";
import {Warning} from "@element-plus/icons-vue";

const dicStore = useDicStore()
const route = useRoute()
const router = useRouter()
let sprintId = ''
const detailObj = ref({})

const todoCount = ref('0')//待处理数量
const inProgressCount = ref('0')//开发中数量
const testingCount = ref('0')//测试中数量
const doneCount = ref('0')//已完成数量
const allNum = ref('0')//全部数量
const todoList = ref(null)
const inProgressList = ref(null)
const testList = ref(null)
const doneList = ref(null)
const totalList = ref(null)

let activesName = ref(['0'])
const selectTab = ref('1')

const isOperateDia = ref(false)

// 添加
const isOperateDiaAdd = ref(false)
const detailInfoAdd = ref(null)

const iterProjectList = ref([])

const storyInfo = ref(null)
const pointOptions = ref() // 故事点下拉
const statusOptions = ref() // 状态下拉
const priorityOptions = ref() // 优先级下拉
const userOptions = ref() // 
const canAddIteraStory = ref() // 添加用户故事权限
canAddIteraStory.value = JSON.parse(localStorage.getItem('agiles_user')).buttons.includes('iteration_story_add')

// 编辑用户故事
const operateFnEdit = (row) => {
  storyInfo.value = row
  isOperateDia.value = true
}
const handleCloseDia = () => {
  isOperateDia.value = false
  storyInfo.value = null
}
const handleEditFn = (form) => {
  let params = {
    sprintId: form.sprintId,
    userStoryId: form.userStoryId,
    storyPoint: form.storyPoints,
    status: form.status,
    priority: form.priority,
    assigneeAccount: form.userName,
  }
  editIterationStory(params).then(res => {
    if (res.success) {
      ElMessage.success('保存成功')
      handleCloseDia()
      getIterationDetailFn()
      getIterationStoryListFn()
    }
  })
}

// 移除用户故事
const operateFnRemove = (row) => {
  ElMessageBox.confirm(`确认移除该用户故事吗？`, '', {
    cancelButtonText: '取消',
    confirmButtonText: '确认',
    center: false,
    closeOnClickModal: false,
    autofocus: false,
    type: 'warning',
  }).then(() => {
    let params = {
      sprintId: row.sprintId,
      storyCodes: row.userStoryId
    }
    removeIterationStory(params).then(res => {
      if (res.success) {
        ElMessage.success('移除成功')
        getIterationDetailFn()
        getIterationStoryListFn()
      } else {
        // ElMessage.error(res.msg)
      }
    })
  }).catch(() => {
    console.log('已取消')
  })
}

// 添加
const operateFnAdd = (id) => {
  isOperateDiaAdd.value = true
}
const handleCloseDiaAdd = () => {
  isOperateDiaAdd.value = false
  detailInfoAdd.value = null
}

// 添加故事到迭代
const handleAddStoryToInteration = (storyCodes) => {
  console.log(storyCodes)
  let params = {
    sprintId: sprintId,
    storyCodes: storyCodes,
  }
  // console.log('params====', params)
  addStoryToIteration(params).then(res => {
    if (res.success) {
      ElMessage.success('添加成功')
      handleCloseDiaAdd()
      getIterationDetailFn()
      getIterationStoryListFn()
    }
  })
}

// 获取迭代详情
const getIterationDetailFn = () => {
  getIterationInfo(sprintId).then(res => {
    if (res.success) {
      detailObj.value = res?.data ?? null
    }
  })
}

// 获取迭代下故事列表
const getIterationStoryListFn = () => {
  getIterationStoryList({sprintId: sprintId}).then(res => {
    if (res.success) {
      todoCount.value = res.data.countsVO.todoCount
      inProgressCount.value = res.data.countsVO.inProgressCount
      testingCount.value = res.data.countsVO.testingCount
      doneCount.value = res.data.countsVO.doneCount
      allNum.value = res.data.countsVO.total
      todoList.value = res.data.todo
      inProgressList.value = res.data.inProgress
      testList.value = res.data.test
      doneList.value = res.data.done
      totalList.value = res.data.total
    }
  })
}

// 获取迭代下任务
const getIterationProjectListFn = () => {
  getIterationProjectList({sprintId: sprintId}).then(res => {
    if (res.success) {
      iterProjectList.value = res.data
    }
  })
}

const getDicListFn = (type) => {
  getDicList(type).then(res => {
    if (res.success) {
      if (type == 'STORY_POINT') {
        dicStore.storyPointOptions = res.data ?? []
        dicStore.defaultStoryPoint = getDicDefaultVal(res.data)
      } else if (type == 'STORY_STATUS') {
        dicStore.storyStatusOptions = res.data ?? []
        dicStore.defaultStoryStatus = getDicDefaultVal(res.data)
      } else if (type == 'PRIORITY') {
        dicStore.priorityList = res.data ?? []
        dicStore.defaultPriority = getDicDefaultVal(res.data)
      }
    }
  })
}

// const getAllUserListFn = async () => {
//   await getAllUserList().then(res => {
//       if (res.success) {
//           userOptions.value = res?.data ?? []
//       }
//   })
// }

const getUserListFn = async () => {
  await getIterMembers({sprintId: sprintId}).then(res => {
    if (res.success) {
      userOptions.value = res?.data ?? []
    }
  })
}

// 迭代会议管理
const goMeetingManage = () => {
  // router.push('/iterationManagement/meeting')
  router.push({name: 'iterationManagementMeeting', query: {name: detailObj.value.name, sprintId: sprintId, status: detailObj.value.status }})
}

onMounted(() => {
  sprintId = route.query.id
  getIterationDetailFn()
  getIterationStoryListFn()
  getIterationProjectListFn()
  getDicListFn('STORY_POINT') // 故事点
  getDicListFn('STORY_STATUS') // 状态
  getDicListFn('PRIORITY') // 优先级
  // getAllUserListFn()
  getUserListFn()
})

</script>
<style lang="scss" scoped>
:deep(.el-collapse) {
  --el-collapse-header-bg-color: transparent !important;
  --el-collapse-content-bg-color: transparent !important;
  border: none;
}

:deep(.el-collapse-item__wrap), :deep(.el-collapse-item__header) {
  border: none;
}

:deep(.el-collapse-item__title) {
  font-size: 16px;
  font-weight: bold;
}

.icon-ele {
  font-size: 14px;
  color: #1d1d1d;
}

:deep(.el-tabs) {
  .el-tabs__header {
    .el-tabs__nav {
      border: none !important;
    }

    .el-tabs__item {
      font-size: 14px !important;
      color: #666 !important;
      margin-top: 0 !important;
      padding: 0 16px;
    }

    .is-active {
      color: #2173f7 !important;
      font-weight: 600 !important;
    }
  }
}

.main-content {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    margin-bottom: 12px;

    .header-left {
      display: flex;
      align-items: center;

      & > div:nth-child(1) {
        font-size: 16px;
        font-weight: bold;
        margin-right: 10px;
      }

      & > div:nth-child(2) {
        width: 52px;
        height: 22px;
        line-height: 22px;
        font-size: 12px;
        margin-right: 10px;
      }

      & > div:nth-child(3) {
        font-size: 12px;
        color: #666;

      }
    }

    .addBtn {
      width: 116px;
      border-radius: 4px;
    }
  }

  .content {
    display: flex;
    justify-content: space-between;
    height: 228px;
    margin-bottom: 10px;
    gap: 16px;

    .content-left {
      padding: 24px 15px;
      border: 2px solid #fff;
      box-sizing: border-box;
      flex: 2;
      flex-shrink: 0;
      border-radius: 8px;
      background: linear-gradient(165deg, #f1f7ff 0%, #fff 100%);
      border-image: linear-gradient(142deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.67), rgba(255, 255, 255, 1)) 2 2;

      .content-left-item {
        display: flex;
        width: 100%;
        padding-bottom: 16px;
        border-bottom: 1px solid #e2e4e8;

        img {
          width: 64px;
          height: 64px;
        }

        .content-left-item-title {
          margin-left: 16px;
          margin-top: 6px;

          h4 {
            font-size: 16px;
            color: #333;
            font-weight: bold;
          }

          p {
            margin-top: 12px;
            font-size: 14px;
            color: #666;
          }
        }
      }

      .content-left-item-content {
        margin-top: 24px;

        .item-content {

          .text {
            flex: 1;
            gap: 20%;
            font-size: 14px;
            margin-bottom: 12px;

            span{
              color: #999;
              display: inline-block;
              width: 107px;
            }

            p{
              color: #333;
            }
          }
        }
      }
    }

    .el-text {
      width: 100%;
    }

    .content-right {
      padding: 16px;
      width: 460px;
      flex-shrink: 0;
      background: #fff;
      border-radius: 8px;
      display: flex;
      gap: 16px;

      .content-right-item {
        flex: 1;
        padding: 16px 24px;
        background: #f7f8fa;
        border-radius: 8px;

        .item-title {
          font-size: 14px;
          color: #666;
          margin-bottom: 10px;
        }

        .item-number {
          font-size: 28px;
          color: #333;
          font-weight: bold;
          margin-bottom: 16px;
        }
      }

    }

    .content-item {
      padding: 16px;
      flex: 1;
      flex-shrink: 0;
      background: #fff;
      border-radius: 8px;

      .content-item-title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        margin-bottom: 24px;
      }
    }
  }

  .team-user {
    margin-bottom: 40px;
  }
}

.tips {
  color: #fff;
  padding: 0 6px;
  height: 22px;
  line-height: 22px;
  border-radius: 4px;
  background: #ff7d00;
  font-size: 12px;

  &.no {
    background: #86909c;
  }

  &.completed {
    background: #04b42a;
  }
}

.btn-icon {
  width: 14px;
  margin-right: 6px;
  vertical-align: -2px;
}

.list-tabs{
  background: #fff;
  border-radius: 8px;
  padding: 12px 16px;
}
</style>