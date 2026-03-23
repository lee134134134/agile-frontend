<template>
    <div class="main-content">
        <MenuBreadCom :type="'1'"></MenuBreadCom>
        <div class="template-add">
            <div class="opt-btn" @click="handleAddTemFn">新建模板</div>
        </div>

        <div class="page-table">
            <el-table scrollbar-always-on :data="temTable" v-loading="temLoading" fit stripe style="width: 100%"
                :header-cell-style="TableRowStyle" max-height="calc(100vh - 420px)">
                <el-table-column label="文档类型" min-width="100" align="left">
                    <template #default="scope">
                        <span class="link-text" @click="handleOpenEditFn(scope.row)">{{ scope.row.documentType }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="roleStrName" label="授权角色" min-width="180" align="left"></el-table-column>
                <el-table-column label="生效状态" min-width="120" align="left">
                    <template #default="{ row, column, $index }">
                        <el-switch v-model="row.effectiveStatus" :active-value="1" :inactive-value="0"
                            @change="statusChange(row)" :disabled="row.documentCode == null"></el-switch>
                        <p class="suffix-text" v-if="row.documentCode == null">当前模板未配置模板文档，暂不支持该操作</p>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="200" align="center">
                    <template #default="{ row, column, $index }">
                        <!-- @click="handleDelete(scope.row)" -->
                        <div class="jus-center">
                            <div class="jus-start-center gap8 btn-margin-right">
                                <el-icon class="moveIcon" @click="handleMove(row.id, '1')">
                                    <ArrowUp />
                                </el-icon>
                                <el-icon class="moveIcon" @click="handleMove(row.id, '-1')">
                                    <ArrowDown />
                                </el-icon>
                            </div>
                            <el-button type="text" class="btn-text-primary" @click="handleEditFn(row)">
                              <img :src="editIcon" alt="编辑" title="编辑" class="table-icon"/>
                            </el-button>
                            <el-button type="text" class="btn-text-danger"
                                :class="row.effectiveStatus == '1' ? 'disabled-btn' : 'text-btn'"
                                :disabled="row.effectiveStatus == '1'" @click="deleFn(row.id)">
                              <img v-if="row.effectiveStatus == '1'" :src="deleteGrayIcon" alt="删除" title="删除" class="table-icon"/>
                              <img v-else :src="deleteIcon" alt="删除" title="删除" class="table-icon"/>
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="paginationg-box">
                <pagination @currentPageCurrent="currentPageCurrent" @currentPageSize="currentPageSize" :total="total"
                    :currentPage="temPageFrom.current" :pageSize="temPageFrom.size">
                </pagination>
            </div>
        </div>
        <TemOptDia v-if="isOperateDia" :isShow="isOperateDia" :type="operateType" :detailInfo="detailInfo"
            @closeDiaFn="handleCloseDia" @confirmFn="handleAddData" @editConfirmFn="handleEditSubFn"></TemOptDia>
        <EditDia v-if="isEditComShow" ref="emitRef" :isShow="isEditComShow" :type="editorDiaType" :info="editorParams"
            @closeDiaFn="handleCloseEditor" @confirmFn="handleAddEditor" @confirmAutoFn="handleUpDateEditor"
            @confirmSaveHFn="handleUpSaveEditor"></EditDia>
    </div>
</template>
<script setup>
import { ref, reactive, onMounted, onBeforeMount } from 'vue';
import { TableRowStyle } from '@/utils';
import pagination from '@/components/pagination.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import MenuBreadCom from './components/MenuBreadCom.vue';
import TemOptDia from './components/TemOptDia.vue';
import EditDia from './components/EditDia.vue';
import { getDicDefaultVal, filterDicName } from '@/utils';
import { getDicList } from '@/api/api.js';
import { roleSelectList } from '@/api/userManage.js';
import { getTemListFn, temAddList, getFileInfo, movePermission, temEditFn, temDeleFn } from '@/api/docManage.js';
import { useDicStore } from '@/stores/dic.js';
import editGrayIcon from "@/assets/webp/edit_gray.webp";
import editIcon from "@/assets/webp/edit.webp";
import deleteGrayIcon from "@/assets/webp/delete_gray.webp";
import deleteIcon from "@/assets/webp/delete.webp";
const dicStore = useDicStore()
const temPageFrom = reactive({
    current: 1,
    size: 10
})
const total = ref(0)
const temTable = ref([])
const temLoading = ref(false)
const isOperateDia = ref(false)
const operateType = ref('')
const detailInfo = ref(null)
const isEditComShow = ref(false)//编辑器弹窗
const editorDiaType = ref('')//编辑器弹窗类型：1：新增;2:编辑
const editorParams = ref(null)//编辑器弹窗需要信息
const emitRef = ref(null)
const handleAddTemFn = () => {
    isOperateDia.value = true
    operateType.value = '新建'
    detailInfo.value = null
}
const handleEditFn = (row) => {
    isOperateDia.value = true
    operateType.value = '编辑'
    detailInfo.value = row
}
const currentPageCurrent = (val) => {
    temPageFrom.current = val
    getTemList()
}
const currentPageSize = (val) => {
    temPageFrom.size = val
    temPageFrom.current = 1
    getTemList()
}
function getTemList() {
    temLoading.value = true
    getTemListFn(temPageFrom).then(res => {
        if (res.success) {
            temTable.value = res.data.records;
            total.value = res.data.total;
            temLoading.value = false;
        }
    }).catch(() => {
        temLoading.value = false;
    })
}
const statusChange = (data) => {
    // 调用编辑接口
    let params = {
        documentType: data.documentTypeCode,
        id: data.id,
        effectiveStatus: data.effectiveStatus
    }
    handleEditSubFn(params)
}
// 上下移动
const handleMove = (id, opt) => {
    let params = {
        templateId: id,
        type: opt
    }
    movePermission(params).then(res => {
        if (res.success) {
            ElMessage.success('移动成功！')
            getTemList() // 刷新列表
        }
    })
}
const handleCloseDia = () => {
    isOperateDia.value = false
    operateType.value = ''
    detailInfo.value = null
}

const handleAddData = async (form) => {
    temAddList(form).then(res => {
        if (res.success) {
            isOperateDia.value = false
            operateType.value = ''
            detailInfo.value = null
            getTemList()
            // 打开文件编辑器
            isEditComShow.value = true
            editorDiaType.value = '1'
            editorParams.value = {
                fileName: filterDicName(dicStore.docTemTypeList, form.documentType),
                fileContent: '',
                templateId: res.data.id,
                date: res.data.createdAt,
            }
        }
    })
}
const handleEditSubFn = (form) => {
    temEditFn(form).then(res => {
        if (res.success) {
            operateType.value = ''
            detailInfo.value = null
            isOperateDia.value = false
            ElMessage.success('操作成功！')
            getTemList()
        }
    })
}
const deleFn = (data) => {
    ElMessageBox.confirm(`该文档将实时移出，是否确认删除？删除后请及时维护该类型模板文档`, '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        center: false,
        closeOnClickModal: false,
        autofocus: false,
        type: 'warning',
    }).then(() => {
        temDeleFn({ id: data }).then(res => {
            if (res.success) {
                ElMessage.success('删除成功！')
                getTemList()
            }
        })
    }).catch(() => {
        console.log('catch')
    })
}
//文档编辑器相关
const handleOpenEditFn = (data) => {
    if (data.documentCode != null) {
        let params = {
            documentCode: data.documentCode
        }
        getFileInfo(params).then(res => {
            isEditComShow.value = true
            editorDiaType.value = '2'
            editorParams.value = {
                fileName: data.documentType,
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
            fileName: data.documentType,
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
    $http.put(`agile-biz/api/document/templates/upload`, data).then(res => {
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
    $http.put(`agile-biz/api/document/templates/upload`, data).then(res => {
        if (res.success) {
            ElMessage.success('自动保存成功！')
            editorParams.value.date = res.data.updatedAt

        }
    })
}
const handleUpSaveEditor = (data) => {
    $http.put(`agile-biz/api/document/templates/upload`, data.params).then(res => {
        if (res.success) {
            editorParams.value.date = res.data.updatedAt
            emitRef.value.handleFileOpt(data.code)
        }
    })
}
const getDicListFn = async (code) => {
    await getDicList(code).then(res => {
        if (res.success) {
            switch (code) {
                case 'DOC_TYPE':
                    dicStore.docTemTypeList = res?.data ?? []
                    dicStore.docTemTypePriority = getDicDefaultVal(res.data)
                    break;
            }
        }
    })
}
const getAllUserListFn = async () => {
    await roleSelectList().then(res => {
        if (res.success) {
            dicStore.userList = res?.data ?? []
        }
    })
}
onBeforeMount(async () => {
    getTemList()
    await getDicListFn('DOC_TYPE')
    await getAllUserListFn()
})
</script>
<style lang="scss" scoped>
.main-content {
    .template-add {
        display: flex;
        justify-content: start;
        margin-top: 20px;
        margin-bottom: 10px;

        .opt-btn {
            padding: 0 12px;
        }
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
    }

    .mt25 {
        margin-top: 25px;
    }

    .ml12 {
        margin-left: 12px;
    }

    .gap8 {
        gap: 8px;
    }

    .fontBold {
        font-weight: bold !important;
    }

    .fontGrey {
        color: #bcbcbc;
    }

    .moveIcon {
        background: #2173f7;
        color: #fff;
        font-size: 16px;
        border-radius: 4px;
        cursor: pointer;
    }

    .moveIcon:hover {
        opacity: 0.8;
    }

    .disabled-btn {
        color: #B2B2B2 !important;
        cursor: default;
    }
}
</style>