<template>
    <el-dialog v-model="addShow" :show-close="false" width="560px" @close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" class="edit-dia">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-text">编辑</div>
                </div>
                <el-icon class="dia-header-close" size="16px" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>
        <div class="dia-main">
            <el-form ref="detailFromRef" :model="detailFrom" :rules="detailRule" class="dia-main-content" label-width="85px"
                label-position="right">
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item :label="detailFrom.type == 0 ? '目录名称' : detailFrom.type == 1 ? '菜单名称' : '按钮名称'"
                            prop="title">
                            <el-input v-model="detailFrom.title" placeholder="请输入" maxlength="7" clearable
                                show-word-limit="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" v-if="detailFrom.type == 2">
                    <el-col :span="24">
                        <el-form-item label="编码" prop="code">
                            <el-input v-model="detailFrom.code" placeholder="请输入" maxlength="50" clearable
                                show-word-limit="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" v-if="detailFrom.type != 2">
                    <el-col :span="24">
                        <el-form-item label="路由" prop="routeName">
                            <el-input v-model="detailFrom.routeName" placeholder="请输入" clearable show-word-limit="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" v-if="detailFrom.type == 1">
                    <el-col :span="24">
                        <el-form-item label="路径" prop="component">
                            <el-input v-model="detailFrom.component" placeholder="请输入" clearable show-word-limit="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="功能描述" class="no-rquired">
                            <el-input v-model="detailFrom.description" type="textarea" placeholder="请输入" maxlength="100"
                                clearable show-word-limit="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" v-if="detailFrom.type == 0 || detailFrom.type == 1">
                    <el-col :span="24">
                        <el-form-item label="分组" prop="groupType">
                            <el-select v-model="detailFrom.groupType" placeholder="请选择" clearable multiple @change="handleChangeGroup">
                                <el-option v-for="item in groupTypeList" key="item.value" :label="item.name"
                                    :value="item.value" :disabled="item.disabled" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="启用状态" prop="isEnabled" class="no-rquired">
                            <el-switch v-model="detailFrom.isEnabled" :active-value="1" :inactive-value="0"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="是否公开" prop="isPublic" class="no-rquired">
                            <el-radio-group v-model="detailFrom.isPublic">
                                <el-radio :value="1">是</el-radio>
                                <el-radio :value="0">否</el-radio>
                            </el-radio-group>
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
import { findNodeByKey } from '@/utils/treeData.js'
import { useDicStore } from '@/stores/dic.js';

const dicStore = useDicStore()
const props = defineProps(['isShow', 'nodeInfo']);
const emits = defineEmits([
    'closeDiaFn',
    'confirmFn',
    'confirmBtnFn'])
const addShow = ref(props.isShow ?? false)
// const title = ref(props.type || '新增')
const detailFromRef = ref(null)
const detailFrom = reactive({
    type: null,
    title: '',
    code: '',
    routeName: '',
    component: '',
    description: '',
    groupType: [],
    isEnabled: 0,
    isPublic: 0
})
const selectedParentId = ref(null)
const detailRule = {
    title: [{ required: true, message: '请输入名称', trigger: 'submit' },
    { min: 1, max: 20, message: '长度在 1 到 7 个字符', trigger: 'submit' }
    ],
    routeName: [
        { required: true, message: '请输入路由', trigger: 'submit' },
    ],
    component: [
        { required: true, message: '请输入路径', trigger: 'submit' },
    ],
    code: [
        { required: true, message: '请输入编码', trigger: 'submit' },
        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'submit' }
    ],
    groupType: [{ required: true, message: '请选择分组', trigger: 'submit' }],
}
const groupTypeList = ref([])

watch(() => props.nodeInfo, (newData) => {
    detailFrom.title = newData.title
    detailFrom.code = newData.code
    detailFrom.type = newData.type
    detailFrom.routeName = newData.routeName
    detailFrom.component = newData.component
    detailFrom.description = newData.description
    detailFrom.isEnabled = newData.isEnabled
    detailFrom.isPublic = newData.isPublic
    if (newData.isOvert == 1) {
        detailFrom.groupType.push('public')
    } 
    if (newData.isBusiness == 1) {
        detailFrom.groupType.push('business')
    } 
    if (newData.isTool == 1) {
        detailFrom.groupType.push('tool')
    } 
    if (newData.isSystem == 1) {
        detailFrom.groupType.push('system')
    } 
}, { immediate: true })


const handleClose = () => {
    addShow.value = false
    emits('closeDiaFn')
}
const handleSubmit = () => {
    if (detailFromRef.value) {
        detailFromRef.value.validate((valid) => {
            if (valid) {
                console.log(detailFrom, '--detailFrom')
                if (detailFrom.type != 2) {
                    let textArr = detailFrom.routeName.split('/')
                    let name = textArr[textArr.length - 1]
                    let params = {
                        'id': props.nodeInfo.id,
                        'parentId': props.nodeInfo.parentId,
                        'type': detailFrom.type,
                        'title': detailFrom.title,
                        'routeName': detailFrom.routeName,
                        'isShow': props.nodeInfo.isShow,
                        'isInnerPage': props.nodeInfo.isInnerPage,
                        'navShow': props.nodeInfo.navShow,
                        'isEnabled': detailFrom.isEnabled,
                        'isPublic': detailFrom.isPublic,
                        'description': detailFrom.description,
                        'name': name,
                        'isOvert': detailFrom.groupType.includes('public') ? 1 : 0,
                        'isBusiness': detailFrom.groupType.includes('business') ? 1 : 0,
                        'isTool': detailFrom.groupType.includes('tool') ? 1 : 0,
                        'isSystem': detailFrom.groupType.includes('system') ? 1 : 0,
                        'component': detailFrom.type == 0 ? '' : detailFrom.component
                    }
                    emits('confirmFn', params)
                } else {
                    let params = {
                        'id': props.nodeInfo.id,
                        'buttonName': detailFrom.title,
                        'featureId': props.nodeInfo.parentId,
                        'isEnabled': detailFrom.isEnabled,
                        'isPublic': detailFrom.isPublic,
                        'des': detailFrom.description,
                        'buttonCode': detailFrom.code,
                    }
                    emits('confirmBtnFn', params)
                }
            }
        })
    }
}

const handleChangeGroup = () => {
    // 公开类和系统类互斥
    if(detailFrom.groupType.includes('public')) {
        let obj = groupTypeList.value.find(item => item.value == 'business')
        if(obj) obj.disabled = true
    }else {
        let obj = groupTypeList.value.find(item => item.value == 'business')
        if(obj) obj.disabled = false
    }
    if(detailFrom.groupType.includes('business')) {
        let obj = groupTypeList.value.find(item => item.value == 'public')
        if(obj) obj.disabled = true
    }else {
        let obj = groupTypeList.value.find(item => item.value == 'public')
        if(obj) obj.disabled = false
    }
}

// 目录只能选择公开类和业务类
watch(() => detailFrom.type, (newVal) => {
    if(newVal == 0) {
        groupTypeList.value = dicStore.groupTypeList.filter(item => item.value == 'public' || item.value == 'business')
    }else {
        groupTypeList.value = [...dicStore.groupTypeList]
    }
}, {immediate: true})

onBeforeMount(() => {
    handleChangeGroup()
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