<template>
    <el-dialog v-model="diaShow" :show-close="false" @close="handleClose" fullscreen style="background: #f7fafc;"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-icon"></div>
                    <div class="title-text">详情</div>
                </div>
                <div class="opt-content jus-flex-start">
                    <div class="opt-btn" @click="close">关闭</div>
                </div>
            </div>
        </template>
        <div class="dia-content">
            <div class="main-container">
                <div class="base-info-content jus-start-center">
                    <div class="info-content jus-start-center" style="margin-right:50px">
                        <div class="title-2">月度任务统计报告：</div>
                        <div class="info-val">{{ datailInfo.reportDate }}</div>
                    </div>
                    <div class="info-content jus-start-center">
                        <div class="title-2">报告统计时间：</div>
                        <div class="info-val">{{ datailInfo.generateTime }}</div>
                    </div>
                </div>
                <el-table scrollbar-always-on :data="tableData" v-loading="tableLoading1" fit stripe
                    :header-cell-style="TableRowStyle2">
                    <el-table-column prop="projectName" label="统计维度" min-width="180" align="center"></el-table-column>
                    <el-table-column label="关联统计" align="center">
                        <el-table-column min-width="120" prop="requirementCount" label="涉及需求数" align="center"
                            show-overflow-tooltip />
                        <el-table-column min-width="120" prop="userStoryCount" label="用户故事数" align="center"
                            show-overflow-tooltip />
                        <el-table-column min-width="120" prop="storyPoint" label="总故事点" align="center"
                            show-overflow-tooltip />
                        <el-table-column min-width="120" prop="taskTotal" label="总任务数" align="center"
                            show-overflow-tooltip />
                    </el-table-column>
                    <el-table-column label="任务完成情况" align="center">
                        <el-table-column min-width="120" prop="taskFinished" label="已完成" align="center"
                            show-overflow-tooltip />
                        <el-table-column min-width="120" prop="taskInProgress" label="进行中" align="center"
                            show-overflow-tooltip />
                        <el-table-column min-width="120" prop="taskNotStarted" label="未开始" align="center"
                            show-overflow-tooltip />
                        <el-table-column min-width="120" prop="blockedCount" label="阻塞问题" align="center"
                            show-overflow-tooltip />
                        <el-table-column min-width="120" prop="taskCompletionRate" label="任务完成率" align="center"
                            show-overflow-tooltip />
                    </el-table-column>
                    <el-table-column label="测试情况" align="center">
                        <el-table-column min-width="120" prop="testCaseTotal" label="总用例数" align="center"
                            show-overflow-tooltip />
                        <el-table-column min-width="120" prop="defectTotal" label="总缺陷数" align="center"
                            show-overflow-tooltip />
                        <el-table-column min-width="120" prop="defectFixed" label="已解决缺陷" align="center"
                            show-overflow-tooltip />
                        <el-table-column min-width="120" prop="defectFixRate" label="缺陷解决率" align="center"
                            show-overflow-tooltip />
                        <el-table-column min-width="120" prop="defectRate" label="缺陷率" align="center"
                            show-overflow-tooltip />
                    </el-table-column>
                </el-table>

            </div>
            <div class="main-container">
                <div class="title-2">人员统计明细</div>
                <div class="search-content jus-start">
                    <el-select v-model="searchData.projectCode" placeholder="项目" clearable
                        style="width: 260px;margin-right: 30px;" @change="getStatisticsList">
                        <el-option v-for="item in projectList" :key="item.code" :label="item.name" :value="item.code" />
                    </el-select>
                    <el-select v-model="searchData.assigneeAccount" placeholder="负责人" clearable style="width: 260px;"
                        @change="getStatisticsList">
                        <el-option v-for="item in chargeList" :key="item.code" :label="item.name" :value="item.code" />
                    </el-select>
                </div>
                <el-table scrollbar-always-on :data="detailTabelData" v-loading="tableLoading2" fit stripe
                    :header-cell-style="TableRowStyle2">
                    <el-table-column prop="assignee" label="负责人" min-width="100" align="left"></el-table-column>
                    <el-table-column min-width="180" prop="projectName" label="项目名称" align="left" show-overflow-tooltip />
                    <el-table-column min-width="200" prop="requirementTitle" label="需求名称" align="left"
                        show-overflow-tooltip />
                    <el-table-column min-width="200" prop="userStoryTitle" label="用户故事" align="left"
                        show-overflow-tooltip />
                    <el-table-column min-width="100" prop="taskTotal" label="任务总数" align="center" show-overflow-tooltip />
                    <el-table-column min-width="100" prop="completedTasks" label="完成任务数" align="center"
                        show-overflow-tooltip />
                    <el-table-column min-width="120" label="未完成任务数" align="center">
                        <template #default="scope">
                            <span style="color:red">{{ scope.row.uncompletedTasks }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="120" prop="taskCompletionRate" label="任务完成进度" align="center"
                        show-overflow-tooltip />
                    <el-table-column min-width="100" prop="testCaseTotal" label="总用例数" align="center"
                        show-overflow-tooltip />
                    <el-table-column min-width="100" prop="testCasePassed" label="通过用例数" align="center"
                        show-overflow-tooltip />
                    <el-table-column min-width="100" prop="testCaseFailed" label="失败用例数" align="center"
                        show-overflow-tooltip />
                    <el-table-column min-width="100" label="未测用例数" align="center">
                        <template #default="scope">
                            <span style="color:red">{{ scope.row.testCaseNotExecuted }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="120" prop="testCasePassRate" label="通过率" align="center"
                        show-overflow-tooltip />
                </el-table>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onBeforeMount, onMounted } from 'vue';
import { Close } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { TableRowStyle, TableRowStyle2 } from '@/utils';
import { getProjectList, getAssigneesList, getDetailList, getPersonDetailList } from '@/api/statisticsManagementApi';
const props = defineProps(['isShow', 'info']);
const emits = defineEmits(['closeDiaFn', 'confirmFn'])
const diaShow = ref(props.isShow ?? false)
const datailInfo = reactive({
    reportDate: '',
    generateTime: '',
    reportId: ''
})
const searchData = reactive({
    projectCode: '',
    assigneeAccount: ''
})
const projectList = ref([
    {
        value: 1,
        name: '敏捷开发平台'
    }, {
        value: 2,
        name: '敏捷开发平台2'
    },
])
const chargeList = ref([
    {
        value: 1,
        name: '管理员'
    }, {
        value: 2,
        name: '开发'
    }])
const tableLoading1 = ref(false)
const tableLoading2 = ref(false)
const tableData = ref([])
const detailTabelData = ref([])
watch(() => props.info, (newName) => {
    datailInfo.reportDate = newName.reportDate
    datailInfo.generateTime = newName.generateTime
    datailInfo.reportId = newName.reportId
    if (newName.reportId) {
        getProjectListFn()
        getAssigneesListFn()
        getDetailListFn()
        getPersonDetailListFn()
    }
}, { immediate: true });

const handleClose = () => {
    diaShow.value = false
    emits('closeDiaFn')
}
const getStatisticsList = () => {
    getPersonDetailListFn()
}
function getProjectListFn() {
    getProjectList(datailInfo.reportId).then(res => {
        if (res.success) {
            projectList.value = res?.data ?? []
        }
    })
}
function getAssigneesListFn() {
    getAssigneesList(datailInfo.reportId).then(res => {
        if (res.success) {
            chargeList.value = res?.data ?? []
        }
    })
}
function getDetailListFn() {
    tableLoading1.value = true
    getDetailList({ 'reportId': datailInfo.reportId }).then(res => {
        tableLoading1.value = false
        if (res.success) {
            tableData.value = res?.data ?? []
        }
    })
}
function getPersonDetailListFn() {
    tableLoading2.value = true
    let params = {
        'reportId': datailInfo.reportId,
        'assigneeAccount': searchData.assigneeAccount,
        'projectCode': searchData.projectCode,
    }
    getPersonDetailList(params).then(res => {
        tableLoading2.value = false
        if (res.success) {
            detailTabelData.value = res?.data ?? []
        }
    })
}
</script>

<style lang="scss" scoped>
.dia-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 15px;
    padding-bottom: 0;

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

.dia-content {
    padding: 0 20px 30px 20px;
    height: calc(100vh - 150px);
    overflow-y: auto;

    .main-container {
        padding: 20px;
        background: #fff;
        border-radius: 8px;
        margin-bottom: 20px;
    }

    .base-info-content {
        margin-bottom: 20px;

        .info-content {
            color: #1d1d1d;
            font-size: 16px;
            align-items: baseline;

            .info-label {
                margin-right: 10px;
                font-weight: 600;
            }
        }
    }

    .search-content {
        margin: 20px 0;

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
    }
}
</style>
<style lang="scss">
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