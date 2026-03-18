<template>
  <div class="main-content">
    <div class="page-search">
      <div class="title-1">
        <div class="jus-start-center">
          <div class="title">迭代管理</div>
          <div class="sel-global-project">当前项目：{{ globalProjectName }} - {{ globalProjectStatus }}</div>
        </div>
        <div v-if="canAddIteration" class="btn-primary btn-margin-right addBtn" @click="operateFn('add')">
          <img :src="addIcon" alt="添加" class="btn-icon"/>
          添加迭代
        </div>
      </div>
      <!-- <div class="search-content jus-start-center bg-color-1 border-radius-8">
          <el-form ref="searchFromRef" :model="searchFrom">
              <el-form-item label="所属项目" prop="projectCode">
                  <el-select v-model="searchFrom.projectCode" placeholder="请选择" clearable style="width: 260px;">
                      <el-option v-for="item in projectList" :key="item.projectId" :label="item.name"
                          :value="item.projectId" />
                  </el-select>
              </el-form-item>
          </el-form>
          <div class="search-btn jus-flex-end">
              <div class="btn-primary btn-margin-right" @click="handleSerach">筛选</div>
              <div class="btn-circle" @click="handleReset">重置</div>
          </div>
      </div> -->
    </div>
    <el-tabs v-model="selectTab" class="custom-tabs" @tab-change="handleTabFn">
      <el-tab-pane :label="`进行中(${inProgressCount})`" name="1">
        <ListTable v-if="selectTab == '1'" :list="tableData" :type="1" @changeStatus="changeStatus"
                   @operateFn="operateFn"></ListTable>
      </el-tab-pane>
      <el-tab-pane :label="`未开始(${notStartedCount})`" name="2">
        <ListTable v-if="selectTab == '2'" :list="tableData" :type="2" @changeStatus="changeStatus"
                   @operateFn="operateFn"></ListTable>
      </el-tab-pane>
      <el-tab-pane :label="`已完成(${doneCount})`" name="3">
        <ListTable v-if="selectTab == '3'" :list="tableData" :type="3"></ListTable>
      </el-tab-pane>
      <el-tab-pane :label="`全部(${allNum})`" name="4">
        <ListTable v-if="selectTab == '4'" :list="tableData" :type="4" @changeStatus="changeStatus"
                   @operateFn="operateFn"></ListTable>
      </el-tab-pane>

    </el-tabs>
    <div v-if="selectTab == '3' || selectTab == '4'" class="paginationg-box">
      <pagination :currentPage="searchFrom.current" :pageSize="searchFrom.size" :total="total"
                  @currentPageCurrent="currentPageCurrent" @currentPageSize="currentPageSize">
      </pagination>
    </div>
  </div>
  <AddProject v-if="isOperateDia" :defaultStatus="defaultStatus" :isShow="isOperateDia" :projectInfo="detailInfo"
              :projectList="projectList" :statusList="stateList" :type="operateType"
              :userOptions="userOptions"
              @closeDiaFn="handleCloseDia" @confirmFn="handleAddData" @editConfirmFn="handleEditFn"></AddProject>
</template>
<script setup>
import {onBeforeMount, onMounted, reactive, ref, watch} from 'vue';
import ListTable from './components/ListTable.vue';
import AddProject from './components/AddProject.vue';
import pagination from '@/components/pagination.vue';
import {getAllProjectList, getAllUserList} from '@/api/demand.js'
import {
  addIteration,
  changeIterationStatus,
  editIteration,
  getIterationCount,
  getIterationInfo,
  getIterationList
} from '@/api/iterationApi.js'
import {ElMessage} from 'element-plus';
import {useDicStore} from '@/stores/dic.js';
import addIcon from "@/assets/webp/add.webp";

