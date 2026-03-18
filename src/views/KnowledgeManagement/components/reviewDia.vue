<template>
  <el-dialog v-model="reviewShow" :show-close="false" fullscreen style="background: #f7fafc;">
    <template #header>
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">文章详情 / {{ props.name }}</div>
        </div>
        <div class="opt-content jus-flex-start">
          <div class="opt-btn btn-margin-right" @click="embedPDF()">导出pdf</div>
          <div class="opt-btn" @click.stop="handleClose()">关闭</div>
        </div>
      </div>
    </template>
    <div class="dia-main">
      <!-- <div v-html="pdfSrc"></div> -->
      <iframe :src="pdfSrc + '#navpanes=1&toolbar=0'" class="iframe-main" frameborder="0"
              style="width:100%;height: calc(100vh - 101px)"></iframe>
      <!-- <div></div> -->
      <!-- <VueOfficeDocx :src="pdfSrc" min-height="600px"></VueOfficeDocx> -->
    </div>
  </el-dialog>
</template>
<script setup>
import {ref, watch} from 'vue';
import {checkPdfFile, getPdfFile} from '@/api/docManage.js';
import '@vue-office/docx/lib/index.css'

const props = defineProps(['isShow', 'info', 'name']);
const emits = defineEmits(['closeDiaFn'])
const reviewShow = ref(props.isShow ?? false)
const handleClose = () => {
  reviewShow.value = false
  emits('closeDiaFn')
}
const pdfSrc = ref('')
const documentCode = ref('')
const title = ref('')
watch(() => props.info, (newName) => {
  documentCode.value = newName
  reviewFile()
}, {immediate: true});
watch(() => props.name, (newName) => {
  title.value = newName
}, {immediate: true});

function embedPDF() {
  let params = {
    documentCode: documentCode.value,
    format: 'pdf',
    watermark: '1'
  }
  checkPdfFile({'documentCodes': [documentCode.value]}).then(res => {
    if (res.success) {
      if (res.data && res.data == true) {
        getPdfFile(params).then(res => {
          const blob = new Blob([res], {type: 'application/pdf'});
          let url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${title.value}.pdf`; // 根据实际情况设置下载文件名
          a.click();
          window.URL.revokeObjectURL(url);
        })
      } else {
        ElMessage.warning('PDF生成中，请稍后再试！')
        return
      }
    }
  })
}

function reviewFile() {
  let params = {
    documentCode: documentCode.value,
    format: 'pdf',
    watermark: '0',
  }
  getPdfFile(params).then(res => {
    // const reader = new FileReader()
    // reader.onload = (event) => {
    //     const arrayBuffer = event.target.result;
    //     mammoth.convertToHtml({ arrayBuffer: arrayBuffer }).then(result => {
    //         console.log(result, '--ree')
    //         pdfSrc.value = result.value
    //     }).catch(error => {
    //         console.log(error, '--ree')
    //     })
    // }
    // reader.readAsArrayBuffer(res)
    // const assayBuffer = res.arrayBuffer()
    let blob = new Blob([res], {type: 'application/pdf'});
    let url = window.URL.createObjectURL(blob);
    pdfSrc.value = url;
  })
}

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
      color: #333;
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
  height: calc(100vh - 86px);
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
</style>