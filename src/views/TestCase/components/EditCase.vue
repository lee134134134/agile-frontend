<template>
    <el-dialog v-model="addShow" :show-close="false" width="996px" @close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" class="edit-dia">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-icon"></div>
                    <div class="title-text">{{ title }}测试用例</div>
                </div>
                <el-icon class="dia-header-close" size="16px" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>
        <div class="dia-main">
            <el-form ref="detailFormRef" :model="detailForm" :rules="type == '查看' ? null : detailRule" class="dia-main-content"
                label-width="110px" label-position="right">
                <div class="module-title">基本信息</div>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="detailForm.title" placeholder="请输入" maxlength="50" clearable :disabled="isDisabled" show-word-limit>
                                <!-- <template #suffix>
                                  最多50字符
                                </template> -->
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="所属项目" prop="projectCode">
                            <el-select v-model="detailForm.projectCode" placeholder="请选择" clearable :disabled="isDisabled" @change="handleChangeProject">
                                <el-option v-for="item in dicStore.curUserProjectList" :key="item.projectId" :label="item.name" :value="item.projectId" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="项目模块" prop="projectModuleCode">
                            <el-cascader v-model="detailForm.projectModuleCode" :options="projectModuleList" :props="defaultProps" :reserve-keyword="false" clearable placeholder="请选择" filterable style="width:100%;" :disabled="isDisabled"></el-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="所属迭代" prop="sprintId">
                            <el-select v-model="detailForm.sprintId" placeholder="请选择" clearable :disabled="isDisabled" @change="handleChangeSprint">
                                <el-option-group v-for="group in curUserProjectIterationList" :key="group.state" :label="group.state">
                                        <el-option v-for="item in group.list" :key="item.code" :label="item.name"
                                            :value="item.code" />
                                    </el-option-group>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="用户故事" prop="storyCode">
                            <el-select v-model="detailForm.storyCode" placeholder="请选择" clearable :disabled="isDisabled">
                                <el-option v-for="item in iterUserStoryList" :key="item.storyId" :label="item.name" :value="item.storyId" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="测试用例类型" prop="caseType">
                            <el-select v-model="detailForm.caseType" placeholder="请选择" clearable :disabled="isDisabled">
                                <el-option v-for="item in dicStore.caseTypeList" :key="item.value" :label="item.name" :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="具体功能点" prop="functionPoint">
                            <el-select v-model="detailForm.functionPoint" placeholder="请选择" clearable :disabled="isDisabled">
                                <el-option v-for="item in dicStore.functionPointList" :key="item.value" :label="item.name" :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="优先级" prop="priority">
                            <el-select v-model="detailForm.priority" placeholder="请选择" clearable :disabled="isDisabled">
                                <el-option v-for="item in dicStore.priorityList" :key="item.value" :label="item.name" :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否自动化测试" prop="isAutomated">
                            <el-radio-group v-model="detailForm.isAutomated" :disabled="isDisabled">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="编辑状态" prop="editStatus">
                            <el-select v-model="detailForm.editStatus" placeholder="请选择" clearable :disabled="isDisabled">
                                <el-option v-for="item in dicStore.editStatusList" :key="item.value" :label="item.name" :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <div class="module-title mt20">测试步骤</div>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="测试环境" prop="testEnvironment">
                            <el-input v-model="detailForm.testEnvironment" placeholder="请输入" maxlength="50" clearable :disabled="isDisabled" show-word-limit>
                                <!-- <template #suffix>
                                  最多50字符
                                </template> -->
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="预置条件" prop="precondition">
                            <el-input v-model="detailForm.precondition" placeholder="请输入" maxlength="200" type="textarea" clearable :disabled="isDisabled" show-word-limit>
                                <!-- <template #suffix>
                                  最多200字符
                                </template> -->
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="测试步骤" prop="steps">
                            <el-input v-model="detailForm.steps" placeholder="请输入" maxlength="200" type="textarea" clearable :disabled="isDisabled" show-word-limit>
                                <!-- <template #suffix>
                                  最多200字符
                                </template> -->
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="预期结果" prop="expectedResult">
                            <el-input v-model="detailForm.expectedResult" placeholder="请输入" maxlength="200" type="textarea" clearable :disabled="isDisabled" show-word-limit>
                                <!-- <template #suffix>
                                  最多200字符
                                </template> -->
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="实际结果" prop="actualResult">
                            <el-input v-model="detailForm.actualResult" placeholder="请输入" maxlength="200" type="textarea" clearable :disabled="isDisabled" show-word-limit>
                                <!-- <template #suffix>
                                  最多200字符
                                </template> -->
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>


                <div class="module-title mt20">执行信息</div>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="执行状态" prop="executionStatus">
                            <el-select v-model="detailForm.executionStatus" placeholder="请选择" clearable :disabled="isDisabled">
                              <el-option v-for="item in dicStore.executeStatusList" :key="item.value" :label="item.name" :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="测试结果" prop="testResult">
                            <el-select v-model="detailForm.testResult" placeholder="请选择" clearable :disabled="isDisabled">
                              <el-option v-for="item in dicStore.testResultList" :key="item.value" :label="item.name" :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    
                    <el-col :span="12">
                        <el-form-item label="测试人" prop="testedBy">
                            <el-select v-model="detailForm.testedBy" placeholder="请选择" clearable :disabled="isDisabled">
                              <el-option v-for="item in dicStore.allUserList" :key="item.username" :label="item.nickname" :value="item.username" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="测试日期" prop="testedAt">
                            <el-date-picker v-model="detailForm.testedAt" value-format="YYYY-MM-DD" format="YYYY-MM-DD"
                            clearable style="height:32px;border-radius: 4px;width:100%;" :disabled="isDisabled" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="备注" prop="remarks">
                            <el-input v-model="detailForm.remarks" placeholder="请输入" maxlength="300" type="textarea" clearable :disabled="isDisabled" show-word-limit>
                                <!-- <template #suffix>
                                  最多300字符
                                </template> -->
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
				
                
            </el-form>
            <div class="dia-footer jus-flex-end" v-if="type !== '查看'">
                <div class="btn-cancel" @click="handleClose">取消</div>
              <div class="btn-submit" @click="handleSubmit">保存</div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onBeforeMount, onMounted } from 'vue';
