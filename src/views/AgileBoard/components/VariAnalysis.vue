<template>
    <div class="analysis-content">
        <div class="ana-title">
            迭代燃尽图差异分析
        </div>
        <el-table :data="tableData" stripe style="width: 100%;" :header-cell-style="TableRowStyle">
            <el-table-column prop="type" label="类别" min-width="100" ></el-table-column>
            <el-table-column prop="total" label="总数" min-width="100"></el-table-column>
            <el-table-column prop="residueAtStart" label="迭代开始日期剩余数" min-width="200"></el-table-column>
            <el-table-column prop="difference" label="差异（总数-剩余数）" min-width="200"></el-table-column>
        </el-table>
        <div>
            <div class="table-desc">表格说明：</div>
            <ul>
                <li>差异值代表迭代开始前已完成的故事点/任务数（总数减去剩余数）</li>
                <li>故事点数据基于各用户故事任务的完成比例折算得出</li>
                <li>任务数直接统计迭代开始前已完成的任务数量</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { TableRowStyle } from '@/utils';

const props = defineProps(['tableData'])

</script>

<style lang="scss" scoped>
.analysis-content {
    width: 700px;
    padding: 20px;

    .ana-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 20px;
    }
    .table-desc {
        margin: 10px 0;
    }

    ul {
        padding-left: 30px;

        li {
           list-style: disc;
       }
    }
}
</style>