const dicStore = useDicStore()
const searchFrom = reactive({
  projectCode: '',
  size: 10,
  current: 1,
  status: '1',
});
const selectTab = ref('1')
const total = ref(100);
const searchFromRef = ref(null);
const loading = ref(false);
const userName = ref('');
const isOperateDia = ref(false)
const operateType = ref('')
const detailInfo = ref(null)
const stateList = ref([])
const defaultStatus = ref('')
const projectList = ref([]);
const tableData = ref([]);

const notStartedCount = ref('3')//未开始数量
const inProgressCount = ref('4')//进行中数量
const doneCount = ref('3')//已完成数量
const allNum = ref('11')//全部数量
const globalProjectName = ref(localStorage.getItem('global_ProjectName'))
const globalProjectStatus = ref(localStorage.getItem('global_ProjectStatus'))

const userOptions = ref()
const canAddIteration = ref() // 添加迭代权限
canAddIteration.value = JSON.parse(localStorage.getItem('agiles_user')).buttons.includes('iteration_add')

const handleSerach = () => {
  searchFrom.current = 1;
  getIterationCountFn()
  getList()
};

const handleReset = () => {
  searchFromRef.value.resetFields();
  searchFrom.current = 1;
  getIterationCountFn()
  getList()
};
const handleTabFn = () => {
  // console.log(selectTab.value, '--selectTab')
  searchFrom.size = 10;
  searchFrom.current = 1;
  getList()
}
const currentPageCurrent = (val) => {
  searchFrom.current = val
  getList()
}
const currentPageSize = (val) => {
  searchFrom.size = val
  searchFrom.current = 1
  getList()
}

function getList() {
  loading.value = true
  if (selectTab.value == '1' || selectTab.value == '2') {
    searchFrom.size = 1000
    searchFrom.current = 1
  }
  if (selectTab.value == '1') {
    searchFrom.status = 'in_progress'
  } else if (selectTab.value == '2') {
    searchFrom.status = 'not_started'
  } else if (selectTab.value == '3') {
    searchFrom.status = 'done'
  } else {
    searchFrom.status = undefined
  }
  getIterationList(searchFrom).then(res => {
    tableData.value = res.data.records;
    total.value = res.data.total;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  })
}

const handleCloseDia = () => {
  isOperateDia.value = false
  operateType.value = ''
  detailInfo.value = null
}
// 添加迭代
const handleAddData = (formData) => {
  let form = JSON.parse(JSON.stringify(formData))
  form.startDate = form.proDate[0]
  form.endDate = form.proDate[1]
  delete form.proDate
  // 数字类型的传参转化
  form.period = form.period || ''
  if (form.members.length == 1 && !form.members[0].userAccount && !form.members[0].availability) {
    form.members = []
  } else {
    form.members.forEach(item => {
      item.availability = item.availability || ''
    })
  }
  // console.log('form=====', form)
  addIteration(form).then(res => {
    if (res.success) {
      isOperateDia.value = false
      operateType.value = ''
      detailInfo.value = null
      getIterationCountFn()
      getList()
    }
  })
}
// 编辑迭代
const handleEditFn = (formData) => {
  let form = JSON.parse(JSON.stringify(formData))
  form.startDate = form.proDate[0]
  form.endDate = form.proDate[1]
  delete form.proDate
  // 数字类型的传参转化
  form.period = form.period || ''
  if (form.members.length == 1 && !form.members[0].userAccount && !form.members[0].availability) {
    form.members = []
  } else {
    form.members.forEach(item => {
      item.availability = item.availability || ''
    })
  }
  editIteration(form).then(res => {
    if (res.success) {
      operateType.value = ''
      detailInfo.value = null
      isOperateDia.value = false
      getList()
    }
  })
}
const operateFn = (id) => {
  if (id == 'add') {
    operateType.value = '添加'
    detailInfo.value = null
    isOperateDia.value = true
  } else {
    getIterationInfo(id).then(res => {
      if (res.success) {
        operateType.value = '编辑'
        detailInfo.value = res?.data ?? null
        isOperateDia.value = true
      }
    })
  }

}

