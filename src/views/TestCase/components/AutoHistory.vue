<template>
    <el-dialog v-model="showDia" :show-close="false" width="1200px" min-height='300px' @close="handleClose" class="edit-dia fix-edit-dia-warpper">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-icon"></div>
                    <div class="title-text">历史执行记录</div>
                </div>
                <el-icon class="dia-header-close" size="16px" @click="handleClose">
                    <Close />
                </el-icon>

            </div>
        </template>
        <div class="dia-main">
            <div class="dia-main-content">
                <el-table scrollbar-always-on :data="historyList" v-loading="loading" fit stripe
                    :header-cell-style="TableRowStyle3" :cell-style="{height: '36px'}" max-height="calc(100vh - 200px)"
                    :style="{ 'width': '100%', 'min-height': '200px' }" @select="handleSelect" @select-all="handleSelect">
                   
                    <el-table-column prop="execName" label="执行名称" min-width="180" align="left">
                        <template #default="{row, column, $index}">
                            {{ row.execName || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="status" label="状态" min-width="100" align="left">
                        <template #default="{row, column, $index}">
                            <div v-if="row.status" class="status-tag" :class="{'success-tag': row.status == 'passed', 'fail-tag': row.status == 'failed'}">
                                {{ row.status == 'passed' ? '成功' : row.status == 'failed' ? '失败' : '-' }}
                            </div>
                            <div v-else>-</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="startTime" label="开始时间" min-width="180" align="left">
                        <template #default="{row, column, $index}">
                            {{ row.startTime || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="endTime" label="结束时间" min-width="180" align="left">
                        <template #default="{row, column, $index}">
                            {{ row.endTime || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="运行创建时间" min-width="180" align="left">
                        <template #default="{row, column, $index}">
                            {{ row.createTime || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="createByName" label="执行人" min-width="100" align="left">
                        <template #default="{row, column, $index}">
                            {{ row.createByName || '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180" align="left">
                        <template #default="{row, column, $index}">
                            <el-button type="text text-btn" :class="{'disabled-btn': !checkHasFile('report', row.execFilelist)}" @click="handleViewRpt('report', row.execFilelist)">查看报告</el-button>
                            <el-button type="text text-btn" :class="{'disabled-btn': !checkHasFile('log', row.execFilelist)}" @click="handleViewRpt('log', row.execFilelist)">查看日志</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="dia-footer jus-flex-end">
                <div class="btn-cancel" @click="handleClose">关闭</div>
            </div>
        </div>

    </el-dialog>
</template>
<script setup>
import { ref, reactive, onBeforeMount, onMounted, watch } from 'vue';
import { isValidVersion } from "@/utils/index.js";
import { TableRowStyle3 } from '@/utils';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getSign } from '@/api/testCaseApi';
const props = defineProps(['isShow', 'historyList']);
const emits = defineEmits([ 'closeDiaFn']);

const showDia = ref(props.isShow ?? false)

const handleClose = () => {
    showDia.value = false
    emits('closeDiaFn')
}

const checkHasFile = (type, fileList) => {
    let result = false
    if(fileList && fileList.length > 0) {
        fileList.forEach(item => {
            if(item.artifactType == type) {
                result = true
            }
        })
    }
    return result
}

const handleViewRpt = (type, fileList) => {
    if(!fileList || fileList.length == 0) {
        return
    }
    let url = ''
    fileList.forEach(item => {
        if(item.artifactType == type) {
            url = item.artifactPath
        }
    })
    viewReport(url)
}

// 查看报告
const viewReport = (url) => {
    getSign(url).then(res => {
        if(res.success) {
            window.open(res.data, '_blank')
        }
    })
}

onMounted(() => {
    
})
</script>
<style lang="scss" >
.edit-dia {
    // background: linear-gradient(180deg, #dde7ff 0%, #f7f9fe 25%, #ffffff 100%);
    box-shadow: 0px 2px 15px 5px rgba(0, 0, 0, 0.1);
    border-radius: 8px;

    .dia-main {
        .dia-main-content {
            // padding: 0 72px;

            .el-form-item--label-right .el-form-item__label {
                font-weight: 400 !important;
                font-size: 14px;
                color: #333;
            }
            .el-table .el-table__cell {
                padding: 2px 0;
                .cell {
                    color: #333;
                }
            }
        }
    }
}
</style>
<style lang="scss" scoped>
.dia-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 15px 0;

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
    }
    .title-text {
        font-family: PingFang SC;
        font-weight: 600;
        font-size: 16px;
        color: #333333;
        line-height: 22px;
        text-align: left;
        font-style: normal;
        text-transform: none;
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
    padding: 0 10px;
    .status-tag {
        width: 32px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #FFF;
        border-radius: 3px;
        font-size: 11px;
    }
    .success-tag {
        background-color: #04B42A;
    }
    .fail-tag {
        background-color: #E94738;
    }

    .disabled-btn {
        color: #B2B2B2 !important;
        cursor: default;
    }

}

.dia-footer {
    margin-top: 16px;
    .btn-cancel {
        height: 30px;
        line-height: 30px;
        margin-right: 12px;
        border-radius: 4px;
        border: 1px solid #E2E4E8;
    }

    .btn-cancel:hover {
        border: 1px solid #316af6;
    }

    .btn-submit {
        height: 30px;
        line-height: 30px;
        border-radius: 4px;
    }
}
</style>