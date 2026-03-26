<template>
  <div class="main-content">
    <div class="page-search">
      <div class="jus-bet-center">
        <div class="jus-start-center">
          <div class="title-1">敏捷扑克</div>
          <div class="sel-global-project">当前项目：{{ globalProjectName }} - {{ globalProjectStatus }}</div>
        </div>
        <div class="opt-btn" @click="handleHistory">
          <el-icon class="mr-3">
            <ChatDotSquare/>
          </el-icon>
          估算历史
        </div>
      </div>
    </div>

    <section class="import-table-wrapper">
      <div class="search-content jus-bet-center">
        <el-form ref="searchFromRef" :model="searchFrom">
          <div class="flex">
            <el-form-item label="迭代" prop="sprintCode">
              <el-select v-model="searchFrom.sprintCode" clearable placeholder="全部" style="width: 200px;">
                <el-option v-for="item in iterationList" :key="item.code" :label="item.name"
                           :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item label="需求" prop="requirementCode">
              <el-select v-model="searchFrom.requirementCode" clearable filterable
                         placeholder="全部" style="width: 260px;">
                <el-option v-for="item in demandList" :key="item.code" :label="item.name"
                           :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item label="估算状态" prop="status">
              <el-select v-model="searchFrom.status" clearable placeholder="全部" style="width: 140px;">
                <el-option v-for="item in statusList" :key="item" :label="item" :value="item"/>
              </el-select>
            </el-form-item>
            <div class="search-btn">
              <div class="btn-primary btn-margin-right" @click="handleSerach">
                <el-icon class="mr-3">
                  <Search/>
                </el-icon>
                筛选
              </div>
              <div class="btn-circle-fix" @click="handleReset">
                <el-icon class="mr-3">
                  <RefreshLeft/>
                </el-icon>
                重置
              </div>
            </div>
          </div>
          <el-row :gutter="24">
          </el-row>
        </el-form>
      </div>
      <div class="page-table">
        <el-table v-loading="loading" :data="tableData" :header-cell-style="TableRowStyle" fit
                  max-height="calc(100vh - 394px)" scrollbar-always-on
                  stripe style="width: 100%">
          <el-table-column align="left" label="序号" type="index" width="80"></el-table-column>
          <el-table-column align="left" label="项目" min-width="150" prop="projectName"></el-table-column>
          <el-table-column align="left" label="需求(产品代办列表)" min-width="200" prop="requirementTitle"
                           show-overflow-tooltip></el-table-column>
          <el-table-column align="left" label="用户故事标题" min-width="180" prop="userStoryTitle"
                           show-overflow-tooltip></el-table-column>
          <el-table-column align="left" label="用户故事描述" prop="userStoryDes" show-overflow-tooltip
                           width="260"></el-table-column>
          <el-table-column align="left" label="故事点" min-width="120" prop="storyPoint"></el-table-column>
          <el-table-column align="left" label="进度" show-overflow-tooltip width="160">
            <template #default="scope">
              <div>
                <div :class="scope.row.status == '未开始' ? 'status-black' : 'status-green'" class="status-tag">
                  {{ scope.row.status }}
                </div>
                <span v-show="scope.row.status == '进行中'" class="status-tag-text">{{
                    scope.row.progress ? scope.row.progress : '-'
                  }}人完成</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left" label="已出牌人员" prop="description" width="310">
            <template #default="{ row }">
              <el-tooltip
                  v-if="row.usersArr && row.usersArr.length > 0"
                  :content="row.usersArr.join('、')"
                  class="box-item"
                  effect="dark"
                  placement="top"
              >
                <div class="user-tags-box">
                  <el-tag v-for="item in row.usersArr" :key="item" size="small" type="primary">{{ item }}</el-tag>
                </div>
              </el-tooltip>
              <div v-else class="no-data-text">暂无</div>
            </template>
          </el-table-column>
          <el-table-column align="left" fixed="right" label="操作" width="160">
            <template #default="scope">
              <el-button class="btn-text-primary" type="text"
                         @click="handleEstimateRoom(scope.row)">开始估算
              </el-button>
              <el-button v-show="btnAuthFileter('joker_result')" class="btn-text-primary" type="text"
                         @click="handleJokerResultRoom(scope.row)">亮牌
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="paginationg-box">
          <pagination :currentPage="searchFrom.current" :pageSize="searchFrom.size" :total="total"
                      @currentPageCurrent="currentPageCurrent" @currentPageSize="currentPageSize">
          </pagination>
        </div>
      </div>
    </section>

    <estimateRomeCom v-if="isDiaShow" :info="diaParams" :isShow="isDiaShow" :type="diaType"
                     @closeDiaFn="closeEstimateDiaFn"></estimateRomeCom>
  </div>
</template>
<script setup>
import {onBeforeMount, onBeforeUnmount, onMounted, reactive, ref, watch} from 'vue';
import {TableRowStyle} from '@/utils';
import {btnAuthFileter} from "@/utils/index.js";
import pagination from '@/components/pagination.vue';
import {getGameRoundList, getPorjectList, getRequirementList, getSprintList} from '@/api/agilePokerApi.js';
import {useRouter} from 'vue-router';
import estimateRomeCom from './components/estimateRomeCom.vue';
import {useDicStore} from '@/stores/dic.js';
import {ChatDotSquare} from "@element-plus/icons-vue";

const dicStore = useDicStore()
const router = useRouter();
const searchFrom = reactive({
  projectCode: '',
  requirementCode: '',
  status: '',
  sprintCode: '',
  size: 10,
  current: 1,
});
const total = ref(100);
const searchFromRef = ref(null);
const loading = ref(false);
const rolesCode = ref([]);
const projectList = ref([])
const demandList = ref([])
const statusList = ref(['未分配', '已分配'])
const iterationList = ref([])
const tableData = ref([]);
const autoSearch = ref(null)

