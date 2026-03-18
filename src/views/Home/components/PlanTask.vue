<template>
    <div class="plan-task-container">
        <div class="search-cond jus-start-center">
            <div class="con-status" :class="{'active-con-status': planStatus == '2'}" @click="handleChangeCon('2')">全部</div>
            <div class="gap-line"></div>
            <div class="con-status" :class="{'active-con-status': planStatus == '0'}" @click="handleChangeCon('0')">未完成</div>
            <div class="gap-line"></div>
            <div class="con-status" :class="{'active-con-status': planStatus == '1'}" @click="handleChangeCon('1')">已完成</div>
        </div>
        <div class="plan-list">
            <!-- <PlanTaskItem v-if="planList.length > 0" v-for="item in planList" :key="item.id" :taskInfo="item" @optEdit="handleEditPlan" @optDelete="handleDeletePlan" @changeStatus="handleChangeStatus" /> -->

            <VueDraggable
                v-if="dataList.length > 0"
                id="vue-drag1"
                class="vue-drag"
                v-model="dataList"
                animation="150"
                ghostClass="ghost"
                @update="onUpdate"
            >
                <PlanTaskItem v-for="item in dataList" :key="item.id" :taskInfo="item" @optEdit="handleEditPlan" @optDelete="handleDeletePlan" @changeStatus="handleChangeStatus" />
            </VueDraggable>    
            <EmptyDia v-else :type="'zwsj'"></EmptyDia>
        </div>
        <div class="plan-footer" @click="handleAddPlan">添加</div>
        <el-dialog v-model="isShowPlanDia" top="30%" :show-close="false" width="550px" :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="dialogContent">
                <el-input v-model="planTaskText" placeholder="请输入计划任务" autosize type="textarea" maxlength="50" show-word-limit clearable />
                <div class="dialogFooter jus-center">
                    <div class="new-opt-btn border-btn" @click="handleCancel">取消</div>
                    <div class="new-opt-btn fill-btn" @click="editTask ? handleEdit() : handleSave()">保存</div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue';
import { VueDraggable } from 'vue-draggable-plus'
import PlanTaskItem from './PlanTaskItem.vue'
import EmptyDia from '@/components/EmptyDia.vue'
import { ElMessage } from 'element-plus';
import { savePlanTask, updatePlanTask, deletePlanTask, sortPlanTask } from '@/api/api.js'

const props = defineProps(['planList'])
const emits = defineEmits(['getPlanTaskList'])

const dataList = ref('')
const planStatus = ref('2') // 计划任务筛选状态
const isShowPlanDia = ref(false)
const editTask = ref(null)
const planTaskText = ref('') // 计划任务文本框

watch(() => props.planList, (newVal, oldVal) => {
    dataList.value = newVal
}, { deep: true, immediate: true })


// 添加计划任务
const handleAddPlan = () => {
    isShowPlanDia.value = true
}

const handleCancel = () => {
    isShowPlanDia.value = false
    editTask.value = null
}

const handleSave = () => {
    if(!planTaskText.value.trim()) {
        ElMessage.warning('请填写计划任务')
    }else{
        let params = {
            title: planTaskText.value
        }
        savePlanTask(params).then(res => {
            if(res.success) {
                handleCancel()
                planTaskText.value = ''
                emits('getPlanTaskList', planStatus.value)
            }
        })
    }
}

const handleEdit = () => {
    if(!planTaskText.value.trim()) {
        ElMessage.warning('请填写计划任务')
    }else{
        let params = {
            id: editTask.value.id,
            title: planTaskText.value
        }
        updatePlanTask(params).then(res => {
            if(res.success) {
                handleCancel()
                planTaskText.value = ''
                emits('getPlanTaskList', planStatus.value)
            }
        })
    }
}

// 修改任务状态
const handleChangeStatus = (task) => {
    let params = {
        id: task.id,
        status: task.status
    }
    updatePlanTask(params).then(res => {
        if(res.success) {
            emits('getPlanTaskList', planStatus.value)
        }
    })
}

// 修改计划任务
const handleEditPlan = (task) => {
    planTaskText.value = task.title
    handleAddPlan()
    editTask.value = task
}

// 删除计划任务
const handleDeletePlan = (task) => {
    let params = {
        id: task.id
    }
    deletePlanTask(params).then(res => {
        if(res.success) {
            emits('getPlanTaskList', planStatus.value)
        }
    })
}

// 修改条件
const handleChangeCon = (val) => {
    planStatus.value = val
    emits('getPlanTaskList', planStatus.value)
}

// 拖拽修改计划任务顺序
const onUpdate = () => {
    let list = []
    dataList.value.forEach(item => {
        list.push(item.id)
    })
    let params = {
        idList: list
    }
    sortPlanTask(params).then(res => {
        if(res.success) {
            emits('getPlanTaskList', planStatus.value)
        }
    })
}

</script>

<style lang="scss" scoped>
.plan-task-container {
    position: relative;
    height: 100%;
    
    .new-opt-btn {
        height: 29px;
        padding: 4px 13px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        flex-shrink: 0;
        user-select: none;
    }
    .new-opt-btn:hover {
        opacity: 0.8;
    }
    
    .border-btn {
        background-color: #FFF;
        border: 1px solid var(--el-color-primary);
        color: var(--el-color-primary);
    }
    
    .fill-btn {
        background-color: var(--el-color-primary);
        border: 1px solid var(--el-color-primary);
        color: #FFF;
    }

    .search-cond {
        gap: 12px;
        height: 60px;
        line-height: 60px;

        .active-con-status {
            font-weight: bold;
            color: var(--el-color-primary);
        }
        .con-status:hover {
            font-weight: bold;
            color: var(--el-color-primary);
            opacity: 0.8;
            cursor: pointer;
        }
        .gap-line {
            width: 1px;
            height: 16px;
            background-color: #ccc;
        }
    }

    .plan-list {
        padding-right: 5px;
        height: calc(100% - 114px);
        overflow: auto;
    }

    .plan-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 42px;
        background-color: var(--el-color-primary); 
        border-radius: 8px;
        color: #FFF;
        line-height: 42px;
        text-align: center;
        cursor: pointer;
    }
    .plan-footer:hover {
        opacity: 0.8;
    }

    .dialogFooter {
        margin-top: 30px;
        gap: 14px;
        .btn {
            width: 60px;
            height: 30px;
            border-radius: 4px;
            line-height: 30px;
            text-align: center;
            font-size: 14px;
            cursor: pointer;
        }
        .cancleBtn {
            background-color: #F2F3F8;
            color: #7081A1;
        }
        .confirmBtn {
            background-color: #0779FF;
            color: #FFF;
        }
        .cancleBtn:hover,.confirmBtn:hover {
            opacity: 0.8;
        }
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

    /* 整个滚动条 */
    ::-webkit-scrollbar {
        width: 4px;
        /* 宽度 */
        height: 4px;
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
        // display: none;
    }

    /* 滚动条的滑块：鼠标悬停时 */
    ::-webkit-scrollbar-thumb:hover {
        background: #e9e9e9;
        /* 颜色 */
    }
}

:deep(.el-checkbox__input){
  margin-top: -2px;
}
</style>