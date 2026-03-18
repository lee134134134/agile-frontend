<template>
    <div class="demand-content">
        <div class="page-search">
            <div class="jus-bet-center">
                <div class="title-1">产品代办事项</div>
                <div class="btn-list jus-start-center">
                    <div class="opt-btn" @click="handleAddFn">添加需求</div>
                    <ImportDemand @reloadFn="handleReset"></ImportDemand>
                    <div class="opt-btn" @click="handleExport">导出进度</div>
                </div>
            </div>
            <div class="search-content jus-bet-start bg-color-1 border-radius-8">
                <el-form ref="demandFormRef" :model="demandForm" label-width="60px" label-position="left">
                    <el-row :gutter="24">
                        <el-col :span="6">
                            <el-form-item label="项目" prop="projectId">
                                <el-select v-model="demandForm.projectId" placeholder="全部项目" clearable
                                    style="width: 260px;">
                                    <el-option v-for="item in projectList" :key="item.projectId" :label="item.name"
                                        :value="item.projectId" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="进度" prop="progress">
                                <el-select v-model="demandForm.progress" placeholder="全部进度" clearable style="width: 260px;">
                                    <el-option v-for="item in progressList" :key="item.value" :label="item.name"
                                        :value="item.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="关键词" prop="keyword">
                                <el-input v-model="demandForm.keyword" placeholder="标题或描述关键词" clearable
                                    style="width: 260px;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="search-btn jus-flex-end">
                    <div class="btn-primary btn-margin-right" @click="handleSerach">筛选</div>
                    <div class="btn-circle" @click="handleReset">重置</div>
                </div>
            </div>
        </div>
        <div class="page-table">
            <div class="jus-bet-center">
                <div class="title-2">进度列表</div>
                <div style="margin-right:5px">
                    <div id="draggerCon_btn" class="option-btn jus-bet-center" @click="handleShowDrag">
                        <img src="@/assets/images/demand/sort.png" alt=""> 表格列设置
                    </div>
                    <draggerCom id="draggerCon" :isShow="isShowDrag" :fixedDataList="fixedDataList"
                        :initList="initColumns.filter(item => item.prop != 'requirementCode' && item.prop != 'projectName' && item.prop != 'title')"
                        @upDataFn="upColumnsData" @handleSaveDrag="handleSaveDrag" @resetFn="resetFn"></draggerCom>
                </div>
            </div>
            <el-table scrollbar-always-on :data="tableData" v-loading="loading" fit stripe style="width: 100%"
                :header-cell-style="TableRowStyle" height="calc(100vh - 488px)">
                <el-table-column v-for="(item, index) in tableColums.filter(item => item.isSelect == true)"
                    :key="item.prop + index" :label="item.label" :width="item.width" align="center"
                    :show-overflow-tooltip="item.showTooltip + '' == 'true'"
                    :fixed="item.prop == 'requirementCode' || item.prop == 'projectName' || item.prop == 'title' ? 'left' : false">
                    <template #default="scope">

                        <span v-if="item.prop != 'progressName'">{{ scope.row[item.prop] ?? '-' }}</span>
                        <div v-else>
                            <span class="progress-tag"
                                :class="{ 'bg-gray': scope.row.progress == 'unprocessed', 'bg-yellow': scope.row.progress == 'analyzing', 'bg-green': scope.row.progress == 'confirmed' || scope.row.progress == 'online', 'bg-blue': scope.row.progress == 'developing' || scope.row.progress == 'testing' || scope.row.progress == 'accepting' }">
                                {{ scope.row.progressName ?? '-' }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center" fixed="right">
                    <template #default="scope">
                        <el-button type="text" class="btn-text-primary text-btn"
                            @click="handleEditFn(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="paginationg-box">
                <pagination @currentPageCurrent="currentPageCurrent" @currentPageSize="currentPageSize" :total="total"
                    :currentPage="demandForm.current" :pageSize="demandForm.size">
                </pagination>
            </div>
        </div>
        <DemandAdd v-if="operateDetailShow" :isShow="operateDetailShow" :type="detailType" @closeDiaFn="handleClose"
            @confirmFn="handleAddRole">
        </DemandAdd>
        <ProgressEdit v-if="editDetailShow" :isShow="editDetailShow" :detailInfo="detailInfo" @closeDiaFn="handleCloseEdit"
            @confirmFn="handleEditDia"></ProgressEdit>
    </div>
</template>
<script setup>
import { ref, reactive, onMounted, nextTick, onBeforeMount } from 'vue';
import { TableRowStyle } from '@/utils';
import pagination from '@/components/pagination.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import draggerCom from '@/components/draggerCom.vue';
import DemandAdd from "../../DemandManagement/components/DemandAdd.vue";
import { reportOrderList, reportOrderSave, demandProgressList, demandAddList, demandUpdateProgressList, exportDemandProgressList } from '@/api/demand.js';
import ProgressEdit from '../../DemandManagement/components/ProgressEdit.vue';
import ImportDemand from '../../DemandManagement/components/ImportDemand.vue';
import { useDicStore } from '@/stores/dic.js';
const dicStore = useDicStore()
const demandForm = reactive({
    projectId: '',
    progress: '',
    keyword: '',
    size: 10,
    current: 1,
});
const total = ref(100);
const demandFormRef = ref(null);
const loading = ref(false);
const isShowDrag = ref(false)
const operateDetailShow = ref(false)
const detailType = ref('')
const detailInfo = ref(null)
const projectList = ref(dicStore.projectList ?? [])
const defaultColumns = ref([
    {
        label: '需求编号',
        prop: 'requirementCode',
        isSelect: true,
        width: '150',
        showTooltip: true,
    },
    {
        label: '所属项目',
        prop: 'projectName',
        isSelect: true,
        width: '150',
        showTooltip: true
    },
    {
        label: '需求标题',
        prop: 'title',
        isSelect: true,
        width: '200',
        showTooltip: true
    },
    {
        label: '需求接收日期',
        prop: 'requirementReceivedDate',
        isSelect: true,
        width: '180',
        showTooltip: true
    },
    {
        label: '排序',
        prop: 'orderNum',
        isSelect: true,
        width: '100',
        showTooltip: false
    },
    {
        label: '需求进度',
        prop: 'progressName',
        isSelect: true,
        width: '100',
        showTooltip: true
    },
    {
        label: '需求分析开始日期',
        prop: 'analysisStartDate',
        isSelect: true,
        width: '200',
        showTooltip: true
    },
    {
        label: '需求分析完成日期',
        prop: 'analysisEndDate',
        isSelect: true,
        width: '200',
        showTooltip: false
    },
    {
        label: '需求分析(天)',
        prop: 'analysisDuration',
        isSelect: true,
        width: '150',
        showTooltip: false
    },
    {
        label: '需求编写开始日期',
        prop: 'docStartDate',
        isSelect: true,
        width: '180',
        showTooltip: false
    },
    {
        label: '需求编写完成日期',
        prop: 'docEndDate',
        isSelect: true,
        width: '180',
        showTooltip: true
    }, {
        label: '文档编写(天)',
        prop: 'docDuration',
        isSelect: true,
        width: '150',
        showTooltip: true
    }, {
        label: '需求合计(天)',
        prop: 'requirementTotalDuration',
        isSelect: true,
        width: '180',
        showTooltip: true
    }, {
        label: '业务确认需求日期',
        prop: 'businessConfirmDate',
        isSelect: true,
        width: '180',
        showTooltip: true
    }, {
        label: '开发开始日期',
        prop: 'developmentStartDate',
        isSelect: true,
        width: '150',
        showTooltip: true
    }, {
        label: '测试开始日期',
        prop: 'testingStartDate',
        isSelect: true,
        width: '150',
        showTooltip: true
    }, {
        label: '验收开始日期',
        prop: 'acceptanceStartDate',
        isSelect: true,
        width: '150',
        showTooltip: true
    }, {
        label: '开发(天)',
        prop: 'developmentDuration',
        isSelect: true,
        width: '150',
        showTooltip: true
    }, {
        label: '测试(天)',
        prop: 'testingDuration',
        isSelect: true,
        width: '150',
        showTooltip: true
    }, {
        label: '业务验收开始日期',
        prop: 'businessAcceptanceStartDate',
        isSelect: true,
        width: '150',
        showTooltip: true
    }, {
        label: '上线日期',
        prop: 'goLiveDate',
        isSelect: true,
        width: '150',
        showTooltip: true
    }, {
        label: '总合计(天)',
        prop: 'totalDuration',
        isSelect: true,
        width: '150',
        showTooltip: true
    },
    {
        label: '备注',
        prop: 'remarks',
        isSelect: true,
        width: '200',
        showTooltip: true
    }])

const progressList = ref(dicStore.progressList ?? [])
const initColumns = ref([])
const tableColums = ref([])
const fixedDataList = ref([])
const tableData = ref([]);
const editDetailShow = ref(false)
const handleShowDrag = () => {
    isShowDrag.value = !isShowDrag.value
    initColumns.value = JSON.parse(JSON.stringify(tableColums.value))
}

/*查询相关功能: 
 * 查询操作 @handleSerach
 * 重置操作 @handleReset
 * 分页功能 @currentPageCurrent @currentPageSize
 * 获取list 
*/

const handleSerach = () => {
    demandForm.current = 1;
    getList()
};

const handleReset = () => {
    demandFormRef.value.resetFields();
    demandForm.current = 1;
    getList()
};
const currentPageCurrent = (val) => {
    demandForm.current = val
    getList()
}
const currentPageSize = (val) => {
    demandForm.size = val
    demandForm.current = 1
    getList()
}
function getList() {
    loading.value = true
    demandProgressList(demandForm).then(res => {
        tableData.value = res.data.records;
        total.value = res.data.total;
        loading.value = false;
    }).catch(() => {
        loading.value = false;
    })
}
//详情新增等
const handleClose = () => {
    operateDetailShow.value = false
    detailInfo.value = null
}
const handleAddFn = () => {
    operateDetailShow.value = true
    detailInfo.value = null
    detailType.value = '新增'
}
const handleAddRole = (data) => {
    demandAddList(data).then(res => {
        if (res.success) {
            operateDetailShow.value = false
            detailInfo.value = null
            demandForm.size = 10;
            demandForm.current = 1;
            getList()
        }
    })

}
//编辑进度，打开编辑进度弹窗
const handleEditFn = (data) => {
    detailInfo.value = data
    editDetailShow.value = true
}
const handleCloseEdit = () => {
    editDetailShow.value = false
    detailInfo.value = null
}
const handleEditDia = (data) => {
    //编辑todo
    demandUpdateProgressList(data).then(res => {
        if (res.success) {
            editDetailShow.value = false
            detailInfo.value = null
            demandForm.size = 10;
            demandForm.current = 1;
            getList()
        }
    })
}
//获取表格
function getColumnList() {
    let params = {
        usrname: dicStore.userName,
        module: 'demand_progress_list'
    }
    reportOrderList(params).then(res => {
        if (res.data.length > 0) {
            res.data.forEach(item => {
                item.isSelect = item.isSelect == 'true' ? true : false
            })
            initColumns.value = JSON.parse(JSON.stringify(res.data))
            tableColums.value = JSON.parse(JSON.stringify(res.data))
        } else {
            // 没有保存过，初始化
            defaultColumns.value.forEach((item, index) => {
                item.username = dicStore.userName
                item.moduleName = 'demand_progress_list'
                item.sorts = index + 1
            })
            initColumns.value = JSON.parse(JSON.stringify(defaultColumns.value))
            tableColums.value = JSON.parse(JSON.stringify(defaultColumns.value))
        }
    })
    getList()
}
// 表格列设置
function upColumnsData(data) {
    nextTick(() => {
        tableColums.value = JSON.parse(JSON.stringify(data))
        tableColums.value.unshift(...fixedDataList.value)
        console.log('tableColums.value==', tableColums.value)
    })
}

// 重置表格列
function resetFn() {
    nextTick(() => {
        tableColums.value = JSON.parse(JSON.stringify(initColumns.value))
    })
}

// 保存表格列表设置
function handleSaveDrag() {
    console.log('保存拖动')
    isShowDrag.value = false
    saveColumnList()
}

function saveColumnList() {
    let arr = JSON.parse(JSON.stringify(tableColums.value))
    reportOrderSave(arr).then(res => {
        console.log('保存列返回结果：', res)
        initColumns.value = JSON.parse(JSON.stringify(tableColums.value))
    })
}
function initFixedDataList() {
    fixedDataList.value = [{
        label: '需求编号',
        prop: 'requirementCode',
        isSelect: true,
        width: '150',
        showTooltip: true,
        username: dicStore.userName,
        moduleName: 'demand_progress_list',
        sort: 1,
    },
    {
        label: '所属项目',
        prop: 'projectName',
        isSelect: true,
        width: '150',
        showTooltip: true,
        username: dicStore.userName,
        moduleName: 'demand_progress_list',
        sort: 2,
    },
    {
        label: '需求标题',
        prop: 'title',
        isSelect: true,
        width: '200',
        showTooltip: true,
        username: dicStore.userName,
        moduleName: 'demand_progress_list',
        sort: 3,
    }]
}
function setEventListener() {
    document.addEventListener('mouseup', e => {
        var con = document.getElementById('draggerCon')
        var con_btn = document.getElementById('draggerCon_btn')
        if (con && con_btn) {
            if (!con.contains(e.target) && !con_btn.contains(e.target)) {
                isShowDrag.value = false
            }
        }
    })
}
function handleExport() {
    exportDemandProgressList(demandForm)
}
onBeforeMount(() => {
    initFixedDataList()
})
onMounted(() => {
    getColumnList()
    setEventListener()
})
</script>
<style lang="scss" scoped>
.demand-content {
    height: calc(100vh - 200px);

    .page-search {
        margin-bottom: 40px;

        .btn-list {
            .opt-btn {
                padding-top: 5px;
                margin-left: 10px;
            }
        }

        .search-content {
            margin-top: 25px;
            padding: 20px;
            // height: 72px;

            .search-btn {
                margin-left: 20px;
                padding-right: 20px;
            }

        }

        :deep(.el-form-item) {
            margin-bottom: 0;
        }

        :deep(.el-input) {
            --el-input-height: 28px;
            --el-input-border-color: #DBDDE3;
            --el-input-border-radius: 4px;
            --el-input-padding-left: 10px;
            --el-input-padding-right: 10px;
            width: 260px;
        }

        :deep(.el-select__wrapper) {
            min-height: 28px;
            border-radius: 4px;
        }
    }

    .page-table {
        .title-2 {
            margin-bottom: 12px;
        }

        .option-btn {
            cursor: pointer;

            img {
                display: block;
                width: 20px;
                height: 20px;
            }
        }

        .option-btn:hover {
            opacity: 0.8;
        }

        .status-content {
            text-align: center;
        }

        .current-user {
            margin-left: 5px;
            width: 80px;
            height: 24px;
            background: #E0EEFF;
            border-radius: 8px 8px 8px 8px;
            border: 1px solid #2173F7;
            color: #2173F7;
            font-size: 14px;
            font-weight: bold;
            line-height: 24px;
            text-align: center;
        }

        .btn-text-primary {
            color: #2173F7 !important;
        }

        .btn-text-danger {
            color: #F53F3F !important;
        }

        .disabled-btn {
            color: #B2B2B2 !important;
            cursor: default;
        }

        .text-btn:hover {
            opacity: 0.8 !important;
        }

        .disable-text {
            width: 175px;
            margin: 0 auto;
            font-size: 14px;
            color: #B2B2B2;
            font-weight: 600;
            font-family: PingFang SC;
            text-align: left;
        }
    }

    .info-content {
        text-align: left;
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 16px;
        color: #555555;
        line-height: 28px;

        .color-blue {
            color: #2173F7;
        }

        svg {
            width: 1.5em;
            height: 1.5em;
        }
    }

}
</style>