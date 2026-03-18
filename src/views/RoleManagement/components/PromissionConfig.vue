<template>
    <el-dialog v-model="detailShow" :show-close="false" width="660px" @close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" class="edit-dia">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-icon"></div>
                    <div class="title-text">{{ roleName }}：权限配置</div>
                </div>
                <el-icon class="dia-header-close" size="16px" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>
        <div class="dia-main">
            <div class="tree-content">
                <!-- <div class="content-header">
                    <div class="header-text"></div>
                </div> -->
                <el-table ref="tablenuMultRef" scrollbar-always-on :data="tableData" v-loading="loading" fit stripe
                    style="width: 100%" :header-cell-style="TableRowStyle3" height="50vh"
                    :tree-props="{ children: 'children', hasChildren: 'hasChildren', checkStrictly: true }" row-key="id"
                    :default-expand-all="true" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="60" :selectable="handleSelectItem"></el-table-column>
                    <el-table-column prop="name" label="功能名称" min-width="120" align="left">
                        <template #default="scope">
                            <span v-if="scope.row.type == 0" class="text-level1">{{ scope.row.name }}</span>
                            <span v-if="scope.row.type == 1" class="text-level2">{{ scope.row.name }}</span>
                            <span v-if="scope.row.type == 2" class="text-level3">{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="类型" min-width="80" align="left">
                        <template #default="scope">
                            <div class="jus-start-center">
                                <div v-if="scope.row.type == 0" class="type-ml jus-center type-content">
                                    <img src="@/assets/images/log/type-ml_icon@2x.png" alt="" class="icon-type">
                                    目录
                                </div>
                                <div v-if="scope.row.type == 1" class="type-menu jus-center type-content">
                                    <img src="@/assets/images/log/type-menu_icon@2x.png" alt="" class="icon-type">
                                    菜单
                                </div>
                                <div v-if="scope.row.type == 2" class="type-btn jus-center type-content">
                                    <img src="@/assets/images/log/type-btn_icon@2x.png" alt="" class="icon-type">
                                    按钮
                                </div>
                            </div>
                        </template>
                    </el-table-column>

                </el-table>
            </div>
            <div class="dia-footer jus-flex-end">
                <div class="btn-cancel" @click="handleCloseConfirm">取消</div>
                <div class="btn-submit" @click="handleSubmit">确认</div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onBeforeMount, nextTick } from 'vue';
import { Close } from '@element-plus/icons-vue';
import { configFn } from '@/api/RoleManagement.js';
import { TableRowStyle3 } from '@/utils';
import { ElMessage, ElMessageBox } from 'element-plus';
const props = defineProps(['isShow', 'data', 'list']);
const emits = defineEmits([
    'closeDiaFn',
    'confirmFn'])
const detailShow = ref(props.isShow ?? false)
const configList = ref([])
const checkDatas = ref([])
const roleName = ref('')
const multipSelection = ref([])
const tableData = ref([])
let tablenuMultRef = ref(null)
watch(() => props.data, (newName) => {
    roleName.value = newName.displayName ?? '-'
    tableData.value = props.list ?? []
    if (tableData.value) {
        nextTick(() => {
            toggleFn(newName.featureIds, tableData.value)
        })

    }

}, { immediate: true });
const handleSelectItem = (row) => {
    return row.disabled == true
}
const handleClose = () => {
    detailShow.value = false
    emits('closeDiaFn')
}
const handleCloseConfirm = () => {
    ElMessageBox.confirm(`角色权限将恢复为本次编辑前的状态，请确定是否取消本次变更？`, '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        center: false,
        closeOnClickModal: false,
        autofocus: false,
        type: 'warning',
    }).then(() => {
        handleClose()
    }).catch(() => {
        console.log('catch')
    })
}
const handleSubmit = () => {
    let sysArr = []
    let btnArr = []
    if (multipSelection.value && multipSelection.value.length > 0) {
        multipSelection.value.forEach(item => {
            if (item.type != 2) {
                sysArr.push(item.id)
            } else {
                btnArr.push(item.id)
            }
        });
    }
    let params = {
        'roleId': props.data.id,
        'sys': sysArr,
        'button': btnArr
    }
    configFn(params).then(res => {
        if (res.success) {
            emits('confirmFn')
        }
    })
}
const handleSelectionChange = (val) => {
    multipSelection.value = val
}
function toggleFn(ids, tableData) {
    function findNodes(node) {
        if (node.children && node.children.length > 0) {
            if (ids.includes(node.id)) {
                tablenuMultRef.value?.toggleRowSelection(node, true)
            }
            node.children.forEach((child) => {
                findNodes(child);
            });
        } else {
            if (ids.includes(node.id)) {
                tablenuMultRef.value?.toggleRowSelection(node, true)
            }
        }
    }
    tableData.forEach((node) => findNodes(node));
}
</script>
<style lang="scss" scoped>
.dia-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 15px 20px;

    .dia-header-title {
        display: flex;
        align-items: center;

        .title-icon {
            margin-right: 10px;
            width: 4px;
            height: 20px;
            background: #2173F7;
            border-radius: 2px 2px 2px 2px;
        }

        .title-text {
            font-family: PingFang SC;
            font-weight: 600;
            font-size: 18px;
            color: #1D1D1D;
            line-height: 22px;
            text-align: left;
            font-style: normal;
            text-transform: none;
        }
    }

    .dia-header-close {
        cursor: pointer;

        svg {
            width: 1.5em;
            height: 1.5em;
        }
    }
}

