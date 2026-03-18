<template>
    <el-dialog v-model="diaShow" :show-close="false" width="500px" @close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" class="edit-dia">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-icon"></div>
                    <div class="title-text">批量修改执行状态</div>
                </div>
                <el-icon class="dia-header-close" size="16px" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>
        <div class="dia-main">
            <el-form ref="dataFormRef" :model="dataForm" class="dia-main-content"
                label-width="70px" label-position="right">
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="执行状态" prop="executionStatus">
                            <el-select v-model="dataForm.executionStatus" placeholder="请选择">
                                <el-option v-for="item in dicStore.executeStatusList" :key="item.value" :label="item.name" :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="测试结果" prop="testResult">
                            <el-select v-model="dataForm.testResult" placeholder="请选择">
                                <el-option v-for="item in dicStore.testResultList" :key="item.value" :label="item.name" :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="dia-footer jus-flex-end">
                <div class="btn-cancel" @click="handleClose">取消</div>
              <div class="btn-submit" @click="handleSubmit">保存</div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onBeforeMount, onMounted } from 'vue';
import { Close } from '@element-plus/icons-vue';
import { useDicStore } from '@/stores/dic.js';
import { ElMessage } from 'element-plus';

const dicStore = useDicStore()
const props = defineProps(['isShow']);
const emits = defineEmits(['closeDiaFn', 'confirmFn'])
const diaShow = ref(props.isShow ?? false)

const dataFormRef = ref(null)
const dataForm = reactive({
    executionStatus: '',
    testResult: '',
})

const handleSubmit = () => {
    if (dataFormRef.value) {
        dataFormRef.value.validate((valid) => {
            if (valid) {
                if(!dataForm.executionStatus && !dataForm.testResult) {
                    ElMessage.warning('请选择执行状态或测试结果')
                    return
                }
                emits('confirmFn', dataForm)
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

    .dia-footer {
        .btn-cancel {
            margin-right: 12px;
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