<template>
  <el-dialog v-model="confirmDiaShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"
             :width="width" class="edit-dia" @close="handleClose">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">{{ title }}</div>
        </div>
        <el-icon class="dia-header-close" size="16px" @click="close">
          <Close/>
        </el-icon>
      </div>
    </template>
    <div class="dia-main">
      <div class="dia-main-content">
        <slot name="infoContent"></slot>
      </div>
      <div class="dia-footer jus-flex-end">
        <div v-show="isCanCleShow" class="btn-cancel" @click="handleClose">取消</div>
        <div class="btn-submit" @click="handleSubmit">确认</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import {ref, watch} from 'vue';
import {Close} from '@element-plus/icons-vue'

const props = defineProps(['title', 'isShow', 'diaWidth', 'isCanCle']);
const emits = defineEmits([
  'closeDiaFn',
  'confirmFn'])
const confirmDiaShow = ref(props.isShow ?? false)
const title = ref(props.title || '提示')
const width = ref(props.diaWidth || '460px')
const isCanCleShow = ref(props.isCanCle || true)
watch(() => props.title, (newName) => {
  title.value = newName
});
watch(() => props.diaWidth, (newName) => {
  width.value = newName
});
watch(() => props.isCanCle, (newName) => {
  isCanCleShow.value = newName
}, {immediate: true});
const handleClose = () => {
  confirmDiaShow.value = false
  emits('closeDiaFn')
}
const handleSubmit = () => {
  confirmDiaShow.value = false
  emits('confirmFn')
}
</script>
<style lang="scss" scoped>
.dia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px 0;

  .dia-header-title {
    display: flex;
    align-items: center;

    .title-icon {
      margin-right: 10px;
      width: 4px;
      height: 20px;
      background: #2173F7;
      border-radius: 2px 2px 2px 2px;
    }

    .title-text {
      font-family: PingFang SC;
      font-weight: 600;
      font-size: 16px;
      color: #1D1D1D;
      line-height: 22px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }

  .dia-header-close {
    cursor: pointer;

    svg {
      width: 1.5em;
      height: 1.5em;
    }
  }
}

.dia-main {
  // padding-bottom: 50px;
  // padding-left: 50px;
  // padding-right: 50px;
  // .dia-main-content{
  //     margin-bottom: 60px;
  // }
  .dia-footer {
    .btn-cancel {
      width: auto;
      margin-right: 12px;
      height: 28px;
      line-height: 28px;
      padding: 0 16px;
      font-size: 12px;
    }

    .btn-submit{
      width: auto;
      height: 28px;
      line-height: 28px;
      padding: 0 16px;
      font-size: 12px;
    }
  }
}
</style>