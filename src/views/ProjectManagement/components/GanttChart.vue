<template>
  <div class="ed-page">
    <vxe-radio-group size="mini" v-model="viewMode" @change="changeViewEvent">
      <vxe-radio-button checked-value="4" content="日"></vxe-radio-button>
      <vxe-radio-button checked-value="3" content="周"></vxe-radio-button>
      <vxe-radio-button checked-value="2" content="月"></vxe-radio-button>
      <vxe-radio-button checked-value="1" content="季"></vxe-radio-button>
    </vxe-radio-group>
    <vxe-gantt v-bind="ganttOptions"></vxe-gantt>
  </div>
</template>
<script setup>
import {onBeforeMount, reactive, ref} from 'vue'

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
  taskBarConfig: {
    showProgress: true,
  },
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
  data: props.data
})

onBeforeMount(() => {
  if (!props.data || props.data.length === 0) return false
  const startTimes = props.data.map(item => new Date(item.startDate).getTime())
  const endTimes = props.data.map(item => new Date(item.endDate).getTime())

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
  changeViewEvent({value: viewMode.value})
})

const changeViewEvent = () => {
  switch (viewMode.value) {
    case '1':
      taskViewConfig.scales = ['year', 'quarter']
      break;
    case '2':
      taskViewConfig.scales = ['year', 'month']
      break;
    case '3':
      taskViewConfig.scales = ['year', 'month', 'week']
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

  .vxe-radio-group{
    margin-top: -100px;
    margin-left: 130px;
  }

  .vxe-gantt{
    margin-top: -20px;
  }
}

:deep(.vxe-gantt-view--chart-bar) {
  height: 15px;
}
</style>