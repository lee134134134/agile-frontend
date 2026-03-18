<template>
  <el-tooltip
    :content="content"
    :disabled="!isOverflow"
    :placement="placement"
    :effect="effect"
  >
    <div
      ref="textRef"
      class="auto-tooltip-container"
      :style="{ '-webkit-line-clamp': line }"
      @mouseenter="checkOverflow"
    >
      <slot>{{ content }}</slot>
    </div>
  </el-tooltip>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  content: { type: String, default: '' },
  placement: { type: String, default: 'top' },
  effect: { type: String, default: 'dark' },
  line: { type: Number, default: 1 } // 默认单行省略，可传入数字实现多行
})

const textRef = ref(null)
const isOverflow = ref(false)
let observer = null

// 核心检测函数
const checkOverflow = () => {
  const el = textRef.value
  if (!el) return
  
  // 对于单行：比较宽度；对于多行：比较高度
  const isHorizontalOverflow = el.scrollWidth > el.clientWidth
  const isVerticalOverflow = el.scrollHeight > el.clientHeight
  
  isOverflow.value = isHorizontalOverflow || isVerticalOverflow
}

onMounted(() => {
  // 监听容器大小变化，自动更新省略状态
  if (textRef.value) {
    observer = new ResizeObserver(() => {
      checkOverflow()
    })
    observer.observe(textRef.value)
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style lang="scss" scoped>
.auto-tooltip-container {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  /* 默认单行，通过 props.line 控制 */
  -webkit-line-clamp: 1; 
  /* 确保块级显示以触发宽度计算 */
  width: 100%;
}
</style>