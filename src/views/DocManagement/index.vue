<template>
  <div class="demand-main">
    <el-tabs v-model="activeTab" class="custom-tabs">
      <el-tab-pane label="项目文档管理" name="1">
        <docManage v-if="activeTab == '1'"></docManage>
      </el-tab-pane>
      <el-tab-pane label="知识库管理" name="2">
        <knowledgeIndex v-if="activeTab == '2'"></knowledgeIndex>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import {onBeforeMount, ref} from 'vue';
import {getDicDefaultVal} from '@/utils';
import docManage from './docIndex.vue';
import knowledgeIndex from './knowledgeIndex.vue';
import {getDicList} from '@/api/api.js';
import {useDicStore} from '@/stores/dic.js';
import {useRoute} from 'vue-router';

const router = useRoute();
const dicStore = useDicStore()
const activeTab = ref("1")
const getDicListFn = async (code) => {
  await getDicList(code).then(res => {
    if (res.success) {
      switch (code) {
        case 'KB_DOC_TYPE':
          dicStore.knowDocTypeList = res?.data ?? []
          dicStore.defaultKnowDocType = getDicDefaultVal(res.data)
          break;
        case 'KB_DOC_STATUS':
          dicStore.knowDocStatusList = res?.data ?? []
          dicStore.defaultKnowDocStatus = getDicDefaultVal(res.data)
          break;
        case 'KB_DOC_VISIBILITY':
          dicStore.knowDocVisList = res?.data ?? []
          dicStore.defaultKnowDocVis = getDicDefaultVal(res.data)
          break;
      }
    }
  })
}

onBeforeMount(async () => {
  activeTab.value = router.query?.active ?? "1"
  await getDicListFn('KB_DOC_TYPE')
  await getDicListFn('KB_DOC_STATUS')
  await getDicListFn('KB_DOC_VISIBILITY')
})

</script>
<style lang="scss" scoped>
.demand-main {
  padding: 12px 20px 20px;
  background: #f6f8fc;
  height: 100%;

  // ------------------------ Tab 样式修改开始 ------------------------
  .custom-tabs {
    // 1. 隐藏自带的底部灰色长线
    :deep(.el-tabs__nav-wrap::after) {
      display: none;
    }

    // 2. 隐藏 Element Plus 默认的蓝色滑动条 (因为它宽度是跟随文字的，不好强制设为32px)
    :deep(.el-tabs__active-bar) {
      display: none;
    }

    // 3. 自定义 Tab Item 样式
    :deep(.el-tabs__item) {
      font-size: 14px;
      height: 38px;
      line-height: 28px;
      color: #333; // 默认颜色，可根据需要调整
      font-weight: normal;
      margin-right: 36px;
      padding: 0; // 控制间距
      position: relative; // 为伪元素定位做准备

      // 选中状态下的样式
      &.is-active {
        font-weight: 600;
        color: var(--el-color-primary); // 保持主题色，通常是蓝色

        // 使用伪元素画出 32px 的短线
        &::after {
          content: '';
          position: absolute;
          bottom: 0; // 贴底
          left: 50%; // 居中
          transform: translateX(-50%); // 修正居中偏移
          width: 32px; // 【关键】固定宽度
          height: 2px; // 【关键】固定高度
          background-color: var(--el-color-primary); // 线条颜色跟随主题色
          border-radius: 1px; // 可选：让线条稍微圆润一点
        }
      }
    }
  }

  // ------------------------ Tab 样式修改结束 ------------------------

}
</style>