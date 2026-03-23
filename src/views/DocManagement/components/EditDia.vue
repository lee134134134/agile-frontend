<template>
  <el-dialog v-model="editShow" :show-close="false" fullscreen style="background: #f7fafc;" @close="handleClose">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">编辑文档</div>
        </div>
        <div class="opt-content jus-flex-start">
          <div class="opt-btn btn-margin-right" @click="handleSubmit(1)">保存</div>
          <div v-show="typeval == 2" class="opt-btn" @click="handleClose">关闭</div>
        </div>
      </div>
    </template>
    <div class="dia-main">
      <div class="head-left">
        <el-tooltip :content="diaForm.docName" effect="dark" popper-class="fix-tooltip" placement="top-start">
          <el-text class="doc-title" truncated>{{ diaForm.docName }}</el-text>
        </el-tooltip>

        <el-tooltip content="每5分钟自动保存内容" effect="dark" popper-class="fix-tooltip" placement="top">
          <div v-show="diaForm.date" class="info-text">
            <el-icon class="info-text-icon" size="14px" style="padding-top:2px">
              <CircleCheck/>
            </el-icon>
            <!-- 最新保存时间： -->
            {{ diaForm.date }}
          </div>
        </el-tooltip>
        <div v-show="typeval == 2" class="opt-text" @click="isHistoryShow = !isHistoryShow">当前版本</div>
      </div>
      <div class="main-container jus-bet-start">
        <div v-show="isHistoryShow" class="container-left">
          <div class="left-title">历史版本</div>
          <div class="left-list">
            <div v-for="item in historyList" :key="item.id" class="list-item jus-bet-center">
              <div class="version-time">{{ item.updatedAt }}</div>
              <div class="item-btn jus-bet-center">
                <div class="btn-primary btn-margin-right" @click="openFile(item.id)">查看</div>
                <div class="btn-circle" @click="resetFn(item.id)">还原</div>
              </div>
            </div>
          </div>
        </div>
        <div v-loading="loadingMark" class="container-right">
          <CanvasEditor v-if="showMark" ref="editorRef" :info="fileContent" @confirmSaveFn="saveDocx">
          </CanvasEditor>
          <!-- <MarkDownEdit v-if="showMark" ref="editorRef" :type="typeval" :baseInfo="fileContent"></MarkDownEdit> -->
        </div>
      </div>
      <el-dialog v-model="isFileShow" :show-close="false" align-center width="908px" @close="isFileShow = false">
        <template #header="{ close }">
          <div class="dia-header  jus-bet-center">
            <div style="color: #333;font-size: 16px;font-weight: 600;">{{ diaForm.docName }}</div>
            <el-icon class="dia-header-close" color="#333" size="16px" @click="close">
              <Close/>
            </el-icon>
          </div>
        </template>
        <div class="dia-main file-dia-mian">
          <!-- <VueOfficeDocx :src="pdfSrc"></VueOfficeDocx> -->
          <iframe :src="pdfSrc + '#navpanes=1&toolbar=0'" class="iframe-main"
                  frameborder="0" style="width:100%;height: calc(100vh - 101px)"></iframe>
        </div>
      </el-dialog>
    </div>
  </el-dialog>
</template>
<script setup>
import {onBeforeUnmount, onMounted, reactive, ref, watch} from 'vue';
// import CanvasEditor from '../../canvas-editor/index.vue';
import {CircleCheck} from '@element-plus/icons-vue';
import CanvasEditor from './CanvasEditor.vue';
// import htmlToPdf from '@/utils/pdf.js';
import {getHistoryDocFn, getHistoryFileInfo, getPdfFile} from '@/api/docManage.js';
import '@vue-office/docx/lib/index.css'
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const props = defineProps(['type', 'isShow', 'info']);
const emits = defineEmits([
  'closeDiaFn',
  'confirmFn', 'confirmAutoFn', 'confirmSaveHFn'])
const editShow = ref(props.isShow ?? false)
const typeval = ref(props.type ?? false)
const isHistoryShow = ref(false)
const diaForm = reactive({
  docName: '',
  date: '',
  templateId: '',
  documentCode: ''
})
const loadingMark = ref(true)
const editorRef = ref(null)
const fileContent = ref('')
const autoSave = ref(null)
const isFileShow = ref(false)
const pdfSrc = ref('')
const showMark = ref(false)
const historyList = ref([])
const optType = ref('1')
const resetId = ref('')
watch(() => props.type, (newName) => {
  typeval.value = newName
}, {immediate: true});
watch(() => props.info, (newvalue) => {
  diaForm.docName = newvalue.fileName
  fileContent.value = newvalue.fileContent ?? ''
  diaForm.templateId = newvalue.templateId
  diaForm.documentCode = newvalue.documentCode
  loadingMark.value = false
  showMark.value = true
  if (diaForm.documentCode) {
    getHistoryListFn()
  }
}, {immediate: true});
watch(() => props.info.date, (newName) => {
  diaForm.date = newName
}, {immediate: true});
const handleClose = () => {
  editShow.value = false
  emits('closeDiaFn')
}
const openFile = (data) => {
  let params = {
    documentCode: '',
    id: data,
    format: 'pdf',
    watermark: '0',
  }
  getPdfFile(params).then(res => {
    // let blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    // let url = URL.createObjectURL(blob);
    let blob = new Blob([res], {type: 'application/pdf'});
    let url = window.URL.createObjectURL(blob);
    pdfSrc.value = url;
    isFileShow.value = true
  })
}
const handleCloseViewsDia = () => {
  fileViewsContent.value = ''
  isFileShow.value = false
}
const handleSubmit = (type, code) => {
  optType.value = type
  editorRef.value.handleSaveContent()
}
const handleFileOpt = (code) => {
  getHistoryFileInfo(code).then(res => {
    fileContent.value = res ? res : ''
    loadingMark.value = false
    showMark.value = true
  })
  getHistoryListFn()
}

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type: mime});
}

