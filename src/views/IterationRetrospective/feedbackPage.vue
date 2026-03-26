<template>
  <div class="main-content">
    <MenuBreadCom :page="pageName"></MenuBreadCom>

    <div class="page-search">
      <div class="jus-bet-center">
        <div class="title-1">{{ sprintName }} - 迭代意见箱</div>
        <div class="btn-list jus-start-center gap12">
          <div class="opt-btn" @click="openAddVoteDia">提交意见</div>
        </div>
      </div>
      <div class="search-content jus-bet-start border-radius-8">
        <el-form ref="searchFormRef" :model="searchForm" label-position="left">
          <div class="flex gap12">
            <el-form-item label="解决方案状态" prop="solutionStatus">
              <el-select v-model="searchForm.solutionStatus" clearable placeholder="请选择"
                         style="width: 200px;">
                <el-option v-for="item in solutionStatuOption" :key="item.value"
                           :label="item.name" :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="意见类型" prop="opinionType">
              <el-select v-model="searchForm.opinionType" clearable placeholder="请选择"
                         style="width: 120px;">
                <el-option v-for="item in dicStore.prosConsList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <div class="search-btn jus-flex-end">
              <div class="btn-primary btn-margin-right" @click="getDataList">
                <el-icon class="mr-3">
                  <Search/>
                </el-icon>
                筛选
              </div>
              <div class="btn-circle" @click="handleReset">
                <el-icon class="mr-3">
                  <RefreshLeft/>
                </el-icon>
                重置
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>

    <div class="summary-list-content">
      <div class="header-title jus-start-center">
        <div class="title-1 title-2">意见列表 <span class="header-tag"></span></div>
        <div class="vote-tips">
          您在当前迭代中已投 <b>{{ voteYz }}/{{ voteAll }}</b> 票，还可投 <b>{{ voteAll - voteYz }}</b> 票
        </div>
      </div>
      <div class="inner-content">
        <div v-for="item in voteList" :key="item" class="vote-item">
          <VoteCard :voteInfo="item" @openAddSolution="openAddSolutionDia"
                    @openAddSolutionDiaEdit="openAddSolutionDiaEdit"
                    @openAddVote="openAddVoteDia1" @operateVoteFn="operateVoteFn"/>

        </div>
      </div>
    </div>

    <AddVote v-if="isShowAddVoteDia" :detailInfo="detailInfo" :isShow="isShowAddVoteDia" :type="optionType"
             @closeDiaFn="closeAddVoteDia" @confirmFn="handleAddOpinion" @operateVoteFn="operateVoteFn"/>
    <AddSolution v-if="isShowAddSolutionDia" :detailInfo="solutionDetailInfo" :isShow="isShowAddSolutionDia"
                 :type="optionSolutionType" @closeDiaFn="closeAddSolutionDia"
                 @confirmFn="handleAddSolution"/>
  </div>
</template>

<script setup>
import {onBeforeMount, reactive, ref} from 'vue';
import MenuBreadCom from './components/MenuBreadCom.vue';
import VoteCard from './components/VoteCard.vue';
import AddVote from './components/AddVote.vue';
import AddSolution from './components/AddSolution.vue';
import {useDicStore} from '@/stores/dic.js';
import {
  AddSolutionInfo,
  getSolutionInfo,
  getVoteInfo,
  getVoteList,
  getVoteResult,
  handleAddVote,
  handleVote
} from '@/api/iterationReviewApi.js';
import {getAllUserList, getDicList} from '@/api/api';
import {useRoute} from 'vue-router'
import {ElMessage} from 'element-plus';
import {RefreshLeft, Search} from "@element-plus/icons-vue";

const route = useRoute();
const dicStore = useDicStore()

const curSprintId = ref('')
const sprintName = ref('')
const pageName = ref('意见反馈')
const solutionStatuOption = ref([
  {name: '已有解决方案', value: '1'},
  {name: '无解决方案', value: '2'},
])
const searchFormRef = ref(null)
const searchForm = reactive({
  solutionStatus: '',
  opinionType: '',
})
const voteList = ref([]) // 意见列表
const isShowAddVoteDia = ref(false) // 是否展示添加意见弹窗
const optionType = ref('')
const detailInfo = ref('')
const isShowAddSolutionDia = ref(false) // 是否展示解决方案弹窗
const optionSolutionType = ref('')
const solutionDetailInfo = ref('')
const voteAll = ref()
const voteYz = ref()

// 打开意见弹窗
const openAddVoteDia = () => {
  detailInfo.value = null
  optionType.value = '提交'
  isShowAddVoteDia.value = true
}
// 打开意见弹窗，编辑，查看
const openAddVoteDia1 = (type, form) => {
  // 查询意见详情
  getVoteInfo(form.opfbId).then(res => {
    if (res.success) {
      detailInfo.value = res.data

      if (type == 'edit') {
        optionType.value = '编辑'
      } else if (type == 'view') {
        optionType.value = '查看'
      }
      isShowAddVoteDia.value = true
    }
  })
}


