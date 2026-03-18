<template>
    <el-dialog v-model="moveDiaShow" :show-close="false" width="560px" @close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" class="edit-dia">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-text">移动节点：{{ baseInfo.name }}</div>
                </div>
                <el-icon class="dia-header-close" size="16px" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>
        <div class="dia-main">
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-form-item label="类型" label-width="60px" label-position="right">
                        <div class="type-text">{{ baseInfo.type == '1' ? '菜单' : '目录' }}</div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-form-item label="移动至" label-width="60px" label-position="right">
                        <el-tree-select v-model="targetId" :data="menuTreeData" :props="defineProps" :check-strictly="true"
                            default-expand-all @change="handleMenuTreeChange"></el-tree-select>
                    </el-form-item>
                </el-col>
            </el-row>
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
import { findNodeByKey, addIsdisabled } from '@/utils/treeData.js';
import { ElMessage, ElMessageBox } from 'element-plus';
const props = defineProps(['isShow', 'nodeInfo', 'treeList']);
const emits = defineEmits([
    'closeDiaFn',
    'confirmFn',])
const moveDiaShow = ref(props.isShow ?? false)
const baseInfo = reactive({
    id: '',
    name: '',
    type: ''
})
const targetId = ref(null)
const targetParentId = ref(null)
const menuTreeData = ref([])
const defineProps = ref({
    children: 'children',
    label: 'label',
    value: 'id'
})
watch(() => props.nodeInfo, (newData) => {
    baseInfo.name = newData.title
    baseInfo.id = newData.id
    baseInfo.type = newData.type
}, { immediate: true })
watch(() => props.treeList, (newData) => {
    if (newData) {
        let arr1 = JSON.parse(JSON.stringify(newData))
        menuTreeData.value = addIsdisabled(arr1, 0)
    }
}, { immediate: true })

function handleMenuTreeChange(value) {
    targetParentId.vlaue = null
    targetParentId.vlaue = findNodeByKey(menuTreeData.value, value).id
}
const handleClose = () => {
    moveDiaShow.value = false
    emits('closeDiaFn')
}
const handleSubmit = () => {
    if (targetParentId.vlaue == null) {
        ElMessage.warning('请选择移动至节点')
        return
    }
    let params = {
        'id': baseInfo.id,
        'parentId': targetParentId.vlaue
    }
    emits('confirmFn', params)
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
        --el-input-border-color: #ccc;
        --el-input-border-radius: 4px;
        --el-input-padding-left: 10px;
        --el-input-padding-right: 10px;
    }

    :deep(.el-select__wrapper) {
        min-height: 28px;
        border-radius: 4px;
        border-color: #ccc !important;
        box-shadow: 0 0 0 1px #ccc inset;
    }

    :deep(.el-textarea) {
        --el-input-border-color: #ccc;
        --el-input-border-radius: 4px;
        --el-input-padding-left: 10px;
        --el-input-padding-right: 10px;

        .el-textarea__inner {
            height: 88px !important;
        }
    }

    :deep(.el-form-item__label) {
        color: #666 !important;
        font-weight: 400 !important;
    }

    .no-rquired {
        :deep(.el-form-item__label) {
            padding-left: 12px !important;
        }
    }
}
</style>