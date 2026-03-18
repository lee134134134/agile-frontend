<template>
    <el-table scrollbar-always-on :data="tableData" v-loading="loading" fit stripe style="width: 100%"
        :header-cell-style="TableRowStyle" max-height="calc(70vh - 277px)" @select="handleSelect" @select-all="handleSelect" show-overflow-tooltip>
		<el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="storyTitle" label="用户故事" min-width="180" align="left"></el-table-column>
        <el-table-column prop="projectName" label="所属项目" min-width="120" align="left"></el-table-column>
        <el-table-column prop="moduleName" label="功能模块" min-width="120" align="left"></el-table-column>
        <el-table-column prop="priority" label="优先级" min-width="120" align="left"></el-table-column>
        <el-table-column prop="effort" label="工作量" min-width="120" align="left"></el-table-column>
    </el-table>
</template>
<script setup>
import { ref, reactive, watch, onBeforeMount } from 'vue';
import { TableRowStyle } from '@/utils';
const emit = defineEmits(['operateFn']);
const props = defineProps(['type', 'list']);
const tableData = ref(props.list ?? []);

watch(() => props.list, (newName) => {
    tableData.value = newName
}, { immediate: true });

const handleSelect = (selection) => {
  let storyCodes = []
  selection.forEach(item => {
    storyCodes.push(item.storyCode)
  })
  console.log('storyCodes===', storyCodes)
	emit('operateFn', storyCodes)
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