<template>
    <div id="editorContainer" ref="editorRef"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, defineExpose, watch, onBeforeUnmount, nextTick } from 'vue';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/zh-cn';
// import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
// import chart from '@toast-ui/editor-plugin-chart';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
// import '@toast-ui/editor-plugin-table-merged-cell/dist/toastui-editor-plugin-table-merged-cell.css';
// 导入需要的语言高亮支持
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-haml';
import 'prismjs/components/prism-css';
import { ElMessage } from 'element-plus';

const props = defineProps(['type', 'baseInfo']);
const emits = defineEmits(['changeFn'])
let editor = null;
// const markdownEditorref=ref(null);tableMergedCell, chart
const optType = ref('')
const content = ref('')
const editorRef = ref(null)
watch(() => props.type, (newName) => {
    optType.value = newName
});
watch(() => props.baseInfo, (newvalue) => {
    content.value = newvalue
});
const initFn = () => {
    nextTick(() => {
        editor = new Editor({
            el: editorRef.value,//document.querySelector('#editorContainer'),
            height: '100%',
            plugins: [[codeSyntaxHighlight, { highlighter: Prism }], colorSyntax],
            initialEditType: 'wysiwyg',//   ' 'markdown',
            previewStyle: 'tab',
            initialValue: content.value,
            language: 'zh-CN',
            hooks: {
                addImageBlobHook: function (blob, callback) {
                    const maxSize = 100 * 1024
                    if (blob.size > maxSize) {
                        ElMessage.warning('图片大小不能超过100kb!')
                        return
                    }
                    const reader = new FileReader()
                    reader.onload = function (e) {
                        callback(e.target.result)
                    }
                    reader.readAsDataURL(blob)
                }
            }
        })
    })

}
const handleSendMarkContent = () => {
    if (editor) {
        const markdown = editor.getMarkdown()
        return markdown
    }
}
onMounted(async () => {
    if (props.type == '1') {
        initFn()
    } else {
        content.value = props.baseInfo
        initFn()
    }
});

defineExpose({
    handleSendMarkContent
});
onBeforeUnmount(() => {
    if (editor) {
        editor.off('change')
        editor.off('focus')
        editor.destroy()
        editor = null
    }
})
</script>
<style lang="scss" scoped>
#editorContainer {
    :deep(.toastui-editor-popup-color) {
        button {
            top: 53px;
            right: 0;
        }
    }

    :deep(.toastui-editor-popup-body) {
        .tui-colorpicker-palette-hex {
            width: 95px !important;
            height: 32px !important;
        }
    }
}
</style>