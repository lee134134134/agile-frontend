<template>
    <el-dialog v-model="showDia" :show-close="false" width="1000px" min-height='300px' @close="handleClose" class="edit-dia">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="title-text">测试执行详情</div>
                <el-icon class="dia-header-close" size="16px" @click="handleClose">
                    <Close />
                </el-icon>

            </div>
        </template>
        <div class="dia-main">
            <div class="dia-main-content">
                <div class="case-basic-info">
                    <div class="info-item">
                        <span class="info-title">执行名称</span>
                        <span class="info-value">{{ resultInfo.name }}执行名称执行名称执行名称执行名称</span>
                    </div>
                    <div class="jus-flex-start gap30">
                        <div class="info-item">
                            <span class="info-title">开始时间</span>
                            <span class="info-value">{{ resultInfo.startTime }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-title">结束时间</span>
                            <span class="info-value">{{ resultInfo.endTime }}</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <span class="info-title">状态</span>
                        <div v-if="resultInfo.status" class="status-tag" :class="{'success-tag': resultInfo.status == '成功', 'fail-tag': resultInfo.status == '失败'}">
                            {{ resultInfo.status }}
                        </div>
                    </div>
                </div>
                <div class="area-title">执行结果</div>
                <div class="result-content">

                </div>

                <div class="area-title">报告</div>
                <div class="jus-flex-start gap12">
                    <div class="opt-btn" @click="handleExport">查看报告</div>
                    <div class="opt-btn" @click="handleExport">查看日志</div>
                </div>

            </div>
        </div>

    </el-dialog>
</template>
<script setup>
import { ref, reactive, onBeforeMount, onMounted, watch } from 'vue';
import { isValidVersion } from "@/utils/index.js";
import { TableRowStyle3 } from '@/utils';
import { ElMessage, ElMessageBox } from 'element-plus';
import { uploadAttach, downloadAttach } from '@/api/growthSpaceApi';
const props = defineProps(['isShow', 'type', 'resultInfo']);
const emits = defineEmits([ 'closeDiaFn']);

const showDia = ref(props.isShow ?? false)



const handleClose = () => {
    showDia.value = false
    emits('closeDiaFn')
}

onMounted(() => {
    
})
</script>
<style lang="scss" >
// .edit-dia {
//     background: linear-gradient(180deg, #dde7ff 0%, #f7f9fe 25%, #ffffff 100%);
//     box-shadow: 0px 2px 15px 5px rgba(0, 0, 0, 0.1);
//     border-radius: 8px;
//     padding: 20px;

//     .dia-main {
//         .dia-main-content {
//             // padding: 0 72px;

//             .el-form-item--label-right .el-form-item__label {
//                 font-weight: 400 !important;
//                 font-size: 14px;
//                 color: #333;
//             }
//             .el-table .el-table__cell {
//                 padding: 2px 0;
//                 .cell {
//                     color: #333;
//                 }
//             }
//         }
//     }
// }
</style>
<style lang="scss" scoped>
.dia-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

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

    .dia-main-content {
        .gap30 {
            gap: 30px;
        }
        .gap12 {
            gap: 12px;
        }
        .case-basic-info {
            padding-bottom: 7px;
            border-bottom: 1px solid #E2E4E8;
            .info-item {
                display: flex;
                justify-content: start;
                align-items: start;
                gap: 12px;
                margin-bottom: 12px;
            }
            .info-title {
                color: #666;
            }
            .info-value {
                color: #333;
            }
            
        }
        .area-title {
            margin: 16px 0 8px 0;
            color: #666;
        }
        .result-content {
            height: 160px;
            border: 1px solid #E2E4E8;
            border-radius: 8px;
        }

    }
    

}

.dia-footer {
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