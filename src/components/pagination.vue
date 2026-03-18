<template>
  <div class="demo-pagination-block">
    <el-pagination v-model:currentPage="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
      :disabled="disabled" :background="background"       layout="->,total, jumper, prev, pager, next, sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="props.total"
      :teleported="false">
    </el-pagination>
  </div>
</template>
<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
const emits = defineEmits(['currentPageCurrent', 'currentPageSize'])
const small = ref(true)
const background = ref(true)
const disabled = ref(false)
const pageNo = ref()
const props = defineProps({
  total: Number,
  currentPage: Number,
  pageSize: Number,
})
const currentPage = ref(props.currentPage || 1)//当前第几页
const pageSize = ref(props.pageSize || 10)
watch(() => props.currentPage, async (newValue) => {
  if (newValue) {
    currentPage.value = newValue
  }
}, { immediate: true });
watch(() => props.pageSize, async (newValue) => {
  pageSize.value = newValue
}, { immediate: true });

function handleSizeChange(val) {
  emits('currentPageSize', val)
}
function handleCurrentChange(val) {
  pageNo.value = val
  emits('currentPageCurrent', val)
}
</script>
<style lang="scss">
.el-pagination__rightwrapper {
  span {
    font-size: 12px;
  }

  ul {
    li {
      font-size: 12px;
    }
  }
}

.el-pagination__sizes {
  .el-select {
    width: 106px;
  }
}
</style>
