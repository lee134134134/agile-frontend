<template>
    <el-dialog v-model="diaShow" :show-close="false" width="950px" @close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" class="edit-dia">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-icon"></div>
                    <div class="title-text">{{ type !== 'dashboard' ? '生成上线报告' : '生成dashboard 测试报告' }} </div>
                </div>
                <el-icon class="dia-header-close" size="16px" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>
        <div class="dia-main">
            <el-form ref="dataFormRef" :model="dataForm" :rules="dataFormRule" class="dia-main-content" label-width="110px" label-position="right">
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="选择项目" prop="projectId">
                            <el-select v-model="dataForm.projectId" placeholder="请选择" filterable clearable style="width: 750px;">
                                <el-option v-for="item in dicStore.curUserProjectList" :key="item.projectId"
                                    :label="item.name" :value="item.projectId" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="选择迭代" prop="sprintIds">
                            <el-select v-model="dataForm.sprintIds" popper-class="custom-select-popper" placeholder="请选择" filterable multiple collapse-tags collapse-tags-tooltip max-collapse-tags="3" clearable style="width: 750px;">
                                <template #header>
                                    <el-checkbox v-model="checkAllSprint" :indeterminate="indeterminateSprint" @change="handleCheckAllSprint">全部</el-checkbox>
                                </template>
                                <el-option-group v-for="group in curUserProjectIterationList" :key="group.state"
                                    :label="group.state">
                                    <el-option v-for="item in group.list" :key="item.code" :label="item.name"
                                        :value="item.code" />
                                </el-option-group>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="选择用户故事" prop="storyIds">
                            <el-select v-model="dataForm.storyIds" popper-class="custom-select-popper" placeholder="请选择" multiple filterable collapse-tags collapse-tags-tooltip max-collapse-tags="3" clearable style="width: 750px;">
                                <template #header>
                                    <el-checkbox v-model="checkAllStory" :indeterminate="indeterminateStory" @change="handleCheckAllStory">全部</el-checkbox>
                                </template>
                                <el-option v-for="item in iterUserStoryList" :key="item.storyId" :label="item.name"
                                    :value="item.storyId" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="dia-footer jus-flex-end">
              <div class="opt-btn" @click="handleSubmit">{{ type !== 'dashboard' ? '预约下载' : '确认生成' }}</div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onBeforeMount, onMounted } from 'vue';
import { Close } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getUserProjectIterationList, getIterUserStoryList } from '@/api/api';
import { useDicStore } from '@/stores/dic.js';
const dicStore = useDicStore()

const props = defineProps(['isShow', 'type']);
const emits = defineEmits(['closeDiaFn', 'confirmFn'])
const diaShow = ref(props.isShow ?? false)

const dataFormRef = ref(null)
const dataForm = reactive({
    projectId: '',
    sprintIds: [],
    storyIds: [],
})

const curUserProjectIterationList = ref([])
const iterUserStoryList = ref([])
const checkAllSprint = ref(false)
const indeterminateSprint = ref(false)
const checkAllStory = ref(false)
const indeterminateStory = ref(false)
const projectName = ref('')
const sprintNameList = ref([])
const storyNameList = ref([])


const dataFormRule = {
    projectId: [{ required: true, message: '请选择项目', trigger: 'submit' }],
    sprintIds: [{ required: true, message: '请选择迭代', trigger: 'submit' }],
    storyIds: [{ required: true, message: '请选择用户故事', trigger: 'submit' }],
}


