<template>
  <el-dialog v-model="addShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" class="edit-dia"
             width="1200px" @close="handleClose">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">查看业务参数</div>
        </div>
        <el-icon class="dia-header-close" size="16px" @click="handleClose">
          <Close/>
        </el-icon>
      </div>
    </template>
    <div class="dia-main">
      <el-table :data="paramsDataList" :header-cell-style="TableRowStyle" fit max-height="calc(100vh - 333px)" scrollbar-always-on
                show-overflow-tooltip style="width: 100%">
        <el-table-column align="left" label="所属模块" min-width="100" prop="moduleName"></el-table-column>
        <el-table-column align="left" label="条件字段" min-width="500">
          <template #default="{ row }">
            <div class="cond-box jus-flex-start">
              <span v-for="item in row.fieldMetas" class="info-span">{{ item.fieldName }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script setup>
import {onBeforeMount, ref} from 'vue';
import {TableRowStyle} from '@/utils';
import {Close} from '@element-plus/icons-vue';
import {useDicStore} from "@/stores/dic.js";

const dicStore = useDicStore()
const props = defineProps(['isShow']);
const emits = defineEmits([
  'closeDiaFn',
  'confirmFn',
  'editConfirmFn'
])
const addShow = ref(props.isShow ?? false)
const paramsDataList = ref([])

const getDataList = () => {
  paramsDataList.value = dicStore.metaList
}

const handleChange = (e) => {
  console.log('paramsDataList===', paramsDataList.value)
}

const handleClose = () => {
  emits('closeDiaFn')
}

onBeforeMount(() => {
  getDataList()
})
</script>
<style lang="scss" scoped>
.mt20 {
  margin-top: 20px;
}

.opt-btn-disabled {
  background-color: #ececec;
  cursor: default;
  color: #A4A4A4;
}

.dia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px 10px;
  margin-bottom: -12px;

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

.dia-main {
  padding-left: 20px;
  padding-right: 20px;

  .dia-main-content {
    // height: calc(90vh - 200px);

  }

  .cond-box {
    flex-wrap: wrap;
    margin-top: 6px;
  }
}

.info-span{
  display: inline-block;
  margin-right: 8px;
  padding: 0 10px;
  height: 22px;
  line-height: 20px;
  border-radius: 2px;
  font-size: 12px;
  background: #eff5ff;
  color: #666;
  margin-bottom: 6px;
}

</style>