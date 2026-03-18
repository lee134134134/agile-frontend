<template>
    <el-dialog v-model="showDrawer" :show-close="false" width="673px" @close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" class="edit-dia">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-icon"></div>
                    <div class="title-text">{{ title }}主题</div>
                </div>
                <el-icon class="dia-header-close" size="16px" @click="close">
                    <Close />
                </el-icon>

            </div>
        </template>
        <div class="dia-main">
            <el-form ref="detailFromRef" :model="detailFrom" :rules="detailRule" class="dia-main-content"
                label-position="right" label-width="80px">
                <el-form-item label="主题名称" prop="themeName">
                    <el-input v-model="detailFrom.themeName" placeholder="请输入主题名称" maxlength="20" clearable></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="detailFrom.description" type="textarea" placeholder="请输入描述" maxlength="100"
                        clearable></el-input>
                </el-form-item>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="主题类型" prop="themeTypeCode">
                            <el-select v-model="detailFrom.themeTypeCode" placeholder="请选择主题类型" clearable>
                                <el-option v-for="item in typeList" :key="item.value" :label="item.name"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="主题期数">
                            <el-input v-model="detailFrom.period" placeholder="请输入" maxlength="10" clearable
                                style="width: 100%;"></el-input>
                            <!-- <el-input-number v-model="detailFrom.period" placeholder="请输入" min="0" max="99"
                                :controls="false" clearable style="width: 100%;"></el-input-number> -->
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="开放周期">
                    <div class="jus-bet-around" style="width:100%">
                        <el-date-picker :clearable="true" v-model="detailFrom.startTime" type="date" format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD" placeholder="请选择开始日期" placement="bottom"></el-date-picker>
                        <span class="space-icon">-</span>
                        <el-date-picker :clearable="true" v-model="detailFrom.endTime" type="date" format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD" placeholder="请选择结束日期" placement="bottom"></el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="主题状态" prop="status">
                    <el-select v-model="detailFrom.status" placeholder="请选择主题状态" clearable>
                        <el-option v-for="item in statusList" :key="item.value" :label="item.name" :value="item.value" />
                    </el-select>
                </el-form-item>
                <div class="title-text">主题信息采集</div>
                <div class="msg-content">
                    <div class="item-content" v-for="(item, index) in msgList" :key="index">
                        <div class="item-opt-content">
                            <el-icon :class="item.isBase || detailFrom.status != 'not_started' ? 'only-read' : 'edit-opt'"
                                @click="handleAddItem(index, item.isBase || detailFrom.status != 'not_started')">
                                <Plus />
                            </el-icon>
                            <el-icon :class="item.isBase || detailFrom.status != 'not_started' ? 'only-read' : 'edit-opt'"
                                @click="handleDeleItem(index, item.isBase || detailFrom.status != 'not_started')">
                                <Minus />
                            </el-icon>
                        </div>
                        <el-input v-model="item.fieldName" placeholder="请输入自定义字段" style="width:353px" maxlength="7"
                            :disabled="detailFrom.status != 'not_started' || item.isBase" clearable></el-input>
                        <div class="item-set-btn">
                            <div @click="handleChangeSet(item, index)" v-show="!item.isBase" class="jus-center">
                                <div :class="detailFrom.status != 'not_started' ? 'read-icon' : 'set-icon'">
                                    <img src="@/assets/images/growthSpace/set_icon.png" alt="" v-if="item.isWordCloud == 1">
                                    <img src="@/assets/images/growthSpace/noset_icon.png" alt="" v-else>
                                </div>
                                <div class="set-text">设置词云</div>
                            </div>

                        </div>

                    </div>
                </div>
            </el-form>
            
            <div class="dia-footer jus-end-center">
                <div class="btn-cancel" @click="handleClose">取消</div>
                <div class="btn-submit" @click="handleSubmit">确认</div>
            </div>
        </div>

    </el-dialog>
