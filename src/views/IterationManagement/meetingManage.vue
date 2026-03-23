<template>
  <div class="main-content">
    <MenuBreadCom :isThreeLevel="true" :name="name" :secName="secName"></MenuBreadCom>
    <div class="header">
      <div class="header-left">
        <div>{{ secName }} - 会议管理</div>
      </div>
      <div class="jus-end-center">
        <div class="btn-primary btn-margin-right addBtn" @click="operaAddDialog"><img :src="addIcon" alt="添加"
                                                                                      class="btn-icon"/>添加会议
        </div>
      </div>
    </div>

    <div class="page-table">
      <el-table v-loading="loading" :data="tableData" :header-cell-style="TableRowStyle" fit
                max-height="calc(100vh - 470px)"
                scrollbar-always-on show-overflow-tooltip
                stripe style="width: 100%;min-height: 200px;">
        <el-table-column v-for="(item, index) in tableColums.filter(item => item.isSelect == true)"
                         :key="item.prop + index" :align="item.prop == 'meetingStatus' ? 'center' : 'left'"
                         :fixed="item.prop == 'defectTitle' ? 'left' : false" :label="item.label"
                         :min-width="item.width">
          <template #default="{ row, column, $index }">
            <div v-if="item.prop == 'meetingStatus'"
                 :class="{ 'status-black': row[`${item.prop}`] === '未开始', 'status-blue': row[`${item.prop}`] === '进行中', 'status-green': row[`${item.prop}`] === '已结束' }"
                 class="project-tag1">
              {{ row[`${item.prop}`] }}
            </div>

            <span v-else>
                            {{ row[`${item.prop}`] !== null && row[`${item.prop}`] !== '' ? row[`${item.prop}`] : '-' }}
                        </span>
          </template>
        </el-table-column>

        <el-table-column align="left" fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button class="btn-text-primary text-btn" type="text"
                       @click="handleEditFn(scope.row, 'view')">
              <el-tooltip content="查看" effect="light" popper-class="fix-tooltip" placement="top">
                <img :src="viewIcon" alt="查看" class="table-icon"/>
              </el-tooltip>
            </el-button>
            <el-button v-if="globeStatus !== '已完成'" class="btn-text-primary text-btn" type="text"
                       @click="handleEditFn(scope.row, 'edit')">
              <el-tooltip content="编辑" effect="light" placement="top" popper-class="fix-tooltip">
                <img :src="editIcon" alt="编辑" class="table-icon"/>
              </el-tooltip>
            </el-button>
            <el-button v-if="globeStatus !== '已完成'" :class="{ 'disabled-btn': scope.row.meetingStatus == '已结束'}"
                       :disabled="scope.row.meetingStatus == '已结束'" class="btn-text-danger text-btn"
                       type="text"
                       @click="handleDelete(scope.row)">
              <el-tooltip content="删除" effect="light" placement="top" popper-class="fix-tooltip">
                <img v-if="scope.row.meetingStatus == '已结束'" :src="deleteGrayIcon" alt="删除" class="table-icon"/>
                <img v-else :src="deleteIcon" alt="删除" class="table-icon"/>
              </el-tooltip>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <AddMeet v-if="isOperateAddDia" :isShow="isOperateAddDia" @closeDiaFn="handleCloseAddDia"
             @confirmFn="handleAddMeet"/>
    <EditMeet v-if="isOperateEditDia" :detailInfo="detailInfo" :isShow="isOperateEditDia" :type="operateType"
              @closeDiaFn="handleCloseEditDia"
              @confirmFn="handleEditMeet"/>
  </div>
</template>

<script setup>
import {onBeforeMount, ref} from 'vue';
import {useRoute} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus';
import {getDicDefaultVal, TableRowStyle} from '@/utils';
import MenuBreadCom from './components/MenuBreadCom.vue';
import AddMeet from './components/AddMeet.vue';
import EditMeet from './components/EditMeet.vue';
import {useDicStore} from '@/stores/dic.js';
import {getDicList, getIterMembers, getIterUserStoryList} from '@/api/api';
import {deleteMeeting, getMeetingInfo, getMeetingList, saveMeeting, updateMeeting} from '@/api/iterationApi';
import addIcon from "@/assets/webp/add.webp";
import editGrayIcon from "@/assets/webp/edit_gray.webp";
import editIcon from "@/assets/webp/edit.webp";
import deleteGrayIcon from "@/assets/webp/delete_gray.webp";
import deleteIcon from "@/assets/webp/delete.webp";
import viewIcon from "@/assets/webp/view-icon.webp";


const dicStore = useDicStore()
const route = useRoute()
const secName = ref('')
const sprintId = ref('')
const globeStatus = ref('')
const name = ref('会议管理')