// 修改迭代状态 开始/完成
const changeStatus = (id, status) => {
  let obj = {
    sprintId: id,
    status: status,
  }
  changeIterationStatus(obj).then(res => {
    if (res.success) {
      ElMessage.success('迭代状态修改成功')
      getIterationCountFn()
      getList()
    }
  })
}

// 获取所属项目下拉
const getAllProjectListFn = () => {
  getAllProjectList().then(res => {
    if (res.success) {
      projectList.value = res.data
    }
  })
}

// 获取人员下拉
const getAllUserListFn = () => {
  getAllUserList().then(res => {
    if (res.success) {
      userOptions.value = res?.data ?? []
    }
  })
}

// 获取迭代管理各状态下列表数据条数
const getIterationCountFn = () => {
  let params = {
    projectCode: searchFrom.projectCode || undefined,
  }
  // console.log('params===', params)
  getIterationCount(params).then(res => {
    if (res.success) {
      notStartedCount.value = res.data.notStartedCount
      inProgressCount.value = res.data.inProgressCount
      doneCount.value = res.data.doneCount
      allNum.value = res.data.total
    }
  })
}

watch(() => dicStore.globalProjectCode, (newVal) => {
  globalProjectName.value = localStorage.getItem('global_ProjectName')
  globalProjectStatus.value = localStorage.getItem('global_ProjectStatus')
  searchFrom.projectCode = newVal
  handleSerach()
})

onMounted(() => {
  getAllProjectListFn()
  searchFrom.projectCode = localStorage.getItem('global_ProjectCode') // 初始赋值：从缓存中取
  getAllUserListFn() // 获取成员列表
  getIterationCountFn()
  getList()
})

onBeforeMount(() => {
  if (localStorage.getItem('iteraTab')) {
    selectTab.value = localStorage.getItem('iteraTab')
  }
})

</script>
<style lang="scss" scoped>
.main-content {
  .page-search {
    margin-bottom: 12px;

    .title-1 {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        font-size: 16px;
        font-weight: bold;
      }

      .addBtn {
        width: 94px;
        font-size: 14px;
      }
    }

    .search-content {
      gap: 30px;
      margin-top: 25px;
      padding: 0 20px;
      height: 72px;

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
      min-height: 28px;
      border-radius: 4px;
    }
  }

  .page-table {
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
}

.btn-primary {
  border-radius: 4px;
}

// ------------------------ Tab 样式修改开始 ------------------------
.custom-tabs {
  // 1. 隐藏自带的底部灰色长线
  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }

  // 2. 隐藏 Element Plus 默认的蓝色滑动条 (因为它宽度是跟随文字的，不好强制设为32px)
  :deep(.el-tabs__active-bar) {
    display: none;
  }

  // 3. 自定义 Tab Item 样式
  :deep(.el-tabs__item) {
    font-size: 14px;
    height: 38px;
    line-height: 38px;
    color: #333; // 默认颜色，可根据需要调整
    font-weight: normal;
    margin-right: 36px;
    padding: 0; // 控制间距
    position: relative; // 为伪元素定位做准备

    // 选中状态下的样式
    &.is-active {
      font-weight: 600;
      color: var(--el-color-primary); // 保持主题色，通常是蓝色

      // 使用伪元素画出 32px 的短线
      &::after {
        content: '';
        position: absolute;
        bottom: 0; // 贴底
        left: 50%; // 居中
        transform: translateX(-50%); // 修正居中偏移
        width: 32px; // 【关键】固定宽度
        height: 2px; // 【关键】固定高度
        background-color: var(--el-color-primary); // 线条颜色跟随主题色
        border-radius: 1px; // 可选：让线条稍微圆润一点
      }
    }
  }
}
// ------------------------ Tab 样式修改结束 ------------------------


.btn-plus{
  margin-right: 1px;
  vertical-align: -2px;
}
</style>