</template>
<script setup>
import { ref, reactive, onBeforeMount, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
const props = defineProps(['type', 'isShow', 'detailInfo']);
const emits = defineEmits([
    'closeDiaFn',
    'ConfirmFn',
    'editConfirmFn'])
const title = ref(props.type || '创建')
const showDrawer = ref(props.isShow ?? false)
const detailFromRef = ref(null)
const detailFrom = reactive({
    themeName: '',
    themeTypeCode: '',
    status: 'not_started',
    startTime: '',
    description: '',
    endTime: '',
    period: ''
})
const msgList = ref([])
const creatList = ref([
    {
        fieldName: '用户姓名',
        isBase: true,
        isWordCloud: 0,
    }, {
        fieldName: '用户角色',
        isBase: true,
        isWordCloud: 0,
    }, {
        fieldName: '用户岗位',
        isBase: true,
        isWordCloud: 0,
    }, {
        fieldName: '',
        isBase: false,
        isWordCloud: 0,
    }
])
const editList = ref([
    {
        fieldName: '用户姓名',
        isBase: true,
        isWordCloud: 0,
    }, {
        fieldName: '用户角色',
        isBase: true,
        isWordCloud: 0,
    }, {
        fieldName: '用户岗位',
        isBase: true,
        isWordCloud: 0,
    }
])
const statusList = ref([
    {
        name: '未开始',
        value: 'not_started'
    }, {
        name: '开放中',
        value: 'starting'
    }, {
        name: '已结束',
        value: 'ended'
    }
])
const typeList = ref([
    {
        name: '沟通会',
        value: 'communication'
    }, {
        name: '分享会',
        value: 'share'
    }
])
watch(() => props.type, (newName) => {
    title.value = newName
});

const detailRule = {
    themeName: [
        { required: true, message: '请输入名称', trigger: 'submit' },
        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'submit' }
    ],
    themeTypeCode: [{ required: true, message: '请选择主题类型', trigger: 'submit' }],
    status: [{ required: true, message: '请选择主题状态', trigger: 'submit' }]
}
const isEdit = ref(false)
const handleAddItem = (index, flag) => {
    if (flag) {
        return
    } else {
        msgList.value.splice(index + 1, 0, {
            fieldName: '',
            isBase: false,
            isWordCloud: 0,
        })
    }

}
const handleDeleItem = (index, flag) => {
    if (flag) {
        return
    } else {
        if (index == 3) {
            ElMessage.warning('默认示例自定义内容项不可删除！')
            return
        } else {
            msgList.value.splice(index, 1)
        }
    }
}
const handleClose = () => {
    showDrawer.value = false
    emits('closeDiaFn')
}
const handleChangeSet = (data, index) => {
    if (detailFrom.status != 'not_started') {
        return
    } else {
        msgList.value[index].isWordCloud = msgList.value[index].isWordCloud == 1 ? 0 : 1
        msgList.value.map((item, i) => {
            if (i != index) {
                if (msgList.value[index].isWordCloud) {
                    item.isWordCloud = 0
                }
            }
        })
    }

}
const handleSubmit = () => {
    if (detailFromRef.value) {
        detailFromRef.value.validate((valid) => {
            if (valid) {
                let isKStr = false
                msgList.value.forEach(item => {
                    if (item.fieldName == '' || item.fieldName == undefined) {
                        if (item.isWordCloud == 1) {
                            isKStr = true
                            ElMessage.warning('设置词云字段名称为空！请重新设置词云或完善信息')
                            return
                        }
                    }
                });
                if (isKStr) {
                    return
                } else {
                    let list = []
                    msgList.value.forEach(item => {
                        if (item.fieldName != '' && item.fieldName != undefined && !item.isBase) {
                            let objParams = {
                                'fieldName': item.fieldName,
                                'isWordCloud': item.isWordCloud
                            }
                            list.push(objParams)
                        }
                    })
                    if (props.type == '创建') {
                        let params = Object.assign(detailFrom, {
                            fields: list
                        })
                        emits('ConfirmFn', params)
                    } else {
                        let params = Object.assign(detailFrom, {
                            meetingCode: props.detailInfo.meetingCode,
                            fields: list
                        })
                        params.startTime = params.startTime ? params.startTime : ''
                        params.endTime = params.endTime ? params.endTime : ''
                        params.description = params.description ? params.description : ''
                        params.period = params.period ? params.period : ''
                        emits('editConfirmFn', params)
                    }
                }
            }
        })
    }
}
onBeforeMount(() => {
    if (props.type == '创建') {
        msgList.value = creatList.value
    } else {
        let list = []
        props.detailInfo.fields.forEach(item => {
            let obj = Object.assign({ isBase: false }, item)
            list.push(obj)
        })
        msgList.value = editList.value.concat(list)
        detailFrom.themeName = props.detailInfo.themeName
        detailFrom.description = props.detailInfo.description
        detailFrom.period = props.detailInfo.period
        detailFrom.themeTypeCode = props.detailInfo.themeTypeCode
        detailFrom.startTime = props.detailInfo.startTime
        detailFrom.endTime = props.detailInfo.endTime
        detailFrom.status = props.detailInfo.status
    }

})
</script>
<style lang="scss" >
.edit-dia {
    // background: linear-gradient(180deg, #dde7ff 0%, #f7f9fe 45%, #ffffff 100%);
    box-shadow: 0px 2px 15px 5px rgba(0, 0, 0, 0.1);
    border-radius: 8px;

    .dia-main {
        .dia-main-content {
            // padding: 0 67px;

            .el-form-item--label-right .el-form-item__label {
                font-weight: 400 !important;
                font-size: 14px;
                color: #333;
            }


        }
    }



}
</style>
<style lang="scss" scoped>
.dia-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 15px 0;

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
            color: #333333;
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
    .title-text {
        font-family: PingFang SC;
        font-weight: bolder;
        font-size: 14px;
        color: #333333;
        line-height: 22px;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }

    .jus-bet-around {
        justify-tracks: 0;

        .space-icon {
            display: inline-block;
            margin: 0 5px;
        }
    }

    :deep(.el-textarea__inner) {
        min-height: 73px !important;
        max-height: 200px !important;
        border-radius: 4px !important;
        --el-input-border-color: #cccccc !important;
    }

    :deep(.el-input) {
        height: 28px;
        line-height: 28px;
        --el-input-border-radius: 4px !important;
        --el-input-border-color: #cccccc !important;
    }

    :deep(.el-select__wrapper) {
        border-radius: 4px !important;
        --el-input-border-color: #cccccc !important;
        box-shadow: 0 0 0 1px #cccccc inset !important;
    }

    .msg-content {
        margin-top: 20px;
        // max-height: 400px;
        // overflow-y: auto;

        .item-content {
            width: calc(100% - 10px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }

        .item-opt-content {
            width: 64px;
            display: flex;
            align-items: center;
            gap: 16px;

            .el-icon {
                height: 1.5em !important;
                line-height: 1.5em !important;
                width: 1.5em !important;

                svg {
                    font-weight: bolder !important;
                }
            }

            .only-read {
                color: #999;
                font-size: 12px;
                font-weight: 600;
                cursor: default;
            }

            .edit-opt {
                color: #2173f7;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
            }
        }

        .item-set-btn {
            width: 100px;

            img {
                display: block;
            }

            .read-icon {
                cursor: default;
            }

            .set-icon {
                cursor: pointer;
            }

            .set-text {
                margin-left: 10px;
                font-size: 14px;
                color: #666;
                font-weight: 400;
            }
        }
    }
}

.dia-footer {
    margin-bottom: 8px;
    .btn-cancel {
        margin-right: 12px;
        border-radius: 4px;
        border: 1px solid #999;
    }

    .btn-cancel:hover {
        border: 1px solid #316af6;
    }

    .btn-submit {
        border-radius: 4px;
    }
}
</style>