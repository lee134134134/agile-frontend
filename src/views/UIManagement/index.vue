<template>
    <div class="main-content">
        <el-form :inline="true">
            <el-form-item label="项目名称">
                <el-input v-model="searchForm.projectName" placeholder="请输入项目名称/简称" clearable style="width: 260px;"
                    @change="getProjectListFn"></el-input>
            </el-form-item>
        </el-form>
        <div class="uicontent-main">
            <div class="title-1">项目列表</div>
            <div class="card-list">
                <div class="uicard-content" v-for="item in uiProjectList" :key="item.projectCode">
                    <div class="title-2">{{ item.name ?? '-' }}</div>
                    <div class="card-text">简称：{{ item.shortName ?? '-' }}</div>
                    <div class="opt-btn" @click="goUIView(item.projectCode)">查看原型图</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { getProjectList } from '@/api/projectApi.js';
const router = useRouter()
const projectName = ref('')
const uiProjectList = ref([])
const baseDataList = ref([])
const searchForm = reactive({
    projectName: '',
    state: '',
})

const goUIView = (code) => {
    router.push({ path: '/uiManagement/uiDetail', query: { proCode: code } })
}
// const handleFilter = () => {
//     let a = baseDataList.value.filter(item => item.name.includes(projectName.value))
//     uiProjectList.value = a
// }
const getProjectListFn = async () => {
    getProjectList(searchForm).then(res => {
        if (res.success) {
            uiProjectList.value = res?.data ?? []
            baseDataList.value = res?.data ?? []
        }
    })
}
onBeforeMount(async () => {
    await getProjectListFn()
})
</script>

<style lang="scss" scoped>
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

.search-item {
    margin-bottom: 20px;
}

.uicontent-main {
    width: 100%;

    .title-1 {
        margin-bottom: 20px;
    }

    .card-list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        row-gap: 15px;
        column-gap: 10px;

        .uicard-content {
            width: calc((100% - 20px)/3);
            padding: 20px;
            background: #fff;
            border-radius: 4px;

            .card-text {
                margin: 20px 0;
                font-size: 14px;
                color: #a4a4a4;
            }

            .opt-btn {
                width: 110px
            }
        }
    }


}
</style>