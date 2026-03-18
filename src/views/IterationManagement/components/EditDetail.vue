<template>
  <el-dialog v-model="addShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" class="edit-dia"
             width="500px" @close="handleClose">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">编辑用户故事</div>
        </div>
        <el-icon class="dia-header-close" size="16px" @click="close">
          <Close/>
        </el-icon>
      </div>
    </template>
    <div class="dia-main">
      <el-form ref="detailFromRef" :model="detailFrom" class="dia-main-content"
               label-position="right" label-width="60px">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="故事点" prop="storyPoints">
              <el-select v-model="detailFrom.storyPoints" placeholder="请选择">
                <el-option v-for="item in dicStore.storyPointOptions" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="status">
              <el-select v-model="detailFrom.status" placeholder="请选择">
                <el-option v-for="item in dicStore.storyStatusOptions" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="优先级" prop="priority">
              <el-select v-model="detailFrom.priority" placeholder="请选择">
                <el-option v-for="item in dicStore.priorityList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="负责人" prop="userName">
              <el-select v-model="detailFrom.userName" clearable placeholder="请选择">
                <el-option v-for="item in userOptions" :key="item.userAccount" :label="item.userName"
                           :value="item.userAccount"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dia-footer jus-flex-end">
        <div class="btn-cancel" @click="handleClose">取消</div>
        <div class="btn-submit" @click="handleSubmit">保存</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import {Close} from '@element-plus/icons-vue';
import {useDicStore} from '@/stores/dic.js';

const dicStore = useDicStore()
const props = defineProps(['type', 'isShow', 'storyInfo', 'userOptions']);
const emits = defineEmits([
  'closeDiaFn',
  'confirmFn',
  'editConfirmFn'])
const addShow = ref(props.isShow ?? false)
const detailFromRef = ref(null)
let detailFrom = reactive({})


const handleClose = () => {
  addShow.value = false
  emits('closeDiaFn')
}
const handleSubmit = () => {
  if (detailFromRef.value) {
    detailFromRef.value.validate((valid) => {
      if (valid) {
        // console.log('detailFrom======', detailFrom)
        emits('editConfirmFn', detailFrom)
      }
    })
  }
}

onMounted(() => {
  let obj = {
    sprintId: props.storyInfo.sprintId,
    userStoryId: props.storyInfo.userStoryId,
    storyPoints: props.storyInfo.storyPoints,
    status: props.storyInfo.status || dicStore.defaultStoryStatus,
    priority: props.storyInfo.priority || dicStore.defaultPriority,
    userName: props.storyInfo.userName,
  }
  Object.assign(detailFrom, obj)
})

</script>
<style lang="scss" scoped>
.dia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px 20px;

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
      font-size: 18px;
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

  .dia-footer {
    gap: 12px;

    .btn-cancel {
      margin-left: 12px;
    }
  }

  :deep(.el-input) {
    --el-input-height: 28px;
    --el-input-border-color: #DBDDE3;
    --el-input-border-radius: 4px;
    --el-input-padding-left: 10px;
    --el-input-padding-right: 10px;
  }

  :deep(.el-select__wrapper) {
    min-height: 28px;
    border-radius: 4px;
  }

  :deep(.el-textarea) {
    --el-input-border-color: #DBDDE3;
    --el-input-border-radius: 4px;
    --el-input-padding-left: 10px;
    --el-input-padding-right: 10px;

    .el-textarea__inner {
      height: 88px !important;
    }
  }

  :deep(.el-form-item__label) {
    color: #555 !important;
    font-weight: 400 !important;
  }
}
</style>