import { Close } from '@element-plus/icons-vue';
import { isValidEChar } from "@/utils/index.js";
import { ElMessage } from 'element-plus';
import { getDicList, getProjectModuleList, getUserProjectIterationList, getIterUserStoryList } from '@/api/api';
import { useDicStore } from '@/stores/dic.js';
const dicStore = useDicStore()


const props = defineProps(['isShow', 'type', 'detailInfo']);
const emits = defineEmits([ 'closeDiaFn', 'editConfirmFn']);
const addShow = ref(props.isShow ?? false)
const title = ref(props.type || '新增')
const isDisabled = ref(props.type == '查看' ? true : false)
const detailFormRef = ref(null)
const detailForm = reactive({
    title: '',
	projectCode:'',
    projectModuleCode: '',
    sprintId: '',
    storyCode: '',
    caseType: '',
    functionPoint: '',
    priority: '',
    isAutomated: '',
    editStatus: '',

    testEnvironment: '',
    precondition: '',
    steps: '',
    expectedResult: '',
    actualResult: '',

    executionStatus: '',
    testResult: '',
    testedBy: '',
    testedAt: '',
    remarks: '',
})
const defaultProps = ref({
    children: 'children',
    label: 'name',
    value: 'moduleCode',
    // multiple: true,
    emitPath: false
})
const projectModuleList = ref()
const curUserProjectIterationList = ref([])
const iterUserStoryList = ref([])

const detailRule = {
    title: [
        { required: true, message: '请输入标题', trigger: 'submit' },
        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'submit' }
    ],
    projectCode: [{ required: true, message: '请选择所属项目', trigger: 'submit' }],
    projectModuleCode: [{ required: true, message: '请选择项目模块', trigger: 'submit' }],
    sprintId: [{ required: true, message: '请选择所属迭代', trigger: 'submit' }],
    storyCode: [{ required: true, message: '请选择用户故事', trigger: 'submit' }],
    functionPoint: [{ required: true, message: '请选择具体功能点', trigger: 'submit' }],
    priority: [{ required: true, message: '请选择优先级', trigger: 'submit' }],
    editStatus: [{ required: true, message: '请选择编辑状态', trigger: 'submit' }],
    steps: [
        { required: true, message: '请输入测试步骤', trigger: 'submit' },
        { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'submit' }
    ],
    expectedResult: [
        { required: true, message: '请输入预期结果', trigger: 'submit' },
        { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'submit' }
    ],
}




const handleClose = () => {
    addShow.value = false
    emits('closeDiaFn')
}
const handleSubmit = () => {
    if (detailFormRef.value) {
        detailFormRef.value.validate((valid) => {
            if (valid) {
                console.log('detailForm===', detailForm)
                // return
                detailForm.caseCode = props.detailInfo.caseCode
                emits('editConfirmFn', detailForm)
            }
        })
    }
}

// 获取所属项目下模块下拉列表
const getProjectModuleListFn = async () => {
    let params = {
        projectCode: detailForm.projectCode || undefined
    }
    await getProjectModuleList(params).then(res => {
        if(res.success) {
            projectModuleList.value = res?.data ?? []
        }
    })
}

