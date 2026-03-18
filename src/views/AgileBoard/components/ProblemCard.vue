<template>
  <div class="task-card-content">
    <div class="jus-start-center title-content">
      <div class="card-title ellipsis">{{ problemInfo.name }}</div>
    </div>
    <div class="jus-bet-center">
      <div class="jus-start-center">
        <div :class="{ 'p0': problemInfo.priority == 'P0', 'p1': problemInfo.priority == 'P1', 'p2': problemInfo.priority == 'P2', 'p3': problemInfo.priority == 'P3', 'p4': problemInfo.priority == 'P4', 'p5': problemInfo.priority == 'P5' }"
             class="tags1-fix">
          {{ problemInfo.priority }}
        </div>
        <div class="task-type">{{ problemInfo.categoryName }}</div>
        <div class="task-status">{{ problemInfo.statusName }}</div>
      </div>
      <div class="outExport" @mouseenter="showExportBox" @mouseleave="closeExportBox"
           @click.stop="isShowExportBox = true">
        <div class="option">
          <el-icon>
            <MoreFilled/>
          </el-icon>
        </div>
        <div v-show="isShowExportBox" class="exportBox jus-bet-center">
          <div class="opt-btn" @click.stop="handleEdit">编辑</div>
          <div class="del-btn" @click.stop="handleDelete">删除</div>
        </div>
      </div>
    </div>
    <div class="gap-line"></div>
    <div class="jus-bet-center">
      <div class="card-date">预计解决时间：{{ problemInfo.expectedResolveDate ?? '-' }}</div>
      <div class="card-user">{{ problemInfo.assigneeByName }}</div>
    </div>
    <div class="line"></div>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const emits = defineEmits(['opearteEditFn', 'opearteDeleteFn'])
const props = defineProps(['problemInfo'])

const taskPriority = ref('medium')
const taskPriorityName = ref('中')
const taskType = ref('功能测试')
const taskStatus = ref('修复中')
const endTime = ref('2025-09-19')
const userName = ref('刘莉莉')

let isShowExportBox = ref(false)

// 展示导出选项窗口
const showExportBox = () => {
  isShowExportBox.value = true
}
// 隐藏导出选项窗口
const closeExportBox = () => {
  isShowExportBox.value = false
}

const handleEdit = () => {
  emits('opearteEditFn', 'edit', props.problemInfo)
}

const handleDelete = () => {
  emits('opearteDeleteFn', props.problemInfo.id)
}

</script>

<style lang="scss" scoped>
.task-card-content {
  position: relative;
  width: 100%;
  background-color: #FFF;
  border-radius: 8px;
  padding: 16px;
  //border: 1px solid #DFDFDF;
  //box-shadow: 0px 4px 4px 0px rgba(0, 40, 87, 0.08);
  user-select: none;
  cursor: pointer;
  overflow: hidden;

  .title-content {
    width: 100%;
    margin-bottom: 12px;
  }

  .card-title {
    margin-left: 4px;
    font-size: 16px;
    color: #333;
    font-weight: 600;
  }

  .user-story {
    margin-bottom: 12px;
    width: 100%;
    font-size: 14px;
    color: #888;
  }

  .task-type {
    margin-left: 8px;
    padding: 0 8px;
    height: 22px;
    line-height: 22px;
    border-radius: 4px;
    background-color: #eef3fc;
    color: #637291;
    font-size: 12px;
  }

  .task-status {
    margin-left: 8px;
    padding: 0 8px;
    height: 22px;
    line-height: 22px;
    border-radius: 4px;
    background-color: #eef3fc;
    color: #637291;
    font-size: 12px;
  }

  .gap-line {
    width: 100%;
    height: 1px;
    margin: 5px 0;
  }

  .card-date {
    color: #999;
    font-size: 12px;
  }

  .card-user {
    position: relative;
    color: #999;
    font-size: 12px;

    &:before{
      content: '';
      display: block;
      width: 14px;
      height: 14px;
      margin-right: 4px;
      background: url(@/assets/webp/person.webp) no-repeat;
      background-size: 100%;
      position: absolute;
      left: -18px;
      top: 2px;
    }
  }

  .outExport {
    position: relative;
    top:-48px;
    right: -10px;

    .option {
      width: 24px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      background-color: #fff;
      color: #000;
      font-size: 24px;
      gap: 2px;
      border-radius: 3px;
      cursor: pointer;
    }

    .exportBox {
      position: absolute;
      top: 25px;
      right: 0;
      z-index: 20;
      width: 60px;
      border: 1px solid #E9F1FF;
      display: flex;
      gap: 2px;
      background-color: #FFF;
      border-radius: 4px;
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.11);
      flex-direction: column;

      .opt-btn {
        cursor: pointer;
        padding: 5px 10px;
        color: #2173F7;
        font-size: 12px;
        background: transparent;
      }

      .del-btn {
        cursor: pointer;
        color: #999;
        font-size: 12px;
        padding: 5px 10px;
        background: transparent;
      }

      .del-btn:hover {
        opacity: 0.8;
      }
    }
  }

  .line {
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: #f53f3f;
  }

  .ellipsis {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>