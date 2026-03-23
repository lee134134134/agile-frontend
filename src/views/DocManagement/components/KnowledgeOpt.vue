<template>
  <el-dialog v-model="addShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" class="edit-dia"
             width="650px" @close="handleClose">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">{{ title }}知识文档</div>
        </div>
        <el-icon class="dia-header-close" size="16px" @click="close">
          <Close/>
        </el-icon>
      </div>
    </template>
    <div class="dia-main">
      <el-form ref="detailFromRef" :model="detailFrom" :rules="detailRule" class="dia-main-content"
               label-position="right" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="文档标题" prop="docTitle">
              <el-input v-model="detailFrom.docTitle" :disabled="props.type == '查看'" clearable maxlength="50"
                        placeholder="请输入文档标题"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="文档类型" prop="docType">
              <el-select v-model="detailFrom.docType" :disabled="props.type == '查看'" clearable
                         placeholder="请选择">
                <el-option v-for="item in docTypeList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="props.type != '新增'" :gutter="24">
          <el-col :span="12">
            <el-form-item class="no-rquired" label="文档状态">
              <el-select v-model="detailFrom.docStatus" :disabled="props.type == '查看'" clearable placeholder="请选择">
                <el-option v-for="item in docStatusList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可见性" prop="visibility">
              <el-select v-model="detailFrom.visibility" :disabled="props.type == '查看'" clearable
                         placeholder="请选择">
                <el-option v-for="item in visibilityList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="props.type != '新增'" :gutter="24">
          <el-col :span="24">
            <el-form-item class="no-rquired" label="描述">
              <el-input v-model="detailFrom.description" :disabled="props.type == '查看'" clearable maxlength="300"
                        placeholder="请输入" type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div v-if="props.type != '查看'" class="dia-footer jus-flex-end">
        <div class="btn-cancel" @click="handleClose">取消</div>
        <div class="btn-submit" @click="handleSubmit">确认</div>
      </div>
      <div v-else class="dia-footer jus-flex-end">
        <div class="btn-cancel" @click="handleEdit">编辑</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import {onBeforeMount, reactive, ref, watch} from 'vue';
import {Close} from '@element-plus/icons-vue';
import {useDicStore} from '@/stores/dic.js';

const dicStore = useDicStore()
const props = defineProps(['type', 'isShow', 'detailInfo']);
const emits = defineEmits([
  'closeDiaFn',
  'confirmFn',
  'editConfirmFn'])
const addShow = ref(props.isShow ?? false)
const title = ref(props.type || '新建')
const detailFromRef = ref(null)
const detailFrom = reactive({
  docTitle: '',
  docType: dicStore.defaultKnowDocType,
  docStatus: '',
  visibility: '',
  description: ''
})
const docTypeList = ref(dicStore.knowDocTypeList ?? [])
const docStatusList = ref(dicStore.knowDocStatusList ?? [])
const visibilityList = ref(dicStore.knowDocVisList ?? [])

const detailRule = {
  docTitle: [
    {required: true, message: '请输入文档标题', trigger: 'submit'},
    {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'submit'}
  ],
  docType: [{required: true, message: '请选择文档类型', trigger: 'submit'}],
  visibility: [{required: true, message: '请选择可见性', trigger: 'submit'}],
}

watch(() => props.type, (newName) => {
  title.value = newName
});

const handleClose = () => {
  addShow.value = false
  emits('closeDiaFn')
}

const handleEdit = () => {
  emits('editDiaFn')
}

const handleSubmit = () => {
  if (detailFromRef.value) {
    detailFromRef.value.validate((valid) => {
      if (valid) {
        if (props.type == '新增') {
          emits('confirmFn', detailFrom)
          return
        }
        if (props.type == '编辑') {
          detailFrom.id = props.detailInfo.id
          emits('editConfirmFn', detailFrom)
        }
      }
    })
  }
}

onBeforeMount(async () => {
  if (props.type != '新增') {
    detailFrom.docTitle = props.detailInfo.docTitle
    detailFrom.docType = props.detailInfo.docType
    detailFrom.docStatus = props.detailInfo.docStatus
    detailFrom.visibility = props.detailInfo.visibility
    detailFrom.description = props.detailInfo.description
  }
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
  // padding-bottom: 30px;
  // padding-left: 20px;
  // padding-right: 20px;

  // .dia-main-content {
  //     margin-bottom: 30px;
  // }

  .dia-footer {
    .btn-cancel {
      margin-right: 12px;
    }
  }

  .info-text {
    font-family: 'PingFangSC';
    color: #000;
    font-size: 10px;
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

  .no-rquired {
    :deep(.el-form-item__label) {
      padding-left: 12px !important;
    }
  }
}
</style>