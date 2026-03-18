<template>
  <el-dialog v-model="showDrawer" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" class="edit-dia" height='340px'
             width="640px" @close="handleClose">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">编辑</div>
        </div>
        <el-icon class="dia-header-close" size="16px" @click="close">
          <Close/>
        </el-icon>

      </div>
    </template>
    <div class="dia-main">
      <el-form ref="detailFromRef" :model="detailFrom" :rules="detailRule" class="dia-main-content"
               label-position="right" label-width="90px">
        <el-form-item label="名称" prop="title">
          <el-input v-model="detailFrom.title" clearable maxlength="20" placeholder="请输入设计图名称"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="detailFrom.description" clearable maxlength="200" placeholder="请输入描述"
                    type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="detailFrom.version" clearable maxlength="20" placeholder="请输入版本"></el-input>
        </el-form-item>
        <el-form-item label="评审状态" prop="status">
          <el-radio-group v-model="detailFrom.status">
            <el-radio v-for="item in statusList" :key="item.value" :label="item.value">{{
                item.name
              }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="detailFrom.status !== 'pending'" label="评审意见" prop="reviewComment">
          <el-input v-model="detailFrom.reviewComment" clearable maxlength="100" placeholder="请输入评审意见"
                    type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div class="dia-footer jus-end-center">
        <div class="btn-cancel" @click="handleClose">取消</div>
        <div class="btn-submit" @click="handleSubmit">确认</div>
      </div>

    </div>

  </el-dialog>
</template>
<script setup>
import {onBeforeMount, reactive, ref, watch} from 'vue';
import {isValidVersion} from "@/utils/index.js";

const props = defineProps(['isShow', 'detailInfo', 'statesList']);
const emits = defineEmits([
  'closeDiaFn',
  'editConfirmFn'])
const showDrawer = ref(props.isShow ?? false)
const detailFromRef = ref(null)
const detailFrom = reactive({
  id: null,
  title: '',
  status: '',
  version: '',
  description: '',
  reviewComment: '',
  commentId: '',
})
const statusList = ref(props.statesList ?? [])
watch(() => props.statesList, (newName) => {
  statusList.value = newName
}, {immediate: true})
const checkVersion = (rule, value, callback) => {
  if (value == '') {
    return callback(new Error('请输入版本！'))
  } else if (!isValidVersion(value)) {
    return callback(new Error('您输入的版本格式不正确，请按照提示格式输入'))
  } else {
    return callback()
  }
}
const detailRule = {
  title: [
    {required: true, message: '请输入名称', trigger: 'blur'},
    {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
  ],
  version: [{required: true, validator: checkVersion, trigger: 'blur'}],
  status: [{required: true, message: '请选择评审状态', trigger: 'change'}]
}
const isEdit = ref(false)
const handleClose = () => {
  showDrawer.value = false
  emits('closeDiaFn')
}

const handleSubmit = () => {
  if (detailFromRef.value) {
    detailFromRef.value.validate((valid) => {
      if (valid) {
        if (detailFrom.status == 'pending') {
          delete detailFrom.reviewComment
        }
        emits('editConfirmFn', detailFrom)
      }
    })
  }
}
onBeforeMount(() => {
  detailFrom.id = props.detailInfo.id
  detailFrom.title = props.detailInfo.title
  detailFrom.status = props.detailInfo.status
  detailFrom.version = props.detailInfo.version
  detailFrom.description = props.detailInfo.description
  detailFrom.reviewComment = props.detailInfo.reviewComment
  detailFrom.commentId = props.detailInfo.commentId
})
</script>
<style lang="scss">
.edit-dia {
  box-shadow: 0px 2px 15px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  .dia-main {
    // padding: 0 48px;
    .dia-main-content {
      // max-height: calc(70vh - 165px);
      // padding: 0 5px;
      // overflow: auto;

      .el-form-item--label-right .el-form-item__label {
        font-weight: 400 !important;
        font-size: 14px;
        color: #333;
      }


    }
  }


}
</style>
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
  }

  .title-text {
    font-family: PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: #333333;
    line-height: 22px;
    text-align: left;
    font-style: normal;
    text-transform: none;
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
  // padding-bottom: 8px;
  :deep(.el-textarea__inner) {
    min-height: 88px !important;
    max-height: 200px !important;
  }

  :deep(.el-input) {
    --el-input-border-color: #cccccc !important;
  }


}

.dia-footer {
  padding: 0 5px;

  .btn-cancel {
    width: 76px;
    height: 28px;
    line-height: 25px;
    margin-right: 12px;
    border-radius: 4px;
    border: 1px solid #999;
  }

  .btn-cancel:hover {
    border: 1px solid #316af6;
  }

  .btn-submit {
    width: 76px;
    height: 28px;
    line-height: 25px;
    border-radius: 4px;
  }
}
</style>