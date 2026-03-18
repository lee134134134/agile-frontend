<template>
    <el-dialog v-model="showDia" :show-close="false" width="1000px" min-height='300px' @close="handleClose" class="edit-dia">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-icon"></div>
                    <div class="title-text">管理元素</div>
                </div>
                <el-icon class="dia-header-close" size="16px" @click="handleClose">
                    <Close />
                </el-icon>

            </div>
        </template>
        <div class="dia-main">
            <div class="tab-content">
                <div class="jus-start-center">
                    <div :class="activeTab == 1 ? 'tab-btn-active' : 'tab-btn'" class="btn-margin" @click="handleChangeTab(1)">设置项</div>
                    <div :class="activeTab == 2 ? 'tab-btn-active' : 'tab-btn'" class="btn-margin" @click="handleChangeTab(2)">变量</div>
                    <div :class="activeTab == 3 ? 'tab-btn-active' : 'tab-btn'" class="btn-margin" @click="handleChangeTab(3)">关键字</div>
                    <div :class="activeTab == 4 ? 'tab-btn-active' : 'tab-btn'" class="btn-margin" @click="handleChangeTab(4)">标签</div>
                </div>
            </div>
            <ElementTable :data="tableData" :activeTab="activeTab" ref="elementTableRef" @refreshListFn="getManageEleListFn" />
        </div>
        <div class="dia-footer jus-flex-end">
            <div class="btn-cancel" @click="handleClose">关闭</div>
        </div>

    </el-dialog>
</template>
<script setup>
import { ref, reactive, onBeforeMount, onMounted, watch } from 'vue';
import { isValidVersion } from "@/utils/index.js";
import { TableRowStyle3 } from '@/utils';
import { ElMessage, ElMessageBox } from 'element-plus';
import { uploadAttach, downloadAttach } from '@/api/growthSpaceApi';
import { getManageEleList } from '@/api/testCaseApi';
import { getEleTabType } from '@/utils/testCaseConstant.js'
import ElementTable from './ElementTable.vue'
const props = defineProps(['isShow', 'type', 'resultInfo']);
const emits = defineEmits([ 'closeDiaFn']);

const showDia = ref(props.isShow ?? false)
const activeTab = ref(1)
const elementTableRef = ref()
const tableData = ref([])

const handleClose = () => {
    showDia.value = false
    emits('closeDiaFn')
}

const handleChangeTab = (tabVal) => {
    let hasEditData = elementTableRef.value.hasEditing()
    if(hasEditData) {
        ElMessage.warning('当前有正在编辑的数据，请先保存后再进行其它操作！')
        return
    }
    tableData.value = []
    activeTab.value = tabVal
    getManageEleListFn()
}

const getManageEleListFn = () => {
    let params = {
        type: getEleTabType(activeTab.value)
    }
    getManageEleList(params).then(res => {
        if(res.success) {
            tableData.value = res.data
        }
    })
}

onMounted(() => {
    getManageEleListFn()
})
</script>

<style lang="scss" scoped>
.edit-dia {
    // background: linear-gradient(180deg, #dde7ff 0%, #f7f9fe 15%, #ffffff 100%);
    box-shadow: 0px 2px 15px 5px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 24px 20px 16px;

}
.dia-main {
    padding: 0 15px;
    .tab-content {
        border-bottom: 1px solid #EAEDF3;
        user-select: none;

        .btn-margin {
            margin-right: 36px;
        }

        .tab-btn {
            color: #666;
            font-family: 'Microsoft YaHei', 'PingFang SC';
            cursor: pointer;
            padding: 8px 0;
        }

        .tab-btn-active {
            color: var(--el-color-primary);
            font-weight: 600;
            font-family: 'Microsoft YaHei', 'PingFang SC';
            cursor: pointer;
            padding: 6px 0;
            border-bottom: 2px solid var(--el-color-primary);
        }
    }

}
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

    .dia-header-close {
        cursor: pointer;

        svg {
            width: 1.5em;
            height: 1.5em;
        }
    }
}


.dia-footer {
    margin-top: 16px;
    margin-bottom: 8px;
    padding: 0 15px;
    .btn-cancel {
        height: 30px;
        line-height: 30px;
        border-radius: 4px;
        color: #FFF;
        background-color: var(--el-color-primary);
    }

    .btn-cancel:hover {
        opacity: 0.8;
    }

    .btn-submit {
        height: 30px;
        line-height: 30px;
        border-radius: 4px;
    }
}
</style>