const closeAddVoteDia = () => {
  isShowAddVoteDia.value = false
  getVoteResultFn()
  getDataList()
}


// 提交意见
const handleAddOpinion = (form) => {
  console.log('form===', form)
  form.sprintId = curSprintId.value
  handleAddVote(form).then(res => {
    if (res.success) {
      ElMessage.success('保存成功')
      closeAddVoteDia()

    }
  })
}

// 打开添加解决方案弹窗
const openAddSolutionDia = (info) => {
  solutionDetailInfo.value = {
    opfbId: info.opfbId
  }
  optionSolutionType.value = '添加'
  isShowAddSolutionDia.value = true
}

const openAddSolutionDiaEdit = (form) => {
  getSolutionInfo(form.solutionId).then(res => {
    if (res.success) {
      solutionDetailInfo.value = res.data
      optionSolutionType.value = '编辑'
      isShowAddSolutionDia.value = true
    }
  })
}

// 添加解决方案
const handleAddSolution = (form) => {
  AddSolutionInfo(form).then(res => {
    if (res.success) {
      ElMessage.success('保存成功')
      closeAddSolutionDia()
      getDataList()
    }
  })
}


const closeAddSolutionDia = () => {
  isShowAddSolutionDia.value = false
}

// 投票
const operateVoteFn = (form) => {
  let params = {
    sprintId: form.sprintId,
    opfbId: form.opfbId,
  }
  handleVote(params).then((res) => {
    if (res.success) {
      getVoteResultFn()
      getDataList()
    }
  })
}


const handleReset = () => {
  searchFormRef.value.resetFields()
  getDataList()
}

const getDataList = () => {
  searchForm.sprintId = curSprintId.value
  searchForm.solutionStatus = searchForm.solutionStatus || ''
  searchForm.opinionType = searchForm.opinionType || ''
  getVoteList(searchForm).then(res => {
    if (res.success) {
      voteList.value = res.data
    }
  })
}

const getVoteResultFn = () => {
  getVoteResult(curSprintId.value).then(res => {
    if (res.success) {
      voteAll.value = res.data.voteAll
      voteYz.value = res.data.voteYz
    }
  })
}

const getDicListFn = async (code) => {
  getDicList(code).then(res => {
    if (res.success) {
      switch (code) {
        case 'PROS_CONS':
          dicStore.prosConsList = res?.data ?? []
          break;
        case 'CIRCULATION_STATUS':
          dicStore.progressList = res?.data ?? []
          break;
      }
    }
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


onBeforeMount(() => {
  getDicListFn('PROS_CONS')
  getDicListFn('CIRCULATION_STATUS')
  getAllUserListFn()
  curSprintId.value = route.query.id
  sprintName.value = route.query.name
  getVoteResultFn()
  getDataList()
})


</script>

<style lang="scss" scoped>
.main-content {
  height: 100%;

  .title-1 {
    margin: 16px 0 16px;
  }

  .title-2 {
    margin: 0;
  }

  .tag {
    padding: 2px 5px;
    background-color: #2173F7;
    border-radius: 4px;
    color: #FFF;
    font-weight: bold;
  }

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
    }

    .search-content {

      .search-btn {
        margin-left: 20px;
        padding-right: 20px;

        .btn-primary, .btn-circle {
          height: 28px;
          line-height: 26px;
          font-size: 12px;
          border-radius: 3px;
        }

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

  .summary-list-content {
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
    padding: 12px 16px;

    .header-title {
      padding-right: 15px;
      padding-bottom: 13px;
      border-bottom: 1px solid #e2e4e8;
    }

    .vote-tips {
      flex-grow: 1;
      font-size: 14px;
      margin-left: 16px;
      color: #666;

      b{
        color: #333;
        font-weight: bold;
      }
    }

    .inner-content {
      padding: 0 15px 0 0;
      background-color: #FFF;
      height: calc(100vh - 300px);
      overflow: auto;

      .vote-item {

      }
    }
  }

  /* 整个滚动条 */
  ::-webkit-scrollbar {
    width: 8px;
    /* 宽度 */
    height: 8px;
    /* 高度 */
  }

  /* 滚动条轨道 */
  ::-webkit-scrollbar-track {
    background: none;
    /* 颜色 */
  }

  /* 滚动条的滑块 */
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    /* 颜色 */
    border-radius: 4px;
  }

  /* 滚动条的滑块：鼠标悬停时 */
  ::-webkit-scrollbar-thumb:hover {
    background: #e9e9e9;
    /* 颜色 */
  }
}

.gap12 {
  gap: 12px;
}

.mr-3{
  vertical-align: -3px;
}

.header-tag{
  display: inline-block;
  width: 94px;
  height: 22px;
  background: url(@/assets/webp/feedback.webp) no-repeat;
  background-size: contain;
  vertical-align: -6px;
}

.opt-btn{
  height: 32px;
  line-height: 32px;
  padding: 0 12px;
}
</style>