const handleSubmit = () => {
    if (dataFormRef.value) {
        dataFormRef.value.validate((valid) => {
            if (valid) {
                if(props.type !== 'dashboard') {
                    emits('confirmFn', dataForm)
                }else {
                    dicStore.curUserProjectList.forEach(item => {
                        if(item.projectId == dataForm.projectId) {
                            projectName.value = item.name
                        }
                    })
                    sprintNameList.value = []
                    storyNameList.value = []
                    dataForm.sprintIds.forEach(ele => {
                        curUserProjectIterationList.value.forEach(item => {
                            item.list.forEach(i => {
                                if(ele == i.code) {
                                    sprintNameList.value.push(i.name)
                                }
                            });
                        })
                    })
                    dataForm.storyIds.forEach(ele => {
                        iterUserStoryList.value.forEach(item => {
                            if(ele == item.storyId) {
                                storyNameList.value.push(item.name)
                            }
                        })
                    })
                    let params = {
                        project: projectName.value,
                        sprint: sprintNameList.value,
                        story: storyNameList.value,
                    }
                    emits('confirmFn', dataForm, params)
                }
            }
        })
    }
}

const handleClose = () => {
    diaShow.value = false
    emits('closeDiaFn')
}

// 选择所有迭代
const handleCheckAllSprint = (val) => {
    if(val) {
        // dataForm.sprintIds = curUserProjectIterationList.value.map(item => {
        //     return item.list.map(i => i.code)
        // })
        let arr = []
        curUserProjectIterationList.value.forEach(element => {
            element.list.forEach(item => {
                arr.push(item.code)
            })
        });
        dataForm.sprintIds = arr
    }else {
        dataForm.sprintIds = []
    }
}

// 选择所有故事
const handleCheckAllStory = (val) => {
    if(val) {
        dataForm.storyIds = iterUserStoryList.value.map(item => item.storyId)
    }else {
        dataForm.storyIds = []
    }
}

// 获取项目下的迭代
const getProjectIterationListFn = () => {
    let params = {
        projectId: dataForm.projectId || undefined
    }
    getUserProjectIterationList(params).then(res => {
        if (res.success) {
            curUserProjectIterationList.value = res?.data ?? []
            // console.log('curUserProjectIterationList.value===', curUserProjectIterationList.value)
            let arr = []
            curUserProjectIterationList.value.forEach(el => {
                el.list.forEach(item => {
                    arr.push(item)
                })
            })
            // console.log('arr====', arr)
            dataForm.sprintIds = dataForm.sprintIds.filter(item => arr.some(el => el.code == item))
        }
    })
}

// 获取迭代下的用户故事
const getIterUserStoryListFn = () => {
    let params = {
        sprintIds: dataForm.sprintIds || undefined
    }
    getIterUserStoryList(params).then(res => {
        if (res.success) {
            iterUserStoryList.value = res?.data ?? []
            dataForm.storyIds = dataForm.storyIds.filter(item => iterUserStoryList.value.some(el => el.storyId == item))
        }
    })
}

// 所属项目 -->  迭代  
watch(() => dataForm.projectId, (newvalue, oldvalue) => {
    getProjectIterationListFn()
}, { deep: true })

// 所属迭代 -->  用户故事  
watch(() => dataForm.sprintIds, (newvalue, oldvalue) => {
    getIterUserStoryListFn()
    let length = 0
    curUserProjectIterationList.value.forEach(ele => {
        ele.list.forEach(item => {
            length += 1
        })
    })
    // console.log('length===', length)
    if(newvalue.length == 0) {
        checkAllSprint.value = false
        indeterminateSprint.value = false
    }else if(newvalue.length == length) {
        checkAllSprint.value = true
        indeterminateSprint.value = false
    }else {
        indeterminateSprint.value = true
    }
}, { deep: true })

watch(() => dataForm.storyIds, (newvalue, oldvalue) => {
    if(newvalue.length == 0) {
        checkAllStory.value = false
        indeterminateStory.value = false
    }else if(newvalue.length == iterUserStoryList.value.length) {
        checkAllStory.value = true
        indeterminateStory.value = false
    }else {
        indeterminateStory.value = true
    }
}, { deep: true })

onMounted(() => {
    getProjectIterationListFn() // 项目下的迭代
    getIterUserStoryListFn() // 迭代下的用户故事
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
            margin-left: 12px;
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

    :deep(.el-select) {
        height: auto;
        min-height: 28px;
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
</style>