.dia-main {
    // padding-bottom: 30px;
    padding-left: 20px;
    padding-right: 20px;

    .dia-main-content {
        // margin-bottom: 30px;

        :deep(.el-checkbox) {
            min-width: 110px !important;

            .el-checkbox__label {
                color: #1D1D1D !important;
                font-weight: 500;
            }
        }
    }


    .type-content {
        width: 53px;
        height: 21px;
        line-height: 21px;
        border-radius: 4px;
        text-align: center;
        font-weight: 400;
        font-size: 12px;
        gap: 3px;
    }

    .icon-type {
        width: 12px;
        height: 12px;
        display: block;
    }

    .type-ml {
        background: linear-gradient(270deg, rgba(163, 189, 255, 0.18) 0%, rgba(93, 88, 254, 0.18) 100%);
        border: 1px solid #5d58ff2e;
        color: #675fee;
    }

    .type-menu {
        background: linear-gradient(270deg, rgba(223, 241, 255, 0.9) 0%, rgba(198, 215, 254, 0.9) 100%);
        border: 1px solid rgba(184, 213, 255, 0.9);
        color: #1258c7;
    }

    .type-btn {
        background: linear-gradient(270deg, rgba(255, 224, 206, 0.65) 0%, rgba(255, 191, 165, 0.65) 100%);
        border: 1px solid rgba(250, 214, 195, 0.65);
        color: #ff5b02;
    }

    .text-level1 {
        font-size: 14px;
        color: #333;
        font-weight: 550;
    }

    .text-level2 {
        font-size: 14px;
        color: #333;
        font-weight: 400;
    }

    .text-level3 {
        font-size: 14px;
        color: #666;
        font-weight: 400;
    }

    :deep(.el-table) {
        .el-table__cell {
            height: 37px !important;
            line-height: 37px !important;
            padding: 0;

        }

        td.el-table__cell,
        th.el-table__cell.is-leaf {
            border-bottom: 1px solid #e2e4e8 !important;
        }

        --el-table-border-color:none !important
    }

    .dia-footer {
        margin-top: 15px;

        .btn-cancel {
            margin-right: 12px;
        }
    }

    :deep(.el-input) {
        --el-input-height: 28px;
        --el-input-border-color: #DBDDE3;
        --el-input-border-radius: 4px;
        --el-input-padding-left: 10px;
        --el-input-padding-right: 10px;
    }

    :deep(.el-select__wrapper) {
        min-height: 28px;
        border-radius: 4px;
    }

    :deep(.el-textarea) {
        --el-input-border-color: #DBDDE3;
        --el-input-border-radius: 4px;
        --el-input-padding-left: 10px;
        --el-input-padding-right: 10px;

        .el-textarea__inner {
            height: 88px !important;
        }
    }

    .no-rquired {
        :deep(.el-form-item__label) {
            padding-left: 12px !important;
        }
    }
}
</style>