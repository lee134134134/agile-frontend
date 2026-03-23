<template>
  <div class="main-content">
    <MenuBreadCom :type="3"></MenuBreadCom>
    <section class="table-wrapper">
      <div class="page-search">
        <div class="search-content jus-bet-center bg-color-1 border-radius-8">
          <el-form ref="searchFromRef" :model="searchFrom">
            <div class="flex">
              <el-form-item label="需求" prop="requirementCode">
                <el-select v-model="searchFrom.requirementCode" clearable filterable
                           placeholder="全部" style="width: 260px;" @change="getStoryListFn">
                  <el-option v-for="item in demandList" :key="item.code" :label="item.name"
                             :value="item.code"/>
                </el-select>
              </el-form-item>
              <el-form-item label="用户故事" prop="storyCode">
                <el-select v-model="searchFrom.storyCode" clearable placeholder="全部" style="width: 260px;">
                  <el-option v-for="item in storyList" :key="item.code" :label="item.name"
                             :value="item.code"/>
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
          </el-form>
        </div>
      </div>
      <div class="page-table">
        <el-table v-loading="loading" :data="tableData" :header-cell-style="TableRowStyle" fit
                  max-height="calc(100vh - 420px)" scrollbar-always-on
                  stripe style="width: 100%">
          <el-table-column align="center" label="序号" type="index" width="80"></el-table-column>
          <el-table-column align="left" label="用户故事" min-width="120" prop="userStoryTitle"
                           show-overflow-tooltip></el-table-column>
          <el-table-column align="left" label="轮次" prop="times" show-overflow-tooltip width="100"></el-table-column>
          <el-table-column align="left" label="估算值" min-width="200" prop="description" show-overflow-tooltip>
            <template #default="{ row, column, $index }">
              <div v-if="row.peps && row.peps.length > 0" class="jus-start-center" style="column-gap: 10px;">
                <el-tag v-for="item in row.peps" :key="item" type="primary">{{ item }}</el-tag>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="估算时间" prop="endTime" width="180"></el-table-column>
        </el-table>
        <div class="paginationg-box">
          <pagination :currentPage="searchFrom.current" :pageSize="searchFrom.size" :total="total"
                      @currentPageCurrent="currentPageCurrent" @currentPageSize="currentPageSize">
          </pagination>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup>
import {onBeforeMount, onMounted, reactive, ref, watch} from 'vue';
import {TableRowStyle} from '@/utils';
import pagination from '@/components/pagination.vue';
import MenuBreadCom from './components/MenuBreadCom.vue';
import {getGameRoundHistoryList, getHistoryRequirementList, getPorjectList, getStoryList} from '@/api/agilePokerApi.js';
import {useRouter} from 'vue-router';
import {useDicStore} from "@/stores/dic.js";

const router = useRouter();
const searchFrom = reactive({
  projectCode: '',
  requirementCode: '',
  storyCode: '',
  size: 10,
  current: 1,
});
const total = ref(100);
const searchFromRef = ref(null);
const loading = ref(false);
const rolesCode = ref([]);
const projectList = ref([])
const demandList = ref([])
const storyList = ref([])
const tableData = ref([]);

const dicStore = useDicStore()
watch(() => dicStore.globalProjectCode, (newVal) => {
  searchFrom.projectCode = newVal
  searchFrom.current = 1;
  getProjectListFn()
  getRequirementListFn()
  getStoryListFn()
  getList()
})
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
  getGameRoundHistoryList(searchFrom).then(res => {
    tableData.value = res.data.records;
    total.value = res.data.total;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  })
}

const handleSelectList = () => {
  storyList.value = []
  demandList.value = []
  searchFrom.storyCode = ''
  searchFrom.requirementCode = ''
  getRequirementListFn()
  getStoryListFn()
}

async function getProjectListFn() {
  getPorjectList().then(res => {
    if (res.success) {
      projectList.value = res?.data ?? []
    }
  })
}

async function getRequirementListFn() {
  getHistoryRequirementList({code: searchFrom.projectCode}).then(res => {
    if (res.success) {
      demandList.value = res?.data ?? []
    }
  })
}

async function getStoryListFn() {
  let params = {
    projectCode: searchFrom.projectCode,
    requirementCode: searchFrom.requirementCode ?? undefined
  }
  storyList.value = []
  searchFrom.storyCode = ''
  getStoryList(params).then(res => {
    if (res.success) {
      storyList.value = res?.data ?? []
    }
  })
}

onBeforeMount(async () => {
  searchFrom.projectCode = localStorage.getItem('global_ProjectCode')
  getProjectListFn()
  getRequirementListFn()
  getStoryListFn()
})
onMounted(() => {
  rolesCode.value = JSON.parse(localStorage.getItem("agiles_user")).rolesCode
  getList()
})
</script>
<style lang="scss" scoped>
.main-content {
  background-color: #f6f8fc;
  height: 100%;

  .page-search {

    .search-content {
      margin-bottom: 12px;
      background-color: #FFF;

      .search-btn {
        display: flex;
        align-items: center;
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
      height: 28px;
      border-radius: 4px;
    }
  }

  .page-table {
    .title-2 {
      margin-bottom: 12px;
    }

    .status-content {
      text-align: center;
    }

    .current-user {
      margin-left: 5px;
      width: 80px;
      height: 24px;
      background: #E0EEFF;
      border-radius: 8px 8px 8px 8px;
      border: 1px solid #2173F7;
      color: #2173F7;
      font-size: 14px;
      font-weight: bold;
      line-height: 24px;
      text-align: center;
    }

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
  align-items: center;
}

.mr-3 {
  vertical-align: -1px;
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

.table-wrapper{
  margin-top: 12px;
  padding: 12px 16px 0;
  background: #fff;
  border-radius: 8px;
}

:deep(.el-tag.el-tag--primary span){
  font-size: 12px;
}
</style>