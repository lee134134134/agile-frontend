<template>
  <div class="todo_reminder_content">
    <div class="header-content jus-bet-center">
      <div class="todo-title">待办任务提醒</div>
      <el-icon class="close-icon" color="#666" size="18" @click="handleClose">
        <closeBold/>
      </el-icon>
    </div>
    <div class="remind-content">
      <div v-for="(item, index) in remindInfo" :key="index" class="remind-item jus-bet-center">
        <!-- <div>您有<span class="remind-count">4</span>条<span class="remind-module">迭代管理</span>事件，请及时处理！</div> -->
        <div class="todo-text" v-html="item.todoMsg"></div>
        <div class="new-opt-btn border-btn" @click="handleProcess(item.jumpLink, item)">立即处理</div>
      </div>
    </div>
    <div class="footer-content jus-bet-center">
      <div>
        <el-checkbox :key="notRemindAgain" v-model="notRemindAgain" label="今日不再提醒"></el-checkbox>
      </div>
      <div class="jus-end-center gap12">
        <div class="new-opt-btn border-btn" @click="handleLater">稍后处理</div>
        <div class="new-opt-btn fill-btn" @click="handleClose">关闭</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {dealNow} from "@/api/api.js";

const router = useRouter()
const props = defineProps(['remindInfo'])
const emits = defineEmits(['optClose', 'optLater'])
const notRemindAgain = ref(false)

const handleProcess = async (url, obj) => {
  emits('optClose', false)
  const res = await dealNow(obj.records.map(item=>({...item,createTime:''})))
  if(res.success) router.push(url)
}

// 关闭
const handleClose = () => {
  emits('optClose', notRemindAgain.value)
}

// 稍后处理
const handleLater = () => {
  emits('optLater')
}

</script>

<style lang="scss" scoped>
.todo_reminder_content {
  position: relative;
  width: 360px;
  background-color: #FFF;
  box-shadow: 0px 2px 15px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  .gap12 {
    gap: 12px;
  }

  .new-opt-btn {
    flex-shrink: 0;
    height: 24px;
    padding: 2px 9px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
  }

  .new-opt-btn:hover {
    opacity: 0.8;
  }

  .border-btn {
    background-color: #FFF;
    border: 1px solid var(--el-color-primary);
    color: var(--el-color-primary);
  }

  .fill-btn {
    background-color: var(--el-color-primary);
    border: 1px solid var(--el-color-primary);
    color: #FFF;
  }

  .header-content {
    padding: 16px 16px 5px;
    background-color: #FFF;

    .todo-title {
      font-size: 16px;
      color: #333;
      font-weight: bold;
    }

    .close-icon {
      cursor: pointer;
    }

  }

  .remind-content {
    height: 292px;
    overflow: auto;
    padding: 0 16px 50px;

    .remind-item {
      gap: 12px;
      padding: 11px 0;
      border-bottom: 1px solid rgba(226, 228, 232, 0.5);
      color: #666;

      .remind-count {
        color: var(--el-color-primary);
      }

      .remind-module {
        color: #333;
        font-weight: bold;
      }

      .todo-text {
        width: calc(100% - 80px);
      }
    }
  }

  .footer-content {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #FFF;
    padding: 13px 16px;

  }

  /* 整个滚动条 */
  ::-webkit-scrollbar {
    width: 8px;
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

}
</style>