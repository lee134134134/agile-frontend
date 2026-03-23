<template>
    <el-dialog v-model="addShow" :show-close="false" width="780px" @close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" class="edit-dia">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-icon"></div>
                    <div class="title-text">{{ title }}用户故事</div>
                </div>
                <el-icon class="dia-header-close" size="16px" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>
        <div class="dia-main">
            <el-form ref="detailFromRef" :model="detailFrom" :rules="detailRule" class="dia-main-content"
                label-width="110px" label-position="right">
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="故事标题" prop="title">
                            <el-input v-model="detailFrom.title" placeholder="请输入故事标题" maxlength="20" clearable
                                :disabled="type == '查看'" class="responsive-input" show-word-limit="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="故事描述" prop="description">
                            <el-input v-model="detailFrom.description" type="textarea" placeholder="作为<角色>，我希望<功能>，以便<价值>"
                                maxlength="200" clearable :disabled="type == '查看'" show-word-limit="true">
                            </el-input>
                            <p class="info-text">请使用"作为…我希望…以便…"的格式</p>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="验收标准" class="no-rquired">
                            <el-input v-model="detailFrom.acceptanceCriteria" type="textarea" placeholder="请输入验收标准"
                                maxlength="500" clearable :disabled="type == '查看'" show-word-limit="true">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="工作量(人/天)" prop="effort">
                            <el-input-number v-model="detailFrom.effort" placeholder="请选择" clearable :min="0.5" :max="11"
                                :precision="1" :step="0.5" controls-position="right" style="width: 100%;"
                                :disabled="type == '查看'"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="优先级" prop="priority" class="no-rquired">
                            <el-select v-model="detailFrom.priority" placeholder="请选择" clearable :disabled="type == '查看'">
                                <el-option v-for="item in statusList" key="item.value" :label="item.name"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                </el-row>

            </el-form>
            <div class="dia-footer jus-flex-end" v-show="type != '查看'">
                <div class="btn-cancel" @click="handleClose">取消</div>
                <div class="btn-submit" @click="handleSubmit">确认</div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onBeforeMount } from 'vue';
import { Close } from '@element-plus/icons-vue';
import { isValidStoryDec } from "@/utils/index.js";
const props = defineProps(['type', 'isShow', 'detailInfo', 'statusList', 'defaultStatus', 'demandId']);
const emits = defineEmits([
    'closeDiaFn',
    'confirmFn',
    'editConfirmFn'])
const addShow = ref(props.isShow ?? false)
const title = ref(props.type || '新增')
const detailFromRef = ref(null)
const detailFrom = reactive({
    title: '',
    description: '',
    acceptanceCriteria: '',
    effort: '0.5',
    priority: '',
})
const statusList = ref([])
const checkValue = (rule, value, callback) => {
    if (value == '') {
        return callback(new Error('请输入故事描述！'))
    } else if (!isValidStoryDec(value)) {
        return callback(new Error('您输入的故事描述不正确，请按照提示格式输入'))
    } else {
        return callback()
    }
}
const detailRule = {
    title: [
        { required: true, message: '请输入故事标题', trigger: 'submit' },
        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'submit' }
    ],
    description: [
        { required: true, validator: checkValue, trigger: 'submit' },
        { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'submit' }
    ],
    effort: [{ required: true, message: '请输入工作量（人/天）', trigger: 'submit' },
    { type: 'number', message: '请输入数字', trigger: 'submit' }],
    priority: [{ required: true, message: '请选择优先级', trigger: 'submit' }]

}

watch(() => props.type, (newName) => {
    title.value = newName
});
watch(() => props.statusList, (newName) => {
    statusList.value = newName
    detailFrom.priority = props.defaultStatus ?? ''
}, { immediate: true })

const handleClose = () => {
    addShow.value = false
    emits('closeDiaFn')
}
const handleSubmit = () => {
    if (detailFromRef.value) {
        detailFromRef.value.validate((valid) => {
            if (valid) {
                // addShow.value = false
                if (props.type == '添加') {
                    detailFrom.requirementCode = props.demandId
                    emits('confirmFn', detailFrom)
                    return
                }
                if (props.type == '编辑') {
                    detailFrom.requirementCode = props.demandId
                    detailFrom.storyCode = props.detailInfo.storyCode
                    emits('editConfirmFn', detailFrom)
                }
            }
        })
    }
}
onBeforeMount(async () => {
    if (props.type != '添加') {
        detailFrom.title = props.detailInfo.title
        detailFrom.description = props.detailInfo.description
        detailFrom.acceptanceCriteria = props.detailInfo.acceptanceCriteria
        detailFrom.effort = props.detailInfo.effort
        detailFrom.priority = props.detailInfo.priority
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