<template>
    <el-dialog v-model="showDrawer" :show-close="false" width="900px" min-height='300px' @close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" class="edit-dia">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-icon"></div>
                    <div class="title-text">{{ type }}提交信息</div>
                </div>
                <el-icon class="dia-header-close" size="16px" @click="handleClose">
                    <Close />
                </el-icon>

            </div>
        </template>
        <div class="dia-main">
            <el-form ref="detailFormRef" :model="detailForm" :rules="detailRule" class="dia-main-content"
                label-position="right" label-width="110px">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="用户名称" prop="title">
                            <el-input v-model="detailForm.userName" maxlength="20" clearable disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="用户角色" prop="title">
                            <el-input v-model="detailForm.userRole" maxlength="20" clearable disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="岗位" prop="title">
                            <el-input v-model="detailForm.userPosition" maxlength="20" clearable disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" v-for="(item, index) in detailForm.registrationData" :key="index">
                    <el-col :span="24">
                        <el-form-item :label="item.fieldName" prop="title">
                            <el-input v-model="item.fieldValue" clearable :disabled="isDisabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item v-show="!(isDisabled && detailForm.fileInfo == 0)" label="上传附件：" prop="fileInfo" class="attach-form-item">
                            
                            <el-upload
                                v-show="!isDisabled"
                                :show-file-list="false"
                                :auto-upload="false"
                                action="#"
                                :before-upload="beforeFileUpload"
                                @change="uploadFileChange"
                                :disabled="isDisabled || (detailForm.fileInfo && detailForm.fileInfo.length > 0)"
                                >
                                <div class="opt-btn" :class="{'opt-btn-disabled': isDisabled || (detailForm.fileInfo && detailForm.fileInfo.length > 0)}">上传附件</div>
                            </el-upload>
                            <!-- 上传的附件列表 -->
                            <div class="fileList-area">
                                <div class="file-item" v-for="item in detailForm.fileInfo" :key="item.fileName">
                                    <img class="doc-icon" src="../../../assets/images/docIcon.png" alt="">
                                    <div class="doc-name">
                                        <div class="name">{{ item.originName }}</div>
                                        <!-- <div class="fileSize" v-if="item.size">{{ (Number(item.size) / 1024 / 1024).toFixed(2) }}M</div> -->
                                    </div>
                                    <div class="opt-attach-box jus-flex-end">
                                        <div v-if="isDisabled" class="delete-box jus-bet-center" @click="downloadAttachment(item.id)">
                                            <el-icon><Download /></el-icon>
                                            下载
                                        </div>
                                        <div v-else class="delete-box jus-bet-center" :class="{'delete-box-disabled': isDisabled}" @click="delAttachment(item.id)">
                                            <el-icon><DeleteFilled /></el-icon>
                                            删除
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </el-form-item>
                    </el-col>
                </el-row>
                
            </el-form>
            <div class="dia-footer jus-end-center" v-if="type !== '查看'">
                <div class="btn-cancel" @click="handleClose">取消</div>
                <div class="btn-submit" @click="handleSubmit">保存</div>
            </div>

        </div>

    </el-dialog>
</template>
<script setup>
import { ref, reactive, onBeforeMount, onMounted, watch } from 'vue';
import { isValidVersion } from "@/utils/index.js";
import { ElMessage, ElMessageBox } from 'element-plus';
import { uploadAttach, downloadAttach } from '@/api/growthSpaceApi';
const props = defineProps(['isShow', 'detailInfo', 'optType', 'customFields', 'meetingCode']);
const emits = defineEmits([
    'addConfirmFn',
    'editConfirmFn',
    'closeDiaFn'
])

const userInfo = ref()
userInfo.value = JSON.parse(localStorage.getItem('agiles_user'))
const showDrawer = ref(false)
const type = ref('')
const isDisabled = ref()
const detailFormRef = ref(null)
const detailForm = reactive({
    meetingCode: '',
    userName: '',
    userPosition: '',
    userRole: '',
    registrationData: [],
    fileInfo: [],
    fileIds: [],
})
const meetInfo = ref()


let detailRule = {
    // title: [
    //     { required: true, message: '请输入名称', trigger: 'blur' },
    //     { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
    // ],
    // status: [{ required: true, message: '请选择评审状态', trigger: 'change' }]
}

const isEdit = ref(false)

watch(() => props.isShow, (newVal, oldVal) => {
    showDrawer.value = newVal
}, {immediate: true})

watch(() => props.optType, (newVal, oldVal) => {
    type.value = newVal
    isDisabled.value = (type.value == '查看') ? true : false
}, {immediate: true})

watch(() => props.detailInfo, (newVal, oldVal) => {
    meetInfo.value = (newVal && newVal.customFields && newVal.customFields.length > 0) ? newVal.customFields : props.customFields
}, {deep: true, immediate: true})


const handleClose = () => {
    showDrawer.value = false
    emits('closeDiaFn')
}

