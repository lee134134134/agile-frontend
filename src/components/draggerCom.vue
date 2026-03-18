<template>
  <div class="drager-content">
    <el-icon color="#fff" class="arrow-icon" v-show="isShow">
      <CaretTop />
    </el-icon>
    <div class="opt-list" v-show="isShow">
      <div class="optionBox">
        <VueDraggable v-model="fixedColumns" target=".fixed-sort-target" :scroll="true" handle=".handle" @end="handleEnd"
          :disabled="true">
          <TransitionGroup type="transition" tag="ul" name="fade" class="fixed-sort-target">
            <li v-for="(item, index) in fixedColumns" :key="item.prop"
              class="h-50px bg-gray-500/5 rounded flex items-center justify-between px-2">
              <el-icon class="handle cursor-move" size="20px" color="#CCC" style="cursor: default;">
                <Operation />
              </el-icon>
              <el-checkbox :key="index" :label="item.prop" v-model="item.isSelect" :disabled="true">
                {{ item.label }}
              </el-checkbox>
            </li>
          </TransitionGroup>
        </VueDraggable>
        <VueDraggable v-model="dataList" target=".sort-target" :scroll="true" handle=".handle" @end="handleEnd">
          <TransitionGroup type="transition" tag="ul" name="fade" class="sort-target">
            <li v-for="(item, index) in dataList" :key="item.prop"
              class="h-50px bg-gray-500/5 rounded flex items-center justify-between px-2">
              <el-icon class="handle cursor-move" size="20px">
                <Operation />
              </el-icon>
              <el-checkbox :key="index" :label="item.prop" v-model="item.isSelect" @change="handleUpdata">
                {{ item.label }}
              </el-checkbox>
            </li>
          </TransitionGroup>
        </VueDraggable>
      </div>
      <div class="btnBox jus-flex-end">
        <div class="btn-cancel btn-reset resetBtn" @click="handleReset">重置</div>
        <div class="btn-submit searchBtn" @click="handleSave">保存</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { Operation } from '@element-plus/icons-vue'
const props = defineProps({
  fixedDataList: {
    type: Array,
    default: () => ([])
  },
  initList: {
    type: Array,
    default: () => ([])
  },
  isShow: {
    type: Boolean,
    default: false
  }
});
const dataList = ref([])
let fixedColumns = ref([])
fixedColumns.value = props.fixedDataList
const emits = defineEmits([
  'upDataFn', 'handleSaveDrag', 'resetFn'
])
watch(() => props.initList, async (newValue) => {
  if (newValue) {
    dataList.value = JSON.parse(JSON.stringify(newValue))
  }
}, { immediate: true });
const handleUpdata = (val) => {
  emits('upDataFn', dataList.value)
}
const handleEnd = () => {
  console.log('拖拽结束')
  emits('upDataFn', dataList.value)
}
const handleReset = () => {
  console.log('huanyuan')
  dataList.value = JSON.parse(JSON.stringify(props.initList))
  emits('resetFn')
}
const handleSave = () => {
  emits('handleSaveDrag')
}
</script>

<style lang="scss" scoped>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

.fade-leave-active {
  position: absolute;
}

.fixed-sort-target {
  padding: 0px 20px;
}

.sort-target {
  padding: 0px 20px;
}

.cursor-move {
  cursor: move;
  margin-right: 20px;
}

li {
  list-style: none;
  padding: 3px 10px;
  padding-left: 0;
  display: flex;
  align-items: center;
}

.drager-content {
  position: relative;

  .opt-list {
    top: 10px;
    right: 0;
    position: absolute;
    z-index: 999;
    background: #fff;
    box-shadow: 0 0 3px 2px #ddd;

    .optionBox {
      max-height: 400px;
      overflow-y: scroll;
      padding: 8px 0;
    }
  }

  .arrow-icon {
    position: absolute;
    z-index: 9999;
    line-height: 1em;
    top: 0;
    right: 48%;
    color: #FFF;
  }

  .btnBox {
    gap: 10px;
    border-top: 1px solid #eee;
    padding: 8px 20px;

    // .btn {
    //   padding: 0 14px;
    //   height: 32px;
    //   background-color: #2173F7;
    //   border-radius: 4px;
    //   cursor: pointer;
    // }

    // .btn-reset {
    //   background-color: #FFF;
    // }
  }
}

/* 整个滚动条 */
::-webkit-scrollbar {
  width: 5px;
  /* 宽度 */
  height: 8px;
  /* 高度 */
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: none;
  /* 颜色 */
}

/* 滚动条的滑块 */
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  /* 颜色 */
  border-radius: 4px;
}

/* 滚动条的滑块：鼠标悬停时 */
::-webkit-scrollbar-thumb:hover {
  background: #e9e9e9;
  /* 颜色 */
}
</style>