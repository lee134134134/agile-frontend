<template>
  <div class="main-content">
    <div class="page-search">
      <div class="title-1">操作日志</div>
      <div class="search-content bg-color-1 border-radius-8">
        <el-form ref="searchFormRef" :model="searchForm">
          <div class="flex item-input">
            <el-form-item label="操作时间范围" label-width="100px" prop="opreatDate">
              <el-date-picker v-model="searchForm.opreatDate" :clearable="true" :teleported="false"
                              end-placeholder="结束日期" format="YYYY-MM-DD" range-separator="——"
                              start-placeholder="开始日期"
                              type="daterange" unlink-panels value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
            <el-form-item label="操作用户" prop="userAccount">
              <el-input v-model="searchForm.userAccount" clearable maxlength="10"
                        placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="系统功能" prop="routeName">
              <el-select v-model="searchForm.routeName" clearable placeholder="全部" style="width: 160px;">
                <el-option v-for="item in routerList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="菜单名称" prop="sourceType">
              <el-cascader v-model="searchForm.sourceType" :options="sourceTypeList" :props="defaultProps"
                           :reserve-keyword="false" clearable filterable placeholder="全部"
                           style="width: 160px;"></el-cascader>
            </el-form-item>
          </div>
          <div class="flex">
            <el-form-item label="操作类型" label-width="100px" prop="operationType">
              <el-select v-model="searchForm.operationType" clearable placeholder="全部"
                         style="width: 160px;">
                <el-option v-for="item in operateTypeList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <div class="search-btn jus-flex-end">
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
    <el-table v-loading="loading" :data="tableData" :header-cell-style="TableRowStyle" fit
              max-height="calc(100vh - 345px)" scrollbar-always-on
              stripe style="width: 100%" class="page-table">
      <el-table-column align="center" label="操作时间" min-width="180" prop="operationTime"></el-table-column>
      <el-table-column align="left" label="操作用户" min-width="120" prop="userName"></el-table-column>
      <el-table-column align="left" label="菜单名称" min-width="120" prop="module"></el-table-column>
      <el-table-column align="left" label="操作类型" min-width="150" prop="operationType"></el-table-column>
      <el-table-column align="left" label="资源ID" min-width="180" prop="sourceId"
                       show-overflow-tooltip></el-table-column>
      <el-table-column align="left" label="资源名称" min-width="180" prop="sourceTitle"
                       show-overflow-tooltip></el-table-column>
      <el-table-column align="left" label="描述" min-width="260" prop="operationDesc">
        <template #default="scope">
          <div class="cell-content" v-html="scope.row.operationDesc"></div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="系统功能" min-width="180" prop="routeName"
                       show-overflow-tooltip></el-table-column>
      <el-table-column align="left" label="IP地址" min-width="180" prop="ipAddress"
                       show-overflow-tooltip></el-table-column>
    </el-table>
    <div class="paginationg-box">
      <pagination :currentPage="searchForm.current" :pageSize="searchForm.size" :total="total"
                  @currentPageCurrent="currentPageCurrent" @currentPageSize="currentPageSize">
      </pagination>
    </div>
  </div>
</template>

<script setup>
import {onBeforeMount, reactive, ref} from 'vue';
import {TableRowStyle} from '@/utils';
import pagination from '@/components/pagination.vue';
import {getOperationLogList, getOperationTypeList, getSourceTypeList, getSysRouterList} from '@/api/operatelogApi.js';

const searchForm = reactive({
  opreatDate: [],
  userAccount: '',
  routeName: '',
  sourceType: '',
  operationType: '',
  size: 10,
  current: 1,
});
const total = ref(100);
const searchFormRef = ref(null);
const loading = ref(false);
const sourceTypeList = ref([])
const routerList = ref([])
const operateTypeList = ref([])
const tableData = ref([])
const defaultProps = ref({
  children: 'children',
  label: 'name',
  value: 'value',
  emitPath: false
})
const handleSerach = () => {
  searchForm.current = 1;
  getList()
};

