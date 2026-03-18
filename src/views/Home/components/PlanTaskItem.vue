<template>
  <div class="plan-item-container jus-center">
    <el-checkbox v-model="taskInfo.status" :false-label="0" :true-label="1" class="radio-like-checkbox"
                 @change="changeTaskStatus"/>
    <div :style="{'color': taskInfo.status == 1 ? '#CDCDCE' : '' }" class="plan-content">
      {{ taskInfo.title }}
    </div>
    <div class="outExport" @mouseenter="showExportBox" @mouseleave="closeExportBox"
         @click.stop="isShowExportBox = true">
      <div class="option">
        <el-icon>
          <MoreFilled/>
        </el-icon>
      </div>
      <div v-show="isShowExportBox" class="exportBox jus-end-center">
        <div class="opt-btn" @click.stop="handleEdit"><img :src="editIcon" alt="编辑" class="table-icon"/></div>
        <div class="del-btn" @click.stop="handleDelete"><img :src="deleteIcon" alt="删除" class="table-icon"/></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {ElMessageBox} from 'element-plus';
import editIcon from "@/assets/webp/edit.webp";
import deleteIcon from "@/assets/webp/delete.webp";

const props = defineProps(['taskInfo'])
const emits = defineEmits(['optEdit', 'optDelete', 'changeStatus'])

let isShowExportBox = ref(false)

// 展示操作选项窗口
const showExportBox = () => {
  isShowExportBox.value = true
}
// 隐藏操作选项窗口
const closeExportBox = () => {
  isShowExportBox.value = false
}

// 修改计划任务状态
const changeTaskStatus = () => {
  emits('changeStatus', props.taskInfo)
}

const handleEdit = () => {
  emits('optEdit', props.taskInfo)
}

const handleDelete = () => {
  ElMessageBox.confirm('该计划任务将实时移除，请确认是否删除', '', {
    cancelButtonText: '取消',
    confirmButtonText: '确认',
    center: false,
    closeOnClickModal: false,
    autofocus: false,
    type: 'warning',
  }).then(() => {
    emits('optDelete', props.taskInfo)
  }).catch(() => {
    console.log('已取消')
  })

}
</script>

<style lang="scss" scoped>
.plan-item-container {
  gap: 12px;
  padding: 4px 0 0 10px;
  background-color: #F4F8FC;
  border-radius: 8px;
  margin-bottom: 12px;

  .el-radio {
    margin-right: 0;
  }

  .plan-content {
    width: calc(100% - 80px);
    user-select: none;
    margin-top: -1px;
  }

  .outExport {
    position: relative;

    .option {
      width: 24px;
      height: 24px;
      line-height: 28px;
      text-align: center;
      color: #000;
      font-size: 12px;
      gap: 2px;
      border-radius: 3px;
      cursor: pointer;
    }

    .exportBox {
      position: absolute;
      top: 25px;
      right: 0;
      z-index: 20;
      border: 1px solid #E9F1FF;
      padding: 0 12px 0 0;
      display: flex;
      gap: 2px;
      background-color: #FFF;
      border-radius: 4px;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.11);

      .opt-btn {
        cursor: pointer;
        background-color: #FFF;
      }

      .del-btn {
        cursor: pointer;
        background-color: #FFF;
      }

      .del-btn:hover {
        opacity: 0.8;
      }
    }
  }
}

/* 让 checkbox 整体表现得像 el-radio */
.radio-like-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.radio-like-checkbox :deep(.el-checkbox__inner) {
  border-radius: 50%;
  background: #fff;
  box-sizing: border-box;
  border: 2px solid #999;
}

.radio-like-checkbox.is-checked :deep(.el-checkbox__inner) {
  border-radius: 50%;
  background: #fff;
  box-sizing: border-box;
  border: 2px solid var(--el-color-primary);
}

.radio-like-checkbox.is-checked :deep(.el-checkbox__inner:after) {
  border: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--el-color-primary);
  top: 2px;
  left: 2px;
  transform: none;
}

</style>