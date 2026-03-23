<template>
    <el-dialog v-model="detailShow" :show-close="false" width="880px" @close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" class="edit-dia">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-icon"></div>
                    <div class="title-text">角色分配</div>
                </div>
                <el-icon class="dia-header-close" size="16px" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>
        <div class="dia-main">
            <el-checkbox-group v-model="checkDatas" class="dia-main-content">
                <el-checkbox v-for="item in configList" :key="item.id" :label="item.displayName"
                    :value="item.id"></el-checkbox>
            </el-checkbox-group>

            <div class="dia-footer jus-flex-end">
                <div class="btn-cancel" @click="handleClose">取消</div>
                <div class="btn-submit" @click="handleSubmit">确认</div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onBeforeMount } from 'vue';
import { Close } from '@element-plus/icons-vue';
import { addRole } from '@/api/userManage.js';
const props = defineProps(['isShow', 'data', 'list']);
const emits = defineEmits([
    'closeDiaFn',
    'confirmFn'])
const detailShow = ref(props.isShow ?? false)
const configList = ref([])
const checkDatas = ref([])
watch(() => props.data, (newName) => {
    checkDatas.value = newName.roleIds ?? []
    configList.value = props.list ?? []
}, { immediate: true });
const handleClose = () => {
    detailShow.value = false
    emits('closeDiaFn')
}
const handleSubmit = () => {
    let params = {
        'userId': props.data.id,
        'roleIds': checkDatas.value
    }
    addRole(params).then(res => {
        if (res.success) {
            emits('confirmFn')
        }
    })
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
            font-size: 16px;
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

    .dia-main-content {
        // margin-bottom: 30px;

        :deep(.el-checkbox) {
            min-width: 130px !important;
            align-items: first baseline;

            .el-checkbox__label {
                display: inline-block;
                max-width: 120px;
                white-space: pre-wrap;
                color: #1D1D1D !important;
                font-weight: 500;
                line-height: 22px;
            }
        }
    }

    .dia-footer {
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