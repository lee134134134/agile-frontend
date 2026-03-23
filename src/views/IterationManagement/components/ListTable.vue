<template>
  <section class="table-wrapper">
    <el-table v-loading="loading" :data="tableData" :header-cell-style="TableRowStyle" fit max-height="calc(100vh - 305px)" scrollbar-always-on
              show-overflow-tooltip stripe style="width: 100%">
      <el-table-column align="left" label="迭代名称" min-width="180" prop="name">
        <template #default="{ row, column, $index }">
          <div v-if="row.name" style="color:#2173f7;text-decoration: underline;cursor: pointer;"
               @click="detail(row.sprintId)">{{ row.name }}
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column align="left" label="周期" min-width="180" prop="startDate">
        <template #default="{ row, column, $index }">
          {{ row.startDate }} 至 {{ row.endDate }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="所属项目" min-width="120" prop="projectName">
        <template #default="{ row, column, $index }">
          {{ row.projectName || '-' }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="团队" min-width="120" prop="teamName">
        <template #default="{ row, column, $index }">
          {{ row.teamName || '-' }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="需求分析人" min-width="120" prop="productOwnerName">
        <template #default="{ row, column, $index }">
          {{ row.productOwnerName || '-' }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="Scrum Master" min-width="120" prop="scrumMasterName">
        <template #default="{ row, column, $index }">
          {{ row.scrumMasterName || '-' }}
        </template>
      </el-table-column>
      <el-table-column v-if="type=='1' || type == '2'" align="center" label="操作" width="120">
        <template #default="{ row, column, $index }">
          <el-button v-if="row.status == '未开始' && canStartIteration" class="btn-text-primary text-btn"
                     type="text"
                     @click="operateStatus(row.sprintId, 'in_progress')">
            <el-tooltip content="开始" effect="light" placement="top" popper-class="fix-tooltip">
              <img :src="startIcon" alt="开始" class="table-icon"/>
            </el-tooltip>
          </el-button>
          <el-button v-if="row.status == '进行中' && canCompIteration" class="btn-text-default text-btn"
                     type="text" @click="operateStatus(row.sprintId, 'done')">
            <el-tooltip content="完成" effect="light" placement="top" popper-class="fix-tooltip">
              <img :src="finishIcon" alt="完成" class="table-icon table-icon-15"/>
            </el-tooltip>
          </el-button>
          <el-button v-if="(row.status == '未开始' || row.status == '进行中') && canEditIteration" class="text-btn"
                     type="text"
                     @click="operateFn(row.sprintId)">
            <el-tooltip content="编辑" effect="light" placement="top" popper-class="fix-tooltip">
              <img :src="editIcon" alt="编辑" class="table-icon"/>
            </el-tooltip>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>
<script setup>
import {ref, watch} from 'vue';
import {TableRowStyle} from '@/utils';
import {useRouter} from "vue-router"
import editIcon from "@/assets/webp/edit.webp";
import startIcon from "@/assets/webp/start.webp";
import finishIcon from "@/assets/webp/archived.webp";

const router = useRouter();
const emit = defineEmits(['operateFn', 'changeStatus']);
const props = defineProps(['type', 'list']);
const tableData = ref(props.list ?? []);
const canStartIteration = ref() // 开启迭代权限
const canCompIteration = ref() // 完成迭代权限
const canEditIteration = ref() // 编辑迭代权限
canStartIteration.value = JSON.parse(localStorage.getItem('agiles_user')).buttons.includes('iteration_start')
canCompIteration.value = JSON.parse(localStorage.getItem('agiles_user')).buttons.includes('iteration_complete')
canEditIteration.value = JSON.parse(localStorage.getItem('agiles_user')).buttons.includes('iteration_edit')


watch(() => props.list, (newName) => {
  tableData.value = newName
}, {immediate: true});

const operateFn = (id) => {
  emit('operateFn', id)
}
const detail = (id) => {
  router.push({name: 'iterationManagementDetail', query: {id}})
  localStorage.setItem('iteraTab', props.type)
}
const operateStatus = (id, status) => {
  emit('changeStatus', id, status)
}
</script>
<style lang="scss" scoped>
.table-wrapper{
  background: #fff;
  padding: 12px 16px;
  border-radius: 8px;
}

.btn-text-primary {
  color: #2173F7 !important;
}

.btn-text-default {
  color: #333 !important;
}

.btn-text-danger {
  color: #F53F3F !important;
}

.table-icon-15 {
  width: 14px;
  height: 14px;
}
</style>