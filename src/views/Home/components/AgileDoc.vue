<template>
  <div class="agile-content">
    <div class="content-header jus-bet-end">
      <div class="title-1">知识库</div>
      <div class="header-opt jus-center">
        <el-segmented v-model="activeTab" :options="['项目文档','知识库文档']" @change="handleTabChange"/>
      </div>
    </div>
    <div id="docView" ref="docViewRef" class="list-content">
      <el-table :class="{'height':!isHeight}" :data="listData" :default-expand-all="false"
                :header-cell-style="TableRowStyle3Fixed" fit
                height="calc(100vh - 724px)" row-key="id" scrollbar-always-on stripe
                style="width: 100%">
        <el-table-column v-if="activeTab === '项目文档'" align="left" fixed label="文档名称" min-width="350"
                         prop="documentTitle" show-overflow-tooltip>
          <template #default="scope">
            <span class="tap-text" @click.stop="handleOpen(scope.row)">{{ scope.row.documentTitle }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="activeTab !== '项目文档'" align="left" fixed label="文档名称" min-width="350"
                         prop="docTitle" show-overflow-tooltip>
          <template #default="scope">
            <span class="tap-text" @click.stop="handleOpen(scope.row)">{{ scope.row.docTitle }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="作者" min-width="150" prop="updatedBy"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="left" label="更新时间" min-width="150" prop="updatedAt"
                         show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <reviewDia v-if="reviewShow" :info="info" :isShow="reviewShow" :name='doctitle' @closeDiaFn="handleClose">
    </reviewDia>
  </div>
</template>
<script setup>
import {onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {getKnowledgeListViewFn, getProListFn} from '@/api/docManage.js';
import reviewDia from './reviewDia.vue';
import {useDicStore} from "@/stores/dic.js";
import {TableRowStyle3Fixed} from "@/utils/index.js";

const docViewRef = ref(null)
const activeTab = ref('项目文档')
const reviewShow = ref(false)
const info = ref('')
const doctitle = ref('')
const innerHeight = ref(null)
const size = ref(null)
const reSizeWatcher = ref(null)
const isHeight = ref(false)

const dicStore = useDicStore()
watch(() => dicStore.globalProjectCode, () => {
  handleTabChange(activeTab.value)
})

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
const handleTabChange = (type) => {
  activeTab.value = type
  if (type == '项目文档') {
    getProDocList()
  } else {
    getKnowledgeList()
  }
}

function getProDocList() {
  //获取项目文档列表
  listData.value = []
  getProListFn({size: size.value, current: 1, projectCode: localStorage.getItem('global_ProjectCode')}).then(res => {
    if (res.success) {
      listData.value = res.data.records
    }
  })
}

function getKnowledgeList() {
  listData.value = []
  getKnowledgeListViewFn({size: size.value, current: 1}).then(res => {
    if (res.success) {
      listData.value = res.data.records
    }

  })
}

const listData = ref([])
const observeBox = () => {
  reSizeWatcher.value = new ResizeObserver(entries => {
    for (let entry of entries) {
      const height = entry.contentRect.height
      innerHeight.value = height
      size.value = 10
      if (activeTab.value == '项目文档') {
        getProDocList()
      } else {
        getKnowledgeList()
      }
    }
  })
  reSizeWatcher.value.observe(docViewRef.value)
}
onMounted(async () => {
  isHeight.value = JSON.parse(localStorage.getItem('agiles_user'))?.rolesCode.includes('admin')
  observeBox()
})
onBeforeUnmount(() => {
  if (reSizeWatcher.value) {
    reSizeWatcher.value.disconnect()
    reSizeWatcher.value = false
  }
})
</script>
<style lang="scss" scoped>
.agile-content {
  margin: 15px 0;
  background: #fff;
  padding: 10px 20px;
  border-radius: 12px;
  overflow-y: auto;

  .content-header {
    margin-bottom: 10px;

    .header-opt {
      .el-segmented {
        //--el-segmented-item-selected-bg-color: #fff;
        //--el-segmented-item-selected-color: #333;
      }

      .opt-btn {
        padding-top: 4px;
      }

      .opt-btn-gray {
        padding-top: 4px;
      }
    }
  }

  .list-content {

    .list-item {
      width: 100%;
      padding: 0 10px;
      margin-bottom: 10px;
      height: 36px;
      line-height: 36px;
      background: #f6fbff;
      border-radius: 8px;
      cursor: pointer;

      .item-left {
        width: calc(100% - 350px);

        .item-icon {
          width: 4px;
          height: 4px;
          background: #2173f7;
          margin-right: 10px;
        }
      }

      .item-right {
        width: 320px;
      }
    }
  }
}

:deep(.el-table .el-table__cell) {
  height: 37px;
  padding: 0;
}

.tap-text {
  color: #1D7CFF;
  text-decoration: underline;
  cursor: pointer;
}

.height {
  height: calc(100vh - 568px) !important;
}

.header-opt {
  :deep(.el-segmented) {
    background: #f5f5f5;
  }

  :deep(.el-segmented__item-selected) {
    background: #fff;
    font-size: 14px;
  }

  :deep(.el-segmented__item.is-selected .el-segmented__item-label) {
    font-weight: bold;
  }

  :deep(.el-segmented__item-label) {
    color: #333;
  }
}
</style>