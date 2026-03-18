<template>
  <div class="page-todo">
    <div class="tab-content jus-bet-center">
      <div class="jus-start-center">
        <div :class="activeTab == 1 ? 'tab-btn-active' : 'tab-btn'" class="btn-margin" @click="activeTab = 1">待办任务
        </div>
        <div :class="activeTab == 2 ? 'tab-btn-active' : 'tab-btn'" @click="activeTab = 2">计划任务</div>
      </div>
      <div class="see-more jus-bet-center">
        <!-- 查看更多
        <el-icon><ArrowRight /></el-icon> -->
      </div>
    </div>
    <div v-if="activeTab == 1" class="tip-content"> 您有 {{ todoList.length }} 项待办事项需要处理</div>
    <div v-if="activeTab == 1 && todoList.length > 0" class="todo-list-content">
      <div v-for="item in todoList" :key="item.todoId" class="todo-item jus-bet-center gap18">
        <div
            :class="{ 'p0': item.todoLevel == 'P0', 'p1': item.todoLevel == 'P1', 'p2': item.todoLevel == 'P2', 'p3': item.todoLevel == 'P3', 'p4': item.todoLevel == 'P4', 'p5': item.todoLevel == 'P5' }"
            class="vertical-line"></div>
        <div>
          <div class="jus-start-center">
                        <span
                            :class="{ 'p0': item.todoLevel == 'P0', 'p1': item.todoLevel == 'P1', 'p2': item.todoLevel == 'P2', 'p3': item.todoLevel == 'P3', 'p4': item.todoLevel == 'P4', 'p5': item.todoLevel == 'P5' }"
                            class="tags1-fix">
                            {{ item.todoLevel }}
                        </span>
            <div class="module-tag">{{ item.moduleName }}</div>
            <div v-if="item.todoTitle.length < 13" class="item-title">{{ item.todoTitle }}</div>
            <el-tooltip v-else :content="item.todoTitle" :popper-style="{'max-width': '400px'}" effect="dark"
                        placement="top">
              <div class="item-title">{{ item.todoTitle.slice(0, 12) + '...' }}</div>
            </el-tooltip>
          </div>
          <div class="item-detail">
                        <span v-if="item.todoText?.length <= 44">
                            {{ cleanRichTextLike(item.todoText) }}
                        </span>
            <el-tooltip v-else :popper-style="{'max-width': '400px'}" effect="dark"
                        placement="top">
              <div v-if="item.todoText">{{ cleanRichTextLike(item.todoText).slice(0, 44) + '...' }}</div>
              <template #content>
                <div v-html="item.todoText"></div>
              </template>
            </el-tooltip>
          </div>
        </div>
        <div class="new-opt-btn border-btn" @click="handleProcess(item.jumpLink,item)">立即处理</div>
      </div>
    </div>
    <div v-if="activeTab == 1 && todoList.length == 0">
      <EmptyDia :type="'zwsj'"></EmptyDia>
    </div>
    <div v-if="activeTab == 2" class="plan-task-content">
      <PlanTask :planList="planList" @getPlanTaskList="getPlanTaskListFn"/>
    </div>
  </div>
</template>
<script setup>
import {onMounted, ref} from 'vue';
import EmptyDia from '@/components/EmptyDia.vue'
import PlanTask from './PlanTask.vue'
import {dealNow, getPlanTaskList, getTodoList} from '@/api/api.js'
import {useRouter} from 'vue-router'

const router = useRouter()
const todoLevel = ref('P0')
const activeTab = ref(1)
let hourTimer = null // 定时刷新列表
let qickTimer = null // 列表无数据隔几秒再次调用
const todoList = ref([])
const planList = ref([]) // 计划任务列表

const getTodoListFn = () => {
  getTodoList().then(res => {
    if (res.success) {
      todoList.value = res.data
    }
  })
}

const handleProcess = async (url, obj) => {
  const res = await dealNow([{
    ...obj,
    createTime: ""
  }])
  if (res.success) router.push(url)
}

// 清洗数据
function cleanRichTextLike(str) {
  let s = str.replaceAll(/<\s*br\s*\/?\s*>/gi, "\n").replaceAll(/<\s*\/\s*br\s*>/gi, "\n")
  s = s.replaceAll("<", "\"").replaceAll(">", "\"")
  return s
}

