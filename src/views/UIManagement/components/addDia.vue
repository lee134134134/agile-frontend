<template>
  <el-dialog v-model="addShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" class="edit-dia"
             width="780px" @close="handleClose">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">上传UI图</div>
        </div>
        <el-icon class="dia-header-close" size="16px" @click="close">
          <Close/>
        </el-icon>
      </div>
    </template>
    <div class="dia-main">
      <el-form ref="detailFromRef" :model="detailFrom" :rules="detailRule" class="dia-main-content"
               label-position="right" label-width="100px">
        <el-form-item label="项目节点">
          <el-input v-model="detailFrom.path" disabled></el-input>
        </el-form-item>
        <el-form-item label="设计图名称" prop="title">
          <el-input v-model="detailFrom.title" clearable maxlength="20" placeholder="请输入设计图名称"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="detailFrom.description" clearable maxlength="200" placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="detailFrom.version" clearable maxlength="20" placeholder="请输入版本"></el-input>
        </el-form-item>
        <el-form-item label="选择图片">
          <el-upload ref="uploadRef" v-model:file-list="fileList" :accept="accept" :auto-upload="false" :class="{ disabled: fileList.length >= 1 }"
                     :on-exceed="handleExceed" action="#" class="img-upload" limit="1"
                     list-type="picture-card" @change="uploadChange">
            <template #default>
              <el-icon v-if="fileUrl == ''" class="img-backend">
                <Plus/>
              </el-icon>
            </template>
            <template #file="{ file, index }">
              <div>
                <img :src="file.url" alt="" class="el-upload-list__item-thumbnail">
                <span class="el-upload-list__item-actions">
                                    <span class="el-upload-list__item-preview" @click="handlePicPreview(file)">
                                        <el-icon><zoom-in></zoom-in></el-icon>
                                    </span>
                                    <span class="el-upload-list__item-delete" @click="handleRemove(index)">
                                        <el-icon>
                                            <Delete/>
                                        </el-icon>
                                    </span>
                                </span>
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="dia-footer jus-flex-end">
        <div class="btn-cancel" @click="handleClose">取消</div>
        <div class="btn-submit" @click="handleSubmit">确认</div>
      </div>
    </div>
    <el-dialog v-model="showImageView" :show-close="false" @close="showImageView = false">
      <template #header="{ close }">
        <div class="dia-header">
          <div class="dia-header-title">
          </div>
          <el-icon class="dia-header-close" size="16px" @click="close">
            <Close/>
          </el-icon>
        </div>
      </template>
      <div class="jus-center" style="margin:20px 0">
        <img :src="fileUrl" alt="" w-full>
      </div>

    </el-dialog>
  </el-dialog>
</template>

<script setup>
import {onBeforeMount, reactive, ref} from 'vue';
import {Close} from '@element-plus/icons-vue';
import {isValidVersion} from "@/utils/index.js";
import {ElMessage} from 'element-plus';
import {uploadUIImage} from '@/api/UIManagerApi.js'

const props = defineProps(['isShow', 'detailInfo']);
const emits = defineEmits([
  'closeDiaFn',
  'confirmFn',])
const addShow = ref(props.isShow ?? false)
const detailFromRef = ref(null)
const detailFrom = reactive({
  moduleId: '',
  path: '',
  title: '',
  description: '',
  version: '1.0.0',
  commentId: ''
})
const uploadRef = ref(null)
const accept = ref(['png', 'jpg', 'jpeg', 'GIF', 'svg'])
const fileUrl = ref('')
const fileList = ref([])
const showImageView = ref(false)
const checkVersion = (rule, value, callback) => {
  if (value == '') {
    return callback(new Error('请输入版本'))
  } else if (!isValidVersion(value)) {
    return callback(new Error('您输入的版本格式不正确，请按照提示格式输入'))
  } else {
    return callback()
  }
}
const detailRule = {
  title: [
    {required: true, message: '请输入名称', trigger: 'submit'},
    {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'submit'}
  ],
  version: [{required: true, validator: checkVersion, trigger: 'submit'}],
}
const handleClose = () => {
  addShow.value = false
  emits('closeDiaFn')
}
const handleSubmit = () => {
  if (detailFromRef.value) {
    detailFromRef.value.validate((valid) => {
      if (valid) {
        if (detailFrom.commentId) {
          let params = {
            "moduleId": detailFrom.moduleId,
            "title": detailFrom.title,
            "description": detailFrom.description,
            "version": detailFrom.version,
            "commentId": detailFrom.commentId
          }
          emits('confirmFn', params)
        } else {
          ElMessage.warning('请先上传UI图！')
        }

      }
    })
  }
}
const handleExceed = (files, uploadFiles) => {
  ElMessage({
    message: "文件最多只能上传1个！",
    type: 'warning',
  })
  return
}
// 移除附件
const handleRemove = (index) => {
  fileUrl.value = ''
  fileList.value.splice(index, 1)
}

// 上传
async function uploadChange(_file, _fileList) {
  const fileTypeFlag = /^.png|.jpg|.jpeg|.gif|.svg|$&/.test(_file.name.substring(_file.name.lastIndexOf('.')).toLowerCase())
  if (!fileTypeFlag) {
    ElMessage({
      message: "文件仅支持png,jpg,jpeg,gif,svg等格式！",
      type: 'warning',
    })
    fileUrl.value = ''
    return
  }
  if (_file.size > 1024 * 1024 * 100) {
    ElMessage({
      message: "文件大小不能超过100MB！",
      type: 'warning',
    })
    fileUrl.value = ''
    return
  }
  let fileItem = {'originName': _file.name, 'fileSize': _file.size};
  let formData = new FormData();
  formData.append("file", _file.raw);
  uploadUIImage(formData).then(res => {
    if (res.success) {
      fileUrl.value = URL.createObjectURL(_file.raw)
      detailFrom.commentId = res.data.id
    } else {
      fileUrl.value = ''
      fileList.value = []
    }
  })
}

const handlePicPreview = (file) => {
  showImageView.value = true
}
onBeforeMount(async () => {
  detailFrom.moduleId = props.detailInfo.moduleId
  detailFrom.path = props.detailInfo.path
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
  // padding-bottom: 8px;
  // padding-left: 20px;
  // padding-right: 20px;

  .dia-main-content {
    margin-bottom: 16px;
    padding: 0 5px;
    overflow: auto;
  }

  .dia-footer {
    padding: 0 5px;

    .btn-submit {
      width: 76px;
      height: 30px;
      line-height: 28px;
      border-radius: 4px;
    }

    .btn-cancel {
      width: 76px;
      height: 30px;
      line-height: 28px;
      border-radius: 4px;
      margin-right: 12px;
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

// .img-upload {
//     border: 1px dashed var(--el-border-color);
//     border-radius: 4px;
//     cursor: pointer;
//     position: relative;
//     overflow: hidden;
//     transition: var(--el-transiton-duration-fast);
// }

// .img-upload:hover {
//     border-color: var(--el-color-primary);
// }

// .img-backend {
//     font-size: 28px;
//     color: #8c939d;
//     width: 178px;
//     height: 178px;
//     text-align: center;
// }
:deep(.disabled) {
  .el-upload--picture-card {
    display: none !important;
  }

}
</style>