<template>
  <div class="ed-page">
    <vxe-radio-group v-model="viewMode" size="mini" @change="changeViewEvent">
      <vxe-radio-button checked-value="4" content="日"></vxe-radio-button>
      <vxe-radio-button checked-value="3" content="周"></vxe-radio-button>
      <vxe-radio-button checked-value="2" content="月"></vxe-radio-button>
      <vxe-radio-button checked-value="1" content="季"></vxe-radio-button>
    </vxe-radio-group>
    <vxe-gantt v-bind="ganttOptions">
      <template #task-bar="{row}">
        <div class="custom-task-bar" :style="{backgroundColor: row.bgColor}"></div>
      </template>
    </vxe-gantt>
  </div>
</template>

<script setup>
import {onBeforeMount, reactive, ref, watch} from 'vue'

const props = defineProps(['data'])
const viewMode = ref('4')

const taskViewConfig = reactive({
  scales: [
    {type: 'week', titleFormat: 'yyyy-MM', startDay: 1},
    {type: 'day'},
    {type: 'date'}
  ],
  tableStyle: {
    width: 480
  }
})

const ganttOptions = reactive({
  border: true,
  height: "100%",
  taskSplitConfig: {
    enabled: false,
    resize: false,
    showCollapseTableButton: false,
    showCollapseTaskButton: false
  },
  taskViewConfig,
  columns: [
    {field: 'name', title: '迭代名称'},
    {field: 'startDate', title: '迭代开始', width: 100},
    {field: 'endDate', title: '迭代结束', width: 100}
  ],
  data: []
})

const colorCycle = ['#2173f7','#ffb000','#00bea4'];

// 处理数据缩略逻辑
const processData = (rawData) => {
  if (!rawData || rawData.length === 0) return []

  let finalData = rawData.map((item,index) => ({
    ...item,
    bgColor: colorCycle[index % 3]
  }))

  if (finalData.length > 10) {
    const firstFive = finalData.slice(0, 5)
    const lastFive = finalData.slice(-5)
    // 关键：省略行对象不要包含 startDate/endDate 属性，或设为 null
    const ellipsisRow = {
      name: '......',
      startDate: null,
      endDate: null,
      isEllipsis: true,
      progress: 0,
      bgColor: ''
    }
    finalData = [...firstFive, ellipsisRow, ...lastFive]
  }
  return finalData
}

const initGantt = () => {
  if (!props.data || props.data.length === 0) return

  ganttOptions.data = processData(props.data)

  const validDates = props.data.filter(item => item.startDate && item.endDate)
  if (validDates.length > 0) {
    const startTimes = validDates.map(item => new Date(item.startDate).getTime())
    const endTimes = validDates.map(item => new Date(item.endDate).getTime())
    const minStart = Math.min(...startTimes)
    const maxEnd = Math.max(...endTimes)
    const diffDays = (maxEnd - minStart) / (1000 * 60 * 60 * 24)

    if (diffDays > 365) {
      viewMode.value = '2'
    } else if (diffDays > 183) {
      viewMode.value = '3'
    } else {
      viewMode.value = '4'
    }
    changeViewEvent()
  }
}

onBeforeMount(() => {
  initGantt()
})

watch(() => props.data, () => {
  initGantt()
}, {deep: true})

const changeViewEvent = () => {
  switch (viewMode.value) {
    case '1':
      taskViewConfig.scales = [{type: 'year'}, {type: 'quarter'}]
      break;
    case '2':
      taskViewConfig.scales = [{type: 'year'}, {type: 'month'}]
      break;
    case '3':
      taskViewConfig.scales = [{type: 'year'}, {type: 'month'}, {type: 'week'}]
      break;
    case '4':
      taskViewConfig.scales = [
        {type: 'week', titleFormat: 'yyyy-MM', startDay: 1},
        {type: 'day'},
        {type: 'date'}
      ]
      break;
  }
}
</script>

<style lang="scss" scoped>
.ed-page {
  height: 560px;

  .vxe-radio-group {
    margin-top: -100px;
    margin-left: 130px;
    position: relative;
    z-index: 10;
  }

  .vxe-gantt {
    margin-top: -20px;
  }
}

/* 进度条高度调整为 10px */
:deep(.custom-task-bar) {
  height: 10px;
  background-color: transparent;
}

/* 彻底解决 1px 残留：强制隐藏该行在图表区的所有元素 */
:deep(.vxe-gantt-view--chart-custom-bar.is--default) {
 background-color: transparent;
}

/* 针对 vxe-gantt 渲染引擎可能存在的内部 div 进行处理 */
:deep(.vxe-gantt--task-bar-item.bar-hidden-completely) {
  pointer-events: none;
}
</style>