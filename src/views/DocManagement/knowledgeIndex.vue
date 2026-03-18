<template>
  <div class="main-content">
    <div class="page-search">
      <div class="search-content jus-bet-center bg-color-1 border-radius-8">
        <el-form ref="searchFromRef" :model="searchFrom">
          <div class="flex">
            <el-form-item label="文档标题" prop="docTitle">
              <el-input v-model="searchFrom.docTitle" clearable placeholder="请输入" style="width: 260px;"></el-input>
            </el-form-item>
            <el-form-item label="文档类型" prop="docType">
              <el-select v-model="searchFrom.docType" clearable placeholder="请选择" style="width: 160px;">
                <el-option v-for="item in docTypeList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="文档状态" prop="docStatus">
              <el-select v-model="searchFrom.docStatus" clearable placeholder="请选择" style="width: 160px;">
                <el-option v-for="item in statusList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="可见性" prop="visibility">
              <el-select v-model="searchFrom.visibility" clearable placeholder="请选择"
                         style="width: 160px;">
                <el-option v-for="item in visibleList" :key="item.value" :label="item.name"
                           :value="item.value"/>
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
    <div class="btn-content jus-bet-center">
      <div class="opt-btn" @click="handleProjectAddFn">新增知识文档</div>
      <div class="template-add">
        <div class="opt-btn btn-margin-right" @click="toDeleListFn">已删除列表</div>
      </div>
    </div>
    <div class="page-table">
      <el-table v-loading="loading" :data="tableData" :header-cell-style="TableRowStyle" fit
                max-height="calc(100vh - 424px)" scrollbar-always-on
                stripe style="width: 100%">
        <el-table-column align="left" label="文档标题" min-width="300">
          <template #default="scope">
            <span class="link-text" @click="handleDocEditFn(scope.row)">{{ scope.row.docTitle }}</span>
          </template>
          <template #header>
            <div>
              <span style="font-weight: bold;margin-right: 6px;">文档标题</span>
              <el-tooltip content="点击标题可直接编辑文档内容" effect="dark" placement="top">
                <el-icon class="m-icon">
                  <Warning/>
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="文档类型" min-width="150">
          <template #default="scope">
            <span class="all-text">{{ filterDicName(docTypeList, scope.row.docType) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="文档状态" min-width="100☑">
          <template #default="scope">
            <span v-if="filterDicName(statusList, scope.row.docStatus) != '已发布'" class="no-text"><img
                :src="draftIcon" alt="草稿" class="table-wl-icon mr4 fix"/></span>
            <span v-else class="all-text"><img :src="archivedIcon" alt="已发布" class="table-wl-icon mr4"/></span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="可见性" min-width="120">
          <template #default="scope">
            <span v-if="filterDicName(visibleList, scope.row.visibility) !='私有'" class="no-text"><img
                :src="publicIcon" alt="公共" class="table-w-icon mr4"/></span>
            <span v-else class="all-text"><img :src="privateIcon" alt="私有" class="table-w-icon mr4"/></span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="操作" width="160">
          <template #default="scope">
            <div>
              <el-button class="btn-text-primary" type="text"
                         @click="handleCheckDetail(scope.row)">
                <el-tooltip content="查看" effect="light"  placement="top">
                  <img :src="viewIcon" alt="查看" class="table-icon"/>
                </el-tooltip>
              </el-button>
              <el-popconfirm :width="420" hide-icon="true" placement="right" popper-class="download-popper"
                             trigger="click">
                <template #reference>
                  <el-button class="btn-text-primary" type="text">
                    <el-tooltip content="下载" effect="light"  placement="top">
                      <img :src="downloadIcon" alt="下载" class="table-icon"/>
                    </el-tooltip>
                  </el-button>
                </template>
                <template #actions="{ confirm }">
                  <div v-if="rolesCode.includes('admin')" class="form-item jus-center ">
                    <div class="form-item-label">是否带水印</div>
                    <el-radio-group v-model="downParams.isWater">
                      <el-radio value="1">是</el-radio>
                      <el-radio value="0">否</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="jus-center download-popper-foot">
                    <div class="opt-btn btn-margin-right"
                         @click="handleDownFn('word', scope.row, confirm())">
                      下载word文件
                    </div>
                    <div class="opt-btn " @click="handleDownFn('pdf', scope.row, confirm())">
                      下载PDF文件
                    </div>
                  </div>
                </template>
              </el-popconfirm>
              <!--              <el-button class="btn-text-primary text-btn" type="text"-->
              <!--                         @click="handleEditDetail(scope.row)"><img :src="editIcon" alt="编辑" title="编辑" class="table-icon"/>-->
              <!--              </el-button>-->
              <el-button
                  :class="scope.row.docStatus != 'draft' || scope.row.documentCode == null ? 'disabled-btn' : 'text-btn'"
                  :disabled="scope.row.docStatus != 'draft' || scope.row.documentCode == null" class="btn-text-primary"
                  type="text"
                  @click="handleRelease(scope.row)">
                <el-tooltip content="发布" effect="light"  placement="top">
                  <img v-if="scope.row.docStatus != 'draft' || scope.row.documentCode == null" :src="publishGrayIcon"
                       alt="发布" class="table-icon"/>
                  <img v-else :src="publishIcon" alt="发布" class="table-icon"/>
                </el-tooltip>
              </el-button>
              <el-button class="btn-text-danger text-btn" type="text"
                         @click="handleDele(scope.row)">
                <el-tooltip content="删除" effect="light"  placement="top">
                  <img :src="deleteIcon" alt="删除" class="table-icon"/>
                </el-tooltip>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationg-box">
        <pagination :currentPage="searchFrom.current" :pageSize="searchFrom.size" :total="total"
                    @currentPageCurrent="currentPageCurrent" @currentPageSize="currentPageSize">
        </pagination>
      </div>
    </div>
    <KnowledgeOpt v-if="isOperateDia" :detailInfo="detailInfo" :isShow="isOperateDia" :type="operateType"
                  @closeDiaFn="handleCloseDia" @confirmFn="handleAddData" @editConfirmFn="handleEditSubFn"
                  @editDiaFn="handleEditDia">
    </KnowledgeOpt>
    <EditDia v-if="isEditComShow" ref="emitRef" :info="editorParams" :isShow="isEditComShow" :type="editorDiaType"
             @closeDiaFn="handleCloseEditor" @confirmAutoFn="handleUpDateEditor" @confirmFn="handleAddEditor"
             @confirmSaveHFn="handleUpSaveEditor"></EditDia>
  </div>
</template>
<script setup>
import {onBeforeMount, reactive, ref} from 'vue';
import {TableRowStyle} from '@/utils';
import pagination from '@/components/pagination.vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import KnowledgeOpt from './components/KnowledgeOpt.vue';
import EditDia from './components/EditDia.vue';
import {filterDicName} from "@/utils/index.js";
import {
  addKnowledgeDocFn,
  checkPdfFile,
  deleKnowledgeDocFn,
  editKnowledgeDocFn,
  getFile,
  getFileInfo,
  getKnowledgeListFn,
  getPdfFile
} from '@/api/docManage.js';
import {useRouter} from 'vue-router';
import {useDicStore} from '@/stores/dic.js';
import viewIcon from "@/assets/webp/view-icon.webp";
import downloadIcon from "@/assets/webp/download.webp";
import publishIcon from "@/assets/webp/publish.webp";
import publishGrayIcon from "@/assets/webp/publish_disable.webp";
import deleteIcon from "@/assets/webp/delete.webp";
import archivedIcon from "@/assets/webp/publish_icon.webp";
import draftIcon from "@/assets/webp/draft.webp";
import publicIcon from "@/assets/webp/public.webp";
import privateIcon from "@/assets/webp/private.webp";
import {Warning} from "@element-plus/icons-vue";

const dicStore = useDicStore()
const router = useRouter();
const searchFromRef = ref(null)
const searchFrom = reactive({
  visibility: '',
  docType: '',
  docStatus: '',
  docTitle: '',
  size: 10,
  current: 1,
})
const total = ref(100);
const loading = ref(false)
const visibleList = ref(dicStore.knowDocVisList ?? [])
const docTypeList = ref(dicStore.knowDocTypeList ?? [])
const statusList = ref(dicStore.knowDocStatusList ?? [])
const tableData = ref([]);
const isOperateDia = ref(false)
const operateType = ref('')
const detailInfo = ref(null)
const rolesCode = ref([])
const downParams = reactive({
  isWater: '1',
  type: 'word'
})

const isEditComShow = ref(false)//编辑器弹窗
const editorDiaType = ref('')//编辑器弹窗类型：1：新增;2:编辑
const editorParams = ref(null)//编辑器弹窗需要信息
const emitRef = ref(null)
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
  getKnowledgeListFn(searchFrom).then(res => {
    if (res.success) {
      tableData.value = res.data.records;
      total.value = res.data.total;
      loading.value = false;
    }
  }).catch(() => {
    loading.value = false;
  })
}

const handleProjectAddFn = () => {
  isOperateDia.value = true
  operateType.value = '新增'
  detailInfo.value = null
}
const toDeleListFn = () => {
  router.push('/docManagement/deleList')
}
const handleCheckDetail = (data) => {
  isOperateDia.value = true
  operateType.value = '查看'
  detailInfo.value = data
}
// const handleEditDetail = (data) => {
//   isOperateDia.value = true
//   operateType.value = '编辑'
//   detailInfo.value = data
// }
const handleCloseDia = () => {
  isOperateDia.value = false
  operateType.value = ''
  detailInfo.value = null
}

const handleEditDia = () => {
  operateType.value = '编辑'
}

const handleAddData = async (form) => {
  addKnowledgeDocFn(form).then(res => {
    if (res.success) {
      isOperateDia.value = false
      operateType.value = ''
      detailInfo.value = null
      getList()
      // 打开文件编辑器
      isEditComShow.value = true
      editorDiaType.value = '1'
      editorParams.value = {
        fileName: form.docTitle,
        fileContent: '',
        templateId: res.data.id,
        date: res.data.updateAt,
      }
    }
  })
}
const handleEditSubFn = (form) => {
  editKnowledgeDocFn(form).then(res => {
    if (res.success) {
      operateType.value = ''
      detailInfo.value = null
      isOperateDia.value = false
      ElMessage.success('操作成功！')
      getList()
    }
  })
}
const handleDele = (data) => {
  ElMessageBox.confirm(`请确认是否将该文档移至删除列表，您可在彻底删除之前随时恢复`, '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    center: false,
    closeOnClickModal: false,
    autofocus: false,
    type: 'warning',
  }).then(() => {
    deleKnowledgeDocFn({id: data.id}).then(res => {
      if (res.success) {
        ElMessage.success('操作成功！')
        getList()
      }
    })
  }).catch(() => {
    console.log('catch')
  })
}
const handleRelease = (data) => {
  //修改发布状态
  let form = {
    id: data.id,
    docStatus: 'published'
  }
  editKnowledgeDocFn(form).then(res => {
    if (res.success) {
      ElMessage.success('操作成功！')
      getList()
    }
  })
}
// 文档编辑器相关
const handleDocEditFn = (data) => {
  if (data.documentCode != null) {
    let params = {
      documentCode: data.documentCode
    }
    getFileInfo(params).then(res => {
      isEditComShow.value = true
      editorDiaType.value = '2'
      editorParams.value = {
        fileName: data.docTitle,
        fileContent: res,
        templateId: data.id,
        date: data.updatedAt,
        documentCode: data.documentCode
      }
    })
  } else {
    isEditComShow.value = true
    editorDiaType.value = '1'
    editorParams.value = {
      fileName: data.docTitle,
      fileContent: '',
      templateId: data.id,
      date: data.updatedAt,
      documentCode: data.documentCode
    }
  }
}

