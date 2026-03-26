<template>
  <div class="main-content">
    <div class="page-search">
      <div class="page-search jus-bet-center">
        <!-- <div class="title-1">文档管理</div> -->
        <div class="sel-global-project" style="margin-left: 0;">当前项目：{{ globalProjectName }} -
          {{ globalProjectStatus }}
        </div>
        <div v-show="btnAuthFileter('template_doc_conf')" class="template-add">
          <div class="opt-btn btn-margin-right" @click="handleAddTemFn">模板文档配置</div>
        </div>
      </div>
      <div class="search-content jus-bet-center bg-color-1 border-radius-8">
        <el-form ref="searchFromRef" :model="searchFrom">
          <div class="flex">
            <el-form-item label="文档类型" prop="documentType">
              <el-select v-model="searchFrom.documentType" clearable placeholder="请选择"
                         style="width: 160px;">
                <el-option v-for="item in docTypeList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="归档状态" prop="archiveStatus">
              <el-select v-model="searchFrom.archiveStatus" clearable placeholder="请选择"
                         style="width: 160px;">
                <el-option v-for="item in statusList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item label="关键词" prop="keyword">
              <el-input v-model="searchFrom.keyword" clearable placeholder="请输入"></el-input>
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
    <div class="btn-content jus-bet-center">
      <div class="opt-btn opt-btn-mini" @click="handleProjectAddFn">新增项目文档</div>
      <div class="opt-btn opt-btn-mini" @click="handleAllDownFn">批量下载</div>
    </div>
    <div class="page-table">
      <el-table v-loading="loading" :data="tableData" :header-cell-style="TableRowStyle" fit
                max-height="calc(100vh - 374px)" scrollbar-always-on
                stripe style="width: 100%" @select="handleSelectDown"
                @select-all="handleSelectDown">
        <el-table-column :selectable="selectableFn" type="selection" width="55"></el-table-column>
        <el-table-column align="left" label="所属项目" min-width="150" prop="projectName"></el-table-column>
        <el-table-column align="left" label="文档标题" min-width="300">
          <template #default="scope">
            <span class="link-text" @click="handleDocEditFn(scope.row)">{{ scope.row.documentTitle }}</span>
          </template>
          <template #header>
            <div>
              <span style="font-weight: bold;margin-right: 6px;">文档标题</span>
              <el-tooltip content="点击标题可直接编辑文档内容" effect="dark" placement="top" popper-class="fix-tooltip">
                <el-icon class="m-icon">
                  <Warning/>
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="left" label="文档类型" min-width="150" prop="documentType"></el-table-column>
        <el-table-column align="left" label="版本号" min-width="100" prop="versionNumber"></el-table-column>
        <el-table-column align="left" label="归档状态" min-width="120">
          <template #default="scope">
            <span v-if="scope.row.archiveStatus == 0" class="no-text">
              <img :src="archivedIcon" alt="未归档" class="table-small-icon"/>
              未归档
            </span>
            <span v-else class="all-text">
              <img :src="archivedNoIcon" alt="已归档" class="table-small-icon"/>
              已归档
            </span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="标签" min-width="180" prop="tags"
                         show-overflow-tooltip></el-table-column>
        <el-table-column align="left" label="最新更新时间" min-width="180" prop="updatedAt"></el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="140">
          <template #default="scope">
            <div>
              <el-button class="btn-text-primary" type="text"
                         @click="handleCheckDetail(scope.row)">
                <el-tooltip content="查看" effect="light" placement="top" popper-class="fix-tooltip">
                  <img :src="viewIcon" alt="查看" class="table-icon"/>
                </el-tooltip>
              </el-button>
              <el-popconfirm :width="420" hide-icon="true" placement="right" popper-class="download-popper"
                             trigger="click">
                <template #reference>
                  <el-button class="btn-text-primary" type="text">
                    <el-tooltip content="下载" effect="light" placement="top" popper-class="fix-tooltip">
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
              <!--              <el-button :class="isRoleOpt(scope.row.roles) == false ? 'disabled-btn' : 'text-btn'"-->
              <!--                         :disabled="isRoleOpt(scope.row.roles) == false" class="btn-text-primary"-->
              <!--                         type="text"-->
              <!--                         @click="handleEditDetail(scope.row)">-->
              <!--                <img v-if="isRoleOpt(scope.row.roles) == false" :src="editGrayIcon" alt="编辑" class="table-icon"-->
              <!--                     title="编辑"/>-->
              <!--                <img v-else :src="editIcon" alt="编辑" class="table-icon" title="编辑"/>-->
              <!--              </el-button>-->
              <!-- <el-button type="text" class="btn-text-primary">授权</el-button> -->
              <el-button
                  :class="isRoleOpt(scope.row.roles) == false || scope.row.archiveStatus == 1 ? 'disabled-btn' : 'text-btn'"
                  :disabled="isRoleOpt(scope.row.roles) == false || scope.row.archiveStatus == 1"
                  class="btn-text-danger"
                  type="text"
                  @click="handleDele(scope.row)">
                <el-tooltip content="删除" effect="light" placement="top" popper-class="fix-tooltip">
                  <img v-if="isRoleOpt(scope.row.roles) == false || scope.row.archiveStatus == 1" :src="deleteGrayIcon"
                       alt="删除" class="table-icon"/>
                  <img v-else :src="deleteIcon" alt="删除" class="table-icon"/>
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
    <ProDocDiaVue v-if="isOperateDia" :detailInfo="detailInfo" :isShow="isOperateDia" :temList="temList"
                  :type="operateType" @closeDiaFn="handleCloseDia" @confirmFn="handleAddData" @editConfirmFn="handleEditSubFn"
                  @editDiaFn="handleEditDia">
    </ProDocDiaVue>
    <EditDia v-if="isEditComShow" ref="emitRef" :info="editorParams" :isShow="isEditComShow" :type="editorDiaType"
             @closeDiaFn="handleCloseEditor" @confirmAutoFn="handleUpDateEditor" @confirmFn="handleAddEditor"
             @confirmSaveHFn="handleUpSaveEditor"></EditDia>
  </div>
