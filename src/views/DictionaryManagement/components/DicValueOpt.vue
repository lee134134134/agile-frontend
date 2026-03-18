<template>
    <el-dialog v-model="detailShow" :show-close="false" width="604px" @close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" class="edit-dia">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-icon"></div>
                    <div class="title-text">{{ type }}字典项</div>
                </div>
                <el-icon class="dia-header-close" size="16px" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>
        <div class="dia-main">
            <el-form ref="detailFromRef" :model="detailFrom" :rules="detailRule" class="dia-main-content"
                label-width="110px" label-position="right">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="detailFrom.name" placeholder="请输入名称，如：待处理" clearable></el-input>
                </el-form-item>
                <el-form-item label="值" prop="value">
                    <el-input v-model="detailFrom.value" placeholder="请输入值，如：todo" clearable></el-input>
                </el-form-item>
                <el-form-item label="描述" class="no-rquired">
                    <el-input v-model="detailFrom.description" placeholder="请输入字典类型描述" autosize type="textarea"
                        maxlength="200" show-word-limit clearable></el-input>
                </el-form-item>
                <el-form-item label="是否为默认值" class="no-rquired">
                    <el-select v-model="detailFrom.isDefault" placeholder="请选择" clearable>
                        <el-option v-for="item in defaultList" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
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
import { hasLowercaseAndUnderscore } from '@/utils/index.js';
const props = defineProps(['type', 'isShow', 'optInfo']);
const emits = defineEmits([
    'closeDiaFn',
    'confirmFn'])
const detailShow = ref(props.isShow ?? false)
const title = ref(props.type || '新增')
const detailFromRef = ref(null)
const detailFrom = reactive({
    name: '',
    value: '',
    isDefault: undefined,
    description: '',
})
const checkCode = (rule, value, callback) => {
    if (value == '') {
        return callback(new Error('请输入值！'))
    } else if (!hasLowercaseAndUnderscore(value)) {
        return callback(new Error('您输入的值格式不正确'))
    } else {
        return callback()
    }
}
const detailRule = {
    name: [
        { required: true, message: '请输入名称', trigger: 'submit' },
        { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'submit' }
    ],
    value: [
        { required: true, validator: checkCode, trigger: 'submit' },
        { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'submit' }
    ],

}
const defaultList = ref([
    { value: 1, label: '是' },
    { value: 0, label: '否' },
])
watch(() => props.type, (newName) => {
    title.value = newName
});
const handleClose = () => {
    detailShow.value = false
    emits('closeDiaFn')
}
const handleSubmit = () => {
    if (detailFromRef.value) {
        detailFromRef.value.validate((valid) => {
            if (valid) {
                detailShow.value = false
                if (props.type == '新增') {
                    emits('confirmFn', detailFrom)
                } else {
                    detailFrom.id = props.optInfo.id
                    emits('editConfirmFn', detailFrom)
                }
            }
        })
    }
}
onBeforeMount(() => {
    if (props.type !== '新增') {
        detailFrom.name = props.optInfo.name
        detailFrom.value = props.optInfo.value
        detailFrom.description = props.optInfo.description
        detailFrom.isDefault = props.optInfo.isDefault
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
    // padding-bottom: 50px;
    // padding-left: 50px;
    // padding-right: 50px;

    // .dia-main-content {
    //     margin-bottom: 60px;
    // }

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