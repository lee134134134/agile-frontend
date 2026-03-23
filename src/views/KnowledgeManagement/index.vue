<template>
  <div class="demand-main">
    <el-tabs v-model="activeTab" class="custom-tabs" @tab-change="handleTabChange">
      <el-tab-pane label="项目文档" name="1">
        <div class="project-tag-bar">
          <span class="project-tag">当前项目：{{ globalProjectName }} - {{ globalProjectStatus }}</span>
        </div>
        <div class="main-container">
          <div class="search-content border-radius-8">
            <el-form ref="searchProDocRef" :inline="true" :model="searchProDoc" class="search-form">
              <el-form-item label="文档类型" prop="documentType">
                <el-select v-model="searchProDoc.documentType" clearable placeholder="请选择"
                           style="width: 200px;">
                  <el-option v-for="item in docTypeList" :key="item.value" :label="item.name"
                             :value="item.value"/>
                </el-select>
              </el-form-item>
              <el-form-item label="文档标题" prop="title">
                <el-input v-model="searchProDoc.title" clearable placeholder="请输入"
                          style="width: 200px;"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button class="btn-primary" type="primary" @click="handleProDocSerach">
                  <el-icon class="mr-3">
                    <Search/>
                  </el-icon>
                  筛选
                </el-button>
                <el-button class="btn-reset" @click="handleProDocReset">
                  <el-icon class="mr-3">
                    <RefreshLeft/>
                  </el-icon>
                  重置
                </el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="table-box">
            <!--            <el-table v-loading="proListLoading" :data="proDocList" header-row-class-name="custom-header"-->
            <!--                      style="width: 100%">-->
            <!--              <el-table-column label="文档类型" prop="documentType" width="180">-->
            <!--                <template #default="scope">-->
            <!--                  {{ scope.row.documentType || '-' }}-->
            <!--                </template>-->
            <!--              </el-table-column>-->
            <!--              <el-table-column label="标题" min-width="300" prop="documentTitle">-->
            <!--                <template #default="scope">-->
            <!--                                    <span class="link-text" @click="handleOpen(scope.row)">{{-->
            <!--                                        scope.row.documentTitle-->
            <!--                                      }}</span>-->
            <!--                </template>-->
            <!--              </el-table-column>-->
            <!--              <el-table-column label="发布人" prop="updatedBy" width="180"/>-->
            <!--              <el-table-column label="首次发布时间" prop="createdAt" width="220"/>-->
            <!--              <el-table-column label="最新更新时间" prop="updatedAt" width="220"/>-->
            <!--            </el-table>-->

            <section v-loading="proListLoading" class="table-card-list">
              <div v-for="(item,index) in proDocList" :key="index" class="table-card-item">
                <div class="left-tip">{{ item.documentType || '-' }}</div>
                <div class="right-tip"><i/>{{ item.updatedBy || '-' }}</div>
                <div class="table-card-section">
                  <div class="title" @click.stop="handleOpen(item)">
                    <AutoTooltip :content="item.documentTitle"></AutoTooltip>
                  </div>
                  <div class="bottom flex">
                    <div class="left-time">
                      <p class="time">首次发布时间</p>
                      <p class="time-text">{{ item.createdAt }}</p>
                    </div>
                    <div class="right-time">
                      <p class="time">最新更新时间</p>
                      <p class="time-text">{{ item.updatedAt }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div class="pagination-box">
              <pagination :currentPage="searchProDoc.current" :pageSize="searchProDoc.size" :total="proTotal"
                          @currentPageCurrent="handleProCurrentChange" @currentPageSize="handleProSizeChange">
              </pagination>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="知识库" name="2">
        <div class="main-container">
          <div class="search-content border-radius-8">
            <el-form ref="searchKnowledgeRef" :inline="true" :model="searchKnowledge" class="search-form">
              <el-form-item label="文档类型" prop="docType">
                <el-select v-model="searchKnowledge.docType" clearable placeholder="请选择"
                           style="width: 200px;">
                  <el-option v-for="item in kbDocTypeList" :key="item.value" :label="item.name"
                             :value="item.value"/>
                </el-select>
              </el-form-item>
              <el-form-item label="文档标题" prop="docTitle">
                <el-input v-model="searchKnowledge.docTitle" clearable placeholder="请输入"
                          style="width: 200px;"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button class="btn-primary" type="primary"
                           @click="handleSerachKnowledge">
                  <el-icon class="mr-3">
                    <Search/>
                  </el-icon>
                  筛选
                </el-button>
                <el-button class="btn-reset" @click="handleResetKnowledge">
                  <el-icon class="mr-3">
                    <RefreshLeft/>
                  </el-icon>
                  重置
                </el-button>
              </el-form-item>
            </el-form>
          </div>

          <div class="table-box">
<!--            <el-table v-loading="knowsListLoading" :data="knowledgeList" header-row-class-name="custom-header"-->
<!--                      style="width: 100%">-->
<!--              <el-table-column label="文档类型" prop="docType" width="180">-->
<!--                <template #default="scope">-->
<!--                  {{ formatValue(scope.row.docType) || '-' }}-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column label="标题" min-width="300" prop="docTitle">-->
<!--                <template #default="scope">-->
<!--                                    <span class="link-text" @click="handleOpen(scope.row)">{{-->
<!--                                        scope.row.docTitle-->
<!--                                      }}</span>-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column label="发布人" prop="updatedBy" width="180"/>-->
<!--              <el-table-column label="首次发布时间" prop="createdAt" width="220"/>-->
<!--              <el-table-column label="最新更新时间" prop="updatedAt" width="220"/>-->
<!--            </el-table>-->

            <section v-loading="knowsListLoading" class="table-card-list">
              <div v-for="(item,index) in knowledgeList" :key="index" class="table-card-item">
                <div class="left-tip">{{ formatValue(item.docType) || '-' }}</div>
                <div class="right-tip"><i/>{{ item.updatedBy || '-' }}</div>
                <div class="table-card-section">
                  <div class="title" @click.stop="handleOpen(item)">
                    <AutoTooltip :content="item.docTitle"></AutoTooltip>
                  </div>
                  <div class="bottom flex">
                    <div class="left-time">
                      <p class="time">首次发布时间</p>
                      <p class="time-text">{{ item.createdAt }}</p>
                    </div>
                    <div class="right-time">
                      <p class="time">最新更新时间</p>
                      <p class="time-text">{{ item.updatedAt }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div class="pagination-box">
              <pagination :currentPage="searchKnowledge.current" :pageSize="searchKnowledge.size" :total="knowsTotal"
                          @currentPageCurrent="handleKnowsCurrentChange" @currentPageSize="handleKnowsSizeChange">
              </pagination>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <reviewDia v-if="reviewShow" :info="info" :isShow="reviewShow" :name='doctitle' @closeDiaFn="handleClose">
    </reviewDia>
  </div>
</template>

<script setup>
import {onBeforeMount, reactive, ref, watch} from 'vue';
// 假设 EmptyCom 不再用于表格模式，如果需要空状态，el-table 自带 empty 插槽
// import EmptyCom from '@/components/EmptyDia.vue';
import {getDicList} from '@/api/api.js';
import {getKnowledgeListViewFn, getProListFn} from '@/api/docManage.js';
import reviewDia from './components/reviewDia.vue';
import pagination from '@/components/pagination.vue';
import {useDicStore} from '@/stores/dic.js';
import {RefreshLeft, Search} from "@element-plus/icons-vue";
import AutoTooltip from "@/components/AutoTooltip.vue";

const dicStore = useDicStore()
const reviewShow = ref(false)
const activeTab = ref("1")
const searchProDocRef = ref(null)
const searchKnowledgeRef = ref(null)

// 搜索条件对象
const searchProDoc = reactive({
  projectCode: '',
  title: '',
  documentType: '', // 新增：对应UI图中的左侧下拉
  needDocCode: true,
  current: 1,
  size: 10
})

const searchKnowledge = reactive({
  docTitle: '',
  docType: '',
  current: 1,
  size: 10
})

const docTypeList = ref([])
const kbDocTypeList = ref([])
const projectList = ref([])

// 加载状态
const proListLoading = ref(false)
const knowsListLoading = ref(false)

// 数据列表
const proDocList = ref([])
const knowledgeList = ref([])
const proTotal = ref(0)
const knowsTotal = ref(0)

// 详情弹窗相关
const info = ref('')
const doctitle = ref('')
const globalProjectName = ref(localStorage.getItem('global_ProjectName'))
const globalProjectStatus = ref(localStorage.getItem('global_ProjectStatus'))

/**
 * 打开文档详情
 * @param {Object} data - 行数据
 */
const handleOpen = (data) => {
  info.value = data.documentCode
  doctitle.value = data.docTitle == undefined ? data.documentTitle : data.docTitle
  reviewShow.value = true
}

const handleClose = () => {
  info.value = ''
  doctitle.value = ''
  reviewShow.value = false
}

const handleTabChange = () => {
  if (activeTab.value == '1') {
    handleProDocReset()
  } else {
    // 切换到知识库时加载知识库的文档类型列表
    loadKbDocTypeList()
    handleResetKnowledge()
  }
}

/* ------------------ 项目文档逻辑 ------------------ */
const formatValue = (str) => {
  return kbDocTypeList.value.find(item => item.value === str)?.name ?? '-'
}

/**
 * 项目文档筛选查询
 */
const handleProDocSerach = () => {
  searchProDoc.current = 1;
  getProDocList()
}

/**
 * 项目文档重置查询
 */
const handleProDocReset = () => {
  searchProDocRef.value.resetFields();
  searchProDoc.current = 1;
  getProDocList()
}

/**
 * 获取项目文档列表API调用
 */
function getProDocList() {
  proListLoading.value = true
  getProListFn(searchProDoc).then(res => {
    proListLoading.value = false
    if (res.success) {
      proTotal.value = res.data.total ?? 0
      proDocList.value = res.data.records || []
    } else {
      proDocList.value = []
      proTotal.value = 0
    }
  }).catch(() => {
    proListLoading.value = false
  })
}

/**
 * 项目文档分页：页码改变
 * @param {number} val - 当前页码
 */
const handleProCurrentChange = (val) => {
  searchProDoc.current = val
  getProDocList()
}

/**
 * 项目文档分页：每页条数改变
 * @param {number} val - 每页条数
 */
const handleProSizeChange = (val) => {
  searchProDoc.size = val
  searchProDoc.current = 1 // 切换条数通常重置回第一页
  getProDocList()
}


/* ------------------ 知识库逻辑 ------------------ */

/**
 * 知识库筛选查询
 */
const handleSerachKnowledge = () => {
  searchKnowledge.current = 1;
  getKnowledgeList()
}

/**
 * 知识库重置查询
 */
const handleResetKnowledge = () => {
  searchKnowledgeRef.value.resetFields();
  searchKnowledge.current = 1;
  getKnowledgeList()
}

/**
 * 获取知识库列表API调用
 */
function getKnowledgeList() {
  knowsListLoading.value = true
  getKnowledgeListViewFn(searchKnowledge).then(res => {
    knowsListLoading.value = false
    if (res.success) {
      knowsTotal.value = res.data.total ?? 0
      knowledgeList.value = res.data.records || []
    } else {
      knowledgeList.value = []
      knowsTotal.value = 0
    }
  }).catch(() => {
    knowsListLoading.value = false
  })
}

/**
 * 知识库分页：页码改变
 * @param {number} val - 当前页码
 */
const handleKnowsCurrentChange = (val) => {
  searchKnowledge.current = val
  getKnowledgeList()
}

/**
 * 知识库分页：每页条数改变
 * @param {number} val - 每页条数
 */
const handleKnowsSizeChange = (val) => {
  searchKnowledge.size = val
  searchKnowledge.current = 1
  getKnowledgeList()
}

/* ------------------ 初始化与监听 ------------------ */

const getDicListFn = async (code) => {
  await getDicList(code).then(res => {
    if (res.success) {
      return res?.data ?? []
    }
  })
  return []
}

/**
 * 加载项目文档的文档类型列表
 */
const loadProDocTypeList = async () => {
  const res = await getDicList('DOC_TYPE')
  if (res.success) {
    docTypeList.value = res.data ?? []
  }
}

/**
 * 加载知识库的文档类型列表
 */
const loadKbDocTypeList = async () => {
  const res = await getDicList('KB_DOC_TYPE')
  if (res.success) {
    kbDocTypeList.value = res.data ?? []
  }
}

watch(() => dicStore.globalProjectCode, (newVal) => {
  globalProjectName.value = localStorage.getItem('global_ProjectName')
  globalProjectStatus.value = localStorage.getItem('global_ProjectStatus')
  searchProDoc.projectCode = newVal
  activeTab.value = '1'
  handleProDocSerach()
})

onBeforeMount(async () => {
  // 加载项目文档的文档类型列表
  await loadProDocTypeList()
  searchProDoc.projectCode = localStorage.getItem('global_ProjectCode')
  // 默认10条，不再动态计算高度，因为改为分页模式
  searchProDoc.size = 10
  getProDocList()
})

</script>

<style lang="scss" scoped>
.demand-main {
  padding: 12px 20px 20px; // 调整边距以适应全屏感
  background: #f6f8fc;
  height: 100%;

  .project-tag-bar {
    margin-bottom: 15px;

    .project-tag {
      display: inline-block;
      background-color: #d3e3fd; // 浅蓝底色
      color: #031e49; // 蓝色文字
      padding: 0 12px;
      height: 28px;
      line-height: 28px;
      font-size: 12px;
      border-radius: 4px;
      font-weight: 500;
    }
  }

  .main-container {
    padding: 16px 20px 20px;
    min-height: calc(100vh - 200px);

    .search-content {
      margin-bottom: 22px;

      // 覆盖Element默认表单样式以对齐
      :deep(.el-form-item) {
        margin-bottom: 0;
        margin-right: 20px;
      }
    }

    .table-box {
      // 链接文字样式
      .link-text {
        color: #2173f7;
        cursor: pointer;
        text-decoration: underline;

        &:hover {
          opacity: 0.8;
        }
      }

      // 分页器样式
      .pagination-box {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}

// 覆盖 Element Plus 表格头部样式，实现图中的浅蓝色表头
:deep(.custom-header) {
  th {
    background-color: #eaf5ff !important; // 浅蓝色背景
    color: #333;
    font-weight: 600;
  }
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

.search-form {

  :deep(.el-select__wrapper) {
    height: 28px;
    line-height: 28px;
    min-height: 28px;
    border-radius: 0;
  }

  :deep(.el-input ) {
    height: 28px;
    line-height: 28px;
    border-radius: 0;
  }

  :deep(.el-input__wrapper) {
    border-radius: 0;
  }

  .btn-primary {
    height: 28px;
    line-height: 28px;
    border-radius: 3px;
  }

  .btn-reset {
    height: 28px;
    line-height: 28px;
    border-radius: 3px;
  }
}

.table-card-list {
  height: calc(100vh - 310px);
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  gap: 16px;
  overflow-y: auto;

  .table-card-item{
    position: relative;
    width: calc((100% - 48px) / 4);
    height: 154px;
    margin-bottom: 16px;
    background: #fff;
    border: 1px solid #e2e3e5;
    border-radius: 8px;
    padding: 16px;
    box-sizing: border-box;

    &:hover{
      border: 1px solid rgba(33,115,247,0.5);
      box-shadow: 0 4px 12px 0 rgba(127,181,255,0.5);

      .left-tip{
        background: url(@/assets/webp/left-hover.webp) no-repeat;
        background-size: 100%;
        color: #fff;
      }
    }

    .left-tip{
      position: absolute;
      left: -1px;
      top: -1px;
      background: url(@/assets/webp/left.webp) no-repeat;
      background-size: 100%;
      width: 181px;
      height: 53px;
      font-size: 13px;
      color: #727682;
      padding: 12px 0 0 16px;
    }

    .right-tip{
      position: absolute;
      right: 16px;
      top: 11px;
      font-size: 12px;
      color: #333;

      i{
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url(@/assets/webp/p_tips.webp) no-repeat;
        background-size: 100%;
        margin-right: 6px;
        vertical-align: -4px;
      }
    }

    .table-card-section{
      margin-top: 36px;

      .title{
        color: #2173f7;
        font-size: 16px;
        font-weight: bold;
        text-decoration: underline;
        cursor: pointer;
        padding-bottom: 10px;
        border-bottom: 1px dotted #e9eaec;
        width: 100%;
      }

      .bottom{
        margin-top: 10px;
        justify-content: space-between;

        .left-time{
          text-align: left;

          .time{
            font-size: 12px;
            color: #999;
            margin-bottom: 6px;
          }

          .time-text{
            font-size: 12px;
            color: #333;
          }
        }

        .right-time{
          text-align: right;

          .time{
            font-size: 12px;
            color: #999;
            margin-bottom: 6px;
          }

          .time-text{
            font-size: 12px;
            color: #333;
          }
        }
      }
    }
  }
}
</style>