// 获取项目下的迭代
const getProjectIterationListFn = async () => {
    let params = {
        projectId: detailForm.projectCode || undefined
    }
    await getUserProjectIterationList(params).then(res => {
        if(res.success) {
            curUserProjectIterationList.value = res?.data ?? []
            // if(!curUserProjectIterationList.value.some(item => item.code == detailForm.sprintId)) {
            //     detailForm.sprintId = ''
            // }

            let flag = false
            curUserProjectIterationList.value.forEach(ele => {
                ele.list.forEach(item => {
                    if(item.code == detailForm.sprintId) {
                        flag = true
                    }
                })
            })
            if(!flag) {
                detailForm.sprintId = ''
            }
        }
    })
}

// 获取迭代下的用户故事
const getIterUserStoryListFn = async () => {
    let params = {
        sprintId: detailForm.sprintId || undefined
    }
    await getIterUserStoryList(params).then(res => {
        if(res.success) {
            iterUserStoryList.value = res?.data ?? []
            if(!iterUserStoryList.value.some(item => item.storyId == detailForm.storyCode)) {
                detailForm.storyCode = ''
            }
        }
    })
}


// 所属项目 -->  模块 、 迭代 
// watch(() => detailForm.projectCode, async (newvalue, oldvalue) => {
//     if(!detailForm.projectCode) {
//         projectModuleList.value = []
//         detailForm.projectModuleCode = ''
//     }else {
//         await getProjectModuleListFn()
//     }
//     await getProjectIterationListFn()
// }, { deep: true })

// 所属迭代 -->  用户故事  
// watch(() => detailForm.sprintId, async (newvalue, oldvalue) => {
//     await getIterUserStoryListFn()
// }, { deep: true })

const handleChangeProject = () => {
    if(!detailForm.projectCode) {
        projectModuleList.value = []
        detailForm.projectModuleCode = ''
    }else {
        getProjectModuleListFn()
    }
    getProjectIterationListFn()
}

const handleChangeSprint = () => {
    getIterUserStoryListFn()
}



watch(() => props.type, (newName) => {
    title.value = newName
});


onMounted(() => {
    if (props.type == '编辑' || props.type == '查看') {
        detailForm.title = props.detailInfo.title
        detailForm.projectCode = props.detailInfo.projectCode
        detailForm.projectModuleCode = props.detailInfo.projectModuleCode
        detailForm.sprintId = props.detailInfo.sprintId
        detailForm.storyCode = props.detailInfo.storyCode
        detailForm.caseType = props.detailInfo.caseType
        detailForm.functionPoint = props.detailInfo.functionPoint
        detailForm.priority = props.detailInfo.priority || dicStore.defaultPriority
        detailForm.isAutomated = props.detailInfo.isAutomated
        detailForm.editStatus = props.detailInfo.editStatus || dicStore.defaultEditStatus
        detailForm.testEnvironment = props.detailInfo.testEnvironment
        detailForm.precondition = props.detailInfo.precondition
        detailForm.steps = props.detailInfo.steps
        detailForm.expectedResult = props.detailInfo.expectedResult
        detailForm.actualResult = props.detailInfo.actualResult
        detailForm.executionStatus = props.detailInfo.executionStatus || dicStore.defaultExecuteStatus
        detailForm.testResult = props.detailInfo.testResult
        detailForm.testedBy = props.detailInfo.testedBy
        detailForm.testedAt = props.detailInfo.testedAt
        detailForm.remarks = props.detailInfo.remarks
    }
    getProjectModuleListFn() // 项目下的模块
    getProjectIterationListFn() // 项目下的迭代
    getIterUserStoryListFn() // 迭代下的用户故事
})

</script>
<style lang="scss" scoped>

.mt20 {
    margin-top: 20px;
}
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
    //     height: calc(90vh - 200px);
    //     overflow-y: scroll;
    //     margin-bottom: 30px;
    //     padding-right: 20px;
    // }

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
            min-height: 88px !important;
            max-height: 200px !important;
        }
    }

    :deep(.el-form-item__label) {
        color: #555 !important;
        font-weight: 400 !important;
    }
    /* 整个滚动条 */
    ::-webkit-scrollbar {
        width: 8px;
        /* 宽度 */
        height: 8px;
        /* 高度 */
    }

    /* 滚动条轨道 */
    ::-webkit-scrollbar-track {
        background: none;
        /* 颜色 */
    }

    /* 滚动条的滑块 */
    ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
        /* 颜色 */
        border-radius: 4px;
    }

    /* 滚动条的滑块：鼠标悬停时 */
    ::-webkit-scrollbar-thumb:hover {
        background: #e9e9e9;
        /* 颜色 */
    }
}
</style>