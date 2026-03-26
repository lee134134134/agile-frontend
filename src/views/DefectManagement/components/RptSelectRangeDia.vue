<template>
  <el-dialog v-model="diaShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" class="edit-dia"
             width="950px" @close="handleClose">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">已选报告生成范围</div>
        </div>
        <el-icon class="dia-header-close" size="16px" @click="close">
          <Close/>
        </el-icon>
      </div>
    </template>
    <div class="dia-main">
      <el-form ref="dataFormRef" :model="dataForm" class="dia-main-content" label-position="right" label-width="110px">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="选择项目" prop="projectId">
              <div class="sel-opt-text"> {{ dataForm.project }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="选择迭代" prop="sprintId">
              <div class="select-area">
                <div v-for="item in dataForm.sprint" :key="item" class="sel-opt-text"> {{ item }}</div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="选择用户故事" prop="storyId">
              <div class="select-area">
                <div v-for="item in dataForm.story" class="sel-opt-text"> {{ item }}</div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dia-footer">
        <div v-if="!canDownLoad" class="tip-line jus-center">
          <el-icon color="#FF7700">
            <WarningFilled/>
          </el-icon>
          <div v-if="type !== 'dashboard'">{{ tipText }}</div>
          <div v-else>
            <span style="font-weight: 600;">报告正生成中</span>
            关闭此窗口将中断生成过程，请务必等待完成
          </div>
        </div>
        <div v-if="type !== 'dashboard'" class="jus-flex-end mt18">
          <div class="del-btn" @click="handleCancel">取消生成报告</div>
          <div :class="{'opt-btn-disabled': !canDownLoad}" class="opt-btn" @click="handleDownload">下载</div>
        </div>
        <div v-else class="jus-flex-end mt18">
          <div class="del-btn close-btn" @click="handleClose">关闭</div>
          <div :class="{'opt-btn-disabled': !canDownLoad}" class="opt-btn" @click="handleViewDashboard">查看</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import {onMounted, reactive, ref, watch} from 'vue';
import {Close} from '@element-plus/icons-vue';
import {useDicStore} from '@/stores/dic.js';

const dicStore = useDicStore()

const props = defineProps(['isShow', 'detailInfo', 'tip', 'type']);
const emits = defineEmits(['closeDiaFn', 'confirmFn', 'cancelFn'])
const diaShow = ref(props.isShow ?? false)

const dataFormRef = ref(null)
const dataForm = reactive({
  project: '',
  sprint: '',
  story: '',
})

const canDownLoad = ref(false) //  是否可下载
const tipText = ref(props.tip || '文件生成中，窗口关闭后系统将在后台继续处理，您可重新打开本弹窗查看进度并下载')

const handleDownload = () => {
  if (!canDownLoad.value) return
  if (dataFormRef.value) {
    dataFormRef.value.validate((valid) => {
      if (valid) {
        emits('confirmFn', props.detailInfo.id)
      }
    })
  }
}

const handleCancel = () => {
  emits('cancelFn', props.detailInfo.id)
}

// 查看报告
const handleViewDashboard = () => {
  if (!canDownLoad.value) return
  if (dataFormRef.value) {
    dataFormRef.value.validate((valid) => {
      if (valid) {
        emits('confirmFn', props.detailInfo)
      }
    })
  }
}

const handleClose = () => {
  emits('closeDiaFn')
}


watch(() => props.detailInfo, (newvalue, oldvalue) => {
  if (props.detailInfo.filePath) {
    canDownLoad.value = true
  } else {
    canDownLoad.value = false
  }
  console.log('canDownLoad.value===', canDownLoad.value)
}, {immediate: true, deep: true})

onMounted(() => {
  dataForm.project = props.detailInfo.project
  dataForm.sprint = props.detailInfo.sprint
  dataForm.story = props.detailInfo.story
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

  .dia-main-content {
    overflow-y: hidden;

    :deep(.el-form-item__content){
      height: auto;
    }

    .sel-opt-text {
      color: #333;
      font-weight: 600;
    }

    .select-area {
      width: 100%;
      max-height: 230px;
      overflow-y: auto;
    }
  }

  .dia-footer {
    border-top: 1px solid #E1E1E1;

    .btn-cancel {
      margin-left: 12px;
    }

    .tip-line {
      margin: 18px 0 0;
      gap: 8px;
      color: #555;
    }

    .mt18 {
      margin-top: 18px;
    }

    .opt-btn-disabled {
      background-color: #ececec;
      cursor: default;
      color: #A4A4A4;

    }

  }

  .opt-btn{
    height: 32px;
    line-height: 32px;
    padding: 0 20px;
    font-size: 14px;
  }

  .del-btn {
    height: 32px;
    line-height: 32px;
    margin-right: 12px;
    cursor: pointer;
    font-size: 14px;
    padding: 0 10px;
    background-color: #FFF;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    color: #555;
    user-select: none;
  }

  .del-btn:hover {
    opacity: 0.8;
  }

  .close-btn {
    padding: 0 16px;
  }

  .module-title {
    width: 100%;
    height: 32px;
    padding-left: 10px;
    box-sizing: border-box;
    line-height: 32px;
    background-color: #EFF7FF;
    font-size: 14px;
    color: #2173F7;
    font-weight: 600;
    margin-bottom: 16px;
  }

  :deep(.el-input) {
    --el-input-height: 28px;
    --el-input-border-color: #DBDDE3;
    --el-input-border-radius: 4px;
    --el-input-padding-left: 10px;
    --el-input-padding-right: 10px;
  }

  :deep(.el-select) {
    height: auto;
    min-height: 28px;
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
</style>