<template>
  <div class="demand-main">
    <el-tabs v-model="activeTab">
      <el-tab-pane label="人员任务统计" name="1">
        <PersonStatisticsPage v-if="activeTab == '1'"></PersonStatisticsPage>
      </el-tab-pane>
      <el-tab-pane label="月度任务统计" name="2">
        <MonthStatisticsPage v-if="activeTab == '2'"></MonthStatisticsPage>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import {ref} from 'vue';
import MonthStatisticsPage from './MonthStatisticsPage.vue'
import PersonStatisticsPage from './PersonStatisticsPage.vue'

const activeTab = ref("1")
</script>
<style lang="scss" scoped>
.demand-main {
  padding: 12px 20px 0;
  background: #f6f8fc;
  height: 100%;

  :deep(.el-tabs) {
    .el-tabs__header {
      .el-tabs__nav-wrap:after {
        height: 0;
      }

      .el-tabs__active-bar {
        background-color: transparent !important;
      }

      .el-tabs__item {
        font-family: PingFang;
        font-size: 14px !important;
        height: 38px;
        line-height: 38px;
        color: #727682 !important;
        font-weight: 400 !important;
        padding: 0;
        margin: 0 20px;
      }

      .is-active {
        position: relative;
        color: #2173f7 !important;
        font-weight: 600 !important;

        &:after {
          content: '';
          position: absolute;
          width: 48px;
          height: 2px;
          background-color: #2173f7 !important;
          left: 50%;
          transform: translateX(-50%);
          bottom: 0;
        }
      }
    }

  }

}
</style>