const handleCloseEditor = () => {
  isEditComShow.value = false
  getList()
  editorDiaType.value = ''
  editorParams.value = null
}
const handleAddEditor = (data) => {
  //保存编辑器内容
  $http.put(`agile-biz/api/knowledge/documents/upload`, data).then(res => {
    if (res.success) {
      ElMessage.success('文档保存成功！')
      emitRef.value.getHistoryListFn()
      // getList()
      // isEditComShow.value = false
      // editorDiaType.value = ''
      // editorParams.value = null
    }
  })
}
const handleUpDateEditor = (data) => {
  //自动保存
  $http.put(`agile-biz/api/knowledge/documents/upload`, data).then(res => {
    if (res.success) {
      ElMessage.success('自动保存成功！')
      editorParams.value.date = res.data.updatedAt
    }
  })
}
const handleUpSaveEditor = (data) => {
  $http.put(`agile-biz/api/knowledge/documents/upload`, data.params).then(res => {
    if (res.success) {
      editorParams.value.date = res.data.updatedAt
      emitRef.value.handleFileOpt(data.code)
    }
  })
}
const handleDownFn = (type, data, callback) => {
  downParams.type = type
  if (!data.documentCode) {
    ElMessage.warning('文档内容为空，不支持下载！')
    return
  }
  let params = {
    documentCode: data.documentCode,
    format: type,
    watermark: downParams.isWater
  }
  if (type == 'pdf') {
    checkPdfFile({'documentCodes': [data.documentCode]}).then(res => {
      if (res.success) {
        if (res.data && res.data == true) {
          getPdfFile(params).then(res => {
            const blob = new Blob([res], {type: 'application/pdf'});
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${data.docTitle}.pdf`; // 根据实际情况设置下载文件名
            a.click();
            window.URL.revokeObjectURL(url);
          })
        } else {
          ElMessage.warning('PDF生成中，请稍后再试！')
          return
        }
      }
    })

  } else {
    getFile(params).then(res => {
      const blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.docTitle}.docx`; // 根据实际情况设置下载文件名
      a.click();
      window.URL.revokeObjectURL(url);
    })
  }

}


onBeforeMount(async () => {
  rolesCode.value = JSON.parse(localStorage.getItem("agiles_user")).rolesCode
  getList()
})
</script>
<style lang="scss" scoped>
.main-content {
  padding: 0;
  margin: 0;

  .template-add {
    display: flex;
    justify-content: end;

    .opt-btn {
      height: 28px;
      line-height: 22px;
      padding: 0 15px;
      padding-top: 3px;
    }
  }

  .page-search {
    .search-content {
      margin-top: 12px;
      padding: 12px 16px;
      background-color: #FFF;

      .search-btn {
        display: flex;
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

  .btn-content {
    margin: 12px 0 0;
    background: #fff;
    padding: 0 12px;

    .opt-btn {
      height: 28px;
      line-height: 28px;
      padding: 0 12px;
      margin: 12px 0;
    }
  }

  .page-table {
    padding: 0 12px;
    background: #fff;

    .status-content {
      text-align: center;
    }

    .btn-text-primary {
      color: #2173F7 !important;
    }

    .btn-text-danger {
      color: #f56c6c !important;
    }

    .disabled-btn {
      color: #B2B2B2 !important;
      cursor: default;
    }

    .text-btn:hover {
      opacity: 0.8 !important;
    }

    .link-text {
      font-family: 'Microsoft YaHei', 'PingFang SC';;
      font-size: 14px;
      color: #2173F7;
      text-decoration-line: underline;
      cursor: pointer;
    }

    :deep(.el-table) {
      transform: scale(1);

      .el-popper {
        max-width: 50% !important;
      }
    }
  }
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

.flex {
  flex-wrap: wrap;
  gap: 16px;
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
</style>
<style lang="scss">
.download-popper {

  .form-item {
    margin: 20px 0;

    .form-item-label {
      width: 40%;
      margin-right: 40px;
      font-size: 14px;
      color: #555;
      text-align: left;
    }

    .form-item-label::before {
      color: var(--el-color-danger);
      content: "*";
      margin-right: 4px;

    }
  }

  .download-popper-foot {
    margin-bottom: 10px;
  }
}

.m-icon {
  color: #2173F7;
  cursor: pointer;
  margin-top: 1px;
  vertical-align: -2px;
}
</style>