<template>
  <div class="main-content">
    <div class="main-header jus-bet-center jus-bet-center-fix">
      <div class="menu-title title-1">月度任务统计</div>
      <div class="opt-btn" @click="creadInfoDiaShow = true">生成任务统计</div>
    </div>
    <div class="search-content jus-bet-center bg-color-1 border-radius-8">
      <el-form ref="searchFormRef" :model="searchForm">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="年度" prop="year">
              <el-select v-model="searchForm.year" clearable placeholder="全部" style="width: 260px;">
                <el-option v-for="item in yearList" :key="item" :label="item" :value="item"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="月度" prop="month">
              <el-select v-model="searchForm.month" clearable placeholder="全部" style="width: 260px;">
                <el-option v-for="item in monthList" :key="item" :label="item" :value="item"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" class="btn-primary" @click="handleSerach"><el-icon class="mr-3"><Search/></el-icon>筛选</el-button>
        <el-button class="btn-circle-fix" @click="handleReset"><el-icon class="mr-3"><RefreshLeft/></el-icon>重置</el-button>
      </div>

    </div>
    <div class="table-content">
      <el-table v-loading="loading" :data="tableData" :header-cell-style="TableRowStyleFixed" fit max-height="calc(100vh - 360px)"
                scrollbar-always-on stripe>
        <el-table-column align="left" label="标题" min-width="250" prop="title"></el-table-column>
        <el-table-column align="left" label="统计周期" min-width="250" prop="reportDate"></el-table-column>
        <el-table-column align="left" label="生成时间" min-width="250" prop="generateTime"></el-table-column>
        <el-table-column align="left" label="统计方式" min-width="150" prop="generateTypeName"></el-table-column>
        <el-table-column align="center" label="操作" width="120">
          <template #default="scope">
            <div>
              <el-button class="btn-text-primary text-btn" type="text"
                         @click="handleView(scope.row)">
                <el-tooltip content="查看" effect="light" popper-class="fix-tooltip" placement="top">
                  <img :src="viewIcon" alt="查看" class="table-icon"/>
                </el-tooltip>
              </el-button>
              <el-button class="btn-text-primary text-btn" type="text"
                         @click="handleDown(scope.row)">
                <el-tooltip content="下载" effect="light" popper-class="fix-tooltip" placement="top">
                  <img :src="downloadIcon" alt="下载" class="table-icon"/>
                </el-tooltip>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="paginationg-box">
        <pagination :currentPage="searchForm.current" :pageSize="searchForm.size" :total="total"
                    @currentPageCurrent="currentPageCurrent" @currentPageSize="currentPageSize">
        </pagination>
      </div>
    </div>
    <ChooseIterationDia v-if="creadInfoDiaShow" :isShow="creadInfoDiaShow" @closeDiaFn="creadInfoDiaShow = false"
                        @confirmFn="getCreadInfo"></ChooseIterationDia>
    <DiaView v-if="detailPageShow" :info="detailInfo" :isShow="detailPageShow" @closeDiaFn="handleCloseDia"></DiaView>
  </div>
</template>
<script setup>
import {onBeforeMount, reactive, ref} from 'vue';
import {TableRowStyleFixed} from '@/utils';
import pagination from '@/components/pagination.vue';
import ChooseIterationDia from './components/ChooseIterationDia.vue';
import DiaView from './components/DiaView.vue';
import {
  addMonthPage,
  exportMonthFile,
  getMonthList,
  getMonthPageList,
  getYearList
} from '@/api/statisticsManagementApi';
import {Search} from "@element-plus/icons-vue";
import downloadIcon from "@/assets/webp/download.webp";
import viewIcon from "@/assets/webp/view-icon.webp";

const searchFormRef = ref(null)
const searchForm = reactive({
  year: '',
  month: '',
  size: 10,
  current: 1
})
const yearList = ref(['2020', '2021', '2022', '2023', '2025'])
const monthList = ref(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'])
const tableData = ref([])
const loading = ref(false)
const total = ref(0)
const creadInfoDiaShow = ref(false)
const detailPageShow = ref(false)
const detailInfo = ref(null)
const currentPageCurrent = (val) => {
  searchForm.current = val
  getList()
}

const currentPageSize = (val) => {
  searchForm.size = val
  searchForm.current = 1
  getList()
}
const handleSerach = () => {
  searchForm.current = 1;
  getList()
};

const handleReset = () => {
  searchFormRef.value.resetFields();
  searchForm.current = 1;
  getList()
};
const handleDown = (data) => {
  exportMonthFile({"reportId": data.id})
}
const handleView = (data) => {
  detailInfo.value = {
    reportDate: data.reportDate,
    generateTime: data.generateTime,
    reportId: data.id
  }
  detailPageShow.value = true
}
const getCreadInfo = (data) => {
  creadInfoDiaShow.value = false
  let params = {
    "startDate": data.date[0],
    "endDate": data.date[1],
    "generateType": "manual"
  }
  addMonthPage(params).then(res => {
    if (res.success) {
      getList()
    }
  })
}

const handleCloseDia = () => {
  detailInfo.value = null
  detailPageShow.value = false
}

function getList() {
  loading.loading = true
  //获取列表
  getMonthPageList(searchForm).then(res => {
    loading.loading = false
    if (res.success) {
      total.value = Number(res?.data?.total)
      tableData.value = res?.data?.records ?? []
    }
  })
}

function getYearListFn() {
  getYearList().then(res => {
    if (res.success) {
      yearList.value = res?.data ?? []
    }
  })
}

function getMonthListFn() {
  getMonthList().then(res => {
    if (res.success) {
      monthList.value = res?.data ?? []
    }
  })
}

onBeforeMount(() => {
  getList()
  getYearListFn()
  getMonthListFn()
})
</script>
<style lang="scss" scoped>
.main-content {
  padding: 0 20px 0 20px;
  padding-bottom: 0;

  .menu-title {
    margin-bottom: 15px;
  }

  .search-content {
    margin: 15px 0;
    padding: 0 20px;
    height: 72px;
    background-color: #FFF;

    .search-btn {
      margin-left: 20px;
      padding-right: 20px;
      display: flex;

      .btn-primary{
        border-radius: 3px;
        width: 64px;
        height: 28px;
        line-height: 28px;

        :deep(span){
          font-size: 12px;
        }
      }

      .btn-circle-fix{
        border-radius: 3px;
        width: 64px;
        height: 28px;
        line-height: 28px;

        :deep(span){
          font-size: 12px;
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

  .title-1{
    font-size: 16px;
  }

  :deep(.el-table .el-table__cell){
    height: 36px;
    padding: 0;
  }

  .jus-bet-center{
    justify-content: left;

    &.jus-bet-center-fix{
      justify-content: space-between;
    }
  }

  .mr-3{
    margin-right: 3px;
  }
}
</style>