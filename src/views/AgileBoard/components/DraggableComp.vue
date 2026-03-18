<template>
  <div class="drag-comp-content">
    <div class="task-content drag-column">
      <div class="task-status not-start">未开始 <span class="task-tag not-start">{{ list1.length }}</span></div>
      <VueDraggable
          id="vue-drag1"
          v-model="list1"
          :group="{name: 'people'}"
          :sort="false"
          animation="150"
          class="vue-drag task-list"
          ghostClass="ghost"
          @add="onAdd"
      >
        <div v-for="item in list1" :key="item.id" class="item">
          <TaskCard :taskInfo="item" type="notStart" @click="viewTaskDetail(item.taskCode, 'notStart')"/>
        </div>
      </VueDraggable>
    </div>
    <div class="task-content drag-column">
      <div class="task-status progress">进行中 <span class="task-tag progress">{{ list2.length }}</span></div>
      <VueDraggable
          id="vue-drag2"
          v-model="list2"
          :group="{name: 'people'}"
          :sort="false"
          animation="150"
          class="vue-drag task-list"
          ghostClass="ghost"
          @add="onAdd"
      >
        <div v-for="item in list2" :key="item.id" class="item">
          <TaskCard :taskInfo="item" type="progress" @click="viewTaskDetail(item.taskCode, 'progress')"/>
        </div>
      </VueDraggable>
    </div>

    <div class="task-content drag-column">
      <div class="task-status completed">已完成 <span class="task-tag completed">{{ list3.length }}</span></div>
      <VueDraggable
          id="vue-drag3"
          v-model="list3"
          :group="{name: 'people',pull: [false, false, undefined]}"
          animation="150"
          class="vue-drag task-list"
          draggable="''"
          ghostClass="ghost"
          @add="onAdd"
      >
        <div v-for="item in list3" :key="item.id" class="item">
          <TaskCard :taskInfo="item" type="completed" @click="viewTaskDetail(item.taskCode, 'completed')"/>
        </div>
      </VueDraggable>
    </div>
  </div>

  <TaskDetail v-if="isShowDetail" :detailInfo="detailInfo" :isShow="isShowDetail" :type="detailType"
              @closeDiaFn="handleCloseDia" @editConfirmFn="handleEditSubFn"/>

</template>

<script setup>
import {onBeforeMount, ref, watch} from 'vue'
import TaskCard from './TaskCard.vue'
import TaskDetail from './TaskDetail.vue'
import {VueDraggable} from 'vue-draggable-plus'
import {useDicStore} from '@/stores/dic.js';
import {getTaskDetail} from '@/api/agileBoardApi.js';
import {updateTaskList} from '@/api/taskApi.js';

const dicStore = useDicStore()
let props = defineProps(['listNotStart', 'listProgress', 'listCompleted'])
let emits = defineEmits(['getTaskList'])

const list1 = ref([])
const list2 = ref([])
const list3 = ref([])

const isShowDetail = ref(false)
const detailInfo = ref(
    {}
)
const detailType = ref('')

watch(() => props.listNotStart, (nval) => {
  list1.value = nval
}, {immediate: true, deep: true})
watch(() => props.listProgress, (nval) => {
  list2.value = nval
}, {immediate: true, deep: true})
watch(() => props.listCompleted, (nval) => {
  list3.value = nval
}, {immediate: true, deep: true})

const onAdd = (event) => {
  // console.log('add===', event.from.id, event.data , event.to.id)
  // console.log('add===', event.from.className, event.oldDraggableIndex , event.to.className)
  // 调用接口修改拖动数据的状态，传参
  let status = ''
  if (event.to.id == 'vue-drag1') {
    status = 'not_started'
  } else if (event.to.id == 'vue-drag2') {
    status = 'in_progress'
  } else if (event.to.id == 'vue-drag3') {
    status = 'completed'
  }
  let params = {
    taskCode: event.data.taskCode,
    taskStatus: status,
  }
  console.log('params===', params)
  updateTaskList(params).then(res => {
    if (res.success) {

    }
  })
}

const viewTaskDetail = (taskCode, type) => {
  detailType.value = type
  let params = {
    taskCode: taskCode
  }
  // 根据id查询任务详情
  getTaskDetail(params).then(res => {
    detailInfo.value = res.data
    // 打开任务详情弹窗
    isShowDetail.value = true
  })
}

const handleCloseDia = () => {
  isShowDetail.value = false
  detailInfo.value = null
}

const handleEditSubFn = (form) => {
  delete form.storyTitle
  updateTaskList(form).then(res => {
    if (res.success) {
      detailInfo.value = null
      isShowDetail.value = false
      // 刷新任务列表 // 筛选条件不变
      emits('getTaskList')
    }
  })
}


onBeforeMount(async () => {

})

</script>
<style lang="scss" scoped>

.drag-comp-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  gap: 16px;

  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }

  .drag-column {
    flex: 1;
    height: 100%;
    padding: 0;
    box-sizing: border-box;
    border-radius: 8px;
  }

  .vue-drag {
    height: calc(100% - 52px);
    overflow: auto;
  }

  .task-status {
    width: 100%;
    height: 40px;
    line-height: 40px;
    margin-bottom: 12px;
    border-radius: 8px;
    text-align: left;
    font-size: 14px;
    font-weight: 600;
    padding: 0 16px;
  }

  .not-start {
    background-color: #edf1f6;
    color: #727682;
  }

  .progress {
    background-color: #e7f3ff;
    color: #081f62;
  }

  .completed {
    background-color: #d3f2ef;
    color: #074c45;
  }

  .item {
    width: 100%;
    // height: 80px;
    margin-bottom: 12px;
    // background-color: pink;
    // border-radius: 4px;
    // line-height: 80px;
    // text-align: center;
    // user-select: none;
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

.task-tag{
  font-size: 12px;
  font-style: normal;
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50%;
  margin-left: 8px;
  text-align: center;

  &.not-start{
    background: #a6adc4;
    color: #fff;
  }

  &.progress{
    background: #bddbff;
    color: #1952af;
  }

  &.completed{
    background: #a2e5df;
    color: #0f8d5c;
  }
}

.task-list{
  background-color: #f6f8fc;
  padding: 12px;
}
</style>