const handleSubmit = () => {
    if (detailFormRef.value) {
        detailFormRef.value.validate((valid) => {
            if (valid) {
                let flag = true
                for(let i=0; i < detailForm.registrationData.length; i++) {
                    if(!detailForm.registrationData[i].fieldValue) {
                        ElMessage.error(`请输入${detailForm.registrationData[i].fieldName}`)
                        flag = false
                        return
                    }
                }
                emits('addConfirmFn', detailForm)

            }
        })
    }
}


// 校验文件
function beforeFileUpload(file) {
    if(file.name.slice(-4) !== '.doc' && file.name.slice(-5) !== '.docx' 
        && file.name.slice(-5) !== '.xlsx' && file.name.slice(-4) !== '.xls' 
        && file.name.slice(-4) !== '.pdf'
        && file.name.slice(-4) !== '.png' && file.name.slice(-4) !== '.jpg') {
        ElMessage.error("暂不支持该格式的文件上传!")
        return false
    }
    if (file.size > 1024 * 1024 * 20) {
        ElMessage.error("文件大小不能超过20MB！")
        return
    }
    return true
}

 // 上传附件
 function uploadFileChange(file) {
    console.log('file===',file)
    let isValid = beforeFileUpload(file)
    if(!isValid) return
    let obj = new FormData()
    let newfile = file.raw
    newfile = new File([file.raw], `${encodeURIComponent(newfile.name)}`, { type: file.raw.type })
    newfile.uid = file.raw.uid
    obj.append("file",newfile);
    // obj.append('type','A04')


    uploadAttach(obj).then(res => {
        console.log('上传文件返回参数：',res)
        if(res.success) {
            detailForm.fileInfo.push(res.data)
            detailForm.fileIds.push(res.data.id)
        }
    })
 }

// 删除附件
function delAttachment(id) {
    if(isDisabled.value) return
    ElMessageBox.confirm(
        '确认删除该附件吗?',
        '',
        {
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            type: 'warning',
        }
    ).then(() => {
        detailForm.fileInfo = detailForm.fileInfo.filter(item => item.id != id)
        detailForm.fileIds = detailForm.fileIds.filter(item => item != id)
    })
}

// 下载附件
const downloadAttachment = (id) => {
    let params = {
        registrationId: id
    }
    downloadAttach(params).then(res => {
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = detailForm.fileInfo[0].originName; // 根据实际情况设置下载文件名
        a.click();
        window.URL.revokeObjectURL(url);
    })
}


onMounted(() => {
    detailForm.meetingCode = props.meetingCode
    if(type.value == '添加') {
        detailForm.userName = userInfo.value.nickname
        detailForm.userPosition = userInfo.value.positionName
        detailForm.userRole = userInfo.value.role.join(',')
        detailForm.registrationData = props.customFields
    }else {
        detailForm.id = props.detailInfo.id
        detailForm.userName = props.detailInfo.userName
        detailForm.userPosition = props.detailInfo.userPosition
        detailForm.userRole = props.detailInfo.userRole
        detailForm.registrationData = props.detailInfo.registrationData
        detailForm.fileIds = props.detailInfo.fileIds
        detailForm.fileInfo = props.detailInfo.fileInfo
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
            // padding: 0 72px;

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
    .fileList-area {
        width: 100%;
        // max-width: 400px;
        margin-top: 10px;
        .file-item {
            display: flex;
            align-items: center;
            padding: 10px;
            border-radius: 4px 4px 4px 4px;
            border: 1px solid #CFE4FE;
            margin-bottom: 10px;
            .doc-icon {
                width: 40px;
                height: 40px;
            }
            .doc-name {
                width: calc(100% - 95px);
                display: flex;
                flex-direction: column;
                justify-content: start;
                align-items: start;
                font-size: 14px;
                line-height: 22px;
                margin-left: 10px;
                .name {
                    margin-bottom: 5px;
                }
                .fileSize {
                    color: #6C6C6C;
                    font-size: 12px;
                }
                .demo-progress {
                    width: 200px;
                }
            }
            // .opt-attach-box {
            //     width: 130px;
            //     gap: 12px;
            // }
            .delete-box {
                gap: 3px;
                color: #2173F7;
                font-size: 12px;
                cursor: pointer;
            }
            .delete-box-disabled {
                color: #A4A4A4;
                font-size: 12px;
                cursor: default;
            }
        }
    }
    .attach-form-item {
        .opt-btn-disabled {
            background-color: #ececec;
            cursor: default;
            color: #A4A4A4;
        }
        :deep(.el-form-item__content) {
            flex-direction: column!important;
            align-items: start;
        }
    }


    :deep(.el-textarea__inner) {
        min-height: 73px !important;
    }

    :deep(.el-input) {
        --el-input-border-color: #cccccc !important;
        height: 32px;
    }
    :deep(.el-input__inner) {
        height: 32px;
        line-height: 32px;
    }

}

.dia-footer {
    .btn-cancel {
        height: 30px;
        line-height: 30px;
        margin-right: 12px;
        border-radius: 4px;
        border: 1px solid #999;
    }

    .btn-cancel:hover {
        border: 1px solid #316af6;
    }

    .btn-submit {
        height: 30px;
        line-height: 30px;
        border-radius: 4px;
    }
}
</style>