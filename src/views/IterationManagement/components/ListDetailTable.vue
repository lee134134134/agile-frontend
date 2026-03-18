<template>
    <el-table scrollbar-always-on :data="tableData" v-loading="loading" fit stripe style="width: 100%"
        :header-cell-style="TableRowStyle" max-height="calc(100vh - 470px)" show-overflow-tooltip>
        <el-table-column prop="title" label="用户故事" min-width="180" align="left">
          <template #default="{row, column, $index}">
            {{ row.title || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="title" label="所属模块" min-width="180" align="left">
          <template #default="{row, column, $index}">
            {{ row.moduleTitle || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" min-width="120" align="left">
          <template #default="{row, column, $index}">
            <span class="tags1 " :class="{ 'p0': row.priority == 'P0', 'p1': row.priority == 'P1', 'p2': row.priority == 'P2', 'p3': row.priority == 'P3', 'p4': row.priority == 'P4', 'p5': row.priority == 'P5' }">
              {{ row.priority || '-' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="storyPoints" label="故事点" min-width="60" align="left">
          <template #default="{row, column, $index}">
            {{ row.storyPoints || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="statusName" label="状态" min-width="120" align="center">
          <template #default="{row, column, $index}">
            <span class="progress-tag" :class="{ 'status-black': row.status == 'todo', 'status-blue': row.status == 'in_progress', 'status-green': row.status == 'done',  'status-test': row.status == 'testing' }">
              {{ row.statusName || '-' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="责任人" min-width="120" align="left">
          <template #default="{row, column, $index}">
            {{ row.nickname || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="任务进度" min-width="180" align="left">
          <template #default="{row, column, $index}">
            <div style="display:flex; gap: 28px;">
              <el-progress :percentage="(row.per !== null && row.per !== '') ? (row.per * 100) : 0" color="#1f8fff" :show-text="false" style="width:60%;"/>
              <span>{{ row.completedCount !== null && row.completedCount !== '' ? row.completedCount : '-' }}/{{ row.taskCount !== null && row.taskCount !== '' ? row.taskCount : '-'  }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
            <template #default="scope">
                <el-button type="text text-btn" v-if="canEditIteraStory && props.detail.status !== '已完成'" @click="operateEdit(scope.row)"><img :src="editIcon" alt="编辑" class="table-icon"/></el-button>
                <el-button type="text text-btn" v-if="canRemoveIteraStory && type == '1' && props.detail.status !== '已完成'" @click="operateRemove(scope.row)"><img :src="deleteIcon" alt="移除" class="table-icon"/></el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script setup>
import { ref, reactive, watch, onBeforeMount } from 'vue';
import { TableRowStyle } from '@/utils';
import deleteIcon from "@/assets/webp/delete.webp";
import editIcon from "@/assets/webp/edit.webp";
const emit = defineEmits(['operateFnEdit', 'operateFnRemove']);
const props = defineProps(['type', 'list','detail']);
const tableData = ref(props.list ?? []);
const canEditIteraStory = ref() // 编辑用户故事权限
const canRemoveIteraStory = ref() // 移除用户故事权限
canEditIteraStory.value = JSON.parse(localStorage.getItem('agiles_user')).buttons.includes('iteration_story_edit')
canRemoveIteraStory.value = JSON.parse(localStorage.getItem('agiles_user')).buttons.includes('iteration_story_remove') && JSON.parse(localStorage.getItem('agiles_user')).role.includes('关键操作审核人员')

watch(() => props.list, (newName) => {
    tableData.value = newName
}, { immediate: true });

const operateEdit = (row) => {
	emit('operateFnEdit', row)
}
const operateRemove = (row) => {
  emit('operateFnRemove', row)
}

</script>
<style lang="scss" scoped>
	.btn-text-primary {
	    color: #2173F7 !important;
	}
	
	.btn-text-danger {
	    color: #F53F3F !important;
	}
</style>