const isDiaShow = ref(false)
const diaParams = ref(null)
const diaType = ref('1')
const closeEstimateDiaFn = () => {
  isDiaShow.value = false
  diaParams.value = null
  diaType.value = '1'
  getList()
}
const globalProjectName = ref(localStorage.getItem('global_ProjectName'))
const globalProjectStatus = ref(localStorage.getItem('global_ProjectStatus'))

/*查询相关功能: 
 * 查询操作 @handleSerach
 * 重置操作 @handleReset
 * 分页功能 @currentPageCurrent @currentPageSize
 * 获取list 
*/

const handleSerach = () => {
  searchFrom.current = 1;
  getList()
};

const handleReset = () => {
  searchFromRef.value.resetFields();
  searchFrom.current = 1;
  getList()
};
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
  getGameRoundList(searchFrom).then(res => {
    tableData.value = res.data.records;
    total.value = res.data.total;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  })
}

const handleEstimateRoom = (data) => {
  diaType.value = '1'
  diaParams.value = {
    name: data.userStoryTitle,
    code: data.userStoryCode
  }
  isDiaShow.value = true
}
const handleJokerResultRoom = (data) => {
  diaType.value = '2'
  diaParams.value = {
    name: data.userStoryTitle,
    code: data.userStoryCode,
    sprintCode: data.sprintCode,
  }
  isDiaShow.value = true
}
const handleHistory = () => {
  router.push('/agilePoker/pokerHistory')
}
const handleSelectList = () => {
  iterationList.value = []
  demandList.value = []
  searchFrom.sprintCode = ''
  searchFrom.requirementCode = ''
  getSprintListFn()
  getRequirementListFn()
}

async function getProjectListFn() {
  getPorjectList().then(res => {
    if (res.success) {
      projectList.value = res?.data ?? []
    }
  })
}

async function getSprintListFn() {
  getSprintList({code: searchFrom.projectCode}).then(res => {
    if (res.success) {
      iterationList.value = res?.data ?? []
    }
  })
}

async function getRequirementListFn() {
  getRequirementList({code: searchFrom.projectCode}).then(res => {
    if (res.success) {
      demandList.value = res?.data ?? []
    }
  })
}

watch(() => dicStore.globalProjectCode, (newVal) => {
  globalProjectName.value = localStorage.getItem('global_ProjectName')
  globalProjectStatus.value = localStorage.getItem('global_ProjectStatus')
  searchFrom.projectCode = newVal
  handleSerach()
  getSprintListFn()
  getRequirementListFn()
})

onBeforeMount(async () => {
  searchFrom.projectCode = localStorage.getItem('global_ProjectCode') // 初始赋值：从缓存中取
  getProjectListFn()
  getSprintListFn()
  getRequirementListFn()
})
onMounted(() => {
  rolesCode.value = JSON.parse(localStorage.getItem("agiles_user")).rolesCode
  getList()
  autoSearch.value = setInterval(() => {
    getList()
  }, 10 * 1000)
})
onBeforeUnmount(() => {
  clearInterval(autoSearch.value)
  autoSearch.value = null
})
</script>
<style lang="scss" scoped>
.main-content {
  height: 100%;
  background-color: #f6f8fc;

  .search-content {
    margin-bottom: 12px;
    background-color: #FFF;

    .search-btn {
      display: flex;
      padding-right: 20px;
      align-items: center;
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
    height: 28px;
    border-radius: 4px;
  }

  .page-search {
    margin-bottom: 16px;
  }

  .page-table {
    .title-2 {
      font-size: 14px;
      margin-bottom: 12px;
    }

    .btn-text-primary {
      color: #2173F7 !important;
    }

    /* 核心修改部分：处理溢出标记 */
    .user-tags-box {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      width: 100%;
      overflow: hidden;
      position: relative;
      /* 使用伪元素或者简单的溢出隐藏，如果需要精准省略号，通常配合 line-clamp */
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1; /* 限制显示两行 */
      color: #2173F7;
    }

    /* 针对 tag 的微调，确保即使被截断也不会显得凌乱 */
    :deep(.el-tag) {
      flex-shrink: 0;
      margin-bottom: 2px;
      margin-right: 4px;

      .el-tag__content {
        font-size: 12px;
      }
    }

    .no-data-text {
      color: #909399;
      font-size: 13px;
    }

    .jus-flex-around {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;

      :deep(.el-tag__content) {
        font-size: 12px;
      }
    }
  }

  .info-content {
    text-align: left;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #555555;
    line-height: 28px;

    .color-blue {
      color: #2173F7;
    }

    svg {
      width: 1.5em;
      height: 1.5em;
    }
  }
}

.flex {
  gap: 16px;
}

.mr-3 {
  vertical-align: -2px;
}

.btn-primary {
  width: 64px;
  height: 28px;
  line-height: 28px;
  border-radius: 3px;
}

.btn-circle-fix {
  padding: 0 6px;
  width: 64px;
  height: 28px;
  line-height: 28px;
  border-radius: 3px;
  border: 1px solid #e2e4e8;
}

.status-tag {
  display: inline-block;
  font-size: 12px;
  height: 22px;
  line-height: 22px;
  width: 54px;
  text-align: center;
  border-radius: 4px;
}

.status-tag-text {
  font-size: 12px;
  margin-left: 8px;
}

.fix-flex {
  flex-wrap: nowrap !important;

  .el-tag--primary {
    height: 22px;
    line-height: 22px;
  }
}

.opt-btn {
  height: 32px;
  line-height: 32px;
  padding: 0 12px;
}

.import-table-wrapper {
  padding: 12px 16px 0;
  background: #fff;
  border-radius: 8px;
}
</style>