const handleReset = () => {
  searchFormRef.value.resetFields();
  searchForm.current = 1;
  getList()
};
const currentPageCurrent = (val) => {
  searchForm.current = val
  getList()
}
const currentPageSize = (val) => {
  searchForm.size = val
  searchForm.current = 1
  getList()
}

function getList() {
  loading.value = true
  let params = {
    startDate: searchForm.opreatDate && searchForm.opreatDate.length > 0 ? searchForm.opreatDate[0] : '',
    endDate: searchForm.opreatDate && searchForm.opreatDate.length > 0 ? searchForm.opreatDate[1] : '',
    userAccount: searchForm.userAccount,
    routeName: searchForm.routeName,
    sourceType: searchForm.sourceType,
    operationType: searchForm.operationType,
    size: searchForm.size,
    current: searchForm.current,
  }
  getOperationLogList(params).then(res => {
    tableData.value = res?.data?.records ?? [];
    total.value = Number(res.data.total);
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  })
}

function getSourceTypeListFn() {
  getSourceTypeList().then(res => {
    if (res.success) {
      sourceTypeList.value = res?.data ?? []
    }
  })
}

function getOperationTypeListFn() {
  getOperationTypeList().then(res => {
    if (res.success) {
      operateTypeList.value = res?.data ?? []
    }
  })
}

function getSysRouterListFn() {
  getSysRouterList().then(res => {
    if (res.success) {
      routerList.value = res?.data ?? []
    }
  })
}

onBeforeMount(() => {
  getList()
  getSourceTypeListFn()
  getOperationTypeListFn()
  getSysRouterListFn()
})
</script>

<style lang="scss" scoped>
.main-content {
  background: #f6f8fc;
  padding: 20px;
  height: 100%;

  .page-search {
    margin-bottom: 20px;

    .search-content {
      margin-top: 25px;
      padding: 16px;
      background-color: #FFF;

      .search-btn {
        margin-left: 20px;
        padding-right: 20px;
      }

    }

    :deep(.el-form-item) {
      margin-bottom: 0;
    }

    :deep(.el-date-editor) {
      height: 28px;
      line-height: 28px;
      width: 260px;
      --el-input-border-radius: 4px !important;
      --el-input-border-color: #cccccc !important;
    }

    :deep(.el-input) {
      --el-input-height: 28px;
      --el-input-border-color: #cccccc;
      --el-input-border-radius: 4px;
      --el-input-padding-left: 10px;
      --el-input-padding-right: 10px;
      width: 260px;
    }

    :deep(.el-select__wrapper) {
      min-height: 28px;
      border-radius: 4px;
    }

    :deep(.el-select__wrapper) {
      border-radius: 4px !important;
      --el-input-border-color: #cccccc !important;
      box-shadow: 0 0 0 1px #cccccc inset !important;
    }
  }

  .page-table{
    padding: 12px 16px 0;
    background: #fff;
  }
}

.bg-color-1 {
  background: #fff;
}

.item-input {
  margin-bottom: 12px;
  gap: 16px;
}

.btn-primary {
  cursor: pointer;
  width: 64px;
  height: 28px;
  line-height: 28px;
  border-radius: 3px;
}

.btn-circle-fix {
  cursor: pointer;
  width: 64px;
  height: 28px;
  line-height: 28px;
  border-radius: 3px;
  border: 1px solid #e2e4e8;
  padding: 0 6px;
}

.mr-3{
  vertical-align: -1px;
}

:deep(.el-select__wrapper) {
  min-height: 28px;
  line-height: 28px;
  border-radius: 3px;
  font-size: 12px !important;
}

:deep(.el-input__wrapper) {
  border-radius: 3px;
  font-size: 12px !important;
  --el-input-inner-height: 28px;
}

.paginationg-box{
  margin-top: 0;
  padding-top: 20px;
  padding-right: 16px;
  background: #fff;
}
</style>