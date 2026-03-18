<template>
  <div class="task-card-content">
    <div class="card-title ellipsis">{{ taskInfo.taskName }}</div>
    <div class="user-story ellipsis">{{ taskInfo.storyTitle }}</div>
    <div class="jus-start-center">
      <div :class="{ 'high': taskInfo.taskPriority == 'high', 'middle': taskInfo.taskPriority == 'medium', 'low': taskInfo.taskPriority == 'low' }"
           class="tags1-fix">
        {{ taskInfo.taskPriorityName }}
      </div>
      <div class="task-type">{{ taskInfo.taskTypeName }}</div>
      <div v-if="taskInfo.estimatedHours" class="hour">{{ taskInfo.estimatedHours }} 小时</div>
    </div>
    <div class="gap-line"></div>
    <div class="jus-bet-center">
      <div class="card-date">截止日期：{{ taskInfo.endDate }}</div>
      <div class="card-user">{{ taskInfo.leader }}</div>
    </div>
    <div :class="{'line1': type == 'notStart', 'line2': type == 'progress', 'line3': type == 'completed'}"
         class="line"></div>
  </div>
</template>

<script setup>

const props = defineProps(['type', 'taskInfo'])


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
  overflow: hidden;
  user-select: none;
  cursor: pointer;

  .card-title {
    margin-bottom: 8px;
    width: 100%;
    font-size: 16px;
    color: #333;
    font-weight: 600;
  }

  .user-story {
    margin-bottom: 10px;
    width: 100%;
    font-size: 14px;
    color: #666;
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

  .hour {
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

  .line {
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
  }

  .line1 {
    background-color: #8d99ab;
  }

  .line2 {
    background-color: #2173f7;
  }

  .line3 {
    background-color: #44b490;
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