<template>
  <div class="demand-main">
    <DemandListVue></DemandListVue>
    <!-- <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="需求列表" name="1">
            <DemandListVue v-if="activeTab == '1'"></DemandListVue>
        </el-tab-pane>
        <el-tab-pane label="需求进度" name="2">
            <ProgressList v-if="activeTab == '2'"></ProgressList>
        </el-tab-pane>
    </el-tabs> -->
  </div>
</template>
<script setup>
import {onBeforeMount, ref} from 'vue';
import {getDicDefaultVal} from '@/utils';
import DemandListVue from './components/DemandList.vue';
import {getDicList} from '@/api/api.js';
import {useDicStore} from '@/stores/dic.js';
import {getAllProjectList, getRoleUserList} from '@/api/demand.js';

const dicStore = useDicStore()
const activeTab = ref("1")
const getDicListFn = async (code) => {
  await getDicList(code).then(res => {
    if (res.success) {
      switch (code) {
        case 'REQ_TYPE':
          dicStore.requirementTypeList = res?.data ?? []
          dicStore.defaultRequire = getDicDefaultVal(res.data)
          break;
        case 'PRIORITY':
          dicStore.priorityList = res?.data ?? []
          dicStore.defaultPriority = getDicDefaultVal(res.data)
          break;
        case 'REQ_STATUS':
          dicStore.statusList = res?.data ?? []
          dicStore.defaultStatus = getDicDefaultVal(res.data)
          break;
        case 'REQ_PROGRESS':
          dicStore.progressList = res?.data ?? []
          dicStore.defaultProgress = getDicDefaultVal(res.data)
          break;
      }
    }
  })
}
const getAllProjectListFn = async () => {
  await getAllProjectList().then(res => {
    if (res.success) {
      dicStore.projectList = res?.data ?? []
    }
  })
}
const getAllUserListFn = async () => {
  await getRoleUserList('BRA').then(res => {
    if (res.success) {
      dicStore.userRoleList = res?.data ?? []
    }
  })
  await getRoleUserList('PO').then(res => {
    if (res.success) {
      dicStore.userPOList = res?.data ?? []
    }
  })
}
onBeforeMount(async () => {
  dicStore.userName = JSON.parse(localStorage.getItem("agiles_user")).name
  await getAllProjectListFn()
  await getDicListFn('REQ_TYPE')
  await getDicListFn('PRIORITY')
  await getDicListFn('REQ_STATUS')
  await getDicListFn('REQ_PROGRESS')
  await getAllUserListFn()
})

</script>
<style lang="scss" scoped>
.demand-main {
  background: #f6f8fc;
  height: 100%;
  padding: 12px 20px 0 20px;

  :deep(.el-tabs) {
    .el-tabs__header {
      .el-tabs__nav {
        border: none !important;
      }

      .el-tabs__item {
        font-family: PingFang;
        border-left: none !important;
        font-size: 18px !important;
        color: #303133 !important;
        font-weight: 500 !important;
      }

      .is-active {
        border-top: 2px solid #e4e7ed;
        border-left: 1px solid #e4e7ed !important;
        border-right: 1px solid #e4e7ed;
        background: #ffff;
        color: #2173f7 !important;
        font-weight: 500 !important;
        // font-size: 18px !important;
      }
    }

  }

}
</style>