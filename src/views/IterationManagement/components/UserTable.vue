<template>
    <el-table scrollbar-always-on :data="teamMembers" v-loading="loading" fit stripe style="width: 100%"
        :header-cell-style="TableRowStyleHide" :max-height="150">
        <el-table-column prop="userName" label="成员姓名" min-width="180" align="left">
          <template #default="{ row, column, $index }">
            {{row.userName}} ({{ (row.availabilityDay !== null && row.availabilityDay !== '') ? row.availabilityDay+'自然天' : '-' }})
          </template>
        </el-table-column>
        <el-table-column prop="availability" label="可用性" min-width="120" align="left">
          <template #default="{ row, column, $index }">
            <div style="display:flex;">
              <el-progress :percentage="row.availability * 100" color="#1f8fff" :show-text="false" style="width:60%;"/><span style="margin-left:20px;font-weight: bold;">{{ row.availability * 100 }}%</span>
            </div>
          </template>
        </el-table-column>
    </el-table>
</template>
<script setup>
import {TableRowStyle, TableRowStyleHide} from '@/utils';
const props = defineProps(['teamMembers'])

</script>