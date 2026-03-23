<template>
    <el-dialog v-model="detailShow" :show-close="false" width="660px" @close="handleClose">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-icon"></div>
                    <div class="title-text">权限配置</div>
                </div>
                <el-icon class="dia-header-close" size="16px" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>
        <div class="dia-main">
            <el-checkbox-group v-model="checkDatas" class="dia-main-content">
                <el-checkbox v-for="item in configList" :key="item.id" :label="item.name" :value="item.id"></el-checkbox>
            </el-checkbox-group>

            <div class="dia-footer jus-center">
                <div class="btn-cancel" @click="handleClose">取消</div>
                <div class="btn-submit" @click="handleSubmit">确认</div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onBeforeMount } from 'vue';
import { Close } from '@element-plus/icons-vue';
import { configFn } from '@/api/RoleManagement.js';
const props = defineProps(['isShow', 'data', 'list']);
const emits = defineEmits([
    'closeDiaFn',
    'confirmFn'])
const detailShow = ref(props.isShow ?? false)
const configList = ref([])
const checkDatas = ref([])
const tableData = ref([
    {
        id: '1',
        type: 0,
        name: '迭代回顾',
        router: null,
        description: '迭代回归功能描述',
        isEnabled: 1,
        isPublic: 1,
        children: [
            {
                id: '1-1',
                type: 1,
                name: '知识详情',
                router: 'docManagement',
                description: 'docManagement',
                isEnabled: 1,
                isPublic: 1,
                children: [
                    {
                        id: '1-1-1',
                        type: 2,
                        name: '新增',
                        router: '',
                        description: 'docManagement-btn',
                        isEnabled: 0,
                        isPublic: 0,

                    }
                ]
            }, {
                id: '1-2',
                type: 0,
                name: '二级菜单',
                router: 'docManagementa',
                description: 'docManagement',
                isEnabled: 1,
                isPublic: 1,
                children: [
                    {
                        id: '1-2-1',
                        type: 2,
                        name: '编辑',
                        router: '',
                        description: 'docManagement-btn',
                        isEnabled: 1,
                        isPublic: 0,
                    }, {
                        id: '1-2-2',
                        type: 1,
                        name: '三级菜单',
                        router: 'docManagement3',
                        description: 'docManagement3',
                        isEnabled: '1',
                        isPublic: '1',
                        children: [
                            {
                                id: '1-2-2-1',
                                type: 2,
                                name: '新增',
                                router: '',
                                description: 'docManagement-btn',
                                isEnabled: 1,
                                isPublic: 0,

                            }
                        ]
                    }
                ]
            },
        ]
    }, {
        id: '2',
        type: 0,
        name: '系统配置',
        router: null,
        description: '迭代回归功能描述',
        isEnabled: 1,
        isPublic: 1,
    }
])
watch(() => props.data, (newName) => {
    checkDatas.value = newName.featureIds ?? []
    configList.value = props.list ?? []
}, { immediate: true });
const handleClose = () => {
    detailShow.value = false
    emits('closeDiaFn')
}
const handleSubmit = () => {
    let params = {
        'roleId': props.data.id,
        'featureIds': checkDatas.value
    }
    configFn(params).then(res => {
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
    padding: 20px 15px;

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
    padding-bottom: 30px;
    padding-left: 20px;
    padding-right: 20px;

    .dia-main-content {
        margin-bottom: 30px;

        :deep(.el-checkbox) {
            min-width: 110px !important;

            .el-checkbox__label {
                color: #1D1D1D !important;
                font-weight: 500;
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