const resetFn = (id) => {
  loadingMark.value = true
  showMark.value = false
  resetId.value = id
  handleSubmit(3)
}

function getHistoryListFn() {
  let params = {
    documentCode: diaForm.documentCode
  }
  getHistoryDocFn(params).then(res => {
    if (res.success) {
      historyList.value = res.data
    }
  })
}

const saveAsPdf = async () => {
  // 1. 创建一个临时容器来渲染 HTML
  const editorElement = document.querySelector('.ce-page-container');
  if (!editorElement) return;
  // 2. 将 HTML 转为 Canvas
  // scale 提高清晰度
  const canvas = await html2canvas(editorElement, {
    scale: 2,
    useCORS: true, // 允许跨域图片
  });
  const imgData = canvas.toDataURL('image/png');
  // 3. 计算 PDF 页面大小
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  // 4. 核心区别：获取 Blob 对象
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  return pdf.output('blob')
};

const saveDocx = async (htmlContent) => {
  loadingMark.value = true
  let name = encodeURIComponent(diaForm.docName + '.docx')
  let namePdf = encodeURIComponent(diaForm.docName + '.pdf')
  let blob = new Blob([JSON.stringify(htmlContent.baseValue)], {type: 'text/markdown'})
  let file = new File([blob], diaForm.docName + '.md')
  let pdfBlob = await saveAsPdf()
  let wrdFile = new File([htmlContent.converd], name)
  let pdfFile = new File([pdfBlob], namePdf)
  let formData = new FormData();
  formData.append("word", wrdFile)
  formData.append("file", file);
  formData.append("pdf", pdfFile);
  formData.append("templateId", diaForm.templateId);
  if (optType.value == '1') {
    formData.append("saveType", '1');
    emits('confirmFn', formData)
    loadingMark.value = false
    return
  }
  if (optType.value == '2') {
    formData.append("saveType", '2');
    emits('confirmAutoFn', formData)
    getHistoryListFn()
    loadingMark.value = false
    return
  }
  if (optType.value == '3') {
    formData.append("saveType", '1');
    emits('confirmSaveHFn', {'params': formData, 'code': resetId.value})
    loadingMark.value = false
    return
  }
}

onMounted(() => {
  autoSave.value = setInterval(() => {
    handleSubmit(2)
  }, 5 * 60 * 1000)
})

onBeforeUnmount(() => {
  clearInterval(autoSave.value)
  autoSave.value = null
})
defineExpose({
  handleFileOpt,
  getHistoryListFn
});
</script>
<style lang="scss" scoped>
.dia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;

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

  .opt-btn {
    padding: 5px 15px;
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
  padding: 0 15px 10px 15px;

  .opt-text {
    margin-left: 15px;
    cursor: pointer;
    color: #7ca7ec;
    font-size: 14px;
    padding: 2px 5px;
    border: 1px solid #bdd1f3;
    border-radius: 4px;
  }

  .head-left {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .doc-title {
      max-width: 50%;
      margin-right: 15px;
      font-family: 'Microsoft YaHei', 'PingFang SC';
      font-size: 16px;
      font-weight: 600;
      color: #333;
      text-align: left;
    }
  }

  .main-container {
    background: #fff;
    margin-top: 10px;
    width: 100%;
    border-radius: 8px;

    .container-left {
      padding: 20px 10px 20px 10px;
      width: 512px;
      background: #f0f5fc;
      border-radius: 8px;

      .left-title {
        font-size: 16px;
        color: #232323;
        font-weight: 600;
        margin-bottom: 10px;
      }

      .left-list {
        height: calc(100vh - 220px);
        padding-right: 20px;
        margin-right: 0px;
        overflow-y: auto;

        .list-item {
          margin: 10px 0;
          padding: 15px 10px;
          background: #fff;
          border-radius: 8px;

          .btn-primary {
            width: 50px;
            height: 28px;
            line-height: 28px;
            font-size: 12px;
            border-radius: 4px;
          }

          .btn-circle {
            width: 50px;
            height: 28px;
            line-height: 28px;
            font-size: 12px;
            border-radius: 4px;
          }
        }
      }
    }

    .container-right {
      position: relative;
      background: #fff;
      width: 100%;
      height: calc(100vh - 150px);
    }
  }
}

.file-dia-mian {
  height: 90vh;
  overflow-y: auto;
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

.info-text {
  font-size: 12px;
  margin-top: 3px;

  .info-text-icon {
    vertical-align: -2px;
  }
}
</style>