const loading = ref(false)
const tableColums = ref([
  {
    label: '会议主题',
    prop: 'meetingTopic',
    isSelect: true,
    width: '280',
    showTooltip: true,
  },
  {
    label: '会议类型',
    prop: 'meetingType',
    isSelect: true,
    width: '120',
    showTooltip: true
  },
  {
    label: '会议时间',
    prop: 'meetingTime',
    isSelect: true,
    width: '280',
    showTooltip: true
  },
  {
    label: '地点',
    prop: 'meetingPlace',
    isSelect: true,
    width: '150',
    showTooltip: true
  },
  {
    label: '状态',
    prop: 'meetingStatus',
    isSelect: true,
    width: '100',
    showTooltip: true
  },
  {
    label: '参与人数',
    prop: 'participantsCount',
    isSelect: true,
    width: '80',
    showTooltip: true
  },
])
const total = ref(0)
const tableData = ref([])
const isOperateAddDia = ref(false)
const isOperateEditDia = ref(false)
const operateType = ref('')
const detailInfo = ref()


const operaAddDialog = () => {
  isOperateAddDia.value = true
}

const handleCloseAddDia = () => {
  isOperateAddDia.value = false
}

// 创建迭代会议
const handleAddMeet = (obj) => {
  let form = JSON.parse(JSON.stringify(obj))
  form.sprintId = sprintId.value
  delete form.meetingTime

  saveMeeting(form).then(res => {
    if (res.success) {
      ElMessage.success('创建成功')
      handleCloseAddDia()
      getList()
    }
  })
}

const handleCloseEditDia = () => {
  isOperateEditDia.value = false
}

const handleEditFn = (row, type) => {
  // 调用接口查详情
  if (type == 'edit') {
    operateType.value = '编辑'
  } else {
    operateType.value = '查看'
  }

  getMeetingInfo(row.id).then(res => {
    if (res.success) {
      detailInfo.value = res.data
      isOperateEditDia.value = true
    }
  })
}

// 编辑测试用例
const handleEditMeet = (obj) => {
  let form = JSON.parse(JSON.stringify(obj))
  delete form.meetingTime
  updateMeeting(form).then(res => {
    if (res.success) {
      ElMessage.success('修改成功')
      handleCloseEditDia()
      getList()
    }
  })
}


const handleDelete = (row) => {
  ElMessageBox.confirm('会议信息删除后不可恢复，请谨慎操作，是否确认删除', '', {
    cancelButtonText: '取消',
    confirmButtonText: '确认',
    center: false,
    closeOnClickModal: false,
    autofocus: false,
    type: 'warning',
  }).then(() => {
    deleteMeeting(row.id).then(res => {
      if (res.success) {
        ElMessage.success('删除成功')
        getList()
      } else {
        ElMessage.error(res.msg)
      }
    })
  }).catch(() => {
    console.log('已取消')
  })
}


const getList = () => {
  loading.value = true
  getMeetingList(sprintId.value).then(res => {
    tableData.value = res.data
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}

// 获取字典
const getDicListFn = (type) => {
  getDicList(type).then(res => {
    if (res.success) {
      if (type == 'MEETING_TYPE') {
        dicStore.iteraMeetingType = res.data ?? []
        dicStore.defaultIteraMeetingType = getDicDefaultVal(res.data)

      } else if (type == 'MEETING_STATUS') {
        dicStore.iteraMeetingStatus = res.data ?? []
        dicStore.defaultIteraMeetingStatus = getDicDefaultVal(res.data)
      }
    }
  })
}

const getIteraUserListFn = async () => {
  let params = {
    sprintId: sprintId.value
  }
  await getIterMembers(params).then(res => {
    if (res.success) {
      dicStore.iteraUserList = res?.data ?? []
    }
  })
}

// 获取迭代下的用户故事
const getIterUserStoryListFn = () => {
  let params = {
    sprintId: sprintId.value || undefined
  }
  getIterUserStoryList(params).then(res => {
    if (res.success) {
      dicStore.iteraUserStoryList = res?.data ?? []
    }
  })
}

onBeforeMount(() => {
  secName.value = route.query.name
  sprintId.value = route.query.sprintId
  globeStatus.value = route.query.status
  getIterUserStoryListFn() // 迭代下的用户故事
  getDicListFn('MEETING_TYPE') // 迭代会议类型
  getDicListFn('MEETING_STATUS') // 迭代会议状态
  getIteraUserListFn() // 获取迭代成员
  getList()
})
</script>

<style lang="scss" scoped>
.main-content {
  height: 100%;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;

    .header-left {
      display: flex;
      align-items: center;

      & > div:nth-child(1) {
        font-size: 16px;
        font-weight: bold;
        margin-right: 10px;
      }
    }

    .addBtn {
      border-radius: 4px;
      padding: 0 12px;

      .btn-icon {
        margin-right: 4px;
      }
    }

    margin-bottom: 12px;
  }

  .project-tag1 {
    display: block;
    width: 55px;
    text-align: center;
    font-family: 'Microsoft YaHei', 'PingFang SC';
    font-weight: 400;
    font-size: 12px;
    border-radius: 4px;
    height: 22px;
    line-height: 22px;
    margin: 0 auto;
  }

  .disabled-btn {
    color: #B2B2B2 !important;
    cursor: default;
  }
}

:deep(.el-popper) {
  max-width: 450px !important;
}

.page-table{
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
}
</style>