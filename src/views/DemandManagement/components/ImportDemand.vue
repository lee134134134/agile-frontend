<template>
    <el-upload ref="uploadRef" action="#" :auto-upload="false" :show-file-list="false" @change="uploadChangeFunc"
        :on-exceed="handleExceedFunc" :accept="accept">
        <div class="opt-btn" :loading="uploadingFile">
          <img :src="importIcon" alt="导入" class="btn-icon" />
          <span>导入需求</span>
        </div>
    </el-upload>
</template>
<script setup>
/**
 * 组件名称：ImportDemand
 * @description 导入需求组件，支持Excel文件导入功能
 * @module ImportDemand
 * @version 1.0.0
 */
import { ref, reactive, onMounted, nextTick, h } from 'vue';
import { ElMessage, ElMessageBox, ElButton } from 'element-plus';
import { demandImport } from '@/api/demand.js';

/** 导入图标资源 */
import importIcon from '@/assets/webp/import.webp';
const emits = defineEmits(['reloadFn'])
const uploadingFile = ref(false)
// 上传
const accept = ref(['excel', 'xlsx', 'xls'])
const uploadChangeFunc = (file, fileList) => {
    const fileTypeFlag = /^.xlsx|.xls|$&/.test(file.name.substring(file.name.lastIndexOf('.')).toLowerCase())
    if (!fileTypeFlag) {
        ElMessage({
            message: "仅支持xlsx或xls格式！",
            type: 'warning',
        })
        return
    }
    if (file.size > 1024 * 1024 * 20) {
        ElMessage({
            message: "文件大小不能超过20MB！",
            type: 'warning',
        })
        return
    }
    let formData = new FormData();
    formData.append("file", file.raw);
    uploadingFile.value = true;
    demandImport(formData).then(res => {
        if (res.success) {
            if (res.data.success) {
                handleShowResult(res.data.successMsg)
                emits('reloadFn')
            } else {
                ElMessage.error(res.data.message)
            }
        } else {
            ElMessage.error(res.msg)
        }

    }).finally(() => {
        uploadingFile.value = false;
    });
}

const handleShowResult = (tableData) => {
  ElMessageBox({
    title: '导入成功',
    showConfirmButton: true,
    confirmButtonText: '确认',
    // 使用 customClass 方便在 style 中精准定位
    customClass: 'custom-import-box',
    // 隐藏默认的 icon（如果有的话）
    type: '', 
    // 使用 h 函数构建中间的表格内容
    message: h('div', { class: 'import-table-wrapper' }, [
      // 表头
      h('div', { class: 'table-header' }, [
        h('span', '项目名称'),
        h('span', '新增需求')
      ]),
      // 列表内容
      ...tableData.map(item => h('div', { class: 'table-row' }, [
        h('span', { class: 'item-name' }, item.projectName),
        h('span', { class: 'item-count' }, item.count)
      ]))
    ]),
  }).catch(() => {
    // 处理取消/关闭弹窗的逻辑
  })
}

// 处理文件超限
const handleExceedFunc = (files, uploadFiles) => {
    ElMessage({
        message: "文件最多只能上传1个！",
        type: 'warning',
    })
    return false;
};
</script>
<style lang="scss" scoped>
/**
 * 导入按钮图标样式
 * @description 设置导入按钮图标尺寸为12x12像素
 */
.btn-icon {
    width: 12px;
    height: 12px;
    /**
     * 图标与文字间距
     * @description 使用margin-right实现图标与文字间距4px
     */
    margin-right: 4px;
    flex-shrink: 0;
}

.opt-btn {
    display: flex;
    align-items: center;
    margin-left: 0;
    padding: 5px 12px 5px 12px;
    cursor: pointer;
    border-radius: 4px;
    transition: opacity 0.2s;

    /**
     * 导入按钮悬停效果
     */
    &:hover {
        background-color: rgba(33, 115, 247, 0.9);
    }
}
</style>