</template>
<script setup>
import {onBeforeMount, reactive, ref, watch} from 'vue';
import {TableRowStyle} from '@/utils';
import pagination from '@/components/pagination.vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import ProDocDiaVue from './components/ProDocDia.vue';
import EditDia from './components/EditDia.vue';
import {btnAuthFileter} from "@/utils/index.js";
import {
  checkPdfFile,
  getFile,
  getFileInfo,
  getFileZip,
  getPdfFile,
  getProListFn,
  proDocAddFn,
  proDocDeleFn,
  proDocEditFn,
  temSelectFn
} from '@/api/docManage.js';
import {useRouter} from 'vue-router';
import {getDicList, getUserProjectList} from '@/api/api.js';
import {useDicStore} from '@/stores/dic.js';
import {getAllProjectList} from '@/api/demand.js';
import {Warning} from "@element-plus/icons-vue";
import deleteGrayIcon from "@/assets/webp/delete_gray.webp";
import deleteIcon from "@/assets/webp/delete.webp";
import viewIcon from "@/assets/webp/view-icon.webp";
import downloadIcon from "@/assets/webp/download.webp";
import archivedIcon from "@/assets/webp/archived.webp";

const dicStore = useDicStore()
const router = useRouter();
const searchFromRef = ref(null)
const searchFrom = reactive({
  projectCode: '',
  documentType: '',
  archiveStatus: '',
  keyword: '',
  size: 10,
  current: 1,
})
const total = ref(100);
const loading = ref(false)
const projectList = ref([])
const docTypeList = ref([])
const statusList = ref([
  {
    name: '已归档',
    value: '1'
  }, {
    name: '未归档',
    value: '0'
  }
])
const tableData = ref([]);
const isOperateDia = ref(false)
const operateType = ref('')
const detailInfo = ref(null)
const temList = ref([])
const rolesCode = ref([])
const downParams = reactive({
  isWater: '1',
  type: 'word'
})
const downArr = ref([])
const isEditComShow = ref(false)//编辑器弹窗
const editorDiaType = ref('')//编辑器弹窗类型：1：新增;2:编辑
const editorParams = ref(null)//编辑器弹窗需要信息
const emitRef = ref(null)
const globalProjectName = ref(localStorage.getItem('global_ProjectName'))
const globalProjectStatus = ref(localStorage.getItem('global_ProjectStatus'))
const isRoleOpt = (roles) => {
  let isRole = false
  rolesCode.value.forEach(item => {
    if (roles.includes(item)) {
      isRole = true
    }
  });
  return isRole
}
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
  getProListFn(searchFrom).then(res => {
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
const handleAllDownFn = () => {
  if (downArr.value.length <= 0) {
    ElMessage.warning('请勾选项目文件！')
    return
  } else {
    let params = {
      documentCodes: downArr.value,
      format: 'pdf',
      watermark: 1
    }
    checkPdfFile({'documentCodes': downArr.value}).then(res => {
      if (res.success) {
        if (res.data && res.data == true) {
          getFileZip(params).then(res => {
            const blob = new Blob([res]);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `项目文档.zip`; // 根据实际情况设置下载文件名
            a.click();
            window.URL.revokeObjectURL(url);
          })
        } else {
          ElMessage.warning('所选文件中存在未生成PDF的文档，请重新选择或稍后重试！')
          return
        }
      }
    })

  }
}
const selectableFn = (row) => {
  return row.documentCode != null
}
const handleSelectDown = (selection) => {
  downArr.value = []
  selection.forEach(item => {
    downArr.value.push(item.documentCode)
  })
}
const handleAddTemFn = () => {
  router.push('/docManagement/templateDoc')
}
const handleCheckDetail = (data) => {
  isOperateDia.value = true
  operateType.value = '查看'
  detailInfo.value = data
}
const handleEditDetail = (data) => {
  isOperateDia.value = true
  operateType.value = '编辑'
  detailInfo.value = data
}
const handleCloseDia = () => {
  isOperateDia.value = false
  operateType.value = ''
  detailInfo.value = null
}

const handleEditDia = () => {
  operateType.value = '编辑'
}

const handleAddData = async (form) => {
  proDocAddFn(form).then(res => {
    if (res.success) {
      isOperateDia.value = false
      operateType.value = ''
      detailInfo.value = null
      getList()
      // 打开文件编辑器
      let dataForm = {
        documentTitle: form.documentTitle,
        documentCode: '',
        id: res.data.id,
        updatedAt: res.data.updatedAt || '',
      }
      temList.value.forEach(item => {
        if (item.documentType == form.documentType) {
          dataForm.documentCode = item.documentCode
        }
      })
      openDocEditor(dataForm, '2')
    }
  })
}
const handleEditSubFn = (form) => {
  proDocEditFn(form).then(res => {
    if (res.success) {
      operateType.value = ''
      detailInfo.value = null
      isOperateDia.value = false
      getList()
    }
  })
}
const handleDele = (data) => {
  ElMessageBox.confirm(`该文件将实时移出，请确认是否删除？`, '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    center: false,
    closeOnClickModal: false,
    autofocus: false,
    type: 'warning',
  }).then(() => {
    proDocDeleFn({id: data.id}).then(res => {
      if (res.success) {
        ElMessage.success({message: '操作成功！', duration: 1500})
        getList()
      }
    })
  }).catch(() => {
    console.log('catch')
  })
}
// 文档编辑器相关
const handleDocEditFn = (data) => {
  if (data.archiveStatus == '1') {
    ElMessage.warning('已归档文件不支持编辑！')
    return
  }
  if (isRoleOpt(data.roles) == false) {
    ElMessage.warning('您目前没有开通该文件的编辑权限，请联系管理员！')
    return
  }
  if (data.documentCode != null) {
    openDocEditor(data, '2')
  } else {
    let dataForm = {
      documentTitle: data.documentTitle,
      documentCode: '',
      id: data.id,
      updatedAt: data.createdAt || '',
    }
    temList.value.forEach(item => {
      if (item.templateName == data.documentType) {
        dataForm.documentCode = item.documentCode
      }
    })
    openDocEditor(dataForm, '2')
  }

}

function openDocEditor(data, optType) {
  //打开文档编辑器弹窗
  let params = {
    documentCode: data.documentCode
  }
  getFileInfo(params).then(res => {
    isEditComShow.value = true
    editorDiaType.value = optType
    editorParams.value = {
      fileName: data.documentTitle,
      fileContent: res ? res : '',
      templateId: data.id,
      date: data.updatedAt,
      documentCode: data.documentCode
    }
  })
}

const handleCloseEditor = () => {
  isEditComShow.value = false
  getList()
  editorDiaType.value = ''
  editorParams.value = null
}
const handleAddEditor = (data) => {
  //保存编辑器内容
  $http.put(`agile-biz/api/document/project/upload`, data).then(res => {
    if (res.success) {
      ElMessage.success({message: '文档保存成功！', duration: 1500})
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
  $http.put(`agile-biz/api/document/project/upload`, data).then(res => {
    if (res.success) {
      ElMessage.success({message: '自动保存成功！', duration: 1500})
      editorParams.value.date = res.data.updatedAt
    }
  })
}
const handleUpSaveEditor = (data) => {
  $http.put(`agile-biz/api/document/project/upload`, data.params).then(res => {
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
            a.download = `${data.documentTitle}.pdf`; // 根据实际情况设置下载文件名
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
      let blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.style.display = 'none'
      document.body.appendChild(a)
      a.href = url;
      a.download = `${data.documentTitle}.docx`; // 根据实际情况设置下载文件名
      a.click();
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url);
    })
  }

}
const getAllProjectListFn = async () => {
  await getAllProjectList().then(res => {
    if (res.success) {
      dicStore.projectList = res?.data ?? []
    }
  })
}
const getDicListFn = async (code) => {
  await getDicList(code).then(res => {
    if (res.success) {
      switch (code) {
        case 'DOC_TYPE':
          docTypeList.value = res?.data ?? []
          break;
      }
    }
  })
}
const getTemSelectFn = () => {
  temSelectFn().then(res => {
    if (res.success) {
      temList.value = res?.data ?? []
    }
  })
}
const getUserProjectFn = () => {
  getUserProjectList().then(res => {
    if (res.success) {
      projectList.value = res?.data ?? []
    }
  })
}

watch(() => dicStore.globalProjectCode, (newVal) => {
  globalProjectName.value = localStorage.getItem('global_ProjectName')
  globalProjectStatus.value = localStorage.getItem('global_ProjectStatus')
  searchFrom.projectCode = newVal
  handleSerach()
})

onBeforeMount(async () => {
  rolesCode.value = JSON.parse(localStorage.getItem("agiles_user")).rolesCode
  searchFrom.projectCode = localStorage.getItem('global_ProjectCode') // 初始赋值：从缓存中取
  getList()
  await getAllProjectListFn()
  await getDicListFn('DOC_TYPE')
  getTemSelectFn()
  getUserProjectFn()

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
      padding: 0 12px;
      padding-top: 3px;
      height: 28px;
      line-height: 22px;
    }
  }

  .page-search {
    .search-content {
      margin-top: 12px;
      padding: 12px 16px;
      background-color: #FFF;

      .search-btn {
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
    margin: 12px 0 0 0;
    background: #fff;
    padding: 12px;
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

.mr-3 {
  vertical-align: -1px;
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
  padding: 0 6px;
  width: 64px;
  height: 28px;
  line-height: 28px;
  border-radius: 3px;
  border: 1px solid #e2e4e8;
}

.opt-btn-mini {
  height: 28px;
  line-height: 28px;
  padding: 0 12px;
}

.flex {
  gap: 16px
}

.m-icon {
  color: #2173F7;
  cursor: pointer;
  margin-top: 1px;
  vertical-align: -2px;
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

.no-text {
  color: #666;
}
</style>