// 计划任务列表查询
const getPlanTaskListFn = (val) => {
  let params = {
    status: (val == '0' || val == '1') ? val : undefined
  }
  getPlanTaskList(params).then(res => {
    if (res.success) {
      planList.value = res.data
    }
  })
}

onMounted(async () => {
  getTodoListFn()
  hourTimer = setInterval(() => {
    getTodoListFn()
  }, 30 * 60 * 1000)
  getPlanTaskListFn('2')
})

</script>
<style lang="scss" scoped>
.page-todo {
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  width: 100%;
  height: 100%;


  .gap18 {
    gap: 18px;
  }

  .new-opt-btn {
    height: 29px;
    padding: 4px 13px;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    flex-shrink: 0;
    user-select: none;
  }

  .new-opt-btn:hover {
    opacity: 0.8;
  }

  .border-btn {
    background-color: #FFF;
    border: 1px solid var(--el-color-primary);
    color: var(--el-color-primary);
  }

  .tags1-fix {
    width: 22px;
    height: 20px;
    padding: 0;
    border-radius: 2px;
    text-align: center;
    line-height: 20px;
    font-size: 12px;
    color: #fff;

    &.p0 {
      background: #f70000;
    }

    &.p1 {
      background: #f70000;
    }

    &.p2 {
      background: #ff7d00;
    }

    &.p3 {
      background: #fabf12;
    }

    &.p4 {
      background: #a1acbf;
    }

    &.p5 {
      background: #a1acbf;
    }
  }

  .tab-content {

    .btn-margin {
      margin-right: 36px;
    }

    .tab-btn {
      color: #666;
      font-family: 'Microsoft YaHei', 'PingFang SC';
      cursor: pointer;
      padding: 8px 0;
    }

    .tab-btn-active {
      color: #333;
      font-weight: 600;
      color: #2d3748;
      font-family: 'Microsoft YaHei', 'PingFang SC';
      cursor: pointer;
      padding: 6px 0;
      border-bottom: 2px solid var(--el-color-primary);
    }

    .see-more {
      cursor: pointer;
      color: var(--el-color-primary);
    }
  }

  .tip-content {
    width: 100%;
    height: 30px;
    background-color: #FDF0E4;
    margin-top: 12px;
    padding: 0 13px;
    border-radius: 4px;
    font-size: 12px;
    color: #8F5D34;
    line-height: 30px;
  }

  .todo-list-content {
    height: calc(100% - 80px);
    overflow-y: auto;
    overflow-x: hidden;

    .todo-item {
      padding: 16px 5px 16px 0;
      border-bottom: 1px solid #E2E4E8;


      .module-tag {
        flex-shrink: 0;
        // width: 64px;
        padding: 0 8px;
        height: 22px;
        margin: 0 8px 0 6px;
        background-color: #E4EEFE;
        border-radius: 2px;
        font-size: 12px;
        color: #10397B;
        line-height: 22px;
        text-align: center;
      }

      .item-title {
        font-size: 14px;
        color: #333;
        font-weight: bold;
      }

      .item-detail {
        width: 320px;
        margin-top: 8px;
        color: #999;
        line-height: 20px;
      }
    }

    .vertical-line {
      width: 2px;
      height: 72px;
      flex-shrink: 0;

      &.p0 {
        background: #f70000;
      }

      &.p1 {
        background: #f70000;
      }

      &.p2 {
        background: #ff7d00;
      }

      &.p3 {
        background: #fabf12;
      }

      &.p4 {
        background: #a1acbf;
      }

      &.p5 {
        background: #a1acbf;
      }
    }

  }

  .plan-task-content {
    height: calc(100% - 38px);
  }


  /* 整个滚动条 */
  ::-webkit-scrollbar {
    width: 4px;
    /* 宽度 */
    height: 4px;
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
    // display: none;
  }

  /* 滚动条的滑块：鼠标悬停时 */
  ::-webkit-scrollbar-thumb:hover {
    background: #e9e9e9;
    /* 颜色 */
  }
}


</style>