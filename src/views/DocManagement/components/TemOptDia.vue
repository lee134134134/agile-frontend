<template>
    <el-dialog v-model="addShow" :show-close="false" width="514px" @close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" class="edit-dia">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-icon"></div>
                    <div class="title-text">{{ title }}模板</div>
                </div>
                <el-icon class="dia-header-close" size="16px" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>
        <div class="dia-main">
            <el-form ref="detailFromRef" :model="detailFrom" :rules="detailRule" class="dia-main-content"
                label-width="80px" label-position="right">
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="文档类型" prop="documentType">
                            <el-select v-model="detailFrom.documentType" placeholder="请选择" clearable>
                                <el-option v-for="item in docTypeList" :key="item.value" :label="item.name"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="授权角色" prop="roleIds">
                            <el-select v-model="detailFrom.roleIds" placeholder="请选择" clearable multiple collapse-tags collapse-tags-tooltip filterable
                                @remove-tag="handleRemove" @clear="handleClear">
                                <el-option v-for="item in rolesList" :key="item.id" :label="item.displayName"
                                    :value="item.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" v-if="props.type == '编辑'">
                    <el-col :span="24">
                        <el-form-item label="是否生效" prop="effectiveStatus">
                            <el-select v-model="detailFrom.effectiveStatus" placeholder="请选择">
                                <el-option v-for="item in effectStatusList" :key="item.value" :label="item.name"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
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
import { useDicStore } from '@/stores/dic.js';
import { ElMessage, ElMessageBox } from 'element-plus';
const dicStore = useDicStore()
const props = defineProps(['type', 'isShow', 'detailInfo']);
const emits = defineEmits([
    'closeDiaFn',
    'confirmFn',
    'editConfirmFn'])
const addShow = ref(props.isShow ?? false)
const title = ref(props.type || '新建')
const detailFromRef = ref(null)
const detailFrom = reactive({
    documentType: dicStore.docTemTypePriority,
    roleIds: [3],
    effectiveStatus: ''
})
const docTypeList = ref(dicStore.docTemTypeList ?? [])
const rolesList = ref(dicStore.userList ?? [])
const effectStatusList = ref([
    {
        name: '是',
        value: '1'
    }, {
        name: '否',
        value: '0'
    }
])

const detailRule = {
    documentType: [{ required: true, message: '请选择文档类型', trigger: 'submit' }],
    roleIds: [{ required: true, message: '请选择授权角色', trigger: 'submit' }]
}

watch(() => props.type, (newName) => {
    title.value = newName
});

const handleRemove = (val) => {
    if (val == 3) {
        detailFrom.roleIds.push(3)
        ElMessage.warning('系统管理员不得移除！')
        return
    }
}
const handleClear = () => {
    detailFrom.roleIds.push(3)
}
const handleClose = () => {
    addShow.value = false
    emits('closeDiaFn')
}
const handleSubmit = () => {
    if (detailFromRef.value) {
        detailFromRef.value.validate((valid) => {
            if (valid) {
                if (props.type == '新建') {
                    detailFrom.effectiveStatus = '0'
                    emits('confirmFn', detailFrom)
                    return
                }
                if (props.type == '编辑') {
                    if (props.detailInfo.documentCode == null && detailFrom.effectiveStatus == '1') {
                        ElMessage.warning('当前模板未配置模板文档，不能进行生效操作！')
                        return
                    }
                    detailFrom.id = props.detailInfo.id
                    emits('editConfirmFn', detailFrom)
                }
            }
        })
    }
}

onBeforeMount(async () => {
    if (props.type != '新建') {
        detailFrom.documentType = props.detailInfo.documentTypeCode
        detailFrom.roleIds = props.detailInfo.roleIdArr
        detailFrom.effectiveStatus = props.detailInfo.effectiveStatus == 0 ? '0' : '1'
    }
})

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

    // .dia-main-content {
    //     margin-bottom: 30px;
    // }

    .dia-footer {
        .btn-cancel {
            margin-right: 12px;
        }
    }

    .info-text {
        font-family: 'PingFangSC';
        color: #000;
        font-size: 10px;
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

    .no-rquired {
        :deep(.el-form-item__label) {
            padding-left: 12px !important;
        }
    }
}
</style>