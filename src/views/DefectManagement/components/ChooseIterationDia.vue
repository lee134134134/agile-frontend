<template>
    <el-dialog v-model="diaShow" :show-close="false" width="500px" @close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" class="edit-dia">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-icon"></div>
                    <div class="title-text">生成缺陷报告</div>
                </div>
                <el-icon class="dia-header-close" size="16px" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>
        <div class="dia-main">
            <el-form ref="dataFormRef" :model="dataForm" class="dia-main-content">
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="选择迭代" prop="sprintId">
                            <el-select v-model="dataForm.sprintId" placeholder="请选择" clearable>
                                    <el-option-group v-for="group in props.currentData" :key="group.state" :label="group.state">
                                        <el-option v-for="item in group.list" :key="item.code" :label="item.name"
                                            :value="item.code" />
                                    </el-option-group>
                                </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="dia-footer jus-flex-end">
              <div class="opt-btn" @click="handleSubmit">查看缺陷报告</div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onBeforeMount, onMounted } from 'vue';
import { Close } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useDicStore } from '@/stores/dic.js';
const dicStore = useDicStore()

const props = defineProps(['isShow','currentData']);
const emits = defineEmits(['closeDiaFn', 'confirmFn'])
const diaShow = ref(props.isShow ?? false)

const dataFormRef = ref(null)
const dataForm = reactive({
    exeStatus: '',
    testResult: '',
})

const handleSubmit = () => {
    if (dataFormRef.value) {
        dataFormRef.value.validate((valid) => {
            if (valid) {
                if(!dataForm.sprintId) {
                    ElMessage.error('请选择迭代')
                    return
                }
                emits('confirmFn', dataForm.sprintId)
            }
        })
    }
}

const handleClose = () => {
    diaShow.value = false
    emits('closeDiaFn')
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
    // padding-left: 20px;
    // padding-right: 20px;

    // .dia-main-content {
    //     margin-bottom: 30px;
    // }

    .dia-footer {
        .btn-cancel {
            margin-left: 12px;
        }
    }

    .module-title {
        width: 100%;
        height: 32px;
        padding-left: 10px;
        box-sizing: border-box;
        line-height: 32px;
        background-color: #EFF7FF;
        font-size: 14px;
        color: #2173F7;
        font-weight: 600;
        margin-bottom: 16px;
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

    :deep(.el-form-item__label) {
        color: #555 !important;
        font-weight: 400 !important;
    }
}
</style>