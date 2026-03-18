<template>
  <div class="watermark-container" ref="parentRef">
    <slot></slot>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import useWaterMarkBg from '@/utils/watermarkbg.js';
const props = defineProps({
  text: {
    type: String,
    default: "版权所有"
  },
  fontSize: {
    type: Number,
    default: 20,
  },
  gap: {
    type: Number,
    default: 70,
  },
  color: {
    type: String,
    default: 'rgba(201, 35, 35, 0.1)'
  }
})



let div;
const bg = useWaterMarkBg(props);
const parentRef = ref();

const ob = new MutationObserver((entries) => {
  for (const entry of entries) {
    for (const node of entry.removedNodes) {
      if (node === div) {
        resetWatermark();
        return;
      }
    }
    if (entry.target === div) {
      resetWatermark();
    }
  }
})

onMounted(() => {
  resetWatermark();
  ob.observe(parentRef.value, {
    childList: true,
    subtree: true,
    attributes: true,
  })
})

onUnmounted(() => {
  ob.disconnect();
})

// 重置水印
const resetWatermark = () => {
  if (!parentRef.value) { return }
  if (div) {
    div.remove();
  }
  const { base64, size } = bg.value.value;
  div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.backgroundImage = `url(${base64})`;
  div.style.backgroundSize = `${size.width}px ${size.height}px`;
  div.style.backgroundRepeat = "repeat";
  div.style.pointerEvents = 'none';
  div.style.zIndex = '9999';
  div.style.inset = 0;
  parentRef.value.appendChild(div);
}

</script>
<style scoped lang="scss">
.watermark-container {
  position: relative;
}
</style>
 