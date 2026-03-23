<template>
  <div class="main-content">
    <MenuBreadCom :type="'2'"></MenuBreadCom>
    <div class="search-content jus-bet-center bg-color-1 border-radius-8">
      <el-form ref="searchFromRef" :model="searchFrom">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="文档标题" prop="docTitle">
              <el-input v-model="searchFrom.docTitle" clearable placeholder="请输入"
                        style="width: 260px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="文档类型" prop="docType">
              <el-select v-model="searchFrom.docType" clearable placeholder="请选择" style="width: 260px;">
                <el-option v-for="item in docTypeList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="文档状态" prop="docStatus">
              <el-select v-model="searchFrom.docStatus" clearable placeholder="请选择" style="width: 260px;">
                <el-option v-for="item in statusList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="可见性" prop="visibility">
              <el-select v-model="searchFrom.visibility" clearable placeholder="请选择" style="width: 260px;">
                <el-option v-for="item in visibleList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="search-btn jus-flex-end">
        <div class="btn-primary btn-primary-mini btn-margin-right" @click="handleSerach">筛选</div>
        <div class="btn-circle btn-circle-mini" @click="handleReset">重置</div>
      </div>
    </div>
    <div class="btn-content jus-start-end">
      <div class="opt-btn opt-btn-mini btn-margin-right" @click="handleSelectDeleFn">批量删除</div>
      <div class="opt-btn opt-btn-mini" @click="handleDeleAllFn">全部清空</div>
    </div>

    <div class="page-table">
      <el-table v-loading="temLoading" :data="temTable" :header-cell-style="TableRowStyle" fit max-height="calc(100vh - 410px)" scrollbar-always-on
                stripe style="width: 100%" @select="handleSelectDown"
                @select-all="handleSelectDown">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column align="left" label="文档标题" min-width="100">
          <template #default="scope">
            <span class="link-text" @click="handleDocEditFn(scope.row)">{{ scope.row.docTitle }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="文档类型" min-width="150">
          <template #default="scope">
            <span>{{ filterDicName(docTypeList, scope.row.docType) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="文档状态" min-width="100">
          <template #default="scope">
            <span>{{ filterDicName(statusList, scope.row.docStatus) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="可见性" min-width="120">
          <template #default="scope">
            <span>{{ filterDicName(visibleList, scope.row.visibility) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="描述" min-width="180" prop="description"
                         show-overflow-tooltip></el-table-column>

        <el-table-column align="left" label="操作" width="150">
          <template #default="{ row, column, $index }">
            <div class="jus-center">
              <el-button class="btn-text-primary" type="text" @click="handleCheckDetail(row)">
                <el-tooltip content="查看" effect="light" popper-class="fix-tooltip" placement="top">
                  <img :src="viewIcon" alt="查看" class="table-icon"/>
                </el-tooltip>
              </el-button>
              <el-popconfirm :width="420" hide-icon="true" placement="right" popper-class="download-popper"
                             trigger="click">
                <template #reference>
                  <el-button class="btn-text-primary" type="text">
                    <el-tooltip content="下载" effect="light" popper-class="fix-tooltip" placement="top">
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
                    <div class="opt-btn btn-margin-right" @click="handleDownFn('word', row, confirm())">
                      下载word文件
                    </div>
                    <div class="opt-btn " @click="handleDownFn('pdf', row, confirm())">
                      下载PDF文件
                    </div>
                  </div>
                </template>

              </el-popconfirm>
              <el-button class="btn-text-primary" type="text" @click="handleRecoveryFn(row.id)">
                <el-tooltip content="恢复" effect="light" placement="top" popper-class="fix-tooltip">
                  <img :src="passIcon" alt="恢复" class="table-icon"/>
                </el-tooltip>
              </el-button>
              <el-button class="btn-text-danger" type="text" @click="handleDele(row.id)">
                <el-tooltip content="删除" effect="light" placement="top" popper-class="fix-tooltip">
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
                  @closeDiaFn="handleCloseDia">
    </KnowledgeOpt>
    <EditDia v-if="isEditComShow" :info="editorParams" :isShow="isEditComShow" :type="editorDiaType"
             @closeDiaFn="handleCloseEditor" @confirmAutoFn="handleUpDateEditor" @confirmFn="handleAddEditor"
             @confirmSaveHFn="handleUpSaveEditor"></EditDia>
  </div>
</template>
<script setup>
import {onBeforeMount, reactive, ref} from 'vue';
import {filterDicName, getDicDefaultVal, TableRowStyle} from '@/utils';
import pagination from '@/components/pagination.vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import MenuBreadCom from './components/MenuBreadCom.vue';
import KnowledgeOpt from './components/KnowledgeOpt.vue';
import EditDia from './components/EditDia.vue';
import {
  checkPdfFile,
  deleClearAllKnowledgeDocFn,
  deleClearKnowledgeDocFn,
  editKnowledgeDocFn,
  getClearAllKnowledgeDocNumFn,
  getFile,
  getFileInfo,
  getKnowledgeListFn,
  getPdfFile
} from '@/api/docManage.js';
import {getDicList} from '@/api/api.js';
import {useDicStore} from '@/stores/dic.js';
import viewIcon from "@/assets/webp/view-icon.webp";
import downloadIcon from "@/assets/webp/download.webp";
import deleteIcon from "@/assets/webp/delete.webp";
import passIcon from "@/assets/webp/ico-password.webp";

const dicStore = useDicStore()
const searchFromRef = ref(null)
const searchFrom = reactive({
  visibility: '',
  docType: '',
  docStatus: '',
  docTitle: '',
  isDel: '1',
  size: 10,
  current: 1,
})
const total = ref(0)
const temTable = ref([])
const temLoading = ref(false)
const visibleList = ref([])
const docTypeList = ref([])
const statusList = ref([])
const isOperateDia = ref(false)
const operateType = ref('')
const detailInfo = ref(null)
const isEditComShow = ref(false)//编辑器弹窗
const editorDiaType = ref('')//编辑器弹窗类型：1：新增;2:编辑
const editorParams = ref(null)//编辑器弹窗需要信息
const deleArr = ref([])
const rolesCode = ref([])
const downParams = reactive({
  isWater: '1',
  type: 'word'
})
const handleSerach = () => {
  searchFrom.current = 1;
  getTemList()
};

const handleReset = () => {
  searchFromRef.value.resetFields();
  searchFrom.current = 1;
  getTemList()
};
const currentPageCurrent = (val) => {
  searchFrom.current = val
  getTemList()
}
const currentPageSize = (val) => {
  searchFrom.size = val
  searchFrom.current = 1
  getTemList()
}

function getTemList() {
  temLoading.value = true
  getKnowledgeListFn(searchFrom).then(res => {
    if (res.success) {
      temTable.value = res.data.records;
      total.value = res.data.total;
      temLoading.value = false;
    }
  }).catch(() => {
    temLoading.value = false;
  })
}

const handleSelectDown = (selection) => {
  deleArr.value = []
  selection.forEach(item => {
    deleArr.value.push(item.id)
  })
}
const handleSelectDeleFn = () => {
  if (deleArr.value.length <= 0) {
    ElMessage.warning('请勾选文件！')
    return
  } else {
    ElMessageBox.confirm(`请确认是否将本次${deleArr.value.length}个文档永久删除，此操作无法撤销，请确认是否执行？`, '', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      center: false,
      closeOnClickModal: false,
      autofocus: false,
      type: 'warning',
    }).then(() => {
      let params = {
        ids: deleArr.value,
        flag: 1
      }
      deleClearKnowledgeDocFn(params).then(res => {
        if (res.success) {
          ElMessage.success('操作成功！')
          getTemList()
        }
      })
    }).catch(() => {
      console.log('catch')
    })
  }
}
const handleCheckDetail = (data) => {
  isOperateDia.value = true
  operateType.value = '查看'
  detailInfo.value = data
}
const handleCloseDia = () => {
  isOperateDia.value = false
  operateType.value = ''
  detailInfo.value = null
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
  editorDiaType.value = ''
  editorParams.value = null
}
const handleAddEditor = (data) => {
  //保存编辑器内容
  $http.put(`agile-biz/api/knowledge/documents/upload`, data).then(res => {
    if (res.success) {
      ElMessage.success('文档保存成功！')
      getTemList()
      isEditComShow.value = false
      editorDiaType.value = ''
      editorParams.value = null
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
  $http.put(`agile-biz/api/document/project/upload`, data).then(res => {
    if (res.success) {
      editorParams.value.date = res.data.updatedAt
    }
  })
}
const handleDele = (data) => {
  ElMessageBox.confirm(`您即将永久删除该文档，此操作无法撤销，请确认是否执行？`, '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    center: false,
    closeOnClickModal: false,
    autofocus: false,
    type: 'warning',
  }).then(() => {
    let params = {
      ids: [data],
      flag: 1
    }
    deleClearKnowledgeDocFn(params).then(res => {
      if (res.success) {
        ElMessage.success('操作成功！')
        getTemList()
      }
    })
  }).catch(() => {
    console.log('catch')
  })
}
const handleDeleAllFn = () => {
  //全部清空
  getClearAllKnowledgeDocNumFn().then(res => {
    if (res.success) {
      ElMessageBox.confirm(`请确认是否将本次${res.data}个文档永久删除，此操作无法撤销，请确认是否执行？`, '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        center: false,
        closeOnClickModal: false,
        autofocus: false,
        type: 'warning',
      }).then(() => {
        deleClearAllKnowledgeDocFn().then(res => {
          if (res.success) {
            ElMessage.success('操作成功！')
            getTemList()
          }
        })
      }).catch(() => {
        console.log('catch')
      })
    }
  })
}
const handleRecoveryFn = (data) => {
  ElMessageBox.confirm(`该文档将恢复至原文档列表`, '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    center: false,
    closeOnClickModal: false,
    autofocus: false,
    type: 'warning',
  }).then(() => {
    let form = {
      id: data,
      isDel: 0
    }
    editKnowledgeDocFn(form).then(res => {
      if (res.success) {
        ElMessage.success('操作成功！')
        getTemList()
      }
    })
  }).catch(() => {
    console.log('catch')
  })
}
const getDicListFn = async (code) => {
  await getDicList(code).then(res => {
    if (res.success) {
      switch (code) {
        case 'KB_DOC_TYPE':
          dicStore.knowDocTypeList = res?.data ?? []
          dicStore.defaultKnowDocType = getDicDefaultVal(res.data)
          docTypeList.value = res?.data ?? []
          break;
        case 'KB_DOC_STATUS':
          dicStore.knowDocStatusList = res?.data ?? []
          dicStore.defaultKnowDocStatus = getDicDefaultVal(res.data)
          statusList.value = res?.data ?? []
          break;
        case 'KB_DOC_VISIBILITY':
          dicStore.knowDocVisList = res?.data ?? []
          dicStore.defaultKnowDocVis = getDicDefaultVal(res.data)
          visibleList.value = res?.data ?? []
          break;
      }
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
  getTemList()
  await getDicListFn('KB_DOC_TYPE')
  await getDicListFn('KB_DOC_STATUS')
  await getDicListFn('KB_DOC_VISIBILITY')
})
</script>
<style lang="scss" scoped>
.main-content {
  .template-add {
    display: flex;
    justify-content: end;

    .opt-btn {
      padding: 5px 15px;
      padding-top: 3px;
    }
  }


  .search-content {
    margin-top: 12px;

    .search-btn {
      margin-left: 20px;
      padding-right: 20px;
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
    margin: 12px 0 16px;
  }

  .page-table {
    .status-content {
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

.btn-primary-mini, .opt-btn-mini{
  height: 28px;
  line-height: 28px;
  padding: 0 12px;
  font-size: 12px;
  border-radius: 4px;
}

.btn-circle-mini{
  height: 28px;
  line-height: 28px;
  padding: 0 12px;
  font-size: 12px;
  border-radius: 4px;
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
</style>