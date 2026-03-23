<template>
  <el-dialog v-model="addShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"
             class="edit-dia"
             width="700px" @close="handleClose">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">{{ title }}项目文档</div>
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
            <el-form-item label="文档标题" prop="documentTitle">
              <el-input v-model="detailFrom.documentTitle" :disabled="props.type == '查看'" clearable maxlength="50"
                        placeholder="请输入文档标题"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="所属项目" prop="projectCode">
              <el-select v-model="detailFrom.projectCode" :disabled="props.type == '查看'" clearable
                         placeholder="请选择"
                         @change="handleModel">
                <el-option v-for="item in projectList" :key="item.projectId" :label="item.name"
                           :value="item.projectId"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="no-rquired" label="功能模块">
              <el-cascader v-model="detailFrom.module" :disabled="!detailFrom.projectCode || props.type == '查看'"
                           :loading="modelListLoad"
                           :options="modelList" :props="defaultProps" :reserve-keyword="false" clearable
                           filterable
                           placeholder="请选择功能模块" style="width:100%"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="6">
          <el-col :span="12">
            <el-form-item label="版本" prop="versionNumber">
              <el-input v-model="detailFrom.versionNumber" :disabled="props.type == '查看'" clearable
                        placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div class="info-text">
              <el-popover :teleported="false" :width="200" placement="right">
                <template #reference>
                  <el-icon color="#ff7d00">
                    <InfoFilled></InfoFilled>
                  </el-icon>
                </template>
                <template #default>
                  <section class="info-dia-text-content">
                    <div class="info-dia-text-title">版本说明</div>
                    <div class="info-dia-text">主版本号：不兼容的重大更新</div>
                    <div class="info-dia-text">次版本号：向后兼容的功能新增</div>
                    <div class="info-dia-text">修订号：向后兼容的问题修复</div>
                  </section>
                </template>
              </el-popover>
              格式：主版本号.次版本号.修订号
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item class="no-rquired" label="标签">
              <el-input v-model="detailFrom.tags" :disabled="props.type == '查看'" clearable maxlength="100"
                        placeholder="请用逗号分隔多个标签"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item class="no-rquired" label="版本说明">
              <el-input v-model="detailFrom.versionDescription" :disabled="props.type == '查看'" clearable
                        maxlength="200"
                        placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="props.type != '新增'" :gutter="24">
          <el-col :span="24">
            <el-form-item label="归档状态" prop="archiveStatus">
              <el-select v-model="detailFrom.archiveStatus" :disabled="props.type == '查看'" placeholder="请选择">
                <el-option v-for="item in archivingStatusList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="props.type == '新增'" :gutter="24">
          <el-col :span="24">
            <el-form-item label="选择模板" prop="documentType">
              <el-select v-model="detailFrom.documentType" placeholder="请选择">
                <el-option v-for="item in temTypeList" :key="item.documentType" :label="item.templateName"
                           :value="item.documentType"/>
              </el-select>
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
import {getModelList} from '@/api/demand.js';
import {isValidVersion} from "@/utils/index.js";
import {useDicStore} from '@/stores/dic.js';

const dicStore = useDicStore()
const props = defineProps(['type', 'isShow', 'temList', 'detailInfo']);
const emits = defineEmits([
  'closeDiaFn',
  'confirmFn',
  'editConfirmFn'])
const defaultProps = ref({
  children: 'children',
  label: 'name',
  value: 'id',
  // multiple: true,
  emitPath: false
})
const addShow = ref(props.isShow ?? false)
const title = ref(props.type || '新增')
const detailFromRef = ref(null)
const detailFrom = reactive({
  projectCode: '',
  documentTitle: '',
  module: '',
  versionNumber: '1.0.0',
  versionDescription: '',
  tags: '',
  archiveStatus: '0',
  documentType: ''
})
const modelListLoad = ref(false)
const projectList = ref(dicStore.projectList ?? [])//项目下拉数据
const modelList = ref([])//功能模块下拉列表
const temTypeList = ref([])
const archivingStatusList = ref([
  {
    name: '已归档',
    value: '1'
  }, {
    name: '未归档',
    value: '0'
  }
])
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
  projectCode: [{required: true, message: '请选择所属项目', trigger: 'submit'}],
  documentTitle: [
    {required: true, message: '请输入文档标题', trigger: 'submit'},
    {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'submit'}
  ],
  versionNumber: [{required: true, validator: checkVersion, trigger: 'submit'}],
  archiveStatus: [{required: true, message: '请选择归档状态', trigger: 'submit'}],
  documentType: [{required: true, message: '请选择模板', trigger: 'submit'}]
}

watch(() => props.type, (newName) => {
  title.value = newName
});
watch(() => props.temList, (newName) => {
  temTypeList.value = newName
}, {immediate: true})

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
        detailFrom.projectCode = detailFrom.projectCode == '' ? '' : detailFrom.projectCode
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
const handleModel = async (projectCode) => {
  if (detailFrom.projectCode) {
    modelListLoad.value = true
    detailFrom.module = ''
    await getModelListFn()
  } else {
    detailFrom.module = ''
  }
}
const getModelListFn = async () => {
  let params = {
    projectCode: detailFrom.projectCode
  }
  await getModelList(params).then(res => {
    modelList.value = res?.data ?? []
  })
}
onBeforeMount(async () => {
  if (props.type != '新增') {
    detailFrom.projectCode = props.detailInfo.projectCode
    await handleModel(detailFrom.projectCode)
    detailFrom.module = props.detailInfo.module
    detailFrom.documentTitle = props.detailInfo.documentTitle
    detailFrom.archiveStatus = props.detailInfo.archiveStatus == 0 ? '0' : '1'
    detailFrom.versionNumber = props.detailInfo.versionNumber
    detailFrom.documentType = props.detailInfo.documentTypeCode
    detailFrom.tags = props.detailInfo.tags
    detailFrom.versionDescription = props.detailInfo.versionDescription
  }else{
    detailFrom.projectCode = localStorage.getItem('global_ProjectCode')
    await handleModel()
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

  .dia-main-content {
    margin-bottom: 0;
  }

  .dia-footer {
    .btn-cancel {
      margin-right: 12px;
    }
  }

  .info-text {
    font-family: 'PingFangSC';
    color: #666;
    font-size: 12px;
    line-height: 30px;
    height: 32px;

    .el-icon {
      vertical-align: -2px;
      margin-right: 1px;
      font-size: 12px;
    }

    .info-dia-text-content {
      margin-bottom: 4px;
    }

    .info-dia-text-title {
      margin-bottom: 10px;
      font-weight: bold;
      color: #666;
      font-size: 14px;
    }

    .info-dia-text {
      font-size: 12px;
      color: #666;
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

  .no-rquired {
    :deep(.el-form-item__label) {
      padding-left: 12px